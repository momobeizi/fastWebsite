import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getWebsiteConfig } from "@/lib/api";

const geistSans = Geist({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = await getWebsiteConfig();
    return {
      title: { default: config.seoTitle || config.siteName, template: `%s | ${config.siteName}` },
      description: config.seoDescription || "",
      keywords: config.seoKeywords || "",
    };
  } catch {
    return { title: "官方网站" };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geistSans.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
