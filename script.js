// Smooth WOW animations (no libraries)

function setActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(a => {
    const href = (a.getAttribute("href") || "").trim();
    a.classList.toggle("active", href === path);
  });
}

function revealOnScroll() {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

function pageFadeIn() {
  const page = document.querySelector(".page");
  if (!page) return;
  requestAnimationFrame(() => page.classList.add("ready"));
}

// OPTIONAL: fade-out when clicking internal links
function pageFadeOutLinks() {
  const page = document.querySelector(".page");
  if (!page) return;

  document.querySelectorAll("a").forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;

    const isInternal = href.endsWith(".html") && !href.startsWith("http");
    if (!isInternal) return;

    a.addEventListener("click", (ev) => {
      // Allow new tab / modified clicks
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;

      ev.preventDefault();
      page.classList.remove("ready");
      setTimeout(() => window.location.href = href, 160);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  revealOnScroll();
  pageFadeIn();
  pageFadeOutLinks();
});
