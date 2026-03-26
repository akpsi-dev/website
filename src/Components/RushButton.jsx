import React from "react";
import { Button, styled } from "@mui/material";
// import { keyframes } from "@emotion/react";

// const shine = keyframes`
//   0% {
//     background-position: -200% center;
//   }
//   100% {
//     background-position: 200% center;
//   }
// `;

// const glowPulse = keyframes`
//   0%, 100% {
//     box-shadow: 0 0 10px rgba(192, 192, 192, 0.3),
//                 0 0 20px rgba(192, 192, 192, 0.2);
//   }
//   50% {
//     box-shadow: 0 0 15px rgba(192, 192, 192, 0.4),
//                 0 0 30px rgba(192, 192, 192, 0.3);
//   }
// `;

// const borderFlare = keyframes`
//   0%, 100% {
//     border-color: rgba(192, 192, 192, 0.6);
//   }
//   50% {
//     border-color: rgba(255, 255, 255, 0.8);
//   }
// `;

const ChromeButton = styled(Button)(({ theme }) => ({
  display: "inline-block",
  padding: "12px 28px", // Exact same padding as calendar button
  backgroundColor: "transparent", // Exact same background as calendar button
  color: "white",
  textDecoration: "none", // Same as calendar button
  border: "4px solid rgb(255, 255, 255)", // Exact same border as calendar button
  borderRadius: "0px", // Exact same border radius as calendar button
  fontFamily: "'Anton', 'Arial Narrow', Arial, sans-serif",
  fontSize: "1rem", // Exact same font size as calendar button
  fontWeight: 700,
  letterSpacing: "1px", // Exact same letter spacing as calendar button
  transition: "all 0.3s ease", // Exact same transition as calendar button
  textTransform: "uppercase", // Exact same text transform as calendar button
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)", // Exact same shadow as calendar button
  // backdropFilter: 'blur(2px)', // Exact same backdrop filter as calendar button
  marginBottom: "0.5rem", // Same margin as calendar button
  WebkitTapHighlightColor: "transparent",

  "&:focus-visible": {
    backgroundColor: "transparent",
    borderColor: "rgb(255, 255, 255)",
    color: "white", // Exact same hover color as calendar button
  },

  "&:active": {
    backgroundColor: "transparent",
    borderColor: "rgb(255, 255, 255)",
    color: "white",
  },

  "@media (hover: hover)": {
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)", // Exact same hover background as calendar button
      borderColor: "rgba(192, 192, 192, 0.6)", // Exact same hover border as calendar button
      color: "white", // Exact same hover color as calendar button
      transform: "translateY(-2px)", // Exact same transform as calendar button
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)", // Exact same hover shadow as calendar button
    },
  },

  "@media (hover: none)": {
    "&:hover": {
      backgroundColor: "transparent",
      borderColor: "rgb(255, 255, 255)",
      color: "white",
      transform: "none",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    },
  },

  "@media (max-width: 768px)": {
    width: "100%",
    textAlign: "center",
    padding: "10px 20px", // Same mobile padding as calendar button
    fontSize: "0.9rem", // Same mobile font size as calendar button
  },
}));

const RushButton = ({ children, ...props }) => {
  return (
    <ChromeButton variant="contained" {...props}>
      {children}
    </ChromeButton>
  );
};

export default RushButton;
