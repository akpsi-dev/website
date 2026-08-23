import { instagramLogo } from "../Assets";
import "./Logo.css";
import { useHref } from "react-router-dom";

export default function Logo() {
  const homeHref = useHref("/"); // Gets the href string for the home page

  const handleClick = () => {
    window.location.href = homeHref; // Redirects to the home page
  };

  return (
    <img
      src={instagramLogo}
      className="logo"
      onClick={handleClick}
      alt="Alpha Kappa Psi — return to home page"
    />
  );
}
