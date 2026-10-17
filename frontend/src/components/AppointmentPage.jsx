import { useState } from "react";
import "../App.css";

function AppointmentPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="appointment-page">
      <h1 className="appointment-title">Book An Appointment</h1>
      <div className="appointment-layout">
        <section className="appointment-form-card" aria-label="Appointment request form">
          {submitted ? (
            <div className="appointment-success" role="status">
              <span aria-hidden="true">✓</span>
              <h2>Thank you for reaching out.</h2>
              <p>Your appointment request has been noted. Our team will contact you to discuss availability and confirm a time.</p>
              <a href="/">Return to home</a>
            </div>
          ) : (
            <form className="appointment-form" onSubmit={handleSubmit}>
              <label className="appointment-field branch-field">
                <span className="visually-hidden">Branch</span>
                <select name="branch" defaultValue="" required>
                  <option value="" disabled>Branch</option>
                  <option>Head Office · Bhairahawa</option>
                  <option>Second Branch · Bhairahawa</option>
                </select>
              </label>

              <div className="appointment-form-row patient-row">
                <label className="appointment-field">
                  <span className="visually-hidden">First name</span>
                  <input name="name" type="text" autoComplete="given-name" placeholder="First Name" required />
                </label>
                <label className="appointment-field">
                  <span className="visually-hidden">Age</span>
                  <input name="age" type="number" min="0" max="120" placeholder="Age" required />
                </label>
                <label className="appointment-field">
                  <span className="visually-hidden">Gender</span>
                  <select name="gender" defaultValue="" required>
                    <option value="" disabled>Gender</option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </label>
              </div>

              <div className="appointment-form-row">
                <label className="appointment-field">
                  <span className="visually-hidden">Phone number</span>
                  <input name="phone" type="tel" autoComplete="tel" placeholder="Phone Number" required />
                </label>
                <label className="appointment-field">
                  <span className="visually-hidden">Email</span>
                  <input name="email" type="email" autoComplete="email" placeholder="Email (optional)" />
                </label>
              </div>

              <div className="appointment-form-row">
                <label className="appointment-field">
                  <span className="visually-hidden">Preferred date</span>
                  <input name="date" type="date" min={new Date().toISOString().split("T")[0]} required />
                </label>
                <label className="appointment-field">
                  <span className="visually-hidden">Preferred time</span>
                  <select name="time" defaultValue="" required>
                    <option value="" disabled>Preferred time</option>
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                  </select>
                </label>
              </div>

              <label className="appointment-field">
                <span className="visually-hidden">Comments</span>
                <textarea name="message" rows="3" placeholder="Comments (optional)" />
              </label>

              <button type="submit" className="appointment-submit">Submit</button>
              <p className="appointment-form-note">Our team will contact you to confirm your appointment request.</p>
            </form>
          )}
        </section>

        <aside className="appointment-assistance">
          <div className="appointment-assistance-shade" />
          <div className="appointment-assistance-content">
            <h2>Need Assistance?</h2>
            <p>Please feel free to contact us and we’ll help you with your appointment request.</p>
            <a href="tel:+9771000000000" className="assistance-phone-icon" aria-label="Call the clinic">☎</a>
            <div className="assistance-phone-list">
              <a href="tel:+9771000000000">Head Office · Call the clinic</a>
              <a href="tel:+9771000000000">Second Branch · Call the clinic</a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default AppointmentPage;
