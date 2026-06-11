import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import "./MeetUs.css";
import Seo from "../Components/Seo";
import Footer from "../Components/chrome/Footer";
import Pic from "../Components/Pic";
import { CurtainLink } from "../Components/chrome/Curtain";
import FloatPreview from "../Components/effects/FloatPreview";
import { useMobile } from "../Components/Navbar";
import { headshotHash } from "../Assets/headshot";
import { companyHash } from "../Assets/company";
import { useSheet, ROSTER_SHEET_ID, LEADERSHIP_RANGE } from "../utils/useSheet";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const ACTIVES_RANGE = "Form Responses 1!C2:L";

function createBrotherSlug(name = "") {
  return name.trim().replace(/\s+/g, "-");
}

function headshotFor(name) {
  return headshotHash[name] ?? headshotHash["Default Headshot"];
}

function RosterSkeleton() {
  return (
    <div className="roster-skeleton" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <div className="roster-skeleton__row hairline-bottom" key={i}>
          <span
            className="roster-skeleton__bar"
            style={{ width: `${38 + ((i * 13) % 30)}%` }}
          />
          <span className="roster-skeleton__bar roster-skeleton__bar--meta" />
        </div>
      ))}
    </div>
  );
}

function RosterIndex({ brothers }) {
  const [preview, setPreview] = useState({ src: null, visible: false });

  return (
    <div
      className="roster-index"
      onMouseLeave={() => setPreview((p) => ({ ...p, visible: false }))}
    >
      {brothers.map((row, i) => {
        const [name, , major, pledgeClass] = row;
        return (
          <motion.div
            key={`${name}-${i}`}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.5,
              delay: (i % 8) * 0.04,
              ease: EASE_OUT_EXPO,
            }}
          >
            <CurtainLink
              to={`/${encodeURIComponent(createBrotherSlug(name))}`}
              className="roster-index__row hairline-bottom"
              data-cursor="VIEW"
              onMouseEnter={() =>
                setPreview({ src: headshotFor(name), visible: true })
              }
            >
              <span className="roster-index__name">{name}</span>
              <span className="roster-index__meta mono-label">
                {[major, pledgeClass].filter(Boolean).join(" · ")}
              </span>
            </CurtainLink>
          </motion.div>
        );
      })}
      <FloatPreview src={preview.src} visible={preview.visible} />
    </div>
  );
}

