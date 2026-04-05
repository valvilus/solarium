export type AppCategory = "finance" | "insurance" | "security";

export type AppStatus = "live" | "beta" | "coming_soon";

export type AppMeta = {
  readonly slug: string;
  readonly nameKey: string;
  readonly taglineKey: string;
  readonly descriptionKey: string;
  readonly categoryKey: string;
  readonly accentColor: string;
  readonly accentRgb: string;
  readonly bgGradient: string;
  readonly category: AppCategory;
  readonly status: AppStatus;
  readonly imageSrc: string;
};

export const APP_REGISTRY: readonly AppMeta[] = [
  {
    slug: "residao",
    nameKey: "Apps.residao.name",
    taglineKey: "Apps.residao.tagline",
    descriptionKey: "Apps.residao.description",
    categoryKey: "Apps.residao.category",
    accentColor: "#00C2FF",
    accentRgb: "0, 194, 255",
    bgGradient: "linear-gradient(135deg, #030d1a 0%, #001a33 100%)",
    category: "finance",
    status: "live",
    imageSrc: "/apps/residao.png",
  },
  {
    slug: "insurai",
    nameKey: "Apps.insurai.name",
    taglineKey: "Apps.insurai.tagline",
    descriptionKey: "Apps.insurai.description",
    categoryKey: "Apps.insurai.category",
    accentColor: "#84CC16",
    accentRgb: "132, 204, 22",
    bgGradient: "linear-gradient(135deg, #0f172a 0%, #064e3b 100%)",
    category: "insurance",
    status: "live",
    imageSrc: "/apps/insurai.png",
  },
  {
    slug: "defisentinel",
    nameKey: "Apps.defisentinel.name",
    taglineKey: "Apps.defisentinel.tagline",
    descriptionKey: "Apps.defisentinel.description",
    categoryKey: "Apps.defisentinel.category",
    accentColor: "#F1B959",
    accentRgb: "241, 185, 89",
    bgGradient: "linear-gradient(135deg, #1A1303 0%, #2D2005 100%)",
    category: "security",
    status: "beta",
    imageSrc: "/apps/sentinel.png",
  },
  {
    slug: "bugbounty",
    nameKey: "Apps.bugbounty.name",
    taglineKey: "Apps.bugbounty.tagline",
    descriptionKey: "Apps.bugbounty.description",
    categoryKey: "Apps.bugbounty.category",
    accentColor: "#7C3AED",
    accentRgb: "124, 58, 237",
    bgGradient: "linear-gradient(135deg, #080012 0%, #130024 100%)",
    category: "security",
    status: "beta",
    imageSrc: "/apps/bugbounty.png",
  },
];
