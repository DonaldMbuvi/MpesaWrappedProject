import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const ResultPage = () => {
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
            cardBg: "#FFFFFF",
            cardShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            highlightText: "#3A7D3A",
            blueAccent: "#4169E1",
            backButton: "#3A7D3A",
            backButtonHover: "#2D6E2D",
            analyticsButton: "#4169E1",
            analyticsButtonHover: "#3151B3",
            summaryCardBg: "#E8F5E9",
            summaryCardText: "#1A3E1A"
        },
        dark: {
            backgroundGradient: "linear-gradient(135deg, #000000 0%, #0C1F0C 100%)",
            primaryText: "#E0F2E0",
            secondaryText: "#B8D8B8",
            accent: "#4CAF50",
            buttonHover: "#3E8C3E",
            toggleBg: "#4CAF50",
            toggleColor: "#0C1F0C",
            cardBg: "#1A3E1A",
            cardShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            highlightText: "#4CAF50",
            blueAccent: "#4169E1",
            backButton: "#4CAF50",
            backButtonHover: "#3E8C3E",
            analyticsButton: "#4169E1",
            analyticsButtonHover: "#3151B3",
            summaryCardBg: "#2D5B2D",
            summaryCardText: "#E0F2E0"
        }
    };

    const currentColors = colors[theme];

    const financialSummary = {
        highest: 20000,
        highestday: "Friday",
        recipient: "Nadeem",
    };

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
            marginTop: "3rem",
            maxWidth: "800px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
            zIndex: 2
        },
        title: {
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 700,
            marginBottom: "1rem",
            color: currentColors.highlightText
        },
        card: {
            background: currentColors.summaryCardBg,
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: currentColors.cardShadow,
            width: "100%",
            maxWidth: "400px",
            textAlign: "left",
            transition: "all 0.3s ease-in-out"
        },
        cardTitle: {
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "1rem",
            color: currentColors.highlightText
        },
        summaryText: {
            margin: "0.8rem 0",
            color: currentColors.summaryCardText
        },
        buttonContainer: {
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%",
            maxWidth: "300px"
        },
        button: {
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: currentColors.backButton,
            color: "white",
            border: "none",
            borderRadius: "8px",
            transition: "all 0.3s ease-in-out",
            fontWeight: 500,
            boxShadow: `0 4px 6px ${theme === "light" 
                ? "rgba(58, 125, 58, 0.2)" 
                : "rgba(76, 175, 80, 0.3)"}`,
            width: "100%",
            textDecoration: "none",
            textAlign: "center"
        },
        analyticsButton: {
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: currentColors.analyticsButton,
            color: "white",
            border: "none",
            borderRadius: "8px",
            transition: "all 0.3s ease-in-out",
            fontWeight: 500,
            boxShadow: `0 4px 6px ${theme === "light" 
                ? "rgba(65, 105, 225, 0.2)" 
                : "rgba(65, 105, 225, 0.3)"}`,
            width: "100%"
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
                <h1 style={styles.title}>Results Page</h1>
                
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Summary</h2>
                    <p style={styles.summaryText}>
                        <strong>Highest Single Transaction: </strong>ksh {financialSummary.highest}
                    </p>
                    <p style={styles.summaryText}>
                        <strong>Day with most transactions: </strong>{financialSummary.highestday}
                    </p>
                    <p style={styles.summaryText}>
                        <strong>Most frequent recipient: </strong>{financialSummary.recipient}
                    </p>
                </div>

                <div style={styles.buttonContainer}>
                    <Link to="/main" style={{ textDecoration: "none", width: "100%" }}>
                        <button
                            style={styles.button}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = currentColors.backButtonHover;
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = `0 6px 8px ${theme === "light" 
                                    ? "rgba(58, 125, 58, 0.3)" 
                                    : "rgba(76, 175, 80, 0.4)"}`;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = currentColors.backButton;
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = `0 4px 6px ${theme === "light" 
                                    ? "rgba(58, 125, 58, 0.2)" 
                                    : "rgba(76, 175, 80, 0.3)"}`;
                            }}
                        >
                            Back to Main Page
                        </button>
                    </Link>

                    <Link to="/analytics" style={{ textDecoration: "none", width: "100%" }}>
                        <button
                            style={styles.analyticsButton}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = currentColors.analyticsButtonHover;
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = `0 6px 8px ${theme === "light" 
                                    ? "rgba(65, 105, 225, 0.3)" 
                                    : "rgba(65, 105, 225, 0.4)"}`;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = currentColors.analyticsButton;
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = `0 4px 6px ${theme === "light" 
                                    ? "rgba(65, 105, 225, 0.2)" 
                                    : "rgba(65, 105, 225, 0.3)"}`;
                            }}
                        >
                            View More Analytics
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

export default ResultPage;
