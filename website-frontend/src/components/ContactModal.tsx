"use client";
import { useState, useEffect } from "react";
import { getActiveContacts, type WebsiteContact } from "@/lib/api";

export default function ContactModal() {
  const [visible, setVisible] = useState(false);
  const [contacts, setContacts] = useState<WebsiteContact[]>([]);

  useEffect(() => {
    if (!visible) return;
    getActiveContacts().then(setContacts).catch(() => setContacts([]));
  }, [visible]);

  const call = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <>
      <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setVisible(true)}>
        联系工作人员
      </button>

      {visible && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)" }}
          onClick={() => setVisible(false)}
        >
          <div
            style={{ width: 420, maxWidth: "90vw", background: "var(--surface)", border: "1px solid var(--border)", padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 20 }}>联系工作人员</h3>
              <button onClick={() => setVisible(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "var(--muted)" }}>
                ×
              </button>
            </div>

            {contacts.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted)", padding: "32px 0" }}>暂无联系人信息</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {contacts.map(c => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, border: "1px solid var(--border)" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 650, color: "var(--fg)" }}>
                        {c.name}
                        {c.title && <span style={{ marginLeft: 8, fontSize: 13, color: "var(--muted)" }}>{c.title}</span>}
                      </div>
                      {c.wechat && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, fontFamily: "var(--font-mono)" }}>微信：{c.wechat}</div>}
                    </div>
                    <button
                      onClick={() => call(c.phone)}
                      className="btn btn-ghost btn-sm"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      拨打电话
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
