  import { Link } from "react-router-dom";
  import { useContext, useEffect, useState } from "react";
  import { ThemeContext } from "../context/ThemeContext";
  import {FaSun, FaMoon} from "react-icons/fa";

  import {Bar, Line } from "react-chartjs-2";
  import { BarElement, CategoryScale, Chart as ChartJS,Legend, LinearScale, Title, Tooltip,  PointElement, LineElement  } from "chart.js";
  ChartJS.register(CategoryScale, LinearScale, BarElement,Title, Tooltip,Legend, PointElement, LineElement )

  // Info Card styling
const infoCardStyle = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  padding: "20px",
  margin: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  width: "250px",
  display: "inline-block",
  marginTop: "20px",
};

// Info Card Titles
const infoCardTitleStyle = {
  fontWeight: "bold",
  fontSize: "1.2rem",
  marginBottom: "10px",
};
  const AnalyticsPage=()=>{
      const { theme, toggleTheme } = useContext(ThemeContext);
      const [monthlyData, setMonthlyData] = useState({labels:[], values:[]});
      const [recipients, setRecipients] = useState([])
      const [periodLabels, setPeriodlabels] = useState([])
      const [periodValues, setPeriodValues] = useState([])
      const [fulizaData, setFulizaData] = useState([])
      const [transactionCost, setTransactionCost] = useState(0)
      const [inactiveDays, setInactiveDays] = useState(0)

      useEffect(()=>{
        fetch("http://127.0.0.1:8000/report")
        .then(response => response.json())
        .then(data => {
          // Monthly transactions
          const monthly = data.user_analytics_page?.monthly_transactions || {};
          const labels = Object.keys(monthly);
          const values = Object.values(monthly);
          setMonthlyData({labels, values});

          // Frequent recipients  
          const frequent_recipient_obj = data.user_analytics_page?.most_frequent_receipients || {};
          const frequent_recipient_list = Object.values(frequent_recipient_obj)
          setRecipients(frequent_recipient_list)

          //transaction periods
          const periodData = data.user_analytics_page?.transaction_periods || {}
          setPeriodlabels(Object.keys(periodData))
          setPeriodValues(Object.values(periodData))

          //fuliza
          const fulizaData = data.user_analytics_page?.fuliza || []
          setFulizaData(fulizaData)
          console.log(fulizaData)

          // transaction Cost
          setTransactionCost(data.user_analytics_page?.total_transaction_cost || 0)
          //inactive days
          setInactiveDays(data.user_analytics_page?.number_of_inactive_days || 0)

        })
        .catch(err => console.log(err))
      },[])

      // Monthly transaction Bar Chart
      const option = {
        responsive: true,
        plugins: {
          legend: { position: "top"},
          title: {
            display: true,
            text: "Your Monthly expenditure"
          },
        },
      };
      const data = {
        labels: monthlyData.labels,
        datasets: [
          {
            label: "Amount spent",
            data: monthlyData.values,
            backgroundColor: "green",        
          },
        ],
      };

      // frequent reciepient table
      function FreqRecipients() {
        return (
        <>
        <h3>Most Frequent Recipient</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Amount (Ksh)</th>
              </tr>
            </thead>
            <tbody>
            {recipients.map((recp, index) => (
                <tr key={index}>
                    <td>{index + 1}</td> 
                    <td>{recp.recipient_name}</td> 
                    <td>{recp.recipient_amount}</td> 
                </tr>
              ))}
            </tbody>
          </table>
        </>
        )
      }

      //transaction period Line graph
      function PeriodLineGraph() {
        const periodLineOptions = {
          responsive: true,
          plugins: {
            legend: {display:false},
            title: {
              display: true,
              text: "Your Year in a Day"
             }
          }
        };
        const periodLineData = {
          labels: periodLabels,
          datasets: [
            {
              label: "Number of transactions",
              data: periodValues,
              fill: false,
              borderColor: "blue",
              tension: 0.3
            }
          ]
        };
        return (
          <>
          <h3>Transaction Periods</h3>
          <Line options={periodLineOptions} data={periodLineData} />
          </>
        );
      }

      // Fuliza
      function FulizaCard({data}) {
        return (
          <div style={infoCardStyle}>
            <h3 style={infoCardTitleStyle}> Fuliza </h3>
            {data && data.amount_borrowed > 0 ? (
                <div>
                    Amount Borrowed: <strong>{data.amount_borrowed} Ksh </strong><br />
                    Interest Paid: <strong>{data.fuliza_fee} Ksh </strong>
                </div>
            ) : (
              <p>You didn’t use Fuliza</p>
            )}
          </div>
        );
      }
      

      //Transaction cost
      function TransactionCostCard({cost}) {
        return (
          <div style={infoCardStyle}>
            <h3 style={infoCardTitleStyle}>Transaction Cost</h3>
            <p><strong>{cost} Ksh</strong></p>
          </div>
        )
      }

      //inactive days
      function InactiveDaysCard({days}){
        return (
          <div style={infoCardStyle}>
            <h3 style={infoCardTitleStyle}>Inactive Days</h3>
            <p><strong>{days} days </strong></p>
          </div>
        )
      }
      return(
  <div style={styles.wrapper}>
          <div style={styles.container}>
            {/* theme toggler */}
            <button 
                      style={styles.toggleButton} 
                      onClick={toggleTheme}
                      title={theme==="light"?"Turn off the light":"Turn on the light"}
                    >
                      {theme === "light" ? <FaMoon size={18}/> :<FaSun size={18}/>}
                    </button>
              <h1>User Analytics Page</h1>

            {/* Bar Chaart */}
            <Bar options={option} data={data} />

            {/* Frequent Recipients table*/}
            <FreqRecipients/>

            {/* Transaction Period Line Graph */}
            <PeriodLineGraph />

            {/* Info cards */}
            <div style={{display: "flex", justifyContent: "center", flexwrap: "wrap"}}>
              <FulizaCard data={fulizaData}/>
              <TransactionCostCard cost={transactionCost} />
              <InactiveDaysCard days={inactiveDays} />
            </div>

            {/* results page button */}
            <Link to="/results">
              <button style={styles.button}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#0056b3";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#007bff";
                e.target.style.transform = "scale(1)";
              }}>Results Page</button>
            
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
        minheight: "100vh",
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
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginTop: "20px",
        
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
      };
    

  export default AnalyticsPage