"use client";

import React from "react";
import Image from "next/image";
import {
  HEADER_MENU_TEXT,
  tabLabel,
  WorkspaceTab,
} from "@/components/studio/config";
import {
  WORKSPACE_TEMPLATES,
  type WorkspaceTemplateId,
} from "@/lib/studio/graph-templates";

export type StudioUser = {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
  identities?: Array<{ identity_data?: Record<string, unknown> | null }> | null;
};

type HeaderAction = {
  id: "save" | "gen" | "commit" | "reset" | "test" | "layout" | "export";
  label: string;
  onClick: () => void;
  title?: string;
  highlighted?: boolean;
  isLoading?: boolean;
};

type HeaderTabsProps = {
  activeTab: WorkspaceTab;
  isCompactViewport: boolean;
  setActiveTab: (tab: WorkspaceTab) => void;
};

const workspaceCaption: Record<WorkspaceTab, string> = {
  api: "Interface contracts, routes, and event surfaces",
  database: "Schemas, pipelines, and operational data flows",
  functions: "Business logic, jobs, and automation blocks",
  agent: "AI-assisted architecture help and next-step guidance",
};

const baseActionStyle: React.CSSProperties = {
  borderRadius: 12,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.1,
  cursor: "pointer",
};

function getActionStyle(action: HeaderAction, variant: "desktop" | "menu"): React.CSSProperties {
  const isPrimary = action.id === "gen" || action.highlighted;

  return {
    ...baseActionStyle,
    width: variant === "menu" ? "100%" : undefined,
    textAlign: variant === "menu" ? "left" : "center",
    border: isPrimary
      ? "1px solid color-mix(in srgb, var(--primary) 40%, var(--border) 60%)"
      : "1px solid color-mix(in srgb, var(--border) 88%, transparent)",
    background: isPrimary
      ? "linear-gradient(135deg, color-mix(in srgb, var(--primary) 30%, var(--floating) 70%), color-mix(in srgb, var(--primary-strong) 18%, var(--panel) 82%))"
      : "color-mix(in srgb, var(--floating) 90%, #09111a 10%)",
    color: action.isLoading ? "var(--muted)" : "var(--foreground)",
    opacity: action.isLoading ? 0.6 : 1,
    boxShadow: isPrimary ? "var(--shadow-glow)" : "none",
  };
}

function HeaderTabs({
  activeTab,
  isCompactViewport,
  setActiveTab,
}: HeaderTabsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isCompactViewport ? "1fr" : "auto minmax(320px, 1fr)",
        alignItems: "center",
        gap: isCompactViewport ? 10 : 16,
        minWidth: 0,
        flex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          minWidth: 0,
        }}
      >
        <div
          className="studio-card-raised"
          style={{
            width: isCompactViewport ? 44 : 50,
            height: isCompactViewport ? 44 : 50,
            borderRadius: 16,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <Image
            src="/logo.svg"
            alt="Archi.dev"
            width={isCompactViewport ? 28 : 32}
            height={isCompactViewport ? 28 : 32}
            priority
            style={{ objectFit: "contain" }}
          />
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 4,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-poetic)",
                fontWeight: 700,
                fontSize: isCompactViewport ? 24 : 28,
                letterSpacing: "0.02em",
                lineHeight: 1,
                color: "color-mix(in srgb, var(--foreground) 96%, #ffffff 4%)",
              }}
            >
              Archi.dev
            </div>
            {!isCompactViewport && <span className="studio-badge">Studio workspace</span>}
          </div>
          <div
            style={{
              fontSize: isCompactViewport ? 11 : 12,
              color: "var(--muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {workspaceCaption[activeTab]}
          </div>
        </div>
      </div>

      <div
        className="studio-card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          borderRadius: 16,
          padding: 6,
          minWidth: 0,
          overflowX: "auto",
        }}
      >
        {(Object.keys(tabLabel) as WorkspaceTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              border: "1px solid transparent",
              borderRadius: 12,
              padding: isCompactViewport ? "8px 10px" : "9px 12px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: "nowrap",
              background:
                activeTab === tab
                  ? "linear-gradient(135deg, color-mix(in srgb, var(--primary) 18%, var(--floating) 82%), color-mix(in srgb, var(--primary) 10%, var(--panel) 90%))"
                  : "transparent",
              color: activeTab === tab ? "var(--foreground)" : "var(--muted)",
              boxShadow: activeTab === tab ? "var(--shadow-glow)" : "none",
              borderColor:
                activeTab === tab
                  ? "color-mix(in srgb, var(--primary) 34%, transparent)"
                  : "transparent",
            }}
          >
            {tabLabel[tab]}
          </button>
        ))}
      </div>
    </div>
  );
}

