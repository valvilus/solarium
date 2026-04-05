"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const codeSnippet = `// 1. Construct the inference payload
let prompt = String::from("Analyze on-chain metadata...");


solarium::cpi::request_inference{
    CpiContext::new(
        ctx.accounts.solarium_program.to_account_info(),
        solarium::cpi::accounts::RequestInference {
            requester: ctx.accounts.user.to_account_info(),
            oracle_state: ctx.accounts.oracle.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
        },
    ),
    prompt,
    Model::Llama3_8B,
}?;

`;

export function ContractIntegration() {
  const t = useTranslations("ContractIntegrationAwwwards");
  return (
    <section className="relative w-full py-32 bg-[#0A0A0A] overflow-hidden border-t border-white/5">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col xl:flex-row gap-16 lg:gap-24 items-center">
          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, x: -50, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-outfit font-light text-[clamp(2.5rem,4vw,4.5rem)] text-white tracking-tighter uppercase leading-[1.0] mb-12">
              {t("title1")} <br className="hidden md:block" />
              <span className="text-white/30">{t("title2")}</span>
            </h2>

            <div className="space-y-10 max-w-xl">
              <div className="border-l-2 border-white/20 pl-6">
                <h4 className="font-outfit font-medium text-2xl text-white uppercase tracking-wider mb-4">
                  {t("feature1Title")}
                </h4>
                <p className="font-manrope font-light text-[#A3A3A3] text-lg leading-relaxed">{t("feature1Desc")}</p>
              </div>
              <div className="border-l-2 border-white/20 pl-6">
                <h4 className="font-outfit font-medium text-xl text-white uppercase tracking-wider mb-4">
                  {t("feature2Title")}
                </h4>
                <ul className="font-manrope font-light text-[#A3A3A3] text-lg space-y-3">
                  <li className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    {t("list1")}
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    {t("list2")}
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    {t("list3")}
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 w-full relative"
            initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="absolute -inset-10 bg-gradient-to-tr from-white/5 to-white/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative rounded-2xl border border-white/10 bg-[#050505]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                <div className="flex gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] opacity-80" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-80" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] opacity-80" />
                </div>
                <div className="text-xs font-mono text-neutral-500 tracking-wider">programs/client/src/lib.rs</div>
                <div className="w-12"></div>
              </div>

              <div className="p-6 md:p-8 overflow-x-auto text-[0.85rem] md:text-[0.95rem] font-mono leading-relaxed text-[#E2E8F0] selection:bg-white/20">
                <pre>
                  <code>
                    {codeSnippet.split("\n").map((line, i) => {
                      if (line.trim().startsWith("//")) {
                        return (
                          <div key={i} className="text-[#6B7280]">
                            {line}
                          </div>
                        );
                      }

                      const coloredLine = line
                        .replace("let ", "<span class='text-[#f43f5e]'>let </span>")
                        .replace(" prompt = ", " prompt = ")
                        .replace("String::from", "<span class='text-[#3b82f6]'>String</span>::from")
                        .replace(
                          '"Analyze on-chain metadata..."',
                          "<span class='text-[#10b981]'>\"Analyze on-chain metadata...\"</span>"
                        )
                        .replace("solarium::cpi::", "<span class='text-[#a855f7]'>solarium::cpi::</span>")
                        .replace("CpiContext::new", "<span class='text-[#3b82f6]'>CpiContext</span>::new")
                        .replace("Model::Llama3_8B", "<span class='text-[#eab308]'>Model</span>::Llama3_8B");

                      return <div key={i} dangerouslySetInnerHTML={{ __html: coloredLine || "&nbsp;" }} />;
                    })}
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
