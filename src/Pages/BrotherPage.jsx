import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import ActiveBrother from "./ActiveBrother";
import NotFoundPage from "./NotFoundPage";
import "./BrotherPage.css";
import { useRoster } from "../utils/useSheet";

function slugOf(name = "") {
  return name.trim().replace(/\s+/g, "-");
}

function ProfileSkeleton() {
  return (
    <div className="profile-skeleton" aria-hidden="true">
      <div className="profile-skeleton__portrait" />
      <div className="profile-skeleton__lines">
        {Array.from({ length: 7 }, (_, i) => (
          <span
            className="profile-skeleton__bar hairline-bottom"
            key={i}
            style={{ width: `${88 - ((i * 17) % 40)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function BrotherPage() {
  const { name } = useParams();
  const { rows, isLoading, error } = useRoster();

  const { brother, prevName, nextName } = useMemo(() => {
    const valid = (rows ?? []).filter((row) => row.length > 0 && row[0]);
    const index = valid.findIndex((row) => slugOf(row[0]) === name);
    if (index === -1) return { brother: null };
    return {
      brother: valid[index],
      prevName: valid[(index - 1 + valid.length) % valid.length]?.[0],
      nextName: valid[(index + 1) % valid.length]?.[0],
    };
  }, [rows, name]);

  if (isLoading) return <ProfileSkeleton />;

  // Roster fetch failed with nothing cached — that's an outage, not a 404.
  if (error && !rows) {
    return (
      <div className="profile-error">
        <p className="mono-label">
          THE ROSTER COULD NOT BE LOADED — PLEASE TRY AGAIN.
        </p>
        <button
          type="button"
          className="hairline-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!brother) {
    return (
      <NotFoundPage
        brotherSearch
        attemptedName={name.replace(/-/g, " ")}
        rosterNames={(rows ?? [])
          .filter((row) => row.length > 0 && row[0])
          .map((row) => row[0])}
      />
    );
  }

  return (
    <ActiveBrother
      key={brother[0]}
      brotherInfo={brother}
      prevName={prevName !== brother[0] ? prevName : null}
      nextName={nextName !== brother[0] ? nextName : null}
    />
  );
}
