import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {FaSun, FaMoon} from "react-icons/fa";
const LandingPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div style={{ 
      ...styles.wrapper, 
      background: theme === "light" 
        ? "rgba(255, 255, 255, 0.6)" 
        : "rgba(41, 39, 39, 0.7)",  
      color: theme === "light" ? "#1F2937" : "#E4E4E7",
      backdropFilter: "blur(10px)", 
      border: theme === "light" ? "1px solid #E5E7EB" : "1px solid rgba(255, 255, 255, 0.1)", 
      borderRadius: "12px",
      padding: "20px",
      transition: "all 0.3s ease-in-out"
    }}>
    
    
      
      <div style={styles.toggleContainer}>
        <button 
          style={styles.toggleButton} 
          onClick={toggleTheme}
          title={theme==="light"?"Turn off the light":"Turn on the light"}
        >
          {theme === "light" ? <FaMoon size={18}/> :<FaSun size={18}/>}
        </button>
      </div>

      
      <h1 style={styles.title}>WELCOME TO MPESA FINANCIAL WRAPPED 📊</h1>
      <p style={styles.subtitle}>
        See your <strong>spending habits</strong>, <strong>savings growth</strong>, and <strong>top expenses</strong> at a glance.
        Think of it as <em>Spotify Wrapped</em>, but for your <strong>money</strong>. 💰
      </p>
      <p style={styles.highlight}>
        If you need a quick guide on how to use this system, click below:
      </p>

      <Link to="/tutorial">
        <button 
          style={styles.button} 
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#0056b3";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#007bff";
            e.target.style.transform = "scale(1)";
          }}
        >
          📖 Tutorial
        </button>
      </Link>

      <p style={styles.question}>
        Did you budget like a pro or spend like a rockstar? Let’s find out!
      </p>

      <Link to="/main">
        <button 
          style={styles.button} 
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#0056b3";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#007bff";
            e.target.style.transform = "scale(1)";
          }}
        >
          🔍 Find out your Wrapped
        </button>
      </Link>
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
    transition: "background 0.3s ease-in-out, color 0.3s ease-in-out",
  },
  toggleContainer: {
    position: "absolute",
    top: "20px",
    right: "20px",
  },
  toggleButton: {
    padding: "10px",
    fontSize: "14px",
    border: "none",
    borderRadius: "5px",
    background: "#444",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s ease-in-out",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "15px",
  },
  highlight: {
    fontSize: "1rem",
    fontStyle: "italic",
    marginBottom: "15px",
  },
  question: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: "30px",
  },
  button: {
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

export default LandingPage;
