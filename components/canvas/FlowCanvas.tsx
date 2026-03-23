"use client";

import React, { ComponentType, useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Node,
  NodeTypes,
  EdgeTypes,
  DefaultEdgeOptions,
  NodeProps,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { Hand, LayoutGrid, MousePointer2 } from "lucide-react";
import "@xyflow/react/dist/style.css";
import { useStore } from "@/store/useStore";
import { ProcessNode } from "./nodes/ProcessNode";
import { DatabaseNode } from "./nodes/DatabaseNode";
import { QueueNode } from "./nodes/QueueNode";
import { ApiBindingNode } from "./nodes/ApiBindingNode";
import { ApiEndpointNode } from "./nodes/ApiEndpointNode";
import { InfraNode } from "./nodes/InfraNode";
import { ServiceBoundaryNode } from "./nodes/ServiceBoundaryNode";
import { StepEdge } from "./edges/StepEdge";
import { ContextMenu } from "./ContextMenu";

function withValidationBadge(
  Wrapped: ComponentType<NodeProps>,
): ComponentType<NodeProps> {
  return function ValidationBadgeNode(props: NodeProps) {
    const issueCount = useStore(
      (state) =>
        state.validationIssues.filter((issue) => issue.nodeId === props.id).length,
    );

    return (
      <div style={{ position: "relative" }}>
        <Wrapped {...props} />
        {issueCount > 0 && (
          <div
            title={`${issueCount} validation issue${issueCount !== 1 ? "s" : ""}`}
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              minWidth: 20,
              height: 20,
              borderRadius: 999,
              padding: "0 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ef4444",
              color: "white",
              fontSize: 10,
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(0,0,0,0.28)",
              border: "1px solid rgba(255,255,255,0.25)",
              pointerEvents: "none",
            }}
          >
            {issueCount}
          </div>
        )}
      </div>
    );
  };
}

const nodeTypes: NodeTypes = {
  process: withValidationBadge(ProcessNode as unknown as ComponentType<NodeProps>),
  database: withValidationBadge(DatabaseNode as unknown as ComponentType<NodeProps>),
  queue: withValidationBadge(QueueNode as unknown as ComponentType<NodeProps>),
  api_binding: withValidationBadge(ApiBindingNode as unknown as ComponentType<NodeProps>),
  api_endpoint: withValidationBadge(ApiEndpointNode as unknown as ComponentType<NodeProps>),
  infra: withValidationBadge(InfraNode as unknown as ComponentType<NodeProps>),
  service_boundary: withValidationBadge(ServiceBoundaryNode as unknown as ComponentType<NodeProps>),
};

const edgeTypes: EdgeTypes = {
  step: StepEdge,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "step",
  animated: false,
};

interface ContextMenuState {
  x: number;
  y: number;
  flowPosition: { x: number; y: number };
}

