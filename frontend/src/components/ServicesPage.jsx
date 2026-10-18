import { useEffect, useState } from "react";
import clinicReception from "../assets/clinic-reception.jpg";
import { useLanguage } from "./LanguageContext";
import "./ServicesPage.css";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://sirjana-hospital-backend.onrender.com/api").replace(/\/$/, "");

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/services/`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Services unavailable");
        return response.json();
      })
      .then((data) => setServices(Array.isArray(data) ? data : data.results || []))
      .catch((error) => {
        if (error.name !== "AbortError") setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="services-page">
      <div className="services-page-container">
        <header className="services-heading">
          <p className="services-eyebrow">{t("CARE FOR YOUR EVERYDAY NEEDS")}</p>
          <h1>{t("Our Services")}</h1>
          <p>{t("Explore the care and services available at Sirjana Advanced Polyclinic.")}</p>
        </header>

        {loading ? <p className="services-state">{t("Loading services…")}</p> : failed ? (
          <p className="services-state services-error" role="status">{t("Services are temporarily unavailable. Please try again shortly.")}</p>
        ) : services.length === 0 ? (
          <section className="services-state services-empty">
            <span className="services-empty-icon" aria-hidden="true">✚</span>
            <h2>{t("Our services are being updated")}</h2>
            <p>{t("Published clinic services will appear here.")}</p>
            <a className="services-contact-link" href="/appointment">{t("Book an appointment")} <span aria-hidden="true">→</span></a>
          </section>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.id}>
                <div className="service-card-image-wrap">
                  <img src={service.image || clinicReception} alt={service.image ? service.name : "Sirjana Polyclinic"} loading="lazy" />
                </div>
                <div className="service-card-content">
                  <span className="service-card-mark" aria-hidden="true">✚</span>
                  <h2>{service.name}</h2>
                  {service.description && <p>{service.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
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
