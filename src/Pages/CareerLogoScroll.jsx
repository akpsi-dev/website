import React from "react";
import "./CareerLogoScroll.css";
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
  TeslaLogo,
  HPELogo,
  SalesforceLogo,
  ARMLogo,
  ConcordiaLogo,
  BarclaysLogo,
  CapitalGroupLogo,
  DisneyLogo,
  RaytheonLogo,
  VisaLogo,
  SAPLogo,
  HyundaiLogo,
  CreditKarmaLogo,
  KimleyHornLogo,
  CenterviewPartnersLogo,
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
  { src: TeslaLogo, alt: "Tesla" },
  { src: SalesforceLogo, alt: "Salesforce" },
  { src: BarclaysLogo, alt: "Barclays" },
  { src: DisneyLogo, alt: "Disney" },
  { src: VisaLogo, alt: "Visa" },
  { src: SAPLogo, alt: "SAP" },
  { src: CapitalGroupLogo, alt: "Capital Group" },
  { src: RaytheonLogo, alt: "Raytheon" },
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
  { src: HPELogo, alt: "HPE" },
  { src: ARMLogo, alt: "Arm" },
  { src: ConcordiaLogo, alt: "Concordia" },
  { src: HyundaiLogo, alt: "Hyundai" },
  { src: CreditKarmaLogo, alt: "Credit Karma" },
  { src: KimleyHornLogo, alt: "Kimley-Horn" },
  /* Centerview is the only mark here with no alpha channel — it is a JPEG that
     is solid blue rgb(0, 86, 173) to all four corners, so it renders as a
     filled rectangle while every other logo floats on the strip. Kept because
     it was asked for; replace the file with a transparent PNG and it falls in
     line with the rest. */
  { src: CenterviewPartnersLogo, alt: "Centerview Partners" },
];

function LogoRow({ logos, direction = "forward" }) {
  return (
    <div className="logos-track-wrapper">
      <div
        className={`logos-slide ${direction === "reverse" ? "logos-slide-reverse" : ""}`}
      >
        {[...logos, ...logos].map((logo, i) => (
          <img key={i} src={logo.src} alt={logo.alt} loading="lazy" />
        ))}
      </div>
    </div>
  );
}

const CareerLogoScroller = () => {
  return (
    <div className="logos">
      <LogoRow logos={ROW_ONE} direction="forward" />
      <LogoRow logos={ROW_TWO} direction="reverse" />
    </div>
  );
};

export default CareerLogoScroller;
