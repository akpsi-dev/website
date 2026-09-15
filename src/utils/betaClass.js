/**
 * The Beta pledge class.
 *
 * A shell: we have names, pledge class and graduation year, and nothing else.
 * Headshots and the profile fields the members write themselves are still to
 * come, so the class is kept OFF the site until then — flip
 * BETA_CLASS_VISIBLE to true once the photos and write-ups land.
 *
 * To finish a member: add their headshot to src/Assets/ActiveHeadshots and
 * register it in headshot.js, then fill the blank cells below (or move the
 * row into the roster sheet, which supersedes this file entirely).
 */
export const BETA_CLASS_VISIBLE = false;

export const BETA_CLASS = [
  { fullName: "Annabelle Butarbutar", graduationYear: "2029" },
  { fullName: "Audrey Lam", graduationYear: "2029" },
  { fullName: "Braeden Yeoh", graduationYear: "2029" },
  { fullName: "Daniela Herrera", graduationYear: "2027" },
  { fullName: "Emily Chien", graduationYear: "2029" },
  { fullName: "Levia Whang", graduationYear: "2029" },
  { fullName: "Megan Dinh", graduationYear: "2028" },
  { fullName: "Pranav Rao", graduationYear: "2029" },
  { fullName: "Simram Saini", graduationYear: "2029" },
  { fullName: "Sophie Choi", graduationYear: "2029" },
];

/**
 * Shell rows in the roster's own column order, so they flow through the same
 * grid, slug and profile code as a real sheet row:
 *
 *   [Name, Hometown, Major, Pledge Class, Grad Year, LinkedIn, Interests,
 *    Experience, Ask Me About, Why AKPsi, Spotify]
 */
export function betaClassRows() {
  return BETA_CLASS.map(({ fullName, graduationYear }) => [
    fullName,
    "",
    "",
    "Beta",
    graduationYear,
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
}
