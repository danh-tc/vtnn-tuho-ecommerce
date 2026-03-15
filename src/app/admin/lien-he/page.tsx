import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import { Mail, Phone, MessageSquare, CheckCheck, RotateCcw } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tin nhắn liên hệ" };

const SUBJECT_LABELS: Record<string, string> = {
  product: "Tư vấn sản phẩm",
  order: "Hỏi về đơn hàng",
  delivery: "Vận chuyển & giao hàng",
  return: "Đổi trả hàng",
  other: "Khác",
};

async function toggleRead(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const current = formData.get("isRead") === "true";
  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: !current },
  });
  revalidatePath("/admin/lien-he");
}

export default async function AdminContactPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="rethink-admin-content">
      <div className="rethink-admin-topbar" style={{ marginBottom: 24 }}>
        <span className="rethink-admin-topbar__title">
          <MessageSquare size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
          Tin nhắn liên hệ
        </span>
        {unreadCount > 0 && (
          <span style={{
            marginLeft: 12, fontSize: 12, fontWeight: 700,
            background: "#E65100", color: "#fff",
            padding: "2px 10px", borderRadius: 50,
          }}>
            {unreadCount} chưa xử lý
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#9e9e9e" }}>
          <MessageSquare size={48} style={{ margin: "0 auto 12px" }} />
          <p>Chưa có tin nhắn nào.</p>
        </div>
      ) : (
        <div className="rethink-admin-table-card">
          <div className="rethink-admin-table-card__header">
            <h3>Tất cả tin nhắn ({messages.length})</h3>
          </div>
          <div className="rethink-admin-table-wrap">
            <table className="rethink-admin-table">
              <thead>
                <tr>
                  <th>Người gửi</th>
                  <th>Chủ đề</th>
                  <th>Nội dung</th>
                  <th>Ngày gửi</th>
                  <th style={{ textAlign: "center" }}>Trạng thái</th>
                  <th style={{ textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id} style={!msg.isRead ? { background: "#fff8e1" } : undefined}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{msg.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#616161", marginTop: 2 }}>
                        <Phone size={12} />
                        <a href={`tel:${msg.phone}`} style={{ color: "#1565C0" }}>{msg.phone}</a>
                      </div>
                      {msg.email && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#616161" }}>
                          <Mail size={12} />
                          <a href={`mailto:${msg.email}`} style={{ color: "#1565C0" }}>{msg.email}</a>
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {msg.subject ? (SUBJECT_LABELS[msg.subject] ?? msg.subject) : "-"}
                    </td>
                    <td style={{ maxWidth: 300, fontSize: 13, color: "#424242", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                      {msg.message}
                    </td>
                    <td style={{ fontSize: 13, color: "#757575", whiteSpace: "nowrap" }}>
                      {new Date(msg.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: 50,
                        fontSize: 12,
                        fontWeight: 600,
                        background: msg.isRead ? "rgba(76,175,80,0.12)" : "rgba(255,152,0,0.15)",
                        color: msg.isRead ? "#2E7D32" : "#E65100",
                      }}>
                        {msg.isRead ? "Đã xử lý" : "Chưa xử lý"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <form action={toggleRead}>
                        <input type="hidden" name="id" value={msg.id} />
                        <input type="hidden" name="isRead" value={String(msg.isRead)} />
                        <button
                          type="submit"
                          title={msg.isRead ? "Đánh dấu chưa xử lý" : "Đánh dấu đã xử lý"}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "5px 12px", borderRadius: 6,
                            fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                            background: msg.isRead ? "rgba(158,158,158,0.15)" : "rgba(46,125,50,0.12)",
                            color: msg.isRead ? "#616161" : "#2E7D32",
                            transition: "background 0.15s",
                          }}
                        >
                          {msg.isRead
                            ? <><RotateCcw size={13} /> Mở lại</>
                            : <><CheckCheck size={13} /> Đã xử lý</>
                          }
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
