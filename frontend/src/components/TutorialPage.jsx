import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useContext, useState } from "react";
import { FaSun, FaMobileAlt, FaPhone, FaMoon, FaFileUpload, FaChartPie, FaLock } from "react-icons/fa";
import {motion,  AnimatePresence } from "framer-motion";

const steps = [
    {
        title: "Get Statement via USSD *334#",
        description: `1. Dial *334#.\n2. Select My Account > M-PESA Statement.\n3. Select Request Statement.\n4. Choose type and period.\n5. Enter recipient email and confirm.\n6. Enter M-PESA PIN to get SMS with access code.`,
        icon: <FaPhone size={40}  />,
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
      icon: <FaChartPie size={40}  />,
    },
    {
      title: "Privacy First",
      description: "Your data is processed securely and never shared. Your privacy matters.",
      icon: <FaLock size={40}  />,
    },
  ];
  

const TutorialPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
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
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          style={styles.card}
        >
          <div style={styles.icon}>{steps[step].icon}</div>
          <h2 style={styles.title}>{steps[step].title}</h2>
          <p style={styles.description}>{steps[step].description}</p>
          {step < steps.length - 1 ? (
            <button style={styles.bttn} onClick={nextStep}>Next</button>
          ) : (
            <Link to="/landing">
              <button
                style={styles.bttn}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#0056b3";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#007bff";
                  e.target.style.transform = "scale(1)";
                }}
              >Back to Start</button>
            </Link>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
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
    background: "linear-gradient(135deg, #f3f4f6, #e2e8f0)",
  },
  toggleButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "10px",
    fontSize: "14px",
    border: "none",
    borderRadius: "5px",
    background: "#444",
    color: "#fff",
    cursor: "pointer",
  },
  card: {
    background: "#fff",
    borderRadius: "15px",
    padding: "40px 30px",
    maxWidth: "90%",
    width: "400px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  icon: {
    marginBottom: "20px",
    color: '#39b54a'
  },
  title: {
    fontSize: "24px",
    marginBottom: "15px",
    color: "#333",
  },
  description: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "25px",
    whiteSpace: "pre-line",
    textAlign: "left",
  },
  bttn: {
    padding: "12px 25px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#39b54a",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginTop: "15px",
    transition: "all 0.3s ease-in-out",
  },
};

export default TutorialPage;