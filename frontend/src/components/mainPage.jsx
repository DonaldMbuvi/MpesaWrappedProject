import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const MainPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Color palette definitions (consistent with landing page)
  const colors = {
    light: {
      backgroundGradient: "linear-gradient(135deg, #F8FCF8 0%, #D8EDD8 100%)",
      primaryText: "#1A3E1A",
      secondaryText: "#2D5B2D",
      accent: "#3A7D3A",
      buttonHover: "#2D6E2D",
      toggleBg: "#3A7D3A",
      toggleColor: "#FFFFFF",
      highlightText: "#3A7D3A",
      blueAccent: "#4169E1",
      buttonColor: "#3A7D3A",
      buttonHoverColor: "#2D6E2D"
    },
    dark: {
      backgroundGradient: "linear-gradient(135deg, #000000 0%, #0C1F0C 100%)",
      primaryText: "#E0F2E0",
      secondaryText: "#B8D8B8",
      accent: "#4CAF50",
      buttonHover: "#3E8C3E",
      toggleBg: "#4CAF50",
      toggleColor: "#0C1F0C",
      highlightText: "#4CAF50",
      blueAccent: "#4169E1",
      buttonColor: "#4CAF50",
      buttonHoverColor: "#3E8C3E"
    }
  };

  const currentColors = colors[theme];

  const styles = {
    wrapper: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      padding: "2rem",
      background: currentColors.backgroundGradient,
      color: currentColors.primaryText,
      transition: "all 0.5s ease-in-out",
      overflow: "hidden"
    },
    toggleContainer: {
      position: "absolute",
      top: "1.5rem",
      right: "1.5rem",
      zIndex: 10
    },
    toggleButton: {
      padding: "0.5rem",
      fontSize: "1rem",
      border: "none",
      borderRadius: "50%",
      background: currentColors.toggleBg,
      color: currentColors.toggleColor,
      cursor: "pointer",
      transition: "all 0.3s ease-in-out",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 2px 10px ${theme === "light" 
        ? "rgba(58, 125, 58, 0.2)" 
        : "rgba(76, 175, 80, 0.3)"}`
    },
    contentContainer: {
      textAlign: "center",
      maxWidth: "800px",
      padding: "2rem",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    title: {
      fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
      fontWeight: 700,
      marginBottom: "1rem",
      color: currentColors.highlightText
    },
    subtitle: {
      fontSize: "1.1rem",
      marginBottom: "2rem",
      color: currentColors.secondaryText
    },
    button: {
      padding: "0.75rem 1.5rem",
      fontSize: "1rem",
      cursor: "pointer",
      backgroundColor: currentColors.buttonColor,
      color: "white",
      border: "none",
      borderRadius: "8px",
      transition: "all 0.3s ease-in-out",
      fontWeight: 500,
      boxShadow: `0 4px 6px ${theme === "light" 
        ? "rgba(58, 125, 58, 0.2)" 
        : "rgba(76, 175, 80, 0.3)"}`,
      margin: "0.5rem 0",
      width: "100%",
      maxWidth: "300px"
    },
    decorativeTriangle: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: "45%",
      height: "45%",
      zIndex: 1,
      opacity: 0.6
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem",
      marginTop: "1.5rem"
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.toggleContainer}>
        <button 
          style={styles.toggleButton} 
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <FaMoon size={18}/> : <FaSun size={18}/>}
        </button>
      </div>

      <div style={styles.contentContainer}>
        <h1 style={styles.title}>Welcome to Financial Wrapped</h1>
        <p style={styles.subtitle}>Please drag your M-Pesa statements down below: &#128513;</p>
        <h3 style={{ color: currentColors.highlightText, marginBottom: "1.5rem" }}>File Submission Area</h3>

        <div style={styles.buttonContainer}>
          <Link to="/results" style={{ textDecoration: "none", width: "100%" }}>
            <button
              style={styles.button}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = currentColors.buttonHoverColor;
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = `0 6px 8px ${theme === "light" 
                  ? "rgba(58, 125, 58, 0.3)" 
                  : "rgba(76, 175, 80, 0.4)"}`;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = currentColors.buttonColor;
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = `0 4px 6px ${theme === "light" 
                  ? "rgba(58, 125, 58, 0.2)" 
                  : "rgba(76, 175, 80, 0.3)"}`;
              }}
            >
              Submit
            </button>
          </Link>

          <Link to="/landing" style={{ textDecoration: "none", width: "100%" }}>
            <button
              style={styles.button}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = currentColors.buttonHoverColor;
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = `0 6px 8px ${theme === "light" 
                  ? "rgba(58, 125, 58, 0.3)" 
                  : "rgba(76, 175, 80, 0.4)"}`;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = currentColors.buttonColor;
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = `0 4px 6px ${theme === "light" 
                  ? "rgba(58, 125, 58, 0.2)" 
                  : "rgba(76, 175, 80, 0.3)"}`;
              }}
            >
              Back to Intro Page
            </button>
          </Link>
        </div>
      </div>

      {/* Decorative triangle similar to landing page */}
      <svg 
        style={styles.decorativeTriangle} 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <polygon 
          points="0,100 100,0 100,100" 
          fill={currentColors.blueAccent} 
        />
      </svg>
    </div>
  );
};

export default MainPage;