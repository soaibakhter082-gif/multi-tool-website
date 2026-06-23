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
      <body className="min-h-screen overflow-x-hidden" suppressHydrationWarning>
        <Script id="pre-hydration-dom-sanitize" strategy="beforeInteractive">
          {`
            (function () {
              function shouldStripAttribute(name) {
                return (
                  name === "bis_skin_checked" ||
                  name === "bis_register" ||
                  name.indexOf("__processed_") === 0
                );
              }

              function stripAttributes(root) {
                if (!root || root.nodeType !== 1 || !root.getAttributeNames) {
                  return;
                }

                var nodes = [root];
                if (root.querySelectorAll) {
                  nodes = nodes.concat(Array.prototype.slice.call(root.querySelectorAll("*")));
                }

                nodes.forEach(function (node) {
                  node.getAttributeNames().forEach(function (name) {
                    if (shouldStripAttribute(name)) {
                      node.removeAttribute(name);
                    }
                  });
                });
              }

              stripAttributes(document.documentElement);

              var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                  if (
                    mutation.type === "attributes" &&
                    mutation.target &&
                    shouldStripAttribute(mutation.attributeName || "")
                  ) {
                    mutation.target.removeAttribute(mutation.attributeName);
                  }

                  mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                      stripAttributes(node);
                    }
                  });
                });
              });

              observer.observe(document.documentElement, {
                subtree: true,
                childList: true,
                attributes: true,
              });

              window.addEventListener(
                "load",
                function () {
                  stripAttributes(document.documentElement);
                  window.setTimeout(function () {
                    observer.disconnect();
                  }, 0);
                },
                { once: true }
              );
            })();
          `}
        </Script>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var key = "toolspark-theme";
                var saved = window.localStorage.getItem(key);
                var theme = saved === "dark" || saved === "light" ? saved : "light";
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
