import {
  AcornsLogo,
  AdobeLogo,
  AmazonLogo,
  AmexLogo,
  AppleLogo,
  BainLogo,
  BakerTillyLogo,
  BiologicalSciencesLogo,
  bloomberglogo,
  CaliforniaISOLogo,
  CapitalGroupLogo,
  CapitalOneLogo,
  DeloitteLogo,
  doordashlogo,
  EdisonLogo,
  EYLogo,
  ExperianLogo,
  FacebookLogo,
  fazelogo,
  GitHubLogo,
  GlobalFoundriesLogo,
  GoogleLogo,
  intellogo,
  JPMorganLogo,
  KaiserPermanenteLogo,
  kpmglogo,
  LinkedInLogo,
  MeetTheFlockersLogo,
  MerageLogo,
  metalogo,
  MonsterLogo,
  nasalogo,
  nbclogo,
  oraclelogo,
  paramountLogo,
  protivitilogo,
  PWCLogo,
  RaytheonLogo,
  RedbullLogo,
  ReitLogo,
  RippleMatchLogo,
  RumeLogo,
  RyanLLCLogo,
  SAPLogo,
  SiemensLogo,
  statefarmlogo,
  TakenakaPartnersLogo,
  ThalesLogo,
  TiktokLogo,
  TinderLogo,
  UBSLogo,
  USAALogo,
  vmwarelogo,
  walmartlogo,
  warnbroslogo,
  WiseAssistantLogo,
} from "../Assets";

/* Company arrives from the sheet as free text typed by whoever filled the
   form, and the logo set is a fixed list of about 130 marks. The sheet
   currently holds 170 distinct company strings, so the great majority of rows
   have no logo and never will — the monogram is the normal case, not the
   error case, and the row has to look deliberate without artwork.

   Note companyHash in src/Assets/company.js does NOT help here: it is keyed by
   brother name, not company, so it answers "where does this person work"
   rather than "what does this company look like". This map is the company-keyed
   one the ledger needs. */

/* Trailing legal boilerplate, stripped so "Ryan LLC" and "Ryan" agree. Only
   ever removed from the end, and "group" is deliberately absent: dropping it
   would fold Capital Group into a different company entirely. */
const LEGAL_SUFFIXES = new Set([
  "inc",
  "llc",
  "llp",
  "lp",
  "ltd",
  "plc",
  "apc",
  "corp",
  "corporation",
  "co",
  "company",
  "cpas",
  "se",
  "sa",
  "gmbh",
  "and",
]);

/**
 * Folds a free-text company name to a comparison key.
 *
 * Case, accents, punctuation and trailing legal suffixes all vary row to row
 * in the sheet — "Bakertilly" and "Baker Tilly", "CapitalOne" and "Capital
 * One", "Tik Tok" and "TikTok", "Guayakí" — and none of those differences mean
 * a different employer.
 */
export function normalizeCompany(raw) {
  let s = String(raw ?? "")
    .normalize("NFD")
    // Strip combining marks so Guayakí matches guayaki.
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    // "&" and "and" are written interchangeably; settle on the word so
    // "Bain & Company" and "Bain and Company" fold together.
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  // Repeated because "Ronald Blue and Co CPAs" sheds three tokens: cpas, co,
  // and then the dangling "and".
  let parts = s.split(" ").filter(Boolean);
  while (parts.length > 1 && LEGAL_SUFFIXES.has(parts[parts.length - 1])) {
    parts.pop();
  }
  return parts.join(" ");
}

/* Keyed by normalized name. Several entries exist only to catch a spelling
   that actually appears in the sheet — "Kaiser Permananente" is a typo in the
   source data, "Price Waterhouse Coopers" is the long form of PwC — and are
   cheaper to record here than to correct upstream in a form nobody controls. */
