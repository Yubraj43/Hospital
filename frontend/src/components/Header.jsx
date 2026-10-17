import { useState } from "react";
import { useLanguage } from "./LanguageContext";
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
            <a href="tel:+9771000000000">{t("Call our clinic")}</a>
          </div>
        </div>
      </div>

      <div className="main-header">
        <div className="header-container main-header-content">
          <a href="/" className="hospital-logo" onClick={closeMenu} aria-label="Sirjana Polyclinic home">
            <span className="logo-symbol" aria-hidden="true">✚</span>
            <span className="logo-text">
              Sirjana <span>Polyclinic</span>
              <small>CARE FOR EVERY GENERATION</small>
            </span>
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
            <a href="https://drsulaimanalhabib.ae/departments/" onClick={closeMenu}>{t("Specialities")}</a>
            <a href="https://drsulaimanalhabib.ae/doctors/" onClick={closeMenu}>{t("Doctors")}</a>
            <a href="https://drsulaimanalhabib.ae/hmg-medical-facilities/" onClick={closeMenu}>{t("Medical Facilities")}</a>
            <a href="https://drsulaimanalhabib.ae/health-insurance" onClick={closeMenu}>{t("Insurance")}</a>
            <a href="https://drsulaimanalhabib.ae/health-checkups-in-dubai/" onClick={closeMenu}>{t("Packages/Offers")}</a>
            <a href="https://careers.drsulaimanalhabib.ae/" onClick={closeMenu}>{t("Careers")}</a>
          </nav>

          <a href="/appointment" className="header-appointment">{t("Appointment")} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </header>
  );
}

export default Header;
