// First, install the required packages
// npm install html2canvas jspdf

import { Link } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon, FaExchangeAlt, FaChartLine, FaUserFriends, FaClock, FaRegCreditCard, FaDownload } from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";
import { 
  BarElement, 
  CategoryScale, 
  Chart as ChartJS,
  Legend, 
  LinearScale, 
  Title, 
  Tooltip, 
  PointElement, 
  LineElement,
  Filler
} from "chart.js";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "./styles/AnalyticsPage.css";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement,
  Title, 
  Tooltip,
  Legend, 
  PointElement, 
  LineElement,
  Filler
);

const AnalyticsPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showAmountIn, setShowAmountIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [monthlyData, setMonthlyData] = useState({
    spent: {labels: [], values: [], rawData: {}},
    received: {labels: [], values: [], rawData: {}}
  });
  const [most_Frecipients, setMost_Frecipients] = useState([]);
  const [top_Arecipients, setTop_Arecipients] = useState([]);
  const [periodLabels, setPeriodlabels] = useState([]);
  const [periodValues, setPeriodValues] = useState([]);
  const [fulizaData, setFulizaData] = useState([]);
  const [transactionCost, setTransactionCost] = useState(0);
  const [inactiveDays, setInactiveDays] = useState(0);
  const [mshwariData, setMshwariData] = useState({});
  const [airtime_and_bundles, setAirtimeB] = useState(0);
  // const [userName, setUserName] = useState('');
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const user_id = localStorage.getItem('user_id');
        const params = new URLSearchParams();
        params.append('user_id', user_id);
        
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const baseUrl = isLocal 
            ? "http://127.0.0.1:8000" 
            : "https://mpesawrappedproject-backend-prod.onrender.com";
        const url = `${baseUrl}/report?${params.toString()}`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Get user name if available
        //setUserName(data.user_analytics_page?.user_name || 'User');
        
        // Monthly transactions (spent)
        const monthlySpent = data.user_analytics_page?.monthly_transactions || {};
        setMonthlyData(prev => ({
          ...prev,
          spent: {
            rawData: monthlySpent,
            labels: Object.keys(monthlySpent),
            values: Object.values(monthlySpent)
          }
        }));

        // Monthly received
        const monthlyReceived = data.user_analytics_page?.monthly_deposits || {};
        setMonthlyData(prev => ({
          ...prev,
          received: {
            rawData: monthlyReceived,
            labels: Object.keys(monthlyReceived),
            values: Object.values(monthlyReceived)
          }
        }));

        // Frequent recipients  
        const frequent_recipient_obj = data.user_analytics_page?.most_frequent_recepients || {};
        const frequent_recipient_list = Object.values(frequent_recipient_obj);
        setMost_Frecipients(frequent_recipient_list);

        // Top recipients  
        const top_recipient_obj = data.user_analytics_page?.top_recepients || {};
        const top_recipient_list = Object.values(top_recipient_obj);
        setTop_Arecipients(top_recipient_list);

        // Transaction periods
        const periodData = data.user_analytics_page?.transaction_periods || {};
        setPeriodlabels(Object.keys(periodData));
        setPeriodValues(Object.values(periodData));

        // Fuliza
        const fulizaData = data.user_analytics_page?.fuliza || [];
        setFulizaData(fulizaData);

        // Transaction Cost
        setTransactionCost(data.user_analytics_page?.total_transaction_cost || 0);
        
        // Inactive days
        setInactiveDays(data.user_analytics_page?.number_of_inactive_days || 0);
        
        // M-shwari
        const mshwariData = data.user_analytics_page?.mshwari || { amount_in: 0, amount_out: 0 };
        setMshwariData(mshwariData);
        
        // Airtime
        const airtime = data.user_analytics_page?.airtime_and_bundles || 0;
        setAirtimeB(airtime);
      } catch (err) {
        console.log("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to generate and download the PDF report
  const downloadReport = async () => {
    if (!reportRef.current) return;
    
    try {
      setIsDownloading(true);
      
      // Configure PDF settings
      const reportTitle = `M-Pesa Financial Report`;
      const reportDate = new Date().toLocaleDateString();
      const fileName = `mpesa-financial-report-${reportDate.replace(/\//g, '-')}.pdf`;
      
      // Create a new PDF document with A4 size
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add report title and date
      pdf.setFontSize(20);
      pdf.setTextColor(46, 204, 113); // Match theme color
      pdf.text(reportTitle, pdfWidth / 2, 15, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on ${reportDate}`, pdfWidth / 2, 22, { align: 'center' });
      
      // Add separator line
      pdf.setDrawColor(220, 220, 220);
      pdf.line(20, 25, pdfWidth - 20, 25);
      
      // Convert HTML content to canvas
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff'
      });
      
      // Calculate dimensions to fit in PDF
      const imgWidth = pdfWidth - 40; // Margins on both sides
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add content to PDF (possibly over multiple pages)
      let heightLeft = imgHeight;
      let position = 30; // Starting position after title
      let pageHeight = pdfHeight - 40; // Account for margins
      
      // Add first page image section
      pdf.addImage(
        canvas, 
        'PNG', 
        20, // x position
        position, // y position
        imgWidth,
        Math.min(pageHeight, imgHeight)
      );
      
      heightLeft -= pageHeight;
      
      // Add additional pages if content overflows
      while (heightLeft > 0) {
        position = 20; // Reset position for new page
        pdf.addPage();
        
        pdf.addImage(
          canvas,
          'PNG',
          20, // x position
          position - pageHeight * (imgHeight - heightLeft) / imgHeight, // Y position adjustment
          imgWidth,
          imgHeight
        );
        
        heightLeft -= pageHeight;
      }
      
      // Add footer with page numbers
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${i} of ${totalPages}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      }
      
      // Save the PDF
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  function orderMonthlyData(rawData) {
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    const orderedLabels = [];
    const orderedValues = [];
  
    monthOrder.forEach(month => {
      if (rawData[month] !== undefined) {
        orderedLabels.push(month);
        orderedValues.push(rawData[month]);
      }
    });
  
    return { labels: orderedLabels, values: orderedValues };
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: showAmountIn ? "Your Monthly Income" : "Your Monthly Expenditure",
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: showAmountIn ? 'Amount Received (Ksh)' : 'Amount Spent (Ksh)',
          font: {
            weight: 'bold'
          }
        },
        beginAtZero: true
      }
    }
  };

  const currentData = showAmountIn ? monthlyData.received : monthlyData.spent;
  const orderedMonthlyData = orderMonthlyData(currentData.rawData);

  const barChartData = {
    labels: orderedMonthlyData.labels,
    datasets: [
      {
        label: showAmountIn ? "Amount received" : "Amount spent",
        data: orderedMonthlyData.values,
        backgroundColor: showAmountIn ? "rgba(46, 204, 113, 0.7)" : "rgba(46, 204, 113, 0.7)",
        borderColor: showAmountIn ? "rgba(46, 204, 113, 1)" : "rgba(46, 204, 113, 0.7)",
        borderWidth: 1,
        borderRadius: 5
      },
    ],
  };

  function FreqRecipients() {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="section-header">
            <FaUserFriends className="section-icon" />
            Most Frequent Recipients
          </h3>
        </div>
        <div className="table-responsive">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Amount (Ksh)</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {most_Frecipients.length > 0 ? (
                most_Frecipients.map((recp, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td> 
                    <td>{recp.recipient_name}</td> 
                    <td>{recp.recipient_amount.toLocaleString()}</td> 
                    <td>{recp.frequency}</td> 
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">No recipient data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function TopARecipients() {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="section-header">
            <FaChartLine className="section-icon" />
            Top Recipients by Amount
          </h3>
        </div>
        <div className="table-responsive">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Amount (Ksh)</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {top_Arecipients.length > 0 ? (
                top_Arecipients.map((recp, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td> 
                    <td>{recp.recipient_name}</td> 
                    <td>{recp.recipient_amount.toLocaleString()}</td> 
                    <td>{recp.frequency}</td> 
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">No recipient data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function PeriodLineGraph() {
    const chronologicalPeriods = [
      "early_morning",
      "morning",
      "afternoon",
      "evening",
      "late_night"
    ];
  
    const periodLabelsDisplay = {
      "early_morning": "Early Morning",
      "morning": "Morning",
      "afternoon": "Afternoon",
      "evening": "Evening",
      "late_night": "Late Night"
    };
  
    const orderedLabels = chronologicalPeriods.map(period => periodLabelsDisplay[period]);
  
    const periodMap = {};
    periodLabels.forEach((label, index) => {
      periodMap[label] = periodValues[index];
    });
  
    const orderedValues = chronologicalPeriods.map(period => 
      periodMap[period] || 0
    );
  
    const periodLineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {display: false},
        title: {
          display: true,
          text: "Your Day in Transactions",
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time of Day',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          title: {
            display: true,
            text: 'Number of Transactions',
            font: {
              weight: 'bold'
            }
          },
          beginAtZero: true
        }
      }
    };
  
    const periodLineData = {
      labels: orderedLabels,
      datasets: [
        {
          label: "Number of transactions",
          data: orderedValues,
          fill: true,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          pointBackgroundColor: "rgba(75, 192, 192, 1)",
          pointBorderColor: "#fff",
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="section-header">
            <FaClock className="section-icon" />
            Daily Transaction Patterns
          </h3>
        </div>
        <div className="chart-wrapper">
          <Line options={periodLineOptions} data={periodLineData} height={300} />
        </div>
      </div>
    );
  }

  function FulizaCard({data}) {
    return (
      <div className="info-card fuliza-card">
        <div className="info-card-header">
          <h3 className="info-card-title">Fuliza</h3>
          <FaRegCreditCard className="info-card-icon" />
        </div>
        <div className="info-card-content">
          {data && data.amount_borrowed > 0 ? (
            <div>
              <div className="info-card-metric">
                <span className="metric-label">Amount Borrowed:</span>
                <span className="metric-value">{data.amount_borrowed.toLocaleString()} Ksh</span>
              </div>
              <div className="info-card-metric">
                <span className="metric-label">Interest Paid:</span>
                <span className="metric-value">{data.fuliza_fee.toLocaleString()} Ksh</span>
              </div>
            </div>
          ) : (
            <p className="no-data-message">You didn't use Fuliza</p>
          )}
        </div>
      </div>
    );
  }

  function TransactionCostCard({cost}) {
    return (
      <div className="info-card transaction-cost-card">
        <div className="info-card-header">
          <h3 className="info-card-title">Transaction Cost</h3>
          <FaRegCreditCard className="info-card-icon" />
        </div>
        <div className="info-card-content">
          <div className="info-card-metric centered">
            <span className="metric-value highlight">{cost.toLocaleString()} Ksh</span>
          </div>
        </div>
      </div>
    );
  }

  function InactiveDaysCard({days}){
    return (
      <div className="info-card inactive-days-card">
        <div className="info-card-header">
          <h3 className="info-card-title">Inactive Days</h3>
          <FaClock className="info-card-icon" />
        </div>
        <div className="info-card-content">
          { days && days > 0 ? (
            <div className="info-card-metric centered">
              <span className="metric-value highlight">{days} {days === 1 ? 'day' : 'days'}</span>
            </div>
          ) : (
            <p className="no-data-message">You used M-pesa every day</p>
          )}
        </div>
      </div>
    );
  }

  function MshwariCard({mshwari}){
    return (
      <div className="info-card mshwari-card">
        <div className="info-card-header">
          <h3 className="info-card-title">M-Shwari</h3>
          <FaExchangeAlt className="info-card-icon" />
        </div>
        <div className="info-card-content">
          <div className="info-card-metric">
            <span className="metric-label">Invested:</span>
            <span className="metric-value">{mshwari.amount_in?.toLocaleString() || 0} Ksh</span>
          </div>
          <div className="info-card-metric">
            <span className="metric-label">Withdrew:</span>
            <span className="metric-value">{mshwari.amount_out?.toLocaleString() || 0} Ksh</span>
          </div>
        </div>
      </div>
    );
  }

  function AirtimeBCard({airtimeB}){
    return (
      <div className="info-card airtime-card">
        <div className="info-card-header">
          <h3 className="info-card-title">Airtime & Bundles</h3>
          <FaRegCreditCard className="info-card-icon" />
        </div>
        <div className="info-card-content">
          <div className="info-card-metric centered">
            <span className="metric-value highlight">{airtimeB.toLocaleString()} Ksh</span>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`analytics-container ${theme === 'dark' ? 'dark-theme' : ''}`}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return(
    <div className={`analytics-container ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <div className="analytics-header">
        <h1 className="analytics-title">Financial Analytics Dashboard</h1>
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <FaMoon size={20}/> : <FaSun size={20}/>}
        </button>
      </div>



      {/* Main content to be captured in PDF */}
      <div ref={reportRef}>
        <div className="combo">
          <div className="chart-container">
            <div className="chart-header">
              <h3 className="section-header">
                <FaChartLine className="section-icon" />
                Monthly Financial Activity
              </h3>
              <button 
                onClick={() => setShowAmountIn(!showAmountIn)}
                className="data-toggle"
                aria-label={showAmountIn ? "Show spending data" : "Show income data"}
              >
                <FaExchangeAlt size={12} />
                {showAmountIn ? 'Show Expenses' : 'Show Income'}
              </button>
            </div>
            <div className="bar-chart">
              <Bar options={barChartOptions} data={barChartData} height={300} />
            </div>
          </div>
          <div className="chart-wrapper">
            <PeriodLineGraph />
          </div>
        </div>

        <div className="info-cards-container">
          <FulizaCard data={fulizaData}/>
          <TransactionCostCard cost={transactionCost} />
          <InactiveDaysCard days={inactiveDays} />
          <MshwariCard mshwari={mshwariData} />
          <AirtimeBCard airtimeB={airtime_and_bundles} />
        </div>

        <div className="analytics-grid">
          <FreqRecipients/>
          <TopARecipients/>
        </div>
      </div>

      <div className="nav-buttons">
        <Link to="/results" className="nav-button">
          Back to wrapped
        </Link>
        <button 
          className="nav-button primary"
          onClick={downloadReport}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <div className="button-spinner"></div>
              Generating PDF...
            </>
          ) : (
            <>
              <FaDownload style={{ marginRight: '8px' }} />
              Download Report
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AnalyticsPage;