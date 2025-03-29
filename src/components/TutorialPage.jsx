import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";
import {FaSun, FaMoon} from "react-icons/fa";

const TutorialPage=()=> {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return(
        <div style={styles.wrapper}>
         <button 
                  style={styles.toggleButton} 
                  onClick={toggleTheme}
                  title={theme==="light"?"Turn off the light":"Turn on the light"}
                >
                  {theme === "light" ? <FaMoon size={18}/> :<FaSun size={18}/>}
                </button>
            <center><h1>This is the tutorial page</h1></center>
            <Link to="/landing">
            <button style={styles.bttn} onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#0056b3";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#007bff";
            e.target.style.transform = "scale(1)";
          }}>Back</button>
            </Link>
            </div>
        
        
    );
};
const styles={
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
      bttn:{
    padding: "12px 25px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginTop: "15px",
    transition: "all 0.3s ease-in-out",
      }
}
export default TutorialPage


