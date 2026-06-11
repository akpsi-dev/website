import React from "react";
import "./CareerLogoScroll.css";
import { useMotionPrefs } from "../utils/useMotionPrefs";
import {
  GoogleLogo,
  AppleLogo,
  DeloitteLogo,
  AdobeLogo,
  EYLogo,
  MicrosoftLogo,
  TiktokLogo,
  JPMorganLogo,
  WellsFargoLogo,
  TinderLogo,
  LinkedInLogo,
  kpmglogo,
  metalogo,
  CapitalOneLogo,
  BandCLogo,
  doordashlogo,
  bloomberglogo,
  fazelogo,
  hpLogo,
  intellogo,
  kialogo,
  nasalogo,
  nbclogo,
  oraclelogo,
  paramountLogo,
  protivitilogo,
  PWCLogo,
  redbulllogo,
  statefarmlogo,
  vmwarelogo,
  walmartlogo,
  warnbroslogo,
  GitHubLogo,
  BainLogo,
  AmazonLogo,
  BlackrockLogo,
} from "../Assets";

const ROW_ONE = [
  { src: bloomberglogo, alt: "Bloomberg" },
  { src: GoogleLogo, alt: "Google" },
  { src: AppleLogo, alt: "Apple" },
  { src: DeloitteLogo, alt: "Deloitte" },
  { src: AdobeLogo, alt: "Adobe" },
  { src: EYLogo, alt: "EY" },
  { src: MicrosoftLogo, alt: "Microsoft" },
  { src: TiktokLogo, alt: "TikTok" },
  { src: WellsFargoLogo, alt: "Wells Fargo" },
  { src: BainLogo, alt: "Bain" },
  { src: nasalogo, alt: "NASA" },
  { src: GitHubLogo, alt: "GitHub" },
  { src: TinderLogo, alt: "Tinder" },
  { src: vmwarelogo, alt: "VMware" },
  { src: LinkedInLogo, alt: "LinkedIn" },
  { src: AmazonLogo, alt: "Amazon" },
  { src: BlackrockLogo, alt: "BlackRock" },
  { src: JPMorganLogo, alt: "JPMorgan" },
];

const ROW_TWO = [
  { src: metalogo, alt: "Meta" },
  { src: CapitalOneLogo, alt: "Capital One" },
  { src: BandCLogo, alt: "Bain & Co" },
  { src: doordashlogo, alt: "DoorDash" },
  { src: hpLogo, alt: "HP" },
  { src: oraclelogo, alt: "Oracle" },
  { src: paramountLogo, alt: "Paramount" },
  { src: intellogo, alt: "Intel" },
  { src: kialogo, alt: "KIA" },
  { src: walmartlogo, alt: "Walmart" },
  { src: nbclogo, alt: "NBC" },
  { src: kpmglogo, alt: "KPMG" },
  { src: protivitilogo, alt: "Protiviti" },
  { src: fazelogo, alt: "FaZe" },
  { src: statefarmlogo, alt: "State Farm" },
  { src: PWCLogo, alt: "PwC" },
  { src: redbulllogo, alt: "Red Bull" },
  { src: warnbroslogo, alt: "Warner Bros" },
];

function LogoRow({ logos, direction = "forward" }) {
  return (
    <div className="logo-wall__row">
      <div
        className={`logo-wall__track${direction === "reverse" ? " logo-wall__track--reverse" : ""}`}
      >
        {[...logos, ...logos].map((logo, i) => (
          <img
            key={i}
            src={logo.src}
            alt={i < logos.length ? logo.alt : ""}
            aria-hidden={i >= logos.length}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

export default function CareerLogoScroller() {
  const { reducedMotion } = useMotionPrefs();
  return (
    <div className={`logo-wall${reducedMotion ? " logo-wall--paused" : ""}`}>
      <LogoRow logos={ROW_ONE} direction="forward" />
      <LogoRow logos={ROW_TWO} direction="reverse" />
    </div>
  );
}
