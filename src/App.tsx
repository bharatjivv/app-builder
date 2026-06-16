import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactFlowProvider } from "@xyflow/react";
import { TopBar } from "@/components/layout/TopBar";
import { LeftRail } from "@/components/layout/LeftRail";
import { RightPanel } from "@/components/layout/RightPanel";
import { FlowCanvas } from "@/components/canvas/FlowCanvas";
import { useEffect, useCallback } from "react";
import { useStore } from "@/store/useStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { toggleMobilePanel } = useStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        // Fit view is handled in TopBar via ReactFlow hook
      }
      if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleMobilePanel();
      }
    },
    [toggleMobilePanel]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background dark">
      <ReactFlowProvider>
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <LeftRail />
          <FlowCanvas />
          <RightPanel />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
