import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import "./FacilitiesPage.css";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://sirjana-hospital-backend.onrender.com/api").replace(/\/$/, "");

function FacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/facilities/`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Facilities unavailable");
        return response.json();
      })
      .then((data) => setFacilities(Array.isArray(data) ? data : data.results || []))
      .catch((error) => {
        if (error.name !== "AbortError") setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="facilities-page">
      <div className="facilities-page-container">
        <header className="facilities-heading">
          <p className="facilities-eyebrow">{t("CARE AND EQUIPMENT AT OUR CLINIC")}</p>
          <h1>{t("Medical Facilities")}</h1>
          <p>{t("Explore the facilities currently available at Sirjana Advanced Polyclinic.")}</p>
        </header>

        {loading ? <p className="facilities-state">{t("Loading facilities…")}</p> : failed ? (
          <p className="facilities-state facilities-error" role="status">{t("Facility information is temporarily unavailable. Please try again shortly.")}</p>
        ) : facilities.length === 0 ? (
          <section className="facilities-state facilities-empty">
            <span className="facilities-empty-icon" aria-hidden="true">✚</span>
            <h2>{t("Facility information is being prepared")}</h2>
            <p>{t("Confirmed facilities will be listed here when the clinic publishes their details.")}</p>
            <a className="facilities-contact-link" href="/appointment">{t("Contact the Clinic")} <span aria-hidden="true">→</span></a>
          </section>
        ) : (
          <div className="facilities-grid">
            {facilities.map((facility) => (
              <article className="facility-card" key={facility.id}>
                {facility.image ? (
                  <div className="facility-card-image-wrap">
                    <img src={facility.image} alt={facility.name} loading="lazy" />
                  </div>
                ) : (
                  <div className="facility-card-icon" aria-hidden="true">✚</div>
                )}
                <div className="facility-card-content">
                  <h2>{facility.name}</h2>
                  {facility.description && <p>{facility.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default FacilitiesPage;
