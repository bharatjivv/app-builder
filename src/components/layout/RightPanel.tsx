import { X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { AppList } from "./AppList";
import { NodeInspector } from "@/components/inspector/NodeInspector";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RightPanel() {
  const { selectedNodeId, setSelectedNodeId, isMobilePanelOpen, setMobilePanelOpen } =
    useStore();

  return (
    <>
      {/* Mobile overlay */}
      {isMobilePanelOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobilePanelOpen(false)}
        />
      )}

      {/* Panel */}
      <aside
        className={cn(
          "w-72 bg-card border-l border-card-border flex flex-col overflow-hidden z-30 transition-transform duration-300",
          "lg:static lg:translate-x-0",
          isMobilePanelOpen
            ? "fixed right-0 top-0 bottom-0 translate-x-0"
            : "fixed right-0 top-0 bottom-0 translate-x-full lg:translate-x-0"
        )}
        data-testid="right-panel"
      >
        {/* Mobile close */}
        <div className="lg:hidden flex items-center justify-between p-3 border-b border-border">
          <span className="text-sm font-medium">Panel</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setMobilePanelOpen(false)}
            data-testid="button-close-panel"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Node inspector */}
        {selectedNodeId ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-3 border-b border-border shrink-0">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Inspector
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setSelectedNodeId(null)}
                data-testid="button-close-inspector"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <NodeInspector nodeId={selectedNodeId} />
            </ScrollArea>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <AppList />
          </ScrollArea>
        )}
      </aside>
    </>
  );
}
