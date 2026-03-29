import React, { useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ActiveBrotherList from "./ActiveBrotherList";
import ExecutiveBoardList from "./ExecutiveBoardList";
import { Button, ButtonGroup } from "@mui/material";
import "./MeetUs.css";

const SHEET_ID = "167TmecKc4cduWtdounqiXDkYgQjssu9cSz4QLljuKLg";
const API_KEY = process.env.REACT_APP_ACTIVE_INFO_KEY;
const RANGE_ACTIVES = "Form Responses 1!C2:L";
const RANGE_EXECUTIVES = "Leadership Test!A2:C";

function createBrotherSlug(name = "") {
  return name.trim().replace(/\s+/g, "-");
}

export default function MeetUs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewLeadership = searchParams.get("tab") === "leadership";
  const [activeBrothers, setActiveBrothers] = React.useState([]);
  const [executiveBrothers, setExecutiveBrothers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchBrothers = useCallback(async (isLeadership) => {
    setIsLoading(true);
    try {
      const range = isLeadership ? RANGE_EXECUTIVES : RANGE_ACTIVES;
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`,
      );
      if (isLeadership) {
        const leadershipRows = (response.data.values || [])
          .filter((row) => row.length > 0 && row[0])
          .map(([fullName = "", leadershipType = "", position = ""]) => ({
            fullName: fullName.trim(),
            leadershipType: leadershipType.trim(),
            position: position.trim(),
            profileSlug: createBrotherSlug(fullName),
          }));
        setExecutiveBrothers(leadershipRows);
      } else {
        setActiveBrothers(response.data.values || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeBrothers.length === 0) {
      fetchBrothers(false);
    }
  }, [fetchBrothers, activeBrothers.length]);

  useEffect(() => {
    if (viewLeadership && executiveBrothers.length === 0) {
      fetchBrothers(true);
    }
  }, [viewLeadership, fetchBrothers, executiveBrothers.length]);

  const makeLeadershipView = () => {
    setSearchParams({ tab: "leadership" });
    if (executiveBrothers.length === 0) {
      fetchBrothers(true);
    }
  };

  const makeActiveView = () => {
    setSearchParams({});
  };

  const activeBrotherSlugSet = new Set(
    activeBrothers
      .filter((brother) => brother.length > 0 && brother[0])
      .map((brother) => createBrotherSlug(brother[0])),
  );

  const displayedLeadership = executiveBrothers.map((brother) => ({
    ...brother,
    hasProfile: activeBrotherSlugSet.has(brother.profileSlug),
  }));

  return (
    <div className="meet-us-page pageContainer">
      <div className="content-wrapper">
        <div className="meet-us-header">
          <h1 className="meet-us-title">
            {viewLeadership ? "Leadership" : "Active Brothers"}
          </h1>
          <ButtonGroup className="view-buttons">
            <Button
              onClick={makeActiveView}
              variant={!viewLeadership ? "contained" : "outlined"}
              className={!viewLeadership ? "active-tab" : ""}
            >
              {"Active Brothers"}
            </Button>
            <Button
              onClick={makeLeadershipView}
              variant={viewLeadership ? "contained" : "outlined"}
              className={viewLeadership ? "active-tab" : ""}
            >
              {"Leadership"}
            </Button>
          </ButtonGroup>
        </div>
        {isLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : viewLeadership ? (
          <div>
            <ExecutiveBoardList brothers={displayedLeadership} />
          </div>
        ) : (
          <div>
            <ActiveBrotherList brothers={activeBrothers} />
          </div>
        )}
      </div>
    </div>
  );
}
