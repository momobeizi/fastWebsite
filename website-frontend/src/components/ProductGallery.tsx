"use client";
import { useState } from "react";
import { resolveImageUrl } from "@/lib/api";

export default function ProductGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* 主图 */}
      <div style={{ aspectRatio: "1 / 1", overflow: "hidden", border: "1px solid var(--border)", background: "var(--ink-softer)" }}>
        <img
          src={resolveImageUrl(images[active])}
          alt="产品图"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      {/* 缩略图 */}
      {images.length > 1 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginTop: 12 }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                aspectRatio: "1 / 1",
                overflow: "hidden",
                border: i === active ? "2px solid var(--accent)" : "1px solid var(--border)",
                opacity: i === active ? 1 : 0.6,
                cursor: "pointer",
                padding: 0,
                background: "transparent",
                transition: "opacity 160ms ease, border-color 160ms ease",
              }}
            >
              <img src={resolveImageUrl(img)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
