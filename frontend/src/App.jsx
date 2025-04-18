import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/landingPage";
import MainPage from "./components/mainPage";
import TutorialPage from "./components/TutorialPage";
import ResultPage from "./components/resultPage";
import AnalyticsPage from "./components/userAnalytics";
import { ThemeProvider } from "./context/ThemeContext";
const App =() => {
  
  return (
    <ThemeProvider>
   <Router>
    <Routes>
    <Route path="/" element={<Navigate to="/landing" />} />
      <Route path="/landing" element={<LandingPage/>}/>
      <Route path="/tutorial" element={<TutorialPage/>}/>
      <Route path="/main" element={<MainPage/>}/>
      <Route path="/results" element={<ResultPage/>}></Route>
      <Route path="/analytics" element={<AnalyticsPage/>}></Route>
    </Routes>
   </Router>
   </ThemeProvider>

  );
};

export default App;
