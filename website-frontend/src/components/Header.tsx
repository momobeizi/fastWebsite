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
  const siteName = config?.siteName || "官方网站";
  const brandChar = siteName.charAt(0);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${siteName} 首页`}>
          {config?.logo ? (
            <img src={resolveImageUrl(config.logo)} alt={siteName} style={{ height: 40 }} />
          ) : (
            <span className="brand-mark">{brandChar}</span>
          )}
          <span>{siteName}</span>
        </Link>
        <nav className="nav-panel" aria-label="主导航">
          {topNavs.map(nav => (
            <Link
              key={nav.id}
              href={nav.url}
              className="nav-link"
            >
              {nav.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
