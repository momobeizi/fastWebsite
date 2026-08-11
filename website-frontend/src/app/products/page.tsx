import { getProductList } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export const metadata = { title: "产品展示" };

export default async function ProductsPage() {
  let products: any[] = [];
  try {
    const res = await getProductList("limit=20&sortBy=sort:ASC&filter.status=1");
    products = (res as any)?.list || [];
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">产品展示</h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">暂无产品</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
