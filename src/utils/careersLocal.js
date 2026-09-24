/**
 * Placements held in the repo, because the Careers sheet can only be read with
 * the API keys in .env — writing to it needs OAuth. These rows merge with
 * whatever the sheet returns, and a sheet row for the same brother and year
 * wins, so moving a row into the sheet is enough to retire its entry here.
 *
 * Row shape matches CAREERS_RANGE exactly:
 *   [Name, Year, Category, Sector, Company, Position]
 *
 * Category must be one of the six CATEGORIES in CareerTable, or the row lands
 * in Misc. Sector is free text and shows as the heading above the row.
 *
 * The Year column is what files a row under a tab, so this list spans years:
 * 2026 for brothers in these roles this summer, 2027 for the ones who are
 * incoming on them. Sorted by year, then by name within the year.
 *
 * Not every row is a graduating senior — actives list their internships here
 * too, the same way earlier years mix the two.
 *
 * Still to come: Alex Sriprathum, Carl Qiao, Daniel Kim, David Kim, Ryan Park,
 * Sarah Kim and Yan Amy Zhou have graduated but have not sent a placement yet.
 */
export const LOCAL_CAREERS = [
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
  [
    "Andrew Sou",
    "2026",
    "Technology",
    "Software",
    "Roche",
    "Software Engineering Intern",
  ],
  ["Anna Shan", "2026", "Finance", "Asset Management", "BlackRock", "Analyst"],
  [
    "Annie Nguyen",
    "2026",
    "Consulting",
    "Solutions Consulting",
    "Adobe",
    "Solutions Consulting Analyst",
  ],
  [
    "Annie Nguyen",
    "2026",
    "Technology",
    "Student Ambassador",
    "Microsoft",
    "Copilot Ambassador",
  ],
  [
    "Anuj Patel",
    "2026",
    "Technology",
    "Machine Learning",
    "ThredUp",
    "Machine Learning Engineer Intern",
  ],
  [
    "Ashley Kang",
    "2026",
    "Misc",
    "Global Operations",
    "Wells Fargo",
    "Global Operations Intern",
  ],
  [
    "Ashlyn Wong",
    "2026",
    "Misc",
    "Content Operations",
    "Disney",
    "DTC Content Operations Intern",
  ],
  [
    "Ashton Creveling",
    "2026",
    "Misc",
    "Creative Services",
    "Paramount",
    "Creative Services Intern",
  ],
  ["Bradly Ho", "2026", "Accounting", "Professional Services", "PwC", "Intern"],
  [
    "Catelynn Chen",
    "2026",
    "Finance",
    "Data Science",
    "Capital Group",
    "Data Science Summer Associate",
  ],
  [
    "Christine Lee",
    "2026",
    "Marketing",
    "Brand Ambassador",
    "Taco Bell",
    "Live Mas Ambassador",
  ],
  [
    "Daniela Herrera",
    "2026",
    "Technology",
    "Product Design",
    "Roblox",
    "Product Design Intern",
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
    "Ethan Le",
    "2026",
    "Technology",
    "Hardware Validation",
    "Intel",
    "NPU Validation Intern",
  ],
  [
    "Ethan Lee",
    "2026",
    "Misc",
    "Legal and Compliance",
    "Capital Group",
    "Legal and Compliance Summer Associate",
  ],
  [
    "Gabrielle Reyes",
    "2026",
    "Misc",
    "Entrepreneurship",
    "Hallway Bites",
    "Business Owner",
  ],
  [
    "Grace Ryu",
    "2026",
    "Marketing",
    "Campus Ambassador",
    "Olipop",
    "Campus Ambassador",
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
    "James Fitzpatrick",
    "2026",
    "Finance",
    "Investment Banking",
    "Concordia Capital",
    "Investment Banking Summer Analyst",
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
    "Levia Whang",
    "2026",
    "Consulting",
    "Cohort Program",
    "Girls Who Consult",
    "Cohort Member",
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
    "Max Vano",
    "2026",
    "Marketing",
    "Product Marketing",
    "Salesforce",
    "Product Marketing Intern",
  ],
  [
    "Megan Dinh",
    "2026",
    "Misc",
    "Human Resources",
    "Tesla",
    "Total Rewards Intern",
  ],
  [
    "Melinda Do",
    "2026",
    "Marketing",
    "Brand Ambassador",
    "Taco Bell",
    "Marketing Ambassador",
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
    "Nico Simonian",
    "2026",
    "Finance",
    "Corporate Finance",
    "ARM",
    "FP&A Intern",
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
  [
    "Rishi Murumkar",
    "2026",
    "Technology",
    "Software",
    "Amazon Web Services",
    "Software Engineering Intern",
  ],
  [
    "Sophie Choi",
    "2026",
    "Misc",
    "Project Management",
    "International Exchange Program",
    "Project Management Intern",
  ],
  [
    "Tommy Nguyen",
    "2026",
    "Marketing",
    "Brand Ambassador",
    "Celsius Holdings",
    "Student Marketing Ambassador",
  ],

  // 2027 — signed, but incoming: these start in 2027 rather than this summer,
  // which is the only reason they are not in the 2026 block above.
  [
    "Braeden Yeoh",
    "2027",
    "Accounting",
    "Audit and Assurance",
    "Deloitte",
    "Audit and Assurance Intern",
  ],
  [
    "Logan Kim",
    "2027",
    "Finance",
    "Investment Banking",
    "Centerview Partners",
    "Summer Analyst",
  ],
  [
    "Max Truong",
    "2027",
    "Technology",
    "Forward Deployed Engineering",
    "Palantir",
    "Forward Deployed Engineering Intern",
  ],
  [
    "Rishi Murumkar",
    "2027",
    "Technology",
    "Software",
    "Notion",
    "Software Engineering Intern",
  ],
  [
    "Tyler Ho",
    "2027",
    "Finance",
    "Investment Banking",
    "Barclays",
    "Investment Banking Summer Analyst",
  ],
];

/**
 * Sheet rows plus the local rows above, with the sheet winning on any
 * (name, year) it already covers.
 */
export function mergeCareerRows(sheetRows) {
  const rows = Array.isArray(sheetRows) ? sheetRows : [];
  const key = (row) =>
    `${String(row?.[0] ?? "")
      .trim()
      .toLowerCase()}|${String(row?.[1] ?? "").trim()}`;
  const fromSheet = new Set(rows.map(key));
  return [...rows, ...LOCAL_CAREERS.filter((row) => !fromSheet.has(key(row)))];
}
