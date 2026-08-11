"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { WebsiteBanner } from "@/lib/api";

export default function Banner({ banners }: { banners: WebsiteBanner[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <section className="relative w-full h-[500px] overflow-hidden bg-gray-900">
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            {b.title && <h2 className="text-4xl md:text-5xl font-bold mb-4">{b.title}</h2>}
            {b.subtitle && <p className="text-lg md:text-xl mb-6 opacity-90">{b.subtitle}</p>}
            {b.link && (
              <Link href={b.link} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-medium transition-colors">
                了解更多
              </Link>
            )}
          </div>
        </div>
      ))}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
