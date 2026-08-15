import { getBanners, getArticleList, getProductList, getWebsiteConfig } from "@/lib/api";
import Banner from "@/components/Banner";
import ArticleCard from "@/components/ArticleCard";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default async function HomePage() {
  let banners: any[] = [];
  let articles: any[] = [];
  let products: any[] = [];
  let config: any = null;

  try {
    const bannerRes = await getBanners("home");
    banners = Array.isArray(bannerRes) ? bannerRes : (bannerRes as any)?.list || [];
  } catch {}

  try {
    const articleRes = await getArticleList("limit=6&sortBy=createTime:DESC");
    articles = (articleRes as any)?.list || [];
  } catch {}

  try {
    const productRes = await getProductList("limit=6&sortBy=sort:ASC");
    products = (productRes as any)?.list || [];
  } catch {}

  try {
    config = await getWebsiteConfig();
  } catch {}

  const siteName = config?.siteName || "官方网站";

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">OFFICIAL · 2026</p>
            <h1 className="hero-title">{siteName}</h1>
            <p className="hero-lead">
              {config?.seoDescription || "专注产品与服务，为客户提供卓越的解决方案。"}
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="/products">浏览产品</a>
              <a className="btn btn-ghost" href="/articles">阅读资讯</a>
            </div>
            {articles.length > 0 && (
              <div className="hero-meta">
                <span className="meta-chip">最新动态</span>
                <span className="meta-chip">{articles.length} 篇文章</span>
              </div>
            )}
          </div>

          {banners.length > 0 && (
            <aside className="hero-readme" aria-label="轮播展示">
              <Banner banners={banners} />
            </aside>
          )}
        </div>
      </section>

      {/* 产品展示 */}
      {products.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="section-kicker eyebrow">PRODUCTS</p>
                <h2>产品展示</h2>
              </div>
              <Link className="section-link" href="/products">全部产品 →</Link>
            </div>
            <div className="product-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* 文章列表 */}
      {articles.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="section-kicker eyebrow">NEWS</p>
                <h2>文章</h2>
              </div>
              <Link className="section-link" href="/articles">全部文章 →</Link>
            </div>
            <div className="article-grid">
              {articles.map((a, i) => <ArticleCard key={a.id} article={a} index={i + 1} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
