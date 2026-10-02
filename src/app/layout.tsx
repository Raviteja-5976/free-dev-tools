import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { getStats, getUpstreamCommit } from "@/lib/catalog";

const stats = getStats();

export const metadata: Metadata = {
  title: {
    default: "DevTrackAcademy — Free Dev Tools",
    template: "%s · DevTrackAcademy Free Dev Tools",
  },
  description: `Search ${stats.tools.toLocaleString("en-US")} SaaS, PaaS and IaaS services with real free tiers for developers, across ${stats.categories} categories. Built from the community free-for-dev list.`,
  applicationName: "DevTrackAcademy Free Dev Tools",
  openGraph: {
    title: "DevTrackAcademy — Free Dev Tools",
    description: "A searchable directory of free developer tiers — hosting, databases, CI, email, monitoring and more.",
    type: "website",
    siteName: "DevTrackAcademy",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF8F0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 tactile-btn btn-primary"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter commit={getUpstreamCommit()} />
      </body>
    </html>
  );
}
