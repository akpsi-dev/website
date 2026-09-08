import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSheet, CAREERS_SHEET_ID, CAREERS_RANGE } from "../utils/useSheet";
import { useMotionPrefs } from "../utils/useMotionPrefs";
import { EASE_OUT_EXPO } from "../utils/motion";
import { companyMonogram } from "../utils/companyLogo";
import "./CareerTable.css";

const CATEGORIES = [
  "Accounting",
  "Finance",
  "Consulting",
  "Marketing",
  "Technology",
  "Misc",
];

// Years we always show a tab for, even when the sheet has no rows for them yet.
// Years beyond this list are added automatically as data arrives.
const SEEDED_YEARS = [
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
];

const makeYearBucket = () =>
  CATEGORIES.reduce((bucket, category) => {
    bucket[category] = [];
    return bucket;
  }, {});

/**
 * Turns raw Google Sheets rows into { [year]: { [category]: rows[] } }.
 *
 * Exported so it can be tested directly. Every branch here exists because the
 * previous version indexed straight into a hardcoded year map, so one row with
 * an unknown year or sector threw and left the whole Careers page blank.
 *
 * Row shape: [Name, Year, Category, Sector, Company, Position]
 */
export function buildCareerData(values) {
  const byYear = SEEDED_YEARS.reduce((years, year) => {
    years[year] = makeYearBucket();
    return years;
  }, {});

  (values || []).forEach((row = []) => {
    const year = String(row[1] ?? "").trim();
    // A row with no year can't be filed anywhere — skip it rather than
    // letting it take down the whole table.
    if (!year) return;

    if (!byYear[year]) byYear[year] = makeYearBucket();

    // Unrecognised sectors land in Misc instead of throwing.
    const rawCategory = String(row[2] ?? "").trim();
    const category = CATEGORIES.includes(rawCategory) ? rawCategory : "Misc";

    byYear[year][category].push({
      Name: row[0],
      Position: row[5],
      Company: row[4],
      Sector: row[3],
    });
  });

  return byYear;
}

// Widths are derived from the index so the bars look like ragged ledger rows
// without needing a random source that would change on every render.
const SKELETON_BARS = Array.from({ length: 8 }, (_, i) => 72 - ((i * 11) % 35));

// Rows past this index stop accumulating delay and all arrive together. Keeps
// a year switch snappy on a long year and cheap on a mid-range phone: without
// it, row 60 of a busy year would wait two seconds for its turn.
const FLAP_CAP = 14;

const CareerTable = () => {
  const { rows, isLoading } = useSheet(CAREERS_SHEET_ID, CAREERS_RANGE);
  const { reducedMotion } = useMotionPrefs();
  const [selectedYear, setSelectedYear] = useState(null);

  const data = useMemo(() => buildCareerData(rows), [rows]);

  const sortedYears = useMemo(
    () => Object.keys(data).sort((a, b) => b - a),
    [data],
  );

  // Default to the most recent year present so newly added years surface on
  // their own, instead of the page going stale behind a hardcoded default.
  const activeYear = selectedYear ?? sortedYears[0];

  const groups = useMemo(() => {
    const yearData = data[activeYear] ?? {};
    return CATEGORIES.map((category) => [
      category,
      yearData[category] ?? [],
    ]).filter(([, entries]) => entries.length > 0);
  }, [data, activeYear]);

  if (isLoading) {
    return (
      <div className="careers-container">
        <div className="careers-skeleton" aria-hidden="true">
          {SKELETON_BARS.map((width, index) => (
            <span
              className="careers-skeleton__bar"
              key={index}
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Counts rows across sectors, so the stagger reads as one continuous cascade
  // down the sheet rather than restarting at every heading.
  let flapIndex = 0;

  return (
    <div className="careers-container">
      <div className="ledger">
        <nav className="ledger__years" aria-label="Placement year">
          {sortedYears.map((year) => (
            <button
              key={year}
              type="button"
              className={`ledger__year${year === activeYear ? " is-active" : ""}`}
              onClick={() => setSelectedYear(year)}
              aria-pressed={year === activeYear}
            >
              {year}
            </button>
          ))}
        </nav>

        <div className="ledger__sheet">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeYear}
              initial={{ opacity: reducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {groups.length === 0 ? (
                <p className="ledger-empty">
                  No placements recorded for {activeYear} yet.
                </p>
              ) : (
                groups.map(([category, entries]) => (
                  <section className="ledger__group" key={category}>
                    <h3 className="ledger__sector">{category}</h3>
                    {entries.map((entry, index) => {
                      const flap = flapIndex++;
                      return (
                        <motion.div
                          className="ledger__row"
                          key={`${entry.Name}-${index}`}
                          initial={
                            reducedMotion
                              ? { opacity: 1 }
                              : { opacity: 0, y: 8 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          transition={
                            reducedMotion
                              ? { duration: 0 }
                              : {
                                  duration: 0.45,
                                  delay: Math.min(flap, FLAP_CAP) * 0.035,
                                  ease: EASE_OUT_EXPO,
                                }
                          }
                        >
                          {/* Always the monogram, never the logo. The mark set
                              is wordmarks — JPMorgan's is 800x74 — and
                              object-fit: contain in a 34px square fits them by
                              width, so they collapse to a few pixels tall:
                              measured on the 2025 tab, 11 of 22 rendered under
                              10px and JPMorgan came out at 2.4px. They read as
                              smudges. The initial is legible at this size and
                              gives the column one consistent shape.

                              lookupCompanyLogo still exists in
                              utils/companyLogo for somewhere the mark can be
                              given room to be a mark.

                              Decorative: the company is spelled out at the end
                              of the row, so the initial would only repeat it to
                              a screen reader. */}
                          <span className="ledger__mark" aria-hidden="true">
                            <span className="ledger__monogram">
                              {companyMonogram(entry.Company)}
                            </span>
                          </span>
                          <span className="ledger__ident">
                            <span className="ledger__name">{entry.Name}</span>
                            <span className="ledger__role">
                              {entry.Position}
                            </span>
                          </span>
                          <span className="ledger__company">
                            {entry.Company}
                          </span>
                        </motion.div>
                      );
                    })}
                  </section>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CareerTable;
