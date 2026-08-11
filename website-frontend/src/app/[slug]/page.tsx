import { getPageBySlug } from "@/lib/api";
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
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{page.title}</h1>
      {page.content && (
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
      )}
    </div>
  );
}