type TemplatePickerProps = {
  isCompactViewport: boolean;
  onSelectTemplate: (templateId: WorkspaceTemplateId) => void;
};

function TemplatePicker({
  isCompactViewport,
  onSelectTemplate,
}: TemplatePickerProps) {
  return (
    <label
      className="studio-card"
      style={{
        display: "grid",
        gap: 4,
        borderRadius: 14,
        padding: isCompactViewport ? "8px 10px" : "9px 12px",
        minWidth: isCompactViewport ? 0 : 220,
      }}
    >
      <span
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--muted)",
        }}
      >
        Starter template
      </span>
      <select
        defaultValue=""
        onChange={(event) => {
          const next = event.target.value as WorkspaceTemplateId | "";
          if (!next) return;
          onSelectTemplate(next);
          event.target.value = "";
        }}
        style={{
          border: "1px solid color-mix(in srgb, var(--border) 88%, transparent)",
          background: "color-mix(in srgb, var(--floating) 90%, #09111a 10%)",
          color: "var(--foreground)",
          borderRadius: 10,
          padding: "8px 10px",
          fontSize: 12,
          minWidth: isCompactViewport ? 180 : 196,
          cursor: "pointer",
        }}
      >
        <option value="">Load starter…</option>
        {WORKSPACE_TEMPLATES.map((template) => (
          <option key={template.id} value={template.id}>
            {template.label}
          </option>
        ))}
      </select>
    </label>
  );
}

type HeaderActionButtonsProps = {
  actions: HeaderAction[];
  variant: "desktop" | "menu";
};

function HeaderActionButtons({ actions, variant }: HeaderActionButtonsProps) {
  return (
    <>
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={action.onClick}
          title={action.title}
          disabled={action.isLoading}
          style={getActionStyle(action, variant)}
        >
          {action.isLoading && action.id === "gen" ? "Generating…" : action.label}
        </button>
      ))}
    </>
  );
}

type ProfileButtonProps = {
  avatarUrl: string;
  avatarFailed: boolean;
  displayName: string;
  initials: string;
  isProfileOpen: boolean;
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAvatarFailed: React.Dispatch<React.SetStateAction<boolean>>;
};

function ProfileButton({
  avatarUrl,
  avatarFailed,
  displayName,
  initials,
  isProfileOpen,
  setIsProfileOpen,
  setAvatarFailed,
}: ProfileButtonProps) {
  return (
    <button
      type="button"
      onClick={() => setIsProfileOpen((prev) => !prev)}
      aria-label="Open profile menu"
      aria-haspopup="menu"
      aria-expanded={isProfileOpen}
      className="studio-card-raised"
      style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {avatarUrl && !avatarFailed ? (
        <Image
          src={avatarUrl}
          alt={displayName}
          width={42}
          height={42}
          onError={() => setAvatarFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ fontSize: 12, fontWeight: 800 }}>{initials}</span>
      )}
    </button>
  );
}

type ProfileMenuProps = {
  displayName: string;
  displayEmail: string;
  creditUsed: number;
  creditLimit: number;
  creditUsedPercent: number;
  headerActions: HeaderAction[];
  handleNewProject: () => void;
  handleLogout: () => void;
  handleBuyPro: () => void;
};

