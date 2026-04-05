import { ReactNode } from "react";

interface TutorialNodeProps {
  roleBadge: string;
  title: string;
  description: string;
  children: ReactNode;
  isActive?: boolean;
}

export function TutorialNode({ roleBadge, title, description, children, isActive = true }: TutorialNodeProps) {
  return (
    <div
      className={`w-[1050px] shrink-0 bg-[#050505]/95 border ${isActive ? "border-[#8ECAE6]/50 shadow-[0_0_30px_rgba(142,202,230,0.1)]" : "border-white/5 opacity-50"} rounded-xl backdrop-blur-xl flex flex-col relative overflow-hidden transition-all duration-500`}
    >
      <div className="px-5 py-5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded bg-[#8ECAE6]/10 border border-[#8ECAE6]/20 text-[#8ECAE6] text-[10px] font-mono uppercase tracking-widest leading-none">
            {roleBadge}
          </span>
        </div>
        <h3 className="font-unbounded font-medium text-white text-xl">{title}</h3>
        <p className="text-[#A0A0A0] font-onest text-[14px] mt-2.5 leading-relaxed">{description}</p>
      </div>

      <div className="p-5 flex flex-col gap-5">{children}</div>
    </div>
  );
}
