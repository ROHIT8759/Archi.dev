"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { StudioHeader, StudioUser } from "@/components/studio/StudioHeader";
import { StudioLayout } from "@/components/studio/StudioLayout";
import { StudioWorkspace } from "@/components/studio/StudioWorkspace";
import { TestPanel } from "@/components/studio/TestPanel";
import { GenCodeModal } from "@/components/studio/GenCodeModal";
import { ApiTableModal } from "@/components/studio/ApiTableModal";
import { validateArchitecture, ValidationResult } from "@/lib/validate-architecture";
import {
  STORAGE_KEYS,
  STATUS_TEXT_BY_TAB,
  WorkspaceTab,
} from "@/components/studio/config";
import { type WorkspaceTemplateId } from "@/lib/studio/graph-templates";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useStore } from "@/store/useStore";
type StudioPageProps = {
  initialTab?: WorkspaceTab;
};
export function StudioPage({ initialTab = "api" }: StudioPageProps) {
  const router = useRouter();
  const setActiveWorkspaceTab = useStore((state) => state.setActiveTab);
  const apiTableModalNodeId = useStore((state) => state.apiTableModalNodeId);
  const closeApiTableModal = useStore((state) => state.closeApiTableModal);
  const loadGraphPreset = useStore((state) => state.loadGraphPreset);
  const exportGraphs = useStore((state) => state.exportGraphs);
  const importGraphs = useStore((state) => state.importGraphs);
  const autoLayoutCurrentGraph = useStore((state) => state.autoLayoutCurrentGraph);
  const loadWorkspaceTemplate = useStore((state) => state.loadWorkspaceTemplate);
  const setFocusNodeId = useStore((state) => state.setFocusNodeId);
  const setValidationIssues = useStore((state) => state.setValidationIssues);
  const graphs = useStore((state) => state.graphs);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(initialTab);
  const [resetLayoutSignal, setResetLayoutSignal] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showUpgradeNotice, setShowUpgradeNotice] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);
  const retryCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [genStats, setGenStats] = useState<{ requests: number; files: number; time: string } | null>(null);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [commitStatus, setCommitStatus] = useState("Uncommitted changes");
  const [saveState, setSaveState] = useState("Unsaved");
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [user, setUser] = useState<StudioUser | null>(null);
  const [creditLimit, setCreditLimit] = useState(1000);
  const [creditUsed, setCreditUsed] = useState(0);
  const applyUser = (
    nextUser: {
      email?: string | null;
      user_metadata?: Record<string, unknown> | null;
      identities?: Array<{
        identity_data?: Record<string, unknown> | null;
      }> | null;
    } | null,
  ) => {
    setAvatarFailed(false);
    if (!nextUser) {
      setIsProfileOpen(false);
    } else {
      setIsLoginOpen(false);
    }
    setUser(nextUser);
  };
  const creditUsedPercent = Math.min(
    100,
    creditLimit > 0 ? Math.round((creditUsed / creditLimit) * 100) : 0,
  );
  const statusText = STATUS_TEXT_BY_TAB[activeTab];
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.graphs);
      if (saved) {
        importGraphs(JSON.parse(saved));
      }
    } catch {
      // Ignore malformed persisted graph data and keep the current graph state.
    }
  }, [importGraphs]);
  useEffect(() => {
    if (!user) return;
    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/credits");
        if (!res.ok) return;
        const json = (await res.json()) as {
          balance?: { availableCredits?: number; monthlyFreeCredits?: number };
        };
        if (json.balance) {
          const monthly = json.balance.monthlyFreeCredits ?? 1000;
          const available = json.balance.availableCredits ?? monthly;
          setCreditLimit(monthly);
          setCreditUsed(Math.max(0, monthly - available));
        }
      } catch {
        // Keep the default credit display when the balance request is unavailable.
      }
    };
    fetchCredits();
  }, [user]);
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        event.target instanceof Node &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
        setIsLoginOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  useEffect(() => {
    const supabaseClient = getSupabaseBrowserClient();
    if (!supabaseClient) {
      applyUser(null);
      return;
    }
    let isMounted = true;
    const loadUser = async () => {
      try {
        const { data, error } = await supabaseClient.auth.getUser();
        if (!isMounted) return;
        if (error) {
          applyUser(null);
          return;
        }
        applyUser(data.user ?? null);
      } catch {
        if (!isMounted) return;
        applyUser(null);
      }
    };
    loadUser();
    const { data } = supabaseClient.auth.onAuthStateChange(
      (_event: unknown, session: { user?: StudioUser | null } | null) => {
        applyUser(session?.user ?? null);
      },
    );
    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.activeTab, activeTab);
    } catch {
      // Ignore storage write failures so tab switching still works in constrained browsers.
    }
  }, [activeTab]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 1100px)");
    const updateViewport = (event?: MediaQueryListEvent) => {
      const isCompact = event ? event.matches : mediaQuery.matches;
      setIsCompactViewport(isCompact);
    };
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);
  useEffect(() => {
    setActiveWorkspaceTab(activeTab);
  }, [activeTab, setActiveWorkspaceTab]);
  useEffect(() => {
    const result = validateArchitecture(graphs);
    setValidationIssues([...result.errors, ...result.warnings]);
  }, [graphs, setValidationIssues]);
  const handleGenerateCodeRef = useRef<() => Promise<void>>(async () => { });
  const isCountingDown = useRef(false);
  useEffect(() => {
    if (retryCountdown !== null) {
      isCountingDown.current = true;
    } else if (isCountingDown.current) {
      isCountingDown.current = false;
      handleGenerateCodeRef.current();
    }
  }, [retryCountdown]);
  const handleGenerateCodeClick = useCallback(() => {
    const graphs = exportGraphs();
    const result = validateArchitecture(graphs);
    setValidationResult(result);
    setValidationIssues([...result.errors, ...result.warnings]);
    setIsGenModalOpen(true);
  }, [exportGraphs, setValidationIssues]);
  const handleFocusNode = useCallback(
    (nodeId: string) => {
      setIsGenModalOpen(false);
      setValidationResult(null);
      setFocusNodeId(nodeId);
    },
    [setFocusNodeId],
  );
  const handleGenerateCode = async (language: "javascript" | "python" = "javascript") => {
    setIsGenModalOpen(false);
    setValidationResult(null);
    setGenError(null);
    setRetryCountdown(null);
    if (retryCountdownRef.current) {
      clearInterval(retryCountdownRef.current);
      retryCountdownRef.current = null;
    }
    setIsGenerating(true);
    try {
      const graphs = exportGraphs();
      const allNodes = Object.values(graphs).flatMap((g) => g.nodes);
      const allEdges = Object.values(graphs).flatMap((g) => g.edges);
      const isJs = language === "javascript";
      const techStack = {
        frontend: "none",
        backend: isJs ? "node" : "python",
        database: "postgresql",
        deployment: "docker",
      };
      const metadata = {
        language: isJs ? "javascript" : "python",
        framework: isJs ? "express" : "fastapi",
        architectureStyle: "monolithic",
        generatedBy: "ermiz-studio",
      };
      const requestPayload = {
        nodes: allNodes,
        edges: allEdges,
        techStack,
        metadata,
        language,
      };
      const res = await fetch("/api/gen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });
      if (!res.ok) {
        let userMessage = "Code generation failed. Please try again.";
        let quotaRetryAfter: number | null = null;
        try {
          const body = await res.json();
          if (res.status === 429) {
            quotaRetryAfter = typeof body.retryAfter === "number" ? body.retryAfter : 60;
            userMessage =
              "Gemini free-tier quota exhausted. Retrying automatically in {SECS}s, " +
              "or upgrade at ai.google.dev for unlimited usage.";
          } else if (typeof body.detail === "string" && body.detail.trim()) {
            userMessage = body.detail;
          } else if (typeof body.message === "string" && body.message.trim()) {
            userMessage = body.message;
          } else if (body.error) {
            userMessage = body.error;
          }
        } catch {
          // Fall back to the generic message when the error response is not valid JSON.
        }
        setGenError(userMessage);
        if (quotaRetryAfter !== null) {
          setRetryCountdown(quotaRetryAfter);
          retryCountdownRef.current = setInterval(() => {
            setRetryCountdown((prev) => {
              if (prev === null || prev <= 1) {
                if (retryCountdownRef.current) {
                  clearInterval(retryCountdownRef.current);
                  retryCountdownRef.current = null;
                }
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        }
        return;
      }
      const geminiRequests = Number(
        res.headers.get("X-Gemini-Requests") ??
          res.headers.get("X-AI-Requests") ??
          0,
      );
      const generatedFiles = Number(res.headers.get("X-Generated-Files") ?? 0);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated-project.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setGenStats({
        requests: geminiRequests,
        files: generatedFiles,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    } catch (error) {
      console.error("🔥 Unexpected error during generation:", error);
      setGenError("An unexpected error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  handleGenerateCodeRef.current = () => handleGenerateCode();
  const handleRunTest = () => setIsTestOpen(true);
  const handleSaveChanges = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.graphs, JSON.stringify(exportGraphs()));
    } catch {
      // Ignore storage write failures so the manual save action remains non-blocking.
    }
    setSaveState("Saved");
  };
  const handleCommitChanges = () => {
    handleSaveChanges();
    setCommitStatus("Committed");
  };
  const handleResetLayout = () => {
    setResetLayoutSignal((prev) => prev + 1);
  };
  const passiveValidation = validateArchitecture(graphs);
  const handleAutoLayout = () => {
    autoLayoutCurrentGraph();
    setSaveState("Unsaved");
    setCommitStatus("Uncommitted changes");
  };
  const handleLoadTemplate = (templateId: WorkspaceTemplateId) => {
    setIsProfileOpen(false);
    loadWorkspaceTemplate(templateId);
    setSaveState("Unsaved");
    setCommitStatus("Uncommitted changes");
    setGenStats(null);
    setGenError(null);
  };
  const handleExportOpenApi = async () => {
    try {
      const currentGraphs = exportGraphs();
      const res = await fetch("/api/openapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Archi.dev API",
          version: "v1",
          graphs: {
            api: currentGraphs.api,
          },
        }),
      });
      if (!res.ok) {
        console.error("Failed to export OpenAPI:", res.statusText);
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "archi-dev-api-export.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("OpenAPI export error:", error);
    }
  };
  const handleLogin = async () => {
    router.push("/login?callbackUrl=%2Fstudio");
  };
  const handleLogout = async () => {
    const supabaseClient = getSupabaseBrowserClient();
    try {
      await supabaseClient?.auth.signOut();
    } catch {
      // Continue local sign-out cleanup even if the remote auth session is already gone.
    }
    try {
      await fetch("/auth/logout", { method: "POST" });
    } catch {
      // Ignore logout endpoint failures and still clear the local UI state.
    }
    setIsProfileOpen(false);
    applyUser(null);
    router.push("/");
    router.refresh();
  };
  return (
    <StudioLayout
      isCompactViewport={isCompactViewport}
      statusText={statusText}
      creditUsedPercent={creditUsedPercent}
      saveState={saveState}
      commitStatus={commitStatus}
    >
      {genStats && !genError && (
        <div
          className="workspace-fade-up"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0)), color-mix(in srgb, #22c55e 10%, var(--panel) 90%)",
            borderBottom: "1px solid color-mix(in srgb, #22c55e 24%, transparent)",
            padding: "9px 18px",
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexShrink: 0,
            color: "var(--secondary)",
          }}
        >
          <span>
            ✓ Last generation at {genStats.time} ·
            <strong style={{ color: "var(--foreground)" }}>{genStats.requests}</strong> Gemini request{genStats.requests !== 1 ? "s" : ""} ·
            <strong style={{ color: "var(--foreground)" }}>{genStats.files}</strong> file{genStats.files !== 1 ? "s" : ""} generated
          </span>
          <button
            type="button"
            onClick={() => setGenStats(null)}
            aria-label="Dismiss"
            style={{
              border: "none",
              background: "transparent",
              color: "var(--muted)",
              cursor: "pointer",
              fontSize: 14,
              lineHeight: 1,
              padding: "0 2px",
            }}
          >
            ×
          </button>
        </div>
      )}
      {genError && (
        <div
          role="alert"
          className="workspace-fade-up"
          style={{
            background:
              retryCountdown !== null
                ? "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0)), color-mix(in srgb, #f59e0b 12%, var(--panel) 88%)"
                : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0)), color-mix(in srgb, #ef4444 14%, var(--panel) 86%)",
            borderBottom:
              retryCountdown !== null
                ? "1px solid color-mix(in srgb, #f59e0b 40%, transparent)"
                : "1px solid color-mix(in srgb, #ef4444 40%, transparent)",
            padding: "10px 18px",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <span>
            {retryCountdown !== null
              ? genError.replace("{SECS}", String(retryCountdown))
              : genError}
          </span>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {retryCountdown !== null && (
              <button
                type="button"
                onClick={() => {
                  isCountingDown.current = false;
                  if (retryCountdownRef.current) {
                    clearInterval(retryCountdownRef.current);
                    retryCountdownRef.current = null;
                  }
                  setRetryCountdown(null);
                  setGenError(null);
                  handleGenerateCode();
                }}
                style={{
                  border: "1px solid #f59e0b",
                  background: "color-mix(in srgb, #f59e0b 20%, var(--floating))",
                  color: "var(--foreground)",
                  borderRadius: 8,
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Retry Now
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                isCountingDown.current = false;
                if (retryCountdownRef.current) {
                  clearInterval(retryCountdownRef.current);
                  retryCountdownRef.current = null;
                }
                setRetryCountdown(null);
                setGenError(null);
              }}
              aria-label="Dismiss"
              style={{
                border: "1px solid var(--border)",
                background: "var(--floating)",
                color: "var(--foreground)",
                borderRadius: 8,
                padding: "4px 10px",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {showUpgradeNotice && (
        <div
          role="alert"
          className="workspace-fade-up"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0)), color-mix(in srgb, var(--primary) 18%, var(--panel) 82%)",
            borderBottom: "1px solid color-mix(in srgb, var(--primary) 22%, var(--border) 78%)",
            padding: "10px 18px",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <span>
            <strong>Pro plan coming soon.</strong> Unlimited generations, team
            workspaces, and priority support — stay tuned.
          </span>
          <button
            type="button"
            onClick={() => setShowUpgradeNotice(false)}
            aria-label="Dismiss"
            style={{
              border: "1px solid var(--border)",
              background: "var(--floating)",
              color: "var(--foreground)",
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      )}
      <StudioHeader
        activeTab={activeTab}
        isCompactViewport={isCompactViewport}
        profileRef={profileRef}
        user={user}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        isLoginOpen={isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
        avatarFailed={avatarFailed}
        setAvatarFailed={setAvatarFailed}
        creditUsed={creditUsed}
        creditLimit={creditLimit}
        creditUsedPercent={creditUsedPercent}
        isGenerating={isGenerating}
        handleGenerateCode={handleGenerateCodeClick}
        handleRunTest={handleRunTest}
        handleSaveChanges={handleSaveChanges}
        handleCommitChanges={handleCommitChanges}
        handleResetLayout={handleResetLayout}
        handleAutoLayout={handleAutoLayout}
        handleLoadTemplate={handleLoadTemplate}
        handleExportOpenApi={handleExportOpenApi}
        handleLogout={handleLogout}
        handleLogin={handleLogin}
        handleNewProject={() => {
          setIsProfileOpen(false);
          loadGraphPreset("empty");
          setSaveState("Unsaved");
          setCommitStatus("Uncommitted changes");
        }}
        handleBuyPro={() => {
          setIsProfileOpen(false);
          setShowUpgradeNotice(true);
        }}
      />
      <div
        className="workspace-fade-up"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "10px 18px",
          borderBottom: "1px solid color-mix(in srgb, var(--border) 84%, transparent)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)), color-mix(in srgb, var(--panel) 94%, #0f1623 6%)",
          fontSize: 11,
          color: "var(--secondary)",
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span className="studio-badge">Passive validation</span>
          <span className="status-pill">
            <span className={`status-dot ${passiveValidation.errors.length > 0 ? "danger" : "success"}`} />
            {passiveValidation.errors.length} error{passiveValidation.errors.length !== 1 ? "s" : ""}
          </span>
          <span className="status-pill">
            <span className={`status-dot ${passiveValidation.warnings.length > 0 ? "warning" : "success"}`} />
            {passiveValidation.warnings.length} warning{passiveValidation.warnings.length !== 1 ? "s" : ""}
          </span>
        </div>
        <span className="status-pill">
          <span className={`status-dot ${passiveValidation.ok ? "success" : "warning"}`} />
          {passiveValidation.ok ? "Ready to generate" : "Canvas needs attention"}
        </span>
      </div>
      <StudioWorkspace
        activeTab={activeTab}
        resetLayoutSignal={resetLayoutSignal}
      />
      <TestPanel
        isOpen={isTestOpen}
        onClose={() => setIsTestOpen(false)}
      />
      {isGenModalOpen && validationResult && (
        <GenCodeModal
          validationResult={validationResult}
          onConfirm={handleGenerateCode}
          onCancel={() => {
            setIsGenModalOpen(false);
            setValidationResult(null);
            setValidationIssues([]);
          }}
          onFocusNode={handleFocusNode}
        />
      )}
      {apiTableModalNodeId && (
        <ApiTableModal
          nodeId={apiTableModalNodeId}
          onClose={closeApiTableModal}
        />
      )}
    </StudioLayout>
  );
}
export default function Home() {
  return <StudioPage initialTab="api" />;
}
