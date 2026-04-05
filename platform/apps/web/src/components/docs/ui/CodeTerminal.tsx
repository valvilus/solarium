"use client";

import { useState } from "react";
import { Copy, Check } from "@phosphor-icons/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeTerminalProps {
  language?: string;
  code: string;
}

export function CodeTerminal({ language = "bash", code }: CodeTerminalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#0A0A0A] rounded-xl border border-white/5 overflow-hidden my-6">
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <span className="font-mono text-[11px] text-[#555] uppercase tracking-widest ml-4">{language}</span>
        </div>
        <button onClick={handleCopy} className="text-[#555] hover:text-white transition-colors p-1" title="Copy code">
          {copied ? <Check weight="bold" /> : <Copy weight="bold" />}
        </button>
      </div>
      <div className="overflow-x-auto text-[13.5px]">
        <SyntaxHighlighter
          language={
            language.toLowerCase() === "typescript" || language === "ts" ? "typescript" : language.toLowerCase()
          }
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "20px",
            background: "transparent",
            fontFamily: "var(--font-mono), monospace",
          }}
          codeTagProps={{
            style: { fontFamily: "inherit" },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
