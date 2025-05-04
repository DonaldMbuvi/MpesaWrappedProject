import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
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

const ResultPage = () => {
  // Theme context
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progressArray, setProgressArray] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [animatedSlides, setAnimatedSlides] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = 12;
  const slideDuration = 6000;
  const intervalRef = useRef(null);
  const images = [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9, pic10, pic11, pic12];
  
  // Data state
  const [isLoading, setIsLoading] = useState(true);
  const [total_spent, setTotal_spent] = useState(0);
  const [total_received, setTotal_received] = useState(0);
  const [net_flow, setNet_flow] = useState(0);
  const [top_month, setTopMonth] = useState({});
  const [top_month_amount, setTopMonthAmount] = useState(0);
  const [categories, setCategories] = useState({});
  const [biggest_transactions, setBiggestTransactions] = useState({});
  const [biggest_amount, setBiggestAmount] = useState(0);
  const [most_frequent_recepient, setMost_frequent_recepient] = useState({});
  const [mostF_amount, setMostF_amount] = useState(0);
  const [top_recepient, setTop_recepient] = useState({});
  const [topF_amount, setTopF_amount] = useState(0);
  const [most_visited_paybill_or_till, setMost_visited] = useState({});
  const [most_visited_amount, setMost_visited_amount] = useState(0);
  const [most_visited_name, setMost_visited_name] = useState("");
  const [most_visited_type, setMost_visited_type] = useState("");
  const [most_active_day, setMost_active_day] = useState({});
  const [most_active_amount, setMost_active_amount] = useState(0);
  const [inactive_days, setInactiveDays] = useState({});
  const [total_inactive_days, setTotalInactiveDays] = useState(0);
  const [peak_transaction_period, setPeak_transaction_period] = useState({});

  // Helper functions
  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
  };

  const extractPayBill = (text) => {
    if (!text) return "N/A";
    const words = text.split(' ');
    const startIndex = words.indexOf("Online") + 1;
    const endIndex = words.indexOf("Acc.");
    return words.slice(startIndex, endIndex).join(' ');
  };

  let counter = 0;
  const formatInactiveDates = (dates) => {
    if (!dates || !dates.day_1) {
      return "N/A";
    } else if (Object.keys(dates).length === 1) {
      return formatDate(dates.day_1);
    } else {
      const same_month = [];    
      const day_1_month = dates.day_1.slice(5,7); 
      same_month.push(dates.day_1);
      for (const date of Object.values(dates)) {
        if ((day_1_month === date.slice(5,7)) && (same_month.length < 2) && (date !== dates.day_1)) {
          same_month.push(date);
        }
      }
      if (same_month.length === 1) {
        const first_day = formatDate(same_month[0]);
        counter += 1;
        return `${first_day}`;
      } else {
        const striped_first_day = formatDate(same_month[0]).slice(0,4);
        const second_full_day = formatDate(same_month[1]);
        counter += 2;
        return `${striped_first_day} and ${second_full_day}`;
      }
    }
  };

  // Data fetching
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
        
        // Set all the data states
        setTotal_spent(data.results_page?.essentials?.total_spent?.toLocaleString() || "0");
        setTotal_received(data.results_page?.essentials?.total_received?.toLocaleString() || "0");
        setNet_flow(data.results_page?.essentials?.net_flow?.toLocaleString() || "0");
        setTopMonth(data.results_page?.essentials?.top_month || {});
        setTopMonthAmount(data.results_page?.essentials?.top_month?.month_amount?.toLocaleString() || "0");
        setCategories(data.results_page?.essentials?.categories || {});
        setBiggestTransactions(data.results_page?.top_spending_habits?.biggest_transactions || {});
        setBiggestAmount(data.results_page?.top_spending_habits?.biggest_transactions?.biggest_amount?.toLocaleString() || "0");
        setMost_frequent_recepient(data.results_page?.top_spending_habits?.most_frequent_recepient || {});
        setMostF_amount(data.results_page?.top_spending_habits?.most_frequent_recepient?.amount?.toLocaleString() || "0");
        setTop_recepient(data.results_page?.top_spending_habits?.top_recepient || {});
        setTopF_amount(data.results_page?.top_spending_habits?.top_recepient?.amount?.toLocaleString() || "0");
        
        const most_visited = data.results_page?.top_spending_habits?.most_visited_paybill_or_till || {};
        setMost_visited(most_visited);
        setMost_visited_type(most_visited.type?.replace('Payment', '').trim() || "");
        setMost_visited_name(extractPayBill(most_visited.name));
        setMost_visited_amount(most_visited.amount?.toLocaleString() || "0");
        
        setMost_active_day(data.results_page?.time_based?.most_active_day || {});
        setMost_active_amount(data.results_page?.time_based?.most_active_day?.active_day_amount?.toLocaleString() || "0");
        setInactiveDays(data.results_page?.time_based?.inactive_days || {});
        setTotalInactiveDays(data.user_analytics_page?.number_of_inactive_days || 0);
        setPeak_transaction_period(data.results_page?.time_based?.peak_transaction_period || {});

      } catch (err) {
        console.log("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Carousel effects
  useEffect(() => {
    setAnimatedSlides(prev => ({
      ...prev,
      [currentSlide]: true
    }));
  }, [currentSlide]);
  
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
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
  }, [currentSlide, isPaused]);

  // Carousel navigation
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
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Inline styles for text elements
  const inlineH5 = { display: 'inline', marginRight: 10 };
  const text_inactive_days = formatInactiveDates(inactive_days);

  // Slide captions
  const captions = [
    { title: "Your M-pesa wrapped is here 😍", className: "style-one" },
    {
      title: (
        <>
         <u>Money Matters</u> 
        <br /><br />
          <h6 style={inlineH5}>You received:</h6>
          <span style={{WebkitTextStroke: "0.5px black", color:"rgb(71, 255, 25)"}}> Ksh {total_received}</span>
          <br /><br />
          <h6 style={inlineH5}>but spent: </h6> 
          <span style={{WebkitTextStroke: "0.5px black", color:"rgb(71, 255, 25)"}}>Ksh {total_spent}</span>
          <br /><br />
          <h6 style={inlineH5}>so your net flow is: </h6>
          <h5 style={inlineH5}>Ksh {net_flow}</h5>
        </>
      ),
      className: "style-two" 
    },
    {
      title: (
        <>
          <h5 style={inlineH5}>You spent the most in:</h5>
          <span style={{ color: '#4cd762', fontWeight: 'bold', marginRight: '10px' }}>{top_month.month_name || 'N/A'}</span>
          <br /><br />
          <h5 style={inlineH5}>Totaling:</h5>
          <span style={{ color: '#4cd762', fontWeight: 'bold' }}>Ksh {top_month_amount || '0'}</span>
        </>
      ),
      className: "style-three"
    },
    { 
      title: (
        <>
          <h5 style={inlineH5}>Your Spending Breakdown:</h5>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {Object.entries(categories).map(([key, value]) => (
              <li key={key} style={{ display: 'flex', justifyContent: 'center', fontSize: '0.9rem', marginBottom: '6px', alignItems: 'baseline', width: '100%' }}>
                <span style={{ opacity: 0.8, marginRight: '10px', textAlign: 'right', flex: 1 }}>
                  {key.replace(/_/g, ' ')}
                </span>
                <span style={{ borderBottom: '1.5px dotted #ccc', height: '1em', width: '25px', opacity: 0.5 }} />
                <span style={{ color: '#4cd762', fontWeight: 'bold', textAlign: 'left', flex: 1 }}>
                  Ksh {value?.toLocaleString() || '0'}
                </span>
              </li>
            ))}
          </ul>
        </>
      ),
      className: "style-four"
    },
    {
      title: (
        <>
          <h6 style={inlineH5}>Now, on</h6> 
          <span style={{fontSize: "27px", color: "#4cd762"}}>{formatDate(biggest_transactions.biggest_date)},&nbsp;</span>
          <h6 style={inlineH5}>you made your biggest transaction a whopping</h6> 
          <span style={{color: "#4cd762"}}>
            <br />
            Ksh {biggest_amount}
            <br />
          </span>
          <h6 style={inlineH5}> via "{biggest_transactions.its_category || 'N/A'}" </h6> 
        </>
      ),
      className: "style-five"
    },
    {
      title: (
        <>
          <h6 style={inlineH5}>Guess who topped your sending chart?</h6>
          <br /><br />
          <span style={{ animationDelay: "2s" }}>
            <span style={{...inlineH5, fontSize: "25px"}}>It's </span>
            <span style={{ color: "#4cd762"}}>{most_frequent_recepient.name || 'N/A'}</span>
            <br /><br />
            <span style={{...inlineH5, fontSize: "25px"}}>with &nbsp;</span>   
            <span style={{fontSize: "26px", color: "#4cd762"}}>
              {most_frequent_recepient.frequency || '0'} transactions 
            </span>
            <br />
            <span style={{...inlineH5, fontSize: "25px"}}>totaling &nbsp;</span>   
            <span style={{fontSize: "29px", color: "#4cd762"}}>Ksh {mostF_amount || '0'}</span>
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
    {
      title: (
        <>
          <h6>Most visited {most_visited_type || 'N/A'}</h6>
          <span style={{color: '#4cd762'}}>{most_visited_name || 'N/A'}</span>
          <h5>Times: {most_visited_paybill_or_till.frequency || '0'}</h5>
          <h5>Total Amount: Ksh {most_visited_amount || '0'}</h5>
        </>
      ),
      className: "style-eight"
    },
    {
      title: (
        <>
          <h6 style={inlineH5}>On</h6> 
          <span style={{WebkitTextStroke: "0.5px grey", fontSize: "29px", color:"rgb(71, 255, 25)"}}>
            {formatDate(most_active_day.date)},&nbsp;
          </span>
          <h6 style={inlineH5}>you went all out — making</h6> 
          <span style={{WebkitTextStroke: "0.5px grey", color:"rgb(71, 255, 25)"}}>
            <br /><br />
            {most_active_day.number_of_transactions || '0'} transactions</span>
            <br /><br />
            <span style={{fontSize: "26px"}}>spending </span><br />
            <span style={{WebkitTextStroke: "0.5px grey", color:"rgb(71, 255, 25)"}}>Ksh {most_active_amount || '0'}</span>
        </>
      ),
      className: "style-nine"
    },
    {
      title: (
        <>
          <h6 style={inlineH5}>
            {Object.keys(inactive_days).filter(key => key !== "more_days_flag").length > 0
              ? "However, you didn't use Mpesa on"
              : <span style={{fontSize: "32px", color:"rgb(255, 255, 255)"}}>
                  Wow! you've been using Mpesa continously.
                </span>
            }
          </h6> 
          {Object.keys(inactive_days).filter(key => key !== "more_days_flag").length > 0 && (
            <>
              <span style={{WebkitTextStroke: "0.5px grey", fontSize: "29px", color:"rgb(71, 255, 25)"}}>
                {text_inactive_days}&nbsp;
              </span>
              <h6 style={inlineH5}> and </h6> 
              <span style={{WebkitTextStroke: "0.5px grey", fontSize: "29px", color:"rgb(71, 255, 25)"}}>
                {total_inactive_days-counter},&nbsp;
              </span>
              <h6 style={inlineH5}> other days.</h6> 
            </>
          )}
        </>
      ),
      className: "style-nine"
    },
    {
      title: (
        <>
          <span style={{...inlineH5, color: '#4cd762'}}>{peak_transaction_period.percentage || 'N/A'}</span>
          <h5 style={inlineH5}> of your transactions were made in the </h5> 
          <span style={{...inlineH5, color: '#4cd762'}}>{peak_transaction_period.period_name || 'N/A'}</span>
        </>
      ),
      className: "style-nine"
    },
    {
      title: (
        <>
          <h6 style={inlineH5}>Download your full summary below</h6> 
        </>
      ),
      className: "style-nine"
    }
  ];

  if (isLoading) {
    return (
      <div className={`result-container ${theme}`}>
        <button 
          className={`theme-toggle ${theme}`}
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <FaMoon size={18}/> : <FaSun size={18}/>}
        </button>
        <div className="loading-spinner">
          <div className={`spinner ${theme}`}></div>
          <p>Hang on a little bit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`result-container ${theme}`}>
      <button 
        className={`theme-toggle ${theme}`}
        onClick={toggleTheme}
        title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "light" ? <FaMoon size={18}/> : <FaSun size={18}/>}
      </button>

      <div className="content-wrapper">
        <h6 className={`result-title ${theme}`}>Your M-Pesa Wrapped</h6>
        
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
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="arrow prev" 
              onClick={prevSlide} 
              disabled={currentSlide === 0}
            >
              ❮
            </button>
            
            <div className="carousel-controls">
              <button className="pause-play" style={{ border: '2px solid grey' }}  onClick={togglePause}>
                {isPaused ? "▶" : "⏸️"}
              </button>
            </div>
            
            <button 
              className="arrow next" 
              onClick={nextSlide} 
              disabled={currentSlide === totalSlides - 1}
            >
              ❯
            </button>
          </div>
        </div>
        
        <div className="button-group">
        <Link to="/main" className="link-button">
        <button 
          className={`result-button back-button ${theme}`}
          onClick={(e) => {
            if (!window.confirm('Note you will have to reupload PDF. ')) {
              e.preventDefault();
            }
          }}
        >
          Back
        </button>
      </Link>

          <Link to="/analytics" className="link-button">
            <button className={`result-button analytics-button ${theme}`}>
              View More Analytics
            </button>
          </Link>
        </div>
      </div>

      <svg 
        className="decorative-triangle" 
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

export default ResultPage;