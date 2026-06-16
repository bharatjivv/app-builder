import { create } from "zustand";
import type { InspectorTab } from "@/types";

interface AppStore {
  selectedAppId: string | null;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: InspectorTab;
  simulateError: boolean;

  setSelectedAppId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  setMobilePanelOpen: (open: boolean) => void;
  toggleMobilePanel: () => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
  setSimulateError: (v: boolean) => void;
}

export const useStore = create<AppStore>((set) => ({
  selectedAppId: "app-1",
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: "Config",
  simulateError: false,

  setSelectedAppId: (id) => set({ selectedAppId: id, selectedNodeId: null }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),
  toggleMobilePanel: () =>
    set((state) => ({ isMobilePanelOpen: !state.isMobilePanelOpen })),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
  setSimulateError: (v) => set({ simulateError: v }),
}));
