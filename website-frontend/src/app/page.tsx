import { getBanners, getArticleList, getProductList } from "@/lib/api";
import Banner from "@/components/Banner";
import ArticleCard from "@/components/ArticleCard";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default async function HomePage() {
  let banners: any[] = [];
  let articles: any[] = [];
  let products: any[] = [];

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

  return (
    <>
      <Banner banners={banners} />

      {/* 产品展示 */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">产品展示</h2>
            <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* 文章列表 */}
      {articles.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-gray-900">新闻动态</h2>
              <Link href="/articles" className="text-blue-600 hover:text-blue-700 font-medium">
                查看全部 →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
