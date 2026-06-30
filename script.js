// ── Sparkle cursor ──────────────────────────────────────────
(function () {
  const dot = document.getElementById("cursor-dot");
  if (!dot) return;

  const COLORS = ["#ff6eb4","#f43f7a","#c084fc","#fda4af","#e9d5ff","#f43f7a","#ff6eb4"];
  const GLYPHS = ["✦","✧","✦","✦","✧","·","✦"];

  let lastX = -200, lastY = -200, distAcc = 0, lastSpawn = 0;

  // Move dot instantly to exact cursor
  document.addEventListener("mousemove", e => {
    const { clientX: x, clientY: y } = e;
    dot.style.left = x + "px";
    dot.style.top  = y + "px";

    // Accumulate distance traveled
    distAcc += Math.hypot(x - lastX, y - lastY);
    lastX = x; lastY = y;

    // Spawn a sparkle every ~35px of travel, max 1 per 40ms
    const now = Date.now();
    if (distAcc >= 35 && now - lastSpawn > 40) {
      spawnSparkle(x, y);
      distAcc = 0;
      lastSpawn = now;
    }
  });

  function spawnSparkle(x, y) {
    const el = document.createElement("span");
    el.className = "cursor-sparkle";
    el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

    const dx  = (Math.random() - 0.5) * 28;          // horizontal drift
    const dy  = -(14 + Math.random() * 22);            // upward drift
    const rot = (Math.random() - 0.5) * 120;           // spin
    const dur = 0.55 + Math.random() * 0.3;            // lifetime 0.55–0.85s
    const sz  = 9 + Math.random() * 9;                 // 9–18px

    el.style.cssText = `
      left: ${x + (Math.random() - 0.5) * 12}px;
      top:  ${y + (Math.random() - 0.5) * 12}px;
      color: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
      font-size: ${sz}px;
      --sparkle-dx:  ${dx}px;
      --sparkle-dy:  ${dy}px;
      --sparkle-rot: ${rot}deg;
      --dur: ${dur}s;
    `;
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove(), { once: true });
  }

  // Dot hover morph
  const sel = "a, button, [data-cursor], [role='button']";
  document.querySelectorAll(sel).forEach(el => {
    el.addEventListener("mouseenter", () => dot.classList.add("hovered"));
    el.addEventListener("mouseleave", () => dot.classList.remove("hovered"));
  });
})();

