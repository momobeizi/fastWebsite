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
      <button
        onClick={() => setVisible(true)}
        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors"
      >
        联系工作人员
      </button>

      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setVisible(false)}>
          <div
            className="bg-white rounded-2xl w-[420px] max-w-[90vw] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">联系工作人员</h3>
              <button onClick={() => setVisible(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
                ×
              </button>
            </div>

            {contacts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">暂无联系人信息</p>
            ) : (
              <div className="space-y-3">
                {contacts.map(c => (
                  <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {c.name}
                        {c.title && <span className="ml-2 text-sm text-gray-500">{c.title}</span>}
                      </div>
                      {c.wechat && <div className="text-sm text-gray-500 mt-1">微信：{c.wechat}</div>}
                    </div>
                    <button
                      onClick={() => call(c.phone)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full transition-colors whitespace-nowrap"
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
