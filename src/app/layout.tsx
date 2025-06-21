import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "导航页",
  description: "自用的导航站",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* iconfont 在线链接 */}
        <link
          rel="stylesheet"
          href="//at.alicdn.com/t/c/font_4908554_hdt4ouwtmyh.css"
        />
        {/* 和风天气图标 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/qweather-icons@1.3.0/font/qweather-icons.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-nav-bg dark:bg-black`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
