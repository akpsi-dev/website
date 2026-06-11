import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Main from "./Main";
import "./App.css";
import { MotionPrefsProvider } from "./utils/useMotionPrefs";
import useLenis from "./utils/useLenis";
import { CurtainProvider, ChunkCover } from "./Components/chrome/Curtain";
import Preloader from "./Components/chrome/Preloader";
import Grain from "./Components/chrome/Grain";
import Cursor from "./Components/chrome/Cursor";
import { Analytics } from "@vercel/analytics/react";

const Home = lazy(() => import("./Pages/Home"));
const About = lazy(() => import("./Pages/About"));
const MeetUs = lazy(() => import("./Pages/MeetUs"));
const Brotherhood = lazy(() => import("./Pages/Brotherhood"));
const Careers = lazy(() => import("./Pages/Careers"));
const Recruitment = lazy(() => import("./Pages/Recruitment"));
const BrotherPage = lazy(() => import("./Pages/BrotherPage"));
const NotFoundPage = lazy(() => import("./Pages/NotFoundPage"));

function Chrome({ children }) {
  useLenis();
  return (
    <>
      <Preloader />
      <Grain />
      <Cursor />
      {children}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <MotionPrefsProvider>
        <Router>
          <CurtainProvider>
            <Chrome>
              <div className="App">
                <Analytics />
                <Main />
                <Suspense fallback={<ChunkCover />}>
                  <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/meet-us" element={<MeetUs />} />
                    <Route path="/brotherhood" element={<Brotherhood />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/rush" element={<Recruitment />} />
                    <Route path="/:name" element={<BrotherPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </div>
            </Chrome>
          </CurtainProvider>
        </Router>
      </MotionPrefsProvider>
    </HelmetProvider>
  );
}
