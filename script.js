document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");
  const langToggle = document.getElementById("langToggle");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const sectionLinks = document.querySelectorAll(".nav-links a[href^='#']");
  const sections = document.querySelectorAll("main section[id]");
  const backToTop = document.getElementById("backToTop");
  const scrollProgress = document.getElementById("scrollProgress");
  let currentLang = "fr";

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  function setLanguage(lang) {
    document.querySelectorAll('[data-lang="fr"]').forEach((element) => {
      element.style.display = lang === "fr" ? "" : "none";
    });

    document.querySelectorAll('[data-lang="en"]').forEach((element) => {
      element.style.display = lang === "en" ? "" : "none";
    });

    currentLang = lang;
    document.documentElement.lang = lang;

    if (langToggle) {
      langToggle.textContent = lang === "fr" ? "EN" : "FR";
      langToggle.setAttribute(
        "aria-label",
        lang === "fr" ? "Switch to English" : "Passer en français"
      );
    }
  }

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      setLanguage(currentLang === "fr" ? "en" : "fr");
    });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  sectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks) navLinks.classList.remove("open");
      if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    });
  });

  function setActiveNav() {
    let currentSectionId = "";

    sections.forEach((section) => {
      const top = section.offsetTop - 160;
      const bottom = top + section.offsetHeight;

      if (window.scrollY >= top && window.scrollY < bottom) {
        currentSectionId = section.getAttribute("id");
      }
    });

    sectionLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentSectionId}`);
    });
  }

  function updateScrollProgress() {
    if (!scrollProgress) return;

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  }

  function toggleBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle("show", window.scrollY > 520);
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function handleScroll() {
    setActiveNav();
    updateScrollProgress();
    toggleBackToTop();
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", () => {
    setActiveNav();
    drawHeroCanvas();
  });

  setLanguage("fr");
  setActiveNav();
  updateScrollProgress();
  toggleBackToTop();
  drawHeroCanvas();
});

function drawHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const container = canvas.parentElement;
  const rect = container.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(320, rect.width);
  const height = Math.max(300, rect.height);

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);

  const points = [
    [0.12, 0.28], [0.28, 0.18], [0.48, 0.28], [0.72, 0.2], [0.88, 0.34],
    [0.18, 0.68], [0.36, 0.56], [0.58, 0.68], [0.78, 0.58], [0.92, 0.76],
  ].map(([x, y]) => ({ x: x * width, y: y * height }));

  context.lineWidth = 1;
  context.strokeStyle = "rgba(110, 231, 216, 0.2)";

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];
    const next = points[(index + 3) % points.length];
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(next.x, next.y);
    context.stroke();
  }

  points.forEach((point, index) => {
    const radius = index % 3 === 0 ? 5 : 3.5;
    const gradient = context.createRadialGradient(point.x - 2, point.y - 2, 1, point.x, point.y, radius * 3);
    gradient.addColorStop(0, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.45, "rgba(110,231,216,0.85)");
    gradient.addColorStop(1, "rgba(155,124,255,0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(point.x, point.y, radius * 3, 0, Math.PI * 2);
    context.fill();
  });
}
