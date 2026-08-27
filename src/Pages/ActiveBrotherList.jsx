import React from "react";
import { Link } from "react-router-dom";
import styles from "./ActiveBrotherList.module.css";
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
                    <img
                      src={
                        headshotHash[name] || headshotHash["Default Headshot"]
                      }
                      alt={name}
                      className={styles.brotherPhoto}
                      loading="lazy"
                    />
                    <div className={styles.overlay}>
                      <img
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
