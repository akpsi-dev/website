/**
 * The leadership roster, in display order.
 *
 * This overrides the "Leadership Test" sheet rather than reading them. The
 * sheet still lags a term behind and we were asked not to edit it, so the
 * board below is the source of truth for the Leadership tab. Editing the
 * sheet will NOT change this page until this file is removed and MeetUs
 * goes back to the fetched rows.
 *
 * Order here is display order — ExecutiveBoardList renders each section in
 * array order, so no sorting happens downstream.
 */
export const LEADERSHIP_ROSTER = [
  { fullName: "Erin Tran", leadershipType: "Cabinet", position: "President" },
  {
    fullName: "Melinda Do",
    leadershipType: "Cabinet",
    position: "Executive Vice President",
  },
  {
    fullName: "Ethan Lee",
    leadershipType: "Cabinet",
    position: "Vice President of Internal Communications",
  },
  {
    fullName: "Christine Lee",
    leadershipType: "Cabinet",
    position: "Vice President of Chapter Operations",
  },
  {
    fullName: "Nico Simonian",
    leadershipType: "Cabinet",
    position: "Vice President of Treasury",
  },
  {
    fullName: "Annie Nguyen",
    leadershipType: "Cabinet",
    position: "Vice President of Professional Development",
  },
  {
    fullName: "Tommy Nguyen",
    leadershipType: "Cabinet",
    position: "Vice President of Membership",
  },
  {
    fullName: "Ashton Creveling",
    leadershipType: "Cabinet",
    position: "Vice President of Marketing",
  },
  /* Audrey Lam takes Philanthropy, but has no headshot or roster entry yet —
     Grace Ryu stands in until her photo lands. */
  {
    fullName: "Grace Ryu",
    leadershipType: "Executive Board",
    position: "Philanthropy Chairman",
  },
  {
    fullName: "Ava Lily Tran",
    leadershipType: "Executive Board",
    position: "Social and External Affairs Chairman",
  },
  /* Technology Chairman has changed hands, but the incoming chair has no
     roster entry or headshot yet — Brandon Peng stands in until it lands. */
  {
    fullName: "Brandon Peng",
    leadershipType: "Executive Board",
    position: "Technology Chairman",
  },
  {
    fullName: "Ethan Le",
    leadershipType: "Executive Board",
    position: "Alumni Relations Chairman",
  },
  {
    fullName: "Millicent Mei",
    leadershipType: "Executive Board",
    position: "Content Creation Chairman",
  },
  {
    fullName: "Tyler Ho",
    leadershipType: "Executive Board",
    position: "Professional Advancement Chairman",
  },
];
