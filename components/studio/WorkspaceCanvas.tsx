"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { PropertyInspector } from "@/components/panels/PropertyInspector";
import { DatabaseSchemaDesigner } from "@/components/panels/DatabaseSchemaDesigner";
import { DatabaseQueryBuilder } from "@/components/panels/DatabaseQueryBuilder";
import { useStore, type NodeKind } from "@/store/useStore";

const FlowCanvas = dynamic(() => import("@/components/canvas/FlowCanvas"), {
  ssr: false,
});

const STORAGE_KEYS = {
  leftSidebarCollapsed: "ermiz.leftSidebarCollapsed",
  rightSidebarCollapsed: "ermiz.rightSidebarCollapsed",
  leftSidebarWidth: "ermiz.leftSidebarWidth",
  inspectorWidth: "ermiz.inspectorWidth",
  dbPanelHeight: "ermiz.dbPanelHeight",
  dbSplitRatio: "ermiz.dbSplitRatio",
};

const DEFAULT_LEFT_WIDTH = 236;
const DEFAULT_INSPECTOR_WIDTH = 320;
const DEFAULT_DB_PANEL_HEIGHT = 340;
const DEFAULT_DB_SPLIT_RATIO = 0.55; // schema designer gets 55%
const clampLeftWidth = (value: number) =>
  Math.max(200, Math.min(420, value || DEFAULT_LEFT_WIDTH));
const clampInspectorWidth = (value: number) =>
  Math.max(260, Math.min(520, value || DEFAULT_INSPECTOR_WIDTH));
const clampDbHeight = (value: number) =>
  Math.max(120, Math.min(window.innerHeight * 0.75, value || DEFAULT_DB_PANEL_HEIGHT));
const clampSplitRatio = (value: number) =>
  Math.max(0.2, Math.min(0.8, value || DEFAULT_DB_SPLIT_RATIO));

export type SidebarItem = {
  kind: NodeKind;
  label: string;
  icon: string;
  hoverColor: string;
  mono?: boolean;
  hint?: string;
};

