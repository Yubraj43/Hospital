import { useEffect, useMemo, useRef, useState } from "react";
import clinicReception from "../assets/clinic-reception.jpg";
import { useLanguage } from "./LanguageContext";
import { API_BASE_URL } from "../api";
import { clinicServices } from "./servicesCatalog";
import "./ServicesPage.css";

function ServicesPage({ slug = null }) {
  const [publishedServices, setPublishedServices] = useState([]);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const serviceRefs = useRef([]);
  const { t } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/services/`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : [])
      .then((data) => setPublishedServices(Array.isArray(data) ? data : data.results || []))
      .catch((error) => {
        if (error.name !== "AbortError") console.warn("Using the local service information while the clinic service list is unavailable.");
      });
    return () => controller.abort();
  }, []);

  const services = useMemo(() => {
    const used = new Set();
    const localServices = clinicServices.map((local) => {
      const published = publishedServices.find((item) => item.slug === local.slug || item.name?.toLowerCase() === local.name.toLowerCase());
      if (!published) return local;
      used.add(published.id || published.slug);
      return {
        ...local,
        ...published,
        slug: local.slug,
        type: local.type,
        details: published.description || local.details,
        description: published.description || local.description,
        image: published.image || local.image,
        imageAlt: local.imageAlt,
      };
    });
    const extraServices = publishedServices
      .filter((item) => !used.has(item.id || item.slug) && !localServices.some((local) => item.slug === local.slug || item.name?.toLowerCase() === local.name.toLowerCase()))
      .map((item) => ({
        ...item,
        type: "Clinic service",
        details: item.description || "Contact the clinic to learn more about this service and how to arrange a visit.",
        image: item.image || clinicReception,
        fallbackImage: item.fallbackImage || clinicReception,
        imageAlt: item.name,
      }));
    return [...localServices, ...extraServices];
  }, [publishedServices]);

  const selectedServiceIndex = Math.min(activeServiceIndex, Math.max(services.length - 1, 0));

  useEffect(() => {
    serviceRefs.current[selectedServiceIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedServiceIndex, services.length]);

  const moveService = (direction) => {
    setActiveServiceIndex((current) => (current + direction + services.length) % services.length);
  };

  const activeService = slug ? services.find((service) => service.slug === slug) : null;

  if (slug) {
    return activeService ? (
      <main className="services-page service-detail-page">
        <div className="services-page-container">
          <a className="service-back-link" href="/services">← {t("All services")}</a>
          <article className="service-detail-card">
            <div className="service-detail-image"><img src={activeService.image} alt={activeService.imageAlt || activeService.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = activeService.fallbackImage || clinicReception; }} /></div>
            <div className="service-detail-copy">
              <p className="services-eyebrow">{t(activeService.type || "Clinic service")}</p>
              <h1>{t(activeService.name)}</h1>
              <p className="service-detail-summary">{t(activeService.description || "Care and support from the Sirjana clinic team.")}</p>
              <p className="service-detail-description">{t(activeService.details || activeService.description || "Contact the clinic to learn more about this service and how to arrange a visit.")}</p>
              <div className="service-detail-actions">
                <a className="service-detail-primary" href="/appointment">{t("Book an appointment")} <span aria-hidden="true">→</span></a>
                <a className="service-detail-secondary" href="tel:+9779714548880">{t("Contact the Clinic")} <span aria-hidden="true">↗</span></a>
                <a className="service-detail-whatsapp" href="https://wa.me/9779714548880?text=Hello%20Sirjana%20Polyclinic" target="_blank" rel="noreferrer">{t("WhatsApp the Clinic")} <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </article>
        </div>
      </main>
    ) : (
      <main className="services-page"><div className="services-page-container"><a className="service-back-link" href="/services">← {t("All services")}</a><p className="services-state">{t("This service could not be found.")}</p></div></main>
    );
  }

  return (
    <main className="services-page">
      <div className="services-page-container">
        <header className="services-heading">
          <p className="services-eyebrow">{t("CARE FOR YOUR EVERYDAY NEEDS")}</p>
          <h1>{t("Our Services")}</h1>
          <p>{t("Explore the care and services available at Sirjana Advanced Polyclinic.")}</p>
        </header>
        <section className="services-carousel" aria-label={t("Clinic services")}>
          <button
            className="services-carousel-arrow"
            type="button"
            aria-label={t("Previous service")}
            onClick={() => moveService(-1)}
            disabled={services.length < 2}
          >
            ‹
          </button>
          <div className="services-carousel-window">
            <div className="services-carousel-track">
              {services.map((service, index) => (
                <a
                  className={`services-card ${index === selectedServiceIndex ? "services-card-active" : ""}`}
                  href={`/services/${service.slug}`}
                  key={service.id || service.slug || service.name}
                  ref={(element) => { serviceRefs.current[index] = element; }}
                  onClick={(event) => {
                    if (index !== selectedServiceIndex) {
                      event.preventDefault();
                      setActiveServiceIndex(index);
                    }
                  }}
                  aria-current={index === selectedServiceIndex ? "true" : undefined}
                >
                  <span className="services-card-image"><img src={service.image} alt={service.imageAlt || service.name} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = service.fallbackImage || clinicReception; }} /></span>
                  <span className="services-card-content">
                    <span className="services-card-type">{t(service.type || "Clinic service")}</span>
                    <strong>{t(service.name)}</strong>
                    <span className="services-card-description">{t(service.description || "Get in touch with our clinic team to learn more.")}</span>
                    <span className="services-card-link">{t("Explore service")} <span aria-hidden="true">→</span></span>
                  </span>
                </a>
              ))}
            </div>
          </div>
          <button
            className="services-carousel-arrow"
            type="button"
            aria-label={t("Next service")}
            onClick={() => moveService(1)}
            disabled={services.length < 2}
          >
            ›
          </button>
        </section>
        <div className="services-contact-banner">
          <div>
            <p className="services-eyebrow">{t("HERE WHEN YOU NEED US")}</p>
            <h2>{t("Have a question about our services?")}</h2>
          </div>
          <a href="/appointment">{t("Book an appointment")} <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </main>
  );
}

export default ServicesPage;
