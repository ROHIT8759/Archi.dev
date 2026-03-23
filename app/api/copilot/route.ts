import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import { z } from "zod";
import { EdgeSchema } from "@/lib/schema/graph";
import { analyzeDesignSystem } from "@/lib/runtime/architecture";
import { ProcessNodeSchema } from "@/lib/schema/node";

export const runtime = "nodejs";

const WorkspaceTabSchema = z.enum(["api", "database", "functions", "agent"]);

const CopilotRequestSchema = z.object({
  prompt: z.string().trim().min(1),
  activeTab: WorkspaceTabSchema,
  currentGraph: z.object({
    nodes: z.array(ProcessNodeSchema).default([]),
    edges: z.array(EdgeSchema).default([]),
  }),
  allGraphs: z
    .object({
      api: z.object({ nodes: z.array(ProcessNodeSchema).default([]), edges: z.array(EdgeSchema).default([]) }).optional(),
      database: z.object({ nodes: z.array(ProcessNodeSchema).default([]), edges: z.array(EdgeSchema).default([]) }).optional(),
      functions: z.object({ nodes: z.array(ProcessNodeSchema).default([]), edges: z.array(EdgeSchema).default([]) }).optional(),
      agent: z.object({ nodes: z.array(ProcessNodeSchema).default([]), edges: z.array(EdgeSchema).default([]) }).optional(),
    })
    .default({}),
});

const CopilotPatchSchema = z.object({
  summary: z.string(),
  nodes: z.array(ProcessNodeSchema).default([]),
  edges: z.array(EdgeSchema).default([]),
});

type CopilotRequest = z.infer<typeof CopilotRequestSchema>;
type CopilotPatch = z.infer<typeof CopilotPatchSchema>;

type SimpleNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
  selected?: boolean;
};

type SimpleEdge = {
  id: string;
  source: string;
  target: string;
  type?: "default" | "step";
};

type GraphCollectionInput = CopilotRequest["allGraphs"];

function summarizeGraphs(allGraphs: GraphCollectionInput) {
  const tabs = Object.entries(allGraphs).map(([tab, graph]) => ({
    tab,
    nodeCount: graph?.nodes.length ?? 0,
    edgeCount: graph?.edges.length ?? 0,
    sampleNodes: (graph?.nodes ?? []).slice(-4).map((node) => ({
      id: node.id,
      label: (node.data as { label?: string }).label || node.id,
      kind: (node.data as { kind?: string }).kind || node.type,
    })),
  }));

  const designReport = analyzeDesignSystem({
    api: allGraphs.api,
    database: allGraphs.database,
    functions: allGraphs.functions,
    agent: allGraphs.agent,
  });

  return {
    tabs,
    runtimeIssues: designReport.runtimeModel.issues.slice(0, 8),
    serviceIssues: designReport.serviceModel.issues.slice(0, 8),
    services: designReport.serviceModel.services.slice(0, 6),
    deploy: designReport.deploy,
  };
}

function findNodeByKind(
  allGraphs: GraphCollectionInput,
  kind: string,
): Array<{ nodeId: string; dataId: string; label: string; tab: string; data: Record<string, unknown> }> {
  return Object.entries(allGraphs).flatMap(([tab, graph]) =>
    (graph?.nodes ?? [])
      .filter((node) => (node.data as { kind?: string }).kind === kind)
      .map((node) => ({
        nodeId: node.id,
        dataId: String((node.data as { id?: string }).id || node.id),
        label: String((node.data as { label?: string }).label || node.id),
        tab,
        data: node.data as Record<string, unknown>,
      })),
  );
}

function inferServiceName(prompt: string): string {
  if (/billing|invoice|payment|stripe/.test(prompt)) return "Billing Service";
  if (/auth|login|signup|user/.test(prompt)) return "Auth Service";
  if (/subscription/.test(prompt)) return "Subscription Service";
  if (/order|checkout|cart/.test(prompt)) return "Order Service";
  if (/notification|email|sms/.test(prompt)) return "Notification Service";
  return "Generated Service";
}

function inferApiLabel(prompt: string): string {
  if (/webhook/.test(prompt) && /stripe/.test(prompt)) return "Stripe Webhook";
  if (/subscription/.test(prompt)) return "Subscription API";
  if (/order/.test(prompt)) return "Order API";
  return "Generated API";
}

