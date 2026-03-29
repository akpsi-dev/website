import React from "react";
import { Link } from "react-router-dom";
import styles from "./ExecutiveBoardList.module.css";
import { headshotHash } from "../Assets/headshot";

export default function ExecutiveBoardList({ brothers }) {
  const cabinetMembers = brothers.filter(
    (brother) => brother.leadershipType === "Cabinet",
  );
  const executiveBoardMembers = brothers.filter(
    (brother) => brother.leadershipType === "Executive Board",
  );

  const renderBrotherCard = (brother) => {
    const cardContent = (
      <>
        <div className={styles.imageWrapper}>
          <img
            src={
              headshotHash[brother.fullName]
                ? headshotHash[brother.fullName]
                : headshotHash["Default Headshot"]
            }
            alt={brother.fullName}
            className={styles.brotherPhoto}
          />
        </div>
        <p className={styles.brotherName}>{brother.fullName}</p>
        <p className={styles.brotherRole}>{brother.position}</p>
      </>
    );

    if (!brother.hasProfile) {
      return <div className={styles.brotherLink}>{cardContent}</div>;
    }

    return (
      <Link
        to={`/${encodeURIComponent(brother.profileSlug)}`}
        className={styles.brotherLink}
      >
        {cardContent}
      </Link>
    );
  };

  return (
    <div className={styles.container}>
      {/* Cabinet Section */}
      <div className={styles.section}>
        <h2>Cabinet</h2>
        <div className={styles.brotherGrid}>
          {cabinetMembers.map(
            (brother) =>
              brother.fullName && (
                <div key={brother.fullName} className={styles.brotherCard}>
                  {renderBrotherCard(brother)}
                </div>
              ),
          )}
        </div>
      </div>

      {/* Executive Board Section */}
      <div className={styles.section}>
        <h2>Executive Board</h2>
        <div className={styles.brotherGrid}>
          {executiveBoardMembers.map(
            (brother) =>
              brother.fullName && (
                <div key={brother.fullName} className={styles.brotherCard}>
                  {renderBrotherCard(brother)}
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  );
}