document.addEventListener("DOMContentLoaded", () => {
    // Mobile Menu
    const btnMenu = document.getElementById("btn-menu");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuLinks = document.querySelectorAll(".mobile-nav-link");
    
    let menuOpen = false;
    if (btnMenu) {
        btnMenu.addEventListener("click", () => {
            menuOpen = !menuOpen;
            btnMenu.querySelector("span").textContent = menuOpen ? "✕" : "☰";
            if (menuOpen) {
                mobileMenu.classList.remove("hidden");
            } else {
                mobileMenu.classList.add("hidden");
            }
        });

        menuLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuOpen = false;
                btnMenu.querySelector("span").textContent = "☰";
                mobileMenu.classList.add("hidden");
            });
        });
    }

    // Command Palette Data
    const NAV = [
      { id: "cover", label: "Home" },
      { id: "feature", label: "About" },
      { id: "kit", label: "Stack" },
      { id: "ledger", label: "Experience" },
      { id: "projects", label: "Projects" },
      { id: "hangman-play", label: "Play Hangman" },
      { id: "trophies", label: "Awards" },
      { id: "desk", label: "Writing" },
      { id: "outro", label: "Contact" },
    ];
    
    const PROJECTS_CMDS = [
      { name: "AnyStudio", href: "https://github.com/YogyaChugh" },
      { name: "Webelo", href: "https://github.com/YogyaChugh/Webelo" },
      { name: "Vardhman Saathi", href: "https://vardhmansaathi.shop" },
      { name: "AgroLens", href: "https://github.com/YogyaChughCoder/AgroLens" },
      { name: "Snake Hustle", href: "https://snakehustle.netlify.app" },
      { name: "Timberly", href: "https://yogya-chugh.itch.io/timberly" },
      { name: "Webber", href: "https://github.com/YogyaChugh/Webber" },
      { name: "SIH Travel Security", href: "https://github.com/YogyaChugh" },
      { name: "Django · Open Source", href: "https://github.com/YogyaChugh/django" },
    ];

    const baseItems = [
      ...NAV.map(n => ({ kind: "Jump", label: n.label, href: `#${n.id}`, ext: false })),
      ...PROJECTS_CMDS.map(p => ({ kind: "Project", label: p.name, href: p.href, ext: true })),
      { kind: "Link", label: "GitHub", href: "https://github.com/YogyaChugh", ext: true },
      { kind: "Link", label: "LinkedIn", href: "https://linkedin.com/in/yogyachugh", ext: true },
      { kind: "Link", label: "Email · yogya.developer@gmail.com", href: "mailto:yogya.developer@gmail.com", ext: true },
      { kind: "Link", label: "Phone · +91 96500 29959", href: "tel:+919650029959", ext: true },
    ];

    // Command Palette Logic
    const cmdBackdrop = document.getElementById("command-palette-backdrop");
    const cmdInput = document.getElementById("cmd-input");
    const cmdResults = document.getElementById("cmd-results");
    const btnCmd = document.getElementById("btn-cmd");
    
    let cmdOpen = false;

    const renderCmds = (query = "") => {
        const q = query.toLowerCase().trim();
        const items = q ? baseItems.filter(i => i.label.toLowerCase().includes(q) || i.kind.toLowerCase().includes(q)) : baseItems;
        
        if (items.length === 0) {
            cmdResults.innerHTML = '<div class="py-4 text-center font-body text-ink/50 text-[14px]">No results found.</div>';
            return;
        }

        let html = '<div class="font-display px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-ink/50">Results</div>';
        items.forEach((item, idx) => {
            html += `
            <div data-idx="${idx}" class="cmd-item flex items-center py-3 px-2 rounded-lg transition-colors" onmouseenter="this.style.background='rgba(255,110,180,0.12)'" onmouseleave="this.style.background=''"  style="cursor:none">>
                <span class="font-display w-16 shrink-0 text-[10px] uppercase tracking-[0.18em] text-ink/50">${item.kind}</span>
                <span class="font-body text-[15px] font-medium text-ink">${item.label}</span>
                <span class="ml-auto font-display text-[10px] uppercase tracking-[0.2em] text-ink/40">Select ↵</span>
            </div>`;
        });
        cmdResults.innerHTML = html;
        
        document.querySelectorAll(".cmd-item").forEach(el => {
            el.addEventListener("click", () => {
                const item = items[parseInt(el.getAttribute("data-idx"))];
                runCommand(item);
            });
        });
    };

    const runCommand = (item) => {
        setCmdOpen(false);
        setTimeout(() => {
            if (item.ext) {
                window.open(item.href, "_blank", "noreferrer");
            } else {
                const target = document.querySelector(item.href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        }, 150);
    };

    const setCmdOpen = (open) => {
        cmdOpen = open;
        if (cmdOpen) {
            cmdBackdrop.classList.remove("hidden");
            cmdInput.value = "";
            renderCmds("");
            cmdInput.focus();
        } else {
            cmdBackdrop.classList.add("hidden");
        }
    };

    window.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            setCmdOpen(!cmdOpen);
        }
        if (e.key === "Escape" && cmdOpen) {
            setCmdOpen(false);
        }
    });

    if (btnCmd) btnCmd.addEventListener("click", () => setCmdOpen(true));
    
    if (cmdBackdrop) {
        cmdBackdrop.addEventListener("click", (e) => {
            if (e.target === cmdBackdrop) setCmdOpen(false);
        });
    }

    if (cmdInput) {
        cmdInput.addEventListener("input", (e) => {
            renderCmds(e.target.value);
        });
    }
    // ── Staggered project card scroll-in ─────────────────────
    const cards = document.querySelectorAll(".project-card[data-card-index]");
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = parseInt(entry.target.dataset.cardIndex) || 1;
                // Stagger: each card waits 80ms more than the previous
                setTimeout(() => {
                    entry.target.classList.add("card-visible");
                }, (idx - 1) * 80);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => cardObserver.observe(card));

    // ── Projects: data, grid render, detail modal ────────────
    const PLATFORM_ICONS = {
      windows: '<svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.949"/></svg>',
      macos: '<svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>',
      linux: '<svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489.117.779.567 1.563 1.205 2.04 1.065.76 2.566.894 3.876.497l.82.186c.79.217 1.538.53 2.217.945 1.093.76 1.717 1.893 1.717 3.187v.03h.058c.096 0 .19-.003.282-.007 4.193-.37 4.156-4.56 4.156-4.56v-.03c0-1.294.624-2.428 1.716-3.187.679-.415 1.427-.728 2.217-.945l.82-.186c1.31.397 2.81.263 3.876-.497.638-.477 1.088-1.261 1.205-2.04.123-.805-.009-1.657-.287-2.489-.589-1.771-1.831-3.47-2.716-4.52-.75-1.068-.974-1.93-1.05-3.021-.065-1.491 1.056-5.965-3.17-6.298-.165-.013-.325-.021-.48-.021zm-4.8 8.701c.33 0 .599.27.599.6s-.269.6-.6.6-.6-.27-.6-.6.27-.6.6-.6zm9.6 0c.33 0 .599.27.599.6s-.269.6-.6.6-.6-.27-.6-.6.27-.6.6-.6z"/></svg>',
      android: '<svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0729L4.841 5.4207a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396"/></svg>',
      ios: '<svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
      github: '<svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
      globe: '<svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20 15 15 0 010-20z"/></svg>',
      blog: '<svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h5"/></svg>',
    };

    const PLATFORM_LABELS = { windows: "Windows", macos: "macOS", linux: "Linux", android: "Android", ios: "iOS" };

    const PROJECTS = [
      {
        id: "anystudio", index: "01", year: "2026", featured: true, inConstruction: true, size: "wide",
        image: "assets/projects/anystudio.jpg",
        title: "AnyStudio",
        tagline: "Native desktop IDE in Rust + egui — build Android apps visually",
        desc: "A native desktop IDE in Rust + egui for building Android apps with a visual UI builder and code logic in Python, C++, or native — compiling straight to the smallest possible APKs via a direct DEX pipeline, no JDK required. Currently in active construction.",
        tags: ["Rust", "egui", "Android", "Compilers"],
        website: null,
        github: "https://github.com/YogyaChugh",
        blog: "blogs/classes_dex.html",
        downloads: {},
        gradient: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #fdf2f8 100%)"
      },
      {
        id: "webelo", index: "02", year: "2025", featured: true, size: "normal",
        image: "assets/projects/webelo.jpg",
        title: "Webelo",
        tagline: "C++ DOM library, WhatWG-strict",
        desc: "C++ DOM library + HTML visualiser that strictly follows the WhatWG DOM Standard — the foundation for an upcoming browser, currently migrating from C++ to Rust.",
        tags: ["C++", "Rust", "WhatWG", "Browser"],
        website: null,
        github: "https://github.com/YogyaChugh/Webelo",
        blog: "blogs/whatwg_dom.html",
        downloads: {
          windows: "https://github.com/YogyaChugh/Webelo/releases/download/v2.0/Webelo.exe",
          linux: "https://github.com/YogyaChugh/Webelo/releases/download/v2.0/Webelo-Linux"
        },
        gradient: "linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)"
      },
      {
        id: "vardhman", index: "03", year: "2026", featured: true, size: "normal",
        image: "assets/projects/vardhman.jpg",
        title: "Vardhman Saathi",
        tagline: "Live client. Live revenue.",
        desc: "Production business suite for a real electrical contractor, with a full desktop app and Android app sharing one TypeScript codebase. Hono API · Supabase · R2 · Render. Live client, live revenue.",
        tags: ["TypeScript", "Hono", "React Native", "Desktop"],
        website: "https://vardhmansaathi.shop",
        github: null,
        blog: "blogs/vardhman.html",
        downloads: {},
        gradient: "linear-gradient(135deg, #fce7f3 0%, #fda4af 40%, #fdf2f8 100%)"
      },
      {
        id: "agrolens", index: "04", year: "2024", featured: false, size: "normal",
        image: "assets/projects/agrolens.jpg",
        title: "AgroLens",
        tagline: "CV model for plant-leaf disease",
        desc: "Computer-vision model classifying plant-leaf diseases. Dataset pipeline, training, deployment — team build.",
        tags: ["Python", "Computer Vision", "Team"],
        website: null,
        github: "https://github.com/YogyaChughCoder/AgroLens",
        blog: null,
        downloads: {},
        gradient: "linear-gradient(135deg, #e9d5ff 0%, #fce7f3 100%)"
      },
      {
        id: "snake-hustle", index: "05", year: "2024", featured: false, size: "normal",
        image: "assets/projects/snake-hustle.jpg",
        title: "Snake Hustle",
        tagline: "The OG obsession, in-browser",
        desc: "Browser snake. The OG obsession. Click to play, get yelled at by your own high score.",
        tags: ["Game", "Web"],
        website: "https://snakehustle.netlify.app",
        github: null,
        blog: null,
        downloads: {
          windows: "https://github.com/YogyaChugh/SnakeGame/releases/download/v1.0.0/Snake_Game_Windows.exe",
          linux: "https://github.com/YogyaChugh/SnakeGame/releases/download/v1.0.0/Snake_Hustler_Linux"
        },
        gradient: "linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%)"
      },
      {
        id: "timberly", index: "06", year: "2024", featured: false, size: "normal",
        image: "assets/projects/timberly.jpg",
        title: "Timberly",
        tagline: "Casual lumberjack game",
        desc: "Casual lumberjack game — plays in-browser, downloads for Win/macOS/Linux/Android.",
        tags: ["Game", "C++"],
        website: "https://yogya-chugh.itch.io/timberly",
        github: null,
        blog: null,
        downloads: {
          windows: "https://github.com/YogyaChugh/Timberly/releases/download/v2.0/Timberly.exe",
          linux: "https://github.com/YogyaChugh/Timberly/releases/download/v2.0/Timberly-Linux",
          macos: "https://github.com/YogyaChugh/Timberly/releases/download/v2.0/Timberly-Mac"
        },
        gradient: "linear-gradient(135deg, #fce7f3 0%, #e9d5ff 50%, #fdf2f8 100%)"
      },
      {
        id: "webber", index: "07", year: "2023", featured: false, size: "normal",
        image: "assets/projects/webber.jpg",
        title: "Webber",
        tagline: "Offline website crawler",
        desc: "Desktop crawler that downloads any website for offline rendering. Pygame + PyWebview + BS4.",
        tags: ["Python", "Crawler"],
        website: null,
        github: "https://github.com/YogyaChugh/Webber",
        blog: null,
        downloads: {
          windows: "https://github.com/YogyaChugh/Webber/releases/download/v1.0/Webber-Windows.exe",
          linux: "https://github.com/YogyaChugh/Webber/releases/download/v1.0/Webber-Linux"
        },
        gradient: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)"
      },
      {
        id: "sih-travel", index: "08", year: "2024", featured: false, size: "normal",
        image: "assets/projects/sih-travel.jpg",
        title: "SIH Travel Security",
        tagline: "Blockchain tourist tracking",
        desc: "Blockchain system for encrypted tourist tracking with SSO to local authorities. Cleared SIH internals twice.",
        tags: ["Blockchain", "Team"],
        website: null,
        github: "https://github.com/YogyaChugh",
        blog: null,
        downloads: {},
        gradient: "linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)"
      },
      {
        id: "django-oss", index: "09", year: "2024", featured: false, size: "normal",
        image: "assets/projects/django-oss.jpg",
        title: "Django · Open Source",
        tagline: "Merged PRs into Django core",
        desc: "Merged PRs into Django core + third-party libraries. Open-source compounder.",
        tags: ["Python", "OSS"],
        website: null,
        github: "https://github.com/django/django/pulls?q=is%3Apr+author%3Ayogyachugh+",
        githubLabel: "View PRs ↗",
        blog: "blogs/first_open_source.html",
        downloads: {},
        gradient: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)"
      },
    ];

    const projectsGrid = document.getElementById("projects-grid");
    const projectModal = document.getElementById("project-modal");
    const projectModalContainer = document.getElementById("project-modal-container");
    const projectModalBody = document.getElementById("project-modal-body");
    const btnCloseProjectModal = document.getElementById("btn-close-project-modal");

    const quickLinkBtn = (kind, href, label) => {
      if (!href) return "";
      const icon = PLATFORM_ICONS[kind] || PLATFORM_ICONS.globe;
      return `<a href="${href}" target="_blank" rel="noreferrer" data-cursor="${kind}" onclick="event.stopPropagation()" class="font-display inline-flex items-center justify-center h-8 w-8 rounded-full border-2 border-ink transition-colors hover:bg-ink hover:text-paper" style="background: rgba(253,240,252,0.95);" title="${label}">${icon}</a>`;
    };

    // Render redesigned grid cards — media band + body + action footer; click opens the detail modal
    if (projectsGrid) {
      projectsGrid.innerHTML = PROJECTS.map((p, idx) => {
        const wideClasses = p.size === "wide"
          ? "col-span-12 lg:col-span-8 lg:row-span-2"
          : "col-span-12 sm:col-span-6 lg:col-span-4";
        const mediaHeight = p.size === "wide" ? "h-[200px] md:h-[260px]" : "h-[140px] md:h-[160px]";
        const titleSize = p.size === "wide" ? "text-[clamp(2rem,4vw,3.2rem)]" : "text-[clamp(1.4rem,2.2vw,1.9rem)]";

        const downloadEntries = Object.entries(p.downloads || {});
        const statusBadges = [];
        if (p.inConstruction) {
          statusBadges.push(`<span class="font-display inline-flex items-center gap-1 rounded-full border-2 border-ink px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-ink backdrop-blur-sm" style="background:rgba(255,243,196,0.92);">🚧 In construction</span>`);
        } else if (p.website) {
          statusBadges.push(`<span class="font-display inline-flex items-center gap-1 rounded-full border-2 border-ink px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-ink backdrop-blur-sm" style="background:rgba(212,237,218,0.92);"><span class="h-1.5 w-1.5 rounded-full bg-[#22c55e]"></span> Live site</span>`);
        }
        if (downloadEntries.length) {
          const platformList = downloadEntries.map(([k]) => PLATFORM_LABELS[k]).join(" · ");
          statusBadges.push(`<span class="font-display inline-flex items-center gap-1 rounded-full border-2 border-ink px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-ink backdrop-blur-sm" style="background:rgba(255,255,255,0.92);">↓ ${platformList}</span>`);
        }

        return `
        <button data-project-idx="${idx}" class="project-card group flex flex-col text-left relative overflow-hidden rounded-3xl border-2 border-ink ${wideClasses}" style="background: var(--card-bg); box-shadow: var(--shadow-hard);">

          <!-- Media band -->
          <div class="relative ${mediaHeight} shrink-0 overflow-hidden border-b-2 border-ink" style="background: ${p.gradient};">
            <img src="${p.image}" alt="${p.title} preview" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" onerror="this.style.display='none';">
            <div class="relative flex items-start justify-between p-4">
              <span class="font-display rounded-full border-2 border-ink px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-ink backdrop-blur-sm" style="background:rgba(255,255,255,0.75);">${p.year}</span>
              ${p.featured && !p.inConstruction ? `<span class="font-display rounded-full border-2 border-ink px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-ink" style="background:#fce7f3;">★ featured</span>` : ""}
            </div>
            ${statusBadges.length ? `<div class="absolute bottom-3 left-4 right-4 flex flex-wrap gap-1.5">${statusBadges.join("")}</div>` : ""}
          </div>

          <!-- Body -->
          <div class="flex flex-1 flex-col p-5 md:p-6">
            <h3 class="font-display leading-[0.95] ${titleSize}">${p.title}</h3>
            <p class="font-body mt-2.5 text-ink/80 text-[14px] leading-[1.5]">${p.tagline}</p>
            <div class="mt-4 flex flex-wrap gap-1.5">
              ${p.tags.slice(0, 3).map(t => `<span class="font-display rounded-full border border-ink/30 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.12em]" style="background: rgba(253,240,252,0.80);">${t}</span>`).join("")}
            </div>
          </div>

          <!-- Footer action bar -->
          <div class="flex items-center justify-between border-t-2 border-ink px-5 py-3 md:px-6" style="background: rgba(255,255,255,0.5);">
            <div class="flex flex-wrap gap-1.5">
              ${quickLinkBtn("globe", p.website, "Visit live site")}
              ${quickLinkBtn("github", p.github, "View code")}
              ${quickLinkBtn("blog", p.blog ? "#" : null, "Read the blog")}
            </div>
            <span class="card-open font-display inline-flex items-center gap-1 rounded-full border-2 border-ink px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-ink transition-colors group-hover:bg-ink group-hover:text-paper">Details ↗</span>
          </div>
        </button>`;
      }).join("");

      // The blog quick-link inside the card should open the modal at the blog tab, not navigate away
      projectsGrid.querySelectorAll('[data-cursor="blog"]').forEach((el, i) => {
        const p = PROJECTS[i];
        if (p.blog) {
          el.removeAttribute("href");
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            openProjectModal(PROJECTS.indexOf(p), "blog");
          });
        }
      });
    }

    const renderProjectModal = (p, focusTab) => {
      const downloadEntries = Object.entries(p.downloads || {});

      return `
        <div class="flex flex-col md:flex-row h-full">
          <div class="md:w-[58%] lg:w-[60%] shrink-0 relative bg-ink/5 border-b-2 md:border-b-0 md:border-r-2 border-ink min-h-[280px] md:min-h-full">
            <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 p-8 text-center font-display text-[15px] text-ink/40" style="background: ${p.gradient};">
              <span>Image coming soon</span>
            </div>
            <img src="${p.image}" alt="${p.title} preview" class="absolute inset-0 w-full h-full object-cover" loading="lazy" onerror="this.style.display='none';">
            ${p.inConstruction ? `<span class="absolute top-3 left-3 z-10 font-display rounded-full border-2 border-ink px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em]" style="background: rgba(255,243,196,0.92);">🚧 In construction</span>` : p.website ? `<span class="absolute top-3 left-3 z-10 font-display rounded-full border-2 border-ink px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] flex items-center gap-1.5" style="background: rgba(255,255,255,0.92);"><span class="h-1.5 w-1.5 rounded-full bg-[#22c55e]"></span>Live</span>` : ""}
          </div>
          <div class="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10">
            <span class="font-display text-[11px] uppercase tracking-[0.22em] text-ink/50">Project · ${p.year}</span>
            <h2 class="font-display mt-2 text-[clamp(2rem,4vw,3rem)] leading-[0.95]">${p.title}</h2>
            <p class="font-body mt-4 text-[15px] leading-[1.6] text-ink/85 max-w-xl">${p.desc}</p>
            <div class="mt-5 flex flex-wrap gap-1.5">
              ${p.tags.map(t => `<span class="font-display rounded-full border border-ink/30 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.12em]" style="background: rgba(253,240,252,0.80);">${t}</span>`).join("")}
            </div>

            <div class="mt-7 space-y-5">
              <div>
                <span class="font-display text-[11px] uppercase tracking-[0.2em] text-ink/50">Links</span>
                <div class="mt-2 flex flex-wrap gap-2">
                  ${p.website ? `<a href="${p.website}" target="_blank" rel="noreferrer" data-cursor="open" class="font-display inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-ink px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-75">${PLATFORM_ICONS.globe} Visit Site ↗</a>` : ""}
                  ${p.github ? `<a href="${p.github}" target="_blank" rel="noreferrer" data-cursor="github" class="font-display inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-paper" style="background: rgba(253,240,252,0.90);">${PLATFORM_ICONS.github} ${p.githubLabel || "GitHub ↗"}</a>` : ""}
                  ${p.blog ? `<button data-open-project-blog="${p.id}" class="font-display inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-paper" style="background: rgba(253,240,252,0.90);">${PLATFORM_ICONS.blog} Read Blog ↗</button>` : ""}
                </div>
              </div>
              ${downloadEntries.length ? `
              <div>
                <span class="font-display text-[11px] uppercase tracking-[0.2em] text-ink/50">Download</span>
                <div class="mt-2 flex flex-wrap gap-2">
                  ${downloadEntries.map(([k, href]) => `<a href="${href}" target="_blank" rel="noreferrer" data-cursor="${k}" class="font-display inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-ink px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-75">${PLATFORM_ICONS[k]} ${PLATFORM_LABELS[k]}</a>`).join("")}
                </div>
              </div>` : p.inConstruction ? `
              <div>
                <span class="font-display text-[11px] uppercase tracking-[0.2em] text-ink/50">Download</span>
                <p class="mt-2 font-body text-[13px] text-ink/60 italic">Still in construction — no downloads yet. Watch the repo for releases.</p>
              </div>` : ""}
              ${p.blog ? `<div id="project-blog-area-${p.id}" class="${focusTab === 'blog' ? '' : 'hidden'} mt-2 rounded-2xl border-2 border-ink p-5" style="background: var(--card-bg);"></div>` : ""}
            </div>
          </div>
        </div>
      `;
    };

    const loadProjectBlog = async (p) => {
      const area = document.getElementById(`project-blog-area-${p.id}`);
      if (!area || !p.blog) return;
      area.classList.remove("hidden");
      area.innerHTML = '<div class="py-8 text-center font-display uppercase tracking-widest text-ink/40 text-[12px]">Loading…</div>';
      try {
        const res = await fetch(p.blog);
        area.innerHTML = res.ok ? await res.text() : '<div class="py-8 text-center font-display uppercase tracking-widest text-rose text-[12px]">Failed to load blog.</div>';
      } catch {
        area.innerHTML = '<div class="py-8 text-center font-display uppercase tracking-widest text-rose text-[12px]">Error loading blog.</div>';
      }
    };

    window.openProjectModal = (idx, focusTab) => {
      if (!projectModal) return;
      const p = PROJECTS[idx];
      if (!p) return;

      projectModalBody.innerHTML = renderProjectModal(p, focusTab);

      projectModal.classList.remove("hidden");
      setTimeout(() => {
        projectModal.classList.remove("opacity-0");
        projectModalContainer.classList.remove("scale-95");
      }, 10);

      const blogBtn = projectModalBody.querySelector(`[data-open-project-blog="${p.id}"]`);
      if (blogBtn) blogBtn.addEventListener("click", () => loadProjectBlog(p));
      if (focusTab === "blog" && p.blog) loadProjectBlog(p);
    };

    const closeProjectModal = () => {
      if (!projectModal) return;
      projectModal.classList.add("opacity-0");
      projectModalContainer.classList.add("scale-95");
      setTimeout(() => {
        projectModal.classList.add("hidden");
        projectModalBody.innerHTML = "";
      }, 300);
    };

    if (projectsGrid) {
      projectsGrid.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => {
          const idx = parseInt(card.getAttribute("data-project-idx"));
          openProjectModal(idx);
        });
      });
    }

    if (btnCloseProjectModal) btnCloseProjectModal.addEventListener("click", closeProjectModal);
    if (projectModal) {
      projectModal.addEventListener("click", (e) => {
        if (e.target === projectModal) closeProjectModal();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && projectModal && !projectModal.classList.contains("hidden")) {
        closeProjectModal();
      }
    });

    // Re-run scroll-in observer now that project cards exist dynamically
    document.querySelectorAll(".project-card[data-project-idx]").forEach((card, i) => {
      card.dataset.cardIndex = i + 1;
      cardObserver.observe(card);
    });

    // Sparkle cursor hover binding for dynamically-created project card elements
    const cursorDot = document.getElementById("cursor-dot");
    if (cursorDot) {
      document.querySelectorAll("#projects-grid a, #projects-grid button, #project-modal a, #project-modal button").forEach(el => {
        el.addEventListener("mouseenter", () => cursorDot.classList.add("hovered"));
        el.addEventListener("mouseleave", () => cursorDot.classList.remove("hovered"));
      });
    }

    // ── GitHub Graph Rendering ───────────────────────────────
    const ghGraph = document.getElementById('gh-graph');
    if (ghGraph) {
        const colors = ['bg-ink/5', 'bg-[#9be9a8]', 'bg-[#40c463]', 'bg-[#30a14e]', 'bg-[#216e39]'];
        let html = '<div class="grid grid-cols-[repeat(52,minmax(0,1fr))] gap-[2px] w-full">';
        for (let w = 0; w < 52; w++) {
            html += '<div class="flex flex-col gap-[2px]">';
            for (let d = 0; d < 7; d++) {
                const r = Math.random();
                let cIdx = 0;
                if (r > 0.6) cIdx = 1;
                if (r > 0.8) cIdx = 2;
                if (r > 0.9) cIdx = 3;
                if (r > 0.95) cIdx = 4;
                html += '<div class="w-[9px] h-[9px] rounded-[2px] ' + colors[cIdx] + '"></div>';
            }
            html += '</div>';
        }
        html += '</div>';
        ghGraph.innerHTML = html;
    }

    // ── Blog Modal Logic ─────────────────────────────────────
    const BLOGS = [
      {
        id: "first_open_source",
        title: "My First Open Source Contribution",
        desc: "Contributing to a massive open-source project like Django can feel intimidating. Here is how I landed my first merged PR.",
        file: "blogs/first_open_source.html"
      },
      {
        id: "summer_of_making",
        title: "450 hours, 4 ships, one laptop",
        desc: "What three months of non-stop building actually feels like — the grind, the projects, and community interactions.",
        file: "blogs/summer_of_making.html"
      },
      {
        id: "classes_dex",
        title: "How I cracked the DEX code.",
        desc: "Why AnyStudio removes unnecessary native restrictions entirely and what the DEX format actually looks like up close.",
        file: "blogs/classes_dex.html"
      },
      {
        id: "whatwg_dom",
        title: "Implementing the WhatWG DOM in C++ for my browser .",
        desc: "Preorder DFS, event dispatch, and the parts of the spec nobody warns you about.",
        file: "blogs/whatwg_dom.html"
      },
      {
        id: "vardhman",
        title: "Running a real product on $7/month",
        desc: "How Vardhman Saathi stays on free tiers using Supabase + R2 + Render.",
        file: "blogs/vardhman.html"
      }
    ];

    const blogsGrid = document.getElementById("blogs-grid");
    const blogSidebarList = document.getElementById("blog-sidebar-list");
    const blogContentArea = document.getElementById("blog-content-area");
    const blogModal = document.getElementById("blog-modal");
    const blogModalContainer = document.getElementById("blog-modal-container");
    const btnCloseModal = document.getElementById("btn-close-modal");
    const btnCloseModalMobile = document.getElementById("btn-close-modal-mobile");
    const btnReadAll = document.getElementById("btn-read-all");
    const btnNavBlogs = document.getElementById("btn-nav-blogs");

    // Populate index.html blog cards
    if (blogsGrid) {
      blogsGrid.innerHTML = BLOGS.map((b, idx) => `
        <button data-blog-idx="${idx}" class="blog-card-btn text-left group col-span-12 flex flex-col rounded-3xl border-2 border-ink p-6 transition-transform hover:-translate-y-1 md:col-span-6 lg:col-span-4" style="background: var(--card-bg); box-shadow: var(--shadow-hard);">
          <div class="flex items-center justify-between w-full">
            <span class="font-display text-[11px] uppercase tracking-[0.22em] text-ink/40 transition-colors group-hover:text-ink">Read ↗</span>
          </div>
          <h3 class="font-display mt-4 text-[clamp(1.4rem,2.2vw,2rem)] leading-[1.05]">${b.title}</h3>
          <p class="font-body mt-3 text-[14.5px] leading-[1.5] text-ink/75">${b.desc}</p>
        </button>
      `).join('');
    }

    // Populate modal sidebar
    if (blogSidebarList) {
      blogSidebarList.innerHTML = BLOGS.map((b, idx) => `
        <button data-blog-idx="${idx}" class="sidebar-blog-btn text-left rounded-xl p-3 border-2 border-transparent hover:border-ink/20 transition-all focus:outline-none">
          <h4 class="font-display text-[16px] leading-[1.2] text-ink line-clamp-2">${b.title}</h4>
        </button>
      `).join('');
    }

    const openBlogModal = async (idx) => {
      if (!blogModal) return;
      const blog = BLOGS[idx];
      if (!blog) return;

      // Update active state in sidebar
      document.querySelectorAll(".sidebar-blog-btn").forEach(btn => {
        btn.classList.remove("bg-ink", "text-paper");
        const h4 = btn.querySelector("h4");
        if (h4) {
          h4.classList.remove("text-paper");
          h4.classList.add("text-ink");
        }
        if (parseInt(btn.getAttribute("data-blog-idx")) === idx) {
          btn.classList.add("bg-ink", "text-paper");
          if (h4) {
            h4.classList.remove("text-ink");
            h4.classList.add("text-paper");
          }
        }
      });

      // Show modal
      blogModal.classList.remove("hidden");
      // Trigger animation
      setTimeout(() => {
        blogModal.classList.remove("opacity-0");
        blogModalContainer.classList.remove("scale-95");
      }, 10);

      // Fetch and show content
      blogContentArea.innerHTML = '<div class="py-20 text-center font-display uppercase tracking-widest text-ink/40 text-[14px]">Loading...</div>';
      
      try {
        const response = await fetch(blog.file);
        if (response.ok) {
          const html = await response.text();
          blogContentArea.innerHTML = html;
        } else {
          blogContentArea.innerHTML = '<div class="py-20 text-center font-display uppercase tracking-widest text-rose text-[14px]">Failed to load blog.</div>';
        }
      } catch (err) {
        blogContentArea.innerHTML = '<div class="py-20 text-center font-display uppercase tracking-widest text-rose text-[14px]">Error loading blog.</div>';
      }
    };

    const closeBlogModal = () => {
      blogModal.classList.add("opacity-0");
      blogModalContainer.classList.add("scale-95");
      setTimeout(() => {
        blogModal.classList.add("hidden");
        blogContentArea.innerHTML = "";
      }, 300);
    };

    // Event listeners
    document.querySelectorAll(".blog-card-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-blog-idx"));
        openBlogModal(idx);
      });
    });

    document.querySelectorAll(".sidebar-blog-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-blog-idx"));
        openBlogModal(idx);
      });
    });

    if (btnReadAll) btnReadAll.addEventListener("click", () => openBlogModal(0));
    if (btnNavBlogs) btnNavBlogs.addEventListener("click", () => openBlogModal(0));
    
    if (btnCloseModal) btnCloseModal.addEventListener("click", closeBlogModal);
    if (btnCloseModalMobile) btnCloseModalMobile.addEventListener("click", closeBlogModal);
    
    if (blogModal) {
      blogModal.addEventListener("click", (e) => {
        if (e.target === blogModal) closeBlogModal();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && blogModal && !blogModal.classList.contains("hidden")) {
        closeBlogModal();
      }
    });

    // ── Game tab switcher (Timberly / Hangman) ────────────────
    (function initGameTabs() {
      const tabs = document.querySelectorAll(".game-tab");
      const stages = { timberly: document.getElementById("stage-timberly"), hangman: document.getElementById("stage-hangman") };
      if (!tabs.length) return;

      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const choice = tab.dataset.game;
          tabs.forEach((t) => {
            const active = t === tab;
            t.style.background = active ? "var(--ink)" : "var(--paper)";
            t.style.color = active ? "var(--paper)" : "var(--ink)";
          });
          Object.entries(stages).forEach(([key, el]) => {
            if (!el) return;
            el.classList.toggle("hidden", key !== choice);
          });
        });
      });
    })();

    // ── Timberly — lazy-loaded pygbag/WASM build (sandboxed iframe) ──
    (function initTimberlyPlayer() {
      const startBtn = document.getElementById("timberly-start-btn");
      const overlay = document.getElementById("timberly-overlay");
      const statusEl = document.getElementById("timberly-status");
      const host = document.getElementById("timberly-host");
      if (!startBtn || !host) return;

      let loaded = false;

      function loadAndStart() {
        if (loaded) return;
        startBtn.textContent = "Loading…";
        startBtn.disabled = true;
        statusEl.textContent = "Booting Python/pygame runtime — first load can take a moment…";

        const iframe = document.createElement("iframe");
        iframe.src = "timberly/timberly.html";
        iframe.title = "Timberly — play in browser";
        iframe.allow = "autoplay; fullscreen; gamepad; gyroscope; accelerometer; cross-origin-isolated";
        iframe.sandbox = "allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "0";
        iframe.addEventListener("load", () => {
          statusEl.textContent = "";
        });

        host.appendChild(iframe);
        loaded = true;
        overlay.classList.add("hidden");
      }

      startBtn.addEventListener("click", loadAndStart);
    })();

    // ── Hangman — lazy-loaded WASM terminal ──────────────────
    (function initHangmanPlayer() {
      const startBtn = document.getElementById("hangman-start-btn");
      const overlay = document.getElementById("hangman-overlay");
      const restartBtn = document.getElementById("hangman-restart-btn");
      const statusEl = document.getElementById("hangman-status");
      const termHost = document.getElementById("hangman-terminal");
      if (!startBtn || !termHost) return;

      let loaded = false;
      let term = null;

      function loadScript(src) {
        return new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = src;
          s.onload = resolve;
          s.onerror = reject;
          document.body.appendChild(s);
        });
      }
      function loadCss(href) {
        return new Promise((resolve) => {
          const l = document.createElement("link");
          l.rel = "stylesheet";
          l.href = href;
          l.onload = resolve;
          document.head.appendChild(l);
        });
      }

      function bootGame() {
        window.__hangmanInput = [];
        statusEl.textContent = "Booting game…";
        window.createHangmanModule({
          print: (text) => term.write(text + "\r\n"),
          printErr: (text) => term.write("\x1b[31m" + text + "\x1b[0m\r\n"),
        }).then(() => {
          statusEl.textContent = "";
          restartBtn.classList.remove("hidden");
          term.focus();
        }).catch((err) => {
          statusEl.textContent = "Failed to start: " + err;
        });
      }

      async function loadAndStart() {
        if (loaded) { bootGame(); return; }
        startBtn.textContent = "Loading…";
        startBtn.disabled = true;
        try {
          await loadCss("https://cdnjs.cloudflare.com/ajax/libs/xterm/5.3.0/css/xterm.min.css");
          await loadScript("https://cdnjs.cloudflare.com/ajax/libs/xterm/5.3.0/lib/xterm.min.js");
          await loadScript("https://cdnjs.cloudflare.com/ajax/libs/xterm-addon-fit/0.8.0/lib/xterm-addon-fit.min.js");
          await loadScript("hangman.js");

          term = new window.Terminal({
            cursorBlink: true,
            fontSize: 13,
            fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace',
            theme: { background: "#15151c", foreground: "#eaeaea", cursor: "#ff6eb4" },
            convertEol: true,
          });
          const fitAddon = new window.FitAddon.FitAddon();
          term.loadAddon(fitAddon);
          term.open(termHost);
          fitAddon.fit();
          window.addEventListener("resize", () => fitAddon.fit());

          window.__hangmanInput = [];
          term.onData((data) => {
            for (const ch of data) {
              const code = ch === "\r" ? 10 : ch.charCodeAt(0);
              window.__hangmanInput.push(code);
              term.write(ch === "\r" ? "\r\n" : ch);
            }
          });

          loaded = true;
          overlay.classList.add("hidden");
          bootGame();
        } catch (err) {
          startBtn.textContent = "▶ Play Hangman";
          startBtn.disabled = false;
          statusEl.textContent = "Couldn't load the game — check your connection.";
        }
      }

      startBtn.addEventListener("click", loadAndStart);
      restartBtn.addEventListener("click", () => {
        term.reset();
        bootGame();
      });
    })();

});