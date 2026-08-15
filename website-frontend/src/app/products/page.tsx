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
    <div>
      <div className="page-hero">
        <div className="container">
          <p className="eyebrow">PRODUCTS</p>
          <h1>产品展示</h1>
          <p className="lead">精选优质产品，满足您的多样化需求。</p>
        </div>
      </div>
      <div className="container" style={{ padding: "56px 0 88px" }}>
        {products.length === 0 ? (
          <p className="muted" style={{ textAlign: "center" }}>暂无产品</p>
        ) : (
          <div className="product-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
