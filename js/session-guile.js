/**
 * Animazioni Guile — pagine sessione allenamento
 * Sonic flash, entrance stagger, pulse KPI on scroll
 */
(function () {
  const page = document.querySelector(".session-page--guile");
  if (!page) return;

  const strip = page.querySelector(".guile-strip");
  if (strip) {
    strip.querySelectorAll(".guile-card").forEach((card, i) => {
      card.style.setProperty("--guile-i", String(i));
    });
  }

  const hero = page.querySelector(".session-hero");
  if (hero && !hero.querySelector(".guile-flash")) {
    const flash = document.createElement("span");
    flash.className = "guile-flash";
    flash.setAttribute("aria-hidden", "true");
    hero.appendChild(flash);
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-guile-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    page.querySelectorAll(".guile-panel, .monitor-panel, .session-kpis__item").forEach((el) => io.observe(el));
  } else {
    page.querySelectorAll(".guile-panel, .monitor-panel").forEach((el) => el.classList.add("is-guile-visible"));
  }
})();
