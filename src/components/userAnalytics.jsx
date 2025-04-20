import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const AnalyticsPage = () => {
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
            resultsButton: "#3A7D3A",
            resultsButtonHover: "#2D6E2D"
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
            resultsButton: "#4CAF50",
            resultsButtonHover: "#3E8C3E"
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
        container: {
            textAlign: "center",
            maxWidth: "800px",
            padding: "2rem",
            zIndex: 2
        },
        title: {
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 700,
            marginBottom: "1.5rem",
            color: currentColors.highlightText
        },
        button: {
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: currentColors.resultsButton,
            color: "white",
            border: "none",
            borderRadius: "8px",
            transition: "all 0.3s ease-in-out",
            fontWeight: 500,
            boxShadow: `0 4px 6px ${theme === "light" 
                ? "rgba(58, 125, 58, 0.2)" 
                : "rgba(76, 175, 80, 0.3)"}`,
            textDecoration: "none"
        },
        decorativeTriangle: {
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "45%",
            height: "45%",
            zIndex: 1,
            opacity: 0.6
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

            <div style={styles.container}>
                <h1 style={styles.title}>User Analytics Page</h1>
                
                <Link to="/results" style={{ textDecoration: "none" }}>
                    <button
                        style={styles.button}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = currentColors.resultsButtonHover;
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = `0 6px 8px ${theme === "light" 
                                ? "rgba(58, 125, 58, 0.3)" 
                                : "rgba(76, 175, 80, 0.4)"}`;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = currentColors.resultsButton;
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = `0 4px 6px ${theme === "light" 
                                ? "rgba(58, 125, 58, 0.2)" 
                                : "rgba(76, 175, 80, 0.3)"}`;
                        }}
                    >
                        Results Page
                    </button>
                </Link>
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

export default AnalyticsPage;