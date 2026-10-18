import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { API_BASE_URL } from "../api";
import "./OffersPage.css";



function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/offers/`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Offers unavailable");
        return response.json();
      })
      .then((data) => setOffers(Array.isArray(data) ? data : data.results || []))
      .catch((error) => {
        if (error.name !== "AbortError") setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="offers-page">
      <div className="offers-page-container">
        <header className="offers-heading">
          <p className="offers-eyebrow">{t("CARE PACKAGES AND SPECIAL OFFERS")}</p>
          <h1>{t("Packages & Offers")}</h1>
          <p>{t("Explore current packages and offers from Sirjana Advanced Polyclinic.")}</p>
        </header>

        {loading ? <p className="offers-state">{t("Loading offers…")}</p> : failed ? (
          <p className="offers-state offers-error" role="status">{t("Offers are temporarily unavailable. Please try again shortly.")}</p>
        ) : offers.length === 0 ? (
          <section className="offers-state offers-empty">
            <span className="offers-empty-icon" aria-hidden="true">% </span>
            <h2>{t("No active packages or offers right now")}</h2>
            <p>{t("New offers will appear here when they are published by the clinic.")}</p>
            <a className="offers-contact-link" href="/appointment">{t("Contact the Clinic")} <span aria-hidden="true">→</span></a>
          </section>
        ) : (
          <div className="offers-grid">
            {offers.map((offer) => (
              <article className="offer-card" key={offer.id}>
                {offer.image ? (
                  <div className="offer-card-image"><img src={offer.image} alt={offer.title} loading="lazy" /></div>
                ) : (
                  <div className="offer-card-image offer-card-image-placeholder"><span aria-hidden="true">✚</span><span>{t("Special offer")}</span></div>
                )}
                <div className="offer-card-content">
                  {offer.starts_at || offer.expires_at ? <p className="offer-validity">{formatValidity(offer.starts_at, offer.expires_at, t)}</p> : <p className="offer-validity">{t("Available now")}</p>}
                  <h2>{offer.title}</h2>
                  {offer.description && <p className="offer-description">{offer.description}</p>}
                  {(offer.offer_price || offer.regular_price) && (
                    <div className="offer-prices">
                      {offer.offer_price && <strong>{formatPrice(offer.offer_price)}</strong>}
                      {offer.regular_price && <span className={offer.offer_price ? "offer-regular-price" : ""}>{formatPrice(offer.regular_price)}</span>}
                    </div>
                  )}
                  {offer.terms && <details className="offer-terms"><summary>{t("Terms and conditions")}</summary><p>{offer.terms}</p></details>}
                  <a className="offer-action" href="/appointment">{t("Enquire about this offer")} <span aria-hidden="true">→</span></a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function formatPrice(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? `NPR ${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(amount)}` : value;
}

function formatValidity(start, end, t) {
  if (start && end) return `${t("Valid")} ${formatDate(start)} – ${formatDate(end)}`;
  if (start) return `${t("Starts")} ${formatDate(start)}`;
  return `${t("Valid through")} ${formatDate(end)}`;
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export default OffersPage;
