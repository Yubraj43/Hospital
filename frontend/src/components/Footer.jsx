import "./HeaderFooter.css";
import { useLanguage } from "./LanguageContext";

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-main header-container">
        <div className="footer-brand">
          <a href="/" className="hospital-logo footer-logo">
            <span className="logo-symbol" aria-hidden="true">✚</span>
            <span className="logo-text">
              Sirjana <span>Polyclinic</span>
              <small>CARE FOR EVERY GENERATION</small>
            </span>
          </a>
          <p>{t("Thoughtful, trusted healthcare for you and your family.")}</p>
        </div>

        <div className="footer-column">
          <h3>{t("Explore")}</h3>
          <a href="https://drsulaimanalhabib.ae/departments/">{t("Specialities")}</a>
          <a href="/#doctors">{t("Doctors")}</a>
          <a href="https://drsulaimanalhabib.ae/hmg-medical-facilities/">{t("Medical Facilities")}</a>
          <a href="https://drsulaimanalhabib.ae/health-insurance">{t("Insurance")}</a>
          <a href="https://drsulaimanalhabib.ae/health-checkups-in-dubai/">{t("Packages/Offers")}</a>
          <a href="https://careers.drsulaimanalhabib.ae/">{t("Careers")}</a>
        </div>

        <div className="footer-column">
          <h3>{t("Patient Care")}</h3>
          <a href="#contact">{t("Contact the Clinic")}</a>
          <a href="/appointment">{t("Appointments")}</a>
          <a href="#specialties">{t("Departments")}</a>
        </div>

        <div className="quick-contact-card">
          <h3>{t("Quick Contacts")}</h3>
          <div className="quick-contact-item"><span aria-hidden="true">⌖</span><p>{t("Bhairahawa, Nepal")}</p></div>
          <div className="quick-contact-item"><span aria-hidden="true">☎</span><a href="tel:+9771000000000">{t("Call our clinic")}</a></div>
          <div className="quick-contact-item"><span aria-hidden="true">✉</span><a href="mailto:info@sirjanapolyclinic.com">info@sirjanapolyclinic.com</a></div>
          <div className="quick-contact-socials" aria-label="Social media">
            <a href="#contact" aria-label={t("Facebook")}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.4 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.2V13H10v8h3.4Z" /></svg>
            </a>
            <a href="#contact" aria-label={t("Instagram")}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle className="social-icon-dot" cx="17.7" cy="6.7" r="1" /></svg>
            </a>
            <a href="#contact" aria-label={t("TikTok")}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.7 3c.3 2.1 1.5 3.4 3.5 3.6v3.2a8 8 0 0 1-3.5-1v6.6a5.7 5.7 0 1 1-5.7-5.7c.4 0 .8 0 1.2.1v3.4a2.7 2.7 0 1 0 1.5 2.4V3h3Z" /></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="header-container footer-bottom-content">
          <p>© {new Date().getFullYear()} Sirjana Polyclinic.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
