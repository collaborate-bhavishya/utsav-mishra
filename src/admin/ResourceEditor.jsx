import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function emptyForm(fields) {
  const f = {};
  fields.forEach((field) => { f[field.key] = ""; });
  return f;
}

export default function ResourceEditor({ table, title, fields, card, favoriteKey, favoriteLimit }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm(fields));
  const [showForm, setShowForm] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase.from(table).select("*").order("display_order", { ascending: true });
    if (error) setError(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [table]);

  const startAdd = () => {
    setEditingId(null);
    setForm(emptyForm(fields));
    setShowForm(true);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    const f = {};
    fields.forEach((field) => { f[field.key] = row[field.key] ?? ""; });
    setForm(f);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm(fields));
  };

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const uploadImage = async (key, file) => {
    setUploadingKey(key);
    setError("");
    const path = `${table}/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("site-assets").upload(path, file);
    if (uploadError) {
      setError(uploadError.message);
      setUploadingKey(null);
      return;
    }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    setField(key, data.publicUrl);
    setUploadingKey(null);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    if (editingId) {
      const { error } = await supabase.from(table).update(form).eq("id", editingId);
      if (error) { setError(error.message); setSaving(false); return; }
    } else {
      const nextOrder = rows.length ? Math.max(...rows.map((r) => r.display_order ?? 0)) + 1 : 0;
      const { error } = await supabase.from(table).insert({ ...form, display_order: nextOrder });
      if (error) { setError(error.message); setSaving(false); return; }
    }
    setSaving(false);
    cancelForm();
    load();
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this entry? This can't be undone.")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) setError(error.message);
    else load();
  };

  const toggleFavorite = async (row) => {
    setError("");
    const next = !row[favoriteKey];
    const { error } = await supabase
      .from(table)
      .update({ [favoriteKey]: next, favourited_at: next ? new Date().toISOString() : null })
      .eq("id", row.id);
    if (error) setError(error.message);
    else load();
  };

  const move = async (index, direction) => {
    const otherIndex = index + direction;
    if (otherIndex < 0 || otherIndex >= rows.length) return;
    const a = rows[index];
    const b = rows[otherIndex];
    setError("");
    const { error: e1 } = await supabase.from(table).update({ display_order: b.display_order }).eq("id", a.id);
    const { error: e2 } = await supabase.from(table).update({ display_order: a.display_order }).eq("id", b.id);
    if (e1 || e2) setError((e1 || e2).message);
    load();
  };

  const favoriteCount = favoriteKey ? rows.filter((r) => r[favoriteKey]).length : 0;

  return (
    <div>
      <h2 className="serif">
        {title}
        {favoriteKey && (
          <span style={{ fontSize: 14, fontWeight: 500, color: "#6B7B6C", marginLeft: 10 }}>
            ({favoriteCount} favourited{favoriteLimit ? ` — homepage shows the ${favoriteLimit} most recent` : ""})
          </span>
        )}
      </h2>
      {error && <div className="admin-error">{error}</div>}

      {!showForm && (
        <button className="admin-add-btn" onClick={startAdd}>+ Add {title.replace(/s$/, "")}</button>
      )}

      {showForm && (
        <form className="admin-form" onSubmit={onSave}>
          {fields.map((field) => (
            <div className="admin-field" key={field.key}>
              <label htmlFor={field.key}>{field.label}</label>
              {field.type === "textarea" && (
                <textarea
                  id={field.key}
                  value={form[field.key]}
                  onChange={(e) => setField(field.key, e.target.value)}
                  required={field.required !== false}
                />
              )}
              {field.type === "text" && (
                <input
                  id={field.key}
                  type="text"
                  value={form[field.key]}
                  onChange={(e) => setField(field.key, e.target.value)}
                  required={field.required !== false}
                />
              )}
              {field.type === "select" && (
                <select
                  id={field.key}
                  value={form[field.key]}
                  onChange={(e) => setField(field.key, e.target.value)}
                  required={field.required !== false}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 5, border: "1px solid rgba(26,36,32,0.09)", fontSize: 15, fontFamily: "inherit", background: "#F7F3EE", color: "#1A2420" }}
                >
                  <option value="">— Select category —</option>
                  {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              )}
              {field.type === "image" && (
                <>
                  <input
                    id={field.key}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && uploadImage(field.key, e.target.files[0])}
                  />
                  {uploadingKey === field.key && <div className="admin-field-hint">Uploading…</div>}
                  {form[field.key] && (
                    <div className="admin-field-hint">
                      <img src={form[field.key]} alt="" style={{ height: 48, marginTop: 8, borderRadius: 4 }} />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn-primary" disabled={saving || uploadingKey !== null}>
              {saving ? "Saving…" : editingId ? "Save changes" : "Add"}
            </button>
            <button type="button" className="admin-btn-ghost" onClick={cancelForm}>Cancel</button>
          </div>
        </form>
      )}

      {loading && <div className="admin-loading">Loading…</div>}
      {!loading && rows.length === 0 && <div className="admin-empty">Nothing here yet.</div>}

      {!loading && rows.map((row, i) => (
        <div className="admin-card" key={row.id}>
          {card.thumbKey && (
            row[card.thumbKey]
              ? <img className="admin-card-thumb" src={row[card.thumbKey]} alt="" />
              : <div className="admin-card-thumb" />
          )}
          <div className="admin-card-body">
            <div className="admin-card-title">{row[card.titleKey]}</div>
            {card.subKey && <div className="admin-card-sub">{row[card.subKey]}</div>}
            {card.textKey && <div className="admin-card-text">{row[card.textKey]}</div>}
          </div>
          <div className="admin-card-actions">
            {favoriteKey && (
              <button
                onClick={() => toggleFavorite(row)}
                title={row[favoriteKey] ? "Remove from homepage favourites" : "Favourite — show on homepage"}
                style={row[favoriteKey] ? { color: "#B85C30", borderColor: "#B85C30" } : undefined}
              >
                {row[favoriteKey] ? "★ Favourited" : "☆ Favourite"}
              </button>
            )}
            <button onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
            <button onClick={() => move(i, 1)} disabled={i === rows.length - 1}>↓</button>
            <button onClick={() => startEdit(row)}>Edit</button>
            <button className="danger" onClick={() => onDelete(row.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
