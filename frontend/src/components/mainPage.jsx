import { useState, useRef, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
const MainPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Preparing document for analysis");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Facts data
  const facts = [
    "Over 1.4 billion adults lack access to formal banking services",
    "M-Pesa handles 90% of Kenya's GDP through mobile transactions",
    "70% of people struggle to maintain consistent budgets",
    "Digital payments are now used by half the global population",
    "M-Pesa users save 30+ minutes daily on financial transactions",
    "Financial literacy rates are below 35% globally",
    "30 million+ Kenyans use M-Pesa daily for payments"
  ];

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Generate user ID function from your code
  const generateUserId = (fileName, fileSize, pin = '') => {
    const combinedString = `${fileName}-${fileSize}-${pin}`;
    let hash = 0;
    for (let i = 0; i < combinedString.length; i++) {
      const char = combinedString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    const timestamp = Date.now();
    const user_id = (`${Math.abs(hash)}-${timestamp}`);
    localStorage.setItem('user_id', user_id);
    return user_id;
  };

  // Drag and drop handlers
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

  // File handling
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
    
    if (file.type !== "application/pdf") {
      setErrorMessage("Please upload a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size should be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setErrorMessage("");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handlePinChange = (e) => {
    setPin(e.target.value);
  };

  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  // Analysis functions from your code
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
      formData.append('pdf_file', selectedFile);
      formData.append('user_id', userId);
      if (pin) formData.append('pin', pin);
      
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const baseUrl = isLocal 
        ? "http://127.0.0.1:8000" 
        : "https://mpesawrappedproject-backend-prod.onrender.com";
      
      const response = await fetch(`${baseUrl}/upload-pdf/`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Analysis failed");
      }
  
      const result = await response.json();
      
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
    let delay = 1000;
    
    progressStages.forEach(stage => {
      timeouts.push(
        setTimeout(() => {
          updateProgress(stage.percent, stage.message);
        }, delay)
      );
      delay += 1500 + Math.random() * 1000;
    });
  
    return () => {
      clearInterval(factInterval);
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  };

  const updateProgress = (percent, message) => {
    setProgress(percent);
    setStatusMessage(message);
  };

  // Responsive styles based on window width
  const getResponsiveStyles = () => {
    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1024;
    
    return {
      wrapper: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        padding: isMobile ? "10px" : "20px",
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f5f7fa",
        color: "#333",
        background: "linear-gradient(135deg, #F8FCF8 0%, #D8EDD8 100%)",

      },
      container: {
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        width: isMobile ? "95%" : isTablet ? "85%" : "90%",
        maxWidth: "600px",
        padding: isMobile ? "15px" : "30px",
        textAlign: "center",
        marginBottom: "0",
      },
      title: {
        color: '#39b54a',
        fontSize: isMobile ? "1.5rem" : "2rem",
        margin: isMobile ? "0.5rem 0" : "1rem 0",
      },
      description: {
        fontSize: isMobile ? "0.9rem" : "1rem",
        marginBottom: isMobile ? "0.5rem" : "1rem",
      },
      backButton: {
        padding: isMobile ? "8px 16px" : "10px 20px",
        fontSize: isMobile ? "14px" : "16px",
        cursor: "pointer",
        backgroundColor: "#39b54a",
        color: "white",
        border: "none",
        borderRadius: "5px",
        transition: "all 0.3s ease-in-out",
        marginTop: "20px",
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
        padding: isMobile ? "20px 10px" : "40px 20px",
        margin: "20px 0",
        transition: "all 0.3s",
        cursor: "pointer",
        position: "relative",
        backgroundColor: isDragging ? "#e8f5e9" : "white",
        borderColor: isDragging ? "#00a651" : "#ccc",
      },
      uploadIcon: {
        fontSize: isMobile ? "36px" : "48px",
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
        padding: isMobile ? "10px 20px" : "12px 24px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: isMobile ? "14px" : "16px",
        fontWeight: "500",
        transition: "background-color 0.3s",
        marginTop: "15px",
      },
      analyzeButton: {
        backgroundColor: selectedFile ? "#00a651" : "#cccccc",
        color: selectedFile ? "white" : "#666666",
        border: "none",
        padding: isMobile ? "10px 20px" : "12px 24px",
        borderRadius: "5px",
        fontSize: isMobile ? "14px" : "16px",
        fontWeight: "500",
        transition: "background-color 0.3s",
        marginTop: "15px",
        cursor: selectedFile ? "pointer" : "not-allowed",
        width: isMobile ? "100%" : "auto",
      },
      fileInfo: {
        marginTop: "15px",
        fontSize: isMobile ? "12px" : "14px",
        color: "#666",
      },
      pinContainer: {
        width: "100%",
        maxWidth: isMobile ? "100%" : "400px",
        textAlign: "left",
        margin: isMobile ? "10px 0" : "15px 0",
      },
      pinLabel: {
        display: "block",
        marginBottom: "0.5rem",
        color: "#666",
        fontSize: isMobile ? "0.8rem" : "0.9rem",
      },
      pinInputWrapper: {
        position: "relative",
        width: "100%",
      },
      pinInput: {
        width: "100%",
        padding: isMobile ? "0.6rem" : "0.8rem",
        paddingRight: "3rem",
        border: "1px solid #ddd",
        borderRadius: "0.5rem",
        fontSize: isMobile ? "0.9rem" : "1rem",
        boxSizing: "border-box",
      },
      showPinButton: {
        position: "absolute",
        right: "0.5rem",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: isMobile ? "1rem" : "1.2rem",
      },
      errorMessage: {
        color: "#dc3545",
        marginTop: "1rem",
        fontSize: isMobile ? "0.8rem" : "0.9rem",
      },
      supportedFormats: {
        fontSize: isMobile ? "10px" : "12px",
        color: "#6c757d",
        marginTop: "10px",
      },
      loadingScreen: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: isMobile ? "2rem" : "3rem",
        zIndex: 1000,
        padding: isMobile ? "15px" : "20px",
        boxSizing: "border-box",
      },
      progressContainer: {
        position: "relative",
        width: isMobile ? "150px" : "200px",
        height: isMobile ? "150px" : "200px",
      },
      progressText: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: isMobile ? "22px" : "28px",
        fontWeight: "700",
        color: "#00A651",
      },
      statusMessage: {
        marginTop: "1rem",
        fontWeight: "500",
        color: "#333",
        fontSize: isMobile ? "0.9rem" : "1rem",
        textAlign: "center",
      },
      factCard: {
        backgroundColor: "rgb(207, 255, 230)",
        borderRadius: "1rem",
        padding: isMobile ? "1rem" : "1.5rem",
        maxWidth: isMobile ? "90%" : "500px",
        textAlign: "center",
        borderLeft: "4px solid #00A651",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
      factTitle: {
        fontWeight: "700",
        marginBottom: "0.5rem",
        color: "#00A651",
        fontSize: isMobile ? "0.9rem" : "1rem",
      },
      factContent: {
        fontSize: isMobile ? "0.9rem" : "1.1rem",
        lineHeight: "1.6",
        color: "#333",
      },
      fileName: {
        fontSize: isMobile ? "1rem" : "1.2rem",
        wordBreak: "break-word",
      },
      fileSize: {
        fontSize: isMobile ? "0.8rem" : "0.9rem",
      },
      decorativeTriangle: {
        position: 'absolute',
        bottom: '0',
        right: "0",
        width: "45%",
        height: "45%",
        zIndex: "1",
        opacity:"0.6",
      }
    };
  };

  const styles = getResponsiveStyles();

  return (
    <div style={styles.wrapper}>
      {/* Theme toggle button */}
      <button 
        style={styles.toggleButton} 
        onClick={toggleTheme}
        title={theme === "light" ? "Turn off the light" : "Turn on the light"}
      >
        {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
      </button>

      <div style={styles.container}>
        <h1 style={styles.title}>M-Pesa Statement Analyzer</h1>
        <p style={styles.description}>
          Upload your M-Pesa statement to analyze your spending patterns and gain financial insights
        </p>
        
        <div 
          style={styles.uploadContainer}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <>
              <div style={styles.uploadIcon}>✅</div>
              <h3 style={styles.fileName}>{selectedFile.name}</h3>
              <p style={styles.fileSize}>{formatFileSize(selectedFile.size)}</p>
            </>
          ) : (
            <>
              <div style={styles.uploadIcon}>📊</div>
              <h3>Drag & Drop Statement PDF</h3>
              <p style={styles.supportedFormats}>or select file manually</p>
            </>
          )}
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
        </div>
        
        {selectedFile && (
          <div style={styles.pinContainer}>
            <label style={styles.pinLabel}>
              Enter <b>Statement CODE</b> (sent by SAFARICOM via sms):
            </label>
            <div style={styles.pinInputWrapper}>
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={handlePinChange}
                style={styles.pinInput}
                placeholder="Leave blank if from M-Pesa App"
                maxLength="6"
              />
              <button 
                type="button" 
                style={styles.showPinButton}
                onClick={togglePinVisibility}
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
          style={styles.analyzeButton}
          disabled={!selectedFile}
          onClick={handleAnalyze}
        >
          Analyze Statement
        </button>
      </div>
      {/* Back button */}
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
          Back
        </button>
      </Link>
      {isLoading && (
        <div style={styles.loadingScreen}>
          <h2 style={styles.title}>Analyzing your M-Pesa statement...</h2>
          
          <div style={styles.progressContainer}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="#e0e0e0" strokeWidth="6" fill="transparent"/>
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                stroke="#00A651" 
                strokeWidth="6" 
                fill="transparent"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div style={styles.progressText}>{Math.round(progress)}%</div>
          </div>
          
          <div style={styles.statusMessage}>{statusMessage}</div>
          
          <div style={styles.factCard}>
            <div style={styles.factTitle}>Did You Know? 💡</div>
            <div style={styles.factContent}>{facts[currentFactIndex]}</div>
          </div>
        </div>
      )}
      <svg 
        style={styles.decorativeTriangle} 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <polygon points="0,100 100,0 100,100"
        fill= "#4169E1"
        />
      </svg>
    </div>
  );
};

export default MainPage;