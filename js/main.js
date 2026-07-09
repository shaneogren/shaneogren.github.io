function initGallery(artworks) {
  const container = document.getElementById("gallery");
  if (!container || !artworks || artworks.length === 0) return;

  let currentIndex = 0;

  // Derive a slug from an image path: "images/painting/foo.webp" → "foo"
  function slugOf(art) {
    return art.image.replace(/.*\/([^/]+)\.webp$/, "$1");
  }

  // ── Render gallery grid ──────────────────────────────────────────────────

  artworks.forEach((art, i) => {
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.setAttribute("data-id", slugOf(art));

    const thumbSrc = art.image.replace(/(images\/[^/]+\/)/, "$1thumb/");
    const meta = [art.year, art.medium, art.dimensions].filter(Boolean).join(" · ");

    item.innerHTML = `
      <img src="${thumbSrc}" alt="${art.title}" loading="lazy" draggable="false">
      <div class="artwork-info">
        <div class="artwork-title">${art.title}</div>
        <div class="artwork-meta">${meta}</div>
      </div>
    `;

    item.addEventListener("click", () => openLightbox(i));
    container.appendChild(item);
  });

  // ── Image protection ─────────────────────────────────────────────────────

  document.addEventListener("contextmenu", (e) => {
    if (e.target.tagName === "IMG" || e.target.tagName === "CANVAS") {
      e.preventDefault();
    }
  });

  document.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "IMG") e.preventDefault();
  });

  // ── Lightbox ─────────────────────────────────────────────────────────────

  const overlay      = document.getElementById("lightbox");
  const canvas       = document.getElementById("lightbox-canvas");
  const ctx          = canvas.getContext("2d");
  const titleEl      = document.getElementById("lightbox-title");
  const metaEl       = document.getElementById("lightbox-meta");

  // URL uses numeric index to avoid slug collisions: #7, #42, etc.
  // Incoming slug-based links (e.g. shared from outside) are also supported.
  function indexFromHash(hash) {
    const val = hash.slice(1);
    if (!val) return -1;
    if (/^\d+$/.test(val)) return Math.min(parseInt(val, 10), artworks.length - 1);
    return artworks.findIndex(a => slugOf(a) === val); // fallback: match by slug
  }

  function setHash(index) {
    history.pushState(null, "", "#" + index);
  }

  function openLightbox(index) {
    currentIndex = index;
    renderFrame();
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    setHash(index);
  }

  function closeLightbox() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    history.pushState(null, "", location.pathname);
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + artworks.length) % artworks.length;
    renderFrame();
    setHash(currentIndex);
  }

  window.addEventListener("hashchange", () => {
    const index = indexFromHash(location.hash);
    if (index !== -1) {
      currentIndex = index;
      renderFrame();
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    } else if (overlay.classList.contains("active")) {
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Open directly if page loaded with a hash (defer so canvas is ready)
  if (location.hash) requestAnimationFrame(() => {
    const index = indexFromHash(location.hash);
    if (index !== -1) openLightbox(index);
  });

  function drawToCanvas(img) {
    const maxW = Math.min(window.innerWidth  * 0.88, 960);
    const maxH = Math.min(window.innerHeight * 0.72, 800);
    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);

    canvas.width  = Math.round(img.naturalWidth  * scale);
    canvas.height = Math.round(img.naturalHeight * scale);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const fontSize = Math.max(11, Math.round(canvas.width * 0.022));
    ctx.save();
    ctx.globalAlpha = 0.20;
    ctx.fillStyle = "#ffffff";
    ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("© Shane Ogren", canvas.width - 10, canvas.height - 8);
    ctx.restore();
  }

  function renderFrame() {
    const art = artworks[currentIndex];
    const renderIndex = currentIndex;

    // Paint thumbnail immediately — it's already in the browser cache
    const thumb = new Image();
    thumb.onload = () => drawToCanvas(thumb);
    thumb.src = art.image.replace(/(images\/[^/]+\/)/, "$1thumb/");

    // Upgrade to full image in the background
    const full = new Image();
    full.onload = () => {
      if (currentIndex === renderIndex) drawToCanvas(full);
    };
    full.src = art.image;

    const meta = [art.year, art.medium, art.dimensions].filter(Boolean).join(" · ");
    titleEl.textContent = art.title;
    metaEl.textContent  = meta;
  }

  // Controls
  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", () => navigate(-1));
  document.getElementById("lightbox-next").addEventListener("click", () => navigate(1));

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("active")) return;
    if (e.key === "Escape")      closeLightbox();
    if (e.key === "ArrowLeft")   navigate(-1);
    if (e.key === "ArrowRight")  navigate(1);
  });

  // Touch swipe for mobile
  let touchStartX = 0;
  overlay.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  overlay.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
  });
}
