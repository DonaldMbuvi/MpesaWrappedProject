import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";
import {FaSun, FaMoon} from "react-icons/fa";

const MainPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div style={styles.wrapper}>
      
       <button 
                style={styles.toggleButton} 
                onClick={toggleTheme}
                title={theme==="light"?"Turn off the light":"Turn on the light"}
              >
                {theme === "light" ? <FaMoon size={18}/> :<FaSun size={18}/>}
              </button>

      
      <div style={styles.container}>
        <h1>Welcome to Financial Wrapped</h1>
        <p>Please drag your M-Pesa statements down below: &#128513;</p>
        <h3>File Submission Area</h3>

       
        <Link to="/results">
          <button
            style={styles.button}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#0056b3";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#28a745";
              e.target.style.transform = "scale(1)";
            }}
          >
            Submit
          </button>
        </Link>
      </div>

      
      <div style={styles.bottomContainer}>
        <Link to="/landing">
          <button
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#c82333";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#dc3545";
              e.target.style.transform = "scale(1)";
            }}
          >
            Back to Intro Page
          </button>
        </Link>
      </div>
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
  },
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#05be0e",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginTop: "20px",
    transition: "all 0.3s ease-in-out",
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
  bottomContainer: {
    position: "absolute",
    bottom: "20px",
  },
  backButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#05be0e",
    color: "white",
    border: "none",
    borderRadius: "5px",
    transition: "all 0.3s ease-in-out",
  },
};

export default MainPage;
