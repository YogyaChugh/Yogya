import { useEffect, useMemo, useRef, useState } from "react";

/* ──────────── CONTENT ──────────── */

const NAV = [
  { id: "cover", label: "Home" },
  { id: "feature", label: "About" },
  { id: "kit", label: "Stack" },
  { id: "ledger", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "trophies", label: "Awards" },
  { id: "desk", label: "Writing" },
  { id: "outro", label: "Contact" },
];

type Project = {
  name: string;
  blurb: string;
  tags: string[];
  href: string;
  year: string;
  featured?: boolean;
  big?: boolean;
  art: { from: string; via: string; to: string; emoji: string };
};

const PROJECTS: Project[] = [
  {
    name: "AnyStudio",
    blurb:
      "A native desktop IDE in Rust + egui that builds Android apps via a direct DEX pipeline. We wrote the classes.dex by hand and skipped the JDK entirely.",
    tags: ["Rust", "egui", "Android", "Compilers"],
    href: "https://github.com/YogyaChugh",
    year: "2026",
    featured: true,
    big: true,
    art: { from: "#c4b5fd", via: "#818cf8", to: "#67e8f9", emoji: "🛠" },
  },
  {
    name: "Webelo",
    blurb:
      "C++ DOM library + HTML visualiser that strictly follows the WhatWG DOM Standard. Foundation for a real browser engine.",
    tags: ["C++", "WhatWG", "Browser"],
    href: "https://github.com/YogyaChugh/Webelo",
    year: "2025",
    featured: true,
    art: { from: "#a5f3fc", via: "#67e8f9", to: "#818cf8", emoji: "🌐" },
  },
  {
    name: "Vardhman Saathi",
    blurb:
      "Shipped business suite for a real client. Hono API · Supabase · R2 · React Native. Runs the whole stack on ~$7/month.",
    tags: ["TypeScript", "Hono", "React Native"],
    href: "https://vardhmansaathi.shop",
    year: "2026",
    featured: true,
    art: { from: "#67e8f9", via: "#a5f3fc", to: "#c4b5fd", emoji: "📦" },
  },
  {
    name: "AgroLens",
    blurb:
      "Computer-vision model classifying plant-leaf diseases. Dataset pipeline, training, deployment — team build.",
    tags: ["Python", "PyTorch", "CV"],
    href: "https://github.com/YogyaChughCoder/AgroLens",
    year: "2024",
    art: { from: "#86efac", via: "#67e8f9", to: "#a5f3fc", emoji: "🌿" },
  },
  {
    name: "Snake Hustle",
    blurb: "Browser snake. The OG obsession. Click to play, get yelled at by your own high score.",
    tags: ["Game", "Web"],
    href: "https://snakehustle.netlify.app",
    year: "2024",
    art: { from: "#c4b5fd", via: "#818cf8", to: "#a5f3fc", emoji: "🐍" },
  },
  {
    name: "Timberly",
    blurb: "Casual lumberjack game — plays in-browser, downloads for Win/macOS/Linux/Android.",
    tags: ["Game", "C++"],
    href: "https://yogya-chugh.itch.io/timberly",
    year: "2024",
    art: { from: "#fcd34d", via: "#c4b5fd", to: "#67e8f9", emoji: "🪓" },
  },
  {
    name: "Webber",
    blurb: "Desktop crawler that downloads any website for offline rendering. Pygame + PyWebview + BS4.",
    tags: ["Python", "Crawler"],
    href: "https://github.com/YogyaChugh/Webber",
    year: "2023",
    art: { from: "#a5f3fc", via: "#c4b5fd", to: "#818cf8", emoji: "🕸" },
  },
  {
    name: "SIH Travel Security",
    blurb: "Blockchain system for encrypted tourist tracking with SSO to local authorities. Cleared SIH internals twice.",
    tags: ["Blockchain", "Team"],
    href: "https://github.com/YogyaChugh",
    year: "2024",
    art: { from: "#818cf8", via: "#c4b5fd", to: "#67e8f9", emoji: "🛡" },
  },
  {
    name: "Django · Open Source",
    blurb: "Merged PRs into Django core + third-party libraries. Open-source compounder.",
    tags: ["Python", "OSS"],
    href: "https://github.com/YogyaChugh/django",
    year: "2024",
    art: { from: "#a5f3fc", via: "#67e8f9", to: "#c4b5fd", emoji: "🦄" },
  },
];

