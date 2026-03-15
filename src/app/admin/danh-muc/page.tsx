"use client";

import { useEffect, useState, useCallback } from "react";
import { FolderOpen, Plus, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  sortOrder: number;
  isActive: boolean;
  parent: { name: string } | null;
  _count: { products: number };
}

const EMPTY_FORM = { name: "", slug: "", parentId: "" as string | number, sortOrder: 0, isActive: true };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(cat: Category) {
    setForm({ name: cat.name, slug: cat.slug, parentId: cat.parentId ?? "", sortOrder: cat.sortOrder, isActive: cat.isActive });
    setEditingId(cat.id);
    setError("");
    setShowForm(true);
  }

  function closeForm() { setShowForm(false); setEditingId(null); setError(""); }

  async function handleSave() {
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      parentId: form.parentId !== "" ? Number(form.parentId) : null,
      sortOrder: Number(form.sortOrder),
      isActive: form.isActive,
    };

    const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();

    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Lỗi lưu danh mục"); return; }
    closeForm();
    fetchCategories();
  }

  async function handleDelete(cat: Category) {
    if (!confirm(`Xóa danh mục "${cat.name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { alert(data.error ?? "Không thể xóa"); return; }
    fetchCategories();
  }

  // Auto-generate slug from name (only when adding new)
  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: editingId ? f.slug : name
        .toLowerCase()
        .split("")
        .map((c: string) => (VIET_MAP[c] ?? c))
        .join("")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-"),
    }));
  }

  const topLevel = categories.filter((c) => c.parentId === null);

  return (
    <div className="rethink-admin-content">
      <div className="rethink-admin-topbar" style={{ marginBottom: 24 }}>
        <span className="rethink-admin-topbar__title">
          <FolderOpen size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
          Quản lý danh mục
        </span>
        <button className="rethink-admin-btn--add" onClick={openAdd}>
          <Plus size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
          Thêm danh mục
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="rethink-admin-form-card" style={{ marginBottom: 24 }}>
          <div className="rethink-admin-form-card__header">
            <h3>{editingId ? "Sửa danh mục" : "Thêm danh mục mới"}</h3>
            <button className="rethink-admin-form-card__close" onClick={closeForm}><X size={18} /></button>
          </div>
          {error && <div className="rethink-admin-form-card__error">{error}</div>}
          <div className="rethink-admin-form-grid">
            <div className="rethink-admin-form-group">
              <label>Tên danh mục *</label>
              <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Phân bón" />
            </div>
            <div className="rethink-admin-form-group">
              <label>Slug *</label>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="phan-bon" />
            </div>
            <div className="rethink-admin-form-group">
              <label>Danh mục cha</label>
              <select value={form.parentId} onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}>
                <option value="">— Không có —</option>
                {topLevel.filter((c) => c.id !== editingId).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="rethink-admin-form-group">
              <label>Thứ tự</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="rethink-admin-form-group" style={{ marginTop: 12 }}>
            <label className="rethink-admin-checkbox-label">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
              Kích hoạt
            </label>
          </div>
          <div className="rethink-admin-form-card__footer">
            <button className="rethink-admin-btn--cancel" onClick={closeForm}>Hủy</button>
            <button className="rethink-admin-btn--add" onClick={handleSave} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </div>
      )}

      <div className="rethink-admin-table-card">
        <div className="rethink-admin-table-card__header">
          <h3>Tất cả danh mục ({categories.length})</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="rethink-admin-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Slug</th>
                <th>Danh mục cha</th>
                <th>Sản phẩm</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "#9E9E9E" }}>Đang tải...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "#9E9E9E" }}>Chưa có danh mục nào</td></tr>
              ) : categories.map((cat) => (
                <tr key={cat.id}>
                  <td style={{ fontWeight: 600 }}>{cat.name}</td>
                  <td style={{ color: "#757575", fontSize: 13 }}>{cat.slug}</td>
                  <td>{cat.parent?.name ?? <span style={{ color: "#BDBDBD" }}>—</span>}</td>
                  <td>{cat._count.products}</td>
                  <td>{cat.sortOrder}</td>
                  <td>
                    <span className={`rethink-admin-badge ${cat.isActive ? "rethink-admin-badge--confirmed" : "rethink-admin-badge--cancelled"}`}>
                      {cat.isActive ? "Hoạt động" : "Ẩn"}
                    </span>
                  </td>
                  <td>
                    <div className="rethink-admin-action-btns">
                      <button className="rethink-admin-btn--edit" onClick={() => openEdit(cat)}>Sửa</button>
                      <button className="rethink-admin-btn--delete" onClick={() => handleDelete(cat)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const VIET_MAP: Record<string, string> = {
  à: "a", á: "a", ả: "a", ã: "a", ạ: "a",
  ă: "a", ắ: "a", ằ: "a", ẳ: "a", ẵ: "a", ặ: "a",
  â: "a", ấ: "a", ầ: "a", ẩ: "a", ẫ: "a", ậ: "a",
  đ: "d",
  è: "e", é: "e", ẻ: "e", ẽ: "e", ẹ: "e",
  ê: "e", ế: "e", ề: "e", ể: "e", ễ: "e", ệ: "e",
  ì: "i", í: "i", ỉ: "i", ĩ: "i", ị: "i",
  ò: "o", ó: "o", ỏ: "o", õ: "o", ọ: "o",
  ô: "o", ố: "o", ồ: "o", ổ: "o", ỗ: "o", ộ: "o",
  ơ: "o", ớ: "o", ờ: "o", ở: "o", ỡ: "o", ợ: "o",
  ù: "u", ú: "u", ủ: "u", ũ: "u", ụ: "u",
  ư: "u", ứ: "u", ừ: "u", ử: "u", ữ: "u", ự: "u",
  ỳ: "y", ý: "y", ỷ: "y", ỹ: "y", ỵ: "y",
};
