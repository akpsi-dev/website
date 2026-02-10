import React, { useEffect, useRef, useState } from "react";
import "./Brotherhood.css";
import { useMobile } from "../Components/Navbar";
import { motion } from "framer-motion";
import {
  BrotherhoodImage69,
  BrotherhoodImage70,
  BrotherhoodImage30,
  BrotherhoodImage65,
  BrotherhoodImage67,
  BrotherhoodImage68,
  BrotherhoodImage62,
  BrotherhoodImage71,
  BrotherhoodImage72,
  BrotherhoodImage50,
  BrotherhoodImage51,
  BrotherhoodImage73,
  BrotherhoodImage74,
  BrotherhoodImage36,
  BrotherhoodImage75,
  BrotherhoodImage76,
  BrotherhoodImage77,
  BrotherhoodImage60,
  BrotherhoodImage78,
  BrotherhoodImage40,
  BrotherhoodImage28,
  BrotherhoodImage18,
  BrotherhoodImage61,
  BrotherhoodImage79,
  BrotherhoodImage38,
  BrotherhoodImage80,
  BrotherhoodImage81,
  BrotherhoodImage82,
  BrotherhoodImage15,
  BrotherhoodImage83,
  BrotherhoodImage16,
  BrotherhoodImage9,
  BrotherhoodImage52,
  BrotherhoodImage54,
  BrotherhoodImage55,
  BrotherhoodImage66,
  BrotherhoodImage56,
  BrotherhoodImage35,
  BrotherhoodImage59,
  BrotherhoodImage63,
} from "../Assets";

export default function Brotherhood() {
  const { isMobile } = useMobile();
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  //Make SURE every image you are using has a centered subject, or else it will look very awkward
  const carouselImages = [
    BrotherhoodImage69,
    BrotherhoodImage67,
    BrotherhoodImage74,
    BrotherhoodImage77,
  ];

  const scrapbookImages = [
    BrotherhoodImage30,
    BrotherhoodImage65,
    BrotherhoodImage56,
    BrotherhoodImage68,
    BrotherhoodImage62,
    BrotherhoodImage70,
    BrotherhoodImage71,
    BrotherhoodImage72,
    BrotherhoodImage50,
    BrotherhoodImage51,
    BrotherhoodImage73,
    BrotherhoodImage36,
    BrotherhoodImage75,
    BrotherhoodImage76,
    BrotherhoodImage60,
    BrotherhoodImage78,
    BrotherhoodImage40,
    BrotherhoodImage28,
    BrotherhoodImage18,
    BrotherhoodImage61,
    BrotherhoodImage79,
    BrotherhoodImage38,
    BrotherhoodImage80,
    BrotherhoodImage81,
    BrotherhoodImage82,
    BrotherhoodImage15,
    BrotherhoodImage83,
    BrotherhoodImage16,
    BrotherhoodImage9,
    BrotherhoodImage52,
    BrotherhoodImage54,
    BrotherhoodImage55,
    BrotherhoodImage66,
    BrotherhoodImage35,
    BrotherhoodImage59,
    BrotherhoodImage63,
  ];

  // Handle image hover effects with enhanced animations
  useEffect(() => {
    const images = document.querySelectorAll(".photoframe-container img");

    images.forEach((img, index) => {
      // Set animation delays for staggered appearance
      img.style.setProperty("--delay", `${index * 0.05}s`);

      // Random initial rotation for dynamic gallery feel
      const randomRotation =
        Math.random() < 0.5 ? Math.random() * -3 - 1 : Math.random() * 3 + 1;

      img.style.setProperty("--rotation", `${randomRotation}deg`);

      // Add enhanced hover effect
      img.addEventListener("mouseenter", () => {
        img.classList.add("hover");
        setActiveImage(index);
      });

      img.addEventListener("mouseleave", () => {
        img.classList.remove("hover");
        setActiveImage(null);
      });
    });

    // Clean up event listeners
    return () => {
      images.forEach((img) => {
        img.removeEventListener("mouseenter", () => {
          img.classList.add("hover");
        });

        img.removeEventListener("mouseleave", () => {
          img.classList.remove("hover");
        });
      });
    };
  }, [isLoading]);

  // Loading state management
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    const handleCanPlay = () => {
      clearTimeout(timer);
      setIsLoading(false);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("canplay", handleCanPlay);
    }

    return () => {
      clearTimeout(timer);
      if (videoRef.current) {
        videoRef.current.removeEventListener("canplay", handleCanPlay);
      }
    };
  }, []);

  // Intersection Observer for animation on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const items = document.querySelectorAll(".animate-on-scroll");
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, [isLoading]);

  return (
    <>
      {isLoading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <div className={`section-container ${isLoading ? "hidden" : ""}`}>
        <div className="video-section">
          <motion.div className="hero-section">
            <div className="hero-content">
              <motion.h1
                className="hero-title"
                initial={{ y: -130, opacity: 1 }}
                animate={{ y: -150, opacity: 0 }}
                transition={{ delay: 41, duration: 2, ease: "easeOut" }}
              >
                Brotherhood
              </motion.h1>
            </div>
          </motion.div>
          <div className="background-video">
            {!isMobile && (
              <video
                ref={videoRef}
                src={"https://d395js6c4h8h6h.cloudfront.net/Videos/SpringRush2024Website.mp4"}
                autoPlay
                muted
                playsInline
                loop
              >
                Your browser does not support the video tag.
              </video>
            )}
            {isMobile && (
              <video 
              ref={videoRef} 
              src={"https://d395js6c4h8h6h.cloudfront.net/Videos/CruiseReelWebsite.mp4"} 
              autoPlay 
              muted 
              loop
              playsInline>
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>

        {/* Enhanced Carousel Section */}
        <div className="carousel-section">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Our Newest Flicks</h2>
            <p className="brotherhood-title">
              Some of our favorite moments in recent memory.
            </p>
          </div>

          <div className="carousel-grid">
            {carouselImages.map((image, index) => (
              <div
                key={index}
                className="carousel-item animate-on-scroll"
                style={{ "--index": index }}
              >
                <div className="image-card">
                  <img
                    className="carousel-img"
                    src={image}
                    alt="Photo of AKY Brothers"
                    draggable={false}
                    loading="lazy"
                  />
                  <div className="image-overlay"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Scrapbook Section */}
        <div className="photoframe-section">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">The All-Time Scrapbook</h2>
            <p className="photoframe-title">
              From quarterly retreats to spontaneous hangouts, our brothers in
              Alpha Kappa Psi always make lifelong memories.
            </p>
          </div>

          <div className="photoframe-container">
            {scrapbookImages.map((image, index) => (
              <div
                key={index}
                className="scrapbook-item animate-on-scroll"
                style={{ "--index": index }}
              >
                <img
                  className={`scrapbook-img ${activeImage === index ? "active" : ""}`}
                  src={image}
                  alt="Photo of AKY Brothers"
                  draggable={false}
                />
                <div className="scrapbook-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
