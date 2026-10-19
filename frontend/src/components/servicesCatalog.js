import clinicAmbulance from "../assets/clinic-ambulance.jpg";
import clinicDoctor from "../assets/clinic-doctor.jpg";
import clinicReception from "../assets/clinic-reception.jpg";
import xrayImage from "../assets/services/xray.png";
import pharmacyImage from "../assets/services/pharmacy.png";
import ultrasoundBabyImage from "../assets/services/ultrasound-baby.jpeg";

const unsplashPhoto = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&fm=jpg&q=82&w=1400`;

export const clinicServices = [
  {
    slug: "emergency-care",
    name: "24/7 Emergency Care",
    type: "Emergency care",
    description: "Urgent support is available day and night.",
    details: "When urgent medical help is needed, contact our clinic for guidance and support. Our team can help you understand the next steps and arrange care. For a medical emergency, call the clinic directly.",
    image: clinicAmbulance,
    fallbackImage: clinicAmbulance,
    imageAlt: "Ambulance ready to support emergency care",
  },
  {
    slug: "outpatient-department",
    name: "Outpatient Department (OPD)",
    type: "Consultation",
    description: "Consultations and care for your health needs.",
    details: "Our outpatient department provides consultations for everyday health concerns. Speak with the clinic to ask about availability, the right doctor to see, and how to arrange a visit.",
    image: unsplashPhoto("photo-1631217868264-e5b90bb7e133"),
    fallbackImage: clinicDoctor,
    imageAlt: "Doctor welcoming a patient for a consultation",
  },
  {
    slug: "laboratory",
    name: "Laboratory",
    type: "Diagnostics",
    description: "Reliable testing to help guide your care.",
    details: "The clinic laboratory offers diagnostic testing to support your care. Contact us to ask which tests are available, whether preparation is needed, and when to visit.",
    image: unsplashPhoto("photo-1668600418417-aa0c6ed84e8c"),
    fallbackImage: clinicReception,
    imageAlt: "Welcoming clinic interior",
  },
  {
    slug: "pharmacy",
    name: "Pharmacy",
    type: "Medicines",
    description: "Access to the medicines your care requires.",
    details: "Our pharmacy helps patients access medicines related to their care. Contact the clinic to check medicine availability and ask any questions about collecting a prescription.",
    image: unsplashPhoto("photo-1580281657527-47f249e8f4df"),
    fallbackImage: pharmacyImage,
    imageAlt: "Pharmacy sign and medical supplies",
  },
  {
    slug: "x-ray",
    name: "X-Ray",
    type: "Diagnostics",
    description: "Clear imaging to support diagnosis.",
    details: "X-ray imaging can help clinicians assess certain injuries and health concerns. Contact the clinic to confirm availability, opening times, and any instructions before your visit.",
    image: xrayImage,
    fallbackImage: xrayImage,
    imageAlt: "Chest X-ray image",
  },
  {
    slug: "ultrasound-usg",
    name: "Ultrasound (USG)",
    type: "Diagnostics",
    description: "Ultrasound imaging with attentive care.",
    details: "Ultrasound uses sound waves to create images that can support a clinical assessment. Contact the clinic to ask about available scans, appointment times, and any preparation needed.",
    image: unsplashPhoto("photo-1654931800911-7a9cfb3b7c17"),
    fallbackImage: ultrasoundBabyImage,
    imageAlt: "Prenatal ultrasound image of a baby",
  },
];

export const getClinicService = (slug) => clinicServices.find((service) => service.slug === slug);
