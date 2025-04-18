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
      const [showAmountIn, setShowAmountIn] = useState(false);
      const [monthlyData, setMonthlyData] = useState({
        spent: {labels: [], values: [], rawData: {}},
        received: {labels: [], values: [], rawData: {}} // Add this for amount in
      });
      const [most_Frecipients, setMost_Frecipients] = useState([])
      const [top_Arecipients, setTop_Arecipients] = useState([])
      const [periodLabels, setPeriodlabels] = useState([])
      const [periodValues, setPeriodValues] = useState([])
      const [fulizaData, setFulizaData] = useState([])
      const [transactionCost, setTransactionCost] = useState(0)
      const [inactiveDays, setInactiveDays] = useState(0)
      const [mshwariData, setMshwariData] = useState([])
      const [airtime_and_bundles, setAirtimeB] = useState(0)

      useEffect(()=>{
          const params = new URLSearchParams();
          params.append('user_name', 'Bruce kola');
          
          const url = `http://127.0.0.1:8000/report?${params.toString()}`;
          console.log("Requesting URL:", url);
          
          fetch(url)
        .then(response => response.json())
        .then(data => {
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
          const frequent_recipient_list = Object.values(frequent_recipient_obj)
          setMost_Frecipients(frequent_recipient_list)

          // Top recipients  
          const top_recipient_obj = data.user_analytics_page?.top_recepients || {};
          const top_recipient_list = Object.values(top_recipient_obj)
          setTop_Arecipients(top_recipient_list)

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
          // M-shwari
          const mshwariData = data.user_analytics_page?.mshwari || { amount_in: 0, amount_out: 0 };
          setMshwariData(mshwariData)
          // Airtime
          const airtime = data.user_analytics_page?.airtime_and_bundles || 0;
          setAirtimeB(airtime)
        })
        .catch(err => console.log(err))
      },[])

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
      // Monthly transaction Bar Chart
      const option = {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: showAmountIn ? "Your Monthly Income" : "Your Monthly Expenditure"
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          },
          y: {
            title: {
              display: true,
              text: showAmountIn ? 'Amount Received (Ksh)' : 'Amount Spent (Ksh)'
            },
            beginAtZero: true
          }
        }
      };

      // Get ordered monthly data based on current view
      const currentData = showAmountIn ? monthlyData.received : monthlyData.spent;
      const orderedMonthlyData = orderMonthlyData(currentData.rawData);

      const data = {
        labels: orderedMonthlyData.labels,
        datasets: [
          {
            label: showAmountIn ? "Amount received" : "Amount spent",
            data: orderedMonthlyData.values,
            backgroundColor: showAmountIn ? "rgba(54, 162, 235, 0.6)" : "rgba(75, 192, 192, 0.6)",
            borderColor: showAmountIn ? "rgba(54, 162, 235, 1)" : "rgba(75, 192, 192, 1)",
            borderWidth: 1
          },
        ],
      };
      // frequent reciepient table
      function FreqRecipients() {
        return (
        <>
        <h3>Most Frequent Recipients</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Amount (Ksh)</th>
                <th>Number of times</th>
              </tr>
            </thead>
            <tbody>
            {most_Frecipients.map((recp, index) => (
                <tr key={index}>
                    <td>{index + 1}</td> 
                    <td>{recp.recipient_name}</td> 
                    <td>{recp.recipient_amount}</td> 
                    <td>{recp.frequency}</td> 
                </tr>
              ))}
            </tbody>
          </table>
        </>
        )
      }
      // top reciepient table
      function TopARecipients() {
        return (
        <>
        <h3>Top Recipients</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Amount (Ksh)</th>
                <th>Number of times</th>
              </tr>
            </thead>
            <tbody>
            {top_Arecipients.map((recp, index) => (
                <tr key={index}>
                    <td>{index + 1}</td> 
                    <td>{recp.recipient_name}</td> 
                    <td>{recp.recipient_amount}</td> 
                    <td>{recp.frequency}</td> 
                </tr>
              ))}
            </tbody>
          </table>
        </>
        )
      }
      //transaction period Line graph
      function PeriodLineGraph() {
        // Define the periods in chronological order
        const chronologicalPeriods = [
          "early_morning",
          "morning",
          "afternoon",
          "evening",
          "late_night"
        ];
      
        // Map the periods to more readable labels
        const orderedLabels = chronologicalPeriods.map(period => {
          switch(period) {
            case "early_morning": return "Early Morning";
            case "morning": return "Morning";
            case "afternoon": return "Afternoon";
            case "evening": return "Evening";
            case "late_night": return "Late Night";
            default: return period;
          }
        });
      
        // Create a mapping of period to value from your state
        const periodMap = {};
        periodLabels.forEach((label, index) => {
          periodMap[label] = periodValues[index];
        });
      
        // Get the data in the correct order
        const orderedValues = chronologicalPeriods.map(period => 
          periodMap[period] || 0
        );
      
        const periodLineOptions = {
          responsive: true,
          plugins: {
            legend: {display: false},
            title: {
              display: true,
              text: "Your Day in Transactions"
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time of Day'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Number of Transactions'
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
              fill: false,
              borderColor: "blue",
              backgroundColor: "rgba(0, 0, 255, 0.5)",
              tension: 0.3,
              pointBackgroundColor: "blue",
              pointRadius: 5
            }
          ]
        };
      
        return (
          <>
            <h3>Daily Transaction Patterns</h3>
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
            { days && days > 0 ? (
              <p><strong>{days}  {days === 1 ? 'day' : 'days'} </strong></p>
            ) :(
              <p>You entirely used M-pesa</p>
            )
            }
          </div>
        )
      }
      //Mshwari
      function MshwariCard({mshwari}){
        return (
          <div style={infoCardStyle}>
            <h3 style={infoCardTitleStyle}>M-Shwari</h3>
            <p>Invested <strong>{mshwari.amount_in} Ksh </strong></p>
            <p>Withdrew <strong>{mshwari.amount_out} Ksh </strong></p>
          </div>
        )
      }
      //AirtimeB
      function AirtimeBCard({airtimeB}){
        return (
          <div style={infoCardStyle}>
            <h3 style={infoCardTitleStyle}>Airtime and Bundles</h3>
            <p><strong>{airtimeB} Ksh </strong></p>
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
              <button 
              onClick={() => setShowAmountIn(!showAmountIn)}
              style={{
                padding: '8px 16px',
                margin: '10px',
                backgroundColor: showAmountIn ? '#36a2eb' : '#4bc0c0',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {showAmountIn ? 'Show Amount Spent' : 'Show Amount Received'}
            </button>
            {/* Bar Chaart */}
            <Bar options={option} data={data} height={400} width={600} />
            {/* Frequent Recipients table*/}
            <FreqRecipients/>

            {/* Top Recipients table*/}
            <TopARecipients/>

            {/* Transaction Period Line Graph */}
            <PeriodLineGraph />

            {/* Info cards */}
            <div style={{display: "flex", justifyContent: "center", flexwrap: "wrap"}}>
              <FulizaCard data={fulizaData}/>
              <TransactionCostCard cost={transactionCost} />
              <InactiveDaysCard days={inactiveDays} />
              <MshwariCard mshwari={mshwariData} />
              <AirtimeBCard airtimeB={airtime_and_bundles} />
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