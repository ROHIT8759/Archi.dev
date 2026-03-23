"use client";

type StudioFooterProps = {
  isCompactViewport: boolean;
  statusText: string;
  creditUsedPercent: number;
  saveState: string;
  commitStatus: string;
};

const statusTone = (value: string): "success" | "warning" => {
  const normalized = value.toLowerCase();
  return normalized.includes("saved") || normalized.includes("committed")
    ? "success"
    : "warning";
};

export function StudioFooter({
  isCompactViewport,
  statusText,
  creditUsedPercent,
  saveState,
  commitStatus,
}: StudioFooterProps) {
  const creditTone = creditUsedPercent >= 85 ? "warning" : "success";

  return (
    <footer
      style={{
        flexShrink: 0,
        borderTop: "1px solid color-mix(in srgb, var(--border) 84%, transparent)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0)), color-mix(in srgb, var(--panel) 94%, #09111a 6%)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        padding: isCompactViewport ? "10px 12px" : "10px 18px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isCompactViewport ? "1fr" : "minmax(0, 1.25fr) minmax(220px, 0.8fr) auto",
          alignItems: "center",
          gap: isCompactViewport ? 10 : 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
          }}
        >
          <span className="status-pill">
            <span className="status-dot success" />
            Studio live
          </span>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--muted)",
              }}
            >
              Workspace context
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--secondary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {statusText}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 6,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              fontSize: 11,
            }}
          >
            <span style={{ color: "var(--muted)" }}>Credit usage</span>
            <span style={{ color: "var(--secondary)", fontWeight: 600 }}>
              {creditUsedPercent}% used
            </span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <div
              className="progress-fill"
              style={{
                width: `${creditUsedPercent}%`,
                background:
                  creditTone === "warning"
                    ? "linear-gradient(90deg, var(--warning), color-mix(in srgb, var(--destructive) 35%, var(--warning) 65%))"
                    : undefined,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCompactViewport ? "space-between" : "flex-end",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span className="status-pill">
            <span className={`status-dot ${statusTone(saveState)}`} />
            Save: {saveState}
          </span>
          <span className="status-pill">
            <span className={`status-dot ${statusTone(commitStatus)}`} />
            Commit: {commitStatus}
          </span>
        </div>
      </div>
    </footer>
  );
}
