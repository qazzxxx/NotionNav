import type { Metadata, Viewport } from "next";
import "./globals.css";

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
        className={`antialiased bg-nav-bg dark:bg-black`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
