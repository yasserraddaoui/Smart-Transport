import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import ToastHost from "../ui/feedback/ToastHost";
import { API_ERROR_EVENT, ApiErrorEventDetail } from "../services/api";

export type ToastType = "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  createdAt: number;
};

type ToastContextValue = {
  push: (toast: Omit<Toast, "id" | "createdAt">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast: Omit<Toast, "id" | "createdAt">) => {
      const item: Toast = { ...toast, id: makeId(), createdAt: Date.now() };
      setToasts((prev) => [item, ...prev].slice(0, 4));
      window.setTimeout(() => remove(item.id), 4500);
    },
    [remove],
  );

  const api = useMemo<ToastContextValue>(() => {
    return {
      push,
      success: (title, message) => push({ type: "success", title, message }),
      error: (title, message) => push({ type: "error", title, message }),
      info: (title, message) => push({ type: "info", title, message }),
      warning: (title, message) => push({ type: "warning", title, message }),
    };
  }, [push]);

  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent<ApiErrorEventDetail>).detail;
      if (!detail) return;
      if (!detail.status) return;
      if (detail.status === 401) push({ type: "warning", title: "Session expiree", message: "Veuillez vous reconnecter." });
      else if (detail.status === 403) push({ type: "error", title: "Acces refuse", message: "Permissions insuffisantes." });
      else if (detail.status >= 500) push({ type: "error", title: "Erreur serveur", message: detail.message });
    };
    window.addEventListener(API_ERROR_EVENT, handler);
    return () => window.removeEventListener(API_ERROR_EVENT, handler);
  }, [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastHost toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  );
}
