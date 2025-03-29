import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {FaSun, FaMoon} from "react-icons/fa";

const ResultPage=()=>{
    const { theme, toggleTheme } = useContext(ThemeContext);
    const financialSummary={
      highest:20000,
      highestday:"Friday",
      recipient:"Nadeem",
    };
    return(
<div style={styles.wrapper}>
        <div style={styles.container}>
           <button 
                    style={styles.toggleButton} 
                    onClick={toggleTheme}
                    title={theme==="light"?"Turn off the light":"Turn on the light"}
                  >
                    {theme === "light" ? <FaMoon size={18}/> :<FaSun size={18}/>}
                  </button>
            <h1>Results Page</h1>
            <div style={styles.card}>
              <h2>Summary</h2>
              <p><strong>Highest Single Transaction: </strong>ksh{financialSummary.highest}</p>
              <p><strong>Day with most transactions: </strong>{financialSummary.highestday}</p>
              <p><strong>Most frequent recipient: </strong>{financialSummary.recipient}</p>

            </div>
            <Link to="/main">
            <button style={styles.button}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#0056b3";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#007bff";
              e.target.style.transform = "scale(1)";
            }}>Back to main Page</button>

            </Link>
            <Link to="/analytics">
            <button style={styles.Button}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#0056b3";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#007bff";
              e.target.style.transform = "scale(1)";
            }}>View More Analytics</button>

            </Link>

        </div>
        </div>
    );
}

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
        display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px", 
      },
      button: {
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        marginTop: "20px",
       
      },
      Button: {
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        marginTop: "20px",
        justifyContent: "center",
       
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
        background: "#5c8700",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        width: "300px",
        margin: "20px auto",
    },
    };
  

export default ResultPage