type AuditDetailValue = string | number | boolean | null | undefined;

type AuditEntry = {
  key: string;
  type: "page" | "slice";
  name: string;
  pathname?: string;
  phase?: string;
  renders: number;
  updates: number;
  totalActualDurationMs: number;
  maxActualDurationMs: number;
  lastActualDurationMs: number;
  lastUpdatedAt: string;
  detail?: Record<string, AuditDetailValue>;
};

type AuditEntryInput = {
  key: string;
  type: AuditEntry["type"];
  name: string;
  pathname?: string;
  phase?: string;
  actualDurationMs?: number;
  detail?: Record<string, AuditDetailValue>;
  incrementRender?: boolean;
  incrementUpdate?: boolean;
};

type RenderAuditApi = {
  enabled: boolean;
  entries: AuditEntry[];
  print: () => void;
  reset: () => void;
  snapshot: () => AuditEntry[];
};

declare global {
  interface Window {
    __galacticRenderAudit?: RenderAuditApi;
  }
}

const AUDIT_STORAGE_KEY = "galactic-render-audit";

const isAuditEnabled = () => {
  if (typeof window === "undefined") {
    return false;
  }

  if (import.meta.env.DEV) {
    return true;
  }

  if (import.meta.env.VITE_GALACTIC_RENDER_AUDIT === "true") {
    return true;
  }

  const query = new URLSearchParams(window.location.search);
  if (query.get("renderAudit") === "1") {
    return true;
  }

  return window.localStorage.getItem(AUDIT_STORAGE_KEY) === "1";
};

const auditStore = new Map<string, AuditEntry>();

const toSnapshot = () =>
  Array.from(auditStore.values()).sort((left, right) => {
    if (right.renders !== left.renders) {
      return right.renders - left.renders;
    }

    if (right.updates !== left.updates) {
      return right.updates - left.updates;
    }

    return right.totalActualDurationMs - left.totalActualDurationMs;
  });

const ensureApi = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.__galacticRenderAudit = {
    enabled: isAuditEnabled(),
    get entries() {
      return toSnapshot();
    },
    print() {
      console.table(
        toSnapshot().map((entry) => ({
          type: entry.type,
          name: entry.name,
          pathname: entry.pathname || "-",
          phase: entry.phase || "-",
          renders: entry.renders,
          updates: entry.updates,
          totalActualDurationMs: Number(entry.totalActualDurationMs.toFixed(2)),
          maxActualDurationMs: Number(entry.maxActualDurationMs.toFixed(2)),
          lastActualDurationMs: Number(entry.lastActualDurationMs.toFixed(2)),
          lastUpdatedAt: entry.lastUpdatedAt,
          detail: entry.detail
            ? Object.entries(entry.detail)
                .map(([key, value]) => `${key}:${String(value ?? "-")}`)
                .join(", ")
            : "",
        })),
      );
    },
    reset() {
      auditStore.clear();
    },
    snapshot() {
      return toSnapshot();
    },
  };
};

const recordAuditEntry = ({
  key,
  type,
  name,
  pathname,
  phase,
  actualDurationMs = 0,
  detail,
  incrementRender = false,
  incrementUpdate = false,
}: AuditEntryInput) => {
  if (!isAuditEnabled()) {
    return;
  }

  const previous = auditStore.get(key);
  const next: AuditEntry = {
    key,
    type,
    name,
    pathname,
    phase,
    renders: previous?.renders || 0,
    updates: previous?.updates || 0,
    totalActualDurationMs: previous?.totalActualDurationMs || 0,
    maxActualDurationMs: previous?.maxActualDurationMs || 0,
    lastActualDurationMs: actualDurationMs,
    lastUpdatedAt: new Date().toISOString(),
    detail: detail || previous?.detail,
  };

  if (incrementRender) {
    next.renders += 1;
    next.totalActualDurationMs += actualDurationMs;
    next.maxActualDurationMs = Math.max(previous?.maxActualDurationMs || 0, actualDurationMs);
  }

  if (incrementUpdate) {
    next.updates += 1;
  }

  auditStore.set(key, next);
  ensureApi();
};

export const recordPageRender = (input: {
  name: string;
  pathname: string;
  phase: string;
  actualDurationMs: number;
}) => {
  recordAuditEntry({
    key: `page:${input.pathname}`,
    type: "page",
    name: input.name,
    pathname: input.pathname,
    phase: input.phase,
    actualDurationMs: input.actualDurationMs,
    incrementRender: true,
  });
};

export const recordSliceUpdate = (
  name: string,
  detail?: Record<string, AuditDetailValue>,
) => {
  recordAuditEntry({
    key: `slice:${name}`,
    type: "slice",
    name,
    detail,
    incrementUpdate: true,
  });
};

ensureApi();
