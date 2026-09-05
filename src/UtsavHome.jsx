import { useState, useEffect, useRef } from "react";
import { useSupabaseList } from "./lib/useSupabaseList";
import { supabase } from "./lib/supabase";
import { trackPageView, trackCTA, initScrollTracking } from "./lib/analytics";
import { slugify } from "./lib/slugify";
import ReflectionsAllPage from "./ReflectionsAllPage";
import ReflectionArticlePage from "./ReflectionArticlePage";

const HERO_IMG = "/utsav-hero.png";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .um {
    --paper:     #F7F3EE;
    --ink:       #1A2420;
    --sage:      #6B7B6C;
    --clay:      #B85C30;
    --sand:      #EDE5D8;
    --hero-l:    #EDE8E0;
    --card:      #FFFFFF;
    --line:      rgba(26,36,32,0.09);
    --max:       1160px;
    background: var(--paper);
    color: var(--ink);
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    line-height: 1.6;
    overflow-x: hidden;
  }
  .um a { color: inherit; text-decoration: none; }
  .um button { cursor: pointer; font-family: inherit; }
  .um img { display: block; max-width: 100%; }
  .serif { font-family: 'Fraunces', serif; }
  .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--sage); }
  .section-eyebrow {
    display: inline-block;
    font-size: 14px; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--clay);
    padding-bottom: 6px;
    border-bottom: 2px solid var(--clay);
  }
  .section-h2 {
    font-family: 'Fraunces', serif;
    font-size: clamp(28px, 3.5vw, 44px);
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: -0.005em;
    margin-top: 18px;
  }
  .wrap { max-width: var(--max); margin: 0 auto; padding: 0 36px; }
  @media (max-width: 600px) { .wrap { padding: 0 20px; } }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 16px 36px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px;
    background: var(--sand);
    transition: background 0.35s, box-shadow 0.35s;
  }
  @media (max-width: 1024px) { .nav { padding: 14px 24px; } }
  @media (max-width: 760px)  { .nav { padding: 14px 20px; } }
  .nav.scrolled {
    background: rgba(237,229,216,0.96);
    backdrop-filter: blur(10px);
    box-shadow: 0 1px 0 var(--line);
  }
  .nav-logo { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; z-index: 110; }
  .nav-logo img { height: 60px; width: auto; display: block; }
  .nav-logo .nav-logo-name {
    font-family: 'Fraunces', serif;
    font-size: 13px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--ink);
  }
  @media (max-width: 600px) { .nav-logo img { height: 60px; } .nav-logo .nav-logo-name { font-size: 11px; } }
  .nav-links { display: flex; gap: 32px; }
  .nav-links a { font-size: 14px; font-weight: 500; color: var(--ink); opacity: 0.6; transition: opacity 0.2s; }
  .nav-links a:hover { opacity: 1; }
  .nav-cta {
    font-size: 13px; font-weight: 600; padding: 10px 22px; border-radius: 100px;
    border: 1.5px solid var(--ink); color: var(--ink); background: transparent;
    white-space: nowrap; flex-shrink: 0;
    transition: all 0.2s;
  }
  .nav-cta:hover { background: var(--clay); border-color: var(--clay); color: #fff; }
  @media (max-width: 1024px) { .nav-cta { padding: 9px 18px; font-size: 12px; } .nav-links { gap: 24px; } }
  @media (max-width: 900px)  { .nav-cta { padding: 8px 14px; font-size: 11.5px; } .nav-links { gap: 18px; } }
  
  .nav-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--ink);
    cursor: pointer;
    z-index: 110;
  }
  .nav-mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: var(--paper);
    z-index: 105;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .nav-mobile-overlay.open {
    transform: translateY(0);
  }
  .nav-mobile-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }
  .nav-mobile-links a {
    font-family: 'Fraunces', serif;
    font-size: 28px;
    color: var(--ink);
    opacity: 0.8;
  }
  .nav-mobile-cta {
    font-size: 15px;
    font-weight: 600;
    padding: 14px 28px;
    border-radius: 100px;
    background: var(--clay);
    color: #fff;
    border: none;
    margin-top: 16px;
  }
  @media (max-width: 760px) {
    .nav-links, .nav-cta { display: none; }
    .nav-toggle { display: block; }
  }

  /* HERO — warm pastel split */
  .hero {
    height: calc(100vh - 92px);
    min-height: 560px;
    max-height: 760px;
    margin-top: 92px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--sand);
    overflow: hidden;
    position: relative;
  }

  .hero::before {
    content: "";
    position: absolute; top: 15%; bottom: 15%; left: 50%;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(26,36,32,0.08) 30%, rgba(26,36,32,0.08) 70%, transparent);
    pointer-events: none; z-index: 3;
  }
  @media (max-width: 860px) {
    .hero {
      grid-template-columns: 1fr;
      height: auto; min-height: auto; max-height: none;
      overflow: visible;
    }
    .hero::before { display: none; }
    .hero::after { display: none; }
  }

  .hero-left {
    display: flex; flex-direction: column; justify-content: center;
    align-items: flex-start; text-align: left;
    padding: 48px 56px 48px 140px;
    height: 100%;
    background: transparent;
  }
  .hero-left > * { max-width: 480px; }
  @media (max-width: 1100px) { .hero-left { padding: 40px 36px 40px 40px; } }
  @media (max-width: 860px) { .hero-left { padding: 40px 24px 32px; align-items: flex-start; } .hero-left > * { max-width: 100%; } }

  .hero-left .eyebrow { margin-bottom: 22px; }

  .hero-tagline {
    font-size: 15px; color: var(--sage); margin-top: 18px; margin-bottom: 18px;
    font-style: italic; font-family: 'Fraunces', serif; font-weight: 300;
  }

  .hero-h1 {
    font-family: 'Fraunces', serif;
    font-size: clamp(34px, 4.2vw, 54px);
    font-weight: 400; line-height: 1.1; letter-spacing: -0.01em;
    color: var(--ink); margin-bottom: 26px;
    display: flex; flex-direction: column;
  }
  .hero-h1-line { display: block; white-space: nowrap; }
  @media (max-width: 860px) { .hero-h1 { font-size: clamp(30px, 7vw, 44px); } .hero-h1-line { white-space: normal; } }

  .hero-body {
    font-size: 16px; color: var(--sage);
    max-width: 420px; line-height: 1.72; margin-bottom: 40px;
  }

  .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }

  .btn-primary {
    background: var(--clay); color: #fff;
    padding: 14px 28px; border-radius: 100px;
    font-size: 15px; font-weight: 600; border: none;
    display: inline-flex; align-items: center; gap: 8px;
    transition: background 0.2s, transform 0.15s;
  }
  .btn-primary:hover { background: #9f4e26; transform: translateY(-1px); }

  .btn-ghost {
    color: var(--ink); font-size: 15px; font-weight: 500;
    border: none; background: none;
    border-bottom: 1px solid rgba(26,36,32,0.25);
    padding: 2px 0; opacity: 0.7; transition: opacity 0.2s;
  }
  .btn-ghost:hover { opacity: 1; }

  /* Hero right — portrait */
  .hero-right {
    position: relative;
    background: transparent;
    overflow: hidden;
    height: 100%;
    padding-top: 32px;
  }
  @media (max-width: 860px) { .hero-right { height: 460px; padding-top: 16px; } }

  .hero-portrait {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  /* LOGOS */
  .logos { padding: 72px 0; background: #FFFFFF; border-bottom: 1px solid var(--line); }
  .logos .wrap { padding-left: 40px; padding-right: 40px; }
  .logos .section-eyebrow { display: block; text-align: center; margin: 0 auto 40px; }
  .logos-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    row-gap: 28px;
    column-gap: 32px;
    align-items: center;
    max-width: 960px;
    margin: 0 auto;
  }
  .logo-item {
    min-height: 70px;
    display: flex; align-items: center; justify-content: center;
  }
  .logo-item img {
    max-height: 60px; width: auto; max-width: 100%;
    object-fit: contain;
  }
  .logo-item img[alt="Indian Air Force"] { max-height: 90px; max-width: 100px; }
  @media (max-width: 720px) {
    .logos .wrap { padding-left: 28px; padding-right: 28px; }
    .logos-row { grid-template-columns: repeat(2, 1fr); row-gap: 24px; column-gap: 20px; }
  }
  .logo-pill {
    background: rgba(26,36,32,0.06); border-radius: 3px; padding: 11px 22px;
    font-family: 'Fraunces', serif; font-size: 14px; color: var(--sage);
    letter-spacing: 0.03em;
  }

  /* SECTION */
  .section     { padding: 96px 0; }
  .section-sm  { padding: 72px 0; }
  .section-dark{ padding: 96px 0; background: #232E29; }
  .section-sand{ padding: 64px 0; background: var(--sand); }

  .section-head { margin-bottom: 52px; }
  .section-head h2 { font-family: 'Fraunces', serif; font-size: clamp(28px,3.5vw,44px); font-weight: 400; line-height: 1.15; margin-top: 14px; }
  .section-head .sub { color: var(--sage); font-size: 17px; margin-top: 14px; max-width: 520px; }

  /* SERVICES */
  .services-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; background: var(--line); border: 1px solid var(--line); }
  @media (max-width: 860px) { .services-grid { grid-template-columns: 1fr; } }
  .svc { background: var(--card); padding: 44px 34px; display: flex; flex-direction: column; gap: 14px; transition: background 0.2s; }
  .svc:hover { background: #FDFAF6; }
  .svc-num { font-family: 'Fraunces', serif; font-size: 13px; color: var(--clay); }
  .svc h3 { font-family: 'Fraunces', serif; font-size: 23px; font-weight: 500; line-height: 1.2; }
  .svc p { color: var(--sage); font-size: 15px; line-height: 1.65; flex-grow: 1; }
  .svc-for { font-size: 13px; padding-top: 18px; border-top: 1px solid var(--line); }
  .svc-for b { color: var(--sage); font-weight: 500; }

  /* PHOTO STRIP */
  .photo-strip { height: 380px; overflow: hidden; position: relative; background: var(--sand); }
  .photo-strip img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.78) brightness(0.96); }
  .photo-caption { position: absolute; bottom: 20px; right: 28px; font-size: 12px; color: rgba(255,255,255,0.65); font-style: italic; }
  @media (max-width: 600px) { .photo-strip { height: 220px; } }

  /* TESTIMONIALS — single-card carousel */
  .testi-eyebrow {
    display: inline-block;
    font-size: 14px; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--clay);
    padding-bottom: 6px;
    border-bottom: 2px solid var(--clay);
  }
  .testi-carousel-pro { position: relative; max-width: 980px; margin: 0 auto; }
  .testi-track { overflow: hidden; border-radius: 10px; }
  .testi-track-inner { display: flex; transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
  .testi-slide { min-width: 100%; }
  .testi-pro-card {
    display: grid;
    grid-template-columns: 45% 1fr;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 10px;
    overflow: hidden;
    min-height: 360px;
  }
  .testi-pro-left {
    background: var(--sand);
    padding: 32px 28px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    gap: 18px;
    min-height: 360px;
  }
  .testi-pro-avatar {
    width: 140px; height: 140px;
    border-radius: 50%;
    object-fit: cover;
    background: #fff;
    border: 3px solid #fff;
    box-shadow: 0 6px 20px rgba(26,36,32,0.10);
    display: block;
  }
  .testi-pro-name { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 500; color: var(--ink); line-height: 1.25; }
  .testi-pro-role { font-size: 13px; color: var(--clay); font-weight: 600; letter-spacing: 0.03em; margin-top: 4px; }
  .testi-pro-right {
    padding: 44px;
    display: flex; flex-direction: column; justify-content: center; gap: 16px;
  }
  .testi-pro-qmark { font-family: 'Fraunces', serif; font-size: 64px; line-height: 0.4; color: var(--clay); opacity: 0.25; }
  .testi-pro-text { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 400; line-height: 1.6; color: var(--ink); }
  .testi-controls {
    display: flex; align-items: center; justify-content: center; gap: 12px;
    margin-top: 24px;
  }
  .testi-dot { width: 8px; height: 8px; border-radius: 50%; border: none; padding: 0; background: var(--line); transition: background 0.2s, transform 0.2s; cursor: pointer; }
  .testi-dot.active { background: var(--clay); transform: scale(1.4); }
  .testi-arrow {
    width: 38px; height: 38px;
    border: 1px solid var(--line);
    background: transparent;
    border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: var(--ink);
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .testi-arrow:hover { background: var(--clay); border-color: var(--clay); color: #fff; }
  @media (max-width: 720px) {
    .testi-pro-card { grid-template-columns: 1fr; min-height: 0; }
    .testi-pro-left { min-height: 280px; }
    .testi-pro-right { padding: 24px 24px 32px; }
    .testi-pro-text { font-size: 17px; }
  }

  /* WHY */
  .why-inner { max-width: 700px; margin: 0 auto; }
  .why-header h2 { font-family: 'Fraunces', serif; font-size: clamp(28px,3.5vw,44px); font-weight: 400; line-height: 1.15; margin-top: 18px; color: var(--paper); }
  .why-eyebrow {
    display: inline-block;
    font-size: 14px; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--clay);
    padding-bottom: 6px;
    border-bottom: 2px solid var(--clay);
  }
  .why-photo { margin: 40px 0 48px; border-radius: 4px; overflow: hidden; height: 420px; }
  .why-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center 12%; filter: saturate(0.72) brightness(0.92); }
  @media (max-width: 600px) { .why-photo { height: 300px; } }
  .why-body p { font-size: 17px; line-height: 1.78; color: rgba(247,243,238,0.68); margin-bottom: 22px; }
  .why-body p:last-child { margin-bottom: 0; }

  /* CREDENTIALS */
  .creds-inner { display: grid; grid-template-columns: repeat(4, 1fr); align-items: stretch; justify-content: center; gap: 0; }
  .cred {
    text-align: center; padding: 28px 28px;
    border-right: 1px solid rgba(26,36,32,0.13);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .cred:last-child { border-right: none; }
  .cred-logo {
    height: 64px; width: 100%;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 8px;
  }
  .cred-logo img { max-height: 56px; max-width: 130px; width: auto; object-fit: contain; }
  .cred-logo svg { max-height: 56px; max-width: 130px; width: auto; height: 56px; color: var(--clay); }
  .cred-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; line-height: 1.25; }
  .cred-sub { font-size: 13px; color: var(--sage); }
  @media (max-width: 760px) {
    .creds-inner { grid-template-columns: repeat(2, 1fr); gap: 28px 16px; }
    .cred { border-right: none; padding: 0; }
  }

  /* REFLECTIONS */
  .ref-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; margin-top: 52px; }
  @media (max-width: 860px) { .ref-grid { grid-template-columns: 1fr; } }
  .ref-card { border-top: 2px solid var(--clay); padding-top: 22px; display: flex; flex-direction: column; gap: 10px; cursor: pointer; transition: opacity 0.2s; }
  .ref-card:hover { opacity: 0.7; }
  .ref-cat { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--clay); }
  .ref-card h4 { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 500; line-height: 1.3; }
  .ref-card p { font-size: 14px; color: var(--sage); line-height: 1.6; flex-grow: 1;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .ref-pub { font-size: 12px; color: var(--sage); opacity: 0.6; }
  .ref-cta { text-align: center; margin-top: 48px; display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .btn-outline { border: 1.5px solid var(--ink); padding: 13px 28px; border-radius: 100px; font-size: 14px; font-weight: 600; background: none; color: var(--ink); transition: all 0.2s; cursor: pointer; }
  .btn-outline:hover { background: var(--ink); color: var(--paper); }
  .btn-outline-clay { border: 1.5px solid var(--clay); padding: 13px 28px; border-radius: 100px; font-size: 14px; font-weight: 600; background: none; color: var(--clay); transition: all 0.2s; cursor: pointer; }
  .btn-outline-clay:hover { background: var(--clay); color: #fff; }

  /* FLOATING SOCIAL */
  .social-float {
    position: fixed; right: 0; top: 50%; transform: translateY(-50%);
    z-index: 200; display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
  }
  .social-float-item {
    display: flex; align-items: center; justify-content: flex-end;
    border-radius: 24px 0 0 24px;
    background: var(--clay);
    box-shadow: -2px 2px 12px rgba(0,0,0,0.15);
    height: 44px;
    cursor: pointer;
    text-decoration: none;
    color: #fff;
  }
  .social-float-label {
    display: inline-block;
    font-size: 13px; font-weight: 600; white-space: nowrap;
    max-width: 0; opacity: 0; overflow: hidden;
    transition: max-width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease 0.05s, padding-left 0.3s cubic-bezier(0.4,0,0.2,1);
    pointer-events: none;
  }
  .social-float-item:hover .social-float-label { max-width: 110px; opacity: 1; padding-left: 12px; }
  .social-float-icon {
    width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* NEWSLETTER */
  .newsletter { background: #232E29; padding: 80px 0; }
  .nl-inner { max-width: 560px; margin: 0 auto; text-align: center; }
  .nl-inner .eyebrow { color: rgba(247,243,238,0.38); margin-bottom: 20px; }
  .nl-inner h2 { font-family: 'Fraunces', serif; font-size: clamp(28px,3.5vw,44px); font-weight: 400; color: var(--paper); line-height: 1.15; margin: 18px 0 14px; }
  .nl-inner p { color: rgba(247,243,238,0.58); font-size: 16px; margin-bottom: 36px; }
  .nl-form { display: flex; gap: 10px; max-width: 440px; margin: 0 auto; }
  @media (max-width: 480px) { .nl-form { flex-direction: column; } }
  .nl-form input { flex-grow: 1; padding: 14px 20px; border-radius: 100px; border: 1px solid rgba(247,243,238,0.16); background: rgba(247,243,238,0.07); color: var(--paper); font-size: 14px; font-family: inherit; }
  .nl-form input::placeholder { color: rgba(247,243,238,0.28); }
  .nl-form input:focus { outline: 1px solid var(--clay); border-color: var(--clay); }
  .nl-done { color: rgba(247,243,238,0.7); font-size: 15px; margin-top: 16px; font-style: italic; }

  /* CONTACT */
  .contact-inner { max-width: 720px; margin: 0 auto; }
  .contact-intro { text-align: center; margin-bottom: 44px; }
  .contact-intro h2 { font-family: 'Fraunces', serif; font-size: clamp(28px,3.5vw,44px); font-weight: 400; line-height: 1.15; margin-top: 18px; }
  .contact-intro p { color: var(--sage); font-size: 17px; margin-top: 14px; line-height: 1.65; max-width: 520px; margin-left: auto; margin-right: auto; }
  .form-card { background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 44px; }
  @media (max-width: 600px) { .form-card { padding: 28px 22px; } }
  .field { margin-bottom: 20px; }
  .field label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
  .field input, .field textarea { width: 100%; padding: 13px 16px; border-radius: 5px; border: 1px solid var(--line); font-size: 15px; font-family: inherit; background: var(--paper); color: var(--ink); transition: border-color 0.2s; }
  .field input:focus, .field textarea:focus { border-color: var(--clay); outline: none; }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 520px) { .field-row { grid-template-columns: 1fr; } }
  .form-note { font-size: 13px; color: var(--sage); margin-top: 16px; }
  .submitted-msg { text-align: center; padding: 44px 0; }
  .submitted-msg h4 { font-family: 'Fraunces', serif; font-size: 22px; margin-bottom: 10px; }
  .submitted-msg p { color: var(--sage); font-size: 15px; }

  /* FOOTER */
  .footer { border-top: 1px solid var(--line); padding: 56px 0 32px; }
  .footer-inner { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 40px; margin-bottom: 48px; }
  .footer-logo { font-family: 'Fraunces', serif; font-size: 20px; display: block; margin-bottom: 12px; }
  .footer-brand p { font-size: 14px; color: var(--sage); max-width: 260px; line-height: 1.65; }
  .footer-cols { display: flex; gap: 56px; flex-wrap: wrap; }
  .footer-col h5 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--sage); margin-bottom: 16px; }
  .footer-col a { display: block; font-size: 14px; margin-bottom: 10px; color: var(--ink); opacity: 0.7; }
  .footer-col a:hover { opacity: 1; }
  .footer-bottom { display: flex; justify-content: space-between; padding-top: 24px; border-top: 1px solid var(--line); font-size: 13px; color: var(--sage); flex-wrap: wrap; gap: 10px; }
`;

const PARTNERS = "/Partner%20logos";
const DEFAULT_LOGOS = [
  // Row 1 — Highest credibility / immediate trust
  { name:"Indian Air Force",           src:`${PARTNERS}/Indian%20Air%20Force.png` },
  { name:"Western Digital",            src:`${PARTNERS}/Western%20Digital.png` },
  { name:"NetApp",                     src:`${PARTNERS}/netapp.jpg` },
  { name:"ITC Infotech",               src:`${PARTNERS}/ITC%20Infotech.png` },
  // Row 2 — Well-known Indian brands
  { name:"Swiggy",                     src:`${PARTNERS}/Swiggy.png` },
  { name:"Amul",                       src:`${PARTNERS}/Amul.png` },
  { name:"Indira IVF",                 src:`${PARTNERS}/Indira%20IVF.png` },
  { name:"Bajaj Consumer Care",        src:`${PARTNERS}/Bajaj%20consumer%20care.jpg` },
  // Row 3 — High-growth tech & startup ecosystem
  { name:"The Modern Data Company",    src:`${PARTNERS}/themoderndatacompany.jpg` },
  { name:"LetsTransport",              src:`${PARTNERS}/letstransport.png` },
  { name:"60 Decibels",                src:`${PARTNERS}/60%20decibels.png` },
  { name:"z21 Ventures",               src:`${PARTNERS}/z21%20ventures.png` },
  // Row 4 — Development & social impact
  { name:"Svatantra Microfinance",     src:`${PARTNERS}/Svatantra%20Microfinance.png` },
  { name:"United Way Bengaluru",       src:`${PARTNERS}/United%20Way%20Bengaluru.png` },
  { name:"Educational Initiatives (Ei)",src:`${PARTNERS}/Ei.png` },
  { name:"India Partner Network",      src:`${PARTNERS}/India%20Partner%20Network.png` },
];
const services = [
  { num:"01", title:"Executive Coaching", desc:"One-on-one work with founders, CXOs, and senior leaders navigating pivotal decisions, leadership transitions, and the quieter parts of leading that rarely show up on a scorecard.", for:"Senior leaders seeking a trusted sounding board rather than another framework." },
  { num:"02", title:"Leadership Development", desc:"Coaching, workshops, cohort experiences, and leadership journeys designed to help individuals and teams lead with greater clarity, resilience, and impact.", for:"Organizations investing in stronger leaders at every level." },
  { num:"03", title:"Startup Advisory", desc:"Strategic counsel for founders and leadership teams on people, culture, leadership, and the human side of scaling.", for:"Founders building the leadership and people foundations their company will grow upon." },
];
const DEFAULT_TESTIMONIALS = [
  { text:"Composed. Thoughtful. An extremely good listener. Action-oriented. He helped me unlock my blind spots and become significantly more self-aware as a leader.", name:"Sudarshan Ravi Jha", role:"Co-founder, z21 Ventures & LetsTransport", avatar:"/s.jpeg" },
  { text:"His frameworks on resilience and energy management offered practical, actionable insights. Our team continues to reference and apply them long after the session.", name:"Ritesh Agarwal", role:"VP, Educational Initiatives (Ei)", avatar:"/4.jpg" },
  { text:"He carries his skills lightly — humble, patient, always willing to listen. He challenges you to think differently without ever making you feel pushed.", name:"Neelacantan", role:"L&D Leader, Tekion", avatar:"/hero2.jpg" },
];
const DEFAULT_REFLECTIONS = [
  { cat:"Leadership & Workplace Culture", pub:"People Matters", title:"Gen Z Isn't the Problem — You Are", desc:"What the loudest critiques of a generation reveal about the people making them.", body:"What the loudest critiques of a generation reveal about the people making them. Leaders often externalize problems that are closer to home than they'd like to admit. The generational lens is a convenient distraction from the harder work of self-examination.", link:"" },
  { cat:"Career Paths & Professional Development", pub:"ETHRWorld", title:"Three Ways People Find Work They Truly Love", desc:"Most people are only taught one path. There are two others — and they're more reliable.", body:"Most people are only taught one path to fulfilling work: follow your passion. But passion is often discovered, not followed. There are two other paths — competence and contribution — that are more reliable and more honest about how careers actually unfold.", link:"" },
  { cat:"Personal Growth & Mindset", pub:"Blog", title:"Forget Self-Love — Self-Awareness Is the Real Superpower", desc:"Self-love is comforting. Self-awareness and accountability are what actually move you forward.", body:"Self-love is comforting. Self-awareness and accountability are what actually move you forward. The culture of self-love, while well-intentioned, has sometimes become an excuse to avoid the honest reckoning with our patterns, blind spots, and defaults.", link:"" },
  { cat:"Leadership & Workplace Culture", pub:"Blog", title:"The Leader Who Listens", desc:"Most leaders think they listen. Very few actually do — and the gap shows up everywhere.", body:"Most leaders think they listen. Very few actually do. Listening isn't silence; it's active presence. The gap between thinking you listen and actually listening shows up in team trust, in the quality of decisions, and in the culture you leave behind.", link:"" },
  { cat:"Career Paths & Professional Development", pub:"LinkedIn", title:"Why Your First Job Title Doesn't Define Your Career", desc:"The early years are for learning, not positioning. The obsession with titles gets in the way.", body:"The early years of a career are for learning, not positioning. The obsession with titles, levels, and perceived prestige gets in the way of the more important work: developing curiosity, building relationships, and figuring out what you're actually good at.", link:"" },
  { cat:"Personal Growth & Mindset", pub:"Blog", title:"On Stillness as a Leadership Practice", desc:"The most effective leaders I've worked with share one unusual habit: they protect their thinking time.", body:"The most effective leaders I've worked with share one unusual habit: they protect their thinking time fiercely. In a culture that rewards busyness, stillness is a radical act. It's also, I've found, one of the highest-leverage things a leader can do.", link:"" },
];
const creds = [
  { title:"TEDx Speaker",              sub:"",  logo:"/Partner%20logos/TEDx.png" },
  { title:"NASSCOM Startup Mentor",    sub:"",  logo:"/Partner%20logos/nasscom.png" },
  { title:"Certified Psychotherapist", sub:"",  logo:null, icon:"badge" },
  { title:"IRMA Alumnus",              sub:"",  logo:"/Partner%20logos/irma.png" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}${menuOpen ? " menu-active" : ""}`}>
      <a className="nav-logo" href="#" onClick={e => { e.preventDefault(); closeMenu(); window.scrollTo({top:0, behavior:"smooth"}); }}>
        <img src="/brown transparent .png" alt="Utsav Mishra" />
      </a>
      <div className="nav-links">
        <a href="#services">Work</a>
        <a href="#why">About</a>
        <a href="#reflections">Reflections</a>
        <a href="#contact">Contact</a>
      </div>
      <button className="nav-cta" onClick={() => { trackCTA("nav_start_conversation"); closeMenu(); document.getElementById("contact").scrollIntoView({behavior:"smooth"}); }}>Start a conversation</button>
      
      <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        {menuOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        )}
      </button>

      <div className={`nav-mobile-overlay${menuOpen ? " open" : ""}`}>
        <div className="nav-mobile-links">
          <a href="#services" onClick={closeMenu}>Work</a>
          <a href="#why" onClick={closeMenu}>About</a>
          <a href="#reflections" onClick={closeMenu}>Reflections</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          <button className="nav-mobile-cta" onClick={() => { trackCTA("nav_mobile_start_conversation"); closeMenu(); document.getElementById("contact").scrollIntoView({behavior:"smooth"}); }}>Start a conversation</button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <span className="section-eyebrow">UTSAV MISHRA</span>
        <p className="hero-tagline">A trusted sounding board for those who carry the weight of leadership.</p>
        <h1 className="hero-h1 serif">
          <span className="hero-h1-line">Executive Coach.</span>
          <span className="hero-h1-line">Leadership Advisor.</span>
          <span className="hero-h1-line">Speaker.</span>
        </h1>
        <p className="hero-body">Fifteen years across Amul, Swiggy, The/Nudge, and LetsTransport — now helping founders, CXOs, and leadership teams navigate the decisions that don't show up in a playbook.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => { trackCTA("hero_start_conversation"); document.getElementById("contact").scrollIntoView({behavior:"smooth"}); }}>
            Start a conversation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="btn-ghost" onClick={() => { trackCTA("hero_see_how_i_work"); document.getElementById("services").scrollIntoView({behavior:"smooth"}); }}>See how I work</button>
        </div>
      </div>
      <div className="hero-right">
        <img className="hero-portrait" src={HERO_IMG} alt="Utsav Mishra — Executive Coach and Leadership Advisor" />
      </div>
    </section>
  );
}

