import { getProductBySlug, resolveImageUrl, unescapeHtml } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductGallery from "@/components/ProductGallery";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    return { title: product.name, description: product.summary };
  } catch { return { title: "产品" }; }
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product;
  try { product = await getProductBySlug(slug); } catch { notFound(); }
  if (!product) notFound();

  const images: string[] = product.images ? JSON.parse(product.images) : [];
  const gallery = images.length > 0 ? images : (product.cover ? [product.cover] : []);

  return (
    <div>
      {/* 面包屑 */}
      <div className="container" style={{ paddingTop: 24 }}>
        <nav className="breadcrumb">
          <a href="/">首页</a>
          <span>/</span>
          <a href="/products">产品</a>
          <span>/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      {/* 产品主区域 */}
      <div className="container product-detail-grid" style={{ padding: "40px 0 72px" }}>
        {/* 左侧：图片画廊 */}
        <div>
          {gallery.length > 0 ? (
            <ProductGallery images={gallery} />
          ) : (
            <div style={{ aspectRatio: "1 / 1", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", background: "var(--ink-softer)" }}>
              暂无图片
            </div>
          )}
        </div>

        {/* 右侧：产品信息 */}
        <div>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", margin: "0 0 20px" }}>{product.name}</h1>
          {product.summary && (
            <p style={{ color: "var(--muted)", fontSize: 18, lineHeight: 1.8, maxWidth: "60ch" }}>{product.summary}</p>
          )}
        </div>
      </div>

      {/* 产品详情 */}
      {product.content && (
        <div className="section" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="container">
            <div className="section-head">
              <div>
                <p className="section-kicker eyebrow">DETAILS</p>
                <h2>产品详情</h2>
              </div>
            </div>
            <div
              className="prose"
              style={{ maxWidth: "none" }}
              dangerouslySetInnerHTML={{ __html: unescapeHtml(product.content) }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
