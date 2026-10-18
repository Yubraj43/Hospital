import { useEffect, useState } from "react";
import clinicDoctor from "../assets/clinic-doctor.jpg";
import { useLanguage } from "./LanguageContext";
import "./DoctorsPage.css";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

function DoctorsPage({ slug }) {
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    const endpoint = slug ? `${API_BASE_URL}/doctors/${encodeURIComponent(slug)}/` : `${API_BASE_URL}/doctors/`;
    fetch(endpoint, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Doctor information unavailable");
        return response.json();
      })
      .then((data) => {
        if (slug) setDoctor(data);
        else setDoctors(Array.isArray(data) ? data : data.results || []);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [slug]);

  if (slug) {
    return (
      <main className="doctors-page doctor-profile-page">
        <div className="doctors-page-container">
          <a className="doctors-back-link" href="/doctors">← {t("All Doctors")}</a>
          {loading ? <p className="doctors-state">{t("Loading doctor profile…")}</p> : failed || !doctor ? (
            <section className="doctors-state doctors-error" role="status">
              <h1>{t("Doctor profile unavailable")}</h1>
              <p>{t("This profile may have been unpublished or the doctor service is temporarily unavailable.")}</p>
              <a className="doctors-primary-button" href="/doctors">{t("View all doctors")}</a>
            </section>
          ) : (
            <article className="doctor-profile-card">
              <div className="doctor-profile-photo-wrap">
                <img className="doctor-profile-photo" src={doctor.photograph || clinicDoctor} alt={doctor.name} />
              </div>
              <div className="doctor-profile-content">
                <p className="doctors-eyebrow">{t("OUR MEDICAL TEAM")}</p>
                <h1>{doctor.name}</h1>
                {doctor.specialization && <p className="doctor-specialty">{doctor.specialization}</p>}
                <dl className="doctor-details-list">
                  {doctor.qualifications && <div><dt>{t("Qualifications")}</dt><dd>{doctor.qualifications}</dd></div>}
                  <div><dt>{t("Experience")}</dt><dd>{doctor.years_experience} {t("years")}</dd></div>
                  {doctor.consultation_fee && <div><dt>{t("Consultation fee")}</dt><dd>{doctor.consultation_fee}</dd></div>}
                  {doctor.available_days && <div><dt>{t("Available days")}</dt><dd>{doctor.available_days}</dd></div>}
                  {doctor.available_hours && <div><dt>{t("Available hours")}</dt><dd>{doctor.available_hours}</dd></div>}
                </dl>
                {doctor.biography && <p className="doctor-biography">{doctor.biography}</p>}
                <a className="doctors-primary-button" href={`/appointment?doctor=${encodeURIComponent(doctor.slug)}`}>
                  {t("Book Appointment")} <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="doctors-page">
      <div className="doctors-page-container">
        <header className="doctors-heading">
          <p className="doctors-eyebrow">{t("CARE YOU CAN TRUST")}</p>
          <h1>{t("Meet Our Doctors")}</h1>
          <p>{t("Get to know our medical team and find the right care for you and your family.")}</p>
        </header>
        {loading ? <p className="doctors-state">{t("Loading doctors…")}</p> : failed ? (
          <p className="doctors-state doctors-error" role="status">{t("Doctor profiles are temporarily unavailable. Please try again shortly.")}</p>
        ) : doctors.length === 0 ? (
          <section className="doctors-state doctors-empty">
            <span className="doctor-empty-icon" aria-hidden="true">✚</span>
            <h2>{t("Our care team is being introduced")}</h2>
            <p>{t("Doctor profiles will appear here as soon as they are added by the clinic.")}</p>
            <a className="doctors-primary-button" href="/appointment">{t("Book an appointment")} <span aria-hidden="true">→</span></a>
          </section>
        ) : (
          <div className="doctors-grid">
            {doctors.map((item) => (
              <a className="doctor-card" href={`/doctors/${encodeURIComponent(item.slug)}`} key={item.id}>
                <div className="doctor-card-photo-wrap">
                  <img className="doctor-card-photo" src={item.photograph || clinicDoctor} alt={item.name} loading="lazy" />
                </div>
                <div className="doctor-card-content">
                  <p className="doctors-eyebrow">{item.specialization || t("MEDICAL DOCTOR")}</p>
                  <h2>{item.name}</h2>
                  {item.qualifications && <p className="doctor-card-qualifications">{item.qualifications}</p>}
                  <span className="doctor-card-link">{t("View Profile")} <span aria-hidden="true">→</span></span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default DoctorsPage;
