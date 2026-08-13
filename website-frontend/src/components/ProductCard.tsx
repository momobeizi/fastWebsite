import Link from "next/link";
import type { WebsiteProduct } from "@/lib/api";
import { resolveImageUrl } from "@/lib/api";

export default function ProductCard({ product }: { product: WebsiteProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-gray-100 bg-white hover:shadow-lg transition-shadow">
        {product.cover && (
          <img src={resolveImageUrl(product.cover)} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
        )}
        <div className="p-5 text-center">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          {product.summary && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.summary}</p>
          )}
          {product.price != null && (
            <p className="mt-2 text-lg font-bold text-blue-600">¥{product.price}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
