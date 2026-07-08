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

  if (window.lucide) {
    window.lucide.createIcons();
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.13 }
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
      const sectionTop = section.offsetTop - 160;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        currentSectionId = section.getAttribute("id");
      }
    });

    sectionLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentSectionId}`);
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
    backToTop.classList.toggle("show", window.scrollY > 500);
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
  window.addEventListener("resize", setActiveNav);

  setLanguage("fr");
  setActiveNav();
  updateScrollProgress();
  toggleBackToTop();
  initHeroScene();
});

async function initHeroScene() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  let THREE;
  try {
    THREE = await import("https://unpkg.com/three@0.165.0/build/three.module.js");
  } catch (error) {
    const context = canvas.getContext("2d");
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = Math.max(320, rect.width);
    canvas.height = Math.max(320, rect.height);

    context.fillStyle = "#101722";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(36, 211, 181, 0.65)";
    context.lineWidth = 2;
    context.strokeRect(canvas.width * 0.24, canvas.height * 0.2, canvas.width * 0.52, canvas.height * 0.44);
    context.fillStyle = "#f7f9fc";
    context.font = "700 18px Inter, sans-serif";
    context.fillText("3D ready portfolio", canvas.width * 0.29, canvas.height * 0.45);
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.6, 7.3);

  const group = new THREE.Group();
  scene.add(group);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(4, 6, 5);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x24d3b5, 3.2, 16);
  fillLight.position.set(-3.8, -1.2, 4.5);
  scene.add(fillLight);

  const amberLight = new THREE.PointLight(0xf3b860, 2.8, 12);
  amberLight.position.set(3.2, 1.7, 2.4);
  scene.add(amberLight);

  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0x182230,
    metalness: 0.62,
    roughness: 0.28,
    emissive: 0x07120f,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x24d3b5,
    metalness: 0.18,
    roughness: 0.18,
    transmission: 0.35,
    thickness: 0.5,
    transparent: true,
    opacity: 0.8,
  });

  const amberMaterial = new THREE.MeshStandardMaterial({
    color: 0xf3b860,
    emissive: 0x201306,
    metalness: 0.3,
    roughness: 0.36,
  });

  const cube = new THREE.Mesh(new THREE.BoxGeometry(2.35, 2.35, 2.35), coreMaterial);
  cube.rotation.set(0.7, 0.45, 0.2);
  group.add(cube);

  const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(1.55, 0.055, 170, 12), glassMaterial);
  group.add(torus);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.022, 12, 130), amberMaterial);
  ring.rotation.set(Math.PI / 2.8, 0.2, 0.1);
  group.add(ring);

  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: 0x6aa8ff,
    emissive: 0x071122,
    metalness: 0.35,
    roughness: 0.3,
  });

  const nodeGeometry = new THREE.SphereGeometry(0.08, 24, 24);
  const nodes = [];

  for (let index = 0; index < 42; index += 1) {
    const angle = (index / 42) * Math.PI * 2;
    const radius = 2.7 + Math.sin(index * 1.7) * 0.42;
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set(
      Math.cos(angle) * radius,
      Math.sin(index * 0.9) * 1.18,
      Math.sin(angle) * radius
    );
    nodes.push(node);
    group.add(node);
  }

  const linePositions = [];
  nodes.forEach((node, index) => {
    const next = nodes[(index + 7) % nodes.length];
    linePositions.push(
      node.position.x,
      node.position.y,
      node.position.z,
      next.position.x,
      next.position.y,
      next.position.z
    );
  });

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(
    lineGeometry,
    new THREE.LineBasicMaterial({ color: 0x24d3b5, transparent: true, opacity: 0.24 })
  );
  group.add(lines);

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = Math.max(320, rect.width);
    const height = Math.max(320, rect.height);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const clock = new THREE.Clock();

  function render() {
    const elapsed = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      group.rotation.y = elapsed * 0.22;
      group.rotation.x = Math.sin(elapsed * 0.45) * 0.16;
      torus.rotation.y = elapsed * 0.55;
      torus.rotation.x = elapsed * 0.32;
      ring.rotation.z = elapsed * 0.2;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  resize();
  window.addEventListener("resize", resize);
  render();
}
