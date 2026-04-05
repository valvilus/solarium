"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useTranslations } from "next-intl";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Globe,
  Stack,
  ChartBar,
  Plug,
  Code,
  Users,
  FileText,
  ShieldCheck,
  Cpu,
  Robot,
  Buildings,
  CloudRain,
  Graph,
  Bug,
} from "@phosphor-icons/react";

function ListItem({ title, description, icon: Icon, href, isBeta, ...props }: any) {
  const content = (
    <>
      <div className="bg-white/5 flex aspect-square size-10 items-center justify-center rounded-md border border-white/10 shadow-sm shrink-0">
        <Icon weight="fill" className="text-white/80 size-5" />
      </div>
      <div className="flex flex-col items-start justify-center">
        <span className="font-onest font-medium text-white/90 text-sm flex items-center gap-2">
          {title}
          {isBeta && (
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 text-white/40 tracking-wider font-bold">
              BETA
            </span>
          )}
        </span>
        <span className="font-onest text-white/50 text-[11px] leading-tight mt-0.5">{description}</span>
      </div>
    </>
  );

  return (
    <NavigationMenuLink asChild>
      {isBeta ? (
        <div
          className={`w-full flex flex-row gap-x-3 bg-transparent rounded-lg p-3 transition-colors opacity-50 cursor-not-allowed`}
          {...props}
        >
          {content}
        </div>
      ) : (
        <Link
          href={href}
          className={`w-full flex flex-row gap-x-3 hover:bg-white/5 bg-transparent rounded-lg p-3 transition-colors`}
          {...props}
        >
          {content}
        </Link>
      )}
    </NavigationMenuLink>
  );
}

const getProductLinks = (locale: string, t: any) => [
  { title: t("appResidao"), href: `/${locale}/residao`, description: t("appResidaoDesc"), icon: Buildings },
  { title: t("appInsurai"), href: `/${locale}/insurai`, description: t("appInsuraiDesc"), icon: CloudRain },
  { title: t("appSentinel"), href: `#`, description: t("appSentinelDesc"), icon: Graph, isBeta: true },
  { title: t("appBugBounty"), href: `#`, description: t("appBugBountyDesc"), icon: Bug, isBeta: true },
];

