import Link from "next/link";
import { getWebsiteConfig, getNavList, unescapeHtml } from "@/lib/api";

export default async function Footer() {
  let config = null;
  let navList: any[] = [];
  try {
    config = await getWebsiteConfig();
    navList = await getNavList();
  } catch { }

  const siteName = config?.siteName || "官方网站";
  const topNavs = navList.filter((n: any) => n.parentId === 0);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3>{siteName}</h3>
            <p>{config?.seoDescription || "专注产品与服务，为您提供优质解决方案。"}</p>
          </div>
          <div>
            <h3>站点</h3>
            <ul className="footer-list">
              {topNavs.map((nav: any) => (
                <li key={nav.id}><Link href={nav.url}>{nav.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>联系信息</h3>
            <ul className="footer-list">
              {config?.icp && <li>{config.icp}</li>}
            </ul>
          </div>
        </div>
        <p className="footer-note">{config?.footerInfo && (
          <div dangerouslySetInnerHTML={{ __html: unescapeHtml(config.footerInfo) }} />
        )}</p>
      </div>
    </footer>
  );
}
