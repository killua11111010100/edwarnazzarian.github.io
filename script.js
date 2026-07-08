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
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  function setLanguage(lang) {
    const frElements = document.querySelectorAll('[data-lang="fr"]');
    const enElements = document.querySelectorAll('[data-lang="en"]');

    if (lang === "fr") {
      frElements.forEach((el) => {
        el.style.display = "";
      });

      enElements.forEach((el) => {
        el.style.display = "none";
      });

      if (langToggle) {
        langToggle.textContent = "EN";
      }

      document.documentElement.lang = "fr";
    } else {
      frElements.forEach((el) => {
        el.style.display = "none";
      });

      enElements.forEach((el) => {
        el.style.display = "";
      });

      if (langToggle) {
        langToggle.textContent = "FR";
      }

      document.documentElement.lang = "en";
    }

    currentLang = lang;
  }

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      setLanguage(currentLang === "fr" ? "en" : "fr");
    });
  }

  setLanguage("fr");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  sectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks) {
        navLinks.classList.remove("open");
      }
    });
  });

  function setActiveNav() {
    let currentSectionId = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSectionId = section.getAttribute("id");
      }
    });

    sectionLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");

      if (href === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  }

  function updateScrollProgress() {
    if (!scrollProgress) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    scrollProgress.style.width = `${progress}%`;
  }

  function toggleBackToTop() {
    if (!backToTop) return;

    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  function handleScroll() {
    setActiveNav();
    updateScrollProgress();
    toggleBackToTop();
  }

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", setActiveNav);

  setActiveNav();
  updateScrollProgress();
  toggleBackToTop();
});
