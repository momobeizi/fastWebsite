import { getProductBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetailClient from "@/components/ProductDetailClient";

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

  return <ProductDetailClient product={product} />;
}
