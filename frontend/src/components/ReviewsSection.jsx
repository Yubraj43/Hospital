import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import { useLanguage } from "./LanguageContext";
import "./ReviewsSection.css";

const clinicMapsUrl = "https://www.google.com/maps/search/?api=1&query=Sirjana+Advanced+Polyclinic+Dhakdhai";

function ReviewsSection() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    email: "",
    rating: "5",
    review: "",
    publication_consent: false,
  });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/reviews/`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Reviews could not be loaded");
        return response.json();
      })
      .then((data) => setReviews(Array.isArray(data) ? data : data.results || []))
      .catch((error) => {
        if (error.name !== "AbortError") setLoadError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const submitReview = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    setMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating: Number(form.rating) }),
      });
      const data = await response.json();
      if (!response.ok) {
        const details = Object.values(data).flat().filter(Boolean).join(" ");
        throw new Error(details || t("Please check your review and try again."));
      }
      setReviews((currentReviews) => [data, ...currentReviews]);
      setMessage(t("Thank you. Your review is now published. Your phone number and email remain private."));
      setForm({ name: "", phone_number: "", email: "", rating: "5", review: "", publication_consent: false });
    } catch (error) {
      setFormError(error.message || t("We could not send your review. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="reviews-section" id="reviews" aria-labelledby="reviews-heading">
      <div className="reviews-intro">
        <p className="reviews-kicker">{t("YOUR VOICE MATTERS")}</p>
        <h2 id="reviews-heading">{t("Patient reviews")}</h2>
        <p>{t("Read feedback from patients and share your experience with Sirjana Advanced Polyclinic.")}</p>
        <a href={clinicMapsUrl} target="_blank" rel="noreferrer" className="reviews-link">
          {t("View our location on Google Maps")} <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="reviews-list-wrap" aria-live="polite">
        <div className="reviews-list-heading">
          <div>
            <p className="reviews-kicker">{t("REAL EXPERIENCES")}</p>
            <h3>{t("What patients are saying")}</h3>
          </div>
          <span className="reviews-heading-mark" aria-hidden="true">“</span>
        </div>
        {loading && <p className="reviews-empty">{t("Loading reviews…")}</p>}
        {!loading && loadError && <p className="reviews-empty">{t("Reviews are temporarily unavailable. Please check back soon.")}</p>}
        {!loading && !loadError && reviews.length === 0 && (
          <p className="reviews-empty">{t("No reviews have been published yet. You can be the first to share your experience.")}</p>
        )}
        {!loading && !loadError && reviews.length > 0 && (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <article className="patient-review-card" key={review.id}>
                <div className="patient-review-stars" aria-label={`${review.rating} ${t("out of 5 stars")}`}>
                  <span aria-hidden="true">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                  <span className="visually-hidden">{review.rating} {t("out of 5 stars")}</span>
                </div>
                <p>{review.review}</p>
                <footer><span aria-hidden="true">— </span>{review.name}</footer>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="reviews-form-wrap">
        <form className="reviews-form" onSubmit={submitReview}>
          <p className="reviews-kicker">{t("SHARE YOUR STORY")}</p>
          <h3>{t("Write a review")}</h3>
          <label>
            {t("Your name")}
            <input required minLength={2} maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" />
          </label>
          <div className="reviews-contact-fields">
            <label>
              {t("Phone number")}
              <input required type="tel" maxLength={20} value={form.phone_number} onChange={(event) => setForm({ ...form, phone_number: event.target.value })} autoComplete="tel" />
            </label>
            <label>
              {t("Email address")}
              <input required type="email" maxLength={254} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" />
            </label>
          </div>
          <p className="reviews-private-note">{t("Your phone number and email are collected privately and will never be shown on the website.")}</p>
          <fieldset className="reviews-rating-field">
            <legend>{t("Your rating")}</legend>
            <div className="reviews-rating-stars" role="radiogroup" aria-label={t("Choose a star rating")}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className={`reviews-rating-star ${rating <= Number(form.rating) ? "selected" : ""}`}
                  role="radio"
                  aria-checked={Number(form.rating) === rating}
                  aria-label={`${rating} ${t("stars")}`}
                  onClick={() => setForm({ ...form, rating: String(rating) })}
                >
                  ★
                </button>
              ))}
            </div>
            <span className="reviews-rating-label">{form.rating} {t("stars")}</span>
          </fieldset>
          <label>
            {t("Your review")}
            <textarea required minLength={10} maxLength={700} rows={4} value={form.review} onChange={(event) => setForm({ ...form, review: event.target.value })} placeholder={t("Please avoid sharing private medical details.")} />
          </label>
          <p className="reviews-privacy-note">{t("Your review will be published automatically. Please do not include private medical information.")}</p>
          <label className="reviews-consent">
            <input type="checkbox" required checked={form.publication_consent} onChange={(event) => setForm({ ...form, publication_consent: event.target.checked })} />
            <span>{t("I agree that the clinic may publish this review with my name.")}</span>
          </label>
          {formError && <p className="reviews-form-message reviews-form-error" role="alert">{formError}</p>}
          {message && <p className="reviews-form-message reviews-form-success" role="status">{message}</p>}
          <button type="submit" className="reviews-google-link" disabled={submitting}>
            {submitting ? t("Sending…") : t("Publish review")} <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>
    </section>
  );
}

export default ReviewsSection;
