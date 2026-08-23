import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Main";
import "./App.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import MeetUs from "./Pages/MeetUs";
import Brotherhood from "./Pages/Brotherhood";
import Careers from "./Pages/Careers";
import Recruitment from "./Pages/Recruitment";
import BrotherPage from "./Pages/BrotherPage";
import NotFoundPage from "./Pages/NotFoundPage";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Analytics />
        <Main />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/meet-us" element={<MeetUs />} />
          <Route path="/brotherhood" element={<Brotherhood />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/rush" element={<Recruitment />} />
          <Route path="/:name" element={<BrotherPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}