const COMPANY_LOGOS = {
  acorns: AcornsLogo,
  adobe: AdobeLogo,
  amazon: AmazonLogo,
  "amazon web services": AmazonLogo,
  "american express": AmexLogo,
  apple: AppleLogo,
  bain: BainLogo,
  "baker tilly": BakerTillyLogo,
  bloomberg: bloomberglogo,
  "california iso": CaliforniaISOLogo,
  "capital group": CapitalGroupLogo,
  "capital one": CapitalOneLogo,
  deloitte: DeloitteLogo,
  doordash: doordashlogo,
  "edison electric": EdisonLogo,
  "ernst and young": EYLogo,
  ey: EYLogo,
  experian: ExperianLogo,
  facebook: FacebookLogo,
  "faze clan": fazelogo,
  github: GitHubLogo,
  globalfoundries: GlobalFoundriesLogo,
  google: GoogleLogo,
  intel: intellogo,
  "jp morgan": JPMorganLogo,
  "jp morgan chase": JPMorganLogo,
  "kaiser permanente": KaiserPermanenteLogo,
  "kaiser permananente": KaiserPermanenteLogo,
  kpmg: kpmglogo,
  linkedin: LinkedInLogo,
  meettheflockers: MeetTheFlockersLogo,
  merage: MerageLogo,
  "merage deans suite": MerageLogo,
  meta: metalogo,
  "monster energy": MonsterLogo,
  nasa: nasalogo,
  nbcuniversal: nbclogo,
  "nbcuniversal peacock": nbclogo,
  oracle: oraclelogo,
  "paramount global": paramountLogo,
  "price waterhouse coopers": PWCLogo,
  protiviti: protivitilogo,
  pwc: PWCLogo,
  raytheon: RaytheonLogo,
  "raytheon technologies": RaytheonLogo,
  "red bull": RedbullLogo,
  ripplematch: RippleMatchLogo,
  rume: RumeLogo,
  ryan: RyanLLCLogo,
  "sabra health care reit": ReitLogo,
  sap: SAPLogo,
  siemens: SiemensLogo,
  "siemens plm software": SiemensLogo,
  "state farm": statefarmlogo,
  "takenaka partners": TakenakaPartnersLogo,
  thales: ThalesLogo,
  tiktok: TiktokLogo,
  tinder: TinderLogo,
  ubs: UBSLogo,
  "uci biological sciences": BiologicalSciencesLogo,
  usaa: USAALogo,
  vmware: vmwarelogo,
  walmart: walmartlogo,
  "warner bros": warnbroslogo,
  "warner brothers": warnbroslogo,
  "wise assistant": WiseAssistantLogo,
};

/* Artwork exists for these, but it is a solid rectangle with no transparency:
   dropped into a 34px box on a dark row it reads as a white brick rather than
   a mark. The monogram is the better-looking answer until someone supplies a
   version with an alpha channel, at which point deleting the entry here is the
   whole change. */
const OPAQUE_ARTWORK = new Set([
  "wells fargo",
  "microsoft",
  "concordia",
  "concordia capital",
]);

/* Whether a name is written open or closed is not a difference in employer —
   the sheet holds "Baker Tilly" and "Bakertilly", "Capital One" and
   "CapitalOne", "Tik Tok" and "TikTok". Rather than enumerate both spellings
   of each, the lookup falls back to a space-free key. Built once here instead
   of per row.

   Deliberately a second pass, not a change to normalizeCompany: the spaced key
   stays the primary match, so two genuinely different companies that collide
   only once their spaces are removed still resolve on the exact form first. */
const SPACELESS_LOGOS = Object.entries(COMPANY_LOGOS).reduce(
  (index, [name, logo]) => {
    const key = name.replace(/ /g, "");
    // First spelling wins; later collisions are ignored rather than
    // overwriting a mark that already matched exactly.
    if (!(key in index)) index[key] = logo;
    return index;
  },
  {},
);

const SPACELESS_OPAQUE = new Set(
  [...OPAQUE_ARTWORK].map((name) => name.replace(/ /g, "")),
);

/**
 * The logo for a company, or null when the row should fall back to a monogram.
 */
export function lookupCompanyLogo(raw) {
  const key = normalizeCompany(raw);
  if (!key) return null;
  const squashed = key.replace(/ /g, "");
  if (OPAQUE_ARTWORK.has(key) || SPACELESS_OPAQUE.has(squashed)) return null;
  return COMPANY_LOGOS[key] ?? SPACELESS_LOGOS[squashed] ?? null;
}

/**
 * The single character shown when there is no usable logo.
 *
 * Taken from the normalized name so punctuation and stray quotes cannot become
 * the monogram — "5-hour ENERGY" gives 5, not a dash.
 */
export function companyMonogram(raw) {
  const key = normalizeCompany(raw);
  return key ? key[0].toUpperCase() : "—";
}
