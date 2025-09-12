import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "POS & QR Ordering System",
  description: "매장 POS(PWA) & QR 주문 시스템",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
