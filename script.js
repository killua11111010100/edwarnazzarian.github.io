document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");
  const langToggle = document.getElementById("langToggle");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const sectionLinks = document.querySelectorAll(".nav-links a[href^='#']");
  const sections = document.querySelectorAll("main section[id]");

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
      langToggle.textContent = "EN";
      document.documentElement.lang = "fr";
    } else {
      frElements.forEach((el) => {
        el.style.display = "none";
      });
      enElements.forEach((el) => {
        el.style.display = "";
      });
      langToggle.textContent = "FR";
      document.documentElement.lang = "en";
    }

    currentLang = lang;
  }

  langToggle.addEventListener("click", () => {
    setLanguage(currentLang === "fr" ? "en" : "fr");
  });

  setLanguage("fr");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  sectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });

  function setActiveNav() {
    let currentSectionId = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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

  window.addEventListener("scroll", setActiveNav);
  setActiveNav();
});
