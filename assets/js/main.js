/**
 * Grihawas — site interactions
 * Vanilla JS only. Each block guards on the element(s) it needs,
 * so this single file can be safely included on every page.
 */
(function () {
  const CFG = window.GRIHAWAS_CONFIG || {};

  /* Homepage registration countdown, driven by the central project configuration. */
  (function setupRegistrationCountdown() {
    const section = document.querySelector("[data-registration]");
    if (!section) return;
    const deadline = new Date(CFG.APPLICATION_DEADLINE || "").getTime();
    const status = section.querySelector("[data-registration-status]");
    const countdown = section.querySelector("[data-countdown]");
    const expired = section.querySelector("[data-registration-expired]");
    const amount = section.querySelector("[data-registration-amount]");
    const deadlineLabel = section.querySelector("[data-deadline-label]");
    if (amount && CFG.REGISTRATION_AMOUNT)
      amount.textContent = CFG.REGISTRATION_AMOUNT;
    if (deadlineLabel && Number.isFinite(deadline)) {
      deadlineLabel.textContent =
        "Open until " +
        new Intl.DateTimeFormat("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        }).format(new Date(deadline));
    }
    const fields = {
      days: section.querySelector("[data-days]"),
      hours: section.querySelector("[data-hours]"),
      minutes: section.querySelector("[data-minutes]"),
      seconds: section.querySelector("[data-seconds]"),
    };
    let timer = null;

    function showClosed() {
      if (timer) window.clearInterval(timer);
      if (status) status.textContent = "Registration Closed";
      if (countdown) countdown.hidden = true;
      if (expired) expired.hidden = false;
    }
    function update() {
      const remaining = deadline - Date.now();
      if (!Number.isFinite(deadline) || remaining <= 0) return showClosed();
      const total = Math.floor(remaining / 1000);
      const values = {
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
      };
      Object.keys(fields).forEach(function (key) {
        if (fields[key])
          fields[key].textContent = String(values[key]).padStart(2, "0");
      });
    }
    update();
    if (Number.isFinite(deadline) && deadline > Date.now())
      timer = window.setInterval(update, 1000);
  })();

  /* Homepage hero carousel. */
  (function setupHomeSlider() {
    const slider = document.querySelector("[data-home-slider]");
    if (!slider) return;
    const slides = Array.from(slider.querySelectorAll(".home-hero__slide"));
    const dots = Array.from(slider.querySelectorAll(".home-hero__dots button"));
    const previous = slider.querySelector(".home-hero__arrow--prev");
    const next = slider.querySelector(".home-hero__arrow--next");
    if (!slides.length) return;
    let current = slides.findIndex(function (slide) {
      return slide.classList.contains("is-active");
    });
    if (current < 0) current = 0;
    let timer = null;
    let touchStartX = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        const active = i === current;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      slider.classList.toggle(
        "is-notice",
        slides[current].classList.contains("home-hero__slide--notice"),
      );
      slider.classList.toggle(
        "is-loan",
        slides[current].classList.contains("home-hero__slide--loan"),
      );
      dots.forEach(function (dot, i) {
        const active = i === current;
        dot.classList.toggle("is-active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }
    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }
    function play() {
      stop();
      if (
        !document.hidden &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        timer = window.setInterval(function () {
          show(current + 1);
        }, 6000);
      }
    }
    function move(step) {
      show(current + step);
      play();
    }
    if (previous)
      previous.addEventListener("click", function () {
        move(-1);
      });
    if (next)
      next.addEventListener("click", function () {
        move(1);
      });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        play();
      });
    });
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", play);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", play);
    slider.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    });
    slider.addEventListener(
      "touchstart",
      function (event) {
        touchStartX = event.changedTouches[0].clientX;
      },
      { passive: true },
    );
    slider.addEventListener(
      "touchend",
      function (event) {
        const distance = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
      },
      { passive: true },
    );
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else play();
    });
    slider.setAttribute("tabindex", "0");
    show(current);
    play();
  })();

  /* Image defaults: preserve intrinsic layout, decode asynchronously, and
     defer every non-critical image. Hero images explicitly marked eager win. */
  document.querySelectorAll("img").forEach(function (img) {
    if (!img.hasAttribute("decoding")) img.decoding = "async";
    if (!img.hasAttribute("loading") && !img.hasAttribute("fetchpriority"))
      img.loading = "lazy";
  });

  /* =========================================================
     1. LEAD / ENQUIRY FORM VALIDATION + SUBMIT
     Works for any <form data-lead-form> on the page (hero popup,
     contact page, floor-plan enquiry, sticky CTA, etc.)
     ========================================================= */
  const PHONE_RE = /^[6-9]\d{9}$/; // Indian mobile numbers
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showFieldError(row, message) {
    if (!row) return;
    row.classList.add("has-error");
    const err = row.querySelector(".form-error");
    if (err) err.textContent = message;
  }
  function clearFieldError(row) {
    if (!row) return;
    row.classList.remove("has-error");
  }

  function validateLeadForm(form) {
    let valid = true;
    const name = form.querySelector('[name="fullName"], [name="name"]');
    const phone = form.querySelector('[name="phone"]');
    const email = form.querySelector('[name="email"]');
    const config = form.querySelector('[name="configuration"]');

    [name, phone, email, config].forEach(function (field) {
      if (!field) return;
      const row = field.closest(".form-row");
      clearFieldError(row);
    });

    if (name && name.value.trim().length < 2) {
      showFieldError(name.closest(".form-row"), "Please enter your full name.");
      valid = false;
    }
    if (phone && !PHONE_RE.test(phone.value.trim())) {
      showFieldError(
        phone.closest(".form-row"),
        "Enter a valid 10-digit Indian mobile number.",
      );
      valid = false;
    }
    if (email && email.value.trim() && !EMAIL_RE.test(email.value.trim())) {
      showFieldError(
        email.closest(".form-row"),
        "Enter a valid email address.",
      );
      valid = false;
    }
    if (config && !config.value) {
      showFieldError(
        config.closest(".form-row"),
        "Please select a configuration.",
      );
      valid = false;
    }
    return valid;
  }

  function handleLeadSubmit(form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (!validateLeadForm(form)) return;
      const wrap = form.closest("[data-lead-wrap]") || form.parentElement;
      const success = wrap.querySelector(".form-success");
      const payload = Object.fromEntries(new FormData(form));
      if (!CFG.FORM_ENDPOINT) {
        if (success) {
          success.hidden = false;
          success.style.display = "block";
          success.innerHTML =
            '<strong>Form details are valid.</strong><br>The online submission service is not connected yet. Please call <a href="tel:+919870100774">+91 98701 00774</a> or email <a href="mailto:grihawasef@gmail.com">grihawasef@gmail.com</a>.';
        }
        return;
      }
      try {
        const response = await fetch(CFG.FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Submission failed");
        form.style.display = "none";
        if (success) {
          success.hidden = false;
          success.style.display = "block";
        }
        form.reset();
      } catch (error) {
        if (success) {
          success.hidden = false;
          success.style.display = "block";
          success.textContent =
            "We could not send your enquiry. Please call +91 98701 00774 or try again later.";
        }
      }
    });
  }

  document.querySelectorAll("form[data-lead-form]").forEach(handleLeadSubmit);

  /* =========================================================
     2. ENQUIRY POPUP (hero + sticky triggers)
     ========================================================= */
  document.querySelectorAll("[data-open-enquiry]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      const modal = document.getElementById("enquiryModal");
      if (!modal) return;
      modal.classList.add("is-open");
      const firstField = modal.querySelector("input, select");
      if (firstField) firstField.focus();
    });
  });
  document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.closest(".modal-overlay").classList.remove("is-open");
    });
  });
  document.querySelectorAll(".modal-overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.classList.remove("is-open");
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.is-open").forEach(function (m) {
        m.classList.remove("is-open");
      });
    }
  });

  /* =========================================================
     3. ACCORDION (FAQ)
     ========================================================= */
  document.querySelectorAll(".accordion-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      const item = trigger.closest(".accordion-item");
      const panel = item.querySelector(".accordion-panel");
      const isOpen = item.classList.contains("is-open");
      const accordion = item.closest("[data-accordion-group]");

      if (accordion && accordion.dataset.accordionGroup === "single") {
        accordion
          .querySelectorAll(".accordion-item.is-open")
          .forEach(function (openItem) {
            if (openItem !== item) {
              openItem.classList.remove("is-open");
              openItem.querySelector(".accordion-panel").style.maxHeight = null;
              openItem
                .querySelector(".accordion-trigger")
                .setAttribute("aria-expanded", "false");
            }
          });
      }

      if (isOpen) {
        item.classList.remove("is-open");
        panel.style.maxHeight = null;
        trigger.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("is-open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* =========================================================
     4. LIGHTBOX (gallery + floor plans + site plan)
     Any element with [data-lightbox-src] + [data-lightbox-caption]
     grouped by [data-lightbox-group] gets prev/next navigation.
     ========================================================= */
  (function setupLightbox() {
    const items = Array.from(document.querySelectorAll("[data-lightbox-src]"));
    if (!items.length) return;

    const overlay = document.getElementById("lightboxOverlay");
    if (!overlay) return;
    const imgEl = overlay.querySelector("img");
    const captionEl = overlay.querySelector(".modal-caption");
    const prevBtn = overlay.querySelector(".modal-nav--prev");
    const nextBtn = overlay.querySelector(".modal-nav--next");
    let currentGroup = [];
    let currentIndex = 0;

    function openAt(groupItems, index) {
      currentGroup = groupItems;
      currentIndex = index;
      render();
      overlay.classList.add("is-open");
    }
    function render() {
      const el = currentGroup[currentIndex];
      imgEl.hidden = false;
      imgEl.src = el.getAttribute("data-lightbox-src");
      imgEl.alt = el.getAttribute("data-lightbox-caption") || "";
      captionEl.textContent = el.getAttribute("data-lightbox-caption") || "";
      const showNav = currentGroup.length > 1;
      prevBtn.style.display = showNav ? "flex" : "none";
      nextBtn.style.display = showNav ? "flex" : "none";
    }

    items.forEach(function (el) {
      el.addEventListener("click", function () {
        const group = el.getAttribute("data-lightbox-group") || "default";
        const groupItems = items.filter(function (i) {
          return (i.getAttribute("data-lightbox-group") || "default") === group;
        });
        openAt(groupItems, groupItems.indexOf(el));
      });
    });

    prevBtn.addEventListener("click", function () {
      currentIndex =
        (currentIndex - 1 + currentGroup.length) % currentGroup.length;
      render();
    });
    nextBtn.addEventListener("click", function () {
      currentIndex = (currentIndex + 1) % currentGroup.length;
      render();
    });
    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("is-open")) return;
      if (e.key === "ArrowLeft") prevBtn.click();
      if (e.key === "ArrowRight") nextBtn.click();
    });
  })();

  /* =========================================================
     5. GALLERY FILTERS
     ========================================================= */
  const filterBar = document.querySelector("[data-gallery-filters]");
  if (filterBar) {
    filterBar.addEventListener("click", function (e) {
      const btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      filterBar.querySelectorAll("button").forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      const filter = btn.getAttribute("data-filter");
      document.querySelectorAll("[data-gallery-item]").forEach(function (item) {
        const show =
          filter === "all" || item.getAttribute("data-category") === filter;
        item.style.display = show ? "" : "none";
      });
    });
  }

  /* Homepage site/floor-plan tabs. */
  const planTabs = document.querySelector("[data-plan-tabs]");
  if (planTabs) {
    planTabs.addEventListener("click", function (event) {
      const tab = event.target.closest("[data-plan-tab]");
      if (!tab) return;
      const key = tab.getAttribute("data-plan-tab");
      planTabs.querySelectorAll("[data-plan-tab]").forEach(function (item) {
        const selected = item === tab;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      document.querySelectorAll("[data-plan-panel]").forEach(function (panel) {
        const selected = panel.getAttribute("data-plan-panel") === key;
        panel.hidden = !selected;
        panel.classList.toggle("is-active", selected);
      });
    });
  }

  /* Subtle image/content reveals; immediately visible when unsupported. */
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* =========================================================
     6. DOWNLOAD BUTTONS — simple analytics-friendly wrapper
     ========================================================= */
  document.querySelectorAll("[data-download]").forEach(function (link) {
    link.addEventListener("click", function () {});
  });

  /* =========================================================
     7. APPLY NOW — MULTI-STEP FORM
     ========================================================= */
  (function setupMultiStep() {
    const wizard = document.getElementById("applyWizard");
    if (!wizard) return;

    const steps = Array.from(wizard.querySelectorAll(".form-step"));
    const trackerSteps = Array.from(
      wizard.querySelectorAll(".step-tracker .step"),
    );
    let current = 0;

    function requiredFieldsValid(stepEl) {
      let valid = true;
      stepEl.querySelectorAll("[required]").forEach(function (field) {
        const row = field.closest(".form-row");
        clearFieldError(row);
        let ok = field.value.trim() !== "";
        if (ok && field.name === "phone")
          ok = PHONE_RE.test(field.value.trim());
        if (ok && field.name === "email")
          ok = EMAIL_RE.test(field.value.trim());
        if (!ok) {
          showFieldError(
            row,
            field.dataset.errorMsg || "This field is required.",
          );
          valid = false;
        }
      });
      return valid;
    }

    function renderStep(shouldScroll) {
      steps.forEach(function (s, i) {
        s.classList.toggle("is-active", i === current);
      });
      trackerSteps.forEach(function (s, i) {
        s.classList.toggle("is-active", i === current);
        s.classList.toggle("is-done", i < current);
      });
      if (current === steps.length - 1) fillReview();
      if (shouldScroll)
        wizard.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function fillReview() {
      const review = wizard.querySelector("[data-review]");
      if (!review) return;
      const data = new FormData(wizard.querySelector("form"));
      const rows = [
        ["Full name", data.get("fullName")],
        ["Phone", data.get("phone")],
        ["Email", data.get("email")],
        ["Property / Tower", data.get("property")],
        ["Configuration", data.get("configuration")],
        ["Budget", data.get("budget")],
        ["Preferred visit date", data.get("visitDate")],
        ["Message", data.get("message")],
      ];
      review.innerHTML = rows
        .map(function (r) {
          return (
            '<div class="result-row"><span class="label">' +
            r[0] +
            '</span><span class="value">' +
            (r[1] || "—") +
            "</span></div>"
          );
        })
        .join("");
    }

    wizard.querySelectorAll("[data-next]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!requiredFieldsValid(steps[current])) return;
        if (current < steps.length - 1) {
          current++;
          renderStep(true);
        }
      });
    });
    wizard.querySelectorAll("[data-prev]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (current > 0) {
          current--;
          renderStep(true);
        }
      });
    });

    renderStep(false);
  })();

  /* =========================================================
     8. RESULTS PAGE — verified support fallback
     ========================================================= */
  (function setupResults() {
    const form = document.getElementById("resultsSearchForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const ref = form
        .querySelector('[name="refNumber"]')
        .value.trim()
        .toUpperCase();
      const resultBox = document.getElementById("resultsOutput");
      resultBox.innerHTML =
        '<div class="result-card"><p class="mb-0">Online status lookup is not connected yet. Please contact the project team with reference <strong>' +
        (ref || "your application number") +
        "</strong> for a verified update.</p></div>";
    });
  })();

  /* Keep enquiry choices aligned with the uploaded plan sheets. */
  document
    .querySelectorAll('select[name="configuration"]')
    .forEach(function (select) {
      const current = select.value;
      select.innerHTML =
        '<option value="">Select configuration</option>' +
        "<option>T1 Residential Plan</option>" +
        "<option>T2 Residential Plan</option>" +
        "<option>Commercial Shop</option>" +
        "<option>Not sure yet</option>";
      if (
        [
          "T1 Residential Plan",
          "T2 Residential Plan",
          "Commercial Shop",
          "Not sure yet",
        ].includes(current)
      )
        select.value = current;
    });

  /* =========================================================
     9. STICKY HEADER SHADOW ON SCROLL (subtle, non-generic)
     ========================================================= */
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener(
      "scroll",
      function () {
        header.style.boxShadow =
          window.scrollY > 8 ? "0 6px 20px -12px rgba(0,0,0,0.25)" : "none";
      },
      { passive: true },
    );
  }
})();
