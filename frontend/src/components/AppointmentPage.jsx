import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import "../App.css";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

function AppointmentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [doctorSlug, setDoctorSlug] = useState(() => new URLSearchParams(window.location.search).get("doctor") || "");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [clinicClock, setClinicClock] = useState(getClinicClock);
  const { t } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/doctors/`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Doctor list unavailable");
        return response.json();
      })
      .then((data) => setDoctors(Array.isArray(data) ? data : data.results || []))
      .catch((error) => {
        if (error.name !== "AbortError") setDoctors([]);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setClinicClock(getClinicClock()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch(`${API_BASE_URL}/appointments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: String(formData.get("name") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          age: formData.get("age") ? Number(formData.get("age")) : null,
          gender: String(formData.get("gender") || ""),
          doctor: doctorSlug || null,
          appointment_date: String(formData.get("date") || ""),
          preferred_time: String(formData.get("time") || ""),
          reason: String(formData.get("message") || "").trim(),
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const details = Object.entries(result).map(([field, errors]) => {
          const message = Array.isArray(errors) ? errors.join(" ") : String(errors);
          return `${field}: ${message}`;
        }).join(" ");
        throw new Error(details || t("We couldn't submit your request. Please check your details and try again."));
      }

      setEmailSent(Boolean(result.email_sent));
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.name === "TypeError"
        ? t("We couldn't reach the appointment service. Please call the clinic.")
        : error.message || t("We couldn't reach the appointment service. Please call the clinic."));
    } finally {
      setSubmitting(false);
    }
  };

  const { minimumDate, minimumTime } = clinicClock;

  return (
    <main className="appointment-page">
      <h1 className="appointment-title">{t("Book An Appointment")}</h1>
      <div className="appointment-layout">
        <section className="appointment-form-card" aria-label="Appointment request form">
          {submitted ? (
            <div className="appointment-success" role="status">
              <span aria-hidden="true">{emailSent ? "✓" : "!"}</span>
              <h2>{t(emailSent ? "Thank you for reaching out." : "Request saved — please call the clinic.")}</h2>
              <p>{t(emailSent
                ? "Your appointment request was received. The clinic will contact you to confirm a time."
                : "Your request was saved, but email delivery is not ready yet. Please call the clinic to confirm receipt.")}</p>
              <a href="/">{t("Return to home")}</a>
            </div>
          ) : (
            <form className="appointment-form" onSubmit={handleSubmit}>
              <div className="appointment-form-row patient-row">
                <label className="appointment-field">
                  <span className="visually-hidden">{t("First Name")}</span>
                  <input name="name" type="text" autoComplete="name" placeholder={t("First Name")} required />
                </label>
                <label className="appointment-field">
                  <span className="visually-hidden">{t("Age")}</span>
                  <input name="age" type="number" min="0" max="120" placeholder={t("Age")} required />
                </label>
                <label className="appointment-field">
                  <span className="visually-hidden">{t("Gender")}</span>
                  <select name="gender" defaultValue="" required>
                    <option value="" disabled>{t("Gender")}</option>
                    <option>{t("Female")}</option>
                    <option>{t("Male")}</option>
                    <option>{t("Other")}</option>
                    <option>{t("Prefer not to say")}</option>
                  </select>
                </label>
              </div>

              <div className="appointment-form-row">
                <label className="appointment-field">
                  <span className="visually-hidden">{t("Phone Number")}</span>
                  <input name="phone" type="tel" autoComplete="tel" placeholder={t("Phone Number")} required />
                </label>
                <label className="appointment-field">
                  <span className="visually-hidden">{t("Email (optional)")}</span>
                  <input name="email" type="email" autoComplete="email" placeholder={t("Email (optional)")} />
                </label>
              </div>

              <label className="appointment-field">
                <span className="visually-hidden">{t("Choose a doctor (optional)")}</span>
                <select name="doctor" value={doctorSlug} onChange={(event) => setDoctorSlug(event.target.value)}>
                  <option value="">{t("Choose a doctor (optional)")}</option>
                  {doctors.map((doctor) => <option key={doctor.id} value={doctor.slug}>{doctor.name}</option>)}
                </select>
              </label>

              <div className="appointment-form-row">
                <label className="appointment-field">
                  <span className="visually-hidden">{t("Preferred date")}</span>
                  <input name="date" type="date" min={minimumDate} value={appointmentDate} onChange={(event) => { setAppointmentDate(event.target.value); setAppointmentTime(""); }} required />
                </label>
                <label className="appointment-field">
                  <span className="visually-hidden">{t("Appointment time")}</span>
                  <input name="time" type="time" min={appointmentDate === minimumDate ? minimumTime : "00:00"} value={appointmentTime} onChange={(event) => setAppointmentTime(event.target.value)} required />
                </label>
              </div>

              <label className="appointment-field">
                <span className="visually-hidden">{t("Comments (optional)")}</span>
                <textarea name="message" rows="3" placeholder={t("Comments (optional)")} />
              </label>

              {submitError && <p className="appointment-form-error" role="alert">{submitError}</p>}
              <button type="submit" className="appointment-submit" disabled={submitting}>
                {submitting ? t("Sending request…") : t("Submit")}
              </button>
              <p className="appointment-form-note">{t("Our team will contact you to confirm your appointment request.")}</p>
            </form>
          )}
        </section>

        <aside className="appointment-assistance">
          <div className="appointment-assistance-shade" />
          <div className="appointment-assistance-content">
            <h2>{t("Need Assistance?")}</h2>
            <p>{t("Please feel free to contact us and we’ll help you with your appointment request.")}</p>
            <a href="tel:+9779714548880" className="assistance-phone-icon" aria-label={t("Call our clinic")}>☎</a>
            <div className="assistance-phone-list">
              <a href="tel:+9779714548880">{t("Call our clinic")} · 971-4548880</a>
              <a href="https://wa.me/9779714548880">{t("WhatsApp")} · +977 971-4548880</a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function getClinicClock() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date()).reduce((values, part) => {
    if (part.type !== "literal") values[part.type] = part.value;
    return values;
  }, {});
  const date = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute) + 1));
  const pad = (value) => String(value).padStart(2, "0");
  return {
    minimumDate: `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`,
    minimumTime: `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`,
  };
}

export default AppointmentPage;
