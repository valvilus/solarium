"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#0A0A0A] group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-[0_0_20px_rgba(0,0,0,0.5)] font-mono text-sm",
          description: "group-[.toast]:text-[#A3A3A3] font-onest text-xs mt-1",
          success: "group-[.toaster]:border-[#10D9B0]/30",
          error: "group-[.toaster]:border-[#FF1515]/30",
          actionButton: "group-[.toast]:bg-[#10D9B0] group-[.toast]:text-black bg-[#10D9B0] font-bold",
          cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white",
        },
      }}
    />
  );
}