function inferFunctionLabel(prompt: string): string {
  if (/validate/.test(prompt)) return "Validate Input";
  if (/stripe/.test(prompt)) return "Handle Stripe Event";
  if (/subscription/.test(prompt)) return "Sync Subscription";
  if (/order/.test(prompt)) return "Process Order";
  return "Generated Function";
}

function inferTableName(prompt: string): string {
  if (/subscription/.test(prompt)) return "subscriptions";
  if (/invoice|billing|payment/.test(prompt)) return "payments";
  if (/order/.test(prompt)) return "orders";
  if (/user|auth/.test(prompt)) return "users";
  return "items";
}

function getGeminiApiKey(): string | null {
  const numbered = process.env.GEMINI_API_KEY_1?.trim();
  if (numbered) return numbered;
  const raw = process.env.GEMINI_API_KEY?.split(",").map((value) => value.trim()).filter(Boolean)[0];
  return raw || null;
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function nextPosition(index: number, currentNodes: Array<{ position: { x: number; y: number } }>): { x: number; y: number } {
  const last = currentNodes[currentNodes.length - 1];
  if (!last) {
    return { x: 180 + index * 280, y: 160 + index * 60 };
  }
  return {
    x: last.position.x + 260 + index * 20,
    y: last.position.y + index * 24,
  };
}

function buildHeuristicPatch(input: CopilotRequest): CopilotPatch {
  const prompt = input.prompt.toLowerCase();
  const nodes: SimpleNode[] = [];
  const edges: SimpleEdge[] = [];
  const serviceBoundaries = findNodeByKind(input.allGraphs, "service_boundary");
  const functions = findNodeByKind(input.allGraphs, "process");
  const databases = findNodeByKind(input.allGraphs, "database");
  const apis = findNodeByKind(input.allGraphs, "api_binding");
  const queues = findNodeByKind(input.allGraphs, "queue");

  const relevantService =
    serviceBoundaries.find((service) =>
      service.label.toLowerCase().includes(inferServiceName(prompt).split(" ")[0].toLowerCase()),
    ) ?? serviceBoundaries[0];
  const relevantFunction =
    functions.find((fn) => /stripe|subscription|order|auth|billing/.test(prompt) && fn.label.toLowerCase().includes(prompt.split(" ")[0])) ??
    functions.find((fn) => fn.tab === "functions") ??
    functions[0];
  const relevantDatabase =
    databases.find((db) => /subscription|order|billing|auth/.test(prompt) && db.label.toLowerCase().includes(prompt.split(" ")[0])) ??
    databases[0];
  const relevantApi = apis[0];
  const relevantQueue = queues[0];

  if (input.activeTab === "api") {
    const method = prompt.includes("webhook") ? "POST" : prompt.includes("update") ? "PATCH" : prompt.includes("create") ? "POST" : "GET";
    const route = prompt.includes("stripe")
      ? "/api/webhooks/stripe"
      : prompt.includes("subscription")
        ? "/api/subscriptions"
        : "/api/copilot/generated";

    const apiNodeId = makeId("node");
    const processNodeId = makeId("node");
    const processRef = relevantFunction?.dataId ?? makeId("process");
    const shouldCreateApiFunction = !relevantFunction || prompt.includes("new function") || prompt.includes("new handler");

    nodes.push({
      id: apiNodeId,
      type: "api_binding",
      position: nextPosition(0, input.currentGraph.nodes),
      selected: true,
      data: {
        kind: "api_binding",
        id: makeId("api"),
        label: inferApiLabel(prompt),
        protocol: "rest",
        apiType: "openapi",
        method,
        route,
        request: {
          pathParams: [],
          queryParams: [],
          headers: [],
          body: {
            contentType: "application/json",
            schema: prompt.includes("subscription")
              ? [{ name: "subscriptionId", type: "string", required: true }]
              : prompt.includes("order")
                ? [{ name: "orderId", type: "string", required: true }]
                : [],
          },
        },
        responses: {
          success: {
            statusCode: prompt.includes("create") ? 201 : 200,
            schema: [{ name: "ok", type: "boolean" }],
          },
          error: {
            statusCode: 400,
            schema: [{ name: "message", type: "string" }],
          },
        },
        security: { type: prompt.includes("webhook") ? "none" : "bearer", scopes: [] },
        rateLimit: { enabled: !prompt.includes("webhook"), requests: 60, window: "minute" },
        version: "v1",
        deprecated: false,
        tables: [],
        tableRelationships: [],
        processRef,
        description: relevantService
          ? `${input.prompt} Bound to ${relevantService.label}.`
          : input.prompt,
      },
    });

    if (shouldCreateApiFunction) {
      nodes.push({
        id: processNodeId,
        type: "process",
        position: nextPosition(1, [...input.currentGraph.nodes, nodes[0]]),
        selected: true,
        data: {
          kind: "process",
          id: processRef,
          label: inferFunctionLabel(prompt),
          processType: "function_block",
          execution: prompt.includes("queue") ? "async" : "sync",
          description: `Generated from Copilot prompt: ${input.prompt}`,
          inputs: prompt.includes("webhook") ? [] : [{ name: "payload", type: "object", required: false }],
          outputs: {
            success: [{ name: "ok", type: "boolean" }],
            error: [{ name: "message", type: "string" }],
          },
          steps: [
            ...(relevantFunction && relevantFunction.tab === "functions"
              ? [{ id: makeId("step"), kind: "ref", ref: relevantFunction.dataId, config: { imported: true } }]
              : []),
            ...(relevantDatabase
              ? [{ id: makeId("step"), kind: "db_operation", ref: relevantDatabase.dataId, config: { table: inferTableName(prompt) } }]
              : []),
            { id: makeId("step"), kind: "return", ref: "", config: { value: { ok: true } } },
          ],
        },
      });

      edges.push({
        id: makeId("edge"),
        source: apiNodeId,
        target: processNodeId,
        type: "step",
      });
    }

    if (prompt.includes("queue") && !relevantQueue) {
      const queueNodeId = makeId("node");
      nodes.push({
        id: queueNodeId,
        type: "queue",
        position: nextPosition(2, [...input.currentGraph.nodes, ...nodes]),
        selected: true,
        data: {
          kind: "queue",
          id: makeId("queue"),
          label: "Webhook Queue",
          delivery: "at_least_once",
          retry: { maxAttempts: 5, backoff: "exponential" },
          deadLetter: true,
          description: "Generated queue for asynchronous processing",
        },
      });
      if (shouldCreateApiFunction) {
        edges.push({ id: makeId("edge"), source: processNodeId, target: queueNodeId, type: "step" });
      }
    }

    return {
      summary: shouldCreateApiFunction
        ? `Added ${nodes.length} API workspace block${nodes.length !== 1 ? "s" : ""} and linked them to existing studio context.`
        : `Added an API binding that reuses existing function \"${relevantFunction?.label ?? "current logic"}\".`,
      nodes: nodes as CopilotPatch["nodes"],
      edges: edges as CopilotPatch["edges"],
    };
  }

  if (input.activeTab === "database") {
    const tableName = inferTableName(prompt);
    if (relevantApi) {
      const endpointNodeId = makeId("node");
      return {
        summary: `Added a database endpoint block linked to existing API \"${relevantApi.label}\".`,
        nodes: [
          {
            id: endpointNodeId,
            type: "api_endpoint",
            position: nextPosition(0, input.currentGraph.nodes),
            selected: true,
            data: {
              kind: "api_endpoint",
              id: makeId("endpoint"),
              label: `${relevantApi.label} Endpoint`,
              description: input.prompt,
              targetApiId: relevantApi.dataId,
              method: String(relevantApi.data.method || "GET"),
              route: String(relevantApi.data.route || "/generated"),
              protocol: String(relevantApi.data.protocol || "rest"),
            },
          },
        ] as CopilotPatch["nodes"],
        edges: [],
      };
    }

    const dbNodeId = makeId("node");
    return {
      summary: relevantDatabase
        ? `Added a companion database block to expand the existing data model around \"${relevantDatabase.label}\".`
        : "Added a database block with a starter table inferred from your prompt.",
      nodes: [
        {
          id: dbNodeId,
          type: "database",
          position: nextPosition(0, input.currentGraph.nodes),
          selected: true,
          data: {
            kind: "database",
            id: makeId("db"),
            label: prompt.includes("analytics") ? "Analytics Database" : "Generated Database",
            dbType: "sql",
            engine: "postgres",
            capabilities: {
              crud: true,
              transactions: true,
              joins: true,
              aggregations: true,
              indexes: true,
              constraints: true,
              pagination: true,
            },
            performance: {
              connectionPool: { min: 2, max: 20, timeout: 30 },
              readReplicas: { count: 0, regions: [] },
              caching: { enabled: false, strategy: "", ttl: 300 },
              sharding: { enabled: false, strategy: "", partitionKey: "" },
            },
            backup: {
              schedule: "daily",
              retention: { days: 7, maxVersions: 30 },
              pointInTimeRecovery: true,
              multiRegion: { enabled: false, regions: [] },
            },
            costEstimation: { storageGb: 5, estimatedIOPS: 100, backupSizeGb: 2, replicaCount: 0 },
            security: {
              roles: [],
              encryption: { atRest: true, inTransit: true },
              network: { vpcId: "", allowedIPs: [] },
              auditLogging: true,
            },
            monitoring: {
              thresholds: { cpuPercent: 80, memoryPercent: 80, connectionCount: 200, queryLatencyMs: 250 },
              alerts: [],
              slaTargets: { uptimePercent: 99.9, maxLatencyMs: 300 },
            },
            environments: {
              dev: { connectionString: "", provider: { region: "" }, performanceTier: "small", overrides: { enabled: false } },
              staging: { connectionString: "", provider: { region: "" }, performanceTier: "medium", overrides: { enabled: false } },
              production: { connectionString: "", provider: { region: "" }, performanceTier: "large", overrides: { enabled: false } },
            },
            schemas: ["public"],
            tables: [
              {
                name: tableName,
                fields: [
                  { name: "id", type: "uuid", required: true, isPrimary: true },
                  { name: prompt.includes("status") ? "status" : "name", type: "string", required: true },
                  ...(prompt.includes("customer") ? [{ name: "customer_id", type: "uuid", required: true }] : []),
                ],
              },
            ],
            schemaHistory: [],
            queries: [],
            seeds: [],
            migrations: [],
            relationships: [],
            queryWorkbench: { query: "", ormTarget: "prisma", mockRows: 5 },
            description: input.prompt,
          },
        },
      ] as CopilotPatch["nodes"],
      edges: [],
    };
  }

  if (input.activeTab === "functions") {
    const fnNodeId = makeId("node");
    const serviceBoundaryId = makeId("node");
    const createServiceBoundary = !relevantService || prompt.includes("service boundary") || prompt.includes("microservice");
    return {
      summary: createServiceBoundary
        ? `Added a function block plus a service boundary for ${inferServiceName(prompt)}.`
        : `Added a function block that references existing studio resources.` ,
      nodes: [
        ...(createServiceBoundary
          ? [
              {
                id: serviceBoundaryId,
                type: "service_boundary",
                position: nextPosition(0, input.currentGraph.nodes),
                selected: true,
                data: {
                  kind: "service_boundary",
                  id: makeId("svc"),
                  label: inferServiceName(prompt),
                  description: `Generated from Copilot prompt: ${input.prompt}`,
                  apiRefs: relevantApi ? [relevantApi.dataId] : [],
                  functionRefs: [],
                  dataRefs: relevantDatabase ? [relevantDatabase.dataId] : [],
                  computeRef: undefined,
                  communication: {
                    allowApiCalls: true,
                    allowQueueEvents: true,
                    allowEventBus: true,
                    allowDirectDbAccess: false,
                  },
                },
              },
            ]
          : []),
        {
          id: fnNodeId,
          type: "process",
          position: nextPosition(createServiceBoundary ? 1 : 0, input.currentGraph.nodes),
          selected: true,
          data: {
            kind: "process",
            id: makeId("fn"),
            label: inferFunctionLabel(prompt),
            processType: "function_block",
            execution: prompt.includes("queue") ? "async" : "sync",
            description: input.prompt,
            inputs: [{ name: "input", type: "object", required: false }],
            outputs: { success: [{ name: "result", type: "object" }], error: [{ name: "message", type: "string" }] },
            steps: [
              ...(relevantDatabase
                ? [{ id: makeId("step"), kind: "db_operation", ref: relevantDatabase.dataId, config: { table: inferTableName(prompt) } }]
                : []),
              ...(relevantQueue
                ? [{ id: makeId("step"), kind: "external_call", ref: relevantQueue.dataId, config: { queue: relevantQueue.label } }]
                : []),
              { id: makeId("step"), kind: "return", ref: "", config: { value: { result: {} } } },
            ],
          },
        },
      ] as CopilotPatch["nodes"],
      edges: [],
    };
  }

  return {
    summary: serviceBoundaries.length > 0
      ? `Agent workspace guidance: existing service boundaries found (${serviceBoundaries.map((service) => service.label).join(", ")}). Agent-node expansion can build on those next.`
      : "Agent workspace Copilot currently suggests using API, Database, or Functions tabs for graph generation.",
    nodes: [],
    edges: [],
  };
}

async function tryGeneratePatchWithAI(input: CopilotRequest): Promise<CopilotPatch | null> {
  const geminiKey = getGeminiApiKey();
  const groqKey = process.env.GROQ_API_KEY?.trim();
  if (!geminiKey && !groqKey) return null;

  const architectureSummary = summarizeGraphs(input.allGraphs);
  const currentSummary = {
    nodeCount: input.currentGraph.nodes.length,
    edgeCount: input.currentGraph.edges.length,
    sampleNodes: input.currentGraph.nodes.slice(-6).map((node) => ({
      id: node.id,
      type: node.type,
      label: (node.data as { label?: string }).label || node.id,
      kind: (node.data as { kind?: string }).kind || node.type,
    })),
  };

  const prompt = [
    "You are Archi.dev Canvas Copilot.",
    `Current workspace: ${input.activeTab}`,
    "Return STRICT JSON only with shape:",
    '{"summary":"string","nodes":[ProcessNode-like objects],"edges":[Edge-like objects]}',
    "Rules:",
    "- Create only NEW nodes and NEW edges.",
    "- Do not return markdown.",
    "- Keep nodes relevant to the current workspace only.",
    "- Reuse existing cross-tab ids when binding APIs to functions or functions to data resources.",
    "- Prefer architecture-consistent patches that reduce runtime/service issues.",
    "- Valid node types available: process, database, queue, service_boundary, api_binding, api_endpoint, infra.",
    "- For API workspace prefer api_binding + process.",
    "- For Database workspace prefer database, api_endpoint, queue, process.",
    "- For Functions workspace prefer process and service_boundary.",
    "- Use realistic ids, positions, labels, and schema-safe data.",
    `Current graph summary: ${JSON.stringify(currentSummary)}`,
    `Whole studio architecture summary: ${JSON.stringify(architectureSummary)}`,
    `User prompt: ${input.prompt}`,
  ].join("\n");

  try {
    if (geminiKey) {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite",
        contents: prompt,
      });
      const text = response.text?.replace(/```[\w]*\n?/g, "").replace(/```/g, "").trim() || "";
      if (text) {
        return CopilotPatchSchema.parse(JSON.parse(text));
      }
    }
  } catch {
    // fall through to Groq or heuristic
  }

  try {
    if (groqKey) {
      const groq = new Groq({ apiKey: groqKey });
      const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 1800,
      });
      const text = completion.choices[0]?.message?.content?.replace(/```[\w]*\n?/g, "").replace(/```/g, "").trim() || "";
      if (text) {
        return CopilotPatchSchema.parse(JSON.parse(text));
      }
    }
  } catch {
    return null;
  }

  return null;
}

