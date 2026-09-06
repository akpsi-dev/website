import React from "react";
import { Link } from "react-router-dom";
import styles from "./ExecutiveBoardList.module.css";
import { headshotHash } from "../Assets/headshot";
import Pic from "../Components/Pic";

/* Roughly the real board size, so the reserved height lands near the final
   height. See ActiveBrotherList for why this exists. */
const SKELETON_CARDS = 8;

function SkeletonSection({ heading }) {
  return (
    <div className={styles.section}>
      <h2>{heading}</h2>
      <div className={styles.brotherGrid} aria-hidden="true">
        {Array.from({ length: SKELETON_CARDS }, (_, i) => (
          <div
            key={`skeleton-${i}`}
            className={`${styles.brotherCard} ${styles.brotherCardSkeleton}`}
          >
            <div className={styles.imageWrapper} />
            <p className={styles.brotherName}>&nbsp;</p>
            <p className={styles.brotherRole}>&nbsp;</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ExecutiveBoardList({ brothers, isLoading }) {
  const cabinetMembers = (brothers || []).filter(
    (brother) => brother.leadershipType === "Cabinet",
  );
  const executiveBoardMembers = (brothers || []).filter(
    (brother) => brother.leadershipType === "Executive Board",
  );

  const renderBrotherCard = (brother) => {
    const cardContent = (
      <>
        <div className={styles.imageWrapper}>
          <Pic
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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <SkeletonSection heading="Cabinet" />
        <SkeletonSection heading="Executive Board" />
      </div>
    );
  }

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
