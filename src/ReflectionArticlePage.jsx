export default function ReflectionArticlePage({ article, onBack }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#F7F3EE",
      fontFamily: "'Inter', sans-serif",
      color: "#1A2420",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .art-wrap { max-width: 720px; margin: 0 auto; padding: 0 36px; }
        @media (max-width: 600px) { .art-wrap { padding: 0 20px; } }
        .art-back {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 500; color: #6B7B6C;
          background: none; border: none; cursor: pointer;
          padding: 24px 0 0;
          transition: color 0.2s;
        }
        .art-back:hover { color: #B85C30; }
        .art-cat {
          font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase; color: #B85C30;
          margin-top: 40px; display: block;
        }
        .art-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 400; line-height: 1.15;
          margin-top: 14px; margin-bottom: 16px;
          color: #1A2420;
        }
        .art-meta { font-size: 13px; color: #6B7B6C; margin-bottom: 48px; }
        .art-divider { height: 2px; background: #B85C30; width: 48px; margin-bottom: 40px; }
        .art-body {
          font-size: 18px; line-height: 1.85; color: #2A3530;
          font-family: 'Inter', sans-serif;
        }
        .art-body p { margin-bottom: 24px; }
        .art-link {
          display: inline-flex; align-items: center; gap: 8px;
          margin-top: 40px; padding: 13px 28px; border-radius: 100px;
          border: 1.5px solid #B85C30; color: #B85C30;
          font-size: 14px; font-weight: 600; background: none;
          text-decoration: none; transition: all 0.2s;
        }
        .art-link:hover { background: #B85C30; color: #fff; }
      `}</style>
      <div className="art-wrap">
        <button className="art-back" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Reflections
        </button>
        <span className="art-cat">{article.cat}</span>
        <h1 className="art-title">{article.title}</h1>
        <div className="art-meta">Published in {article.pub}</div>
        <div className="art-divider" />
        <div className="art-body">
          {(article.body || article.desc).split("\n").map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
        </div>
        {article.link && (
          <a className="art-link" href={article.link} target="_blank" rel="noreferrer">
            Read on {article.pub}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        )}
      </div>
    </div>
  );
}
