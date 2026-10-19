import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import pregnancyBanner from "./assets/pregnancy-care-banner.png";
import clinicReception from "./assets/clinic-reception.jpg";
import clinicDoctor from "./assets/clinic-doctor.jpg";
import clinicAmbulance from "./assets/services/nepal-emergency-care.png";
import AppointmentPage from "./components/AppointmentPage";
import DoctorsPage from "./components/DoctorsPage";
import GalleryPage from "./components/GalleryPage";
import NoticesPage from "./components/NoticesPage";
import FirstVisitNoticePopup from "./components/FirstVisitNoticePopup";
import HomeFeaturedNotices from "./components/HomeFeaturedNotices";
import ServicesPage from "./components/ServicesPage";
import FacilitiesPage from "./components/FacilitiesPage";
import OffersPage from "./components/OffersPage";
import ReviewsSection from "./components/ReviewsSection";
import { clinicServices } from "./components/servicesCatalog";
import { useLanguage } from "./components/LanguageContext";
import { API_BASE_URL } from "./api";
import "./App.css";

const slides = [
  {
    eyebrow: "MATERNITY CARE AT SIRJANA POLYCLINIC",
    title: "A little pink. A lot of hope.",
    description: "Gentle, personalized care for you and your growing family.",
    action: "Get Offer Now",
    href: "/offers",
    image: pregnancyBanner,
    imageAlt: "Pregnant mother in a flower garden",
    theme: "hero-slide-pregnancy",
  },
  {
    eyebrow: "SIRJANA ADVANCED POLYCLINIC · DHAKDHAI",
    title: "Care that puts you first.",
    description: "Thoughtful, trusted healthcare for every age and every stage of life.",
    action: "Book an appointment",
    href: "/appointment",
    image: clinicReception,
    imageAlt: "Bright, welcoming clinic reception",
    theme: "hero-slide-care",
  },
  {
    eyebrow: "HERE FOR YOUR FAMILY",
    title: "A healthier tomorrow starts today.",
    description: "Get the support, guidance, and care you need from a team that listens.",
    action: "Meet our care team",
    href: "/doctors",
    image: clinicDoctor,
    imageAlt: "Doctor welcoming a patient for a consultation",
    theme: "hero-slide-family",
  },
  {
    eyebrow: "COMPASSIONATE · PERSONAL · LOCAL",
    title: "Your health, our priority.",
    description: "From everyday checkups to expert advice, we're here to help you feel your best.",
    action: "Explore our services",
    href: "/services",
    image: clinicAmbulance,
    imageAlt: "Ambulance ready outside a clinic",
    theme: "hero-slide-wellness",
  },
];

