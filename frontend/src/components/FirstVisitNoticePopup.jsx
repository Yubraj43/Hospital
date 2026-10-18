import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import "./FirstVisitNoticePopup.css";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://sirjana-hospital-backend.onrender.com/api").replace(/\/$/, "");
const DISMISSED_NOTICES_KEY = "sirjana-dismissed-notices";

function FirstVisitNoticePopup() {
  const [notice, setNotice] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/notices/first-visit/`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Notices unavailable");
        return response.json();
      })
      .then((data) => {
        const notices = Array.isArray(data) ? data : data.results || [];
        const dismissed = JSON.parse(localStorage.getItem(DISMISSED_NOTICES_KEY) || "[]");
        const nextNotice = notices.find((item) => !dismissed.includes(item.id));
        if (nextNotice) setNotice(nextNotice);
      })
      .catch((error) => {
        if (error.name !== "AbortError") return;
      });
    return () => controller.abort();
  }, []);

  const closePopup = useCallback(() => {
    if (notice) {
      try {
        const dismissed = JSON.parse(localStorage.getItem(DISMISSED_NOTICES_KEY) || "[]");
        if (!dismissed.includes(notice.id)) {
          localStorage.setItem(DISMISSED_NOTICES_KEY, JSON.stringify([...dismissed, notice.id]));
        }
      } catch {
        localStorage.setItem(DISMISSED_NOTICES_KEY, JSON.stringify([notice.id]));
      }
      setNotice(null);
    }
  }, [notice]);

  useEffect(() => {
    if (!notice) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closePopup();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("notice-popup-open");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("notice-popup-open");
    };
  }, [notice, closePopup]);

  if (!notice) return null;

  return (
    <div className="notice-popup-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePopup(); }}>
      <section className="notice-popup" role="dialog" aria-modal="true" aria-labelledby="notice-popup-title">
        <button className="notice-popup-close" type="button" onClick={closePopup} aria-label={t("Close notice")}>×</button>
        <span className="notice-popup-icon" aria-hidden="true">!</span>
        <p className="notice-popup-eyebrow">{t("CLINIC NOTICE")}</p>
        <h2 id="notice-popup-title">{notice.title}</h2>
        {notice.summary && <p className="notice-popup-summary">{notice.summary}</p>}
        <p className="notice-popup-date">{t("Published")} · {formatDate(notice.published_on)}</p>
        <div className="notice-popup-actions">
          {notice.attachment && <a href={notice.attachment} target="_blank" rel="noreferrer" className="notice-popup-pdf">{t("View PDF")} <span aria-hidden="true">↗</span></a>}
          <button type="button" className="notice-popup-dismiss" onClick={closePopup}>{t("Close")}</button>
        </div>
      </section>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export default FirstVisitNoticePopup;
