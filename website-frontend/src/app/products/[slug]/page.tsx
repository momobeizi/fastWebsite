import { getProductBySlug, resolveImageUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          {product.cover && (
            <img src={resolveImageUrl(product.cover)} alt={product.name} className="w-full rounded-xl" />
          )}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {images.map((img, i) => (
                <img key={i} src={resolveImageUrl(img)} alt="" className="w-full rounded-lg" />
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          {product.summary && <p className="text-gray-500 mb-4">{product.summary}</p>}
          {product.price != null && (
            <p className="text-2xl font-bold text-blue-600 mb-6">¥{product.price}</p>
          )}
          {product.content && (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.content }} />
          )}
        </div>
      </div>
    </div>
  );
}
