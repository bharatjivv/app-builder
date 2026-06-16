import { http, HttpResponse } from "msw";
import { APPS, GRAPHS } from "./data";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const handlers = [
  http.get("/mock/apps", async () => {
    await delay(400);
    return HttpResponse.json(APPS);
  }),

  http.get("/mock/apps/:appId/graph", async ({ params, request }) => {
    const url = new URL(request.url);
    const simulateError = url.searchParams.get("error") === "true";

    await delay(600);

    if (simulateError) {
      return HttpResponse.json(
        { error: "Failed to load graph data" },
        { status: 500 }
      );
    }

    const graph = GRAPHS[params.appId as string];
    if (!graph) {
      return HttpResponse.json({ error: "App not found" }, { status: 404 });
    }
    return HttpResponse.json(graph);
  }),
];
