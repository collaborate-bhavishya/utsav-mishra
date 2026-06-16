import React, { useState, useEffect, useRef } from "react";

/* ---------------------------------------------------------
   Utsav Mishra — Homepage Redesign
   Lead-gen + lead-nurture, editorial/warm, not sales-pitchy
--------------------------------------------------------- */

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

    .um-root {
      --paper: #FAF7F2;
      --ink: #1F2E2B;
      --sage: #5C6B5D;
      --clay: #C9622D;
      --sand: #E8DFD0;
      --card: #FFFFFF;
      --line: rgba(31,46,43,0.12);
      background: var(--paper);
      color: var(--ink);
      font-family: 'Inter', sans-serif;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    .um-root * { box-sizing: border-box; }
    .um-serif { font-family: 'Fraunces', serif; }
    .um-eyebrow {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--sage);
    }
    .um-root a { color: inherit; text-decoration: none; }
    .um-root button:focus-visible, .um-root a:focus-visible, .um-root input:focus-visible, .um-root textarea:focus-visible {
      outline: 2px solid var(--clay);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      .um-root * { animation: none !important; transition: none !important; }
    }

    .um-wrap { max-width: 1180px; margin: 0 auto; padding: 0 32px; }
    @media (max-width: 640px) { .um-wrap { padding: 0 20px; } }

    /* NAV */
    .um-nav {
      position: sticky; top: 0; z-index: 50;
      background: rgba(250,247,242,0.92);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--line);
    }
    .um-nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 18px 32px; max-width: 1180px; margin: 0 auto; }
    .um-logo { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 500; letter-spacing: 0.01em; }
    .um-nav-links { display: flex; gap: 36px; font-size: 14px; font-weight: 500; }
    .um-nav-links a { opacity: 0.75; transition: opacity 0.2s; }
    .um-nav-links a:hover { opacity: 1; }
    .um-nav-cta {
      font-size: 13px; font-weight: 600; padding: 10px 20px;
      border: 1px solid var(--ink); border-radius: 100px;
      transition: background 0.2s, color 0.2s;
    }
    .um-nav-cta:hover { background: var(--ink); color: var(--paper); }
    .um-nav-mobile-toggle { display: none; background: none; border: none; cursor: pointer; }
    @media (max-width: 800px) {
      .um-nav-links, .um-nav-cta { display: none; }
      .um-nav-mobile-toggle { display: block; }
    }

    /* HERO */
    .um-hero {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      align-items: stretch;
      min-height: 640px;
    }
    @media (max-width: 900px) {
      .um-hero { grid-template-columns: 1fr; min-height: auto; }
    }
    .um-hero-text {
      display: flex; flex-direction: column; justify-content: center;
      padding: 80px 56px 80px 32px;
      max-width: 620px;
    }
    @media (max-width: 900px) { .um-hero-text { padding: 56px 24px 40px; max-width: none; } }
    .um-hero-text h1 {
      font-size: clamp(38px, 5vw, 58px);
      line-height: 1.06;
      font-weight: 500;
      margin: 18px 0 22px;
      letter-spacing: -0.01em;
    }
    .um-hero-text p {
      font-size: 18px; color: var(--sage); max-width: 480px; margin-bottom: 32px;
    }
    .um-hero-actions { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
    .um-btn-primary {
      background: var(--ink); color: var(--paper); padding: 15px 28px; border-radius: 100px;
      font-size: 15px; font-weight: 600; border: none; cursor: pointer;
      transition: background 0.2s, transform 0.2s;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .um-btn-primary:hover { background: var(--clay); transform: translateY(-1px); }
    .um-btn-ghost {
      font-size: 15px; font-weight: 600; padding: 15px 8px; border: none; background: none; cursor: pointer;
      border-bottom: 1px solid var(--ink);
    }
    .um-hero-image {
      position: relative;
      overflow: hidden;
      background: var(--sand);
    }
    .um-hero-image img {
      width: 100%; height: 100%; object-fit: cover; display: block;
      filter: saturate(0.92) contrast(1.02);
    }
    .um-hero-tag {
      position: absolute; bottom: 28px; left: 28px;
      background: rgba(250,247,242,0.94);
      padding: 14px 18px; border-radius: 4px;
      font-size: 13px; max-width: 240px;
      backdrop-filter: blur(4px);
    }
    .um-hero-tag strong { display: block; font-family: 'Fraunces', serif; font-size: 15px; margin-bottom: 2px; }

    /* PROOF STRIP */
    .um-proof {
      border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
      padding: 28px 0;
    }
    .um-proof-inner {
      display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;
    }
    .um-proof-item { display: flex; align-items: baseline; gap: 8px; font-size: 14px; color: var(--sage); }
    .um-proof-item b { font-family: 'Fraunces', serif; font-size: 17px; color: var(--ink); font-weight: 500; }

    /* SECTION HEADER */
    .um-section { padding: 96px 0; }
    .um-section--tight { padding: 72px 0; }
    .um-section-head { max-width: 640px; margin-bottom: 56px; }
    .um-section-head h2 {
      font-size: clamp(28px, 3.4vw, 40px); font-weight: 500; line-height: 1.15; margin: 14px 0 0;
    }
    .um-section-head p.sub { color: var(--sage); font-size: 17px; margin-top: 16px; max-width: 540px; }

    /* TRACKS (services) */
    .um-tracks { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); }
    @media (max-width: 860px) { .um-tracks { grid-template-columns: 1fr; } }
    .um-track {
      background: var(--card); padding: 40px 32px; display: flex; flex-direction: column; gap: 16px;
      transition: background 0.25s;
    }
    .um-track:hover { background: #FFFDF9; }
    .um-track-num { font-family: 'Fraunces', serif; font-size: 14px; color: var(--clay); }
    .um-track h3 { font-family: 'Fraunces', serif; font-size: 23px; font-weight: 500; margin: 0; }
    .um-track p { color: var(--sage); font-size: 15px; flex-grow: 1; }
    .um-track-for { font-size: 13px; padding-top: 16px; border-top: 1px solid var(--line); color: var(--ink); }
    .um-track-for b { color: var(--sage); font-weight: 500; }

    /* PROCESS — real timeline since career order carries info */
    .um-timeline { position: relative; padding-left: 28px; border-left: 1px solid var(--line); }
    .um-tl-item { position: relative; padding-bottom: 44px; }
    .um-tl-item:last-child { padding-bottom: 0; }
    .um-tl-dot {
      position: absolute; left: -33px; top: 4px; width: 9px; height: 9px; border-radius: 50%;
      background: var(--clay); border: 3px solid var(--paper); box-shadow: 0 0 0 1px var(--clay);
    }
    .um-tl-step { font-family: 'Fraunces', serif; font-size: 12px; color: var(--sage); letter-spacing: 0.06em; text-transform: uppercase; }
    .um-tl-item h4 { font-size: 19px; font-weight: 500; margin: 6px 0 8px; font-family: 'Fraunces', serif; }
    .um-tl-item p { color: var(--sage); font-size: 15px; max-width: 480px; }

    /* TESTIMONIAL */
    .um-quote-wrap { display: grid; grid-template-columns: 0.4fr 0.6fr; gap: 56px; align-items: center; }
    @media (max-width: 860px) { .um-quote-wrap { grid-template-columns: 1fr; gap: 32px; } }
    .um-quote-mark { font-family: 'Fraunces', serif; font-size: 90px; color: var(--sand); line-height: 0.6; }
    .um-quote-text { font-family: 'Fraunces', serif; font-size: clamp(20px, 2.4vw, 27px); font-weight: 400; line-height: 1.4; }
    .um-quote-author { margin-top: 24px; font-size: 14px; }
    .um-quote-author b { display: block; font-size: 15px; }
    .um-quote-author span { color: var(--sage); }
    .um-quote-dots { display: flex; gap: 8px; margin-top: 32px; }
    .um-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--line); border: none; cursor: pointer; padding: 0; }
    .um-dot.active { background: var(--clay); }

    /* REFLECTIONS — signature element: marginalia strip */
    .um-reflect-strip {
      background: var(--ink); color: var(--paper); padding: 80px 0;
    }
    .um-reflect-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 40px; flex-wrap: wrap; gap: 16px; }
    .um-reflect-head h2 { color: var(--paper); }
    .um-reflect-head .um-eyebrow { color: #9DAE9A; }
    .um-reflect-link { font-size: 14px; font-weight: 600; border-bottom: 1px solid rgba(250,247,242,0.4); padding-bottom: 2px; color: var(--paper); }
    .um-reflect-scroll {
      display: flex; gap: 1px; overflow-x: auto; padding-bottom: 8px; margin: 0 -32px; padding-left: 32px; padding-right: 32px;
      scrollbar-width: none;
    }
    .um-reflect-scroll::-webkit-scrollbar { display: none; }
    .um-reflect-card {
      min-width: 280px; max-width: 280px; background: rgba(250,247,242,0.06);
      border: 1px solid rgba(250,247,242,0.14);
      padding: 26px 22px; flex-shrink: 0;
      transition: background 0.2s;
    }
    .um-reflect-card:hover { background: rgba(250,247,242,0.11); }
    .um-reflect-cat { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--clay); font-weight: 600; }
    .um-reflect-card h4 { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; line-height: 1.3; margin: 12px 0 10px; }
    .um-reflect-card p { font-size: 14px; color: #C9D1C6; line-height: 1.55; }

    /* NURTURE / NEWSLETTER */
    .um-nurture {
      background: var(--sand); border-radius: 6px; padding: 48px 48px;
      display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: center;
    }
    @media (max-width: 700px) { .um-nurture { grid-template-columns: 1fr; padding: 36px 28px; } }
    .um-nurture h3 { font-family: 'Fraunces', serif; font-size: 23px; font-weight: 500; margin: 0 0 8px; }
    .um-nurture p { color: var(--sage); font-size: 15px; max-width: 420px; }
    .um-nurture-form { display: flex; gap: 10px; }
    @media (max-width: 480px) { .um-nurture-form { flex-direction: column; } }
    .um-nurture-form input {
      border: 1px solid var(--line); background: var(--card); padding: 13px 16px; border-radius: 100px;
      font-size: 14px; min-width: 220px; font-family: inherit;
    }

    /* CONTACT FORM */
    .um-contact { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 64px; }
    @media (max-width: 900px) { .um-contact { grid-template-columns: 1fr; gap: 40px; } }
    .um-contact-side h2 { margin-top: 14px; }
    .um-contact-side p { color: var(--sage); font-size: 16px; margin-top: 16px; max-width: 380px; }
    .um-contact-detail { margin-top: 36px; font-size: 14px; }
    .um-contact-detail div { margin-bottom: 10px; color: var(--sage); }
    .um-contact-detail span { color: var(--ink); font-weight: 500; }
    .um-form-card { background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 40px; }
    .um-field { margin-bottom: 22px; }
    .um-field label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--ink); }
    .um-field input, .um-field textarea {
      width: 100%; border: 1px solid var(--line); border-radius: 5px; padding: 12px 14px;
      font-size: 15px; font-family: inherit; background: var(--paper); color: var(--ink);
      transition: border-color 0.2s;
    }
    .um-field input:focus, .um-field textarea:focus { border-color: var(--clay); outline: none; }
    .um-form-note { font-size: 13px; color: var(--sage); margin-top: 18px; }
    .um-submitted { text-align: center; padding: 40px 0; }
    .um-submitted h4 { font-family: 'Fraunces', serif; font-size: 22px; margin-bottom: 10px; }
    .um-submitted p { color: var(--sage); font-size: 15px; }

    /* FOOTER */
    .um-footer { border-top: 1px solid var(--line); padding: 56px 0 32px; }
    .um-footer-inner { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 32px; margin-bottom: 40px; }
    .um-footer-brand .um-logo { margin-bottom: 10px; display: block; }
    .um-footer-brand p { color: var(--sage); font-size: 14px; max-width: 260px; }
    .um-footer-cols { display: flex; gap: 56px; flex-wrap: wrap; }
    .um-footer-col h5 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--sage); margin-bottom: 14px; }
    .um-footer-col a, .um-footer-col div { display: block; font-size: 14px; margin-bottom: 10px; opacity: 0.85; }
    .um-footer-bottom { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--sage); border-top: 1px solid var(--line); padding-top: 24px; flex-wrap: wrap; gap: 12px; }
  `}</style>
);

const tracks = [
  {
    num: "01",
    title: "Executive Coaching",
    desc: "One-on-one work with founders, CXOs, and senior leaders navigating decisions, transitions, or the quieter parts of leading that don't show up on a scorecard.",
    forWhom: "Senior leaders who want a sounding board, not a checklist.",
  },
  {
    num: "02",
    title: "Corporate Speaking & Workshops",
    desc: "Tailored sessions for teams and leadership groups, built on real operating experience rather than borrowed frameworks — on resilience, trust, and energy at work.",
    forWhom: "L&D and people teams designing a session that needs to actually land.",
  },
  {
    num: "03",
    title: "Startup Advisory",
    desc: "Strategic counsel for early and growth-stage founders on people, culture, and the human side of scaling — drawn from building functions inside fast-growing companies.",
    forWhom: "Founders building the people layer of their company for the first time.",
  },
];

const timeline = [
  { step: "2011 — Amul", title: "Where it started", desc: "Frontline sales, high-pressure targets, and the first lessons in coaching a team rather than commanding it." },
  { step: "2017–2018 — Swiggy", title: "Scaling under pressure", desc: "Owned a 650-crore P&L with a 65-member team; built restaurant supply strategy across 60 cities." },
  { step: "2019 — Psychotherapy", title: "Going deeper", desc: "Trained and certified as a psychotherapist; 100+ hours counselling working professionals." },
  { step: "2021 — The/Nudge", title: "Social impact at scale", desc: "Built an inducement prize contest that helped startups raise ₹150+ crore in funding." },
  { step: "2022 — LetsTransport", title: "Leading culture change", desc: "Head of People; led cultural transformation and coached the CXO layer through it." },
];

const reflections = [
  { cat: "Leadership", title: "Gen Z Isn't the Problem — You Are", desc: "Common myths about a generation say more about the people judging them than the generation itself." },
  { cat: "Career", title: "Three Ways People Find Work They Truly Love", desc: "There are three real paths to discovering the work you love — and most people are only taught one." },
  { cat: "Personal Growth", title: "Forget Self-Love — Self-Awareness Is the Real Superpower", desc: "Self-love is comforting. Self-awareness and accountability are what actually move you forward." },
  { cat: "Leadership", title: "Building Trust at Work: The Most Valuable Currency", desc: "Teams that lack trust conceal weaknesses — and that's where most leadership failures quietly begin." },
  { cat: "Personal Growth", title: "Quick Wins Fade — Slow Success Lasts", desc: "The high from a big win fades faster than expected. Here's what actually compounds instead." },
];

const quotes = [
  {
    text: "Composed. Thoughtful. Extremely good listener. Action-oriented. He helped me unlock my blind spots and become more self-aware.",
    name: "Sudarshan Ravi Jha",
    role: "Co-founder, z21 Ventures & LetsTransport",
  },
  {
    text: "His frameworks on resilience and energy management offered practical, actionable insights. Our team continues to reference and apply them.",
    name: "Ritesh Agarwal",
    role: "VP, Educational Initiatives (Ei)",
  },
  {
    text: "He carries his skills lightly — humble, patient, and always willing to listen. We continue to draw on each other's wisdom.",
    name: "Neelacantan",
    role: "Learning & Development Leader, Tekion",
  },
];

function Nav() {
  return (
    <nav className="um-nav">
      <div className="um-nav-inner">
        <div className="um-logo">Utsav Mishra</div>
        <div className="um-nav-links">
          <a href="#approach">Approach</a>
          <a href="#journey">Journey</a>
          <a href="#reflections">Reflections</a>
          <a href="#connect">Connect</a>
        </div>
        <a href="#connect" className="um-nav-cta">Start a conversation</a>
        <button className="um-nav-mobile-toggle" aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="#1F2E2B" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="um-hero">
      <div className="um-hero-text">
        <span className="um-eyebrow">Executive Coach · TEDx Speaker · Startup Advisor</span>
        <h1 className="um-serif">A sounding board for people who carry the weight of leading.</h1>
        <p>Fourteen years across Amul, Swiggy, The/Nudge, and LetsTransport — now spent helping founders, CXOs, and leadership teams navigate the decisions that don't show up in a playbook.</p>
        <div className="um-hero-actions">
          <a href="#connect" className="um-btn-primary">
            Start a conversation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <a href="#approach" className="um-btn-ghost">See how I work</a>
        </div>
      </div>
      <div className="um-hero-image">
        <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1200&auto=format&fit=crop" alt="Utsav Mishra in conversation during a coaching session" />
        <div className="um-hero-tag">
          <strong>Trusted Advisor</strong>
          Working with founders and leadership teams on the human side of scale.
        </div>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <div className="um-proof">
      <div className="um-wrap um-proof-inner">
        <div className="um-proof-item"><b>14+ yrs</b>&nbsp;across business &amp; people leadership</div>
        <div className="um-proof-item"><b>TEDx</b>&nbsp;speaker, MITSG</div>
        <div className="um-proof-item"><b>NASSCOM</b>&nbsp;mentor</div>
        <div className="um-proof-item"><b>₹150cr+</b>&nbsp;raised by founders he's advised</div>
        <div className="um-proof-item"><b>100+ hrs</b>&nbsp;certified psychotherapy practice</div>
      </div>
    </div>
  );
}

function Tracks() {
  return (
    <section className="um-section" id="approach">
      <div className="um-wrap">
        <div className="um-section-head">
          <span className="um-eyebrow">How we might work together</span>
          <h2 className="um-serif">Three ways people usually reach out</h2>
          <p className="sub">Each is a different kind of engagement — pick the one that matches where you actually are, not where you think you should be.</p>
        </div>
        <div className="um-tracks">
          {tracks.map((t) => (
            <div className="um-track" key={t.num}>
              <span className="um-track-num">{t.num}</span>
              <h3 className="um-serif">{t.title}</h3>
              <p>{t.desc}</p>
              <div className="um-track-for"><b>Best for:</b> {t.forWhom}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="um-section" id="journey" style={{ background: "var(--sand)" }}>
      <div className="um-wrap">
        <div className="um-section-head">
          <span className="um-eyebrow">The journey so far</span>
          <h2 className="um-serif">Built from practice, not theory</h2>
          <p className="sub">An alumnus of IRMA, Utsav's path runs through frontline business roles, hypergrowth startups, and formal training in psychotherapy — which is why the coaching draws on lived experience, not borrowed frameworks.</p>
        </div>
        <div className="um-timeline">
          {timeline.map((item, i) => (
            <div className="um-tl-item" key={i}>
              <div className="um-tl-dot" />
              <span className="um-tl-step">{item.step}</span>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % quotes.length), 6000);
    return () => clearInterval(id);
  }, []);
  const q = quotes[active];
  return (
    <section className="um-section--tight">
      <div className="um-wrap um-quote-wrap">
        <div>
          <span className="um-eyebrow">What clients say</span>
          <div className="um-quote-dots">
            {quotes.map((_, i) => (
              <button key={i} className={`um-dot ${i === active ? "active" : ""}`} onClick={() => setActive(i)} aria-label={`Show testimonial ${i + 1}`} />
            ))}
          </div>
        </div>
        <div>
          <div className="um-quote-mark um-serif">"</div>
          <p className="um-quote-text">{q.text}</p>
          <div className="um-quote-author">
            <b>{q.name}</b>
            <span>{q.role}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReflectionsStrip() {
  return (
    <section className="um-reflect-strip" id="reflections">
      <div className="um-wrap">
        <div className="um-reflect-head">
          <div>
            <span className="um-eyebrow">Reflections</span>
            <h2 className="um-serif">Writing, mostly for myself — shared in case it's useful</h2>
          </div>
          <a href="#" className="um-reflect-link">Read all reflections →</a>
        </div>
        <div className="um-reflect-scroll">
          {reflections.map((r, i) => (
            <a href="#" className="um-reflect-card" key={i}>
              <span className="um-reflect-cat">{r.cat}</span>
              <h4>{r.title}</h4>
              <p>{r.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Nurture() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="um-section--tight">
      <div className="um-wrap">
        <div className="um-nurture">
          <div>
            <h3 className="um-serif">Not ready for a conversation yet?</h3>
            <p>Join a small, free community where Utsav shares reflections and prompts on leadership and self-awareness — no pitch, just the writing.</p>
          </div>
          {done ? (
            <span style={{ fontSize: 14, fontWeight: 600 }}>You're in — check your inbox.</span>
          ) : (
            <form className="um-nurture-form" onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}>
              <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required aria-label="Email address" />
              <button type="submit" className="um-btn-primary">Join the list</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Connect() {
  const [form, setForm] = useState({ name: "", email: "", focus: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email) setSubmitted(true);
  };

  return (
    <section className="um-section" id="connect">
      <div className="um-wrap um-contact">
        <div className="um-contact-side">
          <span className="um-eyebrow">Get in touch</span>
          <h2 className="um-serif">Tell me a little about where you are.</h2>
          <p>There's no form to "qualify" yourself for. A short note on what's on your mind is enough — I read every one personally and reply if it's a fit.</p>
          <div className="um-contact-detail">
            <div>Email <span>collaboratewithutsav@gmail.com</span></div>
            <div>Phone / WhatsApp <span>+91 87470 91000</span></div>
            <div>Based in <span>Bengaluru, India</span></div>
          </div>
        </div>
        <div className="um-form-card">
          {submitted ? (
            <div className="um-submitted">
              <h4 className="um-serif">Thank you, {form.name.split(" ")[0]}.</h4>
              <p>Your note has been sent. Utsav reads these personally — expect a reply within a few days if there's a fit.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="um-field">
                <label htmlFor="um-name">Full name</label>
                <input id="um-name" name="name" type="text" value={form.name} onChange={handleChange} required />
              </div>
              <div className="um-field">
                <label htmlFor="um-email">Email address</label>
                <input id="um-email" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="um-field">
                <label htmlFor="um-focus">What's on your mind?</label>
                <textarea id="um-focus" name="focus" rows={4} placeholder="A line or two on what you're navigating right now." value={form.focus} onChange={handleChange} />
              </div>
              <button type="submit" className="um-btn-primary" style={{ width: "100%", justifyContent: "center" }}>Send</button>
              <p className="um-form-note">No automated follow-ups, no sales sequence — just a personal reply.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="um-footer">
      <div className="um-wrap">
        <div className="um-footer-inner">
          <div className="um-footer-brand">
            <span className="um-logo um-serif">Utsav Mishra</span>
            <p>Helping leaders navigate purpose, peace, and peak performance — through self-mastery, one conversation at a time.</p>
          </div>
          <div className="um-footer-cols">
            <div className="um-footer-col">
              <h5>Site</h5>
              <a href="#approach">Approach</a>
              <a href="#journey">Journey</a>
              <a href="#reflections">Reflections</a>
              <a href="#connect">Connect</a>
            </div>
            <div className="um-footer-col">
              <h5>Connect</h5>
              <div>collaboratewithutsav@gmail.com</div>
              <div>+91 87470 91000</div>
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
        <div className="um-footer-bottom">
          <span>© 2026 Utsav Mishra. All rights reserved.</span>
          <span>Bengaluru, India</span>
        </div>
      </div>
    </footer>
  );
}

export default function UtsavHome() {
  return (
    <div className="um-root">
      {FONTS}
      <Nav />
      <Hero />
      <Proof />
      <Tracks />
      <Journey />
      <Testimonials />
      <ReflectionsStrip />
      <Nurture />
      <Connect />
      <Footer />
    </div>
  );
}
