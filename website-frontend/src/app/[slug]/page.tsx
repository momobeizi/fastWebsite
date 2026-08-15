import { getPageBySlug, unescapeHtml } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await getPageBySlug(slug);
    return {
      title: page.seoTitle || page.title,
      description: page.seoDescription,
      keywords: page.seoKeywords,
    };
  } catch { return { title: "页面" }; }
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let page;
  try { page = await getPageBySlug(slug); } catch { notFound(); }
  if (!page) notFound();

  return (
    <div className="container" style={{ padding: "56px 0 88px" }}>
      <div className="page-hero" style={{ borderBottom: "1px solid var(--border)" }}>
        <h1>{page.title}</h1>
      </div>
      {page.content && (
        <div
          className="prose"
          style={{ marginTop: 40, maxWidth: "none" }}
          dangerouslySetInnerHTML={{ __html: unescapeHtml(page.content) }}
        />
      )}
    </div>
  );
}
