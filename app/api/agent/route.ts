import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ProcessNodeSchema } from "@/lib/schema/node";
import { EdgeSchema } from "@/lib/schema/graph";
import { analyzeDesignSystem } from "@/lib/runtime/architecture";

export const runtime = "nodejs";

const AgentRequestSchema = z.object({
  prompt: z.string().trim().min(1),
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
  includePatch: z.boolean().default(false),
});

type AgentRequest = z.infer<typeof AgentRequestSchema>;

function summarizeGraphs(allGraphs: AgentRequest["allGraphs"]) {
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

function generateExecutionPlan(input: AgentRequest) {
  const architectureSummary = summarizeGraphs(input.allGraphs);

  const plan = {
    generatedAt: new Date().toISOString(),
    prompt: input.prompt,
    summary: {
      totalNodes: input.currentGraph.nodes.length,
      totalEdges: input.currentGraph.edges.length,
      architectureSummary,
    },
    steps: [
      "1. Validate current graph structure and dependencies",
      "2. Identify agent orchestrators and service boundaries",
      "3. Map data flows and external integrations",
      "4. Generate execution sequence with error handling",
      "5. Produce deployment and monitoring recommendations",
    ],
    recommendations: [
      "Add retry logic for external service calls",
      "Implement observability for agent workflows",
      "Consider circuit breakers for resilience",
      "Document agent decision points and policies",
    ],
  };

  return plan;
}

function generateAgentPatch(input: AgentRequest) {
  const prompt = input.prompt.toLowerCase();
  const nodes = input.currentGraph.nodes;

  const existingAgentNodes = nodes.filter((node) => (node.data as { kind?: string }).kind === "process");
  const existingServiceBoundaries = nodes.filter((node) => (node.data as { kind?: string }).kind === "service_boundary");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patchNodes: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patchEdges: any[] = [];

  // Simple heuristic: if no agent nodes exist, create a starter orchestrator
  if (existingAgentNodes.length === 0) {
    const orchestratorId = `agent_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const orchestratorNode = {
      id: orchestratorId,
      type: "process",
      position: { x: 180, y: 160 },
      selected: true,
      data: {
        kind: "process",
        id: orchestratorId,
        label: "Agent Orchestrator",
        processType: "agent",
        execution: "async",
        description: `Generated from agent prompt: ${input.prompt}`,
        inputs: [{ name: "trigger", type: "object", required: false }],
        outputs: { success: [{ name: "result", type: "object" }], error: [{ name: "error", type: "string" }] },
        steps: [
          { id: "step_1", kind: "validate", ref: "", config: { intent: "validate_input" } },
          { id: "step_2", kind: "decide", ref: "", config: { intent: "route_request" } },
          { id: "step_3", kind: "execute", ref: "", config: { intent: "execute_workflow" } },
          { id: "step_4", kind: "return", ref: "", config: { value: { status: "completed" } } },
        ],
      },
    };
    patchNodes.push(orchestratorNode);
  }

  // If no service boundaries exist and prompt suggests microservices, create one
  if (existingServiceBoundaries.length === 0 && (prompt.includes("microservice") || prompt.includes("service"))) {
    const serviceId = `svc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const serviceNode = {
      id: serviceId,
      type: "service_boundary",
      position: { x: 180, y: 300 },
      selected: true,
      data: {
        kind: "service_boundary",
        id: serviceId,
        label: "Generated Service",
        description: `Generated from agent prompt: ${input.prompt}`,
        apiRefs: [],
        functionRefs: patchNodes.map((n) => n.data.id),
        dataRefs: [],
        computeRef: undefined,
        communication: {
          allowApiCalls: true,
          allowQueueEvents: true,
          allowEventBus: true,
          allowDirectDbAccess: false,
        },
      },
    };
    patchNodes.push(serviceNode);
  }

  return {
    summary: `Agent expansion: added ${patchNodes.length} agent-oriented node${patchNodes.length !== 1 ? "s" : ""} to the graph.`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodes: patchNodes as any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    edges: patchEdges as any[],
  };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = AgentRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;
  const plan = generateExecutionPlan(input);
  const patch = input.includePatch ? generateAgentPatch(input) : null;

  return NextResponse.json({
    plan,
    patch,
    architecture: summarizeGraphs(input.allGraphs),
  });
}
