import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Login from "./Login";
import ResourceEditor from "./ResourceEditor";
import LeadsInbox from "./LeadsInbox";
import AnalyticsPanel from "./AnalyticsPanel";
import "./admin.css";

const TABS = [
  {
    key: "analytics",
    label: "Analytics",
    component: AnalyticsPanel,
  },
  {
    key: "leads",
    label: "Leads",
    component: LeadsInbox,
  },
  {
    key: "subscribers",
    label: "Subscribers",
    table: "subscribers",
    title: "Email Subscribers",
    card: { titleKey: "email", subKey: "created_at" },
    fields: [
      { key: "email", label: "Email", type: "text" },
    ],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    table: "testimonials",
    title: "Testimonials",
    card: { thumbKey: "avatar_url", titleKey: "name", subKey: "role", textKey: "text" },
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "role", label: "Role / company", type: "text" },
      { key: "text", label: "Quote", type: "textarea" },
      { key: "avatar_url", label: "Photo", type: "image", required: false },
    ],
  },
  {
    key: "reflections",
    label: "Reflections",
    table: "reflections",
    title: "Reflections",
    card: { titleKey: "title", subKey: "publication", textKey: "description" },
    favoriteKey: "is_favourite",
    favoriteLimit: 6,
    fields: [
      { key: "category", label: "Category", type: "select", options: [
        "Leadership & Workplace Culture",
        "Career Paths & Professional Development",
        "Personal Growth & Mindset",
      ]},
      { key: "publication", label: "Publication", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Short description (shown on cards)", type: "textarea" },
      { key: "body", label: "Full article body", type: "textarea", required: false },
      { key: "link", label: "External link (optional)", type: "text", required: false },
    ],
  },
  {
    key: "logos",
    label: "Leaders & Organizations",
    table: "partner_logos",
    title: "Leaders & Organizations Served",
    card: { thumbKey: "image_url", titleKey: "name" },
    fields: [
      { key: "name", label: "Organization name", type: "text" },
      { key: "image_url", label: "Logo image", type: "image", required: false },
    ],
  },
];

export default function AdminApp() {
  const [session, setSession] = useState(undefined);
  const [activeTab, setActiveTab] = useState(TABS[0].key);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;
  if (!session) return <Login />;

  const tab = TABS.find((t) => t.key === activeTab);

  return (
    <div className="admin">
      <div className="admin-topbar">
        <h1>Site Admin</h1>
        <button className="admin-signout" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`admin-tab${t.key === activeTab ? " active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="admin-body">
        {tab.component
          ? <tab.component />
          : <ResourceEditor table={tab.table} title={tab.title} fields={tab.fields} card={tab.card} favoriteKey={tab.favoriteKey} favoriteLimit={tab.favoriteLimit} />}
      </div>
    </div>
  );
}
