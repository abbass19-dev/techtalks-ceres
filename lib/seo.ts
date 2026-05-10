// Replace this URL with your real production domain before launch.
export const siteUrl = "https://mceres.vercel.app";

export const siteName = "CÉRES";

export const siteTitle = "CÉRES – Precision Nutrition Intelligence";

export const siteDescription =
  "CÉRES is a nutrition and meal-planning platform that helps users create recipes, calculate nutrients, plan meals, and track their health goals.";

export const siteKeywords = [
  "CÉRES",
  "precision nutrition",
  "nutrition calculator",
  "meal planning",
  "weekly meal planner",
  "recipe nutrition analysis",
  "health goals",
  "recipe builder",
];

export const sitemapRoutes = [
  {
    path: "/",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/signin",
    changeFrequency: "monthly",
    priority: 0.3,
  },
  {
    path: "/signup",
    changeFrequency: "monthly",
    priority: 0.5,
  },
] as const;

export const privateRoutes = [
  "/add-recipe",
  "/api",
  "/calorie-calculator",
  "/community-recipes",
  "/dashboard",
  "/home",
  "/my-recipes",
  "/saved-recipes",
  "/set-goals",
  "/settings",
  "/weekly-planner",
] as const;
