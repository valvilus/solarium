"use client";

import { useState, useEffect, useCallback } from "react";

type ToastType = "success" | "error";

type ToastState = {
  readonly message: string;
  readonly type: ToastType;
  readonly id: number;
};

type ToastHook = {
  readonly toasts: ReadonlyArray<ToastState>;
  readonly showSuccess: (message: string) => void;
  readonly showError: (message: string) => void;
};

const TOAST_DURATION_MS = 4000;
let nextId = 0;

export function useToast(): ToastHook {
  const [toasts, setToasts] = useState<ReadonlyArray<ToastState>>([]);

  const addToast = useCallback((message: string, type: ToastType): void => {
    const id = nextId++;
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  const showSuccess = useCallback((msg: string): void => addToast(msg, "success"), [addToast]);
  const showError = useCallback((msg: string): void => addToast(msg, "error"), [addToast]);

  return { toasts, showSuccess, showError };
}

type ToastContainerProps = {
  readonly toasts: ReadonlyArray<ToastState>;
};

export const ToastContainer = ({ toasts }: ToastContainerProps): JSX.Element => (
  <div className="fixed bottom-6 right-6 z-[100] space-y-2 max-w-sm">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-xl shadow-2xl animate-[slideIn_0.3s_ease-out] ${
          toast.type === "success"
            ? "bg-green-500/10 border-green-500/30 text-green-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}
      >
        <div className={`w-2 h-2 rounded-full shrink-0 ${toast.type === "success" ? "bg-green-400" : "bg-red-400"}`} />
        <span className="text-xs font-semibold">{toast.message}</span>
      </div>
    ))}
  </div>
);
