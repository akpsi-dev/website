/**
 * 2026 placements held in the repo, because the Careers sheet can only be read
 * with the API keys in .env — writing to it needs OAuth. These rows merge with
 * whatever the sheet returns, and a sheet row for the same brother and year
 * wins, so moving a row into the sheet is enough to retire its entry here.
 *
 * Row shape matches CAREERS_RANGE exactly:
 *   [Name, Year, Category, Sector, Company, Position]
 *
 * Category must be one of the six CATEGORIES in CareerTable, or the row lands
 * in Misc. Sector is free text and shows as the heading above the row.
 *
 * Not every row is a graduating senior — actives list their internships here
 * too, the same way earlier years mix the two.
 *
 * Still to come: Alex Sriprathum, Carl Qiao, Daniel Kim, David Kim, Ryan Park,
 * Sarah Kim and Yan Amy Zhou have graduated but have not sent a 2026
 * placement yet.
 */
export const CAREERS_2026 = [
  [
    "Aarush Inamdar",
    "2026",
    "Technology",
    "Creative Software",
    "Adobe",
    "Software Engineer",
  ],
  [
    "Alex Kao",
    "2026",
    "Finance",
    "Investment Banking",
    "JP Morgan",
    "Tech Investment Banking Analyst",
  ],
  [
    "Alexis Lin",
    "2026",
    "Misc",
    "Human Resources",
    "Amazon",
    "Sourcing Recruiter",
  ],
  [
    "Allen Lai",
    "2026",
    "Technology",
    "Software",
    "Optro",
    "Software Engineering Intern",
  ],
  ["Anna Shan", "2026", "Finance", "Asset Management", "BlackRock", "Analyst"],
  [
    "Anuj Patel",
    "2026",
    "Technology",
    "Machine Learning",
    "ThredUp",
    "Machine Learning Engineer Intern",
  ],
  [
    "Donny Chau",
    "2026",
    "Misc",
    "Product Management",
    "GlobalFoundries",
    "End Markets | Product Management Rotation Program",
  ],
  [
    "Emily Chien",
    "2026",
    "Misc",
    "Human Resources",
    "UPS",
    "Human Resources Intern",
  ],
  [
    "Izella Han",
    "2026",
    "Marketing",
    "Brand Marketing",
    "iWorld",
    "Marketing Associate",
  ],
  [
    "Lauren Cho",
    "2026",
    "Technology",
    "Solutions Engineering",
    "Capital Group",
    "Solutions Engineer",
  ],
  [
    "Luis Esparza",
    "2026",
    "Finance",
    "Data Analytics",
    "Capital One",
    "Data Analyst",
  ],
  [
    "Mason Whang",
    "2026",
    "Misc",
    "Media Production",
    "ELEVVVVVATED",
    "Associate Producer, DVP",
  ],
  [
    "Max Truong",
    "2026",
    "Technology",
    "Software",
    "Amazon",
    "Software Development Engineer",
  ],
  [
    "Megan Dihn",
    "2026",
    "Misc",
    "Human Resources",
    "Tesla",
    "Total Rewards Intern",
  ],
  [
    "Millicent Mei",
    "2026",
    "Marketing",
    "Brand Marketing",
    "DoorDash",
    "Marketing Ambassador",
  ],
  [
    "Pranav Rao",
    "2026",
    "Technology",
    "Hardware Engineering",
    "Tesla",
    "Hardware Engineering Intern: Failure Analysis & Testing",
  ],
  [
    "Pranay Macherla",
    "2026",
    "Misc",
    "Product Operations",
    "Tesla",
    "Product Operations Intern",
  ],
];

/**
 * Sheet rows plus the 2026 rows above, with the sheet winning on any
 * (name, year) it already covers.
 */
export function mergeCareerRows(sheetRows) {
  const rows = Array.isArray(sheetRows) ? sheetRows : [];
  const key = (row) =>
    `${String(row?.[0] ?? "")
      .trim()
      .toLowerCase()}|${String(row?.[1] ?? "").trim()}`;
  const fromSheet = new Set(rows.map(key));
  return [...rows, ...CAREERS_2026.filter((row) => !fromSheet.has(key(row)))];
}
