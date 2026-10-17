import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);

const translations = {
  en: {},
  ne: {
    "Specialities": "विशेषताहरू", "Doctors": "डाक्टरहरू", "Medical Facilities": "चिकित्सा सुविधा",
    "Insurance": "बीमा", "Packages/Offers": "प्याकेज/अफर", "Careers": "रोजगारी",
    "MATERNITY CARE AT SIRJANA POLYCLINIC": "सिर्जना पोलिक्लिनिकमा मातृत्व सेवा",
    "A little pink. A lot of hope.": "अलिकति गुलाबी, धेरै आशा।",
    "Gentle, personalized care for you and your growing family.": "तपाईं र तपाईंको बढ्दो परिवारका लागि आत्मीय र व्यक्तिगत हेरचाह।",
    "Get Offer Now": "अफर लिनुहोस्", "SIRJANA POLYCLINIC · BHAIRAHAWA": "सिर्जना पोलिक्लिनिक · भैरहवा",
    "Care that puts you first.": "तपाईंलाई प्राथमिकता दिने हेरचाह।",
    "Thoughtful, trusted healthcare for every age and every stage of life.": "हरेक उमेर र जीवनको चरणका लागि विश्वासिलो स्वास्थ्य सेवा।",
    "Book an appointment": "अपोइन्टमेन्ट लिनुहोस्", "Book Appointment": "अपोइन्टमेन्ट बुक गर्नुहोस्",
    "Available all week": "हप्ताभरि उपलब्ध", "Find Your Doctor": "आफ्नो डाक्टर खोज्नुहोस्",
    "24/7 Ambulance Service": "२४/७ एम्बुलेन्स सेवा", "Book An Appointment": "अपोइन्टमेन्ट बुक गर्नुहोस्",
    "Find A Doctor": "डाक्टर खोज्नुहोस्", "Find an expert": "विशेषज्ञ खोज्नुहोस्",
    "Appointment": "अपोइन्टमेन्ट", "Book An Appointment": "अपोइन्टमेन्ट बुक गर्नुहोस्",
    "24/7 Ambulance Service": "२४/७ एम्बुलेन्स सेवा", "EXPERT CARE": "विशेषज्ञ सेवा",
    "HEAD OFFICE": "मुख्य कार्यालय", "OUR SECOND BRANCH": "हाम्रो दोस्रो शाखा",
    "Find Healthcare Experts": "स्वास्थ्य विशेषज्ञ खोज्नुहोस्",
    "Submit": "पेश गर्नुहोस्",
    "Main navigation": "मुख्य नेभिगेसन", "Thank you for reaching out.": "सम्पर्क गर्नुभएकोमा धन्यवाद।",
    "Return to home": "मुख्य पृष्ठमा फर्कनुहोस्",
    "Care you can trust, close to home": "घरनजिकै विश्वासिलो स्वास्थ्य सेवा",
    "Appointment": "अपोइन्टमेन्ट", "EXPERT CARE": "विशेषज्ञ सेवा", "HERE FOR YOUR FAMILY": "तपाईंको परिवारका लागि",
    "A healthier tomorrow starts today.": "स्वस्थ भोलिको सुरुवात आजै।",
    "Get the support, guidance, and care you need from a team that listens.": "तपाईंको कुरा सुन्ने टोलीबाट आवश्यक सहयोग र हेरचाह पाउनुहोस्।",
    "Meet our care team": "हाम्रो टोलीसँग भेट्नुहोस्", "COMPASSIONATE · PERSONAL · LOCAL": "आत्मीय · व्यक्तिगत · स्थानीय",
    "Your health, our priority.": "तपाईंको स्वास्थ्य, हाम्रो प्राथमिकता।",
    "From everyday checkups to expert advice, we're here to help you feel your best.": "नियमित जाँचदेखि विशेषज्ञ सल्लाहसम्म, हामी तपाईंको साथमा छौँ।",
    "Explore our services": "हाम्रा सेवाहरू हेर्नुहोस्", "Meet our caring medical team and find the right specialist for your needs.": "हाम्रो दयालु स्वास्थ्य टोलीसँग भेट्नुहोस् र आफ्नो आवश्यकताका लागि विशेषज्ञ खोज्नुहोस्।",
    "HEAD OFFICE": "मुख्य कार्यालय", "OUR SECOND BRANCH": "हाम्रो दोस्रो शाखा", "Sirjana Polyclinic": "सिर्जना पोलिक्लिनिक",
    "Visit our main clinic for consultations, checkups, and family healthcare.": "परामर्श, जाँच र पारिवारिक स्वास्थ्य सेवाका लागि हाम्रो मुख्य क्लिनिकमा आउनुहोस्।",
    "Find the same caring team and convenient outpatient services at our second location.": "हाम्रो दोस्रो स्थानमा पनि उही आत्मीय टोली र सहज बाह्यरोगी सेवा पाउनुहोस्।",
    "Get directions": "बाटो हेर्नुहोस्", "HERE WHEN YOU NEED US": "आवश्यक पर्दा हामी साथमा",
    "For urgent medical help, our ambulance team is ready around the clock. Call for emergency assistance and we’ll help you get the care you need.": "तत्काल स्वास्थ्य सहयोगका लागि हाम्रो एम्बुलेन्स टोली चौबीसै घण्टा तयार छ। आपतकालीन सहयोगका लागि फोन गर्नुहोस्।",
    "Call for emergency help": "आपतकालीन सहयोगका लागि फोन गर्नुहोस्", "A NEW CLINIC, HERE FOR YOU": "नयाँ क्लिनिक, तपाईंका लागि",
    "Good care starts with listening.": "राम्रो हेरचाह सुन्नबाट सुरु हुन्छ।",
    "Sirjana Polyclinic is getting ready to welcome the Bhairahawa community. We’re building a place where you and your family can feel heard, cared for, and supported at every visit.": "सिर्जना पोलिक्लिनिक भैरहवा समुदायलाई स्वागत गर्न तयार हुँदैछ। तपाईं र तपाईंको परिवारले प्रत्येक भेटमा आत्मीय हेरचाह र सहयोग पाउने ठाउँ हामी बनाउँदैछौँ।",
    "We’re just getting started, and we look forward to sharing more about our team, services, and opening soon. Until then, get in touch and we’ll be happy to help with your questions.": "हाम्रो यात्रा भर्खर सुरु हुँदैछ। हाम्रो टोली, सेवा र उद्घाटनबारे थप जानकारी चाँडै साझा गर्नेछौँ। त्यतिन्जेल, आफ्ना प्रश्नका लागि हामीलाई सम्पर्क गर्नुहोस्।",
    "Talk to our team": "हाम्रो टोलीसँग कुरा गर्नुहोस्", "Thoughtful, trusted healthcare for you and your family.": "तपाईं र तपाईंको परिवारका लागि विश्वासिलो स्वास्थ्य सेवा।",
    "Explore": "अन्वेषण", "Patient Care": "बिरामी सेवा", "Contact the Clinic": "क्लिनिकमा सम्पर्क गर्नुहोस्",
    "Appointments": "अपोइन्टमेन्टहरू", "Departments": "विभागहरू", "Quick Contacts": "द्रुत सम्पर्क",
    "Bhairahawa, Nepal": "भैरहवा, नेपाल", "Call our clinic": "क्लिनिकमा फोन गर्नुहोस्", "English": "अंग्रेजी",
    "Branch": "शाखा", "Head Office · Bhairahawa": "मुख्य कार्यालय · भैरहवा", "Second Branch · Bhairahawa": "दोस्रो शाखा · भैरहवा",
    "First Name": "पहिलो नाम", "Age": "उमेर", "Gender": "लिङ्ग", "Female": "महिला", "Male": "पुरुष",
    "Other": "अन्य", "Prefer not to say": "भन्न चाहन्न", "Phone Number": "फोन नम्बर", "Email (optional)": "इमेल (वैकल्पिक)",
    "Preferred time": "रोजेको समय", "Morning": "बिहान", "Afternoon": "दिउँसो", "Evening": "साँझ", "Comments (optional)": "टिप्पणी (वैकल्पिक)",
    "Our team will contact you to confirm your appointment request.": "तपाईंको अनुरोध पुष्टि गर्न हाम्रो टोलीले सम्पर्क गर्नेछ।",
    "Need Assistance?": "सहयोग चाहियो?", "Please feel free to contact us and we’ll help you with your appointment request.": "हामीलाई सम्पर्क गर्नुहोस्, अपोइन्टमेन्ट अनुरोधमा सहयोग गर्नेछौँ।",
    "Head Office · Call the clinic": "मुख्य कार्यालय · क्लिनिकमा फोन गर्नुहोस्", "Second Branch · Call the clinic": "दोस्रो शाखा · क्लिनिकमा फोन गर्नुहोस्",
    "Thank you for reaching out.": "सम्पर्क गर्नुभएकोमा धन्यवाद।", "Your appointment request has been noted. Our team will contact you to discuss availability and confirm a time.": "तपाईंको अपोइन्टमेन्ट अनुरोध प्राप्त भयो। समय पुष्टि गर्न हाम्रो टोलीले सम्पर्क गर्नेछ।", "Return to home": "मुख्य पृष्ठमा फर्कनुहोस्",
    "Facebook": "फेसबुक", "Instagram": "इन्स्टाग्राम", "TikTok": "टिकटक", "Chat with Sirjana Polyclinic on WhatsApp": "व्हाट्सएपमा सिर्जना पोलिक्लिनिकसँग कुरा गर्नुहोस्",
  },
  bho: {
    "Specialities": "विशेष सेवा", "Doctors": "डाक्टर लोग", "Medical Facilities": "चिकित्सा सुविधा",
    "Insurance": "बीमा", "Packages/Offers": "पैकेज/ऑफर", "Careers": "नौकरी",
    "MATERNITY CARE AT SIRJANA POLYCLINIC": "सिर्जना पोलिक्लिनिक में मातृत्व सेवा",
    "A little pink. A lot of hope.": "थोड़ा गुलाबी, बहुत सारा उम्मीद।",
    "Gentle, personalized care for you and your growing family.": "रउरा आ रउरा परिवार खातिर अपनापन वाला देखभाल।",
    "Get Offer Now": "ऑफर लीं", "SIRJANA POLYCLINIC · BHAIRAHAWA": "सिर्जना पोलिक्लिनिक · भैरहवा",
    "Care that puts you first.": "रउरा के पहिले रखे वाला देखभाल।",
    "Thoughtful, trusted healthcare for every age and every stage of life.": "हर उमिर आ जीवन के हर पड़ाव पर भरोसेमंद स्वास्थ्य सेवा।",
    "Book an appointment": "अपॉइंटमेंट लीं", "Book Appointment": "अपॉइंटमेंट बुक करीं",
    "Available all week": "पूरा हफ्ता उपलब्ध", "Find Your Doctor": "अपना डॉक्टर खोजीं",
    "24/7 Ambulance Service": "24/7 एम्बुलेंस सेवा", "Book An Appointment": "अपॉइंटमेंट बुक करीं",
    "Find A Doctor": "डॉक्टर खोजीं", "Find an expert": "विशेषज्ञ खोजीं",
    "Appointment": "अपॉइंटमेंट", "EXPERT CARE": "विशेषज्ञ देखभाल",
    "HEAD OFFICE": "मुख्य कार्यालय", "OUR SECOND BRANCH": "हमार दूसरी शाखा",
    "Find Healthcare Experts": "स्वास्थ्य विशेषज्ञ खोजीं",
    "Submit": "जमा करीं",
    "Main navigation": "मुख्य मेनू", "Thank you for reaching out.": "संपर्क करे खातिर धन्यवाद।",
    "Return to home": "मुख्य पन्ना पर लौटीं",
    "Care you can trust, close to home": "घर के लगे भरोसेमंद स्वास्थ्य सेवा",
    "A healthier tomorrow starts today.": "स्वस्थ भविष्य आज से शुरू होला।",
    "Get the support, guidance, and care you need from a team that listens.": "रउरा के सुने वाला टीम से जरूरी सलाह आ देखभाल पाईं।",
    "Meet our care team": "हमार टीम से मिलीं", "Your health, our priority.": "रउरा स्वास्थ्य, हमार प्राथमिकता।",
    "From everyday checkups to expert advice, we're here to help you feel your best.": "रोज के जांच से विशेषज्ञ सलाह तक, हम रउरा साथ बानी।",
    "Explore our services": "हमार सेवा देखीं", "Meet our caring medical team and find the right specialist for your needs.": "हमार देखभाल करे वाला टीम से मिलीं आ सही विशेषज्ञ खोजीं।",
    "HEAD OFFICE": "मुख्य कार्यालय", "OUR SECOND BRANCH": "हमार दूसरी शाखा", "Sirjana Polyclinic": "सिर्जना पोलिक्लिनिक",
    "Visit our main clinic for consultations, checkups, and family healthcare.": "सलाह, जांच आ परिवार के स्वास्थ्य सेवा खातिर मुख्य क्लिनिक आईं।",
    "Find the same caring team and convenient outpatient services at our second location.": "दूसर शाखा में भी उहे अपनापन वाला टीम आ बाहरी मरीज के सेवा मिली।",
    "Get directions": "रस्ता देखीं", "HERE WHEN YOU NEED US": "जरूरत पर हम रउरा साथ",
    "For urgent medical help, our ambulance team is ready around the clock. Call for emergency assistance and we’ll help you get the care you need.": "तुरंत चिकित्सा मदद खातिर हमार एम्बुलेंस टीम चौबीसों घंटा तैयार बा। आपात मदद खातिर फोन करीं।",
    "Call for emergency help": "आपात मदद खातिर फोन करीं", "A NEW CLINIC, HERE FOR YOU": "नया क्लिनिक, रउरा खातिर",
    "Good care starts with listening.": "नीक देखभाल सुने से शुरू होला।",
    "Sirjana Polyclinic is getting ready to welcome the Bhairahawa community. We’re building a place where you and your family can feel heard, cared for, and supported at every visit.": "सिर्जना पोलिक्लिनिक भैरहवा के लोगन के स्वागत खातिर तैयार हो रहल बा। हम अइसन जगह बना रहल बानी जहाँ रउरा परिवार के अपनापन आ सहारा मिली।",
    "We’re just getting started, and we look forward to sharing more about our team, services, and opening soon. Until then, get in touch and we’ll be happy to help with your questions.": "हमनी के शुरुआत अभी भइल बा। टीम, सेवा आ खुले के जानकारी जल्द साझा करब। तब तक सवाल खातिर हमसे संपर्क करीं।",
    "Talk to our team": "हमार टीम से बात करीं", "Thoughtful, trusted healthcare for you and your family.": "रउरा परिवार खातिर भरोसेमंद स्वास्थ्य सेवा।",
    "Explore": "देखीं", "Patient Care": "मरीज सेवा", "Contact the Clinic": "क्लिनिक से संपर्क करीं", "Appointments": "अपॉइंटमेंट",
    "Departments": "विभाग", "Quick Contacts": "जल्दी संपर्क", "Bhairahawa, Nepal": "भैरहवा, नेपाल", "Call our clinic": "क्लिनिक में फोन करीं",
    "Branch": "शाखा", "Head Office · Bhairahawa": "मुख्य कार्यालय · भैरहवा", "Second Branch · Bhairahawa": "दूसरी शाखा · भैरहवा",
    "First Name": "पहिल नाम", "Age": "उमर", "Gender": "लिंग", "Female": "महिला", "Male": "पुरुष", "Other": "अन्य",
    "Prefer not to say": "ना बतावल चाहब", "Phone Number": "फोन नंबर", "Email (optional)": "ईमेल (वैकल्पिक)",
    "Preferred time": "पसंदीदा समय", "Morning": "भोर", "Afternoon": "दुपहर", "Evening": "साँझ", "Comments (optional)": "टिप्पणी (वैकल्पिक)",
    "Our team will contact you to confirm your appointment request.": "अपॉइंटमेंट पक्का करे खातिर हमार टीम फोन करी।",
    "Need Assistance?": "मदद चाहीं?", "Please feel free to contact us and we’ll help you with your appointment request.": "हमसे संपर्क करीं, अपॉइंटमेंट में मदद करब।",
    "Head Office · Call the clinic": "मुख्य कार्यालय · क्लिनिक में फोन करीं", "Second Branch · Call the clinic": "दूसरी शाखा · क्लिनिक में फोन करीं",
    "Thank you for reaching out.": "संपर्क करे खातिर धन्यवाद।", "Your appointment request has been noted. Our team will contact you to discuss availability and confirm a time.": "रउरा अपॉइंटमेंट अनुरोध मिल गइल। समय पक्का करे खातिर हमार टीम संपर्क करी।", "Return to home": "मुख्य पन्ना पर लौटीं",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem("sirjana-language") || "en");
  const value = useMemo(() => ({
    language,
    setLanguage: (next) => {
      localStorage.setItem("sirjana-language", next);
      setLanguage(next);
    },
    t: (text) => translations[language]?.[text] || text,
  }), [language]);

  useEffect(() => {
    document.documentElement.lang = language === "ne" ? "ne" : language === "bho" ? "bho" : "en";
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
