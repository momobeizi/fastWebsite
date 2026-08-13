import Link from "next/link";
import type { WebsiteArticle } from "@/lib/api";
import { resolveImageUrl } from "@/lib/api";

export default function ArticleCard({ article }: { article: WebsiteArticle }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-gray-100 bg-white hover:shadow-lg transition-shadow">
        {article.cover && (
          <img src={resolveImageUrl(article.cover)} alt={article.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
        )}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.summary && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-3">{article.summary}</p>
          )}
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
            <span>{article.publishTime?.slice(0, 10) || article.createTime?.slice(0, 10)}</span>
            <span>{article.viewCount} 阅读</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
