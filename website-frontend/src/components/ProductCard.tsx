import Link from "next/link";
import type { WebsiteProduct } from "@/lib/api";
import { resolveImageUrl } from "@/lib/api";

export default function ProductCard({ product }: { product: WebsiteProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      {product.cover && (
        <div className="product-cover">
          <img src={resolveImageUrl(product.cover)} alt={product.name} />
        </div>
      )}
      <div className="product-body">
        <h3>{product.name}</h3>
        {product.summary && <p className="product-summary">{product.summary}</p>}
      </div>
    </Link>
  );
}
