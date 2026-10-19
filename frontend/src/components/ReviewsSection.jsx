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
  const [form, setForm] = useState({ name: "", rating: "5", review: "", publication_consent: false });

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
      setMessage(t("Thank you. Your review was sent to the clinic for approval before it appears here."));
      setForm({ name: "", rating: "5", review: "", publication_consent: false });
    } catch (error) {
      setFormError(error.message || t("We could not send your review. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="reviews-section" id="reviews" aria-labelledby="reviews-heading">
      <div className="reviews-content">
        <div className="reviews-copy">
          <p className="reviews-kicker">{t("YOUR VOICE MATTERS")}</p>
          <h2 id="reviews-heading">{t("Patient reviews")}</h2>
          <p>{t("Read feedback from patients and share your experience with Sirjana Advanced Polyclinic.")}</p>
          <a href={clinicMapsUrl} target="_blank" rel="noreferrer" className="reviews-link">
            {t("View our location on Google Maps")} <span aria-hidden="true">↗</span>
          </a>
        </div>

        <form className="reviews-form" onSubmit={submitReview}>
          <h3>{t("Share your experience")}</h3>
          <label>
            {t("Your name")}
            <input required minLength={2} maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" />
          </label>
          <label>
            {t("Rating")}
            <select value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })}>
              {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} {t("stars")}</option>)}
            </select>
          </label>
          <label>
            {t("Your review")}
            <textarea required minLength={10} maxLength={700} rows={4} value={form.review} onChange={(event) => setForm({ ...form, review: event.target.value })} placeholder={t("Please avoid sharing private medical details.")} />
          </label>
          <p className="reviews-privacy-note">{t("Reviews are checked by the clinic before publication. Please do not include private medical information.")}</p>
          <label className="reviews-consent">
            <input type="checkbox" required checked={form.publication_consent} onChange={(event) => setForm({ ...form, publication_consent: event.target.checked })} />
            <span>{t("I agree that the clinic may publish this review with my name after approval.")}</span>
          </label>
          {formError && <p className="reviews-form-message reviews-form-error" role="alert">{formError}</p>}
          {message && <p className="reviews-form-message reviews-form-success" role="status">{message}</p>}
          <button type="submit" className="reviews-google-link" disabled={submitting}>
            {submitting ? t("Sending…") : t("Submit review")} <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>

      <div className="reviews-list-wrap" aria-live="polite">
        <h3>{t("What patients are saying")}</h3>
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
                <footer>{review.name}</footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ReviewsSection;
