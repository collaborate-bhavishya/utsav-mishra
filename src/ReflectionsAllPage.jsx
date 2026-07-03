import { useSupabaseList } from "./lib/useSupabaseList";

const DEFAULT_REFLECTIONS = [
  { cat:"Leadership & Workplace Culture", pub:"People Matters", title:"Gen Z Isn't the Problem — You Are", desc:"What the loudest critiques of a generation reveal about the people making them.", body:"What the loudest critiques of a generation reveal about the people making them. Leaders often externalize problems that are closer to home than they'd like to admit.", link:"" },
  { cat:"Career Paths & Professional Development", pub:"ETHRWorld", title:"Three Ways People Find Work They Truly Love", desc:"Most people are only taught one path. There are two others — and they're more reliable.", body:"Most people are only taught one path to fulfilling work: follow your passion. But passion is often discovered, not followed.", link:"" },
  { cat:"Personal Growth & Mindset", pub:"Blog", title:"Forget Self-Love — Self-Awareness Is the Real Superpower", desc:"Self-love is comforting. Self-awareness and accountability are what actually move you forward.", body:"Self-love is comforting. Self-awareness and accountability are what actually move you forward.", link:"" },
  { cat:"Leadership & Workplace Culture", pub:"Blog", title:"The Leader Who Listens", desc:"Most leaders think they listen. Very few actually do — and the gap shows up everywhere.", body:"Most leaders think they listen. Very few actually do. Listening isn't silence; it's active presence.", link:"" },
  { cat:"Career Paths & Professional Development", pub:"LinkedIn", title:"Why Your First Job Title Doesn't Define Your Career", desc:"The early years are for learning, not positioning. The obsession with titles gets in the way.", body:"The early years of a career are for learning, not positioning. The obsession with titles, levels, and perceived prestige gets in the way.", link:"" },
  { cat:"Personal Growth & Mindset", pub:"Blog", title:"On Stillness as a Leadership Practice", desc:"The most effective leaders I've worked with share one unusual habit: they protect their thinking time.", body:"The most effective leaders I've worked with share one unusual habit: they protect their thinking time fiercely.", link:"" },
];

const CATEGORIES = [
  "Leadership & Workplace Culture",
  "Career Paths & Professional Development",
  "Personal Growth & Mindset",
];

export default function ReflectionsAllPage({ onBack, onOpenArticle }) {
  const reflections = useSupabaseList(
    "reflections",
    (row) => ({ cat: row.category, pub: row.publication, title: row.title, desc: row.description, body: row.body || row.description, link: row.link }),
    DEFAULT_REFLECTIONS
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F7F3EE", fontFamily: "'Inter', sans-serif", color: "#1A2420" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .ra-wrap { max-width: 1100px; margin: 0 auto; padding: 0 36px 96px; }
        @media (max-width: 600px) { .ra-wrap { padding: 0 20px 64px; } }
        .ra-back {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 500; color: #6B7B6C;
          background: none; border: none; cursor: pointer;
          padding: 28px 0 0; transition: color 0.2s;
        }
        .ra-back:hover { color: #B85C30; }
        .ra-hero { padding: 48px 0 56px; border-bottom: 1px solid rgba(26,36,32,0.09); margin-bottom: 64px; }
        .ra-eyebrow { font-size: 14px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #B85C30; padding-bottom: 6px; border-bottom: 2px solid #B85C30; display: inline-block; margin-bottom: 18px; }
        .ra-h1 { font-family: 'Fraunces', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 400; line-height: 1.12; color: #1A2420; }
        .ra-cat-section { margin-bottom: 72px; }
        .ra-cat-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 500; color: #1A2420; margin-bottom: 28px; padding-bottom: 14px; border-bottom: 1px solid rgba(26,36,32,0.09); }
        .ra-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media (max-width: 860px) { .ra-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 520px) { .ra-grid { grid-template-columns: 1fr; } }
        .ra-card {
          border-top: 2px solid #B85C30; padding-top: 20px;
          display: flex; flex-direction: column; gap: 8px;
          cursor: pointer; transition: opacity 0.2s;
        }
        .ra-card:hover { opacity: 0.7; }
        .ra-pub { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #B85C30; }
        .ra-card h3 { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; line-height: 1.3; }
        .ra-card p { font-size: 13px; color: #6B7B6C; line-height: 1.6;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .ra-empty { color: #6B7B6C; font-size: 15px; font-style: italic; padding: 12px 0; }
      `}</style>
      <div className="ra-wrap">
        <button className="ra-back" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <div className="ra-hero">
          <span className="ra-eyebrow">Reflections</span>
          <h1 className="ra-h1">Writing, mostly to make sense of things.</h1>
        </div>
        {CATEGORIES.map(cat => {
          const items = reflections.filter(r => r.cat === cat);
          return (
            <div className="ra-cat-section" key={cat}>
              <div className="ra-cat-title">{cat}</div>
              {items.length === 0 ? (
                <p className="ra-empty">No articles in this category yet.</p>
              ) : (
                <div className="ra-grid">
                  {items.map((r, i) => (
                    <div className="ra-card" key={i} onClick={() => onOpenArticle(r)} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && onOpenArticle(r)}>
                      <span className="ra-pub">{r.pub}</span>
                      <h3>{r.title}</h3>
                      <p>{r.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
