import React, { useRef, useEffect, useState } from "react";
import "./Home.css";
import { motion } from "framer-motion";
import { BrotherhoodImage66, BrotherhoodImage76 } from "../Assets";
import { knightAKYLogo } from "../Assets";
import SleekButton from "../Components/SleekButton";
import { OpenInNew } from "@mui/icons-material";
import { Instagram, Facebook, LinkedIn } from "@mui/icons-material";
import { BrotherhoodImage75 } from "../Assets";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  
  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  
  const scaleInVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    const handleCanPlay = () => {
      clearTimeout(timer);
      setIsLoading(false);
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("canplay", handleCanPlay);
    }

    return () => {
      clearTimeout(timer);
      if (videoElement) {
        videoElement.removeEventListener("canplay", handleCanPlay);
      }
    };
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const animateOnScroll = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
        }
      });
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    const sections = document.querySelectorAll(
      ".info-content, .info-image-container, .info-button-container, .wrapup-section, .summary-item, .final-statements, .social-links"
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <div className={`home-container ${isLoading ? "hidden" : ""}`}>
        <div className="background-video">
            
              <video
                ref={videoRef}
                src={"https://d395js6c4h8h6h.cloudfront.net/Videos/NewFall2025.mp4"}
                autoPlay
                muted
                playsInline
                loop
                preload="auto"
              >
                Your browser does not support the video tag.
              </video>

        </div>
        <motion.div className="hero-section">
          <div className="hero-content">
            <motion.h1 className="hero-title" initial={{ y: -150 }}>
              ΑΚΨ - UCI
            </motion.h1>
          </div>
        </motion.div>
        <div className="section-background info-background">
          <div className="section-overlay"></div>
          <div className="info-section">
            <h2 className="section-title">THE FIRST AND LARGEST BUSINESS FRATERNITY</h2>
            <motion.div 
              className="info-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                }
              }}
            >
              <p>
                The organization of Alpha Kappa Psi was founded in New York
                University in 1904. Spanning decades, Alpha Kappa Psi has helped
                over 300,000 individuals create lifelong friends and pursue their
                dreams. Our goal is to help Anteaters become the best versions of
                themselves.
              </p>
            </motion.div>
            <motion.div 
              className="info-image-container"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { 
                  opacity: 1, 
                  scale: 1,
                  transition: { duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }
                }
              }}
            >
              <img
                className="info-image"
                src={knightAKYLogo}
                alt="Knight Logo of Alpha Kappa Psi"
              />
              <div className="image-glow"></div>
            </motion.div>
            <motion.div 
              className="info-button-container"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
                }
              }}
            >
              <SleekButton
                variant="outlined"
                href="https://akpsi.org/"
                target="_blank"
                endIcon={<OpenInNew />}
                className="sleekButton"
              >
                Learn More
              </SleekButton>
            </motion.div>
          </div>
        </div>
        <div className="pillar-background">
          <div className="pillar-overlay"></div>
          <div className="wrapup-section">
            <h2 className="pillar-title">OUR PILLARS</h2>
            <div className="summary-section">
              <motion.div 
                className="summary-item brotherhood"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={scaleInVariants}
                custom={0}
              >
                <div className="item-content">
                  <h2>BROTHERHOOD</h2>
                  <div className="image-container">
                    <img src={BrotherhoodImage76} alt="Brotherhood" />
                    <div className="image-overlay"></div>
                  </div>
                  <p>
                    In Alpha Kappa Psi, you meet as strangers but leave as lifelong
                    friends. Our brotherhood sets us apart and shapes us into who we
                    are.
                  </p>
                  <SleekButton className="sleekButton" href="/meet-us">
                    Brothers
                  </SleekButton>
                </div>
              </motion.div>

              <motion.div 
                className="summary-item professionalism"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={scaleInVariants}
                custom={1}
                transition={{ delay: 0.2 }}
              >
                <div className="item-content">
                  <h2>PROFESSIONALISM</h2>
                  <div className="image-container">
                    <img src={BrotherhoodImage66} alt="Professionalism" />
                    <div className="image-overlay"></div>
                  </div>
                  <p>
                    We inspire one another to chase our passions with confidence by
                    equipping ourselves with the tools necessary to succeed in any
                    industry.
                  </p>
                  <SleekButton className="sleekButton" href="/careers">
                    Careers
                  </SleekButton>
                </div>
              </motion.div>

              <motion.div 
                className="summary-item personal-growth"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={scaleInVariants}
                custom={2}
                transition={{ delay: 0.4 }}
              >
                <div className="item-content">
                  <h2>PERSONAL GROWTH</h2>
                  <div className="image-container">
                    <img src={BrotherhoodImage75} alt="Personal Growth" />
                    <div className="image-overlay"></div>
                  </div>
                  <p>
                    Our unique culture inspires, encourages, and motivates you to
                    step out of your comfort zone and live the life you've always
                    imagined.
                  </p>
                  <SleekButton className="sleekButton" href="/recruitment">
                    Recruitment
                  </SleekButton>
                </div>
              </motion.div>
            </div>
            <footer className="site-footer">
              <div className="footer-content">
                <motion.div 
                  className="social-links"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInVariants}
                >
                  <a
                    href="https://www.instagram.com/akpsiuci"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <Instagram />
                  </a>
                  <a
                    href="https://facebook.com/akpsiuci"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <Facebook />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/alpha-kappa-psi-uci"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <LinkedIn />
                  </a>
                  <a href="mailto:akpsi.uci.rush@gmail.com" className="email-link">
                    akpsi.uci.rush@gmail.com
                  </a>
                </motion.div>
                <motion.div 
                  className="final-statements"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInVariants}
                >
                  <p className="statement-one">
                    Our members strive to uphold the highest standards in
                    everything they do.
                  </p>
                  <p className="statement-two">
                    Site designed and developed in-house, on 7000 lines of code
                    and counting...
                  </p>
                </motion.div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
