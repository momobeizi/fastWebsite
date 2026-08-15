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
    <div>
      <div className="page-hero">
        <div className="container">
          <p className="eyebrow">NEWS</p>
          <h1>文章</h1>
          <p className="lead">这里记录我们的最新动态与行业洞察。</p>
        </div>
      </div>
      <div className="container" style={{ padding: "56px 0 88px" }}>
        {articles.length === 0 ? (
          <p className="muted" style={{ textAlign: "center" }}>暂无文章</p>
        ) : (
          <div className="article-grid">
            {articles.map((a, i) => <ArticleCard key={a.id} article={a} index={i + 1} />)}
          </div>
        )}
      </div>
    </div>
  );
}
