import { memo, useCallback } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NodeData } from "@/types";
import { useStore } from "@/store/useStore";
function AwsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="28" fontSize="14" fontWeight="bold" fill="#FF9900" fontFamily="Arial">aws</text>
    </svg>
  );
}

function StatusBadge({ status }: { status: NodeData["status"] }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border",
        status === "Healthy"
          ? "text-emerald-400 border-emerald-400/40 bg-emerald-400/10"
          : status === "Degraded"
            ? "text-amber-400 border-amber-400/40 bg-amber-400/10"
            : "text-red-400 border-red-400/40 bg-red-400/10"
      )}
      data-testid={`status-${status.toLowerCase()}`}
    >
      {status === "Healthy" ? (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
      ) : (
        <span className="text-xs">⚠</span>
      )}
      {status === "Healthy" ? "Success" : status}
    </div>
  );
}

type ServiceNodeProps = NodeProps & { data: NodeData };

function ServiceNodeComponent({ id, data, selected }: ServiceNodeProps) {
  const { setSelectedNodeId } = useStore();

  const handleClick = useCallback(() => {
    setSelectedNodeId(id);
  }, [id, setSelectedNodeId]);

  const metrics: Array<{ label: NodeData["activeMetric"]; value: string }> = [
    { label: "CPU", value: `${data.cpu} GB` },
    { label: "Memory", value: `${data.memory} GB` },
    { label: "Disk", value: `${data.disk} GB` },
    { label: "Region", value: String(data.region) },
  ];

  const sliderFill = (data.cpuValue / 100) * 100;

  return (
    <div
      className={cn(
        "bg-card border rounded-xl p-3 w-64 cursor-pointer transition-all duration-150 shadow-lg",
        selected
          ? "border-primary shadow-[0_0_0_2px_hsl(217_91%_60%/0.4)]"
          : "border-card-border hover:border-muted"
      )}
      onClick={handleClick}
      data-testid={`node-${id}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!left-[-5px]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!right-[-5px]"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold",
              data.nodeType === "database" ? "bg-blue-600" : "bg-violet-600"
            )}
          >
            {data.nodeType === "database" ? "DB" : data.label[0].toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-foreground">
            {data.label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-emerald-400 border border-emerald-400/30 rounded px-1.5 py-0.5 bg-emerald-400/10">
            {data.cost}
          </span>
          <button
            className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            data-testid={`button-node-settings-${id}`}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metric tabs */}
      <div className="flex items-center gap-1 mb-2 flex-wrap">
        {metrics.map((m) => (
          <button
            key={m.label}
            className={cn(
              "text-xs px-2 py-0.5 rounded flex items-center gap-1 transition-colors",
              data.activeMetric === m.label
                ? "bg-foreground text-background font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
            data-testid={`metric-tab-${m.label.toLowerCase()}-${id}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Metric values row */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
        {metrics.map((m) => (
          <span key={m.label}>{m.value}</span>
        ))}
      </div>

      {/* Slider */}
      <div className="mb-2">
        <div className="relative">
          <input
            type="range"
            min={0}
            max={100}
            value={data.cpuValue}
            readOnly
            className="w-full"
            style={{
              background: `linear-gradient(to right, hsl(217 91% 60%), hsl(160 60% 45%), hsl(30 80% 55%) ${sliderFill}%, hsl(220 14% 25%) ${sliderFill}%)`,
            }}
            data-testid={`slider-node-${id}`}
          />
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-xs text-muted-foreground">
            {(data.cpuValue / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <StatusBadge status={data.status} />
        <AwsLogo className="w-10 h-auto opacity-80" />
      </div>
    </div>
  );
}

export const ServiceNode = memo(ServiceNodeComponent);
