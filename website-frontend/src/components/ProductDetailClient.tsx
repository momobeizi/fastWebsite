"use client";
import { useState, useMemo } from "react";
import { resolveImageUrl, unescapeHtml, type WebsiteProduct, type SkuItem } from "@/lib/api";
import ProductGallery from "@/components/ProductGallery";
import ContactModal from "@/components/ContactModal";

export default function ProductDetailClient({ product }: { product: WebsiteProduct }) {
  const skus: SkuItem[] = product.skus || [];
  const [activeSkuId, setActiveSkuId] = useState<string | null>(skus.length > 0 ? skus[0].id : null);

  const activeSku = useMemo(
    () => skus.find(s => s.id === activeSkuId) || null,
    [skus, activeSkuId]
  );

  const images: string[] = product.images ? JSON.parse(product.images) : [];
  const gallery = images.length > 0 ? images : (product.cover ? [product.cover] : []);

  const currentPrice = activeSku ? activeSku.price : (product.price ?? 0);
  const currentContent = activeSku?.content || product.content || "";

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
          <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", margin: "0 0 16px" }}>
            {product.name}
            {activeSku && <span style={{ marginLeft: 12, fontSize: "0.5em", color: "var(--muted)" }}>{activeSku.name}</span>}
          </h1>

          {/* 价格 */}
          <div style={{ border: "1px solid var(--border)", background: "var(--surface)", padding: "20px 24px", marginBottom: 24 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>PRICE</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 40, fontWeight: 700, color: "var(--accent-strong)", fontFamily: "var(--font-mono)" }}>¥{currentPrice}</span>
            </div>
            {activeSku?.stock != null && (
              <div style={{ marginTop: 8, fontSize: 14, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                库存：<span style={{ color: activeSku.stock > 0 ? "var(--fg)" : "var(--accent)" }}>{activeSku.stock > 0 ? activeSku.stock : "缺货"}</span>
              </div>
            )}
          </div>

          {/* SKU 选择 */}
          {skus.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>选择规格</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {skus.filter(s => s.status === 1).map(sku => (
                  <button
                    key={sku.id}
                    onClick={() => setActiveSkuId(sku.id)}
                    className={`sku-btn ${activeSkuId === sku.id ? "is-active" : ""}`}
                  >
                    {sku.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 联系工作人员 */}
          <div style={{ maxWidth: 320 }}>
            <ContactModal />
          </div>
        </div>
      </div>

      {/* 产品详情 */}
      {currentContent && (
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
              dangerouslySetInnerHTML={{ __html: unescapeHtml(currentContent) }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
