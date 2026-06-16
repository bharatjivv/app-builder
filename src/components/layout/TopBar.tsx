import { Maximize2, GitBranch, Bell, Settings, PanelRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCallback } from "react";

export function TopBar() {
  const { toggleMobilePanel, simulateError, setSimulateError } = useStore();
  const { fitView } = useReactFlow();

  const handleFit = useCallback(() => {
    fitView({ padding: 0.1, duration: 400 });
  }, [fitView]);

  return (
    <header
      className="h-12 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 shrink-0 z-10"
      data-testid="topbar"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            App Graph Builder
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-2">
          <Switch
            id="error-toggle"
            checked={simulateError}
            onCheckedChange={setSimulateError}
            data-testid="toggle-simulate-error"
          />
          <Label
            htmlFor="error-toggle"
            className="text-xs text-muted-foreground cursor-pointer"
          >
            Simulate error
          </Label>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleFit}
          title="Fit view (F)"
          data-testid="button-fit-view"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          data-testid="button-notifications"
        >
          <Bell className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          data-testid="button-settings"
        >
          <Settings className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 lg:hidden"
          onClick={toggleMobilePanel}
          data-testid="button-toggle-panel"
        >
          <PanelRight className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
