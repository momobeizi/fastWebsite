import { getWebsiteConfig, unescapeHtml } from "@/lib/api";

export default async function Footer() {
  let config = null;
  try { config = await getWebsiteConfig(); } catch {}

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm space-y-2">
        {config?.footerInfo && (
          <div dangerouslySetInnerHTML={{ __html: unescapeHtml(config.footerInfo) }} />
        )}
        {/* <p>© {new Date().getFullYear()} {config?.siteName || "官方网站"}. All rights reserved.</p>
        {config?.icp && <p>{config.icp}</p>} */}
      </div>
    </footer>
  );
}
