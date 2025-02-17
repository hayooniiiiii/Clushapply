import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Mainpage from "./pages/Mainpage";
import Profile from "./pages/Profilepage/Profile";
import Calendar from "./pages/Calendarpage/Calendar";
import Diary from "./pages/Diarypage/Diary";
import Diarylist from "./pages/Diarypage/Diarylist";
import Diarylook from "./pages/Diarypage/Diarylook";
import DiaryEdit from "./pages/Diarypage/DiaryEdit";
import Saju from "./pages/Sajupage/Saju";
import Routinelist from "./pages/Routinepage/Routinelist";
import ProfileEdit from "./pages/Profilepage/ProfileEdit";

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


            <Route path="/diary/:id" element={<Diarylook />} />  {/* ✅ 상세보기 */}
            <Route path="/diary" element={<Diary />} />          {/* ✅ 다이어리 작성 */}
            <Route path="/diarylist/:date" element={<Diarylist/>} />{/* ✅ 다이어리 목록 */}
            <Route path="/diary/edit/:id" element={<DiaryEdit />} />
            <Route path="/saju/:date" element={<Saju/>} />
            <Route path="/routinelist/:date" element={<Routinelist/>} />
            <Route path="/profile-edit" element={<ProfileEdit />} />

        </Routes>
      </Router>
  );
}

export default App;
