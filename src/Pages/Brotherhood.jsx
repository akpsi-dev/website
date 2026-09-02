import React, { useEffect, useRef, useState } from "react";
import "./Brotherhood.css";
import { useMobile } from "../Components/Navbar";
import { motion } from "framer-motion";
import {
  BrotherhoodImage70,
  BrotherhoodImage30,
  BrotherhoodImage65,
  BrotherhoodImage68,
  BrotherhoodImage71,
  BrotherhoodImage72,
  BrotherhoodImage51,
  BrotherhoodImage73,
  BrotherhoodImage75,
  BrotherhoodImage76,
  BrotherhoodImage60,
  BrotherhoodImage78,
  BrotherhoodImage40,
  BrotherhoodImage28,
  BrotherhoodImage18,
  BrotherhoodImage79,
  BrotherhoodImage80,
  BrotherhoodImage82,
  BrotherhoodImage83,
  BrotherhoodImage16,
  BrotherhoodImage9,
  BrotherhoodImage52,
  BrotherhoodImage54,
  BrotherhoodImage55,
  BrotherhoodImage66,
  BrotherhoodImage85,
  BrotherhoodImage84,
  BrotherhoodImage86,
  BrotherhoodImage87,
  BrotherhoodImage88,
  BrotherhoodImage89,
  BrotherhoodImage90,
  BrotherhoodImage91,
  BrotherhoodImage92,
  BrotherhoodImage93,
  BrotherhoodImage94,
  BrotherhoodImage95,
  BrotherhoodImage96,
  BrotherhoodImage97,
  BrotherhoodImage98,
} from "../Assets";

export default function Brotherhood() {
  const { isMobile } = useMobile();
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  //Make SURE every image you are using has a centered subject, or else it will look very awkward
  const carouselImages = [
    BrotherhoodImage89,
    BrotherhoodImage97,
    BrotherhoodImage96,
    BrotherhoodImage87,
  ];

  const scrapbookImages = [
    BrotherhoodImage30,
    BrotherhoodImage65,
    BrotherhoodImage88,
    BrotherhoodImage68,
    BrotherhoodImage92,
    BrotherhoodImage70,
    BrotherhoodImage71,
    BrotherhoodImage72,
    BrotherhoodImage90,
    BrotherhoodImage51,
    BrotherhoodImage73,
    BrotherhoodImage91,
    BrotherhoodImage75,
    BrotherhoodImage76,
    BrotherhoodImage60,
    BrotherhoodImage78,
    BrotherhoodImage40,
    BrotherhoodImage28,
    BrotherhoodImage18,
    BrotherhoodImage95,
    BrotherhoodImage79,
    BrotherhoodImage93,
    BrotherhoodImage80,
    BrotherhoodImage84,
    BrotherhoodImage82,
    BrotherhoodImage98,
    BrotherhoodImage83,
    BrotherhoodImage16,
    BrotherhoodImage9,
    BrotherhoodImage52,
    BrotherhoodImage54,
    BrotherhoodImage55,
    BrotherhoodImage66,
    BrotherhoodImage94,
    BrotherhoodImage86,
    BrotherhoodImage85,
  ];

  // Handle image hover effects with enhanced animations
  useEffect(() => {
    const images = document.querySelectorAll(".photoframe-container img");

    images.forEach((img, index) => {
      // Staggered appearance, capped. This was index * 0.05s across the whole
      // gallery, so the 30th photo sat on a 1.5s delay before even starting its
      // 0.8s fade — over two seconds of blank frame after it was already on
      // screen. Items reveal individually as they intersect, so the stagger
      // only needs to separate neighbours; cycling every 6 keeps the effect and
      // caps the wait at 0.25s.
      img.style.setProperty("--delay", `${(index % 6) * 0.05}s`);

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

    const revealPage = () => {
      clearTimeout(timer);
      setIsLoading(false);
    };

    // Captured once so cleanup detaches from the same node the effect attached
    // to, even if the ref has since moved.
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("canplay", revealPage);
      // Dead CDN / 404 means "canplay" never fires; don't hold the page hostage.
      videoElement.addEventListener("error", revealPage);
      if (videoElement.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        revealPage();
      }
    } else {
      revealPage();
    }

    return () => {
      clearTimeout(timer);
      if (videoElement) {
        videoElement.removeEventListener("canplay", revealPage);
        videoElement.removeEventListener("error", revealPage);
      }
    };
  }, []);

  // Intersection Observer for animation on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      // Reveal 300px before an item enters the viewport. At rootMargin 0 with
      // a 10% threshold, items only began their 0.8s fade once they were
      // already well on screen, so scrolling at any speed left blank gaps
      // where the photos should be.
      rootMargin: "300px 0px",
      threshold: 0.1,
    };

    let observer;
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          // Revealing is one-way; stop watching so a long page is not holding
          // 40-odd live observations while it scrolls.
          observer.unobserve(entry.target);
        }
      });
    };

    observer = new IntersectionObserver(handleIntersect, observerOptions);

    const items = document.querySelectorAll(".animate-on-scroll");
    items.forEach((item) => observer.observe(item));

    /* Safety net. These elements are opacity: 0 until JS adds a class, which
       means any failure in the observer leaves photos permanently invisible —
       and "the last photos are not there" is exactly how that reads to someone
       scrolling to the bottom. After a grace period, reveal whatever is left
       regardless. The animation still runs normally in the common case; this
       only decides how the page fails. */
    const failSafe = setTimeout(() => {
      items.forEach((item) => item.classList.add("in-view"));
      observer.disconnect();
    }, 4000);

    return () => {
      clearTimeout(failSafe);
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
                src={
                  "https://d395js6c4h8h6h.cloudfront.net/Videos/CruiseVideo2026.mp4"
                }
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
                src={
                  "https://d395js6c4h8h6h.cloudfront.net/Videos/CruiseReelWebsite.mp4"
                }
                autoPlay
                muted
                loop
                playsInline
              >
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
                    alt={`Alpha Kappa Psi brothers at a chapter event ${index + 1}`}
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
                  alt={`Alpha Kappa Psi chapter scrapbook memory ${index + 1}`}
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
