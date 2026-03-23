import { Edge, Node } from "@xyflow/react";

export type WorkspaceTab = "api" | "database" | "functions" | "agent";

export type GraphState = {
  nodes: Node[];
  edges: Edge[];
};

export type WorkspaceTemplateId =
  | "blank"
  | "hello_world_api"
  | "saas_auth"
  | "rag_pipeline"
  | "ecommerce_crud";

export type WorkspaceTemplateDefinition = {
  id: WorkspaceTemplateId;
  label: string;
  description: string;
};

const cloneGraph = (graph: GraphState): GraphState => ({
  nodes: graph.nodes.map((node) => ({
    ...node,
    position: { ...node.position },
    data: { ...(node.data as object) },
  })) as Node[],
  edges: graph.edges.map((edge) => ({ ...edge })) as Edge[],
});

const blankGraphs = (): Record<WorkspaceTab, GraphState> => ({
  api: { nodes: [], edges: [] },
  database: { nodes: [], edges: [] },
  functions: { nodes: [], edges: [] },
  agent: { nodes: [], edges: [] },
});

const helloWorldGraphs = (): Record<WorkspaceTab, GraphState> => ({
  api: cloneGraph({
    nodes: [
      {
        id: "hello-api",
        type: "api_binding",
        position: { x: 120, y: 120 },
        data: {
          kind: "api_binding",
          id: "helloWorldApi",
          label: "Hello World API",
          protocol: "rest",
          apiType: "openapi",
          method: "GET",
          route: "/api/hello",
          request: {
            pathParams: [],
            queryParams: [],
            headers: [],
            body: { contentType: "application/json", schema: [] },
          },
          responses: {
            success: {
              statusCode: 200,
              schema: [{ name: "message", type: "string" }],
            },
            error: { statusCode: 500, schema: [] },
          },
          security: { type: "none", scopes: [] },
          rateLimit: { enabled: false, requests: 100, window: "minute" },
          version: "v1",
          deprecated: false,
          tables: [],
          tableRelationships: [],
          processRef: "helloWorldProcess",
          description: "Returns a hello world message",
        },
      },
      {
        id: "hello-process",
        type: "process",
        position: { x: 460, y: 120 },
        data: {
          kind: "process",
          id: "helloWorldProcess",
          label: "Function Block",
          processType: "function_block",
          execution: "sync",
          description: "Produces a simple hello-world response",
          inputs: [],
          outputs: {
            success: [{ name: "message", type: "string" }],
            error: [{ name: "message", type: "string" }],
          },
          steps: [],
        },
      },
    ],
    edges: [
      {
        id: "hello-edge-api-process",
        source: "hello-api",
        target: "hello-process",
        type: "step",
      },
    ],
  }),
  database: { nodes: [], edges: [] },
  functions: { nodes: [], edges: [] },
  agent: { nodes: [], edges: [] },
});

