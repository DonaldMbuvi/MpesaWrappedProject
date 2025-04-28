import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import './styles/resultspage.css';



const ResultPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const financialSummary = {
    totalExpenditure: 200,
    topCategory: "Groceries",
    lastMonthSpending: 150,
  };

  const handleDownload = () => {
    const resultSection = document.getElementById("result-section");
    html2canvas(resultSection).then((canvas) => {
      const link = document.createElement("a");
      link.download = "financial-report.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out my financial report!`;
    let shareUrl = "";

    if (platform === "whatsapp") {
      shareUrl = `https://wa.me/?text=${text} ${url}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${text} ${url}`;
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    }

    window.open(shareUrl, "_blank");
  };

  return (
    <div className="result-container">
      <button
        className="toggle-button"
        onClick={toggleTheme}
        title={theme === "light" ? "Turn off the light" : "Turn on the light"}
      >
        {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
      </button>
      <h1>Results Page</h1>

      <div id="result-section" className="result-card">
        <h2>Summary</h2>
        <p>
          <strong>Total Expenditure: </strong>ksh {financialSummary.totalExpenditure}
        </p>
        <p>
          <strong>Top Category: </strong>{financialSummary.topCategory}
        </p>
        <p>
          <strong>Last Month's Spending: </strong>ksh {financialSummary.lastMonthSpending}
        </p>

        <div className="buttons-container">
          {/* Social Media Share Buttons */}
          <button
            className="social-button"
            onClick={() => handleShare("whatsapp")}
          >
            Share on WhatsApp
          </button>
          <button
            className="social-button"
            onClick={() => handleShare("twitter")}
          >
            Share on Twitter
          </button>
          <button
            className="social-button"
            onClick={() => handleShare("facebook")}
          >
            Share on Facebook
          </button>

          {/* Download Button */}
          <button className="button" onClick={handleDownload}>
            Download Report
          </button>
        </div>
      </div>

      <Link to="/main">
        <button className="link-button">
          Back to Main Page
        </button>
      </Link>

      <Link to="/analytics">
        <button className="link-button">
          View More Analytics
        </button>
      </Link>
    </div>
  );
};

export default ResultPage;
