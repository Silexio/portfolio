import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";
import { META } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Silexio",
    short_name: "Silexio",
    description: META.description.fr,
    start_url: "/fr",
    display: "browser",
    background_color: BRAND.bg,
    theme_color: BRAND.accent,
    icons: [
      { src: "/icon_x48.png", sizes: "48x48", type: "image/png" },
      { src: "/icon_x72.png", sizes: "72x72", type: "image/png" },
      { src: "/icon_x96.png", sizes: "96x96", type: "image/png" },
      { src: "/icon_x128.png", sizes: "128x128", type: "image/png" },
      { src: "/icon_x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon_x384.png", sizes: "384x384", type: "image/png" },
      {
        src: "/icon_x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon_x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/icon_x1024.png", sizes: "1024x1024", type: "image/png" },
    ],
  };
}
