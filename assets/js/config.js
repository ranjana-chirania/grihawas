/**
 * GRIHAWAS — CENTRAL CONFIGURATION
 * ---------------------------------------------------------------
 * Every editable business detail lives here. Change a value once
 * and it updates everywhere the config is used (header, footer,
 * forms, floating buttons, structured data, etc.)
 *
 * Verified public project details are centralized here so pages stay consistent.
 * ---------------------------------------------------------------
 */
window.GRIHAWAS_CONFIG = {
  // ---- Brand ----
  PROJECT_NAME: "Grihawas Aawas Yojna",
  BRAND_TAGLINE: "Affordable homes under the U.P. Affordable Housing Policy.",
  SITE_URL: "https://grihawas.com/",

  // ---- Contact ----
  PHONE_DISPLAY: "+91 98701 00774",
  PHONE_NUMBER: "919870100774",
  WHATSAPP_NUMBER: "919870100774",
  EMAIL: "grihawasef@gmail.com",
  ADDRESS_LINE_1: "SPLS Grihawas",
  ADDRESS_LINE_2: "Govind Puram Extension, NH-24, Ghaziabad, U.P. 201017",
  GOOGLE_MAP_URL: "https://maps.google.com/?q=Govind+Puram+Extension+NH-24+Ghaziabad",

  // ---- Verified project facts ----
  PROJECT_TYPE: "Residential and Commercial Affordable Housing Development",
  TOTAL_AREA: "10 Acres",
  TOTAL_BLOCKS: "14 Residential Blocks with a Commercial Plaza",
  CONFIGURATIONS: "T1 and T2 residential flats; T1, T2 and T3 shops",
  DEVELOPER_NAME: "SDPL Project Private Limited",
  RERA_NUMBER: "UPRERAPRJ3286",
  STARTING_PRICE: "₹28.67 Lakh*",
  REGISTRATION_AMOUNT: "₹25,000",
  // Published application deadline. ISO 8601 includes the project-local IST offset.
  APPLICATION_DEADLINE: "2026-10-31T23:59:59+05:30",

  // ---- Assets ----
  BROCHURE_PATH: "assets/documents/brochure.pdf",
  PRICE_LIST_PATH: null,
  PAYMENT_PLAN_PATH: "assets/documents/payment-plan.pdf",
  GRIHAWAS_SUMMARY_PATH: null,
  PROJECT_VIDEO_PATH: "assets/video/grihawas-project.mp4",
  SITE_PLAN_PATH: "gallery/site-layout2.jpg",
  RERA_CERT_PATH: "assets/documents/rera.pdf",

  // Central image registry using actual uploaded Grihawas assets.
  IMAGES: {
    heroImage: "assets/images/hero/spls/project-entrance.webp",
    projectExterior: "gallery/Full-Site-scaled.jpg",
    amenityPoolClubhouse: "gallery/Swimming-Pool.webp",
    locationMap: "assets/images/location/grihawas-location-map.svg",
    sitePlan: "gallery/site-layout2.jpg",
    floorPlanT1: "gallery/1.png",
    floorPlanT2: "gallery/Griha-Awas-Layouts-1.png",
    commercialPlan: "gallery/Griha_Awas_Shop_Layout-1.pdf-3.png"
  },

  // ---- Integrations (not yet connected — see README) ----
  // Point these at your real endpoints when a backend is ready.
  FORM_ENDPOINT: null,       // e.g. "https://api.yourcrm.com/leads"
  CRM_WEBHOOK: null,
  EMAIL_API_ENDPOINT: null,
  WHATSAPP_API_ENDPOINT: null,

  // ---- Social ----
  SOCIAL: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: ""
  }
};
