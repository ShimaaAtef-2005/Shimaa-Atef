/* ============================================================
   SHAIMAA — DIGITAL LAB PORTFOLIO
   script.js

   TABLE OF CONTENTS:
   1. Config (CHANGE ANIMATION SPEED HERE)
   2. Loader Sequence
   3. Cursor Glow (desktop)
   4. Navigation (scroll + mobile toggle)
   5. Parallax (hero)
   6. Scroll Reveal
   7. Project Modal
   8. Image Lazy Loading
   9. Init
============================================================ */

/* ============================================================
   1. CONFIG
   CHANGE ANIMATION SPEED — edit durations here (milliseconds)
============================================================ */
const CONFIG = {
  loader: {
    // Messages shown during load sequence — CHANGE LOADING MESSAGES
    messages: [
      "Initializing Portfolio...",
      "Loading Creativity...",
      "Loading Experiments...",
      "Ready.",
    ],
    // Time each message stays visible (ms) — CHANGE ANIMATION SPEED
    messageDuration: 620,
    // Delay before hiding loader after "Ready." — CHANGE ANIMATION SPEED
    readyDelay: 400,
  },

  // Parallax intensity (0 = off, higher = more movement)
  // CHANGE ANIMATION SPEED — set to 0 to disable parallax
  parallaxStrength: 0.028,

  // Scroll reveal threshold (0–1, how much of element must be visible)
  revealThreshold: 0.12,
};

const ROLES = [
  "Front-End Developer",
  "React Developer",
  "UI Explorer",
  "Creative Developer",
];
/* ---------- ROLE ROTATION ---------- */
const roleEl = document.getElementById("roleText");
let roleIdx = 0;
setInterval(() => {
  roleEl.classList.add("out");
  setTimeout(() => {
    roleIdx = (roleIdx + 1) % ROLES.length;
    roleEl.textContent = ROLES[roleIdx];
    roleEl.classList.remove("out");
  }, 500);
}, 2600);
/* ============================================================
   2. LOADER SEQUENCE
============================================================ */
function initLoader() {
  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loaderText");
  const loaderBar = document.getElementById("loaderBar");

  if (!loader || !loaderText || !loaderBar) return;

  const { messages, messageDuration, readyDelay } = CONFIG.loader;
  const totalMessages = messages.length;

  let currentIndex = 0;

  // Progress bar advances with each message
  function advance() {
    if (currentIndex >= totalMessages) return;

    loaderText.textContent = messages[currentIndex];
    const progress = ((currentIndex + 1) / totalMessages) * 100;
    loaderBar.style.width = `${progress}%`;

    currentIndex++;

    if (currentIndex < totalMessages) {
      setTimeout(advance, messageDuration);
    } else {
      // All messages shown — reveal the site
      setTimeout(revealSite, readyDelay);
    }
  }

  advance();

  function revealSite() {
    loader.classList.add("hidden");
    document.body.style.overflow = "";
    // Trigger hero reveals after loader fades
    setTimeout(triggerHeroReveal, 300);
  }

  // Prevent scroll while loading
  document.body.style.overflow = "hidden";
}

/* ============================================================
   3. CURSOR GLOW (desktop only)
   CHANGE: Adjust cursor glow size in CSS (.cursor-glow)
============================================================ */
function initCursorGlow() {
  // Only run on devices that support hover
  if (!window.matchMedia("(hover: hover)").matches) return;

  const glow = document.getElementById("cursorGlow");
  if (!glow) return;

  let mouseX = 0,
    mouseY = 0;
  let glowX = 0,
    glowY = 0;
  let rafId = null;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafId) rafId = requestAnimationFrame(animateGlow);
  });

  function animateGlow() {
    // Smooth follow — CHANGE ANIMATION SPEED by adjusting the 0.1 value
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    rafId = requestAnimationFrame(animateGlow);
  }

  // Hide glow when mouse leaves window
  document.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    glow.style.opacity = "1";
  });
}

/* ============================================================
   4. NAVIGATION
============================================================ */
function initNav() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const allLinks = navLinks ? navLinks.querySelectorAll(".nav-link") : [];

  if (!nav) return;

  // Scroll behaviour — add .scrolled class after 60px
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close menu when a link is clicked
    allLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
        document.body.style.overflow = "";
      }
    });
  }
}

