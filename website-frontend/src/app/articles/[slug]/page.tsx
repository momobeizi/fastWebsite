import { getArticleBySlug, resolveImageUrl, unescapeHtml } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticleBySlug(slug);
    return {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.summary,
      keywords: article.seoKeywords,
    };
  } catch { return { title: "文章" }; }
}

export default async function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let article;
  try { article = await getArticleBySlug(slug); } catch { notFound(); }
  if (!article) notFound();

  const date = article.publishTime?.slice(0, 10) || article.createTime?.slice(0, 10);
  const tags = article.tags ? article.tags.split(",").filter(Boolean) : [];

  return (
    <div className="container article-layout">
      <article>
        <header className="article-header">
          <p className="eyebrow">ARTICLE · {date}</p>
          <h1 className="article-title">{article.title}</h1>
          {article.summary && <p className="article-abstract">{article.summary}</p>}
          <div className="article-meta">
            <span>{date}</span>
            <span>{article.viewCount} 阅读</span>
            {tags.map(t => <span key={t}>{t.trim()}</span>)}
          </div>
        </header>

        {article.cover && (
          <img
            src={resolveImageUrl(article.cover)}
            alt={article.title}
            style={{ width: "100%", margin: "28px 0 0", border: "1px solid var(--border)" }}
          />
        )}

        {article.content && (
          <div
            className="prose"
            style={{ marginTop: 32 }}
            dangerouslySetInnerHTML={{ __html: unescapeHtml(article.content) }}
          />
        )}
      </article>

      <aside className="aside-stack">
        <div className="side-panel">
          <h3>关于本站</h3>
          <p>这里记录我们的最新动态与行业洞察，欢迎订阅关注。</p>
        </div>
      </aside>
    </div>
  );
}
