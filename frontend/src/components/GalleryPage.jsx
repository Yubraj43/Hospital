import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "./LanguageContext";
import "./GalleryPage.css";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");
const categories = [
  ["all", "All Photos"],
  ["building", "Hospital Building"],
  ["equipment", "Equipment"],
  ["department", "Departments"],
  ["event", "Events"],
];

function GalleryPage() {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("all");
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/gallery/`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Gallery unavailable");
        return response.json();
      })
      .then((data) => setImages(Array.isArray(data) ? data : data.results || []))
      .catch((error) => {
        if (error.name !== "AbortError") setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const visibleImages = useMemo(
    () => category === "all" ? images : images.filter((image) => image.category === category),
    [category, images],
  );

  const closeLightbox = useCallback(() => setActiveImage(null), []);

  useEffect(() => {
    if (!activeImage) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("gallery-lightbox-open");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("gallery-lightbox-open");
    };
  }, [activeImage, closeLightbox]);

  return (
    <main className="gallery-page">
      <div className="gallery-page-container">
        <header className="gallery-heading">
          <p className="gallery-eyebrow">{t("A LOOK INSIDE SIRJANA")}</p>
          <h1>{t("Clinic Gallery")}</h1>
          <p>{t("Explore our clinic, services, and moments from our community.")}</p>
        </header>

        {!loading && !failed && images.length > 0 && (
          <nav className="gallery-filters" aria-label={t("Filter gallery by category")}>
            {categories.map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={category === value ? "gallery-filter gallery-filter-active" : "gallery-filter"}
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
              >
                {t(label)}
              </button>
            ))}
          </nav>
        )}

        {loading ? <p className="gallery-state">{t("Loading gallery…")}</p> : failed ? (
          <p className="gallery-state gallery-error" role="status">{t("Gallery photos are temporarily unavailable. Please try again shortly.")}</p>
        ) : images.length === 0 ? (
          <section className="gallery-state gallery-empty">
            <span className="gallery-empty-icon" aria-hidden="true">▧</span>
            <h2>{t("Photos are coming soon")}</h2>
            <p>{t("Our latest clinic photos will appear here after they are published.")}</p>
          </section>
        ) : visibleImages.length === 0 ? (
          <p className="gallery-state">{t("There are no photos in this category yet.")}</p>
        ) : (
          <div className="gallery-grid">
            {visibleImages.map((image) => (
              <button className="gallery-image-card" key={image.id} type="button" onClick={() => setActiveImage(image)} aria-label={`${t("View photo")}: ${image.title}`}>
                <span className="gallery-image-wrap">
                  <img src={image.image} alt={image.description || image.title} loading="lazy" />
                  <span className="gallery-image-expand" aria-hidden="true">↗</span>
                </span>
                <span className="gallery-image-caption">
                  <span className="gallery-category-label">{t(categories.find(([value]) => value === image.category)?.[1] || "Gallery")}</span>
                  <strong>{image.title}</strong>
                  {image.description && <span>{image.description}</span>}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {activeImage && (
        <div className="gallery-lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeLightbox(); }}>
          <section className="gallery-lightbox-dialog" role="dialog" aria-modal="true" aria-label={activeImage.title}>
            <button type="button" className="gallery-lightbox-close" onClick={closeLightbox} aria-label={t("Close photo")}>×</button>
            <img src={activeImage.image} alt={activeImage.description || activeImage.title} />
            <div className="gallery-lightbox-caption">
              <span className="gallery-category-label">{t(categories.find(([value]) => value === activeImage.category)?.[1] || "Gallery")}</span>
              <h2>{activeImage.title}</h2>
              {activeImage.description && <p>{activeImage.description}</p>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default GalleryPage;
