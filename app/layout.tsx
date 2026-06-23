import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ToolSpark",
    template: "%s | ToolSpark",
  },
  description:
    "ToolSpark is an original, free multi-tool website where everyday tasks are done directly in your browser.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen overflow-x-hidden">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var key = "toolspark-theme";
                var saved = window.localStorage.getItem(key);
                var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                var theme = saved === "dark" || saved === "light" ? saved : (systemDark ? "dark" : "light");
                document.documentElement.classList.toggle("dark", theme === "dark");
                document.documentElement.style.colorScheme = theme;
              } catch (error) {}
            })();
          `}
        </Script>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
