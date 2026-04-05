"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function ValidatorEconomics() {
  const t = useTranslations("ValidatorEconomicsAwwwards");
  return (
    <section id="stats" className="relative w-full py-32 bg-[#050505] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24 max-w-[800px]"
        >
          <h2 className="font-outfit font-light text-[clamp(2.5rem,5vw,5rem)] text-white tracking-tighter uppercase leading-[1.0] mb-8">
            {t("title1")} <br className="hidden md:block" /> <span className="text-white/30">{t("title2")}</span>
          </h2>
          <p className="font-manrope font-light text-[#A3A3A3] text-[clamp(1rem,1.4vw,1.3rem)] leading-[1.6]">
            {t("description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-20">
          <motion.div
            className="md:col-span-1 p-10 rounded-3xl border border-solrm-amber/10 bg-solrm-amber/[0.02] backdrop-blur-md relative overflow-hidden group hover:bg-solrm-amber/[0.08] hover:border-solrm-amber/30 transition-all duration-700"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0 }}
          >
            <div className="absolute top-0 right-0 p-8 text-solrm-amber/30 opacity-70 group-hover:opacity-100 group-hover:text-solrm-amber/50 transition-all duration-700 pointer-events-none group-hover:scale-110">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 22h20L12 2zm0 4.1L18.7 19H5.3L12 6.1z" />
              </svg>
            </div>
            <h3 className="font-outfit font-medium text-3xl text-solrm-amber uppercase tracking-widest mb-6 mt-8">
              {t("staking")}
            </h3>
            <p className="font-manrope font-light text-[#A3A3A3] text-lg leading-relaxed relative z-10">
              {t("stakingDesc")}
            </p>
          </motion.div>

          <motion.div
            className="md:col-span-1 p-10 rounded-3xl border border-solrm-crimson/10 bg-solrm-crimson/[0.02] backdrop-blur-md relative overflow-hidden group hover:bg-solrm-crimson/[0.08] hover:border-solrm-crimson/30 transition-all duration-700"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <div className="absolute top-0 right-0 p-8 text-solrm-crimson/30 opacity-70 group-hover:opacity-100 group-hover:text-solrm-crimson/50 transition-all duration-700 group-hover:-translate-y-2">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </div>
            <h3 className="font-outfit font-medium text-3xl text-solrm-crimson uppercase tracking-widest mb-6 mt-8">
              {t("slashing")}
            </h3>
            <p className="font-manrope font-light text-neutral-300 text-lg leading-relaxed relative z-10">
              {t("slashingDesc")}
            </p>
          </motion.div>

          <motion.div
            className="md:col-span-1 p-10 rounded-3xl border border-solrm-teal/10 bg-solrm-teal/[0.02] backdrop-blur-md relative overflow-hidden group hover:bg-solrm-teal/[0.08] hover:border-solrm-teal/30 transition-all duration-700"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <div className="absolute top-0 right-0 p-8 text-solrm-teal/30 opacity-70 group-hover:opacity-100 group-hover:text-solrm-teal/50 transition-all duration-700 group-hover:scale-110">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" />
              </svg>
            </div>
            <h3 className="font-outfit font-medium text-3xl text-solrm-teal uppercase tracking-widest mb-6 mt-8">
              {t("rewards")}
            </h3>
            <p className="font-manrope font-light text-[#A3A3A3] text-lg leading-relaxed relative z-10">
              {t("rewardsDesc")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
