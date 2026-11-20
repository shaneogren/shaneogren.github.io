// Gallery: open artworks in the full-screen viewer (js/viewer.js).
//
// The grid is plain HTML written by build.mjs, and each item links to that
// artwork's own page, which is what search engines and no-script visitors get.
// This script upgrades those links to open the viewer in place.
//
// While the viewer is open the address is the gallery plus #<slug>
// (e.g. /#round-rest). So refreshing, or sharing the link, reopens the same
// viewer instead of switching to the artwork's separate page, and Back closes it.

(function () {
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  if (!items.length || !window.ArtworkViewer) return;

  const works = items.map((a) => {
    const url = a.getAttribute("href");
    return {
      url,
      slug: url.replace(/\/$/, "").split("/").pop(),
      full: a.dataset.full,
      w: Number(a.dataset.w),
      h: Number(a.dataset.h),
      thumb: a.querySelector("img").getAttribute("src"),
      alt: a.querySelector("img").alt,
      title: a.dataset.title,
      meta: a.dataset.meta,
    };
  });

  const galleryUrl = location.pathname + location.search;
  const galleryTitle = document.title;
  let current = -1;
  let pushed = false;   // did we add the history entry the viewer is sitting on?

  const viewer = window.ArtworkViewer({
    onNav: (dir) => navigate(dir),
    onClose: () => {
      document.title = galleryTitle;
      const item = items[current];
      current = -1;
      if (pushed) {
        pushed = false;
        history.back();
      } else if (location.hash) {
        history.replaceState(null, "", galleryUrl);
      }
      if (item) item.focus({ preventScroll: true });
    },
  });

  function show(index) {
    current = index;
    const w = works[index];
    viewer.show(w);
    document.title = w.title + " — Shane Ogren";
    // Keep the grid lined up with what's being viewed, for when it closes.
    items[index].scrollIntoView({ block: "nearest" });
  }

  function navigate(dir) {
    const index = (current + dir + works.length) % works.length;
    show(index);
    history.replaceState(null, "", "#" + works[index].slug);
  }

  // Which artwork does the current #hash name? Numbers (#7) are an older form.
  function fromHash() {
    const val = decodeURIComponent(location.hash.slice(1));
    if (!val) return -1;
    if (/^\d+$/.test(val)) return Math.min(parseInt(val, 10), works.length - 1);
    let i = works.findIndex((w) => w.slug === val);
    if (i === -1) i = works.findIndex((w) => w.full.endsWith("/" + val + ".webp"));
    return i;
  }

  items.forEach((a, i) => {
    a.addEventListener("click", (e) => {
      // Let the browser handle open-in-new-tab and similar.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      history.pushState(null, "", "#" + works[i].slug);
      pushed = true;
      show(i);
    });
  });

  // Back / forward between the gallery and an open artwork.
  window.addEventListener("popstate", () => {
    const i = fromHash();
    if (i !== -1) {
      if (i !== current) show(i);
    } else if (viewer.isOpen()) {
      pushed = false;   // the browser has already left the entry
      viewer.close();
    }
  });

  // Arriving with #slug (a refresh or a shared link): open it, and let Close
  // drop the hash rather than leave the site.
  const start = fromHash();
  if (start !== -1) {
    history.replaceState(null, "", "#" + works[start].slug);
    show(start);
  }
})();
