import { useQuery } from "@tanstack/react-query";
import type { AppItem, GraphData } from "@/types";

async function fetchApps(): Promise<AppItem[]> {
  const res = await fetch("/mock/apps");
  if (!res.ok) throw new Error("Failed to fetch apps");
  return res.json() as Promise<AppItem[]>;
}

async function fetchGraph(
  appId: string,
  simulateError: boolean
): Promise<GraphData> {
  const url = `/mock/apps/${appId}/graph${simulateError ? "?error=true" : ""}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = (await res.json()) as { error: string };
    throw new Error(err.error ?? "Failed to fetch graph");
  }
  return res.json() as Promise<GraphData>;
}

export function useApps() {
  return useQuery({
    queryKey: ["apps"],
    queryFn: fetchApps,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGraph(appId: string | null, simulateError: boolean) {
  return useQuery({
    queryKey: ["graph", appId, simulateError],
    queryFn: () => fetchGraph(appId!, simulateError),
    enabled: !!appId,
    staleTime: 30 * 1000,
  });
}
