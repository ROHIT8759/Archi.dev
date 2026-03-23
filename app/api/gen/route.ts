import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { Edge, Node } from "@xyflow/react";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
export const runtime = "nodejs";
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite";
const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
type PlannedFile = { path: string; description: string };
type ArchitecturePlan = {
  projectName: string;
  description: string;
  files: PlannedFile[];
};
class QuotaExceededError extends Error {
  retryAfter: number;
  constructor(retryAfter = 60) {
    super("Gemini API free-tier quota exceeded");
    this.name = "QuotaExceededError";
    this.retryAfter = retryAfter;
  }
}
function getApiKeys(): string[] {
  const numbered: string[] = [];
  for (let i = 1; ; i++) {
    const val = process.env[`GEMINI_API_KEY_${i}`]?.trim();
    if (!val) break;
    numbered.push(val);
  }
  if (numbered.length > 0) return numbered;
  const raw = process.env.GEMINI_API_KEY ?? "";
  return raw.split(",").map((k) => k.trim()).filter(Boolean);
}
function getQuotaRetryAfter(error: unknown): number | null {
  const msg = error instanceof Error ? error.message : String(error);
  const hasQuotaMarker =
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes('"code":429') ||
    msg.toLowerCase().includes("quota exceeded") ||
    msg.toLowerCase().includes("rate limit") ||
    msg.toLowerCase().includes("too many requests");
  if (hasQuotaMarker) {
    const m =
      msg.match(/retryDelay["\s:]+?(\d+)s/i) ||
      msg.match(/retry.?after["\s:]+?(\d+)/i) ||
      msg.match(/retry in ([\d.]+)s/i);
    return m ? Math.ceil(Number(m[1])) : 60;
  }
  if (error && typeof error === "object" && "error" in error) {
    const e = (error as { error?: { code?: number; status?: string; details?: Array<{ retryDelay?: string }> } }).error;
    if (e?.code === 429 || e?.status === "RESOURCE_EXHAUSTED") {
      const delay = e.details?.find((d) => d?.retryDelay)?.retryDelay;
      const m = delay?.match(/^(\d+)(?:\.\d+)?s$/);
      return m ? Math.ceil(Number(m[1])) : 60;
    }
  }
  return null;
}
class KeyRotator {
  private readonly cooldowns: number[];
  private counter = 0;
  constructor(private readonly keys: string[]) {
    this.cooldowns = new Array(keys.length).fill(0);
  }
  get length() { return this.keys.length; }
  get availableCount() {
    const now = Date.now();
    return this.cooldowns.filter((t) => t <= now).length;
  }
  async acquire(maxWaitMs = 120_000): Promise<{ key: string; index: number }> {
    const deadline = Date.now() + maxWaitMs;
    while (true) {
      const now = Date.now();
      if (now > deadline) throw new QuotaExceededError(Math.ceil((now - (deadline - maxWaitMs)) / 1000));
      for (let attempt = 0; attempt < this.keys.length; attempt++) {
        const i = this.counter % this.keys.length;
        this.counter++;
        if (this.cooldowns[i] <= Date.now()) {
          return { key: this.keys[i], index: i };
        }
      }
      const soonestCooldown = Math.min(...this.cooldowns);
      const waitMs = Math.max(300, soonestCooldown - Date.now() + 150);
      const remaining = deadline - Date.now();
      if (waitMs > remaining) {
        throw new QuotaExceededError(Math.ceil(waitMs / 1000));
      }
      console.warn(`[gen] All ${this.keys.length} keys cooling. Waiting ${waitMs}ms for Key #${this.cooldowns.indexOf(soonestCooldown) + 1}...`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
  setCooldown(index: number, retryAfterSec: number) {
    const until = Date.now() + retryAfterSec * 1000;
    if (until > this.cooldowns[index]) {
      this.cooldowns[index] = until;
    }
    console.warn(`[gen] Key #${index + 1} cooling for ${retryAfterSec}s`);
  }
}
async function callGemini(
  rotator: KeyRotator,
  prompt: string,
  onRequest?: () => void,
): Promise<string> {
  const maxAttempts = rotator.length * 2;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { key, index } = await rotator.acquire();
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });
      onRequest?.();
      return response.text?.trim() ?? "";
    } catch (error) {
      const retryAfter = getQuotaRetryAfter(error);
      if (retryAfter !== null) {
        rotator.setCooldown(index, retryAfter);
        continue;
      }
      throw error;
    }
  }
  throw new QuotaExceededError(60);
}
async function callGroq(prompt: string, onRequest?: () => void): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");
  const groq = new Groq({ apiKey });
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 8192,
  });
  onRequest?.();
  return completion.choices[0]?.message?.content?.trim() ?? "";
}
function isNetworkError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  const cause = (error as { cause?: { code?: string } })?.cause;
  return (
    msg.toLowerCase().includes("fetch failed") ||
    msg.toLowerCase().includes("connect timeout") ||
    msg.toLowerCase().includes("network") ||
    cause?.code === "UND_ERR_CONNECT_TIMEOUT" ||
    cause?.code === "ECONNRESET" ||
    cause?.code === "ENOTFOUND"
  );
}
async function callAI(
  rotator: KeyRotator,
  prompt: string,
  usedProvider: { value: "gemini" | "groq" },
  onRequest?: () => void,
): Promise<string> {
  try {
    const text = await callGemini(rotator, prompt, onRequest);
    usedProvider.value = "gemini";
    return text;
  } catch (error) {
    if (error instanceof QuotaExceededError || isNetworkError(error)) {
      const reason = error instanceof QuotaExceededError ? "quota exhausted" : "network error";
      console.warn(`[gen] Gemini unavailable (${reason}) — falling back to Groq...`);
      const text = await callGroq(prompt, onRequest);
      usedProvider.value = "groq";
      return text;
    }
    throw error;
  }
}
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
type GenLanguage = "javascript" | "python";
interface GenRequestBody {
  nodes: Node[];
  edges: Edge[];
  language?: GenLanguage;
  techStack?: { frontend?: string; backend?: string; database?: string; deployment?: string };
  metadata?: Record<string, unknown>;
}
function stripMarkdownFences(text: string): string {
  return text.replace(/```[\w]*\n?/g, "").replace(/```/g, "").trim();
}
function extractJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === "\"") {
        inString = false;
      }
      continue;
    }
    if (ch === "\"") {
      inString = true;
      continue;
    }
    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }
  return null;
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function looksLikeFilePath(value: string): boolean {
  return (
    /(^|\/)[^/]+\.[a-z0-9]+$/i.test(value) ||
    /(^|\/)(Dockerfile|README(?:\.md)?|Makefile|Procfile|requirements\.txt|tsconfig\.json|package\.json|\.env(?:\.example)?|\.gitignore)$/i.test(
      value,
    )
  );
}
function joinPlanPath(prefix: string, segment: string): string {
  const cleanPrefix = prefix.replace(/^\/+|\/+$/g, "");
  const cleanSegment = segment.replace(/^\/+|\/+$/g, "");
  if (!cleanPrefix) return cleanSegment;
  if (!cleanSegment) return cleanPrefix;
  return `${cleanPrefix}/${cleanSegment}`;
}
function collectPlanFiles(value: unknown, prefix = ""): PlannedFile[] {
  if (!value) return [];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || !looksLikeFilePath(trimmed)) return [];
    return [
      {
        path: joinPlanPath(prefix, trimmed),
        description: "Generated file planned from AI output.",
      },
    ];
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectPlanFiles(entry, prefix));
  }
  if (!isRecord(value)) return [];

  const directPath =
    typeof value.path === "string"
      ? value.path
      : typeof value.filePath === "string"
        ? value.filePath
        : typeof value.filename === "string"
          ? value.filename
          : typeof value.name === "string" && looksLikeFilePath(value.name)
            ? value.name
            : null;
  if (directPath) {
    const description =
      typeof value.description === "string"
        ? value.description
        : typeof value.purpose === "string"
          ? value.purpose
          : typeof value.responsibility === "string"
            ? value.responsibility
            : "Generated file planned from AI output.";
    return [{ path: joinPlanPath(prefix, directPath), description }];
  }

  const branchName =
    typeof value.name === "string" && !looksLikeFilePath(value.name)
      ? value.name
      : typeof value.path === "string" && !looksLikeFilePath(value.path)
        ? value.path
        : "";
  const nextPrefix = branchName ? joinPlanPath(prefix, branchName) : prefix;
  const nestedKeys = ["files", "children", "items", "entries", "structure", "tree"];
  for (const key of nestedKeys) {
    if (key in value) {
      const collected = collectPlanFiles(value[key], nextPrefix);
      if (collected.length > 0) return collected;
    }
  }

  return Object.entries(value).flatMap(([key, nested]) => {
    if (key === "description" || key === "purpose" || key === "responsibility") return [];
    if (looksLikeFilePath(key)) {
      if (typeof nested === "string") {
        return [{ path: joinPlanPath(prefix, key), description: nested }];
      }
      if (isRecord(nested)) {
        const description =
          typeof nested.description === "string"
            ? nested.description
            : typeof nested.purpose === "string"
              ? nested.purpose
              : "Generated file planned from AI output.";
        return [{ path: joinPlanPath(prefix, key), description }];
      }
      return [{ path: joinPlanPath(prefix, key), description: "Generated file planned from AI output." }];
    }
    return collectPlanFiles(nested, joinPlanPath(prefix, key));
  });
}
function ensureRequiredPlanFiles(files: PlannedFile[], language: GenLanguage): PlannedFile[] {
  const required =
    language === "python"
      ? [
          ["main.py", "FastAPI entry point and application bootstrap."],
          ["requirements.txt", "Pinned Python dependencies for the generated service."],
          [".env.example", "Documented environment variables required to run the service."],
          ["Dockerfile", "Container build definition for deployment."],
          ["README.md", "Setup and run instructions for the generated service."],
        ]
      : [
          ["src/index.ts", "Express server entry point and runtime bootstrap."],
          ["package.json", "Project scripts, dependencies, and runtime metadata."],
          ["tsconfig.json", "TypeScript compiler configuration for the service."],
          [".env.example", "Documented environment variables required to run the service."],
          ["Dockerfile", "Container build definition for deployment."],
          ["README.md", "Setup and run instructions for the generated service."],
        ];
  const map = new Map<string, PlannedFile>();
  for (const file of files) {
    const path = file.path.replace(/^\/+/, "").trim();
    if (!path || path.includes("..")) continue;
    map.set(path, {
      path,
      description: file.description?.trim() || "Generated file planned from AI output.",
    });
  }
  for (const [path, description] of required) {
    if (!map.has(path)) {
      map.set(path, { path, description });
    }
  }
  return Array.from(map.values());
}
function buildFallbackArchitecturePlan(input: {
  nodes: unknown[];
  language: GenLanguage;
}): ArchitecturePlan {
  const nodeCount = input.nodes.length;
  const sharedFiles: PlannedFile[] = [
    {
      path: ".env.example",
      description: "Document required environment variables for local development and deployment.",
    },
    {
      path: "Dockerfile",
      description: "Package the generated backend for deployment.",
    },
    {
      path: "README.md",
      description: "Explain how to install, run, and extend the generated backend.",
    },
  ];
  const files =
    input.language === "python"
      ? [
          {
            path: "main.py",
            description: "FastAPI entry point that wires routes, config, and application startup.",
          },
          {
            path: "app/routes.py",
            description: "Primary HTTP routes generated from the architecture graph.",
          },
          {
            path: "app/services.py",
            description: "Business logic layer coordinating the modeled nodes and flows.",
          },
          {
            path: "requirements.txt",
            description: "Pinned Python dependencies required to run the service.",
          },
          ...sharedFiles,
        ]
      : [
          {
            path: "src/index.ts",
            description: "Express server entry point that wires middleware, routes, and startup.",
          },
          {
            path: "src/routes.ts",
            description: "Primary HTTP routes generated from the architecture graph.",
          },
          {
            path: "src/services/runtime.ts",
            description: "Business logic layer coordinating the modeled nodes and flows.",
          },
          {
            path: "package.json",
            description: "Project scripts, dependencies, and runtime metadata for the generated backend.",
          },
          {
            path: "tsconfig.json",
            description: "TypeScript compiler configuration for the generated backend.",
          },
          ...sharedFiles,
        ];
  return {
    projectName: "generated-project",
    description: `Fallback plan generated from ${nodeCount} architecture node${nodeCount === 1 ? "" : "s"} when AI plan formatting was incomplete.`,
    files: ensureRequiredPlanFiles(files, input.language),
  };
}
function buildFallbackFileContent(input: {
  filePath: string;
  language: GenLanguage;
  description: string;
  plan: ArchitecturePlan;
}): string {
  const p = input.filePath.replace(/^\/+/, "").trim();
  const d = input.description || "Generated fallback content.";
  if (input.language === "python") {
    if (p === "main.py") {
      return [
        "from fastapi import FastAPI",
        "import uvicorn",
        "",
        `app = FastAPI(title=\"${input.plan.projectName}\", version=\"1.0.0\")`,
        "",
        "@app.get(\"/health\")",
        "async def health() -> dict[str, str]:",
        "  return {\"status\": \"ok\"}",
        "",
        "if __name__ == \"__main__\":",
        "  uvicorn.run(app, host=\"0.0.0.0\", port=8000)",
        "",
      ].join("\n");
    }
    if (p === "requirements.txt") {
      return ["fastapi==0.116.1", "uvicorn==0.35.0", "pydantic==2.11.7", ""].join("\n");
    }
    if (p === "README.md") {
      return [
        `# ${input.plan.projectName}`,
        "",
        input.plan.description || "Generated backend project.",
        "",
        "## Run",
        "",
        "1. Install dependencies from `requirements.txt`.",
        "2. Start the service: `python main.py`.",
        "",
      ].join("\n");
    }
  } else {
    if (p === "package.json") {
      return JSON.stringify(
        {
          name: input.plan.projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-") || "generated-project",
          version: "1.0.0",
          private: true,
          scripts: {
            dev: "tsx src/index.ts",
            start: "node dist/index.js",
            build: "tsc",
          },
          dependencies: {
            express: "^4.21.2",
            dotenv: "^16.6.1",
          },
          devDependencies: {
            tsx: "^4.20.6",
            typescript: "^5.9.2",
            "@types/node": "^24.6.0",
            "@types/express": "^5.0.3",
          },
        },
        null,
        2,
      );
    }
    if (p === "tsconfig.json") {
      return JSON.stringify(
        {
          compilerOptions: {
            target: "ES2022",
            module: "CommonJS",
            moduleResolution: "Node",
            rootDir: "src",
            outDir: "dist",
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
          },
          include: ["src"],
        },
        null,
        2,
      );
    }
    if (p === "src/index.ts") {
      return [
        'import "dotenv/config";',
        'import express from "express";',
        "",
        "const app = express();",
        "app.use(express.json());",
        "",
        "app.get(\"/health\", (_req, res) => {",
        "  res.json({ status: \"ok\" });",
        "});",
        "",
        "const port = Number(process.env.PORT ?? 3000);",
        "app.listen(port, () => {",
        "  console.log(`Server running on port ${port}`);",
        "});",
        "",
      ].join("\n");
    }
    if (p === "README.md") {
      return [
        `# ${input.plan.projectName}`,
        "",
        input.plan.description || "Generated backend project.",
        "",
        "## Run",
        "",
        "1. `npm install`",
        "2. `npm run dev`",
        "",
      ].join("\n");
    }
  }
  if (p === ".env.example") {
    return "PORT=3000\n";
  }
  if (p === "Dockerfile") {
    return input.language === "python"
      ? [
          "FROM python:3.12-slim",
          "WORKDIR /app",
          "COPY . .",
          "RUN pip install --no-cache-dir -r requirements.txt",
          'CMD ["python", "main.py"]',
          "",
        ].join("\n")
      : [
          "FROM node:20-alpine",
          "WORKDIR /app",
          "COPY package*.json ./",
          "RUN npm install",
          "COPY . .",
          "RUN npm run build",
          'CMD ["npm", "run", "start"]',
          "",
        ].join("\n");
  }
  const banner =
    input.language === "python"
      ? `\"\"\"${d}\nGenerated as a fallback due to temporary AI output issues.\"\"\"\n`
      : `/**\n * ${d}\n * Generated as a fallback due to temporary AI output issues.\n */\n`;
  return banner;
}
function normalizeArchitecturePlan(
  raw: unknown,
  input: { nodes: unknown[]; language: GenLanguage },
): ArchitecturePlan {
  const projectName =
    isRecord(raw) && typeof raw.projectName === "string" && raw.projectName.trim()
      ? raw.projectName.trim()
      : "generated-project";
  const description =
    isRecord(raw) && typeof raw.description === "string"
      ? raw.description.trim()
      : "";

  const candidateCollections: unknown[] = [];
  if (isRecord(raw)) {
    candidateCollections.push(raw.files);
    candidateCollections.push(raw.plan);
    candidateCollections.push(raw.structure);
    candidateCollections.push(raw.output);
    candidateCollections.push(raw.project);
    candidateCollections.push(raw.fileStructure);
    candidateCollections.push(raw.file_structure);
    candidateCollections.push(raw.tree);
    candidateCollections.push(raw.items);
  }
  candidateCollections.push(raw);

  for (const candidate of candidateCollections) {
    const files = ensureRequiredPlanFiles(collectPlanFiles(candidate), input.language);
    if (files.length > 0) {
      return { projectName, description, files };
    }
  }
  return buildFallbackArchitecturePlan(input);
}
function parseArchitecturePlan(text: string, input: {
  nodes: unknown[];
  language: GenLanguage;
}): ArchitecturePlan {
  const clean = stripMarkdownFences(text);
  const attempts = [clean, extractJsonObject(clean)].filter(
    (candidate): candidate is string => Boolean(candidate && candidate.trim()),
  );
  for (const candidate of attempts) {
    try {
      return normalizeArchitecturePlan(JSON.parse(candidate), input);
    } catch {
      // Try the next candidate before falling back.
    }
  }
  return buildFallbackArchitecturePlan(input);
}
export async function POST(req: NextRequest) {
  try {
    const body: GenRequestBody = await req.json();
    if (!body?.nodes || !body?.edges) {
      return NextResponse.json({ error: "Missing nodes or edges" }, { status: 400 });
    }
    const apiKeys = getApiKeys();
    if (apiKeys.length === 0) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }
    const rotator = new KeyRotator(apiKeys);
    const language: GenLanguage = body.language === "python" ? "python" : "javascript";
    let aiCallCount = 0;
    const usedProvider: { value: "gemini" | "groq" } = { value: "gemini" };
    const onRequest = () => { aiCallCount++; };
    const architecturePlan = await planArchitectureAi({
      nodes: body.nodes,
      edges: body.edges,
      techStack: body.techStack,
      metadata: body.metadata,
      language,
      rotator,
      usedProvider,
      onRequest,
    });
    if (!architecturePlan?.files || !Array.isArray(architecturePlan.files)) {
      return NextResponse.json({ error: "Invalid architecture plan returned by AI" }, { status: 500 });
    }
    const filesToGenerate = architecturePlan.files.slice(0, 20);
    const concurrency = Math.max(1, apiKeys.length);
    const generatedEntries = await mapWithConcurrency(
      filesToGenerate,
      concurrency,
      async (file) => {
        let code = "";
        try {
          code = await genCodeAi({
            filePath: file.path,
            description: file.description,
            fullPlan: architecturePlan,
            language,
            rotator,
            usedProvider,
            onRequest,
          });
        } catch (error) {
          if (error instanceof QuotaExceededError) throw error;
          const msg = error instanceof Error ? error.message : String(error);
          console.warn(`[gen] Falling back for file ${file.path}: ${msg}`);
          code = buildFallbackFileContent({
            filePath: file.path,
            language,
            description: file.description,
            plan: architecturePlan,
          });
        }
        return [file.path, code] as const;
      },
    );
    const generatedFiles = Object.fromEntries(generatedEntries);
    const zip = new JSZip();
    Object.entries(generatedFiles).forEach(([p, content]) => zip.file(p, content));
    const zipArrayBuffer = await zip.generateAsync({ type: "arraybuffer" });
    let deployStatus = "skipped";
    const deployUrl = process.env.DEPLOY_URL;
    if (deployUrl) {
      try {
        const deployRes = await fetch(deployUrl, {
          method: "POST",
          headers: { "Content-Type": "application/zip" },
          body: zipArrayBuffer,
          signal: AbortSignal.timeout(15_000),
        });
        deployStatus = deployRes.ok ? "ok" : `error:${deployRes.status}`;
        console.log(`[gen] Deploy → ${deployUrl} — ${deployStatus}`);
      } catch (err) {
        deployStatus = "unreachable";
        console.warn("[gen] Deploy server not reachable:", (err as Error).message);
      }
    }
    const providerModel =
      usedProvider.value === "groq" ? GROQ_MODEL : GEMINI_MODEL;
    return new NextResponse(zipArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="generated-project.zip"',
        "X-Gemini-Requests": String(aiCallCount),
        "X-AI-Requests": String(aiCallCount),
        "X-AI-Provider": usedProvider.value,
        "X-AI-Model": providerModel,
        "X-Generated-Files": String(filesToGenerate.length),
        "X-Gemini-Keys": `${rotator.availableCount}/${apiKeys.length}`,
        "X-Deploy-Status": deployStatus,
      },
    });
  } catch (error: unknown) {
    const retryAfter =
      error instanceof QuotaExceededError
        ? Math.max(1, Math.floor(error.retryAfter))
        : getQuotaRetryAfter(error);
    if (retryAfter !== null) {
      return NextResponse.json(
        {
          error: "AI quota exceeded",
          message: "Gemini quota exhausted or rate-limited. Please wait and retry, or upgrade your plan.",
          retryAfter,
        },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }
    console.error("GEN ERROR:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Internal server error", detail: msg }, { status: 500 });
  }
}
async function planArchitectureAi(input: {
  nodes: unknown[];
  edges: unknown[];
  techStack?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  language: GenLanguage;
  rotator: KeyRotator;
  usedProvider: { value: "gemini" | "groq" };
  onRequest?: () => void;
}): Promise<ArchitecturePlan> {
  const langSpec =
    input.language === "python"
      ? `Python 3.12+, FastAPI, pip
- Entry point: main.py at the project root (run with: python main.py)
- Dependencies: requirements.txt only — NO poetry, NO pyproject.toml
- Include: main.py, requirements.txt, .env.example, Dockerfile, README.md`
      : `JavaScript/TypeScript, Express (Node.js), npm
- Entry point: src/index.ts
- package.json scripts MUST be: { "dev": "tsx src/index.ts", "start": "node dist/index.js", "build": "tsc" }
- devDependencies MUST include: tsx, typescript, @types/node, @types/express (and other @types needed)
- Run with: npm install && npm run dev — this MUST work without any compilation step
- Include: src/index.ts, package.json, tsconfig.json, .env.example, Dockerfile, README.md`;
  const prompt = `You are a senior software architect.
Generate a COMPLETE production-ready backend project file structure for the given architecture.
Language stack:
${langSpec}
Rules:
- Plan exact folders and files.
- Every file needs a detailed description of its responsibility.
- Do NOT generate code. Output ONLY the JSON plan.
- PYTHON ONLY: entry point MUST be main.py at root; never include pyproject.toml or poetry.
- JS/TS ONLY: package.json MUST have scripts { "dev": "tsx src/index.ts", "start": "node dist/index.js", "build": "tsc" } and devDependencies with "tsx" so npm run dev works immediately after npm install.
Return STRICT JSON only:
{"projectName":"string","description":"string","files":[{"path":"relative/path.ext","description":"detailed responsibility"}]}
No markdown. No explanation outside JSON.
Architecture:
${JSON.stringify({ nodes: input.nodes, edges: input.edges, techStack: input.techStack, metadata: input.metadata })}`;
  try {
    const text = await callAI(input.rotator, prompt, input.usedProvider, input.onRequest);
    if (!text) throw new Error("Empty response from AI");
    return parseArchitecturePlan(text, {
      nodes: input.nodes,
      language: input.language,
    });
  } catch (error) {
    if (error instanceof QuotaExceededError) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[gen] Falling back to local architecture plan: ${msg}`);
    return buildFallbackArchitecturePlan({
      nodes: input.nodes,
      language: input.language,
    });
  }
}
const EMPTY_FILE_RE = [/\.gitkeep$/, /\.gitignore$/, /__init__\.py$/, /pyproject\.toml$/];
async function genCodeAi(input: {
  filePath: string;
  description: string;
  fullPlan: { projectName: string; description: string; files: { path: string; description: string }[] };
  language: GenLanguage;
  rotator: KeyRotator;
  usedProvider: { value: "gemini" | "groq" };
  onRequest?: () => void;
}): Promise<string> {
  if (EMPTY_FILE_RE.some((re) => re.test(input.filePath))) return "";
  const langRules =
    input.language === "python"
      ? `Python 3.12+, type hints, PEP 8, async/await FastAPI, real package versions in requirements.txt.
- Entry point is main.py at project root; app starts with: python main.py
- Use pip + requirements.txt — never use poetry or pyproject.toml.
- If generating main.py: include uvicorn.run(..., host="0.0.0.0", port=8000) so it starts directly.`
      : `JavaScript/TypeScript, Express (Node.js), strict TS types, process.env for config.
- If generating package.json:
  * scripts MUST be: { "dev": "tsx src/index.ts", "start": "node dist/index.js", "build": "tsc" }
  * devDependencies MUST include: "tsx", "typescript", "@types/node", "@types/express" (plus any other @types for packages used)
  * All real package versions — no placeholders like "^x.x.x"
- App MUST start by running: npm install && npm run dev — zero extra steps.
- Never use ts-node, nodemon, or require("ts-node/register").`;
  const filePaths = input.fullPlan.files.map((f) => f.path).join("\n");
  const prompt = `You are a senior software engineer.
Generate the FULL production-ready code for ONE file.
Project: ${input.fullPlan.projectName}
Description: ${input.fullPlan.description}
Language rules: ${langRules}
All files in the project:
${filePaths}
File to generate:
Path: ${input.filePath}
Responsibility: ${input.description}
Rules: Output ONLY raw code. No markdown. No explanations. No placeholder text. No pseudo-code.
Generate complete code now.`;
  try {
    const text = await callAI(input.rotator, prompt, input.usedProvider, input.onRequest);
    if (!text) return "";
    return text.replace(/```[\w]*\n?/g, "").replace(/```/g, "").trim();
  } catch (error) {
    if (error instanceof QuotaExceededError) throw error;
    console.error(`CODE GENERATION ERROR (${input.filePath}):`, error);
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Code generation failed for ${input.filePath}: ${msg}`);
  }
}
