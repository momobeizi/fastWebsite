"use client";
import { useState, useMemo } from "react";
import { resolveImageUrl, type WebsiteProduct, type SkuItem } from "@/lib/api";
import ProductGallery from "@/components/ProductGallery";

export default function ProductDetailClient({ product }: { product: WebsiteProduct }) {
  const skus: SkuItem[] = product.skus || [];
  const [activeSkuId, setActiveSkuId] = useState<string | null>(skus.length > 0 ? skus[0].id : null);

  const activeSku = useMemo(
    () => skus.find(s => s.id === activeSkuId) || null,
    [skus, activeSkuId]
  );

  const images: string[] = product.images ? JSON.parse(product.images) : [];
  const gallery = images.length > 0 ? images : (product.cover ? [product.cover] : []);

  // 当前展示价格：优先 SKU 价格，否则产品价格
  const currentPrice = activeSku ? activeSku.price : (product.price ?? 0);
  // 当前详情：优先 SKU 详情，否则产品详情
  const currentContent = activeSku?.content || product.content || "";

  return (
    <div className="bg-white">
      {/* 面包屑 */}
      <div className="max-w-7xl mx-auto px-4 pt-6 text-sm text-gray-500">
        <a href="/" className="hover:text-blue-600">首页</a>
        <span className="mx-2">/</span>
        <a href="/products" className="hover:text-blue-600">产品</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      {/* 商品主区域 */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 左侧：图片画廊 */}
        <div>
          {gallery.length > 0 ? (
            <ProductGallery images={gallery} />
          ) : (
            <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
              暂无图片
            </div>
          )}
        </div>

        {/* 右侧：商品信息 */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900">
            {product.name}
            {activeSku && <span className="ml-2 text-lg text-gray-400">{activeSku.name}</span>}
          </h1>

          {/* 价格区 */}
          <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
            <div className="text-sm text-gray-500">价格</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-bold text-red-600">¥{currentPrice}</span>
              {currentPrice != null && currentPrice > 0 && (
                <span className="text-sm text-gray-400 line-through">¥{(currentPrice * 1.2).toFixed(2)}</span>
              )}
            </div>
            {activeSku?.stock != null && (
              <div className="mt-2 text-sm text-gray-500">
                库存：<span className={activeSku.stock > 0 ? "text-green-600" : "text-red-500"}>{activeSku.stock > 0 ? activeSku.stock : "缺货"}</span>
              </div>
            )}
          </div>

          {/* SKU 选择 */}
          {skus.length > 0 && (
            <div className="mt-6">
              <div className="text-sm text-gray-500 mb-3">选择规格</div>
              <div className="flex flex-wrap gap-3">
                {skus.filter(s => s.status === 1).map(sku => (
                  <button
                    key={sku.id}
                    onClick={() => setActiveSkuId(sku.id)}
                    className={`px-5 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      activeSkuId === sku.id
                        ? "border-red-600 text-red-600 bg-red-50"
                        : "border-gray-200 text-gray-700 hover:border-red-300"
                    }`}
                  >
                    {sku.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="mt-8 flex gap-4">
            <button className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors">
              立即购买
            </button>
            <button className="px-8 py-3 border-2 border-gray-200 hover:border-red-600 hover:text-red-600 text-gray-700 font-medium rounded-full transition-colors">
              加入购物车
            </button>
          </div>
        </div>
      </div>

      {/* 详情 Tab */}
      {currentContent && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="border-b border-gray-200">
            <span className="inline-block px-6 py-3 text-lg font-semibold text-blue-600 border-b-2 border-blue-600">
              产品详情
            </span>
          </div>
          <div
            className="prose prose-lg max-w-none mt-8 [&_img]:rounded-xl [&_img]:mx-auto"
            dangerouslySetInnerHTML={{ __html: currentContent }}
          />
        </div>
      )}
    </div>
  );
}
