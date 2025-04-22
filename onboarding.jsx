import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const slides = [
  {
    title: "Welcome to M-Pesa Wrapped 🎉",
    description: "Track your spending habits in a smart and beautiful way.",
  },
  {
    title: "Insightful Analytics 📊",
    description: "Get detailed reports on how you spend your money daily, weekly, and monthly.",
  },
  {
    title: "Data Privacy 🔒",
    description: "Your data is secure and never shared. You’re always in control.",
  },
];

const Onboarding = ({ onFinish }) => {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      onFinish(); // Finish and show tutorial page
    }
  };

  return (
    <div style={styles.overlay}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          style={styles.card}
        >
          <h2 style={styles.title}>{slides[current].title}</h2>
          <p style={styles.description}>{slides[current].description}</p>
          <button style={styles.button} onClick={handleNext}>
            {current === slides.length - 1 ? "Get Started" : "Next"}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const styles = {
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #1f1c2c, #928dab)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  card: {
    background: "#fff",
    borderRadius: "2xl",
    padding: "40px 30px",
    maxWidth: "90%",
    width: "400px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    fontSize: "26px",
    marginBottom: "15px",
    color: "#333",
  },
  description: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "25px",
  },
  button: {
    padding: "12px 24px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

export default Onboarding;
