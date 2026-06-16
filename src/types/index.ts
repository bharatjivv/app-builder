export type NodeStatus = "Healthy" | "Degraded" | "Down";
export type NodeType = "service" | "database";
export type InspectorTab = "Config" | "Runtime";

export interface NodeData {
  label: string;
  description?: string;
  status: NodeStatus;
  nodeType: NodeType;
  cpuValue: number;
  cost: string;
  cpu: number;
  memory: number;
  disk: number;
  region: number;
  activeMetric: "CPU" | "Memory" | "Disk" | "Region";
}

export interface AppItem {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface GraphData {
  nodes: import("@xyflow/react").Node<NodeData>[];
  edges: import("@xyflow/react").Edge[];
}
