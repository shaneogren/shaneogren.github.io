// Full-screen artwork viewer with real zoom.
//
// Used by the gallery (js/main.js) and by each artwork's own page
// (js/artwork.js). It builds its own overlay, so pages only need to load it.
//
// Zoom and pan are handled here rather than left to the browser. Otherwise a
// pinch zooms the whole page, and the image can't be moved independently.
//   touch:  pinch to zoom, one finger to pan, double-tap to zoom in or out
//   mouse:  click to zoom in or out, drag to pan, wheel or trackpad pinch to zoom
//   keys:   + / - / 0 to zoom, Escape to close (arrows belong to the page)
//
// There is deliberately no swipe between artworks: panning a zoomed image
// kept turning the page. On touch screens you close the viewer to pick another.

(function () {
  const TAP_MOVE = 10;       // px a pointer may move and still count as a tap
  const DOUBLE_TAP_MS = 300;

  function el(tag, attrs, parent) {
    const node = document.createElement(tag);
    for (const k in attrs) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(node);
    return node;
  }

  function Viewer(opts) {
    opts = opts || {};

    const overlay = el("div", {
      class: "viewer", role: "dialog", "aria-modal": "true", "aria-label": "Artwork viewer", tabindex: "-1",
    }, document.body);
    const stage = el("div", { class: "viewer-stage" }, overlay);
    const img = el("img", { class: "viewer-img", alt: "", draggable: "false" }, stage);
    const info = el("div", { class: "viewer-info" }, overlay);
    const titleEl = el("div", { class: "viewer-title" }, info);
    const metaEl = el("div", { class: "viewer-meta" }, info);
    const hint = el("div", { class: "viewer-hint", "aria-hidden": "true" }, overlay);

    const closeBtn = el("button", { class: "viewer-btn viewer-close", "aria-label": "Close", text: "×" }, overlay);
    let prevBtn = null, nextBtn = null;
    if (opts.onNav) {
      prevBtn = el("button", { class: "viewer-btn viewer-prev", "aria-label": "Previous", text: "‹" }, overlay);
      nextBtn = el("button", { class: "viewer-btn viewer-next", "aria-label": "Next", text: "›" }, overlay);
    }
    const zoomBtns = el("div", { class: "viewer-zoom" }, overlay);
    const zoomOutBtn = el("button", { class: "viewer-btn", "aria-label": "Zoom out", text: "−" }, zoomBtns);
    const zoomInBtn = el("button", { class: "viewer-btn", "aria-label": "Zoom in", text: "+" }, zoomBtns);

    let work = null;
    let open = false;
    let lastFocus = null;

    // Current view: the image's natural size, scaled by s and offset by (x, y)
    // from the stage's top-left corner.
    let s = 1, x = 0, y = 0, fit = 1, maxS = 1;

    // ── Geometry ──────────────────────────────────────────────────────────

    function measure() {
      const W = stage.clientWidth, H = stage.clientHeight;
      fit = Math.min(W / work.w, H / work.h);
      // Allow at least 4x the fitted size, and never less than 1.5x full
      // resolution, so detail is reachable on any screen.
      maxS = Math.max(fit * 4, 1.5);
      return [W, H];
    }

    // Keep the image covering the stage when it's bigger than it, and centred
    // when it's smaller.
    function clamp() {
      const W = stage.clientWidth, H = stage.clientHeight;
      const iw = work.w * s, ih = work.h * s;
      x = iw <= W ? (W - iw) / 2 : Math.min(0, Math.max(W - iw, x));
      y = ih <= H ? (H - ih) / 2 : Math.min(0, Math.max(H - ih, y));
    }

    function render(animate) {
      img.classList.toggle("animate", !!animate);
      img.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
      const zoomed = s > fit * 1.01;
      overlay.classList.toggle("zoomed", zoomed);
      zoomOutBtn.disabled = !zoomed;
      zoomInBtn.disabled = s >= maxS * 0.99;
    }

    // Scale to `next`, keeping the image point under stage point (px, py) fixed.
    function zoomTo(next, px, py, animate) {
      next = Math.min(maxS, Math.max(fit, next));
      x = px - (px - x) * (next / s);
      y = py - (py - y) * (next / s);
      s = next;
      clamp();
      render(animate);
    }

    function reset(animate) {
      measure();
      s = fit;
      clamp();
      render(animate);
    }

    function stagePoint(clientX, clientY) {
      const r = stage.getBoundingClientRect();
      return [clientX - r.left, clientY - r.top];
    }

    function onImage(clientX, clientY) {
      const r = img.getBoundingClientRect();
      return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
    }

    // Tap or click: zoom in on that point, or back out to fit.
    function toggleAt(px, py) {
      if (s > fit * 1.01) reset(true);
      else zoomTo(Math.min(maxS, Math.max(fit * 2.5, 1)), px, py, true);
    }

    function centre() {
      return [stage.clientWidth / 2, stage.clientHeight / 2];
    }

    // ── Pointer handling (touch, mouse and pen alike) ───────────────────────

    const pointers = new Map();   // id -> {x, y}
    let gesture = null;           // {kind: "pan"|"pinch", ...}
    let tapStart = null;          // {x, y, t, type} of a pointer that may be a tap
    let lastTap = null;           // {x, y, t} of the previous touch tap

    function startGesture() {
      const pts = [...pointers.values()];
      if (pts.length >= 2) {
        const [a, b] = pts;
        gesture = {
          kind: "pinch",
          dist: Math.hypot(b.x - a.x, b.y - a.y) || 1,
          mid: stagePoint((a.x + b.x) / 2, (a.y + b.y) / 2),
          s, x, y,
        };
      } else if (pts.length === 1) {
        gesture = { kind: "pan", sx: pts[0].x, sy: pts[0].y, x, y };
      } else {
        gesture = null;
      }
    }

    stage.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      stage.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      tapStart = pointers.size === 1
        ? { x: e.clientX, y: e.clientY, t: Date.now(), type: e.pointerType }
        : null;   // a second finger means it's not a tap
      startGesture();
      e.preventDefault();
    });

    stage.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (tapStart && Math.hypot(e.clientX - tapStart.x, e.clientY - tapStart.y) > TAP_MOVE) tapStart = null;
      if (!gesture) return;

      if (gesture.kind === "pinch") {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        const mid = stagePoint((a.x + b.x) / 2, (a.y + b.y) / 2);
        const next = Math.min(maxS, Math.max(fit, gesture.s * (dist / gesture.dist)));
        // Scale about the starting midpoint, then follow the midpoint as it moves.
        x = mid[0] - (gesture.mid[0] - gesture.x) * (next / gesture.s);
        y = mid[1] - (gesture.mid[1] - gesture.y) * (next / gesture.s);
        s = next;
      } else {
        const p = pointers.get(e.pointerId);
        x = gesture.x + (p.x - gesture.sx);
        y = gesture.y + (p.y - gesture.sy);
      }
      clamp();
      render(false);
    });

    function pointerEnd(e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      const tap = e.type === "pointerup" && tapStart && pointers.size === 0 ? tapStart : null;
      tapStart = null;
      startGesture();   // e.g. pinch -> pan with the finger still down
      if (tap) handleTap(tap, e);
    }
    stage.addEventListener("pointerup", pointerEnd);
    stage.addEventListener("pointercancel", pointerEnd);

    function handleTap(tap, e) {
      const [px, py] = stagePoint(e.clientX, e.clientY);
      const hitImage = onImage(e.clientX, e.clientY);

      if (tap.type === "mouse") {
        if (hitImage) toggleAt(px, py);
        else if (s <= fit * 1.01) close();
        return;
      }

      // Touch: a double tap zooms. A single tap on the dark area around the
      // image closes, but only at fit size, so a stray touch while looking
      // closely never throws you out.
      const now = Date.now();
      if (lastTap && now - lastTap.t < DOUBLE_TAP_MS && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 40) {
        lastTap = null;
        toggleAt(px, py);
        return;
      }
      lastTap = { x: e.clientX, y: e.clientY, t: now };
      if (!hitImage && s <= fit * 1.01) {
        const t = lastTap;
        setTimeout(() => { if (lastTap === t && open) close(); }, DOUBLE_TAP_MS);
      }
    }

    // Mouse wheel and trackpad pinch (which arrives as a wheel event with ctrlKey).
    stage.addEventListener("wheel", (e) => {
      e.preventDefault();
      const [px, py] = stagePoint(e.clientX, e.clientY);
      const k = e.ctrlKey ? 0.01 : 0.0025;
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      zoomTo(s * Math.exp(-dy * k), px, py, false);
    }, { passive: false });

    // Safari's own page-zoom gestures would fight ours.
    ["gesturestart", "gesturechange"].forEach((t) =>
      overlay.addEventListener(t, (e) => e.preventDefault()));
    overlay.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

    // ── Buttons and keys ───────────────────────────────────────────────────

    closeBtn.addEventListener("click", () => close());
    zoomInBtn.addEventListener("click", () => { const [cx, cy] = centre(); zoomTo(s * 1.6, cx, cy, true); });
    zoomOutBtn.addEventListener("click", () => { const [cx, cy] = centre(); zoomTo(s / 1.6, cx, cy, true); });
    if (prevBtn) prevBtn.addEventListener("click", () => opts.onNav(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => opts.onNav(1));

    document.addEventListener("keydown", (e) => {
      if (!open || e.metaKey || e.ctrlKey || e.altKey) return;
      const [cx, cy] = centre();
      if (e.key === "Escape") close();
      else if (e.key === "+" || e.key === "=") zoomTo(s * 1.6, cx, cy, true);
      else if (e.key === "-" || e.key === "_") zoomTo(s / 1.6, cx, cy, true);
      else if (e.key === "0") reset(true);
      else if (opts.onNav && e.key === "ArrowLeft") opts.onNav(-1);
      else if (opts.onNav && e.key === "ArrowRight") opts.onNav(1);
      else return;
      e.preventDefault();
    });

    window.addEventListener("resize", () => {
      if (!open) return;
      const wasFit = s <= fit * 1.01;
      measure();
      if (wasFit) s = fit;
      s = Math.min(maxS, Math.max(fit, s));
      clamp();
      render(false);
    });

    // ── Showing ────────────────────────────────────────────────────────────

    // work: {full, thumb, w, h, alt, title, meta}
    function show(w) {
      work = w;
      // Show the (already cached) thumbnail stretched to size at once, then
      // swap in the full image. Both have the same proportions.
      img.src = w.thumb || w.full;
      img.alt = w.alt || "";
      img.style.width = w.w + "px";
      img.style.height = w.h + "px";
      if (w.thumb && w.thumb !== w.full) {
        const full = new Image();
        full.onload = () => { if (work === w) img.src = w.full; };
        full.src = w.full;
      }
      titleEl.textContent = w.title || "";
      metaEl.textContent = w.meta || "";

      if (!open) {
        open = true;
        lastFocus = document.activeElement;
        overlay.classList.add("active");
        document.documentElement.classList.add("viewer-open");
        overlay.focus({ preventScroll: true });
        showHint();
      }
      pointers.clear();
      gesture = null;
      reset(false);
    }

    function close() {
      if (!open) return;
      open = false;
      overlay.classList.remove("active");
      document.documentElement.classList.remove("viewer-open");
      img.removeAttribute("src");
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      if (opts.onClose) opts.onClose();
    }

    // A one-time hint so people know the image zooms.
    function showHint() {
      let seen = false;
      try { seen = sessionStorage.getItem("viewer-hint") === "1"; } catch (_) {}
      if (seen) return;
      const touch = window.matchMedia("(pointer: coarse)").matches;
      hint.textContent = touch ? "Pinch or double-tap to zoom" : "Click or scroll to zoom";
      hint.classList.add("show");
      setTimeout(() => hint.classList.remove("show"), 2600);
      try { sessionStorage.setItem("viewer-hint", "1"); } catch (_) {}
    }

    return { show, close, isOpen: () => open };
  }

  window.ArtworkViewer = Viewer;
})();
