"use client";

import { X } from "@phosphor-icons/react";
import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-[#050505]/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="bg-[#0A0A0A] border border-white/10 shadow-2xl rounded-2xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-exo2 text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#555] hover:bg-white/10 hover:text-white transition-colors"
          >
            <X weight="bold" className="size-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="font-onest text-sm text-[#A3A3A3] leading-relaxed">{description}</p>
        </div>

        <div className="px-6 py-4 bg-[#050505] flex items-center justify-end gap-3 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-onest font-medium text-sm text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg font-onest font-medium text-sm transition-colors ${
              isDestructive
                ? "bg-[#FF1515]/10 text-[#FF1515] hover:bg-[#FF1515] hover:text-white"
                : "bg-[#10D9B0]/10 text-[#10D9B0] hover:bg-[#10D9B0] hover:text-black"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
