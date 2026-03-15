"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload } from "lucide-react";
import { slugify } from "@/lib/utils";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { ssr: false, loading: () => <div style={{ height: 280, border: "1px solid #E0E0E0", borderRadius: 4, background: "#FAFAFA" }} /> });

interface Category { id: number; name: string }
interface Brand { id: number; name: string }

interface Variant {
  id?: number;
  name: string;
  sku: string;
  price: string;
  salePrice: string;
  stock: string;
  weightG: string;
  isDefault: boolean;
  sortOrder: number;
}

interface ImageRow {
  id?: number;
  clientId?: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductFormProps {
  productId?: number;
  initialData?: {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    categoryId: number;
    brandId: number | null;
    isPublished: boolean;
    isFeatured: boolean;
    tags: string[];
    variants: Variant[];
    images: ImageRow[];
  };
  categories: Category[];
  brands: Brand[];
}

const EMPTY_VARIANT: Variant = { name: "", sku: "", price: "", salePrice: "", stock: "0", weightG: "", isDefault: false, sortOrder: 0 };
const EMPTY_IMAGE: ImageRow = { clientId: "", url: "", altText: "", isPrimary: false, sortOrder: 0 };

export default function ProductForm({ productId, initialData, categories, brands }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [shortDesc, setShortDesc] = useState(initialData?.shortDescription ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [categoryId, setCategoryId] = useState<string>(initialData?.categoryId?.toString() ?? "");
  const [brandId, setBrandId] = useState<string>(initialData?.brandId?.toString() ?? "");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [tags, setTags] = useState(initialData?.tags.join(", ") ?? "");
  const [variants, setVariants] = useState<Variant[]>(initialData?.variants ?? [{ ...EMPTY_VARIANT, isDefault: true }]);
  const [images, setImages] = useState<ImageRow[]>(
    (initialData?.images ?? []).map((img) => ({ ...img, clientId: crypto.randomUUID() }))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingSet, setUploadingSet] = useState<Set<number>>(new Set());

  // Auto-slug only when creating
  useEffect(() => {
    if (!isEdit && name) setSlug(slugify(name));
  }, [name, isEdit]);

  // Variant helpers
  function addVariant() { setVariants((v) => [...v, { ...EMPTY_VARIANT, sortOrder: v.length }]); }
  function removeVariant(i: number) { setVariants((v) => v.filter((_, idx) => idx !== i)); }
  function updateVariant(i: number, field: keyof Variant, value: string | boolean | number) {
    setVariants((v) => v.map((row, idx) => idx === i ? { ...row, [field]: value } : row));
  }
  function setDefault(i: number) {
    setVariants((v) => v.map((row, idx) => ({ ...row, isDefault: idx === i })));
  }

  // Image helpers
  function addImage() { setImages((imgs) => [...imgs, { ...EMPTY_IMAGE, clientId: crypto.randomUUID(), sortOrder: imgs.length }]); }
  function removeImage(i: number) { setImages((imgs) => imgs.filter((_, idx) => idx !== i)); }
  function updateImage(i: number, field: keyof ImageRow, value: string | boolean | number) {
    setImages((imgs) => imgs.map((row, idx) => idx === i ? { ...row, [field]: value } : row));
  }
  function setPrimaryImage(i: number) {
    setImages((imgs) => imgs.map((row, idx) => ({ ...row, isPrimary: idx === i })));
  }

  async function handleFileUpload(i: number, file: File) {
    setUploadingSet((s) => new Set(s).add(i));
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (res.ok) {
      updateImage(i, "url", data.url);
    } else {
      setError(data.error ?? "Upload ảnh thất bại");
    }
    setUploadingSet((s) => { const next = new Set(s); next.delete(i); return next; });
  }

  async function handleSubmit() {
    setSaving(true);
    setError("");

    const payload = {
      name,
      slug: slug || undefined,
      shortDescription: shortDesc || undefined,
      description: description || undefined,
      categoryId: Number(categoryId),
      brandId: brandId ? Number(brandId) : null,
      isPublished,
      isFeatured,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      variants: variants.map((v) => ({
        ...(v.id ? { id: v.id } : {}),
        name: v.name,
        sku: v.sku,
        price: Number(v.price),
        salePrice: v.salePrice ? Number(v.salePrice) : null,
        stock: Number(v.stock),
        weightG: v.weightG ? Number(v.weightG) : null,
        isDefault: v.isDefault,
        sortOrder: v.sortOrder,
      })),
      images: images.map((img) => ({
        ...(img.id ? { id: img.id } : {}),
        url: img.url,
        altText: img.altText || undefined,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      })),
    };

    const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setError(data.error ?? "Lỗi lưu sản phẩm"); return; }
    router.push("/admin/san-pham");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Xóa sản phẩm này? Hành động không thể hoàn tác.")) return;
    await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    router.push("/admin/san-pham");
    router.refresh();
  }

  return (
    <div className="rethink-admin-content">
      <div className="rethink-admin-topbar" style={{ marginBottom: 24 }}>
        <span className="rethink-admin-topbar__title">{isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</span>
        <div style={{ display: "flex", gap: 12 }}>
          {isEdit && (
            <button className="rethink-admin-btn--delete" onClick={handleDelete}>Xóa sản phẩm</button>
          )}
          <button className="rethink-admin-btn--cancel" onClick={() => router.push("/admin/san-pham")}>Hủy</button>
          <button className="rethink-admin-btn--add" onClick={handleSubmit} disabled={saving || uploadingSet.size > 0}>
            {(() => {
              if (uploadingSet.size > 0) return "Đang upload ảnh...";
              if (saving) return "Đang lưu...";
              return "Lưu sản phẩm";
            })()}
          </button>
        </div>
      </div>

      {error && <div className="rethink-admin-form-card__error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="rethink-admin-product-layout">
        {/* Left column: main info */}
        <div className="rethink-admin-product-main">
          {/* Basic info */}
          <div className="rethink-admin-form-card">
            <div className="rethink-admin-form-card__header"><h3>Thông tin cơ bản</h3></div>
            <div className="rethink-admin-form-card__body">
              <div className="rethink-admin-form-group">
                <label>Tên sản phẩm *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Phân NPK 20-20-15" />
              </div>
              <div className="rethink-admin-form-group">
                <label>Slug *</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="phan-npk-20-20-15" />
              </div>
              <div className="rethink-admin-form-group">
                <label>Mô tả ngắn</label>
                <textarea rows={2} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} placeholder="Mô tả ngắn hiển thị trên card sản phẩm" />
              </div>
              <div className="rethink-admin-form-group">
                <label>Mô tả chi tiết</label>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Nội dung mô tả đầy đủ..."
                />
              </div>
              <div className="rethink-admin-form-group">
                <label>Tags (cách nhau bằng dấu phẩy)</label>
                <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="phân bón, npk, cây trồng" />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="rethink-admin-form-card">
            <div className="rethink-admin-form-card__header">
              <h3>Biến thể sản phẩm</h3>
              <button className="rethink-admin-btn--edit" onClick={addVariant}>
                <Plus size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 2 }} />
                Thêm biến thể
              </button>
            </div>
            <div className="rethink-admin-form-card__body" style={{ overflowX: "auto" }}>
              <table className="rethink-admin-table">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>SKU</th>
                    <th>Giá (đ)</th>
                    <th>Giá KM (đ)</th>
                    <th>Tồn kho</th>
                    <th>Mặc định</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, i) => (
                    <tr key={i}>
                      <td><input className="rethink-admin-table-input" value={v.name} onChange={(e) => updateVariant(i, "name", e.target.value)} placeholder="1kg" /></td>
                      <td><input className="rethink-admin-table-input" value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} placeholder="NPK-1KG" /></td>
                      <td><input className="rethink-admin-table-input" type="number" value={v.price} onChange={(e) => updateVariant(i, "price", e.target.value)} placeholder="35000" /></td>
                      <td><input className="rethink-admin-table-input" type="number" value={v.salePrice} onChange={(e) => updateVariant(i, "salePrice", e.target.value)} placeholder="-" /></td>
                      <td><input className="rethink-admin-table-input" type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} /></td>
                      <td style={{ textAlign: "center" }}>
                        <input type="radio" name="default-variant" checked={v.isDefault} onChange={() => setDefault(i)} />
                      </td>
                      <td>
                        {variants.length > 1 && (
                          <button className="rethink-admin-btn--delete" onClick={() => removeVariant(i)} style={{ padding: "2px 6px" }}>
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Images */}
          <div className="rethink-admin-form-card">
            <div className="rethink-admin-form-card__header">
              <h3>Hình ảnh</h3>
              <button className="rethink-admin-btn--edit" onClick={addImage}>
                <Plus size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 2 }} />
                Thêm ảnh
              </button>
            </div>
            <div className="rethink-admin-form-card__body">
              {images.length === 0 && <p style={{ color: "#9E9E9E", fontSize: 14 }}>Chưa có ảnh. Nhấn "Thêm ảnh" để bắt đầu.</p>}
              {images.map((img, i) => {
                const isUploading = uploadingSet.has(i);
                let preview: React.ReactNode;
                if (isUploading) {
                  preview = <div style={{ width: 56, height: 56, background: "#F5F5F5", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#9E9E9E" }}>...</div>;
                } else if (img.url) {
                  // eslint-disable-next-line @next/next/no-img-element
                  preview = <img src={img.url} alt={img.altText} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 4 }} />;
                } else {
                  preview = <div style={{ width: 56, height: 56, background: "#F5F5F5", borderRadius: 4 }} />;
                }
                return (
                  <div key={img.clientId} className="rethink-admin-image-row">
                    <div className="rethink-admin-image-row__preview">
                      {preview}
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <input
                          className="rethink-admin-table-input"
                          style={{ flex: 1 }}
                          value={img.url}
                          onChange={(e) => updateImage(i, "url", e.target.value)}
                          placeholder="https://... hoặc upload file"
                          disabled={isUploading}
                        />
                        <label
                          htmlFor={`file-upload-${i}`}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4, padding: "0 10px",
                            background: isUploading ? "#E0E0E0" : "#F5F5F5", border: "1px solid #E0E0E0",
                            borderRadius: 4, fontSize: 12, cursor: isUploading ? "not-allowed" : "pointer",
                            color: "#616161", whiteSpace: "nowrap", height: "100%",
                          }}
                        >
                          <Upload size={13} />
                          {isUploading ? "Đang tải..." : "Upload"}
                        </label>
                        <input
                          id={`file-upload-${i}`}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(i, file);
                            e.target.value = "";
                          }}
                        />
                      </div>
                      <input
                        className="rethink-admin-table-input"
                        value={img.altText}
                        onChange={(e) => updateImage(i, "altText", e.target.value)}
                        placeholder="Mô tả ảnh (alt text)"
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <label style={{ fontSize: 12, color: "#616161" }}>
                        <input type="radio" name="primary-image" checked={img.isPrimary} onChange={() => setPrimaryImage(i)} />
                        {" "}Ảnh chính
                      </label>
                      <button className="rethink-admin-btn--delete" onClick={() => removeImage(i)} style={{ padding: "2px 6px" }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: meta */}
        <div className="rethink-admin-product-sidebar">
          <div className="rethink-admin-form-card">
            <div className="rethink-admin-form-card__header"><h3>Phân loại</h3></div>
            <div className="rethink-admin-form-card__body">
              <div className="rethink-admin-form-group">
                <label>Danh mục *</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">- Chọn danh mục -</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="rethink-admin-form-group">
                <label>Thương hiệu</label>
                <select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                  <option value="">- Không có -</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="rethink-admin-form-card">
            <div className="rethink-admin-form-card__header"><h3>Trạng thái</h3></div>
            <div className="rethink-admin-form-card__body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label className="rethink-admin-checkbox-label">
                <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                Hiển thị (đang bán)
              </label>
              <label className="rethink-admin-checkbox-label">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                Sản phẩm nổi bật
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
