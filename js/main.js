/* ============================================================
   Portfolio interactions — vanilla JS, no dependencies
   ============================================================ */

// "?static" renders the final state with no animations (handy for screenshots/debug)
const staticMode = new URLSearchParams(location.search).has("static");
const prefersReducedMotion =
  staticMode || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (staticMode) {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in-view"));
  document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = el.dataset.count));
  document.querySelector(".hero").style.minHeight = "880px";
}

/* ---------- Preloader ---------- */
(() => {
  const preloader = document.getElementById("preloader");
  const counter = document.getElementById("preloaderCounter");
  const bar = document.getElementById("preloaderBar");

  if (prefersReducedMotion) {
    preloader.classList.add("done");
    document.body.classList.add("loaded");
    return;
  }

  let progress = 0;
  const tick = () => {
    // ease toward 100 with slight randomness so it feels organic
    progress = Math.min(100, progress + Math.random() * 9 + 3);
    counter.textContent = Math.floor(progress);
    bar.style.width = progress + "%";
    if (progress < 100) {
      setTimeout(tick, 60 + Math.random() * 80);
    } else {
      setTimeout(() => {
        preloader.classList.add("done");
        document.body.classList.add("loaded");
      }, 250);
    }
  };
  tick();
})();

/* ---------- Custom cursor ---------- */
(() => {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (window.matchMedia("(hover: none)").matches) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // ring trails behind the dot with lerp smoothing
  const render = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  };
  render();

  document.querySelectorAll("a, button, [data-cursor], [data-magnetic]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const text = el.getAttribute("data-cursor-text");
      if (text) {
        ring.textContent = text;
        ring.classList.add("has-text");
      } else {
        ring.classList.add("is-hover");
      }
    });
    el.addEventListener("mouseleave", () => {
      ring.textContent = "";
      ring.classList.remove("is-hover", "has-text");
    });
  });
})();

/* ---------- Magnetic elements ---------- */
(() => {
  if (prefersReducedMotion) return;
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = 0.35;
    el.style.transition = "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)";
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });
})();

/* ---------- Scroll reveals ---------- */
(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${(i % 4) * 90}ms`;
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

/* ---------- Animated stat counters ---------- */
(() => {
  const counters = document.querySelectorAll("[data-count]");
  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(eased * target);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => observer.observe(el));
})();

/* ---------- Nav scroll state ---------- */
(() => {
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ---------- Orb parallax ---------- */
(() => {
  if (prefersReducedMotion) return;
  const orbs = document.querySelectorAll("[data-parallax]");
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orbs.forEach((orb) => {
          orb.style.translate = `0 ${y * parseFloat(orb.dataset.parallax) * -1}px`;
        });
        ticking = false;
      });
    },
    { passive: true }
  );
})();

/* ---------- Say-hi modal ---------- */
(() => {
  const modal = document.getElementById("sayHiModal");
  const trigger = document.getElementById("sayHi");
  const copyBtn = document.getElementById("copyEmail");
  const copyHint = document.getElementById("copyHint");
  const EMAIL = "jeneidimohammad@gmail.com";

  const open = () => {
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => (modal.hidden = true), 400);
  };

  trigger.addEventListener("click", open);
  if (new URLSearchParams(location.search).has("modal")) open(); // debug/screenshot hook
  modal.querySelectorAll("[data-modal-close]").forEach((el) => el.addEventListener("click", close));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      copyHint.textContent = "copied ✓";
    } catch {
      copyHint.textContent = "select & copy";
    }
    setTimeout(() => (copyHint.textContent = "copy ⧉"), 2000);
  });
})();

/* ---------- 3D tilt on project cards ---------- */
(() => {
  if (prefersReducedMotion || window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${py * -7}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
      card.style.transform = "perspective(900px) rotateY(0) rotateX(0) translateY(0)";
      setTimeout(() => (card.style.transition = ""), 600);
    });
  });
})();
