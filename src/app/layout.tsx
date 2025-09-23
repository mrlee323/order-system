import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/common/QueryProvider";

export const metadata: Metadata = {
  title: "Order System",
  description: "매장 주문 시스템",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