const STACK = {
  Languages: ["C++", "Python", "TypeScript", "Rust", "C", "SQL"],
  Backend: ["Hono", "Node.js", "FastAPI", "Django", "Flask"],
  Apps: ["React Native", "Electron", "egui"],
  Cloud: ["Supabase", "Postgres", "Cloudflare R2", "Firebase", "Render"],
  AI: ["PyTorch", "TensorFlow", "HuggingFace", "Rasa"],
  CS: ["DSA", "OOP", "Networks", "DBMS", "Compilers"],
};

const WORK = [
  {
    role: "Freelance Software Developer",
    org: "Mobile App Client",
    when: "Jun '26 — Now",
    body: "Shipping a cross-platform iOS + Android app end-to-end. Supabase auth (Google + Apple), DB, the whole pipeline.",
    tag: "current",
  },
  {
    role: "Freelance Software Developer",
    org: "Vardhman Electricals",
    when: "Nov '25 — Jun '26",
    body: "TS + Hono REST API on Render with Google OAuth, SSE notifications, Firebase Admin SDK, React Native Android app. Engineered to run for ~$7/mo. Live at vardhmansaathi.shop.",
    tag: "live",
  },
  {
    role: "Independent Developer",
    org: "Hack Club — Summer of Making · GitHub-sponsored",
    when: "Summer '25",
    body: "Top tier on the global leaderboard. 450+ tracked hours across 4+ shipped OSS projects in 3 months. Won a $1,649 laptop (RTX 5070 · 32 GB · Ryzen AI 7).",
    tag: "prize",
  },
  {
    role: "Software Developer Intern",
    org: "Byteoski Developers (OPC) Pvt. Ltd.",
    when: "Summer '24",
    body: "Completed a software development internship; received a formal completion certificate.",
    tag: "intern",
  },
];

const WINS = [
  { k: "3rd", v: "Cyber AI Hackathon 2025 · University of Derby, UK" },
  { k: "3rd", v: "Agentic AI Hackathon 2025 · Ulster University, UK" },
  { k: "$1,649", v: "Laptop prize · Hack Club Summer of Making" },
  { k: "OSS", v: "Merged PRs into Django core + ecosystem" },
  { k: "SIH × 2", v: "Internal-round qualifier · 2024 & 2025" },
  { k: "8.38", v: "Current CGPA · zero academic backlogs" },
  { k: "President", v: "Technical Club — ran Frontend Frenzy" },
];

const POSTS = [
  {
    t: "Writing classes.dex by hand from Rust",
    d: "Why AnyStudio skips the JDK entirely and what the DEX format actually looks like up close.",
  },
  {
    t: "Implementing the WhatWG DOM in C++",
    d: "Preorder DFS, event dispatch, and the parts of the spec nobody warns you about.",
  },
  {
    t: "Running a real product on $7/month",
    d: "How Vardhman Saathi stays on free tiers using Supabase + R2 + Render.",
  },
  {
    t: "450 hours, 4 ships, one laptop",
    d: "Lessons from Hack Club Summer of Making, where I top-ranked the global leaderboard.",
  },
];

const TICKER = [
  "✸ Available for SDE internships ✸",
  "B.Tech CSE · class of 2027",
  "Delhi, India",
  "5+ years in C++ / Python / TypeScript",
  "Now: Rust IDE + C++ browser engine",
  "Open-source: Django contributor",
  "Top-ranked · Hack Club Summer of Making",
  "✦ press ⌘K anywhere ✦",
];

/* ──────────── MAIN ──────────── */

export function SiteMagazine() {
  return (
    <div className="grain relative min-h-screen overflow-x-hidden bg-paper text-ink">
      <Backdrop />
      <Cursor />
      <CommandPalette />
      <TopBar />

      <Cover />
      <Ticker />
      <Feature />
      <Kit />
      <Ledger />
      <Projects />
      <Trophies />
      <Desk />
      <Outro />
      <Colophon />
    </div>
  );
}

/* ──────────── BACKDROP ──────────── */

function Backdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          backgroundImage:
            "radial-gradient(1200px 700px at 12% -5%, oklch(0.92 0.08 300 / 0.65), transparent 60%), radial-gradient(1100px 700px at 110% 30%, oklch(0.92 0.1 200 / 0.55), transparent 60%), radial-gradient(900px 600px at 0% 110%, oklch(0.94 0.06 215 / 0.6), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.85 0.04 280 / 0.35) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.85 0.04 280 / 0.2) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
    </>
  );
}

