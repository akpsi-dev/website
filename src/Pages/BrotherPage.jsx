import React, { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ActiveBrother from "./ActiveBrother";
import NotFoundPage from "./NotFoundPage";
import { fetchVisibleRoster, rosterSlug } from "../utils/roster";
import "./BrotherPage.css";

export default function BrotherPage() {
  const [brotherInfo, setBrotherInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const { name } = useParams();

  const getBrotherInfo = useCallback(async () => {
    setIsLoading(true);
    setIsNotFound(false);
    try {
      // fetchVisibleRoster already drops hidden brothers, so a hidden name
      // 404s here exactly as it disappears from Meet Us.
      const rows = await fetchVisibleRoster();
      // Guard the name cell: a single blank or malformed row used to throw here,
      // which the catch below turned into a 404 for *every* brother, not just one.
      const brotherIndex = rows.findIndex(
        (brother) => rosterSlug(brother?.[0]) === name,
      );
      if (brotherIndex !== -1) {
        setBrotherInfo(rows[brotherIndex]);
      } else {
        setIsNotFound(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, [name]);

  useEffect(() => {
    getBrotherInfo();
  }, [getBrotherInfo]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (isNotFound) {
    return <NotFoundPage brother={true} />;
  }

  return (
    <div>
      <ActiveBrother brotherInfo={brotherInfo} />
    </div>
  );
}
