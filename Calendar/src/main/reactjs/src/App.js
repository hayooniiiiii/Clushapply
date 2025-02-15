import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Mainpage from "./pages/Mainpage";
import Profile from "./pages/Profilepage/Profile";
import Calendar from "./pages/Calendarpage/Calendar";

function App() {
  return (
      <Router>
        <Routes>
            {/* 기본 경로 설정 */}
            <Route path="/" element={<Mainpage />} />

            {/* 프로필 페이지 경로 설정 */}
            <Route path="/profile" element={<Profile />} />

            {/* 캘린더 페이지 경로 설정 */}
            <Route path="/calendar" element={<Calendar />} />

        </Routes>
      </Router>
  );
}

export default App;
