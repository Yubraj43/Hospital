import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import clinicLogo from "../assets/sirjana-advanced-logo.jpg";
import "./HeaderFooter.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="top-bar">
        <div className="header-container top-bar-content">
          <span>{t("Care you can trust, close to home")}</span>
          <div className="top-bar-right">
            <a href="tel:+9779714548880">{t("Call our clinic")} · 971-4548880</a>
          </div>
        </div>
      </div>

      <div className="main-header">
        <div className="header-container main-header-content">
          <a href="/" className="hospital-logo" onClick={closeMenu} aria-label="Sirjana Polyclinic home">
            <img className="hospital-logo-image" src={clinicLogo} alt="Sirjana Advanced Polyclinic Pvt. Ltd." />
          </a>

          <div className="mobile-header-actions">
            <button
              type="button"
              className="mobile-menu-button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="main-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="menu-button-icon" aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
            </button>
          </div>

          <nav
            id="main-navigation"
            className={`navigation ${menuOpen ? "navigation-open" : ""}`}
            aria-label={t("Main navigation")}
          >
            <button type="button" className="navigation-placeholder" onClick={closeMenu}>{t("Specialities")}</button>
            <button type="button" className="navigation-placeholder" onClick={closeMenu}>{t("Doctors")}</button>
            <a className="navigation-link" href="/#facilities" onClick={closeMenu}>{t("Medical Facilities")}</a>
            <button type="button" className="navigation-placeholder" onClick={closeMenu}>{t("Insurance")}</button>
            <button type="button" className="navigation-placeholder" onClick={closeMenu}>{t("Packages/Offers")}</button>
            <button type="button" className="navigation-placeholder" onClick={closeMenu}>{t("Careers")}</button>
          </nav>

          <a href="/appointment" className="header-appointment">{t("Appointment")} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </header>
  );
}

export default Header;
