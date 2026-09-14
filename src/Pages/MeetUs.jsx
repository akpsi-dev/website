import React, { useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ActiveBrotherList from "./ActiveBrotherList";
import ExecutiveBoardList from "./ExecutiveBoardList";
import { LEADERSHIP_ROSTER } from "./leadershipRoster";
import { fetchVisibleRoster, rosterSlug } from "../utils/roster";
import { Button, ButtonGroup } from "@mui/material";
import "./MeetUs.css";

export default function MeetUs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewLeadership = searchParams.get("tab") === "leadership";
  const [activeBrothers, setActiveBrothers] = React.useState([]);
  const executiveBrothers = LEADERSHIP_ROSTER.map((brother) => ({
    ...brother,
    profileSlug: rosterSlug(brother.fullName),
  }));
  const [isLoading, setIsLoading] = React.useState(true);

  /* Leadership is a hand-maintained list (see leadershipRoster), so only the
     actives roster is fetched. */
  const fetchBrothers = useCallback(async () => {
    setIsLoading(true);
    try {
      setActiveBrothers(await fetchVisibleRoster());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeBrothers.length === 0) {
      fetchBrothers();
    }
  }, [fetchBrothers, activeBrothers.length]);

  const makeLeadershipView = () => {
    setSearchParams({ tab: "leadership" });
  };

  const makeActiveView = () => {
    setSearchParams({});
  };

  const activeBrotherSlugSet = new Set(
    activeBrothers
      .filter((brother) => brother.length > 0 && brother[0])
      .map((brother) => rosterSlug(brother[0])),
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
        {/* isLoading goes down to the list rather than swapping the whole
            section for a spinner. The spinner occupied almost no height, so
            when the roster landed the document grew by thousands of pixels in
            one frame; the list renders a skeleton at the real grid size
            instead, and the height is reserved from the start. */}
        {viewLeadership ? (
          <div>
            <ExecutiveBoardList
              brothers={displayedLeadership}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div>
            <ActiveBrotherList
              brothers={activeBrothers}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
