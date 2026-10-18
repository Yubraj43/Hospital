import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import "./NoticesPage.css";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/notices/`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Notices unavailable");
        return response.json();
      })
      .then((data) => setNotices(Array.isArray(data) ? data : data.results || []))
      .catch((error) => {
        if (error.name !== "AbortError") setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="notices-page">
      <div className="notices-page-container">
        <header className="notices-heading">
          <p className="notices-eyebrow">{t("CLINIC UPDATES")}</p>
          <h1>{t("Notices")}</h1>
          <p>{t("Read the latest updates and announcements from Sirjana Polyclinic.")}</p>
        </header>
        {loading ? <p className="notices-state">{t("Loading notices…")}</p> : failed ? (
          <p className="notices-state notices-error" role="status">{t("Notices are temporarily unavailable. Please try again shortly.")}</p>
        ) : notices.length === 0 ? (
          <section className="notices-state notices-empty">
            <span className="notices-empty-icon" aria-hidden="true">i</span>
            <h2>{t("No current notices")}</h2>
            <p>{t("There are no active clinic notices at this time. Please check again later.")}</p>
          </section>
        ) : (
          <div className="notices-list">
            {notices.map((notice) => (
              <article className="notice-card" key={notice.id}>
                <span className="notice-card-icon" aria-hidden="true">▤</span>
                <div className="notice-card-copy">
                  <p className="notice-date">{t("Published")} · {formatDate(notice.published_on)}</p>
                  <h2>{notice.title}</h2>
                  {notice.summary && <p className="notice-summary">{notice.summary}</p>}
                </div>
                {notice.attachment && (
                  <a className="notice-pdf-button" href={notice.attachment} target="_blank" rel="noreferrer">
                    {t("View PDF")} <span aria-hidden="true">↗</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export default NoticesPage;
