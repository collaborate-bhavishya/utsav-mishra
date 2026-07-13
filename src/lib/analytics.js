import { supabase } from "./supabase";

const SESSION_KEY = "um_session_id";
const SCROLL_MILESTONES = [25, 50, 75, 100];

function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "no-session-storage";
  }
}

function logEvent(event_type, label) {
  const session_id = getSessionId();
  const page = window.location.pathname;
  supabase.from("analytics_events").insert({ event_type, label, page, session_id }).then(() => {});
}

export function trackPageView() {
  logEvent("page_view", null);
}

export function trackCTA(label) {
  logEvent("cta_click", label);
}

export function initScrollTracking() {
  const fired = new Set();
  let ticking = false;

  function check() {
    ticking = false;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const pct = Math.round((window.scrollY / scrollable) * 100);
    for (const milestone of SCROLL_MILESTONES) {
      if (pct >= milestone && !fired.has(milestone)) {
        fired.add(milestone);
        logEvent("scroll_depth", String(milestone));
      }
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(check);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  check();
  return () => window.removeEventListener("scroll", onScroll);
}
