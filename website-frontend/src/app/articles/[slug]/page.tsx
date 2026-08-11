import { getArticleBySlug } from "@/lib/api";
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

  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <span>{article.publishTime?.slice(0, 10) || article.createTime?.slice(0, 10)}</span>
        <span>{article.viewCount} 阅读</span>
        {article.tags && (
          <div className="flex gap-2">
            {article.tags.split(",").map(t => (
              <span key={t} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{t.trim()}</span>
            ))}
          </div>
        )}
      </div>
      {article.cover && (
        <img src={article.cover} alt={article.title} className="w-full rounded-xl mb-8" />
      )}
      {article.content && (
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
      )}
    </article>
  );
}
