"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { WebsiteBanner } from "@/lib/api";
import { resolveImageUrl } from "@/lib/api";

export default function Banner({ banners }: { banners: WebsiteBanner[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  const b = banners[current];

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", overflow: "hidden", background: "var(--fg)" }}>
      <img
        src={resolveImageUrl(b.image)}
        alt={b.title}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
      {(b.title || b.subtitle) && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 20, color: "#fff" }}>
          {b.title && <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>{b.title}</div>}
          {b.subtitle && <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{b.subtitle}</div>}
        </div>
      )}
      {banners.length > 1 && (
        <div style={{ position: "absolute", bottom: 16, right: 16, display: "flex", gap: 6 }}>
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`第 ${i + 1} 张`}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: i === current ? "#fff" : "rgba(255,255,255,0.5)",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
