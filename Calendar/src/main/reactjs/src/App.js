import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Mainpage from "./pages/Mainpage";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Mainpage />} />
        </Routes>
      </Router>
  );
}

export default App;
