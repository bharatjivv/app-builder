import { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ServiceNode } from "./ServiceNode";
import { useStore } from "@/store/useStore";
import { useGraph } from "@/hooks/useApps";
import type { NodeData } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const nodeTypes = { serviceNode: ServiceNode };

const DEFAULT_STATUSES: NodeData["status"][] = ["Healthy", "Degraded", "Down"];

function FlowContent() {
  const { selectedAppId, setSelectedNodeId, simulateError } = useStore();
  const { data: graphData, isLoading, isError, refetch } = useGraph(selectedAppId, simulateError);
  const { fitView } = useReactFlow();

  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const fitted = useRef(false);

  useEffect(() => {
    if (graphData) {
      setNodes(graphData.nodes as Node<NodeData>[]);
      setEdges(graphData.edges);
      fitted.current = false;
    }
  }, [graphData]);

  useEffect(() => {
    if (nodes.length > 0 && !fitted.current) {
      fitted.current = true;
      setTimeout(() => fitView({ padding: 0.15, duration: 400 }), 50);
    }
  }, [nodes, fitView]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds) as Node<NodeData>[]),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        setNodes((nds) => nds.filter((n) => !n.selected));
        setEdges((eds) =>
          eds.filter((e) => {
            const selectedNodeIds = nodes
              .filter((n) => n.selected)
              .map((n) => n.id);
            return (
              !selectedNodeIds.includes(e.source) &&
              !selectedNodeIds.includes(e.target)
            );
          })
        );
        setSelectedNodeId(null);
      }
    },
    [nodes, setSelectedNodeId]
  );

  const addNode = useCallback(() => {
    const id = `custom-${Date.now()}`;
    const statuses = DEFAULT_STATUSES;
    const newNode: Node<NodeData> = {
      id,
      type: "serviceNode",
      position: {
        x: Math.random() * 300 + 100,
        y: Math.random() * 200 + 100,
      },
      data: {
        label: "New Service",
        description: "",
        status: statuses[Math.floor(Math.random() * statuses.length)],
        nodeType: "service",
        cpuValue: 0,
        cost: "$0.01/HR",
        cpu: 0.01,
        memory: 0.02,
        disk: 5.0,
        region: 1,
        activeMetric: "CPU",
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading graph...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex-1 flex items-center justify-center bg-background"
        data-testid="graph-error"
      >
        <div className="flex flex-col items-center gap-3 text-center max-w-xs">
          <AlertCircle className="w-10 h-10 text-destructive" />
          <p className="text-sm font-medium text-foreground">
            Failed to load graph
          </p>
          <p className="text-xs text-muted-foreground">
            There was an error fetching the graph data. Toggle off the error
            switch to retry.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            data-testid="button-retry-graph"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 relative outline-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
      data-testid="flow-canvas"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={null}
        className="bg-background"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="hsl(220 14% 22%)"
        />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            const d = node.data as NodeData;
            return d.status === "Healthy"
              ? "#34d399"
              : d.status === "Degraded"
                ? "#fbbf24"
                : "#f87171";
          }}
          maskColor="hsl(220 16% 10% / 0.8)"
        />
      </ReactFlow>

      {/* Add node FAB */}
      <Button
        size="icon"
        className="absolute bottom-4 right-4 w-10 h-10 rounded-full shadow-lg z-10"
        onClick={addNode}
        title="Add node"
        data-testid="button-add-node"
      >
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
}

export function FlowCanvas() {
  return (
    <div className="flex-1 flex overflow-hidden">
      <FlowContent />
    </div>
  );
}