/* ──────────── CUSTOM CURSOR ──────────── */

function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let x = 0,
      y = 0,
      rx = 0,
      ry = 0,
      raf = 0;
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Hide on touch / small screens
  return (
    <div className="pointer-events-none fixed inset-0 z-[200] hidden md:block">
      <div
        ref={dotRef}
        className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full bg-ink mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="absolute -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-ink/40"
      />
    </div>
  );
}

/* ──────────── TOP BAR ──────────── */

function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <a
          href="#cover"
          data-cursor="top"
          className="flex items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-3 py-1.5 backdrop-blur-md"
        >
          <span className="block h-2.5 w-2.5 rounded-full bg-chrome" />
          <span className="font-display text-[12px] uppercase tracking-[0.22em]">
            yogya · the magazine
          </span>
        </a>
        {/* Desktop nav */}
        <nav className="hidden items-center gap-0 rounded-full border border-ink/15 bg-white/70 p-1 backdrop-blur-md md:flex">
          {NAV.map(n => (
            <a
              key={n.id}
              href={`#${n.id}`}
              data-cursor="jump"
              className="font-display rounded-full px-3 py-1.5 text-[12px] uppercase tracking-[0.18em] text-ink/70 transition-colors hover:bg-ink hover:text-paper"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            data-cursor="⌘K"
            onClick={() => window.dispatchEvent(new Event("yc:openPalette"))}
            className="flex items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-3 py-1.5 backdrop-blur-md"
          >
            <span className="font-display text-[12px] uppercase tracking-[0.18em]">Search</span>
            <kbd className="font-mono hidden rounded border border-ink/20 bg-paper px-1.5 py-0.5 text-[10px] md:inline">
              ⌘K
            </kbd>
          </button>
          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white/70 backdrop-blur-md md:hidden"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className="font-display text-[18px] leading-none">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mx-4 mt-1 overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-lg md:hidden" style={{ boxShadow: "var(--shadow-hard)" }}>
          <nav className="flex flex-col p-2">
            {NAV.map(n => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => setMenuOpen(false)}
                className="font-display rounded-xl px-4 py-3 text-[13px] uppercase tracking-[0.18em] text-ink/80 transition-colors hover:bg-ink hover:text-paper"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

/* ──────────── COMMAND PALETTE ──────────── */

function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("yc:openPalette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("yc:openPalette", onOpen);
    };
  }, []);

  const items = useMemo(() => {
    const base: { kind: string; label: string; href: string; ext?: boolean }[] = [
      ...NAV.map(n => ({ kind: "Jump", label: n.label, href: `#${n.id}` })),
      ...PROJECTS.map(p => ({ kind: "Project", label: p.name, href: p.href, ext: true })),
      { kind: "Link", label: "GitHub", href: "https://github.com/YogyaChugh", ext: true },
      { kind: "Link", label: "LinkedIn", href: "https://linkedin.com/in/yogyachugh", ext: true },
      { kind: "Link", label: "Email · yogya.developer@gmail.com", href: "mailto:yogya.developer@gmail.com" },
      { kind: "Link", label: "Phone · +91 96500 29959", href: "tel:+919650029959" },
    ];
    const f = q.trim().toLowerCase();
    if (!f) return base;
    return base.filter(i => i.label.toLowerCase().includes(f) || i.kind.toLowerCase().includes(f));
  }, [q]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center bg-ink/30 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="mt-[14vh] w-[min(620px,92vw)] overflow-hidden rounded-2xl border-2 border-ink bg-paper"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: "var(--shadow-hard)" }}
      >
        <div className="flex items-center gap-3 border-b-2 border-ink px-4 py-3">
          <span className="font-display text-[12px] uppercase tracking-[0.18em] text-ink/60">⌘K</span>
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search the magazine — sections, projects, links…"
            className="font-body w-full bg-transparent text-[15px] outline-none"
          />
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {items.length === 0 && (
            <li className="px-3 py-3 text-sm text-ink/50">No matches. Try “rust”, “django”, or “contact”.</li>
          )}
          {items.map((i, idx) => (
            <li key={idx}>
              <a
                href={i.href}
                target={i.ext ? "_blank" : undefined}
                rel={i.ext ? "noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-ink hover:text-paper"
              >
                <span className="font-display w-20 text-[10px] uppercase tracking-[0.18em] text-ink/50 group-hover:text-paper/70">
                  {i.kind}
                </span>
                <span className="font-body flex-1 text-[14px]">{i.label}</span>
                <span className="font-mono text-[11px] opacity-60">↵</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ──────────── COVER (HERO) ──────────── */

function Cover() {
  return (
    <section id="cover" className="relative px-4 pb-10 pt-28 md:px-8 md:pt-32">
      <div className="mx-auto max-w-[1400px]">
        {/* Masthead strip */}
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-3">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-[12px] uppercase tracking-[0.22em] text-ink/60">Issue Nº 27</span>
            <span className="font-display text-[12px] uppercase tracking-[0.22em] text-ink/60">·</span>
            <span className="font-display text-[12px] uppercase tracking-[0.22em] text-ink/60">B.Tech Edition</span>
            <span className="font-display text-[12px] uppercase tracking-[0.22em] text-ink/60">·</span>
            <span className="font-display text-[12px] uppercase tracking-[0.22em] text-ink/60">Delhi → Earth</span>
          </div>
          <div className="flex items-center gap-2">
            <Pill color="lavender">B.Tech CSE · 2027</Pill>
            <Pill color="cyan">Open for SDE internships</Pill>
          </div>
        </div>

        {/* Big name */}
        <div className="relative grid grid-cols-12 gap-4 pt-6 md:pt-10">
          <div className="col-span-12 lg:col-span-8">
            <h1 className="font-display leading-[0.82] tracking-tight">
              <span className="block text-[clamp(4rem,16vw,12rem)]">YOGYA</span>
              <span className="block text-[clamp(4rem,16vw,12rem)] text-chrome">CHUGH.</span>
            </h1>
            <p className="font-body mt-6 max-w-xl text-[18px] leading-[1.4] text-ink/80">
              <span className="font-display text-[14px] uppercase tracking-[0.2em] text-ink">Developer</span>
              <span className="mx-2 text-ink/30">/</span>
              <span className="font-display text-[14px] uppercase tracking-[0.2em] text-ink">Builder</span>
              <span className="mx-2 text-ink/30">/</span>
              <span className="font-display text-[14px] uppercase tracking-[0.2em] text-ink">Open-source kid</span>
              <br />
              <span className="mt-3 block text-[18px] leading-[1.5]">
                Five years deep in C++, Python, TypeScript and Rust. Right now: a native Rust IDE for Android,
                a C++ browser engine, and software that real clients pay for.
              </span>
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <Magnetic>
                <a
                  href="#projects"
                  data-cursor="see work"
                  className="font-display group inline-flex items-center gap-3 rounded-full border-2 border-ink bg-ink px-6 py-3 text-paper uppercase tracking-[0.22em]"
                  style={{ boxShadow: "var(--shadow-hard)" }}
                >
                  <span>See the work</span>
                  <span className="inline-block transition-transform group-hover:translate-x-1">↘</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="mailto:yogya.developer@gmail.com"
                  data-cursor="email"
                  className="font-display inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-6 py-3 uppercase tracking-[0.22em]"
                >
                  Hire me
                </a>
              </Magnetic>
              <a
                href="https://github.com/YogyaChugh"
                target="_blank"
                rel="noreferrer"
                data-cursor="github"
                className="font-display text-[12px] uppercase tracking-[0.22em] text-ink/60 underline-offset-4 hover:underline"
              >
                github · linkedin · resume ↗
              </a>
            </div>
          </div>

          {/* Right sticker stack */}
          <div className="col-span-12 mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-4 lg:mt-0 lg:grid-cols-2 lg:gap-4">
            <Sticker tone="lavender" tilt="-3deg">
              <div className="font-display text-[44px] leading-none">5+</div>
              <div className="font-display mt-1 text-[10px] uppercase tracking-[0.18em] text-ink/70">years coding</div>
            </Sticker>
            <Sticker tone="cyan" tilt="2deg">
              <div className="font-display text-[44px] leading-none">8.38</div>
              <div className="font-display mt-1 text-[10px] uppercase tracking-[0.18em] text-ink/70">cur. CGPA</div>
            </Sticker>
            <Sticker tone="sky" tilt="2deg">
              <div className="font-display text-[44px] leading-none">450h</div>
              <div className="font-display mt-1 text-[10px] uppercase tracking-[0.18em] text-ink/70">summer of making</div>
            </Sticker>
            <Sticker tone="indigo" tilt="-2deg" dark>
              <div className="font-display text-[36px] leading-none text-paper">$1,649</div>
              <div className="font-display mt-1 text-[10px] uppercase tracking-[0.18em] text-paper/80">laptop prize · 2025</div>
            </Sticker>
            <div className="col-span-2 flex items-center justify-center">
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────── TICKER ──────────── */

function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="relative my-6 overflow-hidden border-y-2 border-ink bg-ink py-3 text-paper">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((t, i) => (
          <span key={i} className="font-display mx-6 text-[18px] uppercase tracking-[0.22em]">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ──────────── FEATURE (ABOUT) ──────────── */

function Feature() {
  return (
    <section id="feature" className="relative px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-4">
          <div className="sticky top-28">
            <Eyebrow>About</Eyebrow>
            <h2 className="font-display mt-3 text-[clamp(2.4rem,5vw,4rem)] leading-[0.95]">
              Built<br />in <span className="text-chrome">public.</span>
            </h2>
            <div className="font-display mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em]">
              <Pill color="cyan">essay</Pill>
              <Pill color="lavender">background</Pill>
              <Pill color="sky">06 min read</Pill>
            </div>
          </div>
        </aside>

        <article className="col-span-12 columns-1 gap-8 text-[17px] leading-[1.55] text-ink/85 md:columns-2 lg:col-span-8">
          <p className="mb-4">
            <span className="font-display float-left mr-3 text-[80px] leading-[0.8] text-chrome">I</span>
            started writing software in high school because the games I wanted didn&rsquo;t exist yet — so I made
            crude ones. Five years later that habit grew teeth: I&rsquo;m writing a Rust IDE that emits
            <em> classes.dex</em> by hand, a C++ DOM that follows the WhatWG spec to the letter, and the kind of
            client software where someone actually depends on the uptime.
          </p>
          <p className="mb-4">
            Most of what I&rsquo;ve learned came from shipping. Hack Club&rsquo;s Summer of Making put 450 hours on
            the clock in three months — four open-source projects out the door, a laptop on the desk. The
            international hackathons at Derby and Ulster taught me that 36 hours is enough to do something real
            with a small team if you stop arguing about frameworks.
          </p>
          <p className="mb-4">
            I&rsquo;m in my 3rd year of B.Tech CSE in Delhi (CGPA 8.38, zero backlogs, two semesters left). I read
            specs for fun, I lose at online chess, and I keep building games I have no business playing.
          </p>
          <p className="mb-0 text-ink">
            Looking for an SDE internship where I can write a lot of code that ships and learn from people who
            care about craft. <span className="font-display uppercase tracking-[0.18em]">↳ Hit ⌘K to say hi.</span>
          </p>
        </article>
      </div>
    </section>
  );
}

/* ──────────── KIT (STACK) ──────────── */

function Kit() {
  return (
    <section id="kit" className="relative px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
          <div>
            <Eyebrow>Stack</Eyebrow>
            <h2 className="font-display mt-2 text-[clamp(2.4rem,5vw,4rem)] leading-[0.95]">
              Tools I actually reach for.
            </h2>
          </div>
          <p className="font-body max-w-md text-[14px] text-ink/70">
            CS fundamentals first; frameworks second. New ones get added when the project demands it — not before.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-3">
          {Object.entries(STACK).map(([group, items], idx) => (
            <div
              key={group}
              data-cursor="kit"
              className={`col-span-12 rounded-3xl border-2 border-ink bg-white p-5 transition-transform hover:-translate-y-1 sm:col-span-6 lg:col-span-4 ${idx % 2 === 0 ? "tilt-l" : "tilt-r"}`}
              style={{ boxShadow: "var(--shadow-hard)" }}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-[22px] uppercase tracking-wide">{group}</h3>
                <span className="font-mono text-[11px] text-ink/50">{String(idx + 1).padStart(2, "0")}/06</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {items.map(i => (
                  <span
                    key={i}
                    className="font-display rounded-full border border-ink/25 bg-paper px-2.5 py-1 text-[12px] uppercase tracking-[0.12em]"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────── LEDGER (WORK) ──────────── */

function Ledger() {
  return (
    <section id="ledger" className="relative px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-4">
          <div>
            <Eyebrow>Experience</Eyebrow>
            <h2 className="font-display mt-2 text-[clamp(2.4rem,5vw,4rem)] leading-[0.95]">
              Work that <span className="text-chrome">shipped.</span>
            </h2>
          </div>
          <span className="font-mono text-[12px] text-ink/60">04 entries · most recent first</span>
        </div>

        <ol className="mt-8 divide-y-2 divide-ink border-b-2 border-ink">
          {WORK.map((w, i) => (
            <li
              key={w.role + w.org}
              data-cursor="entry"
              className="group grid grid-cols-12 items-baseline gap-4 py-6 transition-colors hover:bg-white"
            >
              <span className="font-display col-span-2 hidden text-[14px] uppercase tracking-[0.18em] text-ink/50 md:block">
                №{String(WORK.length - i).padStart(2, "0")}
              </span>
              <div className="col-span-12 md:col-span-6">
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight">
                  {w.role}
                </h3>
                <p className="font-body text-[14px] uppercase tracking-[0.18em] text-ink/70">{w.org}</p>
                <p className="font-body mt-3 max-w-2xl text-[15px] leading-[1.5] text-ink/85">
                  {w.body}
                </p>
              </div>
              <div className="col-span-12 flex items-center gap-2 md:col-span-4 md:justify-end">
                <Pill color={i === 0 ? "lime" : i === 2 ? "hot" : "lavender"}>{w.tag}</Pill>
                <span className="font-display text-[14px] uppercase tracking-[0.18em] text-ink/70">{w.when}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ──────────── PROJECTS ──────────── */

function Projects() {
  return (
    <section id="projects" className="relative px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-4">
          <div>
            <Eyebrow>Projects</Eyebrow>
            <h2 className="font-display mt-2 text-[clamp(2.4rem,5vw,4rem)] leading-[0.95]">
              Things I built<br />on purpose.
            </h2>
          </div>
          <a
            href="https://github.com/YogyaChugh"
            target="_blank"
            rel="noreferrer"
            data-cursor="github"
            className="font-display rounded-full border-2 border-ink bg-paper px-4 py-2 text-[12px] uppercase tracking-[0.22em] hover:bg-ink hover:text-paper"
          >
            All on GitHub ↗
          </a>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-4">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.name} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const [hover, setHover] = useState(false);
  // Magazine layout: big featured spans 7, others vary
  const span = p.big
    ? "col-span-12 lg:col-span-8 lg:row-span-2"
    : p.featured
      ? "col-span-12 md:col-span-6 lg:col-span-4"
      : "col-span-12 sm:col-span-6 lg:col-span-4";
  const tall = p.big ? "min-h-[340px] md:min-h-[480px]" : "min-h-[220px] md:min-h-[260px]";
  return (
    <a
      href={p.href}
      target="_blank"
      rel="noreferrer"
      data-cursor="open"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`group relative overflow-hidden rounded-3xl border-2 border-ink bg-white transition-transform hover:-translate-y-1 ${span} ${tall}`}
      style={{ boxShadow: "var(--shadow-hard)" }}
    >
      {/* Art layer */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${p.art.from} 0%, ${p.art.via} 50%, ${p.art.to} 100%)`,
          opacity: hover ? 1 : 0.18,
        }}
      />
      {/* Giant index */}
      <div
        aria-hidden
        className="font-display absolute -right-3 -top-6 select-none text-[180px] leading-none text-ink/10 transition-opacity duration-300"
        style={{ opacity: hover ? 0.18 : 0.08 }}
      >
        {String(i + 1).padStart(2, "0")}
      </div>
      {/* Big emoji on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-[140px] transition-all duration-500"
        style={{
          opacity: hover ? 0.45 : 0,
          transform: `scale(${hover ? 1 : 0.6}) rotate(${hover ? "-6deg" : "0deg"})`,
        }}
      >
        {p.art.emoji}
      </div>
      {/* Content */}
      <div className="relative flex h-full flex-col justify-between p-6 md:p-7">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-display text-[11px] uppercase tracking-[0.22em] text-ink/60">
              Project · {p.year}
            </span>
            {p.featured && <Pill color="lavender">featured</Pill>}
          </div>
          <h3 className={`font-display mt-3 leading-[0.95] ${p.big ? "text-[clamp(2.5rem,5vw,4.5rem)]" : "text-[clamp(1.6rem,2.6vw,2.4rem)]"}`}>
            {p.name}
          </h3>
          <p className={`font-body mt-3 max-w-md text-ink/80 ${p.big ? "text-[16px] leading-[1.5]" : "text-[14px] leading-[1.5]"}`}>
            {p.blurb}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map(t => (
              <span
                key={t}
                className="font-display rounded-full border border-ink/30 bg-paper/80 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.12em] backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
          <span className="font-display text-[12px] uppercase tracking-[0.22em] text-ink">
            Open ↗
          </span>
        </div>
      </div>
    </a>
  );
}

/* ──────────── TROPHIES (WINS) ──────────── */

function Trophies() {
  return (
    <section id="trophies" className="relative px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-4">
          <div>
            <Eyebrow>Awards</Eyebrow>
            <h2 className="font-display mt-2 text-[clamp(2.4rem,5vw,4rem)] leading-[0.95]">
              Wins & receipts.
            </h2>
          </div>
          <span className="font-mono text-[12px] text-ink/60">07 entries</span>
        </div>

        <ul className="mt-8 grid grid-cols-12 gap-3">
          {WINS.map((w, i) => (
            <li
              key={w.v}
              data-cursor="win"
              className="col-span-12 flex items-center gap-5 rounded-2xl border-2 border-ink bg-white p-5 transition-transform hover:-translate-y-0.5 md:col-span-6"
              style={{ boxShadow: "var(--shadow-hard)" }}
            >
              <span
                className="font-display flex h-16 min-w-16 items-center justify-center rounded-2xl bg-chrome px-4 text-[28px]"
              >
                {w.k}
              </span>
              <div>
                <div className="font-body text-[15px] leading-snug">{w.v}</div>
                <div className="font-mono mt-1 text-[10px] uppercase tracking-[0.18em] text-ink/50">
                  entry № {String(i + 1).padStart(2, "0")}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ──────────── DESK (WRITING) ──────────── */

function Desk() {
  return (
    <section id="desk" className="relative px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-4">
          <div>
            <Eyebrow>Writing</Eyebrow>
            <h2 className="font-display mt-2 text-[clamp(2.4rem,5vw,4rem)] leading-[0.95]">
              Notes I post on <span className="text-chrome">LinkedIn.</span>
            </h2>
          </div>
          <a
            href="https://linkedin.com/in/yogyachugh"
            target="_blank"
            rel="noreferrer"
            data-cursor="read all"
            className="font-display rounded-full border-2 border-ink bg-ink px-4 py-2 text-[12px] uppercase tracking-[0.22em] text-paper"
          >
            Read all ↗
          </a>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-4">
          {POSTS.map((p, i) => (
            <a
              key={p.t}
              href="https://linkedin.com/in/yogyachugh"
              target="_blank"
              rel="noreferrer"
              data-cursor="read"
              className="group col-span-12 flex flex-col rounded-3xl border-2 border-ink bg-white p-6 transition-transform hover:-translate-y-1 md:col-span-6"
              style={{ boxShadow: "var(--shadow-hard)" }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-[11px] uppercase tracking-[0.22em] text-ink/60">
                  Note № {String(i + 1).padStart(2, "0")} · linkedin
                </span>
                <span className="font-display text-[11px] uppercase tracking-[0.22em] text-ink/40 transition-colors group-hover:text-ink">
                  Read ↗
                </span>
              </div>
              <h3 className="font-display mt-4 text-[clamp(1.4rem,2.2vw,2rem)] leading-[1.05]">
                {p.t}
              </h3>
              <p className="font-body mt-3 text-[14.5px] leading-[1.5] text-ink/75">{p.d}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────── OUTRO (CONTACT) ──────────── */

function Outro() {
  return (
    <section id="outro" className="relative px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="relative overflow-hidden rounded-[36px] border-2 border-ink bg-chrome p-8 md:p-14" style={{ boxShadow: "var(--shadow-hard)" }}>
          <span className="font-display absolute right-6 top-6 rounded-full bg-ink px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-paper">
            Back cover
          </span>
          <Eyebrow inverse>Contact</Eyebrow>
          <h2 className="font-display mt-3 text-[clamp(3rem,9vw,8rem)] leading-[0.85]">
            Let&rsquo;s build<br />something <span className="italic">funny.</span>
          </h2>
          <p className="font-body mt-5 max-w-xl text-[17px] leading-[1.5] text-ink/85">
            Internships, freelance, or a chat about Rust / browsers / game dev — I read everything and reply fast.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <a
                href="mailto:yogya.developer@gmail.com"
                data-cursor="email"
                className="font-display rounded-full border-2 border-ink bg-ink px-6 py-3 text-paper uppercase tracking-[0.22em]"
              >
                yogya.developer@gmail.com
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="https://github.com/YogyaChugh"
                target="_blank"
                rel="noreferrer"
                data-cursor="github"
                className="font-display rounded-full border-2 border-ink bg-paper px-6 py-3 uppercase tracking-[0.22em]"
              >
                GitHub ↗
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="https://linkedin.com/in/yogyachugh"
                target="_blank"
                rel="noreferrer"
                data-cursor="linkedin"
                className="font-display rounded-full border-2 border-ink bg-paper px-6 py-3 uppercase tracking-[0.22em]"
              >
                LinkedIn ↗
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="tel:+919650029959"
                data-cursor="call"
                className="font-display rounded-full border-2 border-ink bg-paper px-6 py-3 uppercase tracking-[0.22em]"
              >
                +91 96500 29959
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

function Colophon() {
  return (
    <footer className="border-t-2 border-ink px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3">
        <span className="font-display text-[11px] uppercase tracking-[0.22em] text-ink/60">
          © {new Date().getFullYear()} Yogya Chugh · Issue Nº 27 · printed on the internet
        </span>
        <span className="font-mono text-[11px] text-ink/50">
          designed & built, twice. lol.
        </span>
      </div>
    </footer>
  );
}

/* ──────────── PRIMITIVES ──────────── */

function Eyebrow({ children, inverse }: { children: React.ReactNode; inverse?: boolean }) {
  return (
    <span
      className={`font-display inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.24em] ${inverse ? "text-ink" : "text-ink/70"}`}
    >
      <span className={`inline-block h-1.5 w-6 ${inverse ? "bg-ink" : "bg-chrome"} rounded-full`} />
      {children}
    </span>
  );
}

function Pill({ children, color }: { children: React.ReactNode; color: "lavender" | "cyan" | "sky" | "indigo" | "hot" | "lime" }) {
  const map: Record<string, string> = {
    lavender: "bg-[oklch(0.9_0.08_300)] text-ink",
    cyan: "bg-[oklch(0.9_0.1_200)] text-ink",
    sky: "bg-[oklch(0.94_0.06_215)] text-ink",
    indigo: "bg-[oklch(0.7_0.2_282)] text-paper",
    hot: "bg-[oklch(0.78_0.2_340)] text-ink",
    lime: "bg-[oklch(0.9_0.18_130)] text-ink",
  };
  return (
    <span className={`font-display rounded-full border-2 border-ink px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] ${map[color]}`}>
      {children}
    </span>
  );
}

function Sticker({
  children,
  tone,
  tilt,
  dark,
}: {
  children: React.ReactNode;
  tone: "lavender" | "cyan" | "sky" | "indigo";
  tilt: string;
  dark?: boolean;
}) {
  const bg: Record<string, string> = {
    lavender: "oklch(0.9 0.08 300)",
    cyan: "oklch(0.9 0.1 200)",
    sky: "oklch(0.94 0.06 215)",
    indigo: "oklch(0.5 0.2 280)",
  };
  return (
    <div
      data-cursor="●"
      className="rounded-3xl border-2 border-ink p-5 transition-transform hover:rotate-0"
      style={{
        background: bg[tone],
        transform: `rotate(${tilt})`,
        boxShadow: "var(--shadow-hard)",
        color: dark ? "var(--paper)" : undefined,
      }}
    >
      {children}
    </div>
  );
}

function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist < 120) {
        const f = 0.25;
        el.style.transform = `translate(${dx * f}px, ${dy * f}px)`;
      } else {
        el.style.transform = "translate(0,0)";
      }
    };
    const reset = () => (el.style.transform = "translate(0,0)");
    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);
  return (
    <span ref={ref} className="inline-block transition-transform duration-200 ease-out">
      {children}
    </span>
  );
}