function RosterGrid({ brothers }) {
  return (
    <div className="roster-grid">
      {brothers.map((row, i) => {
        const [name] = row;
        const company = companyHash[name];
        return (
          <motion.div
            key={`${name}-${i}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 0.55,
              delay: (i % 4) * 0.06,
              ease: EASE_OUT_EXPO,
            }}
          >
            <CurtainLink
              to={`/${encodeURIComponent(createBrotherSlug(name))}`}
              className="roster-card"
              data-cursor="VIEW"
            >
              <span className="roster-card__media">
                <Pic
                  src={headshotFor(name)}
                  alt={name}
                  aspectRatio="4 / 5"
                  className="roster-card__photo"
                />
                {company && (
                  <span className="roster-card__chip">
                    <img src={company} alt="" loading="lazy" />
                  </span>
                )}
              </span>
              <span className="roster-card__name">{name}</span>
            </CurtainLink>
          </motion.div>
        );
      })}
    </div>
  );
}

function useLeadershipGroups(leaders) {
  return useMemo(() => {
    const map = new Map();
    leaders.forEach((leader) => {
      if (!map.has(leader.leadershipType)) map.set(leader.leadershipType, []);
      map.get(leader.leadershipType).push(leader);
    });
    return [...map.entries()];
  }, [leaders]);
}

function LeadershipGrid({ leaders, activeSlugs }) {
  const groups = useLeadershipGroups(leaders);

  return (
    <div className="leadership">
      {groups.map(([type, members]) => (
        <section className="leadership__group" key={type}>
          <h2 className="mono-label leadership__type hairline-bottom">
            {type}
          </h2>
          <div className="roster-grid">
            {members.map((member, i) => {
              const hasProfile = activeSlugs.has(member.profileSlug);
              const card = (
                <>
                  <span className="roster-card__media">
                    <Pic
                      src={headshotFor(member.fullName)}
                      alt={member.fullName}
                      aspectRatio="4 / 5"
                      className="roster-card__photo"
                    />
                  </span>
                  <span className="roster-card__name">{member.fullName}</span>
                  <span className="roster-card__position mono-label">
                    {member.position}
                  </span>
                </>
              );
              return (
                <motion.div
                  key={`${member.fullName}-${i}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.55,
                    delay: (i % 4) * 0.06,
                    ease: EASE_OUT_EXPO,
                  }}
                >
                  {hasProfile ? (
                    <CurtainLink
                      to={`/${encodeURIComponent(member.profileSlug)}`}
                      className="roster-card"
                      data-cursor="VIEW"
                    >
                      {card}
                    </CurtainLink>
                  ) : (
                    <div className="roster-card roster-card--static">
                      {card}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function LeadershipList({ leaders, activeSlugs }) {
  const groups = useLeadershipGroups(leaders);

  return (
    <div className="leadership">
      {groups.map(([type, members]) => (
        <section className="leadership__group" key={type}>
          <h2 className="mono-label leadership__type hairline-bottom">
            {type}
          </h2>
          {members.map((member, i) => {
            const hasProfile = activeSlugs.has(member.profileSlug);
            const inner = (
              <>
                <span className="leadership__name">{member.fullName}</span>
                <span className="leadership__position mono-label">
                  {member.position}
                </span>
              </>
            );
            return hasProfile ? (
              <CurtainLink
                key={`${member.fullName}-${i}`}
                to={`/${encodeURIComponent(member.profileSlug)}`}
                className="leadership__row hairline-bottom"
                data-cursor="VIEW"
              >
                {inner}
              </CurtainLink>
            ) : (
              <div
                key={`${member.fullName}-${i}`}
                className="leadership__row leadership__row--static hairline-bottom"
              >
                {inner}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

export default function MeetUs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewLeadership = searchParams.get("tab") === "leadership";
  const { isMobile } = useMobile();
  const [view, setView] = useState("grid");

  const actives = useSheet(ROSTER_SHEET_ID, ACTIVES_RANGE);
  const leadership = useSheet(ROSTER_SHEET_ID, LEADERSHIP_RANGE);

  const brothers = useMemo(
    () => (actives.rows ?? []).filter((row) => row.length > 0 && row[0]),
    [actives.rows],
  );

  const leaders = useMemo(
    () =>
      (leadership.rows ?? [])
        .filter((row) => row.length > 0 && row[0])
        .map(([fullName = "", leadershipType = "", position = ""]) => ({
          fullName: fullName.trim(),
          leadershipType: leadershipType.trim(),
          position: position.trim(),
          profileSlug: createBrotherSlug(fullName),
        })),
    [leadership.rows],
  );

  const activeSlugs = useMemo(
    () => new Set(brothers.map((row) => createBrotherSlug(row[0]))),
    [brothers],
  );

  const effectiveView = isMobile ? "grid" : view;
  const isLoading = viewLeadership ? leadership.isLoading : actives.isLoading;

  return (
    <div className="meet-us">
      <Seo title="Meet Us" />

      <header className="meet-us__header">
        <span className="mono-label meet-us__eyebrow">PI PSI — UC IRVINE</span>
        <h1 className="meet-us__title">
          {viewLeadership ? "Leadership" : "Active Brothers"}
        </h1>

        <div className="meet-us__controls hairline-bottom">
          <div className="meet-us__tabs" role="tablist" aria-label="Roster">
            <button
              type="button"
              role="tab"
              aria-selected={!viewLeadership}
              className={`meet-us__tab mono-label${!viewLeadership ? " is-active" : ""}`}
              onClick={() => setSearchParams({})}
            >
              Active Brothers
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewLeadership}
              className={`meet-us__tab mono-label${viewLeadership ? " is-active" : ""}`}
              onClick={() => setSearchParams({ tab: "leadership" })}
            >
              Leadership
            </button>
          </div>

          {!isMobile && (
            <div className="meet-us__views">
              {["index", "grid"].map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`meet-us__view mono-label${effectiveView === v ? " is-active" : ""}`}
                  onClick={() => setView(v)}
                  aria-pressed={effectiveView === v}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="meet-us__body">
        {isLoading ? (
          <RosterSkeleton />
        ) : viewLeadership ? (
          effectiveView === "index" ? (
            <LeadershipList leaders={leaders} activeSlugs={activeSlugs} />
          ) : (
            <LeadershipGrid leaders={leaders} activeSlugs={activeSlugs} />
          )
        ) : effectiveView === "index" ? (
          <RosterIndex brothers={brothers} />
        ) : (
          <RosterGrid brothers={brothers} />
        )}
      </main>

      <Footer />
    </div>
  );
}