export type SidebarSection = {
  id: string;
  title: string;
  muted?: boolean;
  items: SidebarItem[];
};
export function WorkspaceCanvas({
  sections,
  flatList = false,
  showSearch = false,
  isDatabaseWorkspace = false,
}: {
  sections: SidebarSection[];
  flatList?: boolean;
  showSearch?: boolean;
  isDatabaseWorkspace?: boolean;
}) {
  const addNode = useStore((state) => state.addNode);
  const activeTab = useStore((state) => state.activeTab);
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const exportGraphs = useStore((state) => state.exportGraphs);
  const applyGraphPatch = useStore((state) => state.applyGraphPatch);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});
  const [componentSearch, setComponentSearch] = useState("");
  const [copilotPrompt, setCopilotPrompt] = useState("");
  const [copilotStatus, setCopilotStatus] = useState<string | null>(null);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(DEFAULT_LEFT_WIDTH);
  const [inspectorWidth, setInspectorWidth] = useState(DEFAULT_INSPECTOR_WIDTH);
  const [dbPanelHeight, setDbPanelHeight] = useState(DEFAULT_DB_PANEL_HEIGHT);
  const [dbSplitRatio, setDbSplitRatio] = useState(DEFAULT_DB_SPLIT_RATIO);
  const resizeStateRef = useRef<{
    side: "left" | "right" | "dbHeight" | "dbSplit" | null;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startRatio: number;
  }>({
    side: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startRatio: 0,
  });

  const flatItems = useMemo(
    () =>
      sections.flatMap((section) =>
        section.items.map((item, index) => ({
          ...item,
          key: `${section.id}-${item.kind}-${item.label}-${index}`,
          muted: section.muted ?? false,
        })),
      ),
    [sections],
  );

  const filteredFlatItems = useMemo(() => {
    if (!flatList) return flatItems;
    const query = componentSearch.trim().toLowerCase();
    if (!query) return flatItems;
    return flatItems.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.kind.toLowerCase().includes(query) ||
        (item.hint?.toLowerCase().includes(query) ?? false),
    );
  }, [componentSearch, flatItems, flatList]);

  const workspaceCopy = useMemo(() => {
    if (activeTab === "database") {
      return {
        eyebrow: "Data workspace",
        title: "Shape schemas, flows, and read patterns together",
        description: "Start from a database block, then connect interfaces, queues, and functions around it.",
        placeholder: "Add a subscriptions table with customer and status fields",
      };
    }
    if (activeTab === "functions") {
      return {
        eyebrow: "Function workspace",
        title: "Design the logic behind every interaction",
        description: "Model jobs, queue workers, and internal functions before wiring them into APIs or data systems.",
        placeholder: "Add a function to validate incoming webhook payloads",
      };
    }
    return {
      eyebrow: "API workspace",
      title: "Map the interfaces users and services will touch",
      description: "Drop in protocols, service boundaries, and infrastructure blocks to sketch the runtime shape of your system.",
      placeholder: "Create a Stripe webhook to update subscriptions",
    };
  }, [activeTab]);

  const availableItemCount = useMemo(
    () => sections.reduce((count, section) => count + section.items.length, 0),
    [sections],
  );

  const visibleItemCount = flatList ? filteredFlatItems.length : availableItemCount;
  const isCanvasEmpty = nodes.length === 0;

  const handleCopilotSubmit = async () => {
    const prompt = copilotPrompt.trim();
    if (!prompt || isCopilotLoading) return;

    setIsCopilotLoading(true);
    setCopilotStatus("Generating graph patch…");

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          activeTab,
          currentGraph: { nodes, edges },
          allGraphs: exportGraphs(),
        }),
      });

      const json = (await response.json()) as {
        error?: string;
        source?: "ai" | "heuristic";
        architecture?: {
          runtimeIssues?: Array<unknown>;
          serviceIssues?: Array<unknown>;
        };
        patch?: {
          summary?: string;
          nodes?: Array<Record<string, unknown>>;
          edges?: Array<Record<string, unknown>>;
        };
      };

      if (!response.ok || !json.patch) {
        setCopilotStatus(json.error ? `Copilot failed: ${json.error}` : "Copilot could not generate a patch.");
        return;
      }

      applyGraphPatch({
        nodes: (json.patch.nodes ?? []) as never,
        edges: (json.patch.edges ?? []) as never,
      });
      const runtimeIssueCount = json.architecture?.runtimeIssues?.length ?? 0;
      const serviceIssueCount = json.architecture?.serviceIssues?.length ?? 0;
      setCopilotStatus(
        `${json.patch.summary || "Canvas updated from prompt."}${
          json.source ? ` (${json.source})` : ""
        }${
          runtimeIssueCount || serviceIssueCount
            ? ` · context: ${runtimeIssueCount} runtime issue${runtimeIssueCount === 1 ? "" : "s"}, ${serviceIssueCount} service issue${serviceIssueCount === 1 ? "" : "s"}`
            : ""
        }`,
      );
      setCopilotPrompt("");
    } catch {
      setCopilotStatus("Copilot request failed. Please try again.");
    } finally {
      setIsCopilotLoading(false);
    }
  };

  useEffect(() => {
    // Load saved widths and collapsed states from localStorage after mount
    if (typeof window !== "undefined") {
      const isNarrow = window.matchMedia("(max-width: 1024px)").matches;

      const savedLeftCollapsed = localStorage.getItem(STORAGE_KEYS.leftSidebarCollapsed);
      const savedRightCollapsed = localStorage.getItem(STORAGE_KEYS.rightSidebarCollapsed);

      const nextLeftCollapsed = isNarrow ? true : savedLeftCollapsed === "1";
      const nextInspectorCollapsed = isNarrow ? true : savedRightCollapsed === "1";
      const storedLeftWidth = Number(localStorage.getItem(STORAGE_KEYS.leftSidebarWidth));
      const nextLeftWidth = storedLeftWidth
        ? clampLeftWidth(storedLeftWidth)
        : DEFAULT_LEFT_WIDTH;
      const storedInspectorWidth = Number(localStorage.getItem(STORAGE_KEYS.inspectorWidth));
      const nextInspectorWidth = storedInspectorWidth
        ? clampInspectorWidth(storedInspectorWidth)
        : DEFAULT_INSPECTOR_WIDTH;
      const storedDbHeight = Number(localStorage.getItem(STORAGE_KEYS.dbPanelHeight));
      const nextDbHeight = storedDbHeight
        ? clampDbHeight(storedDbHeight)
        : DEFAULT_DB_PANEL_HEIGHT;
      const storedDbSplit = Number(localStorage.getItem(STORAGE_KEYS.dbSplitRatio));
      const nextDbSplit = storedDbSplit
        ? clampSplitRatio(storedDbSplit)
        : DEFAULT_DB_SPLIT_RATIO;

      const frame = window.requestAnimationFrame(() => {
        setIsLeftSidebarCollapsed(nextLeftCollapsed);
        setIsInspectorCollapsed(nextInspectorCollapsed);
        setLeftSidebarWidth(nextLeftWidth);
        setInspectorWidth(nextInspectorWidth);
        setDbPanelHeight(nextDbHeight);
        setDbSplitRatio(nextDbSplit);
      });

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const state = resizeStateRef.current;
      if (!state.side) return;

      if (state.side === "left") {
        const nextWidth = Math.max(200, Math.min(420, state.startWidth + (event.clientX - state.startX)));
        setLeftSidebarWidth(nextWidth);
      } else if (state.side === "right") {
        const nextWidth = Math.max(260, Math.min(520, state.startWidth + (state.startX - event.clientX)));
        setInspectorWidth(nextWidth);
      } else if (state.side === "dbHeight") {
        // Drag upward = increase DB panel height
        const deltaY = state.startY - event.clientY;
        const nextHeight = Math.max(120, Math.min(window.innerHeight * 0.75, state.startHeight + deltaY));
        setDbPanelHeight(nextHeight);
      } else if (state.side === "dbSplit") {
        // Drag within the DB panel to adjust split
        const deltaY = event.clientY - state.startY;
        const totalH = state.startHeight;
        const nextRatio = Math.max(0.2, Math.min(0.8, state.startRatio + deltaY / totalH));
        setDbSplitRatio(nextRatio);
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      const state = resizeStateRef.current;
      // Persist DB panel sizes — recompute final value from ref to avoid stale closure
      if (state.side === "dbHeight") {
        const deltaY = state.startY - event.clientY;
        const finalH = Math.max(120, Math.min(window.innerHeight * 0.75, state.startHeight + deltaY));
        try { localStorage.setItem(STORAGE_KEYS.dbPanelHeight, String(finalH)); } catch { /* ignore */ }
      } else if (state.side === "dbSplit") {
        const deltaY = event.clientY - state.startY;
        const finalR = Math.max(0.2, Math.min(0.8, state.startRatio + deltaY / state.startHeight));
        try { localStorage.setItem(STORAGE_KEYS.dbSplitRatio, String(finalR)); } catch { /* ignore */ }
      }
      resizeStateRef.current.side = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const updateViewport = (event?: MediaQueryListEvent) => {
      const isNarrow = event ? event.matches : mediaQuery.matches;
      setIsNarrowViewport(isNarrow);
    };
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.leftSidebarCollapsed,
        isLeftSidebarCollapsed ? "1" : "0",
      );
      localStorage.setItem(
        STORAGE_KEYS.rightSidebarCollapsed,
        isInspectorCollapsed ? "1" : "0",
      );
      localStorage.setItem(STORAGE_KEYS.leftSidebarWidth, String(leftSidebarWidth));
      localStorage.setItem(STORAGE_KEYS.inspectorWidth, String(inspectorWidth));
    } catch {
      // ignore storage errors
    }
  }, [isLeftSidebarCollapsed, isInspectorCollapsed, leftSidebarWidth, inspectorWidth]);

  useEffect(() => {
    const handleLayoutShortcuts = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      const key = event.key.toLowerCase();
      if (key === "b") {
        event.preventDefault();
        setIsLeftSidebarCollapsed((prev) => !prev);
      }
      if (key === "i") {
        event.preventDefault();
        setIsInspectorCollapsed((prev) => !prev);
      }
      if (key === "0") {
        event.preventDefault();
        setIsLeftSidebarCollapsed(false);
        setIsInspectorCollapsed(false);
        setLeftSidebarWidth(DEFAULT_LEFT_WIDTH);
        setInspectorWidth(DEFAULT_INSPECTOR_WIDTH);
      }
    };
    window.addEventListener("keydown", handleLayoutShortcuts);
    return () => {
      window.removeEventListener("keydown", handleLayoutShortcuts);
    };
  }, []);

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0, height: "100%", overflow: "hidden", position: "relative" }}>
      {isNarrowViewport && (!isLeftSidebarCollapsed || !isInspectorCollapsed) && (
        <button
          type="button"
          aria-label="Close open panel"
          onClick={() => {
            setIsLeftSidebarCollapsed(true);
            setIsInspectorCollapsed(true);
          }}
          style={{
            position: "absolute",
            inset: 0,
            border: "none",
            margin: 0,
            padding: 0,
            background: "rgba(8, 12, 18, 0.48)",
            zIndex: 24,
            cursor: "pointer",
          }}
        />
      )}

      {isNarrowViewport && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            display: "flex",
            justifyContent: "space-between",
            zIndex: 26,
            pointerEvents: "none",
          }}
        >
          <button
            type="button"
            aria-label={isLeftSidebarCollapsed ? "Open component library" : "Close component library"}
            title={isLeftSidebarCollapsed ? "Open library" : "Close library"}
            onClick={() => {
              setIsLeftSidebarCollapsed((prev) => !prev);
              setIsInspectorCollapsed(true);
            }}
            className="canvas-hint-card"
            style={{
              minWidth: 44,
              height: 38,
              border: "1px solid color-mix(in srgb, var(--border) 88%, transparent)",
              background: isLeftSidebarCollapsed
                ? "rgba(8, 16, 28, 0.78)"
                : "color-mix(in srgb, var(--primary) 20%, rgba(8, 16, 28, 0.9) 80%)",
              color: isLeftSidebarCollapsed ? "var(--secondary)" : "var(--foreground)",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1,
              cursor: "pointer",
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 12px",
              flexShrink: 0,
            }}
          >
            Library
          </button>
          <button
            type="button"
            aria-label={isInspectorCollapsed ? "Open inspector" : "Close inspector"}
            title={isInspectorCollapsed ? "Open inspector" : "Close inspector"}
            onClick={() => {
              setIsInspectorCollapsed((prev) => !prev);
              setIsLeftSidebarCollapsed(true);
            }}
            className="canvas-hint-card"
            style={{
              minWidth: 46,
              height: 38,
              border: "1px solid color-mix(in srgb, var(--border) 88%, transparent)",
              background: isInspectorCollapsed
                ? "rgba(8, 16, 28, 0.78)"
                : "color-mix(in srgb, var(--primary) 20%, rgba(8, 16, 28, 0.9) 80%)",
              color: isInspectorCollapsed ? "var(--secondary)" : "var(--foreground)",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1,
              cursor: "pointer",
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 12px",
              flexShrink: 0,
            }}
          >
            Inspector
          </button>
        </div>
      )}

      {isLeftSidebarCollapsed ? (
        <button
          type="button"
          onClick={() => setIsLeftSidebarCollapsed(false)}
          aria-label="Expand left sidebar"
          className="canvas-hint-card"
          style={{
            width: 28,
            flexShrink: 0,
            borderRight: "1px solid color-mix(in srgb, var(--border) 84%, transparent)",
            background: "rgba(8, 16, 28, 0.7)",
            color: "var(--secondary)",
            cursor: "pointer",
            display: isNarrowViewport ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ›
        </button>
      ) : (
        <div
          style={{
            position: isNarrowViewport ? "absolute" : "relative",
            top: isNarrowViewport ? 0 : undefined,
            left: 0,
            bottom: isNarrowViewport ? 0 : undefined,
            display: "flex",
            height: isNarrowViewport ? undefined : "100%",
            maxHeight: isNarrowViewport ? undefined : "100%",
            minHeight: 0,
            zIndex: isNarrowViewport ? 26 : 20,
          }}
        >
          <button
            type="button"
            onClick={() => setIsLeftSidebarCollapsed(true)}
            aria-label="Collapse left sidebar"
            className="canvas-hint-card"
            style={{
              position: "absolute",
              top: "50%",
              right: isNarrowViewport ? 8 : -12,
              transform: "translateY(-50%)",
              zIndex: 30,
              border: "1px solid color-mix(in srgb, var(--border) 88%, transparent)",
              background: "rgba(8, 16, 28, 0.84)",
              color: "var(--secondary)",
              borderRadius: 10,
              width: 28,
              height: 28,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ‹
          </button>

          <aside
            className="sidebar-scroll sidebar-panel"
            onWheel={(e) => {
              // Prevent canvas zoom while scrolling sidebar, but allow native scroll
              const target = e.currentTarget;
              const isScrollable = target.scrollHeight > target.clientHeight;
              if (isScrollable) {
                e.stopPropagation();
              }
            }}
            style={{
              width: leftSidebarWidth,
              maxWidth: isNarrowViewport ? "calc(100vw - 32px)" : undefined,
              flexShrink: 0,
              height: "100%",
              maxHeight: "100%",
              minHeight: 0,
              borderRight: "1px solid color-mix(in srgb, var(--border) 84%, transparent)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0)), color-mix(in srgb, var(--panel) 95%, #08111d 5%)",
              paddingTop: isNarrowViewport ? 48 : 12,
              paddingRight: 10,
              paddingBottom: 16,
              paddingLeft: 12,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              scrollbarGutter: "stable",
            }}
          >
            <div className="studio-card-raised" style={{ borderRadius: 18, padding: 14, display: "grid", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <span className="studio-badge">{workspaceCopy.eyebrow}</span>
                <span className="studio-badge">{nodes.length} blocks</span>
              </div>
              <div>
                <div style={{ fontSize: 17, lineHeight: 1.2, fontWeight: 700, marginBottom: 6 }}>
                  {workspaceCopy.title}
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.55, color: "var(--muted)" }}>
                  {workspaceCopy.description}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span className="status-pill">
                  <span className="status-dot success" />
                  {visibleItemCount} blocks available
                </span>
                <span className="status-pill">
                  <span className={`status-dot ${isCanvasEmpty ? "warning" : "success"}`} />
                  {isCanvasEmpty ? "Start by placing a block" : `${edges.length} links mapped`}
                </span>
              </div>
            </div>

            <div
              className="studio-card"
              style={{
                borderRadius: 16,
                padding: 12,
                display: "grid",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                    Canvas Copilot
                  </div>
                  <div style={{ fontSize: 12, color: "var(--secondary)", marginTop: 3 }}>
                    Describe a change and apply it directly to the canvas.
                  </div>
                </div>
                <span style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{activeTab}</span>
              </div>
              <textarea
                value={copilotPrompt}
                onChange={(event) => setCopilotPrompt(event.target.value)}
                rows={4}
                placeholder={workspaceCopy.placeholder}
                style={{
                  width: "100%",
                  resize: "vertical",
                  border: "1px solid color-mix(in srgb, var(--border) 88%, transparent)",
                  background: "color-mix(in srgb, var(--floating) 90%, #09111a 10%)",
                  color: "var(--foreground)",
                  borderRadius: 12,
                  fontSize: 12,
                  lineHeight: 1.45,
                  padding: 12,
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={handleCopilotSubmit}
                disabled={isCopilotLoading || !copilotPrompt.trim()}
                style={{
                  border: "1px solid color-mix(in srgb, var(--primary) 36%, transparent)",
                  background: isCopilotLoading
                    ? "color-mix(in srgb, var(--floating) 90%, #09111a 10%)"
                    : "linear-gradient(135deg, color-mix(in srgb, var(--primary) 28%, var(--floating) 72%), color-mix(in srgb, var(--primary-strong) 16%, var(--panel) 84%))",
                  color: isCopilotLoading ? "var(--muted)" : "var(--foreground)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: isCopilotLoading || !copilotPrompt.trim() ? "default" : "pointer",
                  opacity: isCopilotLoading || !copilotPrompt.trim() ? 0.72 : 1,
                  boxShadow: isCopilotLoading ? "none" : "var(--shadow-glow)",
                }}
              >
                {isCopilotLoading ? "Generating…" : "Apply To Canvas"}
              </button>
              {copilotStatus && (
                <div
                  style={{
                    borderRadius: 12,
                    padding: "10px 12px",
                    fontSize: 11,
                    lineHeight: 1.45,
                    background: "color-mix(in srgb, var(--primary) 8%, var(--panel) 92%)",
                    color: "var(--secondary)",
                  }}
                >
                  {copilotStatus}
                </div>
              )}
            </div>

            {flatList ? (
              <>
                {showSearch && (
                  <div
                    className="studio-card"
                    style={{
                      borderRadius: 14,
                      padding: 10,
                    }}
                  >
                    <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>
                      Search the block library
                    </div>
                    <input
                      type="text"
                      value={componentSearch}
                      onChange={(e) => setComponentSearch(e.target.value)}
                      placeholder="Search blocks, protocols, or hints..."
                      style={{
                        width: "100%",
                        border: "1px solid color-mix(in srgb, var(--border) 88%, transparent)",
                        background: "color-mix(in srgb, var(--floating) 90%, #09111a 10%)",
                        color: "var(--foreground)",
                        borderRadius: 10,
                        padding: "9px 10px",
                        fontSize: 12,
                        outline: "none",
                      }}
                    />
                  </div>
                )}
                <div
                  className="sidebar-section studio-card"
                  style={{
                    borderRadius: 16,
                    padding: 10,
                    display: "grid",
                    gap: 8,
                  }}
                >
                  {filteredFlatItems.map((item) => (
                    <div
                      key={item.key}
                      className="sidebar-item"
                      style={{ color: item.muted ? "var(--muted)" : "var(--secondary)" }}
                      onClick={() => addNode(item.kind)}
                      onMouseOver={(e) => { e.currentTarget.style.color = item.hoverColor; }}
                      onMouseOut={(e) => { e.currentTarget.style.color = item.muted ? "var(--muted)" : "var(--secondary)"; }}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 10,
                          display: "grid",
                          placeItems: "center",
                          background: "rgba(255,255,255,0.04)",
                          flexShrink: 0,
                          fontSize: 13,
                        }}
                      >
                        {item.icon}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                          minWidth: 0,
                          overflow: "hidden",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontFamily: item.mono ? "monospace" : "inherit",
                            lineHeight: 1.2,
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {item.label}
                        </span>
                        {item.hint && (
                          <span
                            style={{
                              fontSize: 10,
                              color: "var(--muted)",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            {item.hint}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                  {filteredFlatItems.length === 0 && (
                    <div
                      className="canvas-hint-card"
                      style={{
                        padding: "10px 12px",
                        fontSize: 11,
                        color: "var(--muted)",
                        textAlign: "center",
                        borderRadius: 12,
                      }}
                    >
                      No components match your search.
                    </div>
                  )}
                </div>
              </>
            ) : (
              sections.map((section) => (
                <div
                  className="sidebar-section studio-card"
                  key={section.id}
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderBottom: collapsedSections[section.id]
                        ? "none"
                        : "1px solid color-mix(in srgb, var(--border) 84%, transparent)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setCollapsedSections((prev) => ({
                          ...prev,
                          [section.id]: !prev[section.id],
                        }))
                      }
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "var(--muted)",
                        cursor: "pointer",
                        padding: 0,
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span>{collapsedSections[section.id] ? "▸" : "▾"}</span>
                      <span>{section.title}</span>
                    </button>
                    <span style={{ fontSize: 10, color: "var(--muted)" }}>
                      {section.items.length}
                    </span>
                  </div>
                  {!collapsedSections[section.id] && (
                    <div
                      style={{
                        padding: 8,
                        display: "grid",
                        gap: 6,
                      }}
                    >
                      {section.items.map((item, index) => (
                        <div
                          key={`${section.id}-${item.kind}-${item.label}-${index}`}
                          className="sidebar-item"
                          style={{ color: section.muted ? "var(--muted)" : "var(--secondary)" }}
                          onClick={() => addNode(item.kind)}
                          onMouseOver={(e) => { e.currentTarget.style.color = item.hoverColor; }}
                          onMouseOut={(e) => { e.currentTarget.style.color = section.muted ? "var(--muted)" : "var(--secondary)"; }}
                        >
                          <span
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 10,
                              display: "grid",
                              placeItems: "center",
                              background: "rgba(255,255,255,0.04)",
                              flexShrink: 0,
                              fontSize: 13,
                            }}
                          >
                            {item.icon}
                          </span>
                          <span
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 3,
                              minWidth: 0,
                              overflow: "hidden",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 12,
                                fontFamily: item.mono ? "monospace" : "inherit",
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              {item.label}
                            </span>
                            {item.hint && (
                              <span
                                style={{
                                  fontSize: 10,
                                  color: "var(--muted)",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                }}
                              >
                                {item.hint}
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </aside>
        </div>
      )}

      {!isLeftSidebarCollapsed && (
        <div
          onMouseDown={(event) => {
            resizeStateRef.current = {
              side: "left",
              startX: event.clientX,
              startY: 0,
              startWidth: leftSidebarWidth,
              startHeight: 0,
              startRatio: 0,
            };
          }}
          className="panel-handle"
          style={{
            width: 6,
            cursor: "col-resize",
            flexShrink: 0,
            background: "transparent",
            borderRight: "1px solid color-mix(in srgb, var(--border) 70%, transparent)",
            display: isNarrowViewport ? "none" : "block",
          }}
        />
      )}

      <main
        style={{
          flex: 1,
          position: "relative",
          background: "var(--background)",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          className="canvas-hint-card workspace-fade-up"
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            zIndex: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 16,
            flexWrap: "wrap",
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span className="studio-badge">{workspaceCopy.eyebrow}</span>
            <span className="status-pill">
              <span className={`status-dot ${isCanvasEmpty ? "warning" : "success"}`} />
              {isCanvasEmpty ? "Canvas ready for first block" : `${nodes.length} blocks in play`}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span className="status-pill">
              <span className="status-dot success" />
              {edges.length} connections
            </span>
            <span className="status-pill">
              <span className="status-dot success" />
              Ctrl/Cmd+B toggles library
            </span>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          <FlowCanvas />
          {isCanvasEmpty && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                padding: 24,
                pointerEvents: "none",
              }}
            >
              <div
                className="canvas-empty-state workspace-fade-up"
                style={{
                  maxWidth: 420,
                  width: "min(100%, 420px)",
                  borderRadius: 22,
                  padding: "22px 22px 20px",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 10 }}>
                  Start on the canvas
                </div>
                <div style={{ fontSize: 24, lineHeight: 1.15, fontWeight: 700, marginBottom: 10 }}>
                  Place your first block and sketch the system from the outside in.
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--secondary)", marginBottom: 14 }}>
                  Use the library on the left, or ask Copilot to scaffold the first slice for you.
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span className="studio-badge">Click a block to add it</span>
                  <span className="studio-badge">Right-click for quick insert</span>
                </div>
              </div>
            </div>
          )}
        </div>
        {isDatabaseWorkspace && (
          <>
            {/* ── Vertical resize handle: canvas ↔ DB panels ──────── */}
            <div
              onMouseDown={(event) => {
                resizeStateRef.current = {
                  side: "dbHeight",
                  startX: 0,
                  startY: event.clientY,
                  startWidth: 0,
                  startHeight: dbPanelHeight,
                  startRatio: 0,
                };
              }}
              className="panel-handle"
              style={{
                height: 6,
                cursor: "row-resize",
                flexShrink: 0,
                background: "transparent",
                borderTop: "1px solid color-mix(in srgb, var(--border) 70%, transparent)",
                position: "relative",
                zIndex: 2,
              }}
              title="Drag to resize database panels"
            />
            <div
              style={{
                flexShrink: 0,
                height: dbPanelHeight,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                background: "color-mix(in srgb, var(--panel) 94%, #08111d 6%)",
              }}
            >
              <div style={{ flex: dbSplitRatio, minHeight: 0, overflow: "auto" }}>
                <DatabaseSchemaDesigner />
              </div>
              {/* ── Horizontal resize handle: schema ↔ query ────── */}
              <div
                onMouseDown={(event) => {
                  resizeStateRef.current = {
                    side: "dbSplit",
                    startX: 0,
                    startY: event.clientY,
                    startWidth: 0,
                    startHeight: dbPanelHeight,
                    startRatio: dbSplitRatio,
                  };
                }}
                className="panel-handle"
                style={{
                  height: 6,
                  cursor: "row-resize",
                  flexShrink: 0,
                  background: "transparent",
                  borderTop: "1px solid color-mix(in srgb, var(--border) 70%, transparent)",
                }}
                title="Drag to resize split between panels"
              />
              <div style={{ flex: 1 - dbSplitRatio, minHeight: 0, overflow: "auto" }}>
                <DatabaseQueryBuilder />
              </div>
            </div>
          </>
        )}
      </main>

      {isInspectorCollapsed ? (
        <button
          type="button"
          onClick={() => setIsInspectorCollapsed(false)}
          aria-label="Expand inspector"
          className="canvas-hint-card"
          style={{
            width: 28,
            flexShrink: 0,
            borderLeft: "1px solid color-mix(in srgb, var(--border) 84%, transparent)",
            background: "rgba(8, 16, 28, 0.7)",
            color: "var(--secondary)",
            cursor: "pointer",
            display: isNarrowViewport ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ‹
        </button>
      ) : (
        <div
          style={{
            position: isNarrowViewport ? "absolute" : "relative",
            top: isNarrowViewport ? 0 : undefined,
            right: 0,
            bottom: isNarrowViewport ? 0 : undefined,
            display: "flex",
            zIndex: isNarrowViewport ? 26 : undefined,
          }}
        >
          <div
            onMouseDown={(event) => {
              resizeStateRef.current = {
                side: "right",
                startX: event.clientX,
                startY: 0,
                startWidth: inspectorWidth,
                startHeight: 0,
                startRatio: 0,
              };
            }}
            className="panel-handle"
            style={{
              width: 6,
              cursor: "col-resize",
              flexShrink: 0,
              background: "transparent",
              borderLeft: "1px solid color-mix(in srgb, var(--border) 70%, transparent)",
              display: isNarrowViewport ? "none" : "block",
            }}
          />
          <button
            type="button"
            onClick={() => setIsInspectorCollapsed(true)}
            aria-label="Collapse inspector"
            className="canvas-hint-card"
            style={{
              position: "absolute",
              top: "50%",
              left: isNarrowViewport ? 8 : -12,
              transform: "translateY(-50%)",
              zIndex: 2,
              border: "1px solid color-mix(in srgb, var(--border) 88%, transparent)",
              background: "rgba(8, 16, 28, 0.84)",
              color: "var(--secondary)",
              borderRadius: 10,
              width: 28,
              height: 28,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ›
          </button>
          <PropertyInspector
            width={isNarrowViewport ? Math.min(inspectorWidth, 360) : inspectorWidth}
          />
        </div>
      )}
    </div>
  );
}

