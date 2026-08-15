import Link from "next/link";
import type { WebsiteArticle } from "@/lib/api";
import { resolveImageUrl } from "@/lib/api";

export default function ArticleCard({ article, index }: { article: WebsiteArticle; index?: number }) {
  return (
    <Link href={`/articles/${article.slug}`} className="article-card">
      <span className="article-number">{String(index ?? 0).padStart(2, "0")}</span>
      <div>
        <h3>{article.title}</h3>
        {article.summary && <p>{article.summary}</p>}
        <div className="article-meta">
          <span>{article.publishTime?.slice(0, 10) || article.createTime?.slice(0, 10)}</span>
          <span>{article.viewCount} 阅读</span>
          {article.tags && article.tags.split(",").filter(Boolean).map(t => (
            <span key={t}>{t.trim()}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
