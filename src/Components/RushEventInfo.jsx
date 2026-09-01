import React from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaTshirt,
  FaDoorOpen,
} from "react-icons/fa";
import "./RushEventInfo.css";

const RushEventInfo = ({ event }) => {
  const iconComponents = {
    FaCalendarAlt: <FaCalendarAlt />,
    FaMapMarkerAlt: <FaMapMarkerAlt />,
    FaClock: <FaClock />,
    FaTshirt: <FaTshirt />,
    FaDoorOpen: <FaDoorOpen />,
  };

  const eventDetails = [
    { icon: "FaCalendarAlt", text: event.date },
    { icon: "FaMapMarkerAlt", text: event.location },
    { icon: "FaClock", text: event.time },
    { icon: "FaTshirt", text: event.attire },
    { icon: "FaDoorOpen", text: event["open-ness"] },
  ];

  return (
    <div className="event-card">
      <div className="card-frame">
        <div className="card-inner">
          <div className="corner-ornament top-left"></div>
          <div className="corner-ornament top-right"></div>
          <div className="corner-ornament bottom-left"></div>
          <div className="corner-ornament bottom-right"></div>
          <div className="card-content">
            <div className="title-container">
              <div className="title-decoration left"></div>
              <h2 className="event-title">{event.name}</h2>
              <div className="title-decoration right"></div>
            </div>
            <div className="event-details">
              {eventDetails.map((detail, index) => (
                <div key={index} className="event-detail">
                  <span className="icon-wrapper">
                    {iconComponents[detail.icon]}
                  </span>
                  <span className="detail-text">{detail.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RushEventInfo;
