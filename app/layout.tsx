import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ドールズフロントライン2：エクシリウム",
  description: "ドールズフロントライン2：エクシリウム キャラ資料サイト",
  icons: {
    icon: "/images/details/9/%E5%9B%B3%E9%91%91/03.png",
    shortcut: "/images/details/9/%E5%9B%B3%E9%91%91/03.png",
    apple: "/images/details/9/%E5%9B%B3%E9%91%91/03.png"
  }
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
