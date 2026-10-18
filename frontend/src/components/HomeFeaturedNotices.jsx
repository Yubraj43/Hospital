import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { API_BASE_URL } from "../api";
import "./HomeFeaturedNotices.css";



function HomeFeaturedNotices() {
  const [notices, setNotices] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/notices/featured/`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : [])
      .then((data) => setNotices(Array.isArray(data) ? data : data.results || []))
      .catch((error) => {
        if (error.name !== "AbortError") setNotices([]);
      });
    return () => controller.abort();
  }, []);

  if (!notices.length) return null;

  return (
    <section className="home-featured-notices" aria-labelledby="home-notices-title">
      <div className="home-featured-notices-inner">
        <div className="home-featured-notices-heading">
          <p className="home-notices-eyebrow">{t("LATEST UPDATES")}</p>
          <h2 id="home-notices-title">{t("Notices")}</h2>
        </div>
        <div className="home-featured-notices-list">
          {notices.slice(0, 3).map((notice) => (
            <article className="home-featured-notice" key={notice.id}>
              <p>{formatDate(notice.published_on)}</p>
              <h3>{notice.title}</h3>
              {notice.summary && <span>{notice.summary}</span>}
              {notice.attachment && <a href={notice.attachment} target="_blank" rel="noreferrer">{t("View PDF")} <span aria-hidden="true">↗</span></a>}
            </article>
          ))}
        </div>
        <a className="home-all-notices-link" href="/notices">{t("View all notices")} <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export default HomeFeaturedNotices;
