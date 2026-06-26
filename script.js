
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
                window.location.hash = item.href;
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

});