function Logos() {
  const logos = useSupabaseList(
    "partner_logos",
    (row) => ({ name: row.name, src: row.image_url }),
    DEFAULT_LOGOS
  );
  return (
    <section className="logos">
      <div className="wrap">
        <span className="section-eyebrow">Leaders &amp; Organizations Served</span>
        <div className="logos-row">
          {logos.map(l => (
            l.src
              ? <div className="logo-item" key={l.name}><img src={l.src} alt={l.name} /></div>
              : <div className="logo-pill" key={l.name}>{l.name}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <div className="section-head">
          <span className="section-eyebrow">How we might work together</span>
          <h2 className="serif">Three ways people usually reach out</h2>
          <p className="sub">Each is a different kind of engagement — pick the one that matches where you actually are.</p>
        </div>
        <div className="services-grid">
          {services.map(s => (
            <div className="svc" key={s.num}>
              <span className="svc-num serif">{s.num}</span>
              <h3 className="serif">{s.title}</h3>
              <p>{s.desc}</p>
              <div className="svc-for"><b>Best for:</b> {s.for}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhotoStrip({ src, alt, caption }) {
  return (
    <div className="photo-strip">
      <img src={src} alt={alt} />
      {caption && <span className="photo-caption">{caption}</span>}
    </div>
  );
}

function Testimonials() {
  const testimonials = useSupabaseList(
    "testimonials",
    (row) => ({ text: row.text, name: row.name, role: row.role, avatar: row.avatar_url }),
    DEFAULT_TESTIMONIALS
  );
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(null);

  const prev = () => setActive(a => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive(a => (a + 1) % testimonials.length);

  useEffect(() => {
    if (active >= testimonials.length) setActive(0);
  }, [testimonials, active]);

  useEffect(() => {
    if (paused || testimonials.length < 2) return;
    const id = setInterval(() => setActive(a => (a + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, [paused, testimonials.length]);

  const onTouchStart = e => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStart.current = null;
  };

  return (
    <section className="section-sm" style={{background:"var(--paper)"}}>
      <div className="wrap">
        <div className="section-head">
          <span className="section-eyebrow">What clients say</span>
          <h2 className="serif">Heard from the room</h2>
        </div>

        <div
          className="testi-carousel-pro"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="testi-track"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="testi-track-inner"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {testimonials.map((t,i) => (
                <div className="testi-slide" key={i}>
                  <div className="testi-pro-card">
                    <div className="testi-pro-left">
                      <img className="testi-pro-avatar" src={t.avatar} alt={t.name} />
                      <div>
                        <div className="testi-pro-name">{t.name}</div>
                        <div className="testi-pro-role">{t.role}</div>
                      </div>
                    </div>
                    <div className="testi-pro-right">
                      <div className="testi-pro-qmark serif">"</div>
                      <p className="testi-pro-text">{t.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="testi-controls">
            <button className="testi-arrow" onClick={prev} aria-label="Previous testimonial">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {testimonials.map((_,i) => (
              <button
                key={i}
                className={`testi-dot${i === active ? " active" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Show testimonial ${i+1}`}
              />
            ))}
            <button className="testi-arrow" onClick={next} aria-label="Next testimonial">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Why() {
  return (
    <section className="section-dark" id="why">
      <div className="wrap">
        <div className="why-inner">
          <div className="why-header">
            <span className="section-eyebrow">Why I do this work</span>
            <h2 className="serif">The Work That Found Me</h2>
          </div>
          <div className="why-photo">
            <img src="/Why%20I%20do%20this%20work.JPG" alt="Utsav at work" />
          </div>
          <div className="why-body">
            <p>When I was 22, I met Dr. Narendra Dabholkar, a man who dedicated his life to challenging blind faith in India.</p>
            <p>I remember asking him a question that I thought deserved a profound answer: "Why do you do what you do?"</p>
            <p>He smiled and said, "Mazaa aata hai" ("Because I enjoy doing it.")</p>
            <p>I remember feeling almost disappointed. Surely there had to be a bigger reason, a nobler purpose, a grand philosophy.</p>
            <p>But the older I've grown, the more I've realised how profound those few words really were. For a long time, I was too busy living life to understand them.</p>
            <p>Like many of us, I chased what seemed like the obvious things to chase — good opportunities, meaningful work, better roles, bigger responsibilities. Every experience taught me something, and I'm grateful for all of them. But somewhere in the background, that question kept returning.</p>
            <p>"What is it that gives me that kind of joy?"</p>
            <p>Looking back now, I don't think I found the answer. I think the answer found me.</p>
            <p>No matter where I worked, I found myself drawn to people. Their stories fascinated me. Why did two equally capable people respond so differently to the same setback? Why did some people come alive in their work while others slowly lost themselves? What helped one person grow while another stayed stuck?</p>
            <p>Those questions interested me far more than they probably should have. Over time, something unexpected happened.</p>
            <p>People started coming to me because they felt they could think more clearly after talking to me. Sometimes our conversations were about careers, sometimes about relationships, difficult decisions, or that vague feeling that something important was missing despite everything looking fine on paper.</p>
            <p>I rarely felt the need to have answers. More often than not, I found myself asking questions — the kind that make us pause. Those conversations taught me as much as they helped the other person.</p>
            <p>Every heartfelt "thank you," every message years later saying, "That conversation changed something for me," reminded me that there was something deeply meaningful about simply being present for another human being.</p>
            <p>And if I'm honest — I genuinely enjoy it, and that joy eventually became my work.</p>
            <p>Today, I work with founders, leaders and professionals who want success that doesn't come at the cost of themselves. People who care deeply about what they achieve, but also about who they become in the process.</p>
            <p>Over the years, I've realised that lasting growth is rarely about learning one more framework or finding another productivity hack. It usually begins with understanding ourselves a little more honestly.</p>
            <p>That's the spirit behind the WISE Framework (Will, Intensity, Synergy, Expertise) that guides my coaching. It's not a formula as much as it is a way of exploring the different dimensions of a meaningful life. Together, we make sense of what truly matters, notice where your energy is being drained, uncover the strengths that often go unnoticed, and build the capabilities needed to create the kind of impact you want to leave behind.</p>
            <p>Sixteen years have passed since that conversation, and today, I finally understand what Dr. Dabholkar meant.</p>
            <p>And with a smile, I find myself repeating the very words that stayed with me all these years: "Mazaa aata hai."</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CredIcon({ kind }) {
  if (kind === "tedx") return (
    <svg viewBox="0 0 120 56" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <text x="60" y="42" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="38" fontWeight="900" letterSpacing="-1" fill="#E62B1E">TED<tspan fontSize="22" baselineShift="super" dy="-6">x</tspan></text>
    </svg>
  );
  if (kind === "badge") return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="26" r="16" stroke="currentColor" strokeWidth="2.5" />
      <path d="M22 38l-4 18 14-8 14 8-4-18" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M25 26l5 5 9-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (kind === "laurel") return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M16 14c0 14 6 28 16 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M48 14c0 14-6 28-16 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 22c2 0 4-2 5-4M18 30c3 0 5-2 6-4M20 38c3 0 5-2 6-4M24 46c3 0 5-2 6-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 22c-2 0-4-2-5-4M46 30c-3 0-5-2-6-4M44 38c-3 0-5-2-6-4M40 46c-3 0-5-2-6-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <text x="32" y="36" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="16" fontWeight="500" fill="currentColor">IRMA</text>
    </svg>
  );
  return null;
}

function Credentials() {
  return (
    <section className="section-sand">
      <div className="wrap">
        <div className="creds-inner">
          {creds.map((c,i) => (
            <div className="cred" key={i}>
              <div className="cred-logo">
                {c.logo ? <img src={c.logo} alt={c.title} /> : <CredIcon kind={c.icon} />}
              </div>
              <div className="cred-title serif">{c.title}</div>
              <div className="cred-sub">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reflections({ onOpenArticle, onReadAll }) {
  const reflections = useSupabaseList(
    "reflections",
    (row) => ({
      cat: row.category, pub: row.publication, title: row.title, desc: row.description,
      body: row.body || row.description, link: row.link,
      isFavourite: !!row.is_favourite, favouritedAt: row.favourited_at, displayOrder: row.display_order ?? 0,
    }),
    DEFAULT_REFLECTIONS
  );
  // Favourited pieces take the 6 homepage slots first, most-recently-favourited
  // first (so favouriting a 7th bumps the oldest favourite off, not the newest).
  // Any remaining slots fall back to normal display_order.
  const favourites = reflections
    .filter(r => r.isFavourite)
    .sort((a, b) => new Date(b.favouritedAt || 0) - new Date(a.favouritedAt || 0));
  const rest = reflections
    .filter(r => !r.isFavourite)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const shown = [...favourites, ...rest].slice(0, 6);
  return (
    <section className="section" id="reflections">
      <div className="wrap">
        <div className="section-head" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16}}>
          <div>
            <span className="section-eyebrow">Reflections</span>
            <h2 className="serif">Writing, mostly to make sense of things.</h2>
            <p className="sub">Shared in case it's useful — selective pieces on leadership, career, and growth.</p>
          </div>
        </div>
        <div className="ref-grid">
          {shown.map((r,i) => (
            <div className="ref-card" key={i} onClick={() => { trackCTA("reflection_open"); onOpenArticle(r); }} role="button" tabIndex={0} onKeyDown={e => e.key==="Enter" && onOpenArticle(r)}>
              <span className="ref-cat">{r.cat}</span>
              <h4 className="serif">{r.title}</h4>
              <p>{r.desc}</p>
              <span className="ref-pub">{r.pub}</span>
            </div>
          ))}
        </div>
        <div className="ref-cta">
          <button className="btn-outline" onClick={() => { trackCTA("reflections_read_all"); onReadAll(); }}>Read all reflections</button>
          <button className="btn-outline-clay" onClick={() => { trackCTA("reflections_receive_by_email"); document.getElementById("newsletter").scrollIntoView({behavior:"smooth"}); }}>
            Receive Reflections by email
          </button>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async e => {
    e.preventDefault();
    if (!email) return;
    setSaving(true); setErr("");
    const { error } = await supabase.from("subscribers").insert({ email });
    setSaving(false);
    if (error && !error.message.includes("duplicate")) { setErr("Something went wrong — please try again."); return; }
    trackCTA("newsletter_subscribe");
    setDone(true);
  };

  return (
    <section className="newsletter" id="newsletter">
      <div className="wrap">
        <div className="nl-inner">
          <span className="section-eyebrow">Reflections by email</span>
          <h2 className="serif">A note every few weeks.</h2>
          <p>On leadership, work, growth, and the questions I'm still trying to answer. No pitch, no automation — just the writing.</p>
          {done ? (
            <p className="nl-done">You're in — I'll be in touch soon.</p>
          ) : (
            <>
              {err && <p className="nl-done" style={{color:"#B3261E"}}>{err}</p>}
              <form className="nl-form" onSubmit={onSubmit}>
                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Receive Reflections"}</button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", focus:"" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const set = e => setForm({...form, [e.target.name]: e.target.value});

  const onSubmit = async e => {
    e.preventDefault();
    if (!(form.name && form.email)) return;
    setSending(true);
    setError("");
    const { error } = await supabase.from("leads").insert({
      name: form.name, email: form.email, phone: form.phone, message: form.focus,
    });
    setSending(false);
    if (error) { setError("Something went wrong — please try again or email directly."); return; }
    trackCTA("contact_form_submit");
    setSent(true);
  };

  return (
    <section className="section" id="contact">
      <div className="wrap">
        <div className="contact-inner">
          <div className="contact-intro">
            <span className="section-eyebrow">Get in touch</span>
            <h2 className="serif">Tell me a little about where you are.</h2>
            <p>No form designed to qualify you — just a short note on what's on your mind. I read every message personally.</p>
          </div>
          <div className="form-card">
            {sent ? (
              <div className="submitted-msg">
                <h4 className="serif">Thank you, {form.name.split(" ")[0]}.</h4>
                <p>Your message has been received. Utsav reads these personally and will be in touch if there's a fit.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                {error && <p className="form-note" style={{color:"#B3261E"}}>{error}</p>}
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="f-name">Full name</label>
                    <input id="f-name" name="name" type="text" value={form.name} onChange={set} required />
                  </div>
                  <div className="field">
                    <label htmlFor="f-phone">Phone / WhatsApp</label>
                    <input id="f-phone" name="phone" type="tel" value={form.phone} onChange={set} placeholder="+91 ..." />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="f-email">Email address</label>
                  <input id="f-email" name="email" type="email" value={form.email} onChange={set} required />
                </div>
                <div className="field">
                  <label htmlFor="f-focus">What's on your mind?</label>
                  <textarea id="f-focus" name="focus" rows={4} placeholder="A line or two on what you're navigating right now." value={form.focus} onChange={set} />
                </div>
                <button type="submit" className="btn-primary" style={{width:"100%",justifyContent:"center"}} disabled={sending}>
                  {sending ? "Sending…" : "Send"}
                </button>
                <p className="form-note">No automated follow-ups. Just a personal reply.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo serif">Utsav Mishra</span>
            <p>Helping leaders navigate purpose, clarity, and peak performance — one honest conversation at a time.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h5>Navigate</h5>
              <a href="#services">Work</a>
              <a href="#why">About</a>
              <a href="#reflections">Reflections</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-col">
              <h5>Presence</h5>
              <a href="https://www.linkedin.com/in/utsmis/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://www.instagram.com/getrealwithutsav" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Utsav Mishra</span>
          <span>Bengaluru, India</span>
        </div>
      </div>
    </footer>
  );
}

function SocialFloat() {
  return (
    <div className="social-float">
      <a className="social-float-item" href="https://www.linkedin.com/in/utsmis/" target="_blank" rel="noreferrer" aria-label="LinkedIn" onClick={() => trackCTA("social_linkedin")}>
        <span className="social-float-label">LinkedIn</span>
        <span className="social-float-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
        </span>
      </a>
      <a className="social-float-item" href="https://www.instagram.com/getrealwithutsav" target="_blank" rel="noreferrer" aria-label="Instagram" onClick={() => trackCTA("social_instagram")}>
        <span className="social-float-label">Instagram</span>
        <span className="social-float-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </span>
      </a>
    </div>
  );
}

const SITE_TITLE = "Utsav Mishra — Executive Coach, Leadership Advisor & Speaker";

function resolveRoute() {
  const path = window.location.pathname;
  const articleMatch = path.match(/^\/reflections\/([^/]+)\/?$/);
  if (articleMatch) return { page: "article", slug: decodeURIComponent(articleMatch[1]) };
  if (path === "/reflections" || path === "/reflections/") return { page: "all-reflections", slug: null };
  return { page: "home", slug: null };
}

export default function UtsavHome() {
  // Fetched here (in addition to Reflections()/ReflectionsAllPage's own fetches)
  // so a direct visit to /reflections/:slug can resolve which article that is
  // before the user has clicked anything.
  const allReflections = useSupabaseList(
    "reflections",
    (row) => ({
      cat: row.category, pub: row.publication, title: row.title, desc: row.description,
      body: row.body || row.description, link: row.link,
    }),
    DEFAULT_REFLECTIONS
  );

  const [route, setRoute] = useState(resolveRoute);
  const { page, slug } = route;
  const activeArticle = page === "article"
    ? allReflections.find(r => slugify(r.title) === slug) || null
    : null;

  const navigate = (path, next) => {
    window.history.pushState(null, "", path);
    setRoute(next);
    window.scrollTo(0, 0);
  };
  const goHome = () => navigate("/", { page: "home", slug: null });
  const goAllReflections = () => navigate("/reflections", { page: "all-reflections", slug: null });
  const goArticle = (article) => navigate(`/reflections/${slugify(article.title)}`, { page: "article", slug: slugify(article.title) });

  useEffect(() => {
    const onPopState = () => setRoute(resolveRoute());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    trackPageView();
    return initScrollTracking();
  }, [page]);

  useEffect(() => {
    if (page === "article") document.title = activeArticle ? `${activeArticle.title} — Utsav Mishra` : SITE_TITLE;
    else if (page === "all-reflections") document.title = `Reflections — Utsav Mishra`;
    else document.title = SITE_TITLE;
  }, [page, activeArticle]);

  if (page === "article") {
    if (!activeArticle) return <div style={{minHeight:"60vh"}} />;
    return <ReflectionArticlePage article={activeArticle} onBack={goAllReflections} />;
  }
  if (page === "all-reflections") {
    return <ReflectionsAllPage onBack={goHome} onOpenArticle={goArticle} />;
  }

  return (
    <div className="um">
      <style>{css}</style>
      <Nav />
      <Hero />
      <Logos />
      <Services />
      <PhotoStrip
        src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop"
        alt="Leadership workshop facilitation"
      />
      <Testimonials />
      <Why />
      <Credentials />
      <PhotoStrip
        src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1600&auto=format&fit=crop"
        alt="Speaking at TEDx"
      />
      <Reflections
        onOpenArticle={goArticle}
        onReadAll={goAllReflections}
      />
      <Newsletter />
      <Contact />
      <Footer />
      <SocialFloat />
    </div>
  );
}
