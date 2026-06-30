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
        desc: "Contributing to a massive open-source project like Django can feel intimidating. Here is how I landed my first commit.",
        file: "blogs/first_open_source.html"
      },
      {
        id: "summer_of_making",
        title: "450 hours, 4 ships, one laptop",
        desc: "What three months of non-stop building actually feels like — the grind, the projects, and what I'd do differently.",
        file: "blogs/summer_of_making.html"
      },
      {
        id: "classes_dex",
        title: "Writing classes.dex by hand from Rust",
        desc: "Why AnyStudio skips the JDK entirely and what the DEX format actually looks like up close.",
        file: "blogs/classes_dex.html"
      },
      {
        id: "whatwg_dom",
        title: "Implementing the WhatWG DOM in C++",
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

});