function FlowCanvasInner() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    focusNodeId,
    setFocusNodeId,
    autoLayoutCurrentGraph,
  } = useStore();
  const { screenToFlowPosition, setNodes, fitView } = useReactFlow();
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [interactionMode, setInteractionMode] = useState<"select" | "pan">(
    "select",
  );
  const [showMiniMap, setShowMiniMap] = useState(false);

  // When a node is focused from the error modal: select it and pan to it
  useEffect(() => {
    if (!focusNodeId) return;
    setNodes((nds: Node[]) =>
      nds.map((n: Node) => ({
        ...n,
        selected: n.id === focusNodeId,
      })),
    );
    const timer = setTimeout(() => {
      fitView({ nodes: [{ id: focusNodeId }], duration: 500, padding: 0.4 });
      setFocusNodeId(null);
    }, 60);
    return () => clearTimeout(timer);
  }, [focusNodeId, setFocusNodeId, setNodes, fitView]);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        flowPosition,
      });
    },
    [screenToFlowPosition],
  );

  const handleAddNode = useCallback(
    (kind: string, position: { x: number; y: number }) => {
      addNode(kind as Parameters<typeof addNode>[0], position);
    },
    [addNode],
  );

  return (
    <div
      className="h-full w-full"
      onContextMenu={handleContextMenu}
      style={{ position: "relative" }}
    >
      <div
        className="canvas-hint-card workspace-fade-up"
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 10,
          display: "grid",
          gap: 8,
          padding: 10,
          borderRadius: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
              Canvas controls
            </div>
            <div style={{ fontSize: 12, color: "var(--secondary)" }}>
              {nodes.length} blocks · {edges.length} links
            </div>
          </div>
          <span className="studio-badge">
            {interactionMode === "select" ? "Select mode" : "Pan mode"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          type="button"
          onClick={() => setInteractionMode("select")}
          title="Select blocks"
          aria-label="Select mode"
          style={{
            border: "1px solid color-mix(in srgb, var(--border) 88%, transparent)",
            borderRadius: 10,
            width: 34,
            height: 34,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 0,
            cursor: "pointer",
            background:
              interactionMode === "select"
                ? "linear-gradient(135deg, color-mix(in srgb, var(--primary) 20%, var(--floating) 80%), color-mix(in srgb, var(--primary) 10%, var(--panel) 90%))"
                : "transparent",
            color:
              interactionMode === "select" ? "var(--foreground)" : "var(--muted)",
            boxShadow: interactionMode === "select" ? "var(--shadow-glow)" : "none",
          }}
        >
          <MousePointer2 size={15} style={{ display: "block" }} />
        </button>
        <button
          type="button"
          onClick={() => setInteractionMode("pan")}
          title="Pan canvas"
          aria-label="Pan mode"
          style={{
            border: "1px solid color-mix(in srgb, var(--border) 88%, transparent)",
            borderRadius: 10,
            width: 34,
            height: 34,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 0,
            cursor: "pointer",
            background:
              interactionMode === "pan"
                ? "linear-gradient(135deg, color-mix(in srgb, var(--primary) 20%, var(--floating) 80%), color-mix(in srgb, var(--primary) 10%, var(--panel) 90%))"
                : "transparent",
            color:
              interactionMode === "pan" ? "var(--foreground)" : "var(--muted)",
            boxShadow: interactionMode === "pan" ? "var(--shadow-glow)" : "none",
          }}
        >
          <Hand size={15} style={{ display: "block" }} />
        </button>
        <button
          type="button"
          onClick={() => {
            autoLayoutCurrentGraph();
            requestAnimationFrame(() => {
              fitView({ duration: 350, padding: 0.24 });
            });
          }}
          title="Auto-layout graph"
          aria-label="Auto-layout graph"
          style={{
            border: "1px solid color-mix(in srgb, var(--border) 88%, transparent)",
            borderRadius: 10,
            width: 34,
            height: 34,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 0,
            cursor: "pointer",
            background: "transparent",
            color: "var(--secondary)",
          }}
        >
          <LayoutGrid size={15} style={{ display: "block" }} />
        </button>
        <button
          type="button"
          onClick={() => setShowMiniMap((prev) => !prev)}
          title={showMiniMap ? "Hide minimap" : "Show minimap"}
          aria-label={showMiniMap ? "Hide minimap" : "Show minimap"}
          style={{
            border: "1px solid color-mix(in srgb, var(--border) 88%, transparent)",
            borderRadius: 10,
            width: 34,
            height: 34,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 0,
            cursor: "pointer",
            background: showMiniMap
              ? "linear-gradient(135deg, color-mix(in srgb, var(--primary) 20%, var(--floating) 80%), color-mix(in srgb, var(--primary) 10%, var(--panel) 90%))"
              : "transparent",
            color: showMiniMap ? "var(--foreground)" : "var(--secondary)",
            boxShadow: showMiniMap ? "var(--shadow-glow)" : "none",
          }}
        >
          {showMiniMap ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block" }}
              aria-hidden="true"
            >
              <rect
                x="2"
                y="3"
                width="12"
                height="10"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <rect
                x="5.4"
                y="5.4"
                width="4.2"
                height="3.6"
                rx="0.8"
                stroke="currentColor"
                strokeWidth="1.1"
              />
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block" }}
              aria-hidden="true"
            >
              <rect
                x="2"
                y="3"
                width="12"
                height="10"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <rect
                x="5.4"
                y="5.4"
                width="4.2"
                height="3.6"
                rx="0.8"
                stroke="currentColor"
                strokeWidth="1.1"
              />
              <path
                d="M3 13L13.5 3"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        colorMode="dark"
        snapToGrid={true}
        snapGrid={[20, 20]}
        deleteKeyCode={["Backspace", "Delete"]}
        selectionKeyCode={["Shift"]}
        selectionOnDrag={interactionMode === "select"}
        panOnDrag={interactionMode === "pan"}
        onPaneClick={() => setContextMenu(null)}
      >
        <Background
          gap={20}
          size={1}
          variant={BackgroundVariant.Dots}
          style={{ background: "var(--background)" }}
        />
        <Background
          gap={120}
          size={1}
          variant={BackgroundVariant.Lines}
          color="rgba(121, 183, 255, 0.05)"
        />
        <Controls
          style={{
            background: "var(--floating)",
            borderColor: "var(--border)",
          }}
        />
        {showMiniMap && (
          <MiniMap
            style={{
              background: "var(--floating)",
              borderColor: "var(--border)",
            }}
            nodeColor={(node: { data?: { kind?: string; resourceType?: string } }) => {
              if (node.data?.kind === "database") return "#336791";
              if (node.data?.kind === "queue") return "#facc15";
              if (node.data?.kind === "api_binding") return "#a78bfa";
              if (node.data?.kind === "service_boundary") return "#fb7185";
              if (node.data?.kind === "infra") {
                switch (node.data?.resourceType) {
                  case "ec2":
                    return "#60a5fa";
                  case "lambda":
                    return "#facc15";
                  case "eks":
                    return "#34d399";
                  case "vpc":
                    return "#a78bfa";
                  case "s3":
                    return "#f97316";
                  case "rds":
                    return "#3b82f6";
                  case "load_balancer":
                    return "#22d3ee";
                  case "hpc":
                    return "#f472b6";
                  default:
                    return "#7c6cff";
                }
              }
              return "#7c6cff";
            }}
          />
        )}
      </ReactFlow>

      <div
        className="canvas-hint-card workspace-fade-up"
        style={{
          position: "absolute",
          right: 12,
          bottom: 12,
          zIndex: 8,
          borderRadius: 14,
          padding: "10px 12px",
          maxWidth: 260,
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 4 }}>
          Quick tip
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: "var(--secondary)" }}>
          Right-click anywhere to add a block near your cursor, then use auto-layout to clean up the graph.
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          flowPosition={contextMenu.flowPosition}
          onClose={() => setContextMenu(null)}
          onAddNode={handleAddNode}
        />
      )}
    </div>
  );
}

export default function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}
