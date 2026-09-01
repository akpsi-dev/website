import React from "react";
import { Link } from "react-router-dom";
import styles from "./ActiveBrotherList.module.css";
import Pic from "../Components/Pic";
import { headshotHash } from "../Assets/headshot";
import { companyHash } from "../Assets/company";

// Slug logic must stay in sync with createBrotherSlug in MeetUs.jsx and the
// lookup in BrotherPage.jsx, or a card links to a page that 404s.
function brotherName(row) {
  return String(row?.[0] ?? "").trim();
}

export default function ActiveBrotherList({ brothers, isLoading }) {
  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <div className={styles.brotherGrid}>
          {(Array.isArray(brothers) ? brothers : []).map((brother, index) => {
            // A blank or malformed roster row used to reach brother[0].replace
            // and throw, taking the whole grid down with it. Skip it instead.
            const name = brotherName(brother);
            if (!name) return null;
            return (
              <div key={`${name}-${index}`} className={styles.brotherCard}>
                <Link
                  to={`/${encodeURIComponent(name.replace(/\s+/g, "-"))}`}
                  className={styles.brotherLink}
                >
                  <div className={styles.imageWrapper}>
                    <Pic
                      src={
                        headshotHash[name] || headshotHash["Default Headshot"]
                      }
                      alt={name}
                      className={styles.brotherPhoto}
                    />
                    <div className={styles.overlay}>
                      {/* The overlay sits at opacity 0 until the card is
                          hovered, but these were eager: 73 company logos,
                          several of them 3000-4096px wide, all fetched and
                          decoded for something nobody had looked at yet. */}
                      <Pic
                        src={
                          companyHash[name] || companyHash["Default Headshot"]
                        }
                        alt={`${name} company logo`}
                        className={styles.overlayImage}
                      />
                    </div>
                  </div>
                  <p className={styles.brotherName}>{name}</p>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
