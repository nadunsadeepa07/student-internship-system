import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Sparkles}from "lucide-react";
import Login from "../pages/Login";
import "../styles/Home.css";
import { getStoredUser } from "../utils/storage";

function Home() {
  const [lang, setLang] = useState("en");
  const [typed, setTyped] = useState("");
  const [search, setSearch] = useState("");
  const [faqOpen, setFaqOpen] = useState(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // TESTIMONIAL COMMENTS
  const [comments, setComments] = useState([]);

  const text = {
    en: {
      logo: "SIMS Portal",
      nav1: "Features",
      nav2: "Testimonials",
      nav3: "Search",
      nav4: "FAQ",
      nav5: "Login",

      tag: "STUDENT INTERNSHIP MANAGEMENT SYSTEM",
      heroTitle: "Build Your Future With",
      heroDesc:
        "Modern platform connecting students, universities, and companies in one ecosystem.",
      searchPlaceholder: "Search internships, companies, skills...",
      searchBtn: "Search",
      getStarted: "Get Started",
      explore: "Explore",

      stat1: "Students",
      stat2: "Companies",
      stat3: "Internships",
      stat4: "Success Rate",

      featureTitle: "Powerful Features",
      featureDesc: "Everything needed for internship success.",

      card1: "Platform Features",
      card1p:
        "Powerful tools designed for students, companies, and universities.",

      card2: "Student Dashboard",
      card2p:
        "Create a detailed profile with skills, education, and interests.",

      card3: "Company Dashboard",
      card3p:
        "Manage applications, interviews, and feedback easily.",

      card4: "Smart Dashboard",
      card4p:
        "Manage jobs, students, reports, and applications easily.",

      card5: "Internship Search",
      card5p:
        "Search, filter, and apply to internships easily.",

      card6: "Notifications",
      card6p:
        "Get real-time updates about opportunities and status.",

      card7: "Top Companies",
      card7p:
        "Connect with leading companies and verified recruiters.",

      card8: "Fast Hiring",
      card8p:
        "Reduce hiring time using modern digital workflows.",

      ctaTitle: "Ready to Start?",
      ctaDesc:
        "Join thousands of students already growing with SIMS.",
      createAccount: "Create Account",

      faqTitle: "Frequently Asked Questions",

      testimonialTitle: "User Testimonials",

      q1: "How do i apply?",
      a1: "Create account, complete profile and apply.",

      q2: "Is it free?",
      a2: "Yes, completely free for students.",

      q3: "Can companies hire directly?",
      a3: "Yes, companies can shortlist users.",

      q4: "Is this mobile friendly?",
      a4:
        "Yes. The system works smoothly on mobile, tablet, and desktop.",

      footer: "© 2026 SIMS Platform. All Rights Reserved.",
    },

    si: {
      logo: "SIMS පද්ධතිය",
      nav1: "විශේෂාංග",
      nav2: "ප්‍රතිචාර",
      nav3: "සෙවීම",
      nav4: "FAQ",
      nav5: "පිවිසුම",

      tag: "ශිෂ්‍ය අභ්‍යාස කළමනාකරණ පද්ධතිය",
      heroTitle: "ඔබේ අනාගතය ගොඩනගන්න",
      heroDesc:
        "ශිෂ්‍යයන්, විශ්වවිද්‍යාල සහ සමාගම් එකට සම්බන්ධ කරන නවීන පද්ධතියකි.",
      searchPlaceholder: "අභ්‍යාස, සමාගම්, කුසලතා සොයන්න...",
      searchBtn: "සොයන්න",
      getStarted: "ආරම්භ කරන්න",
      explore: "බලන්න",

      stat1: "ශිෂ්‍යයන්",
      stat2: "සමාගම්",
      stat3: "අභ්‍යාස",
      stat4: "සාර්ථකත්වය",

      featureTitle: "බලවත් විශේෂාංග",
      featureDesc: "අභ්‍යාස සාර්ථකත්වයට අවශ්‍ය සියල්ල.",

      card1: "වේදිකාවේ විශේෂාංග",
      card1p:
        "සිසුන්, සමාගම් සහ විශ්වවිද්‍යාල සඳහා නිර්මාණය කර ඇති ප්‍රබල මෙවලම්.",

      card2: "ශිෂ්‍ය උපකරණ පුවරුව",
      card2p:
        "කුසලතා, අධ්‍යාපනය සහ රුචිකත්වයන් ඇතුළත් සවිස්තරාත්මක පැතිකඩක් සාදන්න.",

      card3: "සමාගම් උපකරණ පුවරුව",
      card3p:
        "අයදුම්පත්, සම්මුඛ පරීක්ෂණ සහ ප්‍රතිපෝෂණ පහසුවෙන් කළමනාකරණය කරන්න.",

      card4: "ස්මාර්ට් උපකරණ පුවරුව",
      card4p:
        "රැකියා, සිසුන්, වාර්තා සහ අයදුම්පත් පහසුවෙන් කළමනාකරණය කරන්න.",

      card5: "වෘත්තීය පුහුණු සෙවුම",
      card5p:
        "වෘත්තීය පුහුණු අවස්ථා පහසුවෙන් සොයන්න, පෙරන්න සහ අයදුම් කරන්න.",

      card6: "දැනුම්දීම්",
      card6p:
        "අවස්ථා සහ තත්ත්වයන් පිළිබඳ තත්‍ය කාලීන යාවත්කාලීන ලබා ගන්න.",

      card7: "ප්‍රමුඛ සමාගම්",
      card7p:
        "විශ්වාසදායක සමාගම් සමඟ සම්බන්ධ වන්න.",

      card8: "වේගවත් බඳවාගැනීම්",
      card8p:
        "නවීන ක්‍රම මඟින් කාලය ඉතිරි කරන්න.",

      ctaTitle: "ආරම්භ කිරීමට සූදානම්ද?",
      ctaDesc:
        "SIMS සමඟ වර්ධනය වන දහස් ගණනක් සිසුන්ට එක්වන්න.",
      createAccount: "ගිණුමක් සාදන්න",

      faqTitle: "නිතර අසන ප්‍රශ්න",

      testimonialTitle: "පරිශීලක ප්‍රතිචාර",

      q1: "මා අයදුම් කරන්නේ කෙසේද?",
      a1:
        "ගිණුමක් සාදා, ඔබේ පැතිකඩ සම්පූර්ණ කර අයදුම් කරන්න.",

      q2: "මෙය නොමිලේ ද?",
      a2:
        "ඔව්, සිසුන් සඳහා සම්පූර්ණයෙන්ම නොමිලේ.",

      q3: "සමාගම්වලට කෙලින්ම බඳවා ගත හැකිද?",
      a3:
        "ඔව්, සමාගම්වලට සුදුසු පරිශීලකයින් තෝරාගත හැක.",

      q4: "මෙය ජංගම දුරකථන සඳහා සුදුසුද?",
      a4:
        "ඔව්. මෙම පද්ධතිය ජංගම දුරකථන, ටැබ්ලට් සහ පරිගණක මත ඉතා හොඳින් ක්‍රියා කරයි.",

      footer: "© 2026 SIMS පද්ධතිය. සියලු හිමිකම් ඇවිරිණි.",
    },

    ta: {
      logo: "SIMS அமைப்பு",
      nav1: "அம்சங்கள்",
      nav2: "கருத்துகள்",
      nav3: "தேடல்",
      nav4: "FAQ",
      nav5: "உள்நுழை",

      tag: "மாணவர் இன்டர்ன்ஷிப் மேலாண்மை அமைப்பு",
      heroTitle: "உங்கள் எதிர்காலத்தை உருவாக்குங்கள்",
      heroDesc:
        "மாணவர்கள், பல்கலைக்கழகங்கள் மற்றும் நிறுவனங்களை இணைக்கும் நவீன தளம்.",
      searchPlaceholder:
        "இன்டர்ன்ஷிப், நிறுவனம், திறன் தேடுங்கள்...",
      searchBtn: "தேடு",
      getStarted: "தொடங்கு",
      explore: "ஆராய்",

      stat1: "மாணவர்கள்",
      stat2: "நிறுவனங்கள்",
      stat3: "இன்டர்ன்ஷிப்",
      stat4: "வெற்றி விகிதம்",

      featureTitle: "சக்திவாய்ந்த அம்சங்கள்",
      featureDesc:
        "இன்டர்ன்ஷிப் வெற்றிக்கு தேவையான அனைத்தும்.",

      card1: "தளத்தின் அம்சங்கள்",
      card1p:
        "மாணவர்கள், நிறுவனங்கள் மற்றும் பல்கலைக்கழகங்களுக்காக வடிவமைக்கப்பட்ட சக்திவாய்ந்த கருவிகள்.",

      card2: "மாணவர் கட்டுப்பாட்டுப் பலகம்",
      card2p:
        "திறன்கள், கல்வி மற்றும் ஆர்வங்களுடன் விரிவான சுயவிவரத்தை உருவாக்குங்கள்.",

      card3: "நிறுவன கட்டுப்பாட்டுப் பலகம்",
      card3p:
        "விண்ணப்பங்கள், நேர்காணல்கள் மற்றும் கருத்துக்களை எளிதாக நிர்வகிக்கவும்.",

      card4: "ஸ்மார்ட் கட்டுப்பாட்டுப் பலகம்",
      card4p:
        "வேலைகள், மாணவர்கள், அறிக்கைகள் மற்றும் விண்ணப்பங்களை எளிதாக நிர்வகிக்கவும்.",

      card5: "பயிற்சிப் பணி தேடல்",
      card5p:
        "பயிற்சிப் பணிகளை எளிதாகத் தேடவும், வடிகட்டவும் மற்றும் விண்ணப்பிக்கவும்.",

      card6: "அறிவிப்புகள்",
      card6p:
        "வாய்ப்புகள் மற்றும் நிலை குறித்த உடனுக்குடன் அறிவிப்புகளைப் பெறுங்கள்.",

      card7: "முன்னணி நிறுவனங்கள்",
      card7p:
        "சிறந்த நிறுவனங்களுடன் இணையுங்கள்.",

      card8: "வேகமான ஆட்சேர்ப்பு",
      card8p:
        "நவீன முறையில் நேரத்தை சேமிக்கவும்.",

      ctaTitle: "தொடங்க தயாரா?",
      ctaDesc:
        "SIMS உடன் வளர்ந்து வரும் ஆயிரக்கணக்கான மாணவர்களுடன் சேருங்கள்.",
      createAccount: "கணக்கு உருவாக்கு",

      faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்",

      testimonialTitle: "பயனர் கருத்துகள்",

      q1: "நான் எப்படி விண்ணப்பிப்பது?",
      a1:
        "கணக்கை உருவாக்கி, சுயவிவரத்தைப் பூர்த்தி செய்து விண்ணப்பிக்கவும்.",

      q2: "இது இலவசமானதா?",
      a2:
        "ஆம், மாணவர்களுக்கு இது முற்றிலும் இலவசம்.",

      q3: "நிறுவனங்கள் நேரடியாக வேலைக்கு எடுக்க முடியுமா?",
      a3:
        "ஆம், நிறுவனங்களால் தகுதியான பயனர்களைத் தேர்ந்தெடுக்க முடியும்.",

      q4: "இது மொபைல் போனில் பயன்படுத்த வசதியாக இருக்குமா?",
      a4:
        "ஆம். இந்த அமைப்பு மொபைல், டேப்லெட் மற்றும் கணினிகளில் தடையின்றி இயங்கும்.",

      footer: "© 2026 SIMS தளம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    },
  };

  const t = text[lang];

  // LOAD TESTIMONIAL COMMENTS
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/comments")
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err));
  }, []);

  const getStars = (count) => {
    return "★".repeat(count) + "☆".repeat(5 - count);
  };

  const words = useMemo(() => {
    if (lang === "si")
      return ["අභ්‍යාස", "වෘත්තිය", "අවස්ථා", "සාර්ථකත්වය"];
    if (lang === "ta")
      return ["இன்டர்ன்ஷிப்", "வேலை", "வாய்ப்புகள்", "வெற்றி"];
    return ["Internships", "Careers", "Opportunities", "Success"];
  }, [lang]);

  useEffect(() => {
    let i = 0;
    const current = words[wordIndex];

    const timer = setInterval(() => {
      i++;
      setTyped(current.slice(0, i));

      if (i === current.length) {
        clearInterval(timer);

        setTimeout(() => {
          setWordIndex((v) => (v + 1) % words.length);
        }, 1200);
      }
    }, 90);

    return () => clearInterval(timer);
  }, [wordIndex, words]);

  useEffect(() => {
    const entries = document.querySelectorAll(".reveal");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("show");
          }
        });
      },
      { threshold: 0.12 }
    );

    entries.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);


  useEffect(() => {
  const stored = getStoredUser();

  if (stored) {
    setUser(stored);
  }
}, []);



  const handleSearch = (e) => {
    e.preventDefault();
    alert(`${t.searchBtn}: ${search}`);
  };

  const toggleFaq = (id) => {
    setFaqOpen(faqOpen === id ? null : id);
  };

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="nav">

        <div className="logo-section">
          <div className="logo-box">
            <Sparkles size={24} />
          </div>
          <div className="logo">
          SIMS <span>Portal</span>
        </div>
            
        </div>

        

        <div className="links">

          <a href="#features">{t.nav1}</a>

          <a href="/testimonials">{t.nav2}</a>

          <a href="/search">{t.nav3}</a>

          <a href="#faq">{t.nav4}</a>


          {user ? (
          <div
            className="profile-circle"
            onClick={() => {
              if (user.role === "Company") {
                window.location.href = "/company";
              } else {
                window.location.href = "/student";
              }
            }}
            title="Go to Dashboard"
          >
            {user.username?.charAt(0).toUpperCase()}
          </div>
        ) : (
          <button
            className="login-btn"
            onClick={() => {
              setAuthMode("login");
              setShowAuth(true);
            }}
          >
            {t.nav5}
          </button>
        )}


          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "999px",
              border: "none",
              fontWeight: "700",
              marginLeft: "8px",
              cursor: "pointer"
            }}
          >
            <option value="en">English</option>
            <option value="si">සිංහල</option>
            <option value="ta">தமிழ்</option>
          </select>

        </div>

      </nav>

      {/* HERO */}
      <header className="hero">

        <div className="hero-inner reveal">

          <p className="tag">{t.tag}</p>

          <h1>
            {t.heroTitle} <span>{typed}</span>
            <b className="cursor">|</b>
          </h1>

          <p>{t.heroDesc}</p>

          <form className="search-bar" onSubmit={handleSearch}>

            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit">
              {t.searchBtn}
            </button>

          </form>

          <div className="hero-actions">

            <a href="/login" className="primary">
              {t.getStarted}
            </a>

            <a href="#features" className="secondary">
              {t.explore}
            </a>

          </div>

        </div>

      </header>

      {/* STATS */}
      <section className="stats">

        <div className="stat-card">
          <h3>10K+</h3>
          <p>{t.stat1}</p>
        </div>

        <div className="stat-card">
          <h3>500+</h3>
          <p>{t.stat2}</p>
        </div>

        <div className="stat-card">
          <h3>3K+</h3>
          <p>{t.stat3}</p>
        </div>

        <div className="stat-card">
          <h3>96%</h3>
          <p>{t.stat4}</p>
        </div>

      </section>

      {/* FEATURES */}
      <section className="section" id="features">

        <div className="title">
          <h2>{t.featureTitle}</h2>
          <p>{t.featureDesc}</p>
        </div>

        <div className="grid">

          {[1,2,3,4,5,6,7,8].map((num) => (

            <div className="card" key={num}>
              <h3>{t[`card${num}`]}</h3>
              <p>{t[`card${num}p`]}</p>
            </div>

          ))}

        </div>

      </section>


      <section className="section reveal testimonial-section">

        <div className="title">
          <h2>What Users Say</h2>
          <p>Real feedback from students and companies</p>
        </div>

        <div className="testimonial-grid modern-grid">

          {comments.slice(0, 6).map((c) => (

            <div key={c._id} className="testimonial-card modern-card">

              {/* TOP USER AREA */}
              <div className="testimonial-header">

                <div className="avatar-circle">
                  {c.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3>{c.name}</h3>
                  <span className="role-tag">Verified User</span>
                </div>

              </div>

              {/* STARS */}
              <div className="testimonial-stars modern-stars">
                {getStars(c.rating || 5)}
              </div>

              {/* MESSAGE */}
              <p className="testimonial-text">
                "{c.message}"
              </p>

              {/* FOOTER */}
              <div className="testimonial-footer">
                <span>SIMS Platform Review</span>
              </div>

            </div>

          ))}

        </div>

      </section>

      {/* CTA */}
      <section className="cta reveal">

        <h2>{t.ctaTitle}</h2>

        <p>{t.ctaDesc}</p>

        <a href="/login" className="primary">
          {t.createAccount}
        </a>

      </section>

      {/* FAQ */}
      <section className="section" id="faq">

        <div className="title">
          <h2>{t.faqTitle}</h2>
        </div>

        <div className="faq-wrap">

          {[1,2,3,4].map((num) => (

            <div className="faq-item" key={num}>

              <button onClick={() => toggleFaq(num)}>

                {t[`q${num}`]}

                <span>
                  {faqOpen === num ? "-" : "+"}
                </span>

              </button>

              {faqOpen === num && (
                <div className="faq-body">
                  {t[`a${num}`]}
                </div>
              )}

            </div>

          ))}

        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">

          <div>
            <h3>InternHub</h3>
            <p>
              Advanced Internship Management Platform
              for students and companies.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <a href="/">Home</a>
            <a href="/student-dashboard">Student</a>
            <a href="/company-dashboard">Company</a>
          </div>

          <div>
            <h4>Contact</h4>
            <p>support@internhub.com</p>
            <p>+94 77 123 4567</p>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 Internship Management System.
          All Rights Reserved.
        </div>
      </footer>;

          {showAuth && (
  <div
    className="auth-modal-overlay"
    onClick={() => setShowAuth(false)}
  >
    <div
      className="auth-modal"
      onClick={(e) => e.stopPropagation()}
    >

      {/* CLOSE BUTTON */}
      <button
        className="close-btn"
        onClick={() => setShowAuth(false)}
      >
        ✕
      </button>

      {/* LOGIN COMPONENT LOAD */}
      <Login
        initialMode={authMode}
        onClose={() => setShowAuth(false)}
      />

    </div>
  </div>
)}


  

     

    </div>


  );
}

export default Home;