import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useContext, useState } from "react";
import { FaSun, FaMoon, FaFileUpload, FaChartPie, FaLock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    title: "Upload your M-Pesa Statement",
    description: "Simply upload your PDF statement to get started. It's safe and secure.",
    icon: <FaFileUpload size={40} color="#007bff" />,
  },
  {
    title: "Get Detailed Analysis",
    description: "We break down your spending across categories with charts and summaries.",
    icon: <FaChartPie size={40} color="#28a745" />,
  },
  {
    title: "Privacy First",
    description: "Your data is processed securely and never shared. Your privacy matters.",
    icon: <FaLock size={40} color="#dc3545" />,
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
  },
  bttn: {
    padding: "12px 25px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginTop: "15px",
    transition: "all 0.3s ease-in-out",
  },
};

export default TutorialPage;