function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  // Keep the clinic's current emergency number visible while the API loads or
  // if a temporary network/CORS issue prevents the request from completing.
  const [emergencyPhone, setEmergencyPhone] = useState("+9779714548880");
  const { language, setLanguage, t } = useLanguage();
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const isAppointmentPage = currentPath === "/appointment";
  const doctorMatch = currentPath.match(/^\/doctors(?:\/([^/]+))?$/);
  const isGalleryPage = currentPath === "/gallery";
  const isNoticesPage = currentPath === "/notices";
  const serviceMatch = currentPath.match(/^\/services(?:\/([^/]+))?$/);
  const isFacilitiesPage = currentPath === "/facilities";
  const isOffersPage = currentPath === "/offers";

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/emergency-contact/`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (data?.phone_number) setEmergencyPhone(data.phone_number);
      })
      .catch((error) => {
        if (error.name !== "AbortError") console.error("Could not load emergency contact settings.", error);
      });
    return () => controller.abort();
  }, []);

  const showSlide = (index) => {
    setActiveSlide((index + slides.length) % slides.length);
  };

  const slide = slides[activeSlide];

  if (isAppointmentPage || doctorMatch || isGalleryPage || isNoticesPage || serviceMatch || isFacilitiesPage || isOffersPage) {
    return (
      <>
        <Header />
        {isAppointmentPage ? <AppointmentPage /> : doctorMatch ? <DoctorsPage slug={doctorMatch[1] ? decodeURIComponent(doctorMatch[1]) : null} /> : isGalleryPage ? <GalleryPage /> : isNoticesPage ? <NoticesPage /> : serviceMatch ? <ServicesPage slug={serviceMatch[1] ? decodeURIComponent(serviceMatch[1]) : null} /> : isFacilitiesPage ? <FacilitiesPage /> : <OffersPage />}
        <Footer />
        <FloatingContactTools language={language} setLanguage={setLanguage} />
      </>
    );
  }

  return (
    <>
      <Header />

      <main>
        <section className={`hero-banner ${slide.theme}`} id="home" aria-label="Sirjana Polyclinic highlights">
          {slide.image && <img className="hero-photo" src={slide.image} alt={slide.imageAlt} />}
          <div className="hero-shade" />
          <div className="hero-copy" key={activeSlide}>
            <span className="welcome-label">{t(slide.eyebrow)}</span>
            <h1>{t(slide.title)}</h1>
            <p>{t(slide.description)}</p>
            <a href={slide.href || "/appointment"} className="page-appointment-button">
              {t(slide.action)} <span aria-hidden="true">→</span>
            </a>
            <a href="/appointment" className="hero-mobile-appointment">{t("Book Appointment")} <span aria-hidden="true">→</span></a>
            <span className="hero-mobile-availability">{t("Available all week")}</span>
          </div>

          <button className="hero-arrow hero-arrow-previous" type="button" aria-label="Previous banner" onClick={() => showSlide(activeSlide - 1)}>‹</button>
          <button className="hero-arrow hero-arrow-next" type="button" aria-label="Next banner" onClick={() => showSlide(activeSlide + 1)}>›</button>
          <div className="hero-dots" aria-label="Choose banner">
            {slides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={`hero-dot ${index === activeSlide ? "hero-dot-active" : ""}`}
                aria-label={`Show banner ${index + 1}`}
                aria-current={index === activeSlide ? "true" : undefined}
                onClick={() => showSlide(index)}
              />
            ))}
          </div>
        </section>

        <HomeFeaturedNotices />

        <section className="location-emergency-section" aria-label="Doctor search and emergency support">
          <div className="location-cards">
            <article className="location-card doctor-finder-card" id="doctor-finder">
              <span className="location-icon doctor-icon" aria-hidden="true">✚</span>
              <p className="location-kicker">EXPERT CARE</p>
              <h2>{t("Find Your Doctor")}</h2>
              <p className="location-description">{t("Meet our caring medical team and find the right specialist for your needs.")}</p>
              <a href="/doctors">{t("Find Healthcare Experts")} <span aria-hidden="true">→</span></a>
            </article>

          </div>

          <article className="emergency-card">
            <span className="ambulance-icon" aria-hidden="true">✚</span>
            <p className="emergency-kicker">{t("HERE WHEN YOU NEED US")}</p>
            <h2>{t("24/7 Emergency Care")}</h2>
            <p>{t("For urgent medical help, our ambulance team is ready around the clock. Call for emergency assistance and we’ll help you get the care you need.")}</p>
            {emergencyPhone && <a href={`tel:${emergencyPhone.replace(/[^+\d]/g, "")}`} className="emergency-call">{emergencyPhone}</a>}
          </article>
        </section>

        <section className="clinic-intro-section" id="about">
          <div className="clinic-intro-heading">
            <p className="clinic-intro-kicker">{t("HEALTHCARE IN ROHINI-3, DHAKDHAI")}</p>
            <h2>{t("Everyday care, all under one roof.")}</h2>
            <p className="clinic-intro-lead">{t("Sirjana Advanced Polyclinic is here for individuals and families in DHAKDHAI and across Rupandehi.")}</p>
            <a className="clinic-directions-link" href="https://maps.app.goo.gl/GLVyPFQy24UjXZkc9?g_st=aw" target="_blank" rel="noreferrer">{t("Get directions")} <span aria-hidden="true">↗</span></a>
          </div>
          <div className="clinic-intro-copy">
            <p>{t("From urgent care to everyday checkups, our team brings essential clinic services together in one convenient place.")}</p>
            <a href="/appointment">{t("Book an appointment")} <span aria-hidden="true">→</span></a>
          </div>
        </section>

        <section className="medical-facilities-section" id="services" aria-labelledby="facilities-heading">
          <div className="medical-facilities-heading">
            <p className="clinic-intro-kicker">{t("CARE FOR YOUR EVERYDAY NEEDS")}</p>
            <h2 id="facilities-heading">{t("Our Services")}</h2>
            <p>{t("Essential care and diagnostic services, together in one convenient clinic.")}</p>
          </div>
          <div className="medical-facilities-grid">
            {clinicServices.map((service) => (
              <a className="medical-facility-card" href={`/services/${service.slug}`} key={service.slug}>
                <span className="medical-facility-image"><img src={service.image} alt={service.imageAlt} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = service.fallbackImage || clinicReception; }} /></span>
                <span className="medical-facility-type">{t(service.type)}</span>
                <h3>{t(service.name)}</h3>
                <span className="medical-facility-description">{t(service.description)}</span>
                <span className="medical-facility-more">{t("Explore service")} <span aria-hidden="true">→</span></span>
              </a>
            ))}
          </div>
        </section>

        <ReviewsSection />

      </main>

      <Footer />
      <FirstVisitNoticePopup />
      <FloatingContactTools language={language} setLanguage={setLanguage} />
    </>
  );
}

function FloatingContactTools({ language, setLanguage }) {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  return (
    <div className="floating-contact-tools">
      <a className="whatsapp-float" href="https://wa.me/9779714548880?text=Hello%20Sirjana%20Polyclinic" target="_blank" rel="noreferrer" aria-label="Chat with Sirjana Polyclinic on WhatsApp">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 3.2A12.7 12.7 0 0 0 5.1 22.35L3.3 28.9l6.7-1.75A12.7 12.7 0 1 0 16.04 3.2Zm0 23.1c-1.95 0-3.85-.52-5.5-1.52l-.4-.23-3.97 1.04 1.06-3.86-.26-.4A10.38 10.38 0 1 1 16.04 26.3Zm5.7-7.78c-.3-.15-1.76-.87-2.03-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.49-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.25-.59-.5-.5-.68-.51l-.58-.01c-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35Z" /></svg>
      </a>
      <div className="language-picker">
        <button
          className="language-icon-button"
          type="button"
          aria-label="Choose language"
          aria-expanded={languageMenuOpen}
          aria-controls="language-options"
          onClick={() => setLanguageMenuOpen((open) => !open)}
        >
          <svg className="language-globe" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3.5 12h17M12 3c2.4 2.5 3.5 5.5 3.5 9s-1.1 6.5-3.5 9c-2.4-2.5-3.5-5.5-3.5-9S9.6 5.5 12 3Z" /></svg>
        </button>
        {languageMenuOpen && (
          <div className="language-options" id="language-options" role="group" aria-label="Language options">
            <button type="button" aria-pressed={language === "en"} onClick={() => { setLanguage("en"); setLanguageMenuOpen(false); }}>English</button>
            <button type="button" aria-pressed={language === "ne"} onClick={() => { setLanguage("ne"); setLanguageMenuOpen(false); }}>नेपाली</button>
            <button type="button" aria-pressed={language === "bho"} onClick={() => { setLanguage("bho"); setLanguageMenuOpen(false); }}>भोजपुरी</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