const saasAuthGraphs = (): Record<WorkspaceTab, GraphState> => ({
  api: cloneGraph({
    nodes: [
      {
        id: "auth-api-login",
        type: "api_binding",
        position: { x: 120, y: 80 },
        data: {
          kind: "api_binding",
          id: "loginApi",
          label: "Login API",
          protocol: "rest",
          apiType: "openapi",
          method: "POST",
          route: "/api/auth/login",
          request: {
            pathParams: [],
            queryParams: [],
            headers: [],
            body: {
              contentType: "application/json",
              schema: [
                { name: "email", type: "string", required: true },
                { name: "password", type: "string", required: true },
              ],
            },
          },
          responses: {
            success: {
              statusCode: 200,
              schema: [
                { name: "accessToken", type: "string" },
                { name: "refreshToken", type: "string" },
              ],
            },
            error: { statusCode: 401, schema: [{ name: "message", type: "string" }] },
          },
          security: { type: "none", scopes: [] },
          rateLimit: { enabled: true, requests: 30, window: "minute" },
          version: "v1",
          deprecated: false,
          tables: [],
          tableRelationships: [],
          processRef: "authEntryApi",
          description: "Authenticate a user and mint tokens",
        },
      },
      {
        id: "auth-process-api",
        type: "process",
        position: { x: 430, y: 80 },
        data: {
          kind: "process",
          id: "authEntryApi",
          label: "API Auth Entry",
          processType: "function_block",
          execution: "sync",
          description: "Validates payload and imports auth domain function",
          inputs: [],
          outputs: {
            success: [
              { name: "accessToken", type: "string" },
              { name: "refreshToken", type: "string" },
            ],
            error: [{ name: "message", type: "string" }],
          },
          steps: [{ id: "auth-ref-1", kind: "ref", ref: "authDomainLogin", config: {} }],
        },
      },
      {
        id: "auth-service",
        type: "service_boundary",
        position: { x: 760, y: 60 },
        data: {
          kind: "service_boundary",
          id: "authService",
          label: "Auth Service",
          description: "Owns auth APIs, logic, and users data",
          apiRefs: ["loginApi"],
          functionRefs: ["authEntryApi", "authDomainLogin"],
          dataRefs: ["usersDb"],
          computeRef: "infra_lambda_auth",
          communication: {
            allowApiCalls: true,
            allowQueueEvents: true,
            allowEventBus: true,
            allowDirectDbAccess: false,
          },
        },
      },
    ],
    edges: [
      {
        id: "auth-edge-api-process",
        source: "auth-api-login",
        target: "auth-process-api",
        type: "step",
      },
    ],
  }),
  database: cloneGraph({
    nodes: [
      {
        id: "users-db-node",
        type: "database",
        position: { x: 180, y: 140 },
        data: {
          kind: "database",
          id: "usersDb",
          label: "Users Database",
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
              name: "users",
              fields: [
                { name: "id", type: "uuid", required: true, isPrimary: true },
                { name: "email", type: "string", required: true },
                { name: "passwordHash", type: "string", required: true },
                { name: "createdAt", type: "date", required: true },
              ],
            },
            {
              name: "sessions",
              fields: [
                { name: "id", type: "uuid", required: true, isPrimary: true },
                { name: "userId", type: "uuid", required: true },
                { name: "refreshToken", type: "string", required: true },
              ],
            },
          ],
          schemaHistory: [],
          queries: [],
          seeds: [],
          migrations: [],
          relationships: [],
          queryWorkbench: { query: "", ormTarget: "prisma", mockRows: 5 },
          description: "Stores users and session state",
        },
      },
      {
        id: "auth-db-endpoint",
        type: "api_endpoint",
        position: { x: 510, y: 150 },
        data: {
          kind: "api_endpoint",
          id: "authDbEndpoint",
          label: "Auth API Link",
          description: "Reference the auth login API from the data workspace",
          targetApiId: "auth-api-login",
          method: "POST",
          route: "/api/auth/login",
          protocol: "rest",
        },
      },
    ],
    edges: [],
  }),
  functions: cloneGraph({
    nodes: [
      {
        id: "auth-start-node",
        type: "process",
        position: { x: 140, y: 70 },
        data: {
          kind: "process",
          id: "authStart",
          label: "Start Function",
          processType: "start_function",
          execution: "sync",
          description: "Entry point for imported auth logic",
          inputs: [],
          outputs: { success: [], error: [] },
          steps: [],
        },
      },
      {
        id: "auth-domain-node",
        type: "process",
        position: { x: 430, y: 70 },
        data: {
          kind: "process",
          id: "authDomainLogin",
          label: "Verify Credentials",
          processType: "function_block",
          execution: "sync",
          description: "Loads user record and returns signed token payload",
          inputs: [
            { name: "email", type: "string", required: true },
            { name: "password", type: "string", required: true },
          ],
          outputs: {
            success: [
              { name: "accessToken", type: "string" },
              { name: "refreshToken", type: "string" },
            ],
            error: [{ name: "message", type: "string" }],
          },
          steps: [
            {
              id: "auth-db-op",
              kind: "db_operation",
              ref: "usersDb",
              config: { operation: "read", table: "users" },
            },
            {
              id: "auth-return",
              kind: "return",
              ref: "",
              config: { value: { accessToken: "token", refreshToken: "refresh" } },
            },
          ],
        },
      },
      {
        id: "auth-functions-service",
        type: "service_boundary",
        position: { x: 760, y: 60 },
        data: {
          kind: "service_boundary",
          id: "authServiceFunctions",
          label: "Auth Service",
          description: "Auth domain logic service boundary",
          apiRefs: [],
          functionRefs: ["authStart", "authDomainLogin"],
          dataRefs: ["usersDb"],
          computeRef: "infra_lambda_auth",
          communication: {
            allowApiCalls: true,
            allowQueueEvents: true,
            allowEventBus: true,
            allowDirectDbAccess: false,
          },
        },
      },
    ],
    edges: [
      {
        id: "auth-fn-edge",
        source: "auth-start-node",
        target: "auth-domain-node",
        type: "step",
      },
    ],
  }),
  agent: { nodes: [], edges: [] },
});

