const CART_SESSION_KEY = "tarkam_cart_session_id";

export function getCartSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const stored = window.localStorage.getItem(CART_SESSION_KEY);
    if (stored) {
      return stored;
    }
  } catch {
    // ignore localStorage access issues
  }

  const id = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `tarkam-${Math.random().toString(36).slice(2)}-${Date.now()}`;

  try {
    window.localStorage.setItem(CART_SESSION_KEY, id);
  } catch {
    // ignore localStorage write issues
  }

  return id;
}

export function getCartRequestPayload(data: Record<string, unknown>): Record<string, unknown> {
  const sessionId = getCartSessionId();

  return {
    ...data,
    session_id: sessionId,
  };
}

export function getCartQueryString(): string {
  const sessionId = getCartSessionId();
  return sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "";
}
