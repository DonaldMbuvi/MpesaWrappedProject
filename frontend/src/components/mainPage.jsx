import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";
import { useState, useRef, useContext } from "react";
import { Link ,useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const MainPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Preparing document for analysis");
  const [pin, setPin] = useState("");
  const [showPinField, setShowPinField] = useState(false);
  const fileInputRef = useRef(null);
  const [showPin, setShowPin] = useState(false);
  const [funFacts, setFunFacts] = useState([]);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const navigate = useNavigate();

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };
  const generateUserId = (fileName, fileSize, pin = '') => {
    // Create a combined string 
    const combinedString = `${fileName}-${fileSize}-${pin}`;
    
    // Simple hash function to create a unique-ish ID
    let hash = 0;
    for (let i = 0; i < combinedString.length; i++) {
      const char = combinedString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now();
    const user_id= (`${Math.abs(hash)}-${timestamp}`)
    localStorage.setItem('user_id', user_id);
    return user_id;
  };
  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (files.length > 1) {
      setErrorMessage("Please upload only one file at a time");
      return;
    }

    const file = files[0];
    
    // Validate file type
    if (file.type !== "application/pdf") {
      setErrorMessage("Please upload a PDF file");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size should be less than 10MB");
      return;
    }

    // Valid file selected
    setSelectedFile(file);
    setShowPinField(true); // Show PIN field when file is selected
    setErrorMessage("");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file first");
      return;
    }
  
    setIsLoading(true);
    const userId = generateUserId(selectedFile.name, selectedFile.size, pin || '');
    const cleanupSimulation = simulateAnalysis();
  
    try {
      const formData = new FormData();
      // These names MUST match your backend parameters exactly
      formData.append('pdf_file', selectedFile);  // Must be 'pdf_file'
      formData.append('user_id', userId);        // Must be 'user_id'
      if (pin) formData.append('pin', pin);      // Optional 'pin'
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const baseUrl = isLocal 
        ? "http://127.0.0.1:8000" 
        : "https://mpesawrappedproject-backend-prod.onrender.com";
      // Important: Don't set Content-Type header manually!
      const response = await fetch(`${baseUrl}/upload-pdf/`, {
        method: 'POST',
        body: formData,
        // Let browser set headers automatically
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Analysis failed");
      }
  
      const result = await response.json();
      
      // Complete the simulation
      if (progress < 100) {
        updateProgress(100, "Analysis complete!");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
  
      navigate('/results', {
        state: {
          analysisData: result,
          fileName: selectedFile.name,
          userId: userId
        }
      });
  
    } catch (error) {
      setErrorMessage(error.message || "Failed to analyze the statement");
      setIsLoading(false);
    } finally {
      cleanupSimulation();
    }
  };
  
  const simulateAnalysis = () => {
    // Start showing facts
    const facts = [...mpesaFacts, ...financialTips];
    setFunFacts(facts);
    
    // Rotate through facts every 5 seconds
    const factInterval = setInterval(() => {
      setCurrentFactIndex(prev => (prev + 1) % facts.length);
    }, 5000);
  
    // Simulate progress updates
    updateProgress(10, "Extracting text from PDF...");
    const progressStages = [
      { percent: 30, message: "Processing transaction data..." },
      { percent: 60, message: "Categorizing transactions..." },
      { percent: 85, message: "Generating insights..." },
      { percent: 95, message: "Finalizing results..." }
    ];
  
    const timeouts = [];
    let delay = 1000; // Start with 1 second delay
    
    progressStages.forEach(stage => {
      timeouts.push(
        setTimeout(() => {
          updateProgress(stage.percent, stage.message);
        }, delay)
      );
      delay += 1500 + Math.random() * 1000; // Add 1.5-2.5s between stages
    });
  
    // Return cleanup function
    return () => {
      clearInterval(factInterval);
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  };
  const updateProgress = (percent, message) => {
    setProgress(percent);
    setStatusMessage(message);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handlePinChange = (e) => {
    setPin(e.target.value);
  };

  //fun facts
  const mpesaFacts = [
    "M-Pesa was launched in 2007 by Safaricom in Kenya and has since expanded to several countries.",
    "Over 50% of Kenya's GDP flows through M-Pesa each year.",
    "M-Pesa has over 50 million active users across Africa.",
    "The name 'M-Pesa' comes from 'M' for mobile and 'Pesa' which means money in Swahili.",
    "M-Pesa processes over 1.7 billion transactions per year.",
    "M-Pesa helped Kenya become a world leader in mobile money adoption.",
    "You can use M-Pesa to pay for utilities, school fees, and even loans.",
    "M-Pesa agents outnumber ATMs in Kenya by more than 10 to 1."
  ];
  
  const financialTips = [
    "Saving just 10% of your income can build significant wealth over time.",
    "The average millionaire has 7 streams of income.",
    "Small daily expenses (like buying tea) can add up to large amounts annually.",
    "Budgeting helps 80% of people reduce their spending habits.",
    "Investing early gives your money more time to grow through compound interest.",
    "Paying yourself first (saving before spending) is a key wealth-building habit.",
    "Tracking your spending is the first step to better financial management.",
    "Emergency funds should cover 3-6 months of living expenses."
  ];
  return (
    <div style={styles.wrapper}>
      {/* Back button positioned top-left */}
      <Link to="/landing">
        <button
          style={styles.backButton}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#39b54c";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#39b54a";
            e.target.style.transform = "scale(1)";
          }}
        >
          Back to Intro Page
        </button>
      </Link>

      {/* Theme toggle button remains top-right */}
      <button 
        style={styles.toggleButton} 
        onClick={toggleTheme}
        title={theme === "light" ? "Turn off the light" : "Turn on the light"}
      >
        {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
      </button>

      <div style={styles.container}>
        <h1 style={{ color: '#39b54a' }}>M-Pesa Statement Analyzer</h1>
        <p>Upload your M-Pesa statement to analyze your spending habits</p>
        
        <div 
          style={{
            ...styles.uploadContainer,
            borderColor: isDragging ? "#00a651" : "#ccc",
            backgroundColor: isDragging ? "#e8f5e9" : "white"
          }}
          id="dropArea"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div style={styles.uploadIcon}>📄</div>
          <h3>Drag & Drop your M-Pesa statement here</h3>
          <p>or</p>
          <input 
            type="file" 
            id="fileInput" 
            style={styles.fileInput} 
            accept=".pdf"
            onChange={handleFileInput}
            ref={fileInputRef}
          />
          <button style={styles.browseButton} onClick={triggerFileInput}>
            Browse Files
          </button>
          <div style={styles.supportedFormats}>Supported format: PDF</div>
        </div>
        
        {selectedFile && (
          <div style={styles.fileInfo}>
            <strong>Selected file:</strong> {selectedFile.name}<br />
            <small>Size: {formatFileSize(selectedFile.size)}</small>
          </div>
        )}
        
        {showPinField && (
        <div style={styles.pinContainer}>
          <label htmlFor="pinInput" style={styles.pinLabel}>
            Enter your M-Pesa PIN (optional - only needed for encrypted statements):
          </label>
          <div style={styles.pinInputWrapper}>
            <input
              type={showPin ? "text" : "password"}
              id="pinInput"
              value={pin}
              onChange={handlePinChange}
              style={styles.pinInput}
              placeholder="Leave blank if from M-Pesa App"
              maxLength="4"
            />
            <button 
              type="button" 
              style={styles.showPinButton}
              onClick={() => setShowPin(!showPin)}
              title={showPin ? "Hide PIN" : "Show PIN"}
            >
              {showPin ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
      )}
        
        {errorMessage && (
          <div style={styles.errorMessage}>{errorMessage}</div>
        )}
        
        <button 
          style={{
            ...styles.analyzeButton,
            backgroundColor: selectedFile ? "#00a651" : "#cccccc",
            color: selectedFile ? "white" : "#666666",
            cursor: selectedFile ? "pointer" : "not-allowed"
          }}
          id="analyzeBtn"
          disabled={!selectedFile}
          onClick={handleAnalyze}
        >
          Analyze Statement
        </button>
      </div>

      {isLoading && (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
        <h2>Analyzing your M-Pesa statement...</h2>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progress, width: `${progress}%` }}></div>
        </div>
        <div style={styles.statusMessage}>{statusMessage}</div>
        
        <div style={styles.factsContainer}>
          <div style={styles.factCard}>
            <h2 style={styles.factTitle}>Did You Know?</h2>
            <p style={styles.factText}>{funFacts[currentFactIndex]}</p>
          </div>
        </div>
      </div>
    )}

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
    minHeight: "100vh",
    width: "100vw",
    padding: "20px",
    boxSizing: "border-box",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5f7fa",
    color: "#333",
  },
  container: {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "600px",
    padding: "30px",
    textAlign: "center",
    marginTop: "50px", // Added to account for the top buttons
  },
  backButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#39b54a",
    color: "white",
    border: "none",
    borderRadius: "5px",
    transition: "all 0.3s ease-in-out",
    position: "absolute",
    top: "90px",
    left: "20px",
    zIndex: 10,
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
    zIndex: 10,
  },
  uploadContainer: {
    border: "2px dashed #ccc",
    borderRadius: "8px",
    padding: "40px 20px",
    margin: "20px 0",
    transition: "all 0.3s",
    cursor: "pointer",
    position: "relative",
  },
  uploadIcon: {
    fontSize: "48px",
    color: "#00a651",
    marginBottom: "15px",
  },
  fileInput: {
    display: "none",
  },
  browseButton: {
    backgroundColor: "#00a651",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    transition: "background-color 0.3s",
    marginTop: "15px",
  },
  analyzeButton: {
    backgroundColor: "#00a651",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "500",
    transition: "background-color 0.3s",
    marginTop: "15px",
  },
  fileInfo: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#666",
  },
  pinContainer: {
    margin: "15px 0",
    textAlign: "left",
  },
  pinLabel: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#666",
  },
  pinInputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  pinInput: {
    width: "100%",
    padding: "10px",
    paddingRight: "40px", // Make space for the button
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  showPinButton: {
    position: "absolute",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "5px",
  },
  errorMessage: {
    color: "#dc3545",
    marginTop: "15px",
  },
  supportedFormats: {
    fontSize: "12px",
    color: "#6c757d",
    marginTop: "10px",
  },
  loadingScreen: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #00a651",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  progressBar: {
    width: "80%",
    maxWidth: "300px",
    height: "10px",
    backgroundColor: "#e0e0e0",
    borderRadius: "5px",
    marginTop: "20px",
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#00a651",
    transition: "width 0.3s",
  },
  statusMessage: {
    marginTop: "15px",
    fontWeight: "500",
  },
  bottomContainer: {
    position: "absolute",
    bottom: "20px",
  },
  factsContainer: {
    width: "80%",
    maxWidth: "500px",
    marginTop: "30px",
  },
  factCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    minHeight: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  factTitle: {
    color: "#00a651",
    marginTop: "0",
    marginBottom: "15px",
  },
  factText: {
    fontSize: "20px",
    lineHeight: "1.5",
    margin: "0",
  },
};

export default MainPage;