const ragPipelineGraphs = (): Record<WorkspaceTab, GraphState> => ({
  api: cloneGraph({
    nodes: [
      {
        id: "rag-query-api",
        type: "api_binding",
        position: { x: 120, y: 110 },
        data: {
          kind: "api_binding",
          id: "ragQueryApi",
          label: "RAG Query API",
          protocol: "rest",
          apiType: "openapi",
          method: "POST",
          route: "/api/rag/query",
          request: {
            pathParams: [],
            queryParams: [],
            headers: [],
            body: { contentType: "application/json", schema: [{ name: "query", type: "string", required: true }] },
          },
          responses: {
            success: { statusCode: 200, schema: [{ name: "answer", type: "string" }] },
            error: { statusCode: 500, schema: [{ name: "message", type: "string" }] },
          },
          security: { type: "bearer", scopes: [] },
          rateLimit: { enabled: true, requests: 20, window: "minute" },
          version: "v1",
          deprecated: false,
          tables: [],
          tableRelationships: [],
          processRef: "ragApiEntry",
          description: "Retrieval-augmented answer endpoint",
        },
      },
      {
        id: "rag-api-process",
        type: "process",
        position: { x: 430, y: 110 },
        data: {
          kind: "process",
          id: "ragApiEntry",
          label: "RAG API Entry",
          processType: "function_block",
          execution: "sync",
          description: "Imports retrieval orchestration",
          inputs: [{ name: "query", type: "string", required: true }],
          outputs: { success: [{ name: "answer", type: "string" }], error: [{ name: "message", type: "string" }] },
          steps: [{ id: "rag-ref-1", kind: "ref", ref: "retrieveAndAnswer", config: {} }],
        },
      },
    ],
    edges: [{ id: "rag-api-edge", source: "rag-query-api", target: "rag-api-process", type: "step" }],
  }),
  database: cloneGraph({
    nodes: [
      {
        id: "rag-db",
        type: "database",
        position: { x: 220, y: 130 },
        data: {
          kind: "database",
          id: "documentDb",
          label: "Document Store",
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
            caching: { enabled: true, strategy: "query", ttl: 300 },
            sharding: { enabled: false, strategy: "", partitionKey: "" },
          },
          backup: {
            schedule: "daily",
            retention: { days: 7, maxVersions: 30 },
            pointInTimeRecovery: true,
            multiRegion: { enabled: false, regions: [] },
          },
          costEstimation: { storageGb: 10, estimatedIOPS: 150, backupSizeGb: 3, replicaCount: 0 },
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
              name: "documents",
              fields: [
                { name: "id", type: "uuid", required: true, isPrimary: true },
                { name: "content", type: "string", required: true },
                { name: "embedding", type: "array", required: true },
              ],
            },
          ],
          schemaHistory: [],
          queries: [],
          seeds: [],
          migrations: [],
          relationships: [],
          queryWorkbench: { query: "", ormTarget: "prisma", mockRows: 5 },
          description: "Stores embedded knowledge chunks",
        },
      },
      {
        id: "rag-index-queue",
        type: "queue",
        position: { x: 520, y: 140 },
        data: {
          kind: "queue",
          id: "indexQueue",
          label: "Indexing Queue",
          delivery: "at_least_once",
          retry: { maxAttempts: 5, backoff: "exponential" },
          deadLetter: true,
          description: "Queues document embedding jobs",
        },
      },
    ],
    edges: [],
  }),
  functions: cloneGraph({
    nodes: [
      {
        id: "rag-start",
        type: "process",
        position: { x: 120, y: 90 },
        data: {
          kind: "process",
          id: "ragStart",
          label: "Start Function",
          processType: "start_function",
          execution: "sync",
          description: "Entry point for retrieval workflow",
          inputs: [],
          outputs: { success: [], error: [] },
          steps: [],
        },
      },
      {
        id: "rag-fn",
        type: "process",
        position: { x: 420, y: 90 },
        data: {
          kind: "process",
          id: "retrieveAndAnswer",
          label: "Retrieve And Answer",
          processType: "function_block",
          execution: "sync",
          description: "Loads relevant docs and returns an answer payload",
          inputs: [{ name: "query", type: "string", required: true }],
          outputs: { success: [{ name: "answer", type: "string" }], error: [{ name: "message", type: "string" }] },
          steps: [
            { id: "rag-db-read", kind: "db_operation", ref: "documentDb", config: { operation: "read", table: "documents" } },
            { id: "rag-return", kind: "return", ref: "", config: { value: { answer: "Relevant answer" } } },
          ],
        },
      },
    ],
    edges: [{ id: "rag-fn-edge", source: "rag-start", target: "rag-fn", type: "step" }],
  }),
  agent: { nodes: [], edges: [] },
});

