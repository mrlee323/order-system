import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Order System",
    short_name: "Order",
    description: "매장 주문 시스템",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon_192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon_512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
