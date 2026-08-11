import { getArticleList } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";

export const metadata = { title: "新闻动态" };

export default async function ArticlesPage() {
  let articles: any[] = [];
  try {
    const res = await getArticleList("limit=20&sortBy=createTime:DESC&filter.status=1");
    articles = (res as any)?.list || [];
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">新闻动态</h1>
      {articles.length === 0 ? (
        <p className="text-center text-gray-500">暂无文章</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(a => <ArticleCard key={a.id} article={a} />)}
        </div>
      )}
    </div>
  );
}