const ecommerceCrudGraphs = (): Record<WorkspaceTab, GraphState> => ({
  api: cloneGraph({
    nodes: [
      {
        id: "orders-api-list",
        type: "api_binding",
        position: { x: 120, y: 60 },
        data: {
          kind: "api_binding",
          id: "listOrdersApi",
          label: "List Orders API",
          protocol: "rest",
          apiType: "openapi",
          method: "GET",
          route: "/api/orders",
          request: { pathParams: [], queryParams: [], headers: [], body: { contentType: "application/json", schema: [] } },
          responses: { success: { statusCode: 200, schema: [{ name: "orders", type: "array" }] }, error: { statusCode: 500, schema: [{ name: "message", type: "string" }] } },
          security: { type: "bearer", scopes: [] },
          rateLimit: { enabled: false, requests: 100, window: "minute" },
          version: "v1",
          deprecated: false,
          tables: [],
          tableRelationships: [],
          processRef: "ordersApiHandler",
          description: "Returns paginated order list",
        },
      },
      {
        id: "orders-api-create",
        type: "api_binding",
        position: { x: 120, y: 240 },
        data: {
          kind: "api_binding",
          id: "createOrderApi",
          label: "Create Order API",
          protocol: "rest",
          apiType: "openapi",
          method: "POST",
          route: "/api/orders",
          request: { pathParams: [], queryParams: [], headers: [], body: { contentType: "application/json", schema: [{ name: "customerId", type: "string", required: true }] } },
          responses: { success: { statusCode: 201, schema: [{ name: "orderId", type: "string" }] }, error: { statusCode: 400, schema: [{ name: "message", type: "string" }] } },
          security: { type: "bearer", scopes: [] },
          rateLimit: { enabled: false, requests: 100, window: "minute" },
          version: "v1",
          deprecated: false,
          tables: [],
          tableRelationships: [],
          processRef: "ordersApiHandler",
          description: "Creates a new order",
        },
      },
      {
        id: "orders-api-process",
        type: "process",
        position: { x: 450, y: 150 },
        data: {
          kind: "process",
          id: "ordersApiHandler",
          label: "Orders API Handler",
          processType: "function_block",
          execution: "sync",
          description: "Imports orders domain workflows",
          inputs: [],
          outputs: { success: [{ name: "orders", type: "array" }], error: [{ name: "message", type: "string" }] },
          steps: [{ id: "orders-ref", kind: "ref", ref: "ordersDomainFlow", config: {} }],
        },
      },
    ],
    edges: [
      { id: "orders-edge-1", source: "orders-api-list", target: "orders-api-process", type: "step" },
      { id: "orders-edge-2", source: "orders-api-create", target: "orders-api-process", type: "step" },
    ],
  }),
  database: cloneGraph({
    nodes: [
      {
        id: "orders-db",
        type: "database",
        position: { x: 200, y: 120 },
        data: {
          kind: "database",
          id: "ordersDb",
          label: "Orders Database",
          dbType: "sql",
          engine: "postgres",
          capabilities: { crud: true, transactions: true, joins: true, aggregations: true, indexes: true, constraints: true, pagination: true },
          performance: { connectionPool: { min: 2, max: 20, timeout: 30 }, readReplicas: { count: 0, regions: [] }, caching: { enabled: false, strategy: "", ttl: 300 }, sharding: { enabled: false, strategy: "", partitionKey: "" } },
          backup: { schedule: "daily", retention: { days: 7, maxVersions: 30 }, pointInTimeRecovery: true, multiRegion: { enabled: false, regions: [] } },
          costEstimation: { storageGb: 10, estimatedIOPS: 150, backupSizeGb: 3, replicaCount: 0 },
          security: { roles: [], encryption: { atRest: true, inTransit: true }, network: { vpcId: "", allowedIPs: [] }, auditLogging: true },
          monitoring: { thresholds: { cpuPercent: 80, memoryPercent: 80, connectionCount: 200, queryLatencyMs: 250 }, alerts: [], slaTargets: { uptimePercent: 99.9, maxLatencyMs: 300 } },
          environments: {
            dev: { connectionString: "", provider: { region: "" }, performanceTier: "small", overrides: { enabled: false } },
            staging: { connectionString: "", provider: { region: "" }, performanceTier: "medium", overrides: { enabled: false } },
            production: { connectionString: "", provider: { region: "" }, performanceTier: "large", overrides: { enabled: false } },
          },
          schemas: ["public"],
          tables: [
            { name: "orders", fields: [{ name: "id", type: "uuid", required: true, isPrimary: true }, { name: "customerId", type: "uuid", required: true }, { name: "status", type: "string", required: true }] },
            { name: "order_items", fields: [{ name: "id", type: "uuid", required: true, isPrimary: true }, { name: "orderId", type: "uuid", required: true }, { name: "sku", type: "string", required: true }] },
          ],
          schemaHistory: [],
          queries: [],
          seeds: [],
          migrations: [],
          relationships: [],
          queryWorkbench: { query: "", ormTarget: "prisma", mockRows: 5 },
          description: "Stores orders and line items",
        },
      },
    ],
    edges: [],
  }),
  functions: cloneGraph({
    nodes: [
      {
        id: "orders-start",
        type: "process",
        position: { x: 140, y: 110 },
        data: {
          kind: "process",
          id: "ordersStart",
          label: "Start Function",
          processType: "start_function",
          execution: "sync",
          description: "Entry point for order workflows",
          inputs: [],
          outputs: { success: [], error: [] },
          steps: [],
        },
      },
      {
        id: "orders-domain",
        type: "process",
        position: { x: 450, y: 110 },
        data: {
          kind: "process",
          id: "ordersDomainFlow",
          label: "Orders Domain Flow",
          processType: "function_block",
          execution: "sync",
          description: "Reads and writes orders data",
          inputs: [{ name: "customerId", type: "string", required: false }],
          outputs: { success: [{ name: "orders", type: "array" }], error: [{ name: "message", type: "string" }] },
          steps: [
            { id: "orders-db-read", kind: "db_operation", ref: "ordersDb", config: { operation: "read", table: "orders" } },
            { id: "orders-return", kind: "return", ref: "", config: { value: { orders: [] } } },
          ],
        },
      },
    ],
    edges: [{ id: "orders-fn-edge", source: "orders-start", target: "orders-domain", type: "step" }],
  }),
  agent: { nodes: [], edges: [] },
});

export const WORKSPACE_TEMPLATES: WorkspaceTemplateDefinition[] = [
  { id: "blank", label: "Blank Canvas", description: "Start with an empty multi-workspace studio." },
  { id: "hello_world_api", label: "Hello World API", description: "Single endpoint + function block starter." },
  { id: "saas_auth", label: "SaaS Auth", description: "Login API, auth functions, and user/session schema." },
  { id: "rag_pipeline", label: "AI RAG Pipeline", description: "Query API, retrieval function, document store, and indexing queue." },
  { id: "ecommerce_crud", label: "E-commerce CRUD", description: "Orders CRUD starter with domain flow and relational schema." },
];

export function buildWorkspaceTemplateGraphs(
  templateId: WorkspaceTemplateId,
): Record<WorkspaceTab, GraphState> {
  const templates: Record<WorkspaceTemplateId, () => Record<WorkspaceTab, GraphState>> = {
    blank: blankGraphs,
    hello_world_api: helloWorldGraphs,
    saas_auth: saasAuthGraphs,
    rag_pipeline: ragPipelineGraphs,
    ecommerce_crud: ecommerceCrudGraphs,
  };

  return templates[templateId]();
}
