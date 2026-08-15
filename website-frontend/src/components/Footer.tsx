import Link from "next/link";
import { getWebsiteConfig, getNavList, unescapeHtml } from "@/lib/api";

const PLATFORM_LABELS: Record<string, string> = {
  github: "GitHub",
  wechat: "微信",
  weibo: "微博",
  zhihu: "知乎",
  bilibili: "Bilibili",
  twitter: "Twitter",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  juejin: "掘金",
  other: "其他",
};

export default async function Footer() {
  let config = null;
  let navList: any[] = [];
  try {
    config = await getWebsiteConfig();
    navList = await getNavList();
  } catch { }

  const siteName = config?.siteName || "官方网站";
  const topNavs = navList.filter((n: any) => n.parentId === 0);
  const socials = config?.socials || [];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3>{siteName}</h3>
            <p>{config?.seoDescription || "专注产品与服务，为您提供优质解决方案。"}</p>
            {config?.address && (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, marginTop: 8 }}>{config.address}</p>
            )}
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
              {config?.email && (
                <li><a href={`mailto:${config.email}`}>{config.email}</a></li>
              )}
              {config?.contactPhone && (
                <li><a href={`tel:${config.contactPhone}`}>{config.contactPhone}</a></li>
              )}
            </ul>
            {socials.length > 0 && (
              <ul className="footer-list" style={{ marginTop: 12 }}>
                {socials.map((s, i) => (
                  <li key={i}>
                    <a href={s.url || "#"} target={s.url ? "_blank" : undefined} rel="noreferrer">
                      {PLATFORM_LABELS[s.platform] || s.platform}：{s.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {config?.footerInfo && (
          <div className="footer-note" style={{ marginTop: 20 }} dangerouslySetInnerHTML={{ __html: unescapeHtml(config.footerInfo) }} />
        )}
      </div>
    </footer>
  );
}
