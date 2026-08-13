import Link from "next/link";
import { getWebsiteConfig, getNavList, resolveImageUrl, WebsiteNav } from "@/lib/api";

export default async function Header() {
  let config = null;
  let navList: WebsiteNav[] = [];
  try {
    config = await getWebsiteConfig();
    navList = await getNavList();
  } catch {}

  const topNavs = navList.filter(n => n.parentId === 0);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          {config?.logo ? (
            <img src={resolveImageUrl(config.logo)} alt={config.siteName} className="h-10" />
          ) : (
            config?.siteName || "官方网站"
          )}
        </Link>
        <nav className="flex items-center gap-1">
          {topNavs.map(nav => (
            <Link
              key={nav.id}
              href={nav.url}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {nav.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
