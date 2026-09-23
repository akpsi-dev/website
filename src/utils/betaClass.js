import { headshotHash } from "../Assets/headshot";

/**
 * The Beta pledge class.
 *
 * Their form responses, held here rather than in the roster sheet, in the
 * same shape a sheet row has. Six of the ten have filled the form out;
 * Annabelle Butarbutar, Audrey Lam, Emily Chien and Simram Saini are still
 * a name and a graduation year alone.
 *
 * The class is ON, but betaClassRows only emits a member once they have
 * BOTH a write-up and a headshot registered in headshot.js, so this can
 * never put a grey placeholder on Meet Us: it shows whoever is ready and
 * holds the rest back. Today that is Pranav Rao alone — the other five who
 * have written their profiles are waiting on photos, and join the grid on
 * their own the moment a photo is registered under their name.
 *
 * To finish a member: add their headshot to src/Assets/ActiveHeadshots,
 * register it in headshot.js under their exact name, and fill in the fields
 * below. Moving the row into the roster sheet retires the entry here
 * entirely — a real sheet row always wins.
 */
export const BETA_CLASS_VISIBLE = true;

export const BETA_CLASS = [
  {
    fullName: "Annabelle Butarbutar",
    graduationYear: "2029",
  },
  {
    fullName: "Audrey Lam",
    graduationYear: "2029",
  },
  {
    fullName: "Braeden Yeoh",
    hometown: "Danville, CA",
    major: "Economics",
    graduationYear: "2029",
    linkedin: "https://www.linkedin.com/in/braedenyeoh",
    interests: [
      "House Music",
      "Traveling",
      "Clothes",
      "Music festivals",
      "Volleyball",
      "Financial Literacy",
    ],
    experience: [
      "Incoming Summer Analyst Intern - Deloitte",
      "Co-Founder - AgoraSphere",
      "Program Management Intern - UCI Alumni Association",
      "Credit Analyst Intern - Geovital",
      "Summer Analyst Intern - En Hoe Trading",
      "Growth Intern - Azcende VC",
    ],
    askMeAbout: [
      "My Faith",
      "Rep Hauls",
      "TBH",
      "Goma",
      "Living in Japan",
      "ISOKNOCK",
    ],
    whyAkpsi:
      "Some of the most genuine people I’ve ever met. Locked in, fun, accepting, and overly tuff.",
    spotify:
      "https://open.spotify.com/track/63IgbFgnPSWCQWzyH3ipAs?si=8IDfec44QaK71j5GbeOT9g&utm_source=copy-link",
  },
  {
    fullName: "Daniela Herrera",
    hometown: "Fullerton, CA",
    major: "Psychological Sciences & Informatics",
    graduationYear: "2027",
    linkedin: "https://www.linkedin.com/in/danie1aherrera",
    interests: [
      "Anime edits",
      "Izumi matcha",
      "Self improvement",
      "Vibe coding",
      "Content creation",
      "Cafe hopping",
      "Taking instagram pics",
    ],
    experience: [
      "Product Design Intern - Roblox",
      "Content Creator - TikTok/Instagram",
      "Growth - Perplexity",
      "Campus Ambassador - Figma",
      "Ambassador - HapaKristin",
      "Product Design Intern - JPMorganChase",
      "UX Designer - NASA",
      "UX Design Intern - 7 Leaves Cafe",
    ],
    askMeAbout: [
      "How I got into EDM",
      "Why rush as a 3rd year",
      "Why brainrotted people are smart",
      "Building your personal brand",
      "Quotes that constantly stick with me",
      "TBH",
    ],
    whyAkpsi: "AKΨ taught me to be consumed by my own ambition.",
    spotify:
      "https://open.spotify.com/track/2tdDlP8w9wFp7m41KimBf1?si=riPomATCQGW2VhIQ4bLn5g&utm_source=copy-link",
  },
  {
    fullName: "Emily Chien",
    graduationYear: "2029",
  },
  {
    fullName: "Levia Whang",
    hometown: "Alameda, CA",
    major: "Business Economics",
    graduationYear: "2029",
    linkedin: "https://www.linkedin.com/in/leviawhang",
    interests: ["Baking", "Reading", "Cafe hopping", "Traveling", "Music"],
    experience: [
      "Cohort Member - Girls Who Consult",
      "CalFresh Advocate - University of California, Irvine",
      "Program Intern - Bay Area Tutoring Organization",
      "Small Business Owner - Sogeum Spot",
    ],
    askMeAbout: [
      "NorCal vs. SoCal debate",
      "Sophie Elaine Choi",
      "The best spots in Korea",
      "True crime",
      "Salt bread",
      "TBH",
    ],
    whyAkpsi:
      "Joining AKPsi has given me a group of driven people to surround myself with, and through it I’ve gotten to experience so many amazing opportunities and make some of my favorite memories in college.",
    spotify:
      "https://open.spotify.com/track/2XK2iL9gSAlYIAbklTHxbk?si=59d57d5709284eb7",
  },
  {
    fullName: "Megan Dinh",
    hometown: "Los Angeles, CA",
    major: "Cognitive Sciences & Psychological Sciences",
    graduationYear: "2028",
    linkedin: "https://www.linkedin.com/in/megandinh27",
    interests: ["Sewing", "Hiking", "Cooking", "Fashion", "Trying new foods"],
    experience: [
      "Total Rewards Intern - Tesla",
      "Total Rewards Intern - Rexford Industrial Realty",
      "Vice President of Community Development - Human Resources Management Association",
      "Vice President of Operations - Students in Industrial Organizational Psychology",
      "Summer Researcher - UCLA Center of Developing Adolescent",
    ],
    askMeAbout: [
      "Side-questing in Austin, TX",
      "How to make the most out of your 5-9",
      "Growing up in Los Angeles",
      "Why I listen to every music genre",
      "TBH",
      "Nav Singh",
    ],
    whyAkpsi:
      "AKPsi has consistently pushed me to strive to be the best version of myself, both professionally and personally, and challenged me in ways I didn't expect when I first joined. Every day I'm surrounded by people who genuinely want to see me grow, which is what makes this chapter feel like home.",
    spotify:
      "https://open.spotify.com/track/0AHJWgA2mLYz2iFVwbCeod?si=V5mcMXo0QE6Et7grEZ0mPA&utm_source=copy-link",
  },
  {
    fullName: "Pranav Rao",
    hometown: "Santa Clara, CA",
    major: "Electrical Engineering",
    graduationYear: "2029",
    linkedin: "https://www.linkedin.com/in/pranavrao09",
    interests: [
      "Gym",
      "Entrepreneurship",
      "Badminton",
      "Photography",
      "Music Festivals",
      "Stocks",
    ],
    experience: [
      "Hardware Engineering Intern: Failure Analysis & Testing - Tesla",
      "Hardware R&D Engineer - HERO Lab",
      "Hardware Engineering Intern - Revvo Technologies",
      "NSF I-Corps Co-hort - UCI Beall Applied Innovation @ the Cove",
      "Co-Founder/Hardware Lead - ClimaCorre",
      "Open Project Space - IEEE",
      "Leadership in Freshmen Engineering - Engineering Student Council",
    ],
    askMeAbout: [
      "Nav Singh",
      "TBH",
      "B.E",
      "Life Philosophy",
      "Nootropics",
      "Larping",
      "Deftones",
    ],
    whyAkpsi:
      "AKPsi has been the single most influential factor in my professional growth, while also introducing me to some of the most genuine and compassionate people I’ve ever met.",
    spotify:
      "https://open.spotify.com/track/0B8QzDH7YWih85V5SEMnyJ?si=3d9d7c2e7aef4d41",
  },
  {
    fullName: "Simram Saini",
    graduationYear: "2029",
  },
  {
    fullName: "Sophie Choi",
    hometown: "Alameda, CA",
    major: "Business Economics",
    graduationYear: "2029",
    linkedin: "https://www.linkedin.com/in/sophieechoi",
    interests: ["Matcha", "Beaches", "Hiking", "Kuromi"],
    experience: [
      "Project Management Intern - International Exchange Program",
      "Marketing Intern - School-Based Health Center (YAB)",
      "Operations Intern - IMPACT",
      "Program Intern - Life University",
    ],
    askMeAbout: [
      "Crime podcasts",
      "The Bay",
      "Fav cafes",
      "Living in Maryland",
      "Levia Whang",
      "TBH",
    ],
    whyAkpsi:
      "AKPsi has introduced me to so many ambitious people who motivate me to grow and get out of my comfort zone.",
    spotify:
      "https://open.spotify.com/track/5ftR963YlX88OeCAPnXG2Z?si=5feda959e367408f",
  },
];

