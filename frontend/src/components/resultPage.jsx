import React, { useState, useContext, useEffect, useRef } from 'react';
import pic1 from '../assets/pic_1.png';
import pic2 from '../assets/pic_2.png';
import pic3 from '../assets/pic_3.png';
import pic4 from '../assets/pic_4.png';
import pic5 from '../assets/pic_5.png';
import pic6 from '../assets/pic_6.png';
import pic7 from '../assets/pic_7.png';
import pic8 from '../assets/pic_8.png';
import pic9 from '../assets/pic_9.png';
import pic10 from '../assets/pic_10.png';
import pic11 from '../assets/pic_11.png';
import pic12 from '../assets/pic_12.png';
import './styles/resultPage.css';
import { ThemeContext } from "../context/ThemeContext";


const ResultPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progressArray, setProgressArray] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Track progress for each slide
  const [animatedSlides, setAnimatedSlides] = useState({}); // Track which slides have been animated
  const [isPaused, setIsPaused] = useState(false); // New state for pause functionality
  const totalSlides = 12;
  const slideDuration = 7000; // 7 seconds per slide
  const intervalRef = useRef(null);
  const images = [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9, pic10, pic11, pic12]; // Array of images
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(true);
  const [total_spent, setTotal_spent] = useState(0)
  const [total_received, setTotal_received] = useState(0)
  const [net_flow, setNet_flow] = useState(0)
  const [top_month, setTopMonth] = useState([])
  const [top_month_amount, setTopMonthAmount] = useState([])
  const [categories, setCateories] = useState([])
  const [biggest_transactions, setBiggestTransactions] = useState({})
  const [biggest_amount, setBiggestAmount] = useState(0)
  const [most_frequent_recepient, setMost_frequent_recepient] = useState({})
  const [mostF_amount, setMostF_amount] = useState({})
  const [top_recepient, setTop_recepient] = useState({})
  const [topF_amount, setTopF_amount] = useState(0)
  const [most_visited_paybill_or_till, setMost_visited] = useState({})
  const [most_visited_amount, setMost_visited_amount] = useState(0)
  const [most_visited_name, setMost_visited_name] = useState(0)
  const [most_visited_type, setMost_visited_type] = useState(0)
  const [most_active_day, setMost_active_day] = useState({})
  const [most_active_amount, setMost_active_amount] = useState({})
  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th'; // 11th, 12th, 13th...
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    
    // Format the date as "Month Day, Year"
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
  
    return `${day}${suffix} ${month} ${year}`;
  };
  function extractPayBill(text) {
    const words = text.split(' ');
    const startIndex = words.indexOf("Online") + 1;
    const endIndex = words.indexOf("Acc.");
    return words.slice(startIndex, endIndex).join(' ');
  }
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
        
    // Top spent  
    const total_spent = data.results_page?.essentials?.total_spent || {};
    setTotal_spent(total_spent.toLocaleString());
    //  total_received  
    const total_received = data.results_page?.essentials?.total_received || {};
    setTotal_received(total_received.toLocaleString());
    // net flow  
    const net_flow = data.results_page?.essentials?.net_flow || {};
    setNet_flow(net_flow.toLocaleString());
    
    //top month
    const top_month = data.results_page?.essentials?.top_month || "";
    setTopMonth(top_month)
    setTopMonthAmount(top_month.month_amount.toLocaleString())
    
    //categories
    const categories = data.results_page?.essentials?.categories || "";
    setCateories(categories)

    //biggest transaction
    const biggest_transactions = data.results_page?.top_spending_habits?.biggest_transactions || "";
    setBiggestTransactions(biggest_transactions)

    const biggest_amount = data.results_page?.top_spending_habits?.biggest_transactions.biggest_amount || "";
    setBiggestAmount(biggest_amount.toLocaleString())

    //most_frequent_recepient
    const most_frequent_recepient = data.results_page?.top_spending_habits?.most_frequent_recepient || {};
    setMost_frequent_recepient(most_frequent_recepient)

    const mostF_amount = data.results_page?.top_spending_habits?.most_frequent_recepient.amount || "";
    setMostF_amount(mostF_amount.toLocaleString())

    //top recepient
    const top_recepient = data.results_page?.top_spending_habits?.top_recepient || {};
    setTop_recepient(top_recepient)

    const topF_amount = data.results_page?.top_spending_habits?.top_recepient.amount || "";
    setTopF_amount(topF_amount.toLocaleString())

    //most visited
    const most_visited_paybill_or_till = data.results_page?.top_spending_habits?.most_visited_paybill_or_till || {};
    setMost_visited(most_visited_paybill_or_till)

    const most_visited_type = most_visited_paybill_or_till.type.replace('Payment', '').trim();
    setMost_visited_type(most_visited_type)

    const most_visited_name = data.results_page?.top_spending_habits?.most_visited_paybill_or_till.name || {};
    setMost_visited_name(extractPayBill(most_visited_name))

    const most_visited_amount = data.results_page?.top_spending_habits?.most_visited_paybill_or_till.amount || "";
    setMost_visited_amount(most_visited_amount.toLocaleString())

    //most_active_day
    const most_active_day = data.results_page?.time_based?.most_active_day || "";
    setMost_active_day(most_active_day)

    const most_active_amount = data.results_page?.time_based?.most_active_day.active_day_amount || "";
    setMost_active_amount(most_active_amount.toLocaleString())
      } catch (err) {
        console.log("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const inlineH5 = { display: 'inline', marginRight: 10 };


  const captions = [
    //pic 1
    { title: "Your M-pesa wrapped is heree 😍", className: "style-one" },

    //pic 2
    {
      title: (
        <>
          <h6 style={inlineH5}>You received:</h6>
          <span style={{WebkitTextStroke: "0.5px black" ,color:"rgb(71, 255, 25)"}}> Ksh {total_received}</span> <h6 style={inlineH5}></h6>&nbsp;
          <br></br>
          <h6 style={inlineH5}>but spent: </h6> 
          <span style={{ WebkitTextStroke: "0.5px black", color:"rgb(71, 255, 25)"}}>Ksh {total_spent}</span> <h6 style={inlineH5}></h6>&nbsp;
          <br></br>
          <h6 style={inlineH5}> so your net flow is: </h6>
          Ksh {net_flow}  <h5 style={inlineH5}></h5>&nbsp;
        </>
      ),
      className: "style-two" 
    },

      //pic 3
      {
        title: (
          <>
            <h5 style={inlineH5}>You spent the most in:</h5>
            <span style={{ color: '#4cd762', fontWeight: 'bold', marginRight: '10px' }}>{top_month.month_name}</span>
            <br />
            <br />
            <h5 style={inlineH5}>Totaling:</h5>
            <span style={{ color: '#4cd762', fontWeight: 'bold' }}>Ksh { top_month_amount || '0'}</span>
          </>
        ),
        className: "style-three"
      },
      // pic 4
      { 
        title: (
          <>
            <h5 style={inlineH5}>Your Spending Breakdown:</h5>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
              {Object.entries(categories).map(([key, value]) => (
                <li
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'center', // Center the content
                  fontSize: '0.9rem',
                  marginBottom: '6px',
                  alignItems: 'baseline',
                  width: '100%', // Ensure the li takes full width
                }}
              >
                <span style={{ 
                  opacity: 0.8,
                  marginRight: '10px', // Reduced from 22px
                  textAlign: 'right',
                  flex: 1, // Let this take available space on left
                }}>
                  {key.replace(/_/g, ' ')}
                </span>
                <span style={{ 
                  borderBottom: '1.5px dotted #ccc',
                  height: '1em',
                  width: '25px', // Fixed width instead of flex: 1
                  opacity: 0.5,
                }} />
                <span style={{ 
                  color: '#4cd762', 
                  fontWeight: 'bold',
                  textAlign: 'left',
                  flex: 1, // Let this take available space on right
                }}>
                  Ksh {value.toLocaleString()}
                </span>
              </li>
              ))}
            </ul>
          </>
        ),
        className: "style-four"
    },
      
    // pic 5   
    {
      title: (
        <>
          <h6 style={inlineH5}>Now, on</h6> 
          <span style={{fontSize: "27px", color: "#4cd762"}}>{formatDate(biggest_transactions.biggest_date)},&nbsp;</span>
            <h6 style={inlineH5}>you made your biggest transaction a whopping</h6> 
            <span style = {{color: "#4cd762"}}>
            <br></br>
               Ksh {biggest_amount}
            <br></br>
            </span>
          <h6 style={inlineH5}> via "{biggest_transactions.its_category}" </h6> 
        </>
      ),
      className: "style-five"
    },
    
    // pic 6
    {
      title: (
        <>
          <h6 style={inlineH5}> Guess who topped your sending chart?</h6>
          <br></br>
          <br></br>
          <span style={{ animationDelay: "2s" }}>
           <span style={{...inlineH5, fontSize: "25px"}}>It's </span>
          <span style={{ color: "#4cd762"}}>
             { most_frequent_recepient.name} </span>
             <br></br>
             <br></br>
             <span style={{...inlineH5, fontSize: "25px"}}>with &nbsp;</span>   
               <span style = {{fontSize: "26px",color: "#4cd762"}}>
               {most_frequent_recepient.frequency} transactions 
            </span>
            <br></br>
          <span style={{...inlineH5, fontSize: "25px"}}>totaling &nbsp;</span>   
          <span style = {{fontSize: "29px",color: "#4cd762"}}>Ksh {mostF_amount} &nbsp; </span>
          </span>
        </>
      ),
      className: "style-six"
    },
    // pic 7
    {
      title: (
        <>
          <span style={{color: "#4cd762"}}> {top_recepient.name}</span> <h5 style={inlineH5}>was your 🥇 receiver</h5> 
          <br></br>
          <span style={{fontSize: '30px', color: "#4cd762"}}>Ksh {topF_amount} <span style={{color: 'white'}}>total  &nbsp;</span> </span>
        </>
      ),
      className: "style-six"
    },
    // pic 8
    {
      title: (
        <>
          <h6>Most visited {most_visited_type}</h6>
          <span style={{color: '#4cd762'}}>{most_visited_name}</span>
          <h5>Times: {most_visited_paybill_or_till.frequency}</h5>
          <h5>Total Amount: Ksh {most_visited_amount}</h5>
        </>
      ),
      className: "style-eight"
    },

    // pic 9
    {
      title: (
        <>
          <h6 style={inlineH5}>On</h6> 
          <span style={{WebkitTextStroke: "0.5px grey", fontSize: "29px", color:"rgb(71, 255, 25)"}}>
            {formatDate(most_active_day.date)},&nbsp;
          </span>
          <h6 style={inlineH5}>you went all out — making</h6> 
          <span style={{WebkitTextStroke: "0.5px grey", color:"rgb(71, 255, 25)"}}>
            <br />
            <br />
            {most_active_day.number_of_transactions} transactions</span>
            <br />
            <br />
            <span style={{fontSize: "26px"}}>
             spending </span><br /> <span style={{WebkitTextStroke: "0.5px grey", color:"rgb(71, 255, 25)"}}>Ksh {most_active_amount}
            <br />
          </span>
        </>
      ),
      className: "style-nine"
    },
    // pic 10
    {
      title: (
        <>
          <h6 style={inlineH5}>pic 10: inactive_days</h6> 
        </>
      ),
      className: "style-nine"
    },
    // pic 11
    {
      title: (
       <>
          <h6 style={inlineH5}>pic 11: peak_transaction_period</h6> 
        </>
      ),
      className: "style-nine"
    },
    // pic 12
    {
      title: (
        <>
          <h6 style={inlineH5}> pic 12: Downloadable Summary</h6> 
        </>
      ),
      className: "style-nine"
    }
  
  ];
  // When current slide changes, add that slide to the animated slides
  useEffect(() => {
    setAnimatedSlides(prev => ({
      ...prev,
      [currentSlide]: true
    }));
  }, [currentSlide]);
  
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Only start the interval if not paused
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setProgressArray(prev => {
          const newArray = [...prev];
          newArray[currentSlide] = Math.min(100, newArray[currentSlide] + (100 / (slideDuration / 50)));
          
          if (newArray[currentSlide] >= 100) {
            clearInterval(intervalRef.current);
            
            if (currentSlide < totalSlides - 1) {
              setCurrentSlide(currentSlide + 1);
            }
          }
          return newArray;
        });
      }, 50);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentSlide, isPaused]); // Added isPaused as a dependency
  
  const goToSlide = (index) => {
    setProgressArray(prev => {
      const newArray = [...prev];
      for (let i = 0; i < index; i++) {
        newArray[i] = 100;
      }
      return newArray;
    });
    setCurrentSlide(index);
  };
  
  const nextSlide = () => {
    setProgressArray(prev => {
      const newArray = [...prev];
      newArray[currentSlide] = 100;
      return newArray;
    });
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prevSlide) => {
        const newSlide = prevSlide - 1;
        setProgressArray(prev => {
          const newArray = [...prev];
          newArray[currentSlide] = 0; 
          newArray[newSlide] = 0;
          return newArray;
        });
        return newSlide;
      });
    }
  };
  
  // Toggle pause/play function
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  if (isLoading) {
    return (
      <div className={`analytics-container ${theme === 'dark' ? 'dark-theme' : ''}`}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Hang on a little bit...</p>
        </div>
      </div>
    );
  }

 
  return (
    <div className="pics-container">
      <div className="progress-bar">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div 
            key={index}
            className={`progress-item ${progressArray[index] >= 100 ? 'completed' : ''}`}
            onClick={() => goToSlide(index)}
          >
            {index === currentSlide || progressArray[index] > 0 ? (
              <div 
                className="progress-fill" 
                style={{ width: `${progressArray[index]}%` }} 
              />
            ) : null}
          </div>
        ))}
      </div>
      <div className="carousel">
        <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div key={index} className="pics-page">
              <img src={images[index]} alt={`Slide ${index + 1}`} />
              <div 
                className={`overlay-text ${captions[index].className} ${
                  index === currentSlide ? 'active' : ''
                } ${animatedSlides[index] ? 'animated' : ''}`}
              >
              <div className="custom-title"><h1>{captions[index].title}</h1></div>
              <p>{captions[index].subtitle}</p>
              </div>
            </div>
          ))}
        </div>
          <button className="arrow prev" onClick={prevSlide} disabled={currentSlide === 0}>❮</button>
          <div className="carousel-controls">
          <button className="pause-play" style={{ border: '2px solid grey' }} onClick={togglePause}>
            {isPaused ? "▶" : "⏸️"}
          </button>
          </div>
          <button className="arrow next" onClick={nextSlide} disabled={currentSlide === totalSlides - 1}>❯</button>
      </div>
    </div>
  );
};

export default ResultPage;