/* ============================================================
   5. PARALLAX (Hero)
   CHANGE: Set CONFIG.parallaxStrength to 0 to disable
============================================================ */
function initParallax() {
  if (!window.matchMedia("(hover: hover)").matches) return;
  if (CONFIG.parallaxStrength === 0) return;

  const hero = document.getElementById("hero");
  const content = hero ? hero.querySelector(".hero-content") : null;
  const orbs = hero ? hero.querySelectorAll(".orb") : [];

  if (!hero || !content) return;

  let ticking = false;

  document.addEventListener("mousemove", (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) * CONFIG.parallaxStrength;
      const dy = (e.clientY - cy) * CONFIG.parallaxStrength;

      content.style.transform = `translate(${dx * 0.5}px, ${dy * 0.5}px)`;

      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.6;
        orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px) scale(1)`;
      });

      ticking = false;
    });
  });
}

/* ============================================================
   6. SCROLL REVEAL
   Elements with .reveal-up become visible when scrolled into view
   CHANGE: Adjust CONFIG.revealThreshold (0 = trigger immediately)
============================================================ */
let revealObserver = null;

function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal-up");

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: CONFIG.revealThreshold,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  targets.forEach((el) => revealObserver.observe(el));
}

// Trigger hero section reveals immediately (called after loader)
function triggerHeroReveal() {
  const heroReveals = document.querySelectorAll(".hero .reveal-up");
  heroReveals.forEach((el) => el.classList.add("visible"));
}

/* ============================================================
   7. PROJECT MODAL + IMAGE SLIDER
   Opens when an .experiment card is clicked or Enter/Space pressed.
   Content comes from data-* attributes on each .experiment element.

   IMAGE SLIDER SETUP:
   Add images to each .experiment card using:
     data-images="path/image1.jpg,path/image2.jpg,path/image3.jpg"

   - Separate multiple paths with a comma.
   - Paths are relative to index.html (e.g. "images/project1-a.jpg").
   - If only ONE image is provided, arrows and dots are hidden automatically.
   - You can add as many images as you like — the slider handles them all.

   CHANGE PROJECT DATA: Edit data-* attributes in index.html
============================================================ */
function initModal() {
  const modal = document.getElementById("modal");
  const backdrop = document.getElementById("modalBackdrop");
  const closeBtn = document.getElementById("modalClose");

  if (!modal) return;

  // Static text elements
  const els = {
    imagePlaceholder: document.getElementById("modalImagePlaceholder"),
    id: document.getElementById("modalId"),
    status: document.getElementById("modalStatus"),
    title: document.getElementById("modalTitle"),
    tech: document.getElementById("modalTech"),
    result: document.getElementById("modalResult"),
    challenge: document.getElementById("modalChallenge"),
    solution: document.getElementById("modalSolution"),
    lessons: document.getElementById("modalLessons"),
    link: document.getElementById("modalLink"),
  };

  // Slider elements
  const sliderTrack = document.getElementById("sliderTrack");
  const sliderPrev = document.getElementById("sliderPrev");
  const sliderNext = document.getElementById("sliderNext");
  const sliderDots = document.getElementById("sliderDots");

  let currentIndex = 0;
  let images = [];
  let touchStartX = 0;
  let touchEndX = 0;

  /* ── Build slider from image array ── */
  function buildSlider(imgPaths) {
    images = imgPaths;
    currentIndex = 0;

    // Clear previous slides and dots
    sliderTrack.innerHTML = "";
    sliderDots.innerHTML = "";

    if (images.length === 0) {
      // No images — show placeholder, hide slider controls
      els.imagePlaceholder.style.display = "";
      sliderTrack.style.display = "none";
      sliderPrev.hidden = true;
      sliderNext.hidden = true;
      sliderDots.hidden = true;
      return;
    }

    // Hide placeholder, show track
    els.imagePlaceholder.style.display = "none";
    sliderTrack.style.display = "";

    // Create slides
    images.forEach((src, i) => {
      const slide = document.createElement("div");
      slide.className = "slider-slide";

      const img = document.createElement("img");
      img.src = src.trim();
      img.alt = `Project screenshot ${i + 1}`;
      img.loading = "lazy";
      img.addEventListener("load", () => img.classList.add("loaded"));
      img.addEventListener("error", () => img.classList.add("loaded")); // still show slide on error

      slide.appendChild(img);
      sliderTrack.appendChild(slide);
    });

    // Show/hide controls based on image count
    const multi = images.length > 1;
    sliderPrev.hidden = !multi;
    sliderNext.hidden = !multi;
    sliderDots.hidden = !multi;

    if (multi) {
      // Create dot buttons
      images.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "slider-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Go to image ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        sliderDots.appendChild(dot);
      });
    }

    goTo(0);
  }

  /* ── Navigate to slide index ── */
  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, images.length - 1));
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    sliderDots.querySelectorAll(".slider-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });

    // Update arrow states (optional visual feedback — keep both always clickable with wrap)
    sliderPrev.disabled = false;
    sliderNext.disabled = false;
  }

  function goPrev() {
    goTo((currentIndex - 1 + images.length) % images.length);
  }
  function goNext() {
    goTo((currentIndex + 1) % images.length);
  }

  // Arrow buttons
  sliderPrev.addEventListener("click", goPrev);
  sliderNext.addEventListener("click", goNext);

  // Keyboard arrow navigation inside the modal image area
  document
    .getElementById("modalSliderWrap")
    .addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    });

  // Touch / swipe support
  const sliderWrap = document.getElementById("modalSliderWrap");
  sliderWrap.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );
  sliderWrap.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev();
    },
    { passive: true },
  );

  let lastFocused = null;

  /* ── Open modal and populate with card data ── */
  function openModal(card) {
    lastFocused = document.activeElement;

    const d = card.dataset;

    // Populate text fields
    els.id.textContent = `Experiment ${d.id || "—"}`;
    els.status.textContent = d.status || "";
    els.title.textContent = d.title || "";
    els.tech.textContent = d.tech || "";
    els.result.textContent = d.result || "";
    els.challenge.textContent = d.challenge || "";
    els.solution.textContent = d.solution || "";
    els.lessons.textContent = d.lessons || "";
    els.link.href = d.link && d.link !== "#" ? d.link : "#";
    els.link.style.display = d.link && d.link !== "#" ? "" : "none";

    /* ── IMAGE SLIDER ──
       To add images to a project, set data-images on its .experiment card:
         data-images="images/project1-a.jpg,images/project1-b.jpg"

       Legacy support: if data-image (singular) is set and data-images is not,
       it will be treated as a single-image slider.
    ── */
    let rawImages = d.images || d.image || "";
    const imgPaths = rawImages
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    buildSlider(imgPaths);

    // Show modal
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => modal.classList.add("open"));
    });

    setTimeout(() => closeBtn.focus(), 100);
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => {
      modal.setAttribute("hidden", "");
      const scroll = modal.querySelector(".modal-scroll");
      if (scroll) scroll.scrollTop = 0;
    }, 400);
    if (lastFocused) lastFocused.focus();
  }

  // Attach to all experiment cards
  document.querySelectorAll(".experiment").forEach((card) => {
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  // Trap focus inside modal
  modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusable = modal.querySelectorAll(
      'button:not([hidden]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

/* ============================================================
   8. IMAGE LAZY LOADING
   Slider images handle their own load/error events inside initModal.
   This function keeps graceful fallback for any other lazy images.
============================================================ */
function initImageHandling() {
  // Slider images handle error display themselves via the buildSlider function.
  // This handles any other lazy-loaded images on the page.
  document
    .querySelectorAll('img[loading="lazy"]:not(.slider-slide img)')
    .forEach((img) => {
      img.addEventListener("error", () => {
        img.style.display = "none";
        const placeholder = img.nextElementSibling;
        if (
          placeholder &&
          placeholder.classList.contains("modal-image-placeholder")
        ) {
          placeholder.style.display = "";
        }
      });
    });
}

/* ============================================================
   9. INIT — runs everything when DOM is ready
============================================================ */
function init() {
  initLoader();
  initCursorGlow();
  initNav();
  initParallax();
  initScrollReveal();
  initModal();
  initImageHandling();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
/* ============================================================
   CERTIFICATE MODAL
============================================================ */

function initCertificateModal() {
  const modal = document.getElementById("certModal");

  if (!modal) return;

  const closeBtn = document.getElementById("certModalClose");

  const backdrop = document.getElementById("certModalBackdrop");

  const cards = document.querySelectorAll(".journey-card--certificate");

  function openModal() {
    modal.removeAttribute("hidden");

    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      modal.classList.add("open");
    });
  }

  function closeModal() {
    modal.classList.remove("open");

    document.body.style.overflow = "";

    setTimeout(() => {
      modal.setAttribute("hidden", "");
    }, 300);
  }

  cards.forEach((card) => {
    card.addEventListener("click", openModal);

    card.addEventListener(
      "keydown",

      (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();

          openModal();
        }
      },
    );
  });

  closeBtn.addEventListener("click", closeModal);

  backdrop.addEventListener("click", closeModal);

  document.addEventListener(
    "keydown",

    (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
      }
    },
  );
}

initCertificateModal();
