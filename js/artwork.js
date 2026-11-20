// Single-artwork page: click or tap the image to open it in the full-screen
// zoom viewer (js/viewer.js). Arrow keys move between artworks.

(function () {
  const img = document.getElementById("artwork-img");
  if (!img || !window.ArtworkViewer) return;

  const caption = document.querySelector(".artwork-caption");
  const work = {
    full: img.getAttribute("src"),
    w: Number(img.getAttribute("width")),
    h: Number(img.getAttribute("height")),
    alt: img.alt,
    title: caption ? caption.querySelector("h1").textContent : "",
    meta: caption && caption.querySelector("p") ? caption.querySelector("p").textContent : "",
  };

  const viewer = window.ArtworkViewer({
    onClose: () => img.focus({ preventScroll: true }),
  });

  img.tabIndex = 0;
  img.setAttribute("role", "button");
  img.setAttribute("aria-label", "View larger: " + work.title);
  img.addEventListener("click", () => viewer.show(work));
  img.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      viewer.show(work);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (viewer.isOpen() || e.metaKey || e.ctrlKey || e.altKey) return;
    const link =
      e.key === "ArrowLeft" ? document.getElementById("artwork-prev") :
      e.key === "ArrowRight" ? document.getElementById("artwork-next") : null;
    if (link) location.href = link.href;
  });
})();