/**
 * Whether a member is ready to be shown: their own words, and a photo.
 *
 * A member who is not ready is left out rather than emitted blank, because a
 * row carrying a name and nothing else renders a grey placeholder card above
 * an empty profile — the thing this file exists to avoid.
 */
export function isBetaMemberReady(member) {
  return Boolean(
    member?.fullName &&
      member.whyAkpsi &&
      Object.prototype.hasOwnProperty.call(headshotHash, member.fullName),
  );
}

/* The list cells are newline separated: the shape splitItems expects, and
   the shape the form's own textareas produce. */
const cell = (value) =>
  Array.isArray(value) ? value.join("\n") : (value ?? "");

/**
 * The ready members in the roster's own column order, so they flow through
 * the same grid, slug and profile code as a real sheet row:
 *
 *   [Name, Hometown, Major, Pledge Class, Grad Year, LinkedIn, Interests,
 *    Experience, Ask Me About, Why AKPsi, Spotify]
 */
export function betaClassRows() {
  return BETA_CLASS.filter(isBetaMemberReady).map((member) => [
    member.fullName,
    cell(member.hometown),
    cell(member.major),
    "Beta",
    member.graduationYear,
    cell(member.linkedin),
    cell(member.interests),
    cell(member.experience),
    cell(member.askMeAbout),
    cell(member.whyAkpsi),
    cell(member.spotify),
  ]);
}
