import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import type { NodeData } from "@/types";
import { cn } from "@/lib/utils";

function StatusPill({ status }: { status: NodeData["status"] }) {
  return (
    <Badge
      className={cn(
        "text-xs font-medium border",
        status === "Healthy"
          ? "bg-emerald-400/15 text-emerald-400 border-emerald-400/30"
          : status === "Degraded"
            ? "bg-amber-400/15 text-amber-400 border-amber-400/30"
            : "bg-red-400/15 text-red-400 border-red-400/30"
      )}
      data-testid={`inspector-status-${status.toLowerCase()}`}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full inline-block mr-1.5",
          status === "Healthy"
            ? "bg-emerald-400"
            : status === "Degraded"
              ? "bg-amber-400"
              : "bg-red-400"
        )}
      />
      {status}
    </Badge>
  );
}

export function NodeInspector({ nodeId }: { nodeId: string }) {
  const { getNode, setNodes } = useReactFlow();
  const { activeInspectorTab, setActiveInspectorTab } = useStore();

  const node = getNode(nodeId);
  const data = node?.data as NodeData | undefined;

  const updateNodeData = useCallback(
    (patch: Partial<NodeData>) => {
      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...(n.data as NodeData), ...patch } }
            : n
        )
      );
    },
    [nodeId, setNodes]
  );

  if (!data) {
    return (
      <div className="p-4 text-sm text-muted-foreground">Node not found.</div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4" data-testid="node-inspector">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
            Service Node
          </p>
          <h3 className="text-base font-semibold">{data.label}</h3>
        </div>
        <StatusPill status={data.status} />
      </div>

      <Tabs
        value={activeInspectorTab}
        onValueChange={(v) =>
          setActiveInspectorTab(v as "Config" | "Runtime")
        }
      >
        <TabsList className="w-full">
          <TabsTrigger
            value="Config"
            className="flex-1"
            data-testid="tab-config"
          >
            Config
          </TabsTrigger>
          <TabsTrigger
            value="Runtime"
            className="flex-1"
            data-testid="tab-runtime"
          >
            Runtime
          </TabsTrigger>
        </TabsList>

        {/* Config tab */}
        <TabsContent value="Config" className="flex flex-col gap-3 mt-3">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="node-name"
              className="text-xs text-muted-foreground"
            >
              Name
            </Label>
            <Input
              id="node-name"
              value={data.label}
              onChange={(e) => updateNodeData({ label: e.target.value })}
              className="h-8 text-sm"
              data-testid="input-node-name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="node-desc"
              className="text-xs text-muted-foreground"
            >
              Description
            </Label>
            <Textarea
              id="node-desc"
              value={data.description ?? ""}
              onChange={(e) => updateNodeData({ description: e.target.value })}
              className="text-sm resize-none h-20"
              placeholder="Add a description..."
              data-testid="textarea-node-description"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Node Type</Label>
            <div className="text-sm px-3 py-1.5 bg-muted rounded-md capitalize text-muted-foreground">
              {data.nodeType}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Cost</Label>
            <div className="text-sm px-3 py-1.5 bg-muted rounded-md text-emerald-400 font-medium">
              {data.cost}
            </div>
          </div>
        </TabsContent>

        {/* Runtime tab */}
        <TabsContent value="Runtime" className="flex flex-col gap-3 mt-3">
          {/* Synced slider + numeric input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                CPU Usage (%)
              </Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={data.cpuValue}
                onChange={(e) => {
                  const v = Math.min(100, Math.max(0, Number(e.target.value)));
                  updateNodeData({ cpuValue: v });
                }}
                className="h-7 w-16 text-xs text-right"
                data-testid="input-cpu-value"
              />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={data.cpuValue}
              onChange={(e) =>
                updateNodeData({ cpuValue: Number(e.target.value) })
              }
              className="w-full"
              data-testid="slider-cpu-value"
            />
            <p className="text-xs text-muted-foreground text-right">
              {data.cpuValue}% utilization
            </p>
          </div>

          {/* Status selector */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <div className="flex gap-2">
              {(["Healthy", "Degraded", "Down"] as NodeData["status"][]).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => updateNodeData({ status: s })}
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-full border transition-colors",
                      data.status === s
                        ? s === "Healthy"
                          ? "bg-emerald-400/20 text-emerald-400 border-emerald-400/40"
                          : s === "Degraded"
                            ? "bg-amber-400/20 text-amber-400 border-amber-400/40"
                            : "bg-red-400/20 text-red-400 border-red-400/40"
                        : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground"
                    )}
                    data-testid={`button-status-${s.toLowerCase()}`}
                  >
                    {s}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "CPU", value: `${data.cpu} GB` },
              { label: "Memory", value: `${data.memory} GB` },
              { label: "Disk", value: `${data.disk} GB` },
              { label: "Region", value: String(data.region) },
            ].map((m) => (
              <div
                key={m.label}
                className="bg-muted rounded-lg p-2.5"
                data-testid={`metric-${m.label.toLowerCase()}`}
              >
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="text-sm font-semibold mt-0.5">{m.value}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
