import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const RANGES = [
  { key: "7", label: "Last 7 days", days: 7 },
  { key: "30", label: "Last 30 days", days: 30 },
  { key: "all", label: "All time", days: null },
];

const SCROLL_STEPS = ["25", "50", "75", "100"];
// Validated ordinal ramp (one hue, monotone lightness) — see dataviz skill.
const SCROLL_COLORS = { "25": "#DCA97F", "50": "#C57C46", "75": "#A85426", "100": "#8B4319" };

const CTA_LABELS = {
  nav_start_conversation: "Nav — Start a conversation",
  nav_mobile_start_conversation: "Nav (mobile) — Start a conversation",
  hero_start_conversation: "Hero — Start a conversation",
  hero_see_how_i_work: "Hero — See how I work",
  reflection_open: "Reflection card opened",
  reflections_read_all: "Read all reflections",
  reflections_receive_by_email: "Receive Reflections by email (CTA)",
  newsletter_subscribe: "Newsletter — subscribed",
  contact_form_submit: "Contact form — submitted",
  social_linkedin: "Social — LinkedIn",
  social_instagram: "Social — Instagram",
};

function StatTile({ label, value }) {
  return (
    <div className="an-stat">
      <div className="an-stat-value">{value}</div>
      <div className="an-stat-label">{label}</div>
    </div>
  );
}

function BarRow({ label, count, max, color }) {
  const pct = max > 0 ? Math.max((count / max) * 100, count > 0 ? 3 : 0) : 0;
  return (
    <div className="an-bar-row">
      <div className="an-bar-label">{label}</div>
      <div className="an-bar-track">
        <div className="an-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="an-bar-count">{count}</div>
    </div>
  );
}

export default function AnalyticsPanel() {
  const [range, setRange] = useState("30");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      let query = supabase.from("analytics_events").select("event_type, label, session_id, created_at");
      const rangeDef = RANGES.find((r) => r.key === range);
      if (rangeDef?.days) {
        const since = new Date(Date.now() - rangeDef.days * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte("created_at", since);
      }
      const { data, error } = await query;
      if (cancelled) return;
      if (error) setError(error.message);
      else setRows(data ?? []);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [range]);

  const stats = useMemo(() => {
    const pageViews = rows.filter((r) => r.event_type === "page_view");
    const ctaClicks = rows.filter((r) => r.event_type === "cta_click");
    const scrolls = rows.filter((r) => r.event_type === "scroll_depth");

    const uniqueSessions = new Set(rows.map((r) => r.session_id)).size;

    const ctaCounts = {};
    for (const r of ctaClicks) {
      ctaCounts[r.label] = (ctaCounts[r.label] || 0) + 1;
    }
    const ctaBars = Object.entries(ctaCounts)
      .map(([label, count]) => ({ label: CTA_LABELS[label] || label, count }))
      .sort((a, b) => b.count - a.count);
    const maxCta = ctaBars.length ? ctaBars[0].count : 0;

    const scrollSessionsByStep = {};
    for (const step of SCROLL_STEPS) scrollSessionsByStep[step] = new Set();
    for (const r of scrolls) {
      if (scrollSessionsByStep[r.label]) scrollSessionsByStep[r.label].add(r.session_id);
    }
    const pageViewSessions = new Set(pageViews.map((r) => r.session_id)).size || uniqueSessions;
    const funnelBars = SCROLL_STEPS.map((step) => ({
      label: `${step}%`,
      count: scrollSessionsByStep[step].size,
      color: SCROLL_COLORS[step],
    }));

    return {
      totalPageViews: pageViews.length,
      uniqueSessions,
      totalCtaClicks: ctaClicks.length,
      ctaBars,
      maxCta,
      funnelBars,
      pageViewSessions,
    };
  }, [rows]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <h2 className="serif" style={{ margin: 0 }}>Analytics</h2>
        <div className="an-range-select">
          {RANGES.map((r) => (
            <button
              key={r.key}
              className={`an-range-btn${range === r.key ? " active" : ""}`}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {loading && <div className="admin-loading">Loading…</div>}

      {!loading && !error && (
        <>
          <div className="an-stats-row">
            <StatTile label="Page views" value={stats.totalPageViews} />
            <StatTile label="Unique visitors" value={stats.uniqueSessions} />
            <StatTile label="CTA clicks" value={stats.totalCtaClicks} />
          </div>

          <div className="an-section">
            <h3 className="an-section-title">Scroll depth — how far visitors get</h3>
            {stats.pageViewSessions === 0 ? (
              <div className="admin-empty">No visits in this range yet.</div>
            ) : (
              <div className="an-bars">
                {stats.funnelBars.map((b) => (
                  <BarRow key={b.label} label={b.label} count={b.count} max={stats.pageViewSessions} color={b.color} />
                ))}
              </div>
            )}
          </div>

          <div className="an-section">
            <h3 className="an-section-title">CTA clicks by button</h3>
            {stats.ctaBars.length === 0 ? (
              <div className="admin-empty">No CTA clicks in this range yet.</div>
            ) : (
              <div className="an-bars">
                {stats.ctaBars.map((b) => (
                  <BarRow key={b.label} label={b.label} count={b.count} max={stats.maxCta} color="var(--an-clay)" />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
