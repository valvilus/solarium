import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono, Outfit, Onest, Unbounded, Exo_2 } from "next/font/google";
import { WalletContextProvider } from "@/providers/wallet-provider";
import "@/app/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { getMessages } from "next-intl/server";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  display: "swap",
});

const exo2 = Exo_2({
  subsets: ["latin", "cyrillic"],
  variable: "--font-exo2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Solarium Protocol | Verifiable AI",
  description: "Devnet dashboard for verifiable AI inference on Solana.",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  readonly children: ReactNode;
  params: { locale: string };
}): Promise<JSX.Element> {
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`dark ${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} ${onest.variable} ${unbounded.variable} ${exo2.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-[#000000] text-neutral-300 antialiased overflow-auto selection:bg-white/90 selection:text-black font-sans"
        suppressHydrationWarning
      >
        <CustomCursor />
        <NextIntlClientProvider messages={messages}>
          <WalletContextProvider>{children}</WalletContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