function ProfileMenu({
  displayName,
  displayEmail,
  creditUsed,
  creditLimit,
  creditUsedPercent,
  headerActions,
  handleNewProject,
  handleLogout,
  handleBuyPro,
}: ProfileMenuProps) {
  return (
    <div
      className="studio-card-raised workspace-fade-up"
      style={{
        position: "absolute",
        right: 0,
        top: "calc(100% + 10px)",
        width: 300,
        borderRadius: 18,
        padding: 12,
        zIndex: 24,
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 4,
          padding: 4,
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <strong style={{ fontSize: 13 }}>{displayName}</strong>
          <span className="studio-badge">Workspace owner</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)" }}>
          {displayEmail || "Not signed in"}
        </div>
      </div>

      <div className="studio-card" style={{ borderRadius: 14, padding: 12, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>Credits this cycle</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--secondary)" }}>
            {creditUsed} / {creditLimit}
          </span>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${creditUsedPercent}%` }} />
        </div>
      </div>

      <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
        <button
          type="button"
          onClick={handleNewProject}
          style={{
            ...baseActionStyle,
            width: "100%",
            border: "1px solid color-mix(in srgb, var(--border) 88%, transparent)",
            background: "color-mix(in srgb, var(--floating) 90%, #09111a 10%)",
            color: "var(--foreground)",
          }}
        >
          {HEADER_MENU_TEXT.newProject}
        </button>
        <div className="studio-card" style={{ borderRadius: 14, padding: 8, display: "grid", gap: 8 }}>
          <HeaderActionButtons actions={headerActions} variant="menu" />
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <button
          type="button"
          onClick={handleBuyPro}
          style={getActionStyle({ id: "commit", label: HEADER_MENU_TEXT.buyPro, onClick: handleBuyPro, highlighted: true }, "menu")}
        >
          {HEADER_MENU_TEXT.buyPro}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            ...baseActionStyle,
            width: "100%",
            border: "1px solid color-mix(in srgb, var(--border) 88%, transparent)",
            background: "color-mix(in srgb, var(--floating) 90%, #09111a 10%)",
            color: "var(--foreground)",
          }}
        >
          {HEADER_MENU_TEXT.logout}
        </button>
      </div>
    </div>
  );
}

type LoginMenuProps = {
  handleLogin: () => void;
};

function LoginMenu({ handleLogin }: LoginMenuProps) {
  return (
    <div
      className="studio-card-raised workspace-fade-up"
      style={{
        position: "absolute",
        right: 0,
        top: "calc(100% + 10px)",
        width: 280,
        borderRadius: 18,
        padding: 14,
        zIndex: 24,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
        {HEADER_MENU_TEXT.signIn}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "var(--muted)",
          marginBottom: 12,
          lineHeight: 1.5,
        }}
      >
        {HEADER_MENU_TEXT.loginHint}
      </div>
      <button onClick={handleLogin} style={getActionStyle({ id: "gen", label: HEADER_MENU_TEXT.signInWithGoogle, onClick: handleLogin, highlighted: true }, "menu")}>
        {HEADER_MENU_TEXT.signInWithGoogle}
      </button>
    </div>
  );
}

type StudioHeaderProps = {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  isCompactViewport: boolean;
  profileRef: React.RefObject<HTMLDivElement | null>;
  user: StudioUser | null;
  isProfileOpen: boolean;
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoginOpen: boolean;
  setIsLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
  avatarFailed: boolean;
  setAvatarFailed: React.Dispatch<React.SetStateAction<boolean>>;
  creditUsed: number;
  creditLimit: number;
  creditUsedPercent: number;
  isGenerating: boolean;
  handleGenerateCode: () => void;
  handleRunTest: () => void;
  handleSaveChanges: () => void;
  handleCommitChanges: () => void;
  handleResetLayout: () => void;
  handleAutoLayout: () => void;
  handleLoadTemplate: (templateId: WorkspaceTemplateId) => void;
  handleExportOpenApi: () => void;
  handleLogout: () => void;
  handleLogin: () => void;
  handleNewProject: () => void;
  handleBuyPro: () => void;
};

export function StudioHeader({
  activeTab,
  setActiveTab,
  isCompactViewport,
  profileRef,
  user,
  isProfileOpen,
  setIsProfileOpen,
  isLoginOpen,
  setIsLoginOpen,
  avatarFailed,
  setAvatarFailed,
  creditUsed,
  creditLimit,
  creditUsedPercent,
  isGenerating,
  handleGenerateCode,
  handleRunTest,
  handleSaveChanges,
  handleCommitChanges,
  handleResetLayout,
  handleAutoLayout,
  handleLoadTemplate,
  handleExportOpenApi,
  handleLogout,
  handleLogin,
  handleNewProject,
  handleBuyPro,
}: StudioHeaderProps) {
  const userMetadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const identityData = (user?.identities?.[0]?.identity_data ?? {}) as Record<string, unknown>;
  const displayName =
    (typeof userMetadata.full_name === "string" && userMetadata.full_name) ||
    (typeof userMetadata.name === "string" && userMetadata.name) ||
    (typeof identityData.full_name === "string" && identityData.full_name) ||
    (typeof identityData.name === "string" && identityData.name) ||
    user?.email ||
    "Profile";
  const displayEmail = user?.email ?? "";
  const avatarUrl =
    (typeof userMetadata.avatar_url === "string" && userMetadata.avatar_url) ||
    (typeof userMetadata.picture === "string" && userMetadata.picture) ||
    (typeof identityData.avatar_url === "string" && identityData.avatar_url) ||
    (typeof identityData.picture === "string" && identityData.picture) ||
    "";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  const headerActions: HeaderAction[] = [
    {
      id: "test",
      label: "Run Test",
      onClick: handleRunTest,
      title: "Open interactive test environment for your current design",
    },
    {
      id: "gen",
      label: HEADER_MENU_TEXT.genCode,
      onClick: handleGenerateCode,
      isLoading: isGenerating,
      highlighted: true,
    },
    {
      id: "layout",
      label: "Tidy Up",
      onClick: handleAutoLayout,
      title: "Auto-layout the current canvas",
    },
    {
      id: "export",
      label: "Export OpenAPI",
      onClick: handleExportOpenApi,
      title: "Export OpenAPI spec and Markdown docs for the current API graph",
    },
    {
      id: "save",
      label: HEADER_MENU_TEXT.saveChanges,
      onClick: handleSaveChanges,
    },
    {
      id: "commit",
      label: HEADER_MENU_TEXT.commit,
      onClick: handleCommitChanges,
      highlighted: true,
    },
    {
      id: "reset",
      label: HEADER_MENU_TEXT.resetLayout,
      onClick: handleResetLayout,
      title: "Reset panel layout (Ctrl/Cmd+0)",
    },
  ];

  return (
    <header
      style={{
        borderBottom: "1px solid color-mix(in srgb, var(--border) 84%, transparent)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0)), color-mix(in srgb, var(--panel) 94%, #09111a 6%)",
        padding: isCompactViewport ? "12px" : "14px 18px",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isCompactViewport ? "1fr" : "minmax(0, 1fr) auto auto",
          alignItems: isCompactViewport ? "stretch" : "center",
          gap: 12,
        }}
      >
        <HeaderTabs
          activeTab={activeTab}
          isCompactViewport={isCompactViewport}
          setActiveTab={setActiveTab}
        />

        <TemplatePicker
          isCompactViewport={isCompactViewport}
          onSelectTemplate={handleLoadTemplate}
        />

        <div
          ref={profileRef}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: isCompactViewport ? "space-between" : "flex-end",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {!isCompactViewport && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 8,
                flexWrap: "wrap",
                maxWidth: 640,
              }}
            >
              <HeaderActionButtons actions={headerActions} variant="desktop" />
            </div>
          )}
          {user ? (
            <ProfileButton
              avatarUrl={avatarUrl}
              avatarFailed={avatarFailed}
              displayName={displayName}
              initials={initials}
              isProfileOpen={isProfileOpen}
              setIsProfileOpen={setIsProfileOpen}
              setAvatarFailed={setAvatarFailed}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsLoginOpen((prev) => !prev)}
              aria-haspopup="dialog"
              aria-expanded={isLoginOpen}
              style={getActionStyle({ id: "gen", label: HEADER_MENU_TEXT.signIn, onClick: () => setIsLoginOpen((prev) => !prev), highlighted: true }, "desktop")}
            >
              {HEADER_MENU_TEXT.signIn}
            </button>
          )}

          {isProfileOpen && user && (
            <ProfileMenu
              displayName={displayName}
              displayEmail={displayEmail}
              creditUsed={creditUsed}
              creditLimit={creditLimit}
              creditUsedPercent={creditUsedPercent}
              headerActions={[
                ...headerActions.slice(0, 1),
                { ...headerActions[1], label: HEADER_MENU_TEXT.commitChanges },
                ...headerActions.slice(2),
              ]}
              handleNewProject={handleNewProject}
              handleLogout={handleLogout}
              handleBuyPro={handleBuyPro}
            />
          )}

          {isLoginOpen && !user && <LoginMenu handleLogin={handleLogin} />}
        </div>
      </div>

      {isCompactViewport && (
        <div
          style={{
            display: "grid",
            gap: 8,
            marginTop: 12,
          }}
        >
          <div className="studio-card" style={{ borderRadius: 14, padding: 8, display: "grid", gap: 8 }}>
            <HeaderActionButtons
              actions={headerActions.filter((action) => action.id !== "save" && action.id !== "reset")}
              variant="menu"
            />
          </div>
        </div>
      )}
    </header>
  );
}
