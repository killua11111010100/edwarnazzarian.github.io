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

(function () {
  const STORAGE_KEY = "site_lang";
  const btn = document.getElementById("langToggle");

  function applyLang(lang) {
    document.querySelectorAll("[data-lang]").forEach(el => {
      el.style.display = (el.getAttribute("data-lang") === lang) ? "" : "none";
    });

    if (btn) btn.textContent = (lang === "fr") ? "EN" : "FR";
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute("lang", lang);
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  applyLang(saved || "fr");

  if (btn) {
    btn.addEventListener("click", () => {
      const current = localStorage.getItem(STORAGE_KEY) || "fr";
      applyLang(current === "fr" ? "en" : "fr");
    });
  }
})();

