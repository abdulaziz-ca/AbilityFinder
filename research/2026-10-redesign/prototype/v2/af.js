/* AbilityFinder design v2 — shared behaviour.
   Motion follows Mercury's vocabulary: short fades that rise into place with a soft blur,
   ease-out ~0.3–0.8 s, nothing looping except gentle ambient pieces. Everything here is
   skipped when the visitor asks for reduced motion. */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.toggle("motion", !reduce);

  /* Header gets its glass background once the page scrolls. */
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", scrollY > 10);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  /* Headline: each word rises out of a soft blur, one after another. */
  document.querySelectorAll("[data-split]").forEach((el) => {
    if (reduce) return;
    const walk = (node, out) => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === 3) {
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { out.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement("span"); w.className = "w"; w.textContent = part; out.appendChild(w);
          });
        } else if (child.classList && child.classList.contains("glow")) {
          // Gradient text breaks if its words are split; it rises in as one piece.
          const w = child.cloneNode(true); w.classList.add("w"); out.appendChild(w);
        } else {
          const clone = child.cloneNode(false); out.appendChild(clone); walk(child, clone);
        }
      }
    };
    const frag = document.createElement("span"); walk(el, frag);
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    el.replaceChildren(...frag.childNodes);
    el.querySelectorAll(".w").forEach((w, i) => { w.setAttribute("aria-hidden", "true"); w.style.animationDelay = `${120 + i * 70}ms`; });
  });

  /* Sections fade up as they enter; the product window straightens. */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".reveal, .stage, .stagger").forEach((el) => io.observe(el));

  /* Count-up numbers (e.g. 463 programs). */
  const counters = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; counters.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, dur = 1100, t0 = performance.now();
    if (reduce) { el.textContent = end.toLocaleString("en-CA"); return; }
    const step = (t) => { const k = Math.min(1, (t - t0) / dur); const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(end * eased).toLocaleString("en-CA"); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach((el) => counters.observe(el));

  /* Linear-style spotlight border that follows the pointer. */
  document.querySelectorAll(".card, .spot").forEach((c) => c.addEventListener("pointermove", (e) => {
    const r = c.getBoundingClientRect(); c.style.setProperty("--x", `${e.clientX - r.left}px`); c.style.setProperty("--y", `${e.clientY - r.top}px`);
  }));

  /* Seamless marquee: duplicate the track once. */
  const track = document.getElementById("track"); if (track) track.innerHTML += track.innerHTML;

  /* Mercury-style feature tabs: the active tab expands and its panel cross-fades in.
     Auto-advances every 6 s with a progress line; pauses on hover or keyboard focus,
     and does not auto-advance at all under reduced motion. */
  document.querySelectorAll("[data-tabs]").forEach((root) => {
    const tabs = [...root.querySelectorAll('[role="tab"]')], panels = [...root.querySelectorAll('[role="tabpanel"]')];
    let i = 0, timer = null, paused = false;
    const show = (n, focus) => {
      i = (n + tabs.length) % tabs.length;
      tabs.forEach((t, k) => { const on = k === i; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; t.classList.toggle("on", on); });
      panels.forEach((p, k) => { p.hidden = k !== i; p.classList.toggle("on", k === i); });
      if (focus) tabs[i].focus();
      root.style.setProperty("--tab-run", "0");
      if (!reduce && !paused) { void root.offsetWidth; root.style.setProperty("--tab-run", "1"); }
    };
    const start = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => { if (!paused) show(i + 1); }, 6000); };
    tabs.forEach((t, k) => {
      t.addEventListener("click", () => { show(k); start(); });
      t.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); show(i + 1, true); start(); }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); show(i - 1, true); start(); }
      });
    });
    root.addEventListener("pointerenter", () => { paused = true; root.classList.add("paused"); });
    root.addEventListener("pointerleave", () => { paused = false; root.classList.remove("paused"); });
    root.addEventListener("focusin", () => { paused = true; root.classList.add("paused"); });
    root.addEventListener("focusout", () => { paused = false; root.classList.remove("paused"); });
    show(0); start();
  });

  /* Theme switch (dark default). Remembered on this device only. */
  const tbtn = document.getElementById("themeBtn");
  if (tbtn) {
    const apply = (t) => { document.documentElement.dataset.theme = t; tbtn.setAttribute("aria-pressed", String(t === "dark")); tbtn.querySelector("span").textContent = t === "dark" ? "Dark" : "Light"; };
    let saved = "dark"; try { saved = localStorage.getItem("af-theme") || "dark"; } catch (e) {}
    apply(saved);
    tbtn.addEventListener("click", () => { const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; apply(t); try { localStorage.setItem("af-theme", t); } catch (e) {} });
  }
})();
