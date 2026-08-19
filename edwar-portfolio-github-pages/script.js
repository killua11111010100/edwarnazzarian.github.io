document.addEventListener("DOMContentLoaded", () => {
  const EMAIL = "edwarnazzarian75@gmail.com";
  const root = document.documentElement;
  const menuToggle = document.getElementById("menuToggle");
  const menuPanel = document.getElementById("primary-navigation");
  const menuScrim = document.getElementById("menuScrim");
  const themeToggle = document.getElementById("themeToggle");
  const scrollProgress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");
  const copyEmailButton = document.getElementById("copyEmail");
  const copyStatus = document.getElementById("copyStatus");
  const lightbox = document.getElementById("lightbox");
  const lightboxPanel = lightbox?.querySelector(".lightbox-panel");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const languageButtons = document.querySelectorAll("[data-language]");
  const sectionLinks = document.querySelectorAll("[data-section-link]");
  const sections = document.querySelectorAll("main section[id]");
  const lightboxTriggers = document.querySelectorAll("[data-lightbox-src]");

  let currentLanguage = readPreference("portfolio-language", "fr");
  let currentTheme = readPreference("portfolio-theme", "dark");
  let activeLightboxTrigger = null;
  let scrollFrame = 0;

  function readPreference(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value || fallback;
    } catch {
      return fallback;
    }
  }

  function savePreference(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // The portfolio still works when browser storage is unavailable.
    }
  }

  function localizedValue(element, key) {
    if (!element) return "";
    return element.dataset[`${key}${currentLanguage === "fr" ? "Fr" : "En"}`] || "";
  }

  function setLanguage(language) {
    currentLanguage = language === "en" ? "en" : "fr";
    root.lang = currentLanguage;

    document.querySelectorAll("[data-lang]").forEach((element) => {
      element.hidden = element.dataset.lang !== currentLanguage;
    });

    languageButtons.forEach((button) => {
      const active = button.dataset.language === currentLanguage;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-label-fr][data-label-en]").forEach((element) => {
      element.setAttribute("aria-label", localizedValue(element, "label"));
    });

    document.querySelectorAll("img[data-alt-fr][data-alt-en]").forEach((image) => {
      image.alt = localizedValue(image, "alt");
    });

    lightboxTriggers.forEach((trigger) => {
      const action = currentLanguage === "fr" ? "Agrandir la capture" : "Enlarge screenshot";
      trigger.setAttribute("aria-label", `${action} — ${localizedValue(trigger, "caption")}`);
    });

    document.title = currentLanguage === "fr"
      ? "Edwar Nazzarian — Développeur logiciel Full-Stack"
      : "Edwar Nazzarian — Full-Stack Software Developer";

    savePreference("portfolio-language", currentLanguage);
    closeMenu(false);
  }

  function setTheme(theme) {
    currentTheme = theme === "light" ? "light" : "dark";
    root.dataset.theme = currentTheme;
    const icon = themeToggle?.querySelector("span");
    if (icon) icon.textContent = currentTheme === "dark" ? "☼" : "◐";

    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute("content", currentTheme === "dark" ? "#07100f" : "#f2f1e9");
    savePreference("portfolio-theme", currentTheme);
  }

  function setMenu(open) {
    if (!menuToggle || !menuPanel || !menuScrim) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuPanel.classList.toggle("is-open", open);
    menuScrim.classList.toggle("is-open", open);
    menuToggle.setAttribute(
      "aria-label",
      open
        ? currentLanguage === "fr" ? "Fermer le menu" : "Close menu"
        : currentLanguage === "fr" ? "Ouvrir le menu" : "Open menu",
    );
  }

  function closeMenu(returnFocus = false) {
    const wasOpen = menuToggle?.getAttribute("aria-expanded") === "true";
    setMenu(false);
    if (returnFocus && wasOpen) menuToggle?.focus();
  }

  function updateScrollState() {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(() => {
      const availableHeight = root.scrollHeight - window.innerHeight;
      const progress = availableHeight > 0 ? (window.scrollY / availableHeight) * 100 : 0;
      if (scrollProgress) scrollProgress.style.width = `${progress}%`;
      backToTop?.classList.toggle("is-visible", window.scrollY > 650);
    });
  }

  function openLightbox(trigger) {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    activeLightboxTrigger = trigger;
    lightboxImage.src = trigger.dataset.lightboxSrc || "";
    lightboxImage.alt = localizedValue(trigger, "alt");
    lightboxCaption.textContent = localizedValue(trigger, "caption");
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => lightboxClose?.focus(), 0);
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.removeProperty("overflow");
    if (lightboxImage) lightboxImage.src = "";
    activeLightboxTrigger?.focus();
    activeLightboxTrigger = null;
  }

  async function copyEmail() {
    let success = false;

    try {
      await navigator.clipboard.writeText(EMAIL);
      success = true;
    } catch {
      const temporaryInput = document.createElement("textarea");
      temporaryInput.value = EMAIL;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      success = document.execCommand("copy");
      temporaryInput.remove();
    }

    if (!success) {
      window.location.href = `mailto:${EMAIL}`;
      return;
    }

    const defaultLabel = copyEmailButton?.querySelector("[data-copy-default]");
    const successLabel = copyEmailButton?.querySelector("[data-copy-success]");
    const icon = copyEmailButton?.querySelector("[data-copy-icon]");
    if (defaultLabel) defaultLabel.hidden = true;
    if (successLabel) successLabel.hidden = false;
    if (icon) icon.textContent = "✓";
    if (copyStatus) copyStatus.textContent = currentLanguage === "fr" ? "Courriel copié" : "Email copied";

    window.setTimeout(() => {
      if (defaultLabel) defaultLabel.hidden = false;
      if (successLabel) successLabel.hidden = true;
      if (icon) icon.textContent = "□";
      if (copyStatus) copyStatus.textContent = "";
    }, 2200);
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });

  themeToggle?.addEventListener("click", () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });

  menuToggle?.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  menuScrim?.addEventListener("click", () => closeMenu(true));
  sectionLinks.forEach((link) => link.addEventListener("click", () => closeMenu(false)));

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  copyEmailButton?.addEventListener("click", copyEmail);
  lightboxTriggers.forEach((trigger) => trigger.addEventListener("click", () => openLightbox(trigger)));
  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("mousedown", closeLightbox);
  lightboxPanel?.addEventListener("mousedown", (event) => event.stopPropagation());

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (lightbox && !lightbox.hidden) closeLightbox();
      else closeMenu(true);
    }

    if (event.key === "Tab" && lightbox && !lightbox.hidden) {
      event.preventDefault();
      lightboxClose?.focus();
    }
  });

  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", updateScrollState);

  if ("IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        sectionLinks.forEach((link) => {
          const active = link.dataset.sectionLink === visible.target.id;
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-30% 0px -58%", threshold: [0, 0.2, 0.55] },
    );
    sections.forEach((section) => activeObserver.observe(section));

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealElements = document.querySelectorAll("[data-reveal]");
    if (reducedMotion) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
    } else {
      root.classList.add("reveal-ready");
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12 },
      );
      revealElements.forEach((element) => revealObserver.observe(element));
    }
  } else {
    document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
  }

  setTheme(currentTheme);
  setLanguage(currentLanguage);
  setMenu(false);
  updateScrollState();
});
