import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useContext, useState } from "react";
import { FaSun, FaMobileAlt, FaPhone, FaMoon, FaFileUpload, FaChartPie, FaLock, FaArrowLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    title: "Get Statement via USSD *334#",
    description: `1. Dial *334#.\n2. Select My Account > M-PESA Statement.\n3. Select Request Statement.\n4. Choose type and period.\n5. Enter recipient email and confirm.\n6. Enter M-PESA PIN to get SMS with access code.`,
    icon: <FaPhone size={40} />,
  },
  {
    title: "Get Statement via M-PESA App",
    description: `1. Download M-PESA App from Play Store or App Store.\n2. Log in using M-PESA PIN or biometrics.\n3. Go to M-PESA Statements > See All.\n4. Select the Month.\n5. Tap Export Statements and set the date range.\n6. Tap Generate Statement to download.`,
    icon: <FaMobileAlt size={40} />,
  },
  {
    title: "Upload your M-PESA Statement",
    description: "Simply upload your PDF statement to get started. It's safe and secure.",
    icon: <FaFileUpload size={40} />,
  },
  {
    title: "Get Detailed Analysis",
    description: "We break down your spending across categories with charts and summaries.",
    icon: <FaChartPie size={40} />,
  },
  {
    title: "Privacy First",
    description: "Your data is processed securely and never shared. Your privacy matters.",
    icon: <FaLock size={40} />,
  },
];

const TutorialPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [step, setStep] = useState(0);

  // Theme-based colors
  const themeColors = {
    light: {
      backgroundGradient: "linear-gradient(135deg, #F8FCF8 0%, #D8EDD8 100%)",
      cardBg: "#fff",
      textColor: "#333",
      secondaryText: "#666",
      accentColor: "#39b54a",
      accentHover: "#2e9e3f",
      buttonText: "white",
      decorativeColor: "#4169E1",
      toggleBg: "#444",
      toggleText: "#fff"
    },
    dark: {
      backgroundGradient: "linear-gradient(135deg, #0a1f0a 0%, #152415 100%)",
      cardBg: "#1a2e1a",
      textColor: "#e0f2e0",
      secondaryText: "#b8d8b8",
      accentColor: "#3cb54a",
      accentHover: "#32a042",
      buttonText: "white",
      decorativeColor: "#3a5bc7",
      toggleBg: "#666",
      toggleText: "#fff"
    }
  };

  const currentTheme = themeColors[theme];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const styles = {
    wrapper: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      padding: "20px",
      boxSizing: "border-box",
      overflow: "hidden",
      background: currentTheme.backgroundGradient,
      transition: "all 0.3s ease-in-out",
    },
    backButton: {
      marginTop: "10px",
      fontSize: "14px",
      border: "none",
      borderRadius: "5px",
      background: currentTheme.accentColor,
      color: currentTheme.buttonText,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease-in-out",
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    },
    toggleButton: {
      position: "absolute",
      top: "20px",
      right: "20px",
      padding: "10px",
      fontSize: "14px",
      border: "none",
      borderRadius: "5px",
      background: currentTheme.toggleBg,
      color: currentTheme.toggleText,
      cursor: "pointer",
    },
    card: {
      background: currentTheme.cardBg,
      borderRadius: "15px",
      padding: "40px 30px",
      maxWidth: "90%",
      width: "400px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      textAlign: "center",
      transition: "all 0.3s ease-in-out",
    },
    icon: {
      marginBottom: "20px",
      color: currentTheme.accentColor,
      transition: "all 0.3s ease-in-out",
    },
    title: {
      fontSize: "24px",
      marginBottom: "15px",
      color: currentTheme.textColor,
      transition: "all 0.3s ease-in-out",
    },
    description: {
      fontSize: "16px",
      color: currentTheme.secondaryText,
      marginBottom: "25px",
      whiteSpace: "pre-line",
      textAlign: "left",
      transition: "all 0.3s ease-in-out",
    },
    bttn: {
      padding: "12px 25px",
      fontSize: "16px",
      cursor: "pointer",
      backgroundColor: currentTheme.accentColor,
      color: currentTheme.buttonText,
      border: "none",
      borderRadius: "5px",
      marginTop: "15px",
      transition: "all 0.3s ease-in-out",
    },
    decorativeTriangle: {
      position: 'absolute',
      bottom: '0',
      right: "0",
      width: "45%",
      height: "45%",
      zIndex: "1",
      opacity: "0.6",
      transition: "all 0.3s ease-in-out",
    }
  };

  return (
    <div style={styles.wrapper}>


      <button 
        style={styles.toggleButton} 
        onClick={toggleTheme}
        title={theme === "light" ? "Turn off the light" : "Turn on the light"}
      >
        {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.5 }}
          style={styles.card}
        >
          <div style={styles.icon}>{steps[step].icon}</div>
          <h2 style={styles.title}>{steps[step].title}</h2>
          <p style={styles.description}>{steps[step].description}</p>
          {step < steps.length - 1 ? (
            <button 
              style={styles.bttn} 
              onClick={nextStep}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = currentTheme.accentHover;
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = currentTheme.accentColor;
                e.target.style.transform = "scale(1)";
              }}
            >
              Next
            </button>
          ) : (
            <Link to="/main">
              <button
                style={styles.bttn}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = currentTheme.accentHover;
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = currentTheme.accentColor;
                  e.target.style.transform = "scale(1)";
                }}
              >
                Let's Go!
              </button>
            </Link>
          )}
        </motion.div>
        <Link to="/landing" style={{ textDecoration: "none" }}>
        <button
          style={styles.backButton}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = currentTheme.accentHover;
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = currentTheme.accentColor;
            e.target.style.transform = "translateY(0)";
          }}
        >
          <FaArrowLeft /> Back
        </button>
      </Link>
      </AnimatePresence>

      <svg 
        style={styles.decorativeTriangle} 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <polygon 
          points="0,100 100,0 100,100" 
          fill={currentTheme.decorativeColor} 
        />
      </svg>
    </div>
  );
};

export default TutorialPage;