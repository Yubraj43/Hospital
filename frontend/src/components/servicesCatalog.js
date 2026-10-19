import clinicDoctor from "../assets/clinic-doctor.jpg";
import clinicReception from "../assets/clinic-reception.jpg";
import emergencyCareImage from "../assets/services/nepal-emergency-care.png";
import laboratoryImage from "../assets/services/nepal-laboratory.png";
import pharmacyImage from "../assets/services/nepal-pharmacy.png";
import ultrasoundImage from "../assets/services/nepal-ultrasound.png";
import xrayImage from "../assets/services/xray.png";

export const clinicServices = [
  {
    slug: "emergency-care",
    name: "24/7 Emergency Care",
    type: "Emergency care",
    description: "Urgent support is available day and night.",
    details: "When urgent medical help is needed, contact our clinic for guidance and support. Our team can help you understand the next steps and arrange care. For a medical emergency, call the clinic directly.",
    image: emergencyCareImage,
    fallbackImage: emergencyCareImage,
    imageAlt: "Ambulance at a neighborhood polyclinic in Nepal",
  },
  {
    slug: "outpatient-department",
    name: "Outpatient Department (OPD)",
    type: "Consultation",
    description: "Consultations and care for your health needs.",
    details: "Our outpatient department provides consultations for everyday health concerns. Speak with the clinic to ask about availability, the right doctor to see, and how to arrange a visit.",
    image: clinicDoctor,
    fallbackImage: clinicDoctor,
    imageAlt: "Doctor welcoming a patient for a consultation",
  },
  {
    slug: "laboratory",
    name: "Laboratory",
    type: "Diagnostics",
    description: "Reliable testing to help guide your care.",
    details: "The clinic laboratory offers diagnostic testing to support your care. Contact us to ask which tests are available, whether preparation is needed, and when to visit.",
    image: laboratoryImage,
    fallbackImage: clinicReception,
    imageAlt: "Nepali laboratory technician handling a test sample",
  },
  {
    slug: "pharmacy",
    name: "Pharmacy",
    type: "Medicines",
    description: "Access to the medicines your care requires.",
    details: "Our pharmacy helps patients access medicines related to their care. Contact the clinic to check medicine availability and ask any questions about collecting a prescription.",
    image: pharmacyImage,
    fallbackImage: pharmacyImage,
    imageAlt: "Nepali pharmacist helping a patient at a clinic pharmacy",
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
    image: ultrasoundImage,
    fallbackImage: ultrasoundImage,
    imageAlt: "Nepali sonographer performing an ultrasound in a clinic",
  },
];

export const getClinicService = (slug) => clinicServices.find((service) => service.slug === slug);
