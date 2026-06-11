import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CareerTable.css";
import { useSheet, CAREERS_SHEET_ID, CAREERS_RANGE } from "../utils/useSheet";
import { useMotionPrefs } from "../utils/useMotionPrefs";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const SECTORS = [
  "Accounting",
  "Finance",
  "Consulting",
  "Marketing",
  "Technology",
  "Misc",
];

// Rows beyond this index skip the flap stagger and simply fade —
// keeps year switches snappy on long years and cheap on mid phones.
const FLAP_CAP = 14;

export default function CareerTable() {
  const { rows, isLoading } = useSheet(CAREERS_SHEET_ID, CAREERS_RANGE);
  const { reducedMotion } = useMotionPrefs();

  // Group dynamically by year so new sheet years appear without code changes.
  const byYear = useMemo(() => {
    const map = {};
    (rows ?? []).forEach((row) => {
      const [name, year, sector, , company, position] = row;
      if (!name || !year) return;
      if (!map[year]) map[year] = {};
      const key = SECTORS.includes(sector) ? sector : "Misc";
      if (!map[year][key]) map[year][key] = [];
      map[year][key].push({ name, position, company });
    });
    return map;
  }, [rows]);

  const years = useMemo(
    () => Object.keys(byYear).sort((a, b) => b - a),
    [byYear],
  );

  const [selectedYear, setSelectedYear] = useState(null);
  const year = selectedYear ?? years[0];

  if (isLoading) {
    return (
      <div className="ledger-skeleton" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span
            className="ledger-skeleton__bar"
            key={i}
            style={{ width: `${72 - ((i * 11) % 35)}%` }}
          />
        ))}
      </div>
    );
  }

  if (!years.length) {
    return (
      <p className="mono-label ledger-empty">
        RECORDS TEMPORARILY UNAVAILABLE — PLEASE CHECK BACK SOON.
      </p>
    );
  }

  let flapIndex = 0;

  return (
    <div className="ledger">
      <nav className="ledger__years" aria-label="Placement year">
        {years.map((y) => (
          <button
            key={y}
            type="button"
            className={`ledger__year mono-label${y === year ? " is-active" : ""}`}
            onClick={() => setSelectedYear(y)}
            aria-pressed={y === year}
          >
            {y}
          </button>
        ))}
      </nav>

      <div className="ledger__sheet">
        <div className="ledger__head mono-label" aria-hidden="true">
          <span>Name</span>
          <span>Position</span>
          <span>Company</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={year}
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {SECTORS.map((sector) => {
              const entries = byYear[year]?.[sector];
              if (!entries?.length) return null;
              return (
                <section className="ledger__group" key={`${year}-${sector}`}>
                  <h3 className="mono-label ledger__sector">{sector}</h3>
                  {entries.map((entry, i) => {
                    const flap = flapIndex++;
                    return (
                      <motion.div
                        className="ledger__row"
                        key={`${entry.name}-${i}`}
                        initial={
                          reducedMotion
                            ? { opacity: 1 }
                            : flap < FLAP_CAP
                              ? { rotateX: -85, opacity: 0 }
                              : { opacity: 0 }
                        }
                        animate={{ rotateX: 0, opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: Math.min(flap, FLAP_CAP) * 0.035,
                          ease: EASE_OUT_EXPO,
                        }}
                        style={{ transformOrigin: "center top" }}
                      >
                        <span className="ledger__name">{entry.name}</span>
                        <span className="ledger__position">
                          {entry.position}
                        </span>
                        <span className="ledger__company">{entry.company}</span>
                      </motion.div>
                    );
                  })}
                </section>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
