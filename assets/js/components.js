/**
 * Shared header / mobile nav / floating CTAs / footer.
 * Injected via JS so every page stays in sync from one place —
 * edit the markup below once instead of 15 separate HTML files.
 */
(function () {
  const CFG = window.GRIHAWAS_CONFIG || {};
  const current = document.body.getAttribute("data-page") || "";

  const NAV_LINKS = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "project.html", label: "Project", key: "project" },
    { href: "floor-plans.html", label: "Plans", key: "floor-plans" },
    { href: "amenities.html", label: "Amenities", key: "amenities" },
    { href: "location.html", label: "Location", key: "location" },
    { href: "gallery.html", label: "Gallery", key: "gallery" },
    { href: "index.html#benefits", label: "Benefits", key: "benefits" },
    { href: "contact.html", label: "Contact", key: "contact" },
    { href: "results.html", label: "Result", key: "results" }
  ];

  function navItems(container) {
    return NAV_LINKS.map(function (item) {
      const current_attr = item.key === current ? ' aria-current="page"' : "";
      return '<li><a href="' + item.href + '"' + current_attr + ">" + item.label + "</a></li>";
    }).join("");
  }

  function renderHeader() {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    mount.innerHTML =
      '<a class="skip-link" href="#main-content">Skip to content</a>' +
      '<div class="announcement"><span>Private consultations and guided site visits available</span><a href="apply-now.html">Start your application →</a></div>' +
      '<header class="site-header">' +
      '<div class="container">' +
      '<a class="brand brand--official" href="index.html"><img class="brand-logo" src="assets/images/brand/grihawas-logo.png" alt="Grihawas Aawas Yojna" width="600" height="587"></a>' +
      '<nav class="main-nav" aria-label="Primary">' +
      "<ul>" + navItems() + "</ul>" +
      "</nav>" +
      '<a class="btn btn-primary header-cta" href="apply-now.html">Register Now</a>' +
      '<button class="hamburger" id="hamburgerBtn" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav">' +
      "<span></span><span></span><span></span>" +
      "</button>" +
      "</div>" +
      "</header>" +
      '<div class="nav-scrim" id="navScrim"></div>' +
      '<div class="mobile-nav" id="mobileNav" role="dialog" aria-modal="true" aria-label="Mobile menu">' +
      '<div class="mobile-nav-head">' +
      '<a class="brand brand--official" href="index.html"><img class="brand-logo" src="assets/images/brand/grihawas-logo.png" alt="Grihawas Aawas Yojna" width="600" height="587"></a>' +
      '<button class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu">&times;</button>' +
      "</div>" +
      '<ul>' + navItems() + "</ul>" +
      '<a class="btn btn-primary header-cta" href="apply-now.html">Register Now</a>' +
      "</div>";
    const header = mount.querySelector(".site-header");
    window.addEventListener("scroll", function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }, { passive: true });
  }

  function renderFabs() {
    const mount = document.getElementById("site-fabs");
    if (!mount) return;
    const waNum = (CFG.WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");
    const phoneNum = (CFG.PHONE_NUMBER || "").replace(/[^0-9]/g, "");
    const hasWhatsApp = waNum.length >= 10;
    const hasPhone = phoneNum.length >= 10;
    const waMsg = encodeURIComponent("Hi, I'm interested in " + CFG.PROJECT_NAME + ". Please share more details.");
    mount.innerHTML =
      '<div class="fab-stack">' +
      '<a class="fab fab--wa' + (hasWhatsApp ? '' : ' is-unavailable') + '" href="' + (hasWhatsApp ? 'https://wa.me/' + waNum + '?text=' + waMsg : 'contact.html') + '"' + (hasWhatsApp ? ' target="_blank" rel="noopener"' : '') + ' aria-label="Chat on WhatsApp">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2zm0 18.02h-.01a8.13 8.13 0 0 1-4.15-1.14l-.3-.18-3.13.82.84-3.05-.19-.31a8.13 8.13 0 0 1-1.25-4.34c0-4.49 3.66-8.15 8.16-8.15 2.18 0 4.22.85 5.76 2.39a8.09 8.09 0 0 1 2.39 5.77c0 4.49-3.66 8.19-8.12 8.19zm4.47-6.13c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/></svg>' +
      "</a>" +
      '<a class="fab fab--call' + (hasPhone ? '' : ' is-unavailable') + '" href="' + (hasPhone ? 'tel:' + phoneNum : 'contact.html') + '" aria-label="Call us">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
      "</a>" +
      "</div>" +
      '<div class="mobile-cta-bar" aria-label="Quick actions">' +
      '<a href="' + (hasPhone ? 'tel:' + phoneNum : 'contact.html') + '">' + (hasPhone ? 'Call Now' : 'Contact') + '</a>' +
      '<button type="button" data-open-enquiry>Enquire</button>' +
      '<a href="apply-now.html">Apply Now</a>' +
      "</div>";
    const quickEnquiry = mount.querySelector("[data-open-enquiry]");
    if (quickEnquiry) quickEnquiry.addEventListener("click", function () {
      const modal = document.getElementById("enquiryModal");
      if (modal) modal.classList.add("is-open");
      else window.location.href = "contact.html";
    });
  }

  function renderFooter() {
    const mount = document.getElementById("site-footer");
    if (!mount) return;
    const year = new Date().getFullYear();
    const phoneNum = (CFG.PHONE_NUMBER || "").replace(/[^0-9]/g, "");
    const hasPhone = phoneNum.length >= 10;
    mount.innerHTML =
      '<footer class="site-footer">' +
      '<div class="container">' +
      '<div class="footer-intro">' +
      '<div><span class="footer-eyebrow">Find your place at Grihawas</span><h2>Plan a private project visit</h2><p>Speak with our project team for availability, pricing and application guidance.</p></div>' +
      '<a class="btn footer-intro__cta" href="contact.html">Contact the project team <span aria-hidden="true">&rarr;</span></a>' +
      '</div>' +
      '<div class="footer-grid">' +
      '<div class="footer-brand">' +
      '<a class="brand brand--official" href="index.html" aria-label="Grihawas Aawas Yojna home"><img class="brand-logo brand-logo--footer" src="assets/images/brand/grihawas-logo.png" alt="" width="600" height="587"></a>' +
      "<p>" + CFG.BRAND_TAGLINE + " Explore " + CFG.CONFIGURATIONS + " at " + CFG.ADDRESS_LINE_2 + ".</p>" +
      '<div class="footer-social">' +
      '<a href="' + CFG.SOCIAL.facebook + '" aria-label="Facebook" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7C16.4 3.66 15.4 3.57 14.24 3.57c-2.4 0-4.04 1.47-4.04 4.16V9.9H7.5V13h2.7v8h3.3z"/></svg></a>' +
      '<a href="' + CFG.SOCIAL.instagram + '" aria-label="Instagram" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"/></svg></a>' +
      '<a href="' + CFG.SOCIAL.linkedin + '" aria-label="LinkedIn" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92zM20.44 20h-3.37v-5.9c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.26 1.53-2.26 3.1V20H9.5V8.5h3.24v1.57h.05c.45-.85 1.55-1.75 3.2-1.75 3.42 0 4.05 2.25 4.05 5.17V20z"/></svg></a>' +
      '<a href="' + CFG.SOCIAL.youtube + '" aria-label="YouTube" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12s0-3.2-.4-4.7c-.24-.86-.9-1.5-1.75-1.75C18.3 5 12 5 12 5s-6.3 0-7.85.55c-.86.25-1.5.9-1.75 1.75C2 8.8 2 12 2 12s0 3.2.4 4.7c.25.85.9 1.5 1.75 1.75C5.7 19 12 19 12 19s6.3 0 7.85-.55c.85-.25 1.5-.9 1.75-1.75.4-1.5.4-4.7.4-4.7zM10 15.2V8.8L15.5 12 10 15.2z"/></svg></a>' +
      "</div>" +
      "</div>" +
      '<nav class="footer-nav" aria-labelledby="footer-explore"><h3 id="footer-explore">Explore</h3><ul>' +
      '<li><a href="about.html">About</a></li>' +
      '<li><a href="project.html">Project Overview</a></li>' +
      '<li><a href="amenities.html">Amenities</a></li>' +
      '<li><a href="gallery.html">Gallery</a></li>' +
      "</ul></nav>" +
      '<nav class="footer-nav" aria-labelledby="footer-project"><h3 id="footer-project">Project</h3><ul>' +
      '<li><a href="floor-plans.html">Floor Plans</a></li>' +
      '<li><a href="assets/documents/payment-plan.pdf">Payment Plan</a></li>' +
      '<li><a href="location.html">Location</a></li>' +
      '<li><a href="apply-now.html">Apply Now</a></li>' +
      '<li><a href="results.html">Check Application Status</a></li>' +
      "</ul></nav>" +
      '<section class="footer-contact" aria-labelledby="footer-contact"><h3 id="footer-contact">Contact</h3><address>' +
      (hasPhone ? '<a href="tel:+' + phoneNum + '"><span>Call</span>' + CFG.PHONE_DISPLAY + "</a>" : "") +
      (CFG.EMAIL ? '<a href="mailto:' + CFG.EMAIL + '"><span>Email</span>' + CFG.EMAIL + "</a>" : "") +
      '<a href="' + CFG.GOOGLE_MAP_URL + '" target="_blank" rel="noopener noreferrer"><span>Visit</span>' + CFG.ADDRESS_LINE_1 + '<br>' + CFG.ADDRESS_LINE_2 + '</a>' +
      "</address></section>" +
      "</div>" +
      '<div class="footer-bottom">' +
      "<p>&copy; " + year + " " + CFG.PROJECT_NAME + ". All rights reserved.</p>" +
      '<nav aria-label="Legal and website links"><ul><li><a href="privacy-policy.html">Privacy Policy</a></li><li><a href="terms-and-conditions.html">Terms &amp; Conditions</a></li><li><a href="disclaimer.html">Disclaimer</a></li><li><a href="refund-policy.html">Refund Policy</a></li><li><a href="sitemap.xml">Sitemap</a></li></ul></nav>' +
      "</div>" +
      '<p class="footer-disclaimer">Disclaimer: This website is for informational purposes and does not constitute an offer or contract. Concept images are identified as such; uploaded construction photographs and drawings are captioned separately. Confirm all plans, prices, specifications, approvals and timelines in the latest official documents before booking.</p>' +
      "</div>" +
      "</footer>";
    mount.querySelectorAll('.footer-social a[href=""]').forEach(function (link) { link.remove(); });
    const socialRow = mount.querySelector(".footer-social");
    if (socialRow && !socialRow.children.length) socialRow.remove();
    const fabStack = document.querySelector(".fab-stack");
    if (fabStack && "IntersectionObserver" in window) {
      const footerObserver = new IntersectionObserver(function (entries) {
        fabStack.classList.toggle("is-footer-hidden", entries[0].isIntersecting);
      }, { threshold: 0.05 });
      footerObserver.observe(mount);
    }
  }

  function bindNav() {
    const btn = document.getElementById("hamburgerBtn");
    const closeBtn = document.getElementById("mobileNavClose");
    const nav = document.getElementById("mobileNav");
    const scrim = document.getElementById("navScrim");
    if (!btn || !nav) return;

    function open() {
      nav.classList.add("is-open");
      scrim.classList.add("is-open");
      document.body.classList.add("nav-locked");
      btn.setAttribute("aria-expanded", "true");
      closeBtn.focus();
    }
    function close() {
      nav.classList.remove("is-open");
      scrim.classList.remove("is-open");
      document.body.classList.remove("nav-locked");
      btn.setAttribute("aria-expanded", "false");
      btn.focus();
    }
    btn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    scrim.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) close();
    });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFabs();
    renderFooter();
    bindNav();
  });
})();
