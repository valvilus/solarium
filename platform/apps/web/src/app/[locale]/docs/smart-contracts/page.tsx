import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { CodeTerminal } from "@/components/docs/ui/CodeTerminal";
import { FileCode, ShieldChevron, BracketsCurly } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Smart Contracts | Solarium Protocol",
  description: "Cross-Program Invocation (CPI) guide for integrating Solarium.",
};

export default function DocsSmartContracts() {
  const t = useTranslations("DocsSmartContracts");

  return (
    <div className="flex flex-col max-w-[700px]">
      <div className="mb-10">
        <h1 className="font-exo2 text-[2.5rem] font-bold text-white mb-2 leading-tight">{t("title")}</h1>
        <p className="font-onest text-[#A3A3A3] text-[1.1rem]">{t("subtitle")}</p>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <ShieldChevron weight="fill" className="text-[#8BA3C0] size-6" />
            <h2 className="font-exo2 text-[1.75rem] font-semibold text-white">{t("cargoTitle")}</h2>
          </div>
          <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-6">{t("cargoDesc")}</p>
          <CodeTerminal
            language="toml"
            code={`[dependencies]
solarium-cpi = { version = "0.1.0", features = ["cpi"] }
anchor-lang = "0.32.0"`}
          />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <BracketsCurly weight="fill" className="text-[#8BA3C0] size-6" />
            <h2 className="font-exo2 text-[1.75rem] font-semibold text-white">{t("initTitle")}</h2>
          </div>
          <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-4">{t("initDesc")}</p>
          <CodeTerminal
            language="rust"
            code={`use solarium_cpi::cpi::accounts::CreateTask;
use solarium_cpi::program::Solarium;

pub fn request_ai_inference(ctx: Context<ExecuteLogic>) -> Result<()> {
    let cpi_program = ctx.accounts.solarium_program.to_account_info();
    let cpi_accounts = CreateTask {
        user: ctx.accounts.user.to_account_info(),
        task: ctx.accounts.task_pda.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    

    solarium_cpi::cpi::create_task(
        cpi_ctx, 
        "Tell me the weather".to_string(), 
        1,
        1_000_000
    )?;
    
    Ok(())
}`}
          />
        </section>
      </div>

      <div className="mt-16 w-full h-[1px] bg-white/5" />
      <div className="mt-8 flex justify-between">
        <a href="/docs/quickstart" className="flex flex-col items-start group">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Previous</span>
          <span className="font-exo2 text-lg text-white group-hover:text-[#8BA3C0] transition-colors flex items-center gap-2">
            &larr; Quickstart
          </span>
        </a>
        <a href="/docs/sdk" className="flex flex-col items-end group">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Next</span>
          <span className="font-exo2 text-lg text-white group-hover:text-[#8BA3C0] transition-colors flex items-center gap-2">
            SDK Reference &rarr;
          </span>
        </a>
      </div>
    </div>
  );
}
