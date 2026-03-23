import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateWorkspaceOpenApiSpec, generateWorkspaceApiDocs } from "@/lib/api/openapi-generator";
import { EdgeSchema } from "@/lib/schema/graph";
import { ApiBindingSchema } from "@/lib/schema/node";
import { ProcessNodeSchema } from "@/lib/schema/node";

export const runtime = "nodejs";

const ExportRequestSchema = z.object({
  title: z.string().optional(),
  version: z.string().optional(),
  description: z.string().optional(),
  graphs: z.object({
    api: z.object({
      nodes: z.array(ProcessNodeSchema).default([]),
      edges: z.array(EdgeSchema).default([]),
    }),
  }),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = ExportRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const apiGraphNodes = parsed.data.graphs.api.nodes;
    const apiNodes = apiGraphNodes
      .filter((node) => node.data.kind === "api_binding")
      .map((node) => ApiBindingSchema.parse(node.data));

    const spec = generateWorkspaceOpenApiSpec(apiNodes, parsed.data);
    const docs = generateWorkspaceApiDocs(apiNodes, { title: parsed.data.title });

    const specBlob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
    const docsBlob = new Blob([docs], { type: "text/markdown" });

    const zip = await import("jszip").then((mod) => mod.default);
    const archive = new zip();
    archive.file("openapi.json", specBlob);
    archive.file("api-docs.md", docsBlob);

    const zipBlob = await archive.generateAsync({ type: "blob" });

    return new NextResponse(zipBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="archi-dev-api-export.zip"`,
        "X-Export-Endpoints": String(apiNodes.length),
      },
    });
  } catch (error) {
    console.error("OpenAPI export error:", error);
    return NextResponse.json({ error: "internal_server_error" }, { status: 500 });
  }
}
