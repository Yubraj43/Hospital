import "./HeaderFooter.css";
import { useLanguage } from "./LanguageContext";
import clinicLogo from "../assets/sirjana-advanced-logo.jpg";

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-main header-container">
        <div className="footer-brand">
          <a href="/" className="hospital-logo footer-logo">
            <img className="hospital-logo-image" src={clinicLogo} alt="Sirjana Advanced Polyclinic Pvt. Ltd." />
          </a>
          <p>{t("Thoughtful, trusted healthcare for you and your family.")}</p>
        </div>

        <div className="footer-column">
          <h3>{t("Explore")}</h3>
          <a href="/services">{t("Our Services")}</a>
          <a href="/doctors">{t("Doctors")}</a>
          <a href="/facilities">{t("Medical Facilities")}</a>
          <a href="/offers">{t("Packages and Offers")}</a>
          <a href="/gallery">{t("Gallery")}</a>
          <a href="/notices">{t("Notice")}</a>
        </div>

        <div className="footer-column">
          <h3>{t("Patient Care")}</h3>
          <a href="#contact">{t("Contact the Clinic")}</a>
          <a href="/appointment">{t("Appointments")}</a>
          <a href="#specialties">{t("Departments")}</a>
        </div>

        <div className="quick-contact-card">
          <h3>{t("Quick Contacts")}</h3>
          <a className="quick-location-link" href="https://maps.app.goo.gl/GLVyPFQy24UjXZkc9?g_st=aw" target="_blank" rel="noreferrer">
            <span aria-hidden="true">⌖</span>
            <span>{t("Rohini-3, Dhakdhai, Rupandehi")}</span>
            <small>{t("Open in Google Maps")} ↗</small>
          </a>
          <div className="quick-contact-item"><span aria-hidden="true">☎</span><a href="tel:+9779714548880">971-4548880</a></div>
          <div className="quick-contact-item"><span aria-hidden="true">◉</span><a href="https://wa.me/9779714548880" target="_blank" rel="noreferrer">+977 971-4548880</a></div>
          <div className="quick-contact-item"><span aria-hidden="true">◎</span><a href="https://sirjanapolyclinic.com.np" target="_blank" rel="noreferrer">sirjanapolyclinic.com.np</a></div>
          <div className="quick-contact-socials" aria-label="Social media">
            <a href="https://www.facebook.com/people/Sirjana-Advanced-Polyclinic-Pvt-Ltd/61593686441693/?rdid=tE6ZOwTFb9kXoWau&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1dUXhKb8ry%2F" aria-label={t("Facebook")}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.4 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.2V13H10v8h3.4Z" /></svg>
            </a>
            <a href="https://www.instagram.com/sirjanapolyclinic?srtk=eHlycW9icTdtOGFm" aria-label={t("Instagram")}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle className="social-icon-dot" cx="17.7" cy="6.7" r="1" /></svg>
            </a>
            <a href="https://vm.tiktok.com/ZS9Ux6MBUTxrK-r3W1B/" aria-label={t("TikTok")}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.7 3c.3 2.1 1.5 3.4 3.5 3.6v3.2a8 8 0 0 1-3.5-1v6.6a5.7 5.7 0 1 1-5.7-5.7c.4 0 .8 0 1.2.1v3.4a2.7 2.7 0 1 0 1.5 2.4V3h3Z" /></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="header-container footer-bottom-content">
          <p>© {new Date().getFullYear()} Sirjana Advanced Polyclinic Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
