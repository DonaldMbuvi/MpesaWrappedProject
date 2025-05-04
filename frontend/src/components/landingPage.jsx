import { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const LandingPage = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const cards = [
    {
      title: "Spending Breakdown",
      description: "Understand where your money goes",
      stats: [
        { category: "Shopping", percentage: "35%" },
        { category: "Bills", percentage: "25%" },
        { category: "Entertainment", percentage: "20%" },
        { category: "Other", percentage: "20%" }
      ]
    },
    {
      title: "Transaction Insights",
      description: "Top merchants and categories",
      stats: [
        { merchant: "Safaricom", amount: "KSh 120,000" },
        { merchant: "Jumia", amount: "KSh 85,000" },
        { merchant: "Naivas", amount: "KSh 65,000" },
        { merchant: "Uber", amount: "KSh 45,000" }
      ]
    },
    {
      title: "Mobile Money Trends",
      description: "Year-end financial summary",
      stats: [
        { month: "January", total: "KSh 150,000" },
        { month: "June", total: "KSh 275,000" },
        { month: "December", total: "KSh 210,000" }
      ]
    }
  ];

  // Animation duration in ms
  //const animationDuration = 5000;

  // Start or stop animation
  // const toggleAnimation = () => {
  //   if (animating) {
  //     setAnimating(false);
  //     cancelAnimationFrame(animationRef.current);
  //   } else {
  //     setAnimating(true);
  //     const startTime = Date.now();
  //     const animate = () => {
  //       const elapsed = Date.now() - startTime;
  //       const progress = Math.min(elapsed / animationDuration, 1);
  //       setAnimationProgress(progress);
        
  //       if (progress < 1) {
  //         animationRef.current = requestAnimationFrame(animate);
  //       } else {
  //         // Move to next card when animation completes
  //         setCurrentCard((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  //         setAnimationProgress(0);
  //         setAnimating(false);
  //       }
  //     };
      
  //     animationRef.current = requestAnimationFrame(animate);
  //   }
  // };

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Reset animation when card changes
  useEffect(() => {
    setAnimationProgress(0);
    if (animating) {
      setAnimating(false);
      cancelAnimationFrame(animationRef.current);
    }
  }, [currentCard]);

  const nextCard = () => {
    setCurrentCard((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  // Color palette definitions
  const colors = {
    light: {
      backgroundGradient: "linear-gradient(135deg, #F8FCF8 0%, #D8EDD8 100%)",
      primaryText: "#1A3E1A",
      secondaryText: "#2D5B2D",
      accent: "#3A7D3A",
      lightAccent: "#E8F5E9",
      buttonHover: "#2D6E2D",
      toggleBg: "#3A7D3A",
      toggleColor: "#FFFFFF",
      cardBg: "#FFFFFF",
      cardShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      arrowColor: "#3A7D3A",
      highlightText: "#3A7D3A",
      blueAccent: "#4169E1",
      blueGradient: "linear-gradient(135deg, #E6EEFF 0%, #4169E1 100%)",
      blueCardBg: "#F8FAFF",
      blueShadow: "0 4px 12px rgba(65, 105, 225, 0.2)",
      statusInactive: "rgba(255, 255, 255, 0.5)",
      statusActive: "#3A7D3A",
      statusProgress: "#2D6E2D"
    },
    dark: {
      backgroundGradient: "linear-gradient(135deg, #000000 0%, #0C1F0C 100%)",
      primaryText: "#E0F2E0",
      secondaryText: "#B8D8B8",
      accent: "#4CAF50",
      lightAccent: "#2D5B2D",
      buttonHover: "#3E8C3E",
      toggleBg: "#4CAF50",
      toggleColor: "#0C1F0C",
      cardBg: "#1A3E1A",
      cardShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      arrowColor: "#4CAF50",
      highlightText: "#4CAF50",
      blueAccent: "#4169E1",
      blueGradient: "linear-gradient(135deg, #1E3B70 0%, #4169E1 100%)",
      blueCardBg: "#0A1929",
      blueShadow: "0 4px 12px rgba(65, 105, 225, 0.3)",
      statusInactive: "rgba(255, 255, 255, 0.3)",
      statusActive: "#4CAF50",
      statusProgress: "#3E8C3E"
    }
  };

  const currentColors = colors[theme];

  const styles = {
    wrapper: {
      position: "relative",
      minHeight: "100vh",
      padding: "2rem 1rem",
      background: currentColors.backgroundGradient,
      color: currentColors.primaryText,
      transition: "all 0.5s ease-in-out",
      overflow: "hidden"
    },
    contentWrapper: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      maxWidth: "1200px",
      margin: "0 auto",
      position: "relative",
      height: "100%",
      "@media (max-width: 768px)": {
        flexDirection: "column"
      }
    },
    leftSection: {
      flex: "0 0 48%",
      paddingTop: "3rem",
      zIndex: 2,
      "@media (max-width: 768px)": {
        flex: "0 0 100%",
        paddingTop: "1rem"
      }
    },
    rightSection: {
      flex: "0 0 48%",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      paddingTop: "3rem",
      zIndex: 2,
      "@media (max-width: 768px)": {
        flex: "0 0 100%",
        paddingTop: "2rem"
      }
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
    header: {
      textAlign: "left",
      marginBottom: "2rem",
    },
    title: {
      fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
      fontWeight: 700,
      marginBottom: "0.5rem",
      lineHeight: "1.2",
      color: theme === "light" ? currentColors.primaryText : "#FFFFFF",
    },
    subtitle: {
      color: currentColors.highlightText,
      fontSize: "clamp(2.2rem, 5vw, 3rem)",
      fontWeight: 700,
      marginBottom: "1.5rem",
    },
    description: {
      fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
      marginBottom: "2rem",
      lineHeight: "1.6",
      color: currentColors.secondaryText,
      maxWidth: "500px"
    },
    // WhatsApp Status Bar styles
    statusBarContainer: {
      display: "flex",
      justifyContent: "center", // Changed from flex-start to center
      alignItems: "center",
      gap: "4px",
      margin: "0 0 20px 0", // Adjusted margin to be only at bottom
      width: "100%",
      maxWidth: "450px"
    },
    statusSegment: {
      height: "3px",
      flex: 1,
      borderRadius: "3px",
      backgroundColor: currentColors.statusInactive,
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      transition: "backgroundColor 0.3s ease"
    },
    statusSegmentCompleted: {
      backgroundColor: currentColors.statusActive
    },
    statusSegmentCurrent: {
      backgroundColor: currentColors.statusInactive
    },
    statusProgress: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      backgroundColor: currentColors.statusActive,
      transition: "width 0.3s linear"
    },
    cardsSection: {
      position: "relative",
      width: "100%"
    },
    cardContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      position: "relative"
    },
    arrowButton: {
      background: "none",
      border: "none",
      color: currentColors.arrowColor,
      cursor: "pointer",
      padding: "0.5rem",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
      transition: "all 0.3s ease",
      position: "absolute",
      zIndex: 5,
      backgroundColor: currentColors.cardBg,
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)"
    },
    prevButton: {
      left: "-15px"
    },
    nextButton: {
      right: "-15px"
    },
    featureCard: {
      background: currentColors.blueCardBg,
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: currentColors.blueShadow,
      width: "100%",
      minHeight: "280px",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden"
    },
    blueTriangle: {
      position: "absolute",
      top: "-10%",
      right: "-5%",
      width: "150px",
      height: "150px",
      background: currentColors.blueAccent,
      transform: "rotate(45deg)",
      zIndex: 1,
      opacity: 0.5
    },
    featureTitle: {
      fontSize: "1.5rem",
      fontWeight: 600,
      marginBottom: "0.5rem",
      color: currentColors.highlightText,
      position: "relative",
      zIndex: 2
    },
    featureText: {
      fontSize: "0.9rem",
      lineHeight: "1.5",
      marginBottom: "1.5rem",
      color: currentColors.secondaryText,
      position: "relative",
      zIndex: 2
    },
    statsContainer: {
      marginTop: "auto",
      position: "relative",
      zIndex: 2
    },
    statItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0.8rem 0",
      borderBottom: `1px solid ${theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"}`
    },
    statValue: {
      fontWeight: 600,
      color: theme === "light" ? currentColors.primaryText : "#FFFFFF"
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      alignItems: "flex-start",
      width: "100%",
      maxWidth: "350px",
      marginTop: "2rem"
    },
    button: {
      padding: "0.75rem 1.5rem",
      fontSize: "1rem",
      cursor: "pointer",
      backgroundColor: currentColors.accent,
      color: "white",
      border: "none",
      borderRadius: "8px",
      transition: "all 0.3s ease-in-out",
      width: "100%",
      fontWeight: 500,
      boxShadow: `0 4px 6px ${theme === "light" 
        ? "rgba(58, 125, 58, 0.2)" 
        : "rgba(76, 175, 80, 0.3)"}`,
      display: "block"
    },
    cardCategory: {
      position: "absolute",
      bottom: "-15px",
      left: "0",
      fontSize: "clamp(2.5rem, 8vw, 5rem)",
      fontWeight: "900",
      color: "rgba(255, 255, 255, 0.03)",
      zIndex: 1,
      letterSpacing: "-2px"
    },
    // New container for status bar in right section
    statusBarCardContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  };

  // Handle clicking on a specific status segment
  const goToSegment = (index) => {
    setCurrentCard(index);
    setAnimationProgress(0);
    if (animating) {
      setAnimating(false);
      cancelAnimationFrame(animationRef.current);
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

      <div style={styles.contentWrapper}>
        <div style={styles.leftSection}>
          <header style={styles.header}>
            <h1 style={styles.title}>Your Financial Story,</h1>
            <h2 style={styles.subtitle}>Unwrapped</h2>
            <p style={styles.description}>
              Discover insights into your mobile money journey. See your spending patterns, 
              top transactions, and financial highlights – all in one place.
            </p>
          </header>

          <div style={styles.buttonContainer}>
            <Link to="/tutorial" style={{ width: "100%", textDecoration: "none" }}>
              <button 
                style={styles.button}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = currentColors.buttonHover;
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = `0 6px 8px ${theme === "light" 
                    ? "rgba(58, 125, 58, 0.3)" 
                    : "rgba(76, 175, 80, 0.4)"}`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = currentColors.accent;
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = `0 4px 6px ${theme === "light" 
                    ? "rgba(58, 125, 58, 0.2)" 
                    : "rgba(76, 175, 80, 0.3)"}`;
                }}
              >
                📚 See How It Works
              </button>
            </Link>
            <Link to="/main" style={{ width: "100%", textDecoration: "none" }}>
              <button 
                style={styles.button}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = currentColors.buttonHover;
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = `0 6px 8px ${theme === "light" 
                    ? "rgba(58, 125, 58, 0.3)" 
                    : "rgba(76, 175, 80, 0.4)"}`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = currentColors.accent;
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = `0 4px 6px ${theme === "light" 
                    ? "rgba(58, 125, 58, 0.2)" 
                    : "rgba(76, 175, 80, 0.3)"}`;
                }}
              >
                🚀 Analyze My Transactions Now
              </button>
            </Link>
          </div>
        </div>

        <div style={styles.rightSection}>
          <div style={styles.statusBarCardContainer}>
           
            <div style={styles.statusBarContainer}>
              {cards.map((_, index) => (
                <div 
                  key={index} 
                  style={{
                    ...styles.statusSegment,
                    ...(index < currentCard ? styles.statusSegmentCompleted : {}),
                    ...(index === currentCard ? styles.statusSegmentCurrent : {})
                  }}
                  onClick={() => goToSegment(index)}
                >
                  {index === currentCard && animating && (
                    <div 
                      style={{
                        ...styles.statusProgress,
                        width: `${animationProgress * 100}%`
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div style={styles.cardsSection}>
              <div style={styles.cardContainer}>
                <button 
                  style={{...styles.arrowButton, ...styles.prevButton}} 
                  onClick={prevCard}
                  aria-label="Previous card"
                >
                  <FaChevronLeft size={18} />
                </button>
                
                <div style={styles.featureCard}>
                  <div style={styles.blueTriangle}></div>
                  <h3 style={styles.featureTitle}>{cards[currentCard].title}</h3>
                  <p style={styles.featureText}>{cards[currentCard].description}</p>
                  
                  <div style={styles.statsContainer}>
                    {cards[currentCard].stats.map((stat, index) => (
                      <div key={index} style={styles.statItem}>
                        <span>{stat.category || stat.merchant || stat.month}</span>
                        <span style={styles.statValue}>
                          {stat.percentage || stat.amount || stat.total}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={styles.cardCategory}>
                    {currentCard === 0 ? "SPENDING" : currentCard === 1 ? "INSIGHTS" : "TRENDS"}
                  </div>
                </div>
                
                <button 
                  style={{...styles.arrowButton, ...styles.nextButton}} 
                  onClick={nextCard}
                  aria-label="Next card"
                >
                  <FaChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <svg 
        style={{ 
          position: "absolute", 
          bottom: 0, 
          right: 0, 
          width: "45%", 
          height: "45%", 
          zIndex: 1,
          opacity: 0.6
        }} 
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

export default LandingPage;
