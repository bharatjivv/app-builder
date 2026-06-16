import {
  LayoutDashboard,
  GitBranch,
  Box,
  BarChart2,
  Layers,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: GitBranch, label: "Graph", active: true },
  { icon: Box, label: "Services", active: false },
  { icon: Layers, label: "Deployments", active: false },
  { icon: BarChart2, label: "Metrics", active: false },
];

export function LeftRail() {
  return (
    <aside
      className="w-12 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-3 gap-1 shrink-0"
      data-testid="left-rail"
    >
      <div className="flex-1 flex flex-col items-center gap-1">
        {navItems.map(({ icon: Icon, label, active }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-lg",
                  active
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-testid={`nav-${label.toLowerCase()}`}
              >
                <Icon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
            data-testid="nav-help"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Help</p>
        </TooltipContent>
      </Tooltip>
    </aside>
  );
}
