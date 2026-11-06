import { Inter, Oswald, Roboto_Slab, Tourney } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  weight: "400",
});

export const oswald = Oswald({
  variable: "--oswald",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const tourney = Tourney({
  variable: "--tourney",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const robotoSlab = Roboto_Slab({
  variable: "--roboto-slab",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});
