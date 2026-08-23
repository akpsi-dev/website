import React, { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ActiveBrother from "./ActiveBrother";
import NotFoundPage from "./NotFoundPage";
import axios from "axios";
import "./BrotherPage.css";

export default function BrotherPage() {
  const [brotherInfo, setBrotherInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const { name } = useParams();
  const SHEET_ID = "167TmecKc4cduWtdounqiXDkYgQjssu9cSz4QLljuKLg";
  const API_KEY = process.env.REACT_APP_ACTIVE_INFO_KEY;
  const range = "Form Responses 1!C2:M";

  const getBrotherInfo = useCallback(async () => {
    setIsLoading(true);
    setIsNotFound(false);
    try {
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`,
      );
      const rows = response.data.values || [];
      // Guard the name cell: a single blank or malformed row used to throw here,
      // which the catch below turned into a 404 for *every* brother, not just one.
      // Slug logic must stay in sync with createBrotherSlug in MeetUs.jsx.
      const brotherIndex = rows.findIndex(
        (brother) =>
          String(brother?.[0] ?? "")
            .trim()
            .replace(/\s+/g, "-") === name,
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
  }, [name, API_KEY]);

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