function sanitizePatch(patch: CopilotPatch, currentGraph: CopilotRequest["currentGraph"]): CopilotPatch {
  const existingIds = new Set(currentGraph.nodes.map((node) => node.id));
  const validNodes: CopilotPatch["nodes"] = [];
  const newNodeIds = new Set<string>();

  for (const node of patch.nodes) {
    const parsed = ProcessNodeSchema.safeParse(node);
    if (!parsed.success) continue;
    if (existingIds.has(parsed.data.id) || newNodeIds.has(parsed.data.id)) continue;
    validNodes.push(parsed.data);
    newNodeIds.add(parsed.data.id);
  }

  const addressableNodeIds = new Set([
    ...existingIds,
    ...validNodes.map((node) => node.id),
  ]);

  const validEdges: CopilotPatch["edges"] = [];
  const edgeIds = new Set<string>();
  for (const edge of patch.edges) {
    const parsed = EdgeSchema.safeParse(edge);
    if (!parsed.success) continue;
    if (edgeIds.has(parsed.data.id)) continue;
    if (!addressableNodeIds.has(parsed.data.source) || !addressableNodeIds.has(parsed.data.target)) continue;
    validEdges.push(parsed.data);
    edgeIds.add(parsed.data.id);
  }

  return {
    summary: patch.summary,
    nodes: validNodes,
    edges: validEdges,
  };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = CopilotRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const aiPatch = await tryGeneratePatchWithAI(parsed.data);
  const rawPatch = aiPatch ?? buildHeuristicPatch(parsed.data);
  const patch = sanitizePatch(rawPatch, parsed.data.currentGraph);

  return NextResponse.json({
    patch,
    source: aiPatch ? "ai" : "heuristic",
    architecture: summarizeGraphs(parsed.data.allGraphs),
  });
}
