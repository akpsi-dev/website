import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CareerDataRow from "./CareerDataRow";
import "./CareerTable.css";

const SHEET_ID = "1YY9TyYXJPHNJ8n1M2O9iKQaB00oCIghhkb5UpxTxV0g";
const API_KEY = process.env.REACT_APP_CAREERS_INFO_KEY;
const RANGE = "Form Responses 1!B2:G";

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
const SEEDED_YEARS = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];

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

const CareerTable = () => {
  const [data, setData] = useState({});
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`,
        );
        setData(buildCareerData(response.data.values));
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const sortedYears = useMemo(
    () => Object.keys(data).sort((a, b) => b - a),
    [data],
  );

  // Default to the most recent year present so newly added years surface on
  // their own, instead of the page going stale behind a hardcoded default.
  const activeYear = selectedYear ?? sortedYears[0];

  const renderTableData = (category) => {
    return data[activeYear]?.[category]?.map((row, index) => (
      <CareerDataRow key={index} data={row} />
    ));
  };

  return (
    <div>
      <div className="tabs">
        <ul className="years">
          {sortedYears
            .map((year) => (
              <li
                key={year}
                className={activeYear === year ? "is-active" : ""}
                onClick={() => handleYearChange(year)}
              >
                <button
                  type="button"
                  className="year-button"
                  style={{ background: "none", border: "none", padding: 0, margin: 0, font: "inherit", color: "inherit", cursor: "pointer" }}
                >
                  {year}
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div className="careers-container">
        <table className="careers-table table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Company</th>
              <th>Sector</th>
            </tr>
          </thead>
          <tbody>
            {[
              "Accounting",
              "Finance",
              "Consulting",
              "Marketing",
              "Technology",
              "Misc",
            ].map((category) => {
              const categoryRows = renderTableData(category) || [];
              if (categoryRows.length > 0) {
                return (
                  <React.Fragment key={category}>
                    <tr>
                      <td
                        colSpan="10"
                        className="subtitle has-text-weight-semibold"
                        style={{ textDecoration: "none", fontWeight: "bold" }}
                      >
                        {category}
                      </td>
                    </tr>
                    {categoryRows}
                  </React.Fragment>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CareerTable;
