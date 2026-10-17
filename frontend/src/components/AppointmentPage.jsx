import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import "../App.css";

function AppointmentPage() {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="appointment-page">
      <h1 className="appointment-title">{t("Book An Appointment")}</h1>
      <div className="appointment-layout">
        <section className="appointment-form-card" aria-label="Appointment request form">
          {submitted ? (
            <div className="appointment-success" role="status">
              <span aria-hidden="true">✓</span>
              <h2>{t("Thank you for reaching out.")}</h2>
              <p>{t("Your appointment request has been noted. Our team will contact you to discuss availability and confirm a time.")}</p>
              <a href="/">{t("Return to home")}</a>
            </div>
          ) : (
            <form className="appointment-form" onSubmit={handleSubmit}>
              <label className="appointment-field branch-field">
              <span className="visually-hidden">{t("Branch")}</span>
                <select name="branch" defaultValue="" required>
                  <option value="" disabled>{t("Branch")}</option>
                  <option>{t("Head Office · Bhairahawa")}</option>
                  <option>{t("Second Branch · Bhairahawa")}</option>
                </select>
              </label>

              <div className="appointment-form-row patient-row">
                <label className="appointment-field">
                  <span className="visually-hidden">{t("First Name")}</span>
                  <input name="name" type="text" autoComplete="given-name" placeholder={t("First Name")} required />
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

              <div className="appointment-form-row">
                <label className="appointment-field">
                  <span className="visually-hidden">Preferred date</span>
                  <input name="date" type="date" min={new Date().toISOString().split("T")[0]} required />
                </label>
                <label className="appointment-field">
                  <span className="visually-hidden">Preferred time</span>
                  <select name="time" defaultValue="" required>
                  <option value="" disabled>{t("Preferred time")}</option>
                  <option>{t("Morning")}</option>
                  <option>{t("Afternoon")}</option>
                  <option>{t("Evening")}</option>
                  </select>
                </label>
              </div>

              <label className="appointment-field">
                <span className="visually-hidden">{t("Comments (optional)")}</span>
                <textarea name="message" rows="3" placeholder={t("Comments (optional)")} />
              </label>

            <button type="submit" className="appointment-submit">{t("Submit")}</button>
              <p className="appointment-form-note">{t("Our team will contact you to confirm your appointment request.")}</p>
            </form>
          )}
        </section>

        <aside className="appointment-assistance">
          <div className="appointment-assistance-shade" />
          <div className="appointment-assistance-content">
            <h2>{t("Need Assistance?")}</h2>
            <p>{t("Please feel free to contact us and we’ll help you with your appointment request.")}</p>
            <a href="tel:+9771000000000" className="assistance-phone-icon" aria-label={t("Call our clinic")}>☎</a>
            <div className="assistance-phone-list">
              <a href="tel:+9771000000000">{t("Head Office · Call the clinic")}</a>
              <a href="tel:+9771000000000">{t("Second Branch · Call the clinic")}</a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default AppointmentPage;