const getDocLinks = (locale: string, t: any) => [
  { title: t("docQuickstart"), href: `/${locale}/docs/quickstart`, description: t("docQuickstartDesc"), icon: Code },
  {
    title: t("docArchitecture"),
    href: `/${locale}/docs/architecture`,
    description: t("docArchitectureDesc"),
    icon: Cpu,
  },
  { title: t("docWorker"), href: `/${locale}/docs/nodes/worker`, description: t("docWorkerDesc"), icon: Robot },
  {
    title: t("docValidator"),
    href: `/${locale}/docs/nodes/validator`,
    description: t("docValidatorDesc"),
    icon: ShieldCheck,
  },
];

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1] || "en";
  const isLandingPage = pathname === `/${locale}` || pathname === `/${locale}/`;

  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const tSidebar = useTranslations("Sidebar");
  const tLinks = useTranslations("HeaderLinks");

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const renderWalletButton = () => {
    if (connected && publicKey) {
      return (
        <button
          onClick={() => disconnect()}
          className="group relative flex items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5 px-6 py-2.5 backdrop-blur-md transition-all duration-300 hover:bg-white cursor-pointer"
          title={tSidebar("disconnect")}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/70 mr-3 group-hover:bg-[#FF1515] transition-colors shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:shadow-[0_0_8px_#FF1515]" />
          <span className="font-onest font-medium uppercase tracking-widest text-[11px] text-white/90 group-hover:text-black transition-colors relative z-10 top-[0.5px]">
            {truncateAddress(publicKey.toBase58())}
          </span>
        </button>
      );
    }

    return (
      <button
        onClick={() => setVisible(true)}
        className="group relative flex items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black cursor-pointer"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white/50 mr-3 group-hover:bg-black/50 transition-colors flex-shrink-0" />
        <span className="font-onest font-medium uppercase tracking-widest text-[11px] relative z-10 top-[0.5px]">
          {tSidebar("connectWallet")}
        </span>
      </button>
    );
  };

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;
    localStorage.setItem("NEXT_LOCALE", newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    const currentPathWithoutLocale = pathname.replace(`/${locale}`, "");
    router.push(`/${newLocale}${currentPathWithoutLocale || ""}`);
  };

  const LanguageToggle = () => (
    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-md">
      <button
        onClick={() => switchLanguage("en")}
        className={`px-3 flex items-center justify-center h-6 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-300 ${
          locale === "en" ? "bg-white text-black shadow-sm" : "text-[#A3A3A3] hover:text-white hover:bg-white/5"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage("ru")}
        className={`px-3 flex items-center justify-center h-6 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all duration-300 ${
          locale === "ru" ? "bg-white text-black shadow-sm" : "text-[#A3A3A3] hover:text-white hover:bg-white/5"
        }`}
      >
        RU
      </button>
    </div>
  );

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? "bg-[#0A0A0A]/60 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.6)] border-b border-white/10 h-14"
            : "bg-[#0A0A0A]/20 backdrop-blur-md border-b border-white/5 h-[72px]"
        }`}
        initial={{ y: isLandingPage ? -100 : 0 }}
        animate={{ y: 0 }}
        transition={{ duration: isLandingPage ? 1 : 0, ease: [0.16, 1, 0.3, 1], delay: isLandingPage ? 1.5 : 0 }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-3 group z-[60]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              className="group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              <path d="M16 3 L28 9.5 L16 16 L4 9.5 Z" fill="#FFFFFF" fillOpacity="0.15" />

              <path d="M4 10.5 L15.5 16.8 V29 L4 22.5 Z" fill="#FFFFFF" fillOpacity="0.5" />

              <path d="M28 10.5 L16.5 16.8 V29 L28 22.5 Z" fill="#FFFFFF" />
            </svg>
            <span className="font-unbounded font-medium tracking-[0.2em] uppercase text-white/90 text-[13px] mt-[1px]">
              {tSidebar("solarium")}
            </span>
          </Link>

          <div className="hidden lg:flex items-center relative z-[60]">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <Link href={`/${locale}/dashboard`} legacyBehavior passHref>
                    <NavigationMenuLink className="px-4 py-2 rounded-md text-[15px] font-onest font-medium text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-colors">
                      {tSidebar("dashboard")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href={`/${locale}/explorer`} legacyBehavior passHref>
                    <NavigationMenuLink className="px-4 py-2 rounded-md text-[15px] font-onest font-medium text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-colors">
                      {tSidebar("explorer")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent px-4 py-2 text-[15px] font-onest font-medium text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-colors focus:bg-transparent data-[state=open]:bg-white/5 data-[state=open]:text-white">
                    {tSidebar("apps")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-2 w-[340px]">
                      <ul className="grid grid-cols-1 gap-1">
                        {getProductLinks(locale, tLinks).map((item, i) => (
                          <li key={i}>
                            <ListItem {...item} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent px-4 py-2 text-[15px] font-onest font-medium text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-colors focus:bg-transparent data-[state=open]:bg-white/5 data-[state=open]:text-white">
                    {tSidebar("docs")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-2 w-[340px]">
                      <ul className="grid grid-cols-1 gap-1">
                        {getDocLinks(locale, tLinks).map((item, i) => (
                          <li key={i}>
                            <ListItem {...item} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <LanguageToggle />
            {renderWalletButton()}
          </div>

          <button
            className="lg:hidden flex flex-col justify-center gap-[5px] w-8 h-8 z-[60] relative group"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div
              className={`w-8 h-[1px] bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-[6px]" : ""}`}
            />
            <div
              className={`w-8 h-[1px] bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}
            />
            <div
              className={`w-8 h-[1px] bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`}
            />
          </button>
        </div>
      </motion.header>

      <div
        className={`fixed inset-0 z-[45] bg-[#0A0A0A]/95 backdrop-blur-2xl lg:hidden transition-opacity duration-500 flex flex-col items-center justify-center gap-8 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-10 text-center pt-24 w-full px-6">
          <Link
            href={`/${locale}/dashboard`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-3xl font-unbounded font-medium uppercase tracking-widest text-[#E2E8F0] hover:text-white"
          >
            {tSidebar("dashboard")}
          </Link>
          <Link
            href={`/${locale}/explorer`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-3xl font-unbounded font-medium uppercase tracking-widest text-[#E2E8F0] hover:text-white"
          >
            {tSidebar("explorer")}
          </Link>
          <Link
            href={`/${locale}/apps`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-3xl font-unbounded font-medium uppercase tracking-widest text-[#E2E8F0] hover:text-white"
          >
            {tSidebar("apps")}
          </Link>
          <Link
            href={`/${locale}/docs`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-3xl font-unbounded font-medium uppercase tracking-widest text-[#E2E8F0] hover:text-white"
          >
            {tSidebar("docs")}
          </Link>

          <div className="mt-8 flex justify-center">
            <LanguageToggle />
          </div>

          <div className="mt-4 w-full max-w-[280px]">{renderWalletButton()}</div>
        </nav>
      </div>
    </>
  );
}
