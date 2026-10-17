import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import pregnancyBanner from "./assets/pregnancy-care-banner.png";
import clinicReception from "./assets/clinic-reception.jpg";
import clinicDoctor from "./assets/clinic-doctor.jpg";
import clinicAmbulance from "./assets/clinic-ambulance.jpg";
import AppointmentPage from "./components/AppointmentPage";
import "./App.css";

const slides = [
  {
    eyebrow: "MATERNITY CARE AT SIRJANA POLYCLINIC",
    title: "A little pink. A lot of hope.",
    description: "Gentle, personalized care for you and your growing family.",
    action: "Get Offer Now",
    href: "/appointment",
    image: pregnancyBanner,
    imageAlt: "Pregnant mother in a flower garden",
    theme: "hero-slide-pregnancy",
  },
  {
    eyebrow: "SIRJANA POLYCLINIC · BHAIRAHAWA",
    title: "Care that puts you first.",
    description: "Thoughtful, trusted healthcare for every age and every stage of life.",
    action: "Book an appointment",
    href: "/appointment",
    image: clinicReception,
    imageAlt: "Bright, welcoming clinic reception",
    theme: "hero-slide-care",
  },
  {
    eyebrow: "HERE FOR YOUR FAMILY",
    title: "A healthier tomorrow starts today.",
    description: "Get the support, guidance, and care you need from a team that listens.",
    action: "Meet our care team",
    href: "https://drsulaimanalhabib.ae/doctors/",
    image: clinicDoctor,
    imageAlt: "Doctor welcoming a patient for a consultation",
    theme: "hero-slide-family",
  },
  {
    eyebrow: "COMPASSIONATE · PERSONAL · LOCAL",
    title: "Your health, our priority.",
    description: "From everyday checkups to expert advice, we're here to help you feel your best.",
    action: "Explore our services",
    href: "https://drsulaimanalhabib.ae/departments/",
    image: clinicAmbulance,
    imageAlt: "Ambulance ready outside a clinic",
    theme: "hero-slide-wellness",
  },
];

function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const isAppointmentPage = window.location.pathname === "/appointment";

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  const showSlide = (index) => {
    setActiveSlide((index + slides.length) % slides.length);
  };

  const slide = slides[activeSlide];

  if (isAppointmentPage) {
    return (
      <>
        <Header />
        <AppointmentPage />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main>
        <section className={`hero-banner ${slide.theme}`} id="home" aria-label="Sirjana Polyclinic highlights">
          {slide.image && <img className="hero-photo" src={slide.image} alt={slide.imageAlt} />}
          <div className="hero-shade" />
          <div className="hero-copy" key={activeSlide}>
            <span className="welcome-label">{slide.eyebrow}</span>
            <h1>{slide.title}</h1>
            <p>{slide.description}</p>
            <a href={slide.href || "/appointment"} className="page-appointment-button">
              {slide.action} <span aria-hidden="true">→</span>
            </a>
            <a href="/appointment" className="hero-mobile-appointment">Book Appointment <span aria-hidden="true">→</span></a>
            <span className="hero-mobile-availability">Available all week</span>
          </div>

          <button className="hero-arrow hero-arrow-previous" type="button" aria-label="Previous banner" onClick={() => showSlide(activeSlide - 1)}>‹</button>
          <button className="hero-arrow hero-arrow-next" type="button" aria-label="Next banner" onClick={() => showSlide(activeSlide + 1)}>›</button>
          <div className="hero-dots" aria-label="Choose banner">
            {slides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={`hero-dot ${index === activeSlide ? "hero-dot-active" : ""}`}
                aria-label={`Show banner ${index + 1}`}
                aria-current={index === activeSlide ? "true" : undefined}
                onClick={() => showSlide(index)}
              />
            ))}
          </div>
        </section>

        <section className="location-emergency-section" aria-label="Clinic locations and emergency support">
          <div className="location-cards">
            <article className="location-card doctor-finder-card">
              <span className="location-icon doctor-icon" aria-hidden="true">✚</span>
              <p className="location-kicker">EXPERT CARE</p>
              <h2>Find Your Doctor</h2>
              <p className="location-description">Meet our caring medical team and find the right specialist for your needs.</p>
              <a href="https://drsulaimanalhabib.ae/doctors/">Find Healthcare Experts <span aria-hidden="true">→</span></a>
            </article>

            <article className="location-card">
              <span className="location-icon" aria-hidden="true">⌖</span>
              <p className="location-kicker">HEAD OFFICE</p>
              <h2>Sirjana Polyclinic</h2>
              <p className="location-description">Visit our main clinic for consultations, checkups, and family healthcare.</p>
              <a href="#contact">Get directions <span aria-hidden="true">→</span></a>
            </article>

            <article className="location-card">
              <span className="location-icon" aria-hidden="true">⌖</span>
              <p className="location-kicker">OUR SECOND BRANCH</p>
              <h2>Sirjana Polyclinic</h2>
              <p className="location-description">Find the same caring team and convenient outpatient services at our second location.</p>
              <a href="#contact">Get directions <span aria-hidden="true">→</span></a>
            </article>
          </div>

          <article className="emergency-card">
            <span className="ambulance-icon" aria-hidden="true">✚</span>
            <p className="emergency-kicker">HERE WHEN YOU NEED US</p>
            <h2>24/7 Ambulance Service</h2>
            <p>For urgent medical help, our ambulance team is ready around the clock. Call for emergency assistance and we’ll help you get the care you need.</p>
            <a href="tel:100" className="emergency-call">Call for emergency help <span aria-hidden="true">→</span></a>
          </article>
        </section>

        <section className="clinic-intro-section" id="about">
          <div className="clinic-intro-heading">
            <p className="clinic-intro-kicker">A NEW CLINIC, HERE FOR YOU</p>
            <h2>Good care starts with listening.</h2>
          </div>
          <div className="clinic-intro-copy">
            <p>
              Sirjana Polyclinic is getting ready to welcome the Bhairahawa community. We’re building a place where you and your family can feel heard, cared for, and supported at every visit.
            </p>
            <p>
              We’re just getting started, and we look forward to sharing more about our team, services, and opening soon. Until then, get in touch and we’ll be happy to help with your questions.
            </p>
            <a href="#contact">Talk to our team <span aria-hidden="true">→</span></a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default App;
