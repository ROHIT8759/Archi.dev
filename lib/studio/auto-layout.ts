import dagre from "dagre";
import { Edge, Node } from "@xyflow/react";

const DEFAULT_NODE_WIDTH = 280;
const DEFAULT_NODE_HEIGHT = 164;

const nodeDimensionsByType: Record<string, { width: number; height: number }> = {
  process: { width: 280, height: 220 },
  database: { width: 300, height: 210 },
  queue: { width: 240, height: 150 },
  api_binding: { width: 290, height: 220 },
  api_endpoint: { width: 250, height: 150 },
  infra: { width: 230, height: 150 },
  service_boundary: { width: 280, height: 170 },
};

function getNodeDimensions(node: Node): { width: number; height: number } {
  const fromMeasured = (node as Node & {
    measured?: { width?: number; height?: number };
    width?: number;
    height?: number;
  }).measured;
  const width =
    fromMeasured?.width ||
    (node as Node & { width?: number }).width ||
    nodeDimensionsByType[node.type || ""]?.width ||
    DEFAULT_NODE_WIDTH;
  const height =
    fromMeasured?.height ||
    (node as Node & { height?: number }).height ||
    nodeDimensionsByType[node.type || ""]?.height ||
    DEFAULT_NODE_HEIGHT;

  return { width, height };
}

export function autoLayoutNodes(nodes: Node[], edges: Edge[]): Node[] {
  if (nodes.length === 0) return nodes;

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: "LR",
    align: "UL",
    nodesep: 60,
    ranksep: 120,
    marginx: 24,
    marginy: 24,
  });

  for (const node of nodes) {
    const { width, height } = getNodeDimensions(node);
    graph.setNode(node.id, { width, height });
  }

  for (const edge of edges) {
    if (nodes.some((node) => node.id === edge.source) && nodes.some((node) => node.id === edge.target)) {
      graph.setEdge(edge.source, edge.target);
    }
  }

  dagre.layout(graph);

  return nodes.map((node) => {
    const position = graph.node(node.id) as { x: number; y: number } | undefined;
    if (!position) return node;
    const { width, height } = getNodeDimensions(node);
    return {
      ...node,
      position: {
        x: Math.round(position.x - width / 2),
        y: Math.round(position.y - height / 2),
      },
    };
  });
}
