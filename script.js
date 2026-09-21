/* Attendre que le HTML soit chargé avant d'initialiser les interactions. */
document.addEventListener("DOMContentLoaded", () => {
  /* Références aux éléments utilisés par les fonctionnalités du portfolio. */
  const root = document.documentElement;
  const languageButtons = [...document.querySelectorAll("[data-language]")];
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const character = document.getElementById("heroCharacter");
  const auraTrigger = document.getElementById("auraTrigger");
  const progress = document.getElementById("scrollLine");
  const header = document.querySelector(".site-header");
  const navLinks = [...document.querySelectorAll('.nav-pill a[href^="#"]')];
  const asta = document.querySelector(".contact-character");
  let language = "fr";
  try {
    language = localStorage.getItem("portfolio-language") || "fr";
  } catch {}

  /* Afficher la langue choisie et mémoriser la préférence du visiteur. */
  function setLanguage(next) {
    language = next === "en" ? "en" : "fr";
    root.lang = language;
    document.querySelectorAll("[data-lang]").forEach((el) => {
      el.hidden = el.dataset.lang !== language;
    });
    languageButtons.forEach((button) =>
      button.classList.toggle(
        "is-active",
        button.dataset.language === language,
      ),
    );
    if (auraTrigger)
      auraTrigger.setAttribute(
        "aria-label",
        language === "fr"
          ? auraTrigger.dataset.labelFr
          : auraTrigger.dataset.labelEn,
      );
    document.title =
      language === "fr"
        ? "Edwar Nazzarian — Développeur logiciel"
        : "Edwar Nazzarian — Software Developer";
    try {
      localStorage.setItem("portfolio-language", language);
    } catch {}
  }

  /* Gestion du changement de langue. */
  languageButtons.forEach((button) =>
    button.addEventListener("click", () =>
      setLanguage(button.dataset.language),
    ),
  );
  setLanguage(language);

  /* Animations d'apparition déclenchées lorsque les éléments entrent dans la fenêtre. */
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduced) {
    root.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
  } else
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => el.classList.add("is-visible"));

  /* Préparer les transitions et le suivi de la section active. */
  const scenes = [...document.querySelectorAll("main > section")];
  scenes.forEach((scene) => {
    scene.classList.add("scroll-scene");
    const sweep = document.createElement("span");
    sweep.className = "scene-transition";
    sweep.setAttribute("aria-hidden", "true");
    scene.prepend(sweep);
  });
  if (scenes.length) {
    root.classList.add("scene-ready");
    scenes[0].classList.add("is-scene-active");
  }
  if ("IntersectionObserver" in window && !reduced) {
    const sceneObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            "is-scene-active",
            entry.isIntersecting,
          );
          if (entry.isIntersecting) {
            const activeLink = navLinks.find(
              (link) => link.getAttribute("href") === `#${entry.target.id}`,
            );
            if (activeLink)
              navLinks.forEach((link) =>
                link.classList.toggle("is-current", link === activeLink),
              );
          }
        }),
      { threshold: 0.08, rootMargin: "-6% 0px -8%" },
    );
    scenes.forEach((scene) => sceneObserver.observe(scene));
  } else scenes.forEach((scene) => scene.classList.add("is-scene-active"));

  /* Donner un léger mouvement à l'illustration principale sur grand écran. */
  document.addEventListener("pointermove", (event) => {
    if (!character || reduced || innerWidth < 800) return;
    const x = (event.clientX / innerWidth - 0.5) * -12;
    const y = (event.clientY / innerHeight - 0.5) * -9;
    character.style.transform = `translate3d(${x}px,${y}px,0) rotateY(${x * 0.3}deg)`;
  });

  /* Déclencher temporairement l'aura du personnage du hero. */
  let auraTimer = 0;
  auraTrigger?.addEventListener("click", () => {
    window.clearTimeout(auraTimer);
    character.classList.remove("is-awakened");
    auraTrigger.classList.remove("is-active");
    void character.offsetWidth;
    character.classList.add("is-awakened");
    auraTrigger.classList.add("is-active");
    auraTimer = window.setTimeout(() => {
      character.classList.remove("is-awakened");
      auraTrigger.classList.remove("is-active");
    }, 2700);
  });

  /* Mettre à jour la barre de progression et l'état visuel de l'en-tête. */
  function updateProgress() {
    const height = document.documentElement.scrollHeight - innerHeight;
    if (progress)
      progress.style.width = `${height > 0 ? (scrollY / height) * 100 : 0}%`;
    header?.classList.toggle("is-scrolled", scrollY > 56);
  }
  addEventListener("scroll", updateProgress, { passive: true });
  addEventListener("resize", updateProgress);
  updateProgress();

  /* Déclencher temporairement l'animation du personnage de contact. */
  let astaTimer = 0;
  asta?.addEventListener("click", () => {
    window.clearTimeout(astaTimer);
    asta.classList.remove("is-unleashed");
    void asta.offsetWidth;
    asta.classList.add("is-unleashed");
    astaTimer = window.setTimeout(
      () => asta.classList.remove("is-unleashed"),
      2200,
    );
  });

  /* Ouvrir les aperçus d'images dans la lightbox. */
  document.querySelectorAll("[data-lightbox-src]").forEach((trigger) =>
    trigger.addEventListener("click", () => {
      if (!lightbox || !lightboxImage || !lightboxCaption) return;
      lightboxImage.src = trigger.dataset.lightboxSrc;
      lightboxImage.alt = trigger.querySelector("img")?.alt || "";
      lightboxCaption.textContent =
        language === "fr"
          ? trigger.dataset.captionFr
          : trigger.dataset.captionEn;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lightboxClose?.focus();
    }),
  );
  /* Fermer la lightbox et restaurer le défilement de la page. */
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.removeProperty("overflow");
    if (lightboxImage) lightboxImage.src = "";
  }
  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
  /* Revenir au début de la page depuis le pied de page. */
  document
    .getElementById("backToTop")
    ?.addEventListener("click", () =>
      scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }),
    );
});
