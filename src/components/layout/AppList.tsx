import { Search, Plus, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/store/useStore";
import { useApps } from "@/hooks/useApps";
import { cn } from "@/lib/utils";
import { useState } from "react";

const colorMap: Record<string, string> = {
  go: "bg-cyan-500",
  go2: "bg-cyan-600",
  java: "bg-orange-500",
  python: "bg-blue-500",
  ruby: "bg-red-500",
};

export function AppList() {
  const { selectedAppId, setSelectedAppId } = useStore();
  const { data: apps, isLoading, isError } = useApps();
  const [search, setSearch] = useState("");

  const filtered = apps?.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="flex flex-col h-full"
      data-testid="app-list"
    >
      <div className="p-3 border-b border-border shrink-0">
        <h2 className="text-base font-bold mb-3">Application</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
              data-testid="input-app-search"
            />
          </div>
          <Button
            size="icon"
            className="h-8 w-8 shrink-0"
            data-testid="button-add-app"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="p-2 flex flex-col gap-1">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        )}

        {isError && (
          <div className="p-4 text-sm text-destructive" data-testid="error-apps">
            Failed to load applications.
          </div>
        )}

        {filtered?.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedAppId(app.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
              selectedAppId === app.id
                ? "bg-accent text-foreground"
                : "text-foreground/80 hover:bg-accent/50"
            )}
            data-testid={`app-item-${app.id}`}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                colorMap[app.icon] ?? "bg-purple-600"
              )}
            >
              <span className="text-white text-xs font-bold uppercase">
                {app.name[0]}
              </span>
            </div>
            <span className="text-sm flex-1 truncate">{app.name}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
