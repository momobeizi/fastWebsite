"use client";
import { useState } from "react";
import { resolveImageUrl } from "@/lib/api";

export default function ProductGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* 主图 */}
      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100">
        <img
          src={resolveImageUrl(images[active])}
          alt="产品图"
          className="w-full h-full object-cover"
        />
      </div>
      {/* 缩略图 */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3 mt-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                i === active ? "border-blue-600" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={resolveImageUrl(img)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
