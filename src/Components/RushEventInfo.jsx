import React from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaTshirt,
  FaDoorOpen,
} from "react-icons/fa";

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
      <style jsx>{`
        .event-card {
          position: relative;
          width: 100%;
          max-width: 600px;
          margin: 2rem auto;
          padding: 3px;
          background: linear-gradient(
            145deg,
            rgba(192, 192, 192, 0.2),
            rgba(128, 128, 128, 0.1)
          );
          border-radius: 0px;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
          animation: cardAppear 0.8s ease-out forwards;
        }

        @keyframes cardAppear {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-frame {
          position: relative;
          padding: 2px;
          background: linear-gradient(
            145deg,
            rgba(192, 192, 192, 0.3),
            rgba(128, 128, 128, 0.1)
          );
          border-radius: 0px;
          overflow: hidden;
        }

        // .card-frame::before {
        //   content: "";
        //   position: absolute;
        //   top: -50%;
        //   left: -50%;
        //   width: 200%;
        //   height: 200%;
        //   background: conic-gradient(
        //     from 0deg,
        //     transparent 0deg,
        //     rgba(192, 192, 192, 0.1) 90deg,
        //     transparent 180deg
        //   );
        //   animation: frameSpin 8s linear infinite;
        // }

        // @keyframes frameSpin {
        //   100% {
        //     transform: rotate(360deg);
        //   }
        // }

        // .card-inner {
        //   position: relative;
        //   background: linear-gradient(145deg, rgba(25, 25, 25, 0.95), rgba(15, 15, 15, 0.98));
        //   border-radius: 0px;
        //   overflow: hidden;
        //   z-index: 1;
        // }

        .corner-ornament {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 2px solid rgba(192, 192, 192, 0.3);
          z-index: 2;
        }

        .top-left {
          top: 10px;
          left: 10px;
          border-right: none;
          border-bottom: none;
        }

        .top-right {
          top: 10px;
          right: 10px;
          border-left: none;
          border-bottom: none;
        }

        .bottom-left {
          bottom: 10px;
          left: 10px;
          border-right: none;
          border-top: none;
        }

        .bottom-right {
          bottom: 10px;
          right: 10px;
          border-left: none;
          border-top: none;
        }

        .card-inner::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 15h15v15l-15 15-15-15v-15h-15l-15-15h30zm0 60l15-15h15v-15l-15-15-15 15v15h-15l-15 15h30z' fill='%23333333' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
          opacity: 0.1;
          z-index: 0;
        }

        .card-content {
          position: relative;
          padding: 2rem;
          z-index: 2;
        }

        .title-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .title-decoration {
          height: 2px;
          flex: 1;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(192, 192, 192, 0.3) 50%,
            transparent
          );
        }

        .event-title {
          font-family: "Anton", "Arial Narrow", Arial, sans-serif;
          font-size: 2.5rem;
          color: white;
          text-align: center;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-shadow:
            0 0 10px rgba(192, 192, 192, 0.3),
            2px 2px 4px rgba(0, 0, 0, 0.5);
          animation: titleGlow 2s ease-in-out infinite alternate;
        }

        @keyframes titleGlow {
          0% {
            text-shadow:
              0 0 10px rgba(192, 192, 192, 0.3),
              2px 2px 4px rgba(0, 0, 0, 0.5);
          }
          100% {
            text-shadow:
              0 0 15px rgba(192, 192, 192, 0.5),
              2px 2px 4px rgba(0, 0, 0, 0.5);
          }
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .event-detail {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: linear-gradient(
            90deg,
            rgba(40, 40, 40, 0.4) 0%,
            rgba(30, 30, 30, 0.2) 100%
          );
          border: 1px solid rgba(192, 192, 192, 0.2);
          border-radius: 8px;
          transition: all 0.3s ease;
          animation: detailAppear 0.5s ease-out forwards;
          opacity: 0;
        }

        .event-detail:nth-child(1) {
          animation-delay: 0.1s;
        }
        .event-detail:nth-child(2) {
          animation-delay: 0.2s;
        }
        .event-detail:nth-child(3) {
          animation-delay: 0.3s;
        }
        .event-detail:nth-child(4) {
          animation-delay: 0.4s;
        }
        .event-detail:nth-child(5) {
          animation-delay: 0.5s;
        }

        @keyframes detailAppear {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .event-detail:hover {
          background: linear-gradient(
            90deg,
            rgba(50, 50, 50, 0.5) 0%,
            rgba(40, 40, 40, 0.3) 100%
          );
          border-color: rgba(192, 192, 192, 0.3);
          transform: translateX(5px);
          box-shadow: 0 0 15px rgba(192, 192, 192, 0.1);
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          color: white;
          transition: transform 0.3s ease;
        }

        .event-detail:hover .icon-wrapper {
          transform: scale(1.1);
        }

        .detail-text {
          font-family: "Anton", "Arial Narrow", Arial, sans-serif;
          font-size: 1.1rem;
          color: white;
          letter-spacing: 1px;
          flex: 1 1 auto;
          text-align: left;
          white-space: normal;
          overflow-wrap: anywhere;
        }

        @media (max-width: 768px) {
          .event-card {
            margin: 1rem;
          }

          .event-title {
            font-size: 2rem;
          }

          .detail-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RushEventInfo;
