import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function exportCSV(rows) {
  const headers = ["Name", "Email", "Phone", "Message", "Status", "Date"];
  const lines = [
    headers.join(","),
    ...rows.map(r => [
      `"${(r.name || "").replace(/"/g, '""')}"`,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      `"${(r.phone || "").replace(/"/g, '""')}"`,
      `"${(r.message || "").replace(/"/g, '""')}"`,
      `"${r.status || ""}"`,
      `"${formatDate(r.created_at)}"`,
    ].join(","))
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LeadsInbox() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    setError("");
    const { error } = await supabase.from("leads").update({ status: "read" }).eq("id", id);
    if (error) setError(error.message);
    else load();
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this lead? This can't be undone.")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) setError(error.message);
    else load();
  };

  const unreadCount = rows.filter((r) => r.status === "new").length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <h2 className="serif">
          Leads{unreadCount > 0 ? ` (${unreadCount} new)` : ""}
        </h2>
        {rows.length > 0 && (
          <button className="admin-btn-primary" onClick={() => exportCSV(rows)} style={{ fontSize: 13 }}>
            ↓ Export CSV
          </button>
        )}
      </div>
      {error && <div className="admin-error">{error}</div>}

      {loading && <div className="admin-loading">Loading…</div>}
      {!loading && rows.length === 0 && <div className="admin-empty">No submissions yet.</div>}

      {!loading && rows.map((row) => (
        <div className="admin-card" key={row.id} style={{ opacity: row.status === "read" ? 0.65 : 1 }}>
          <div className="admin-card-body">
            <div className="admin-card-title">
              {row.name}{row.status === "new" && <span style={{ color: "#B85C30" }}> · new</span>}
            </div>
            <div className="admin-card-sub">
              {row.email}{row.phone ? ` · ${row.phone}` : ""} · {formatDate(row.created_at)}
            </div>
            {row.message && <div className="admin-card-text">{row.message}</div>}
          </div>
          <div className="admin-card-actions">
            {row.status === "new" && (
              <button onClick={() => markRead(row.id)}>Mark read</button>
            )}
            <button className="danger" onClick={() => onDelete(row.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
