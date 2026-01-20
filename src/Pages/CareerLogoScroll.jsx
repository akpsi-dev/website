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
  BlackrockLogo
} from "../Assets";

const CareerLogoScroller = () => {
  return (
    <div className="logos">
      <div className="logos-slide">
        <img src={bloomberglogo} alt="Bloomberg" />
        <img src={GoogleLogo} alt="Google" />
        <img src={AppleLogo} alt="Apple" />
        <img src={DeloitteLogo} alt="Deloitte" />
        <img src={AdobeLogo} alt="Adobe" />
        <img src={EYLogo} alt="EY" />
        <img src={MicrosoftLogo} alt="Microsoft" />
        <img src={TiktokLogo} alt="Tiktok" />
        <img src={WellsFargoLogo} alt="Wells Fargo" />
        <img src={BainLogo} alt="Redbull" />
        <img src={nasalogo} alt="NASA" />
        <img src={GitHubLogo} alt="Warner Bros" />
        <img src={TinderLogo} alt="Tinder" />
        <img src={vmwarelogo} alt="vmware" />
        <img src={LinkedInLogo} alt="LinkedIn" />
        <img src={AmazonLogo} alt="Amazon" />
        <img src={metalogo} alt="Meta" />
        <img src={CapitalOneLogo} alt="Capital One" />
        <img src={BandCLogo} alt="Bain and Co" />
        <img src={doordashlogo} alt="Doordash" />
        <img src={hpLogo} alt="HP" />
        <img src={oraclelogo} alt="Oracle" />
        <img src={paramountLogo} alt="Paramount" />
        <img src={intellogo} alt="Intel" />
        <img src={kialogo} alt="KIA" />
        <img src={BlackrockLogo} alt="BlackRock" />
        <img src={walmartlogo} alt="Walmart" />
        <img src={nbclogo} alt="NBC" />
        <img src={kpmglogo} alt="KPMG" />
        <img src={JPMorganLogo} alt="JPMorgan" />
        <img src={protivitilogo} alt="Protiviti" />
        <img src={fazelogo} alt="Faze" />
        <img src={statefarmlogo} alt="Statefarm" />
        <img src={PWCLogo} alt="PWC" />
        <img src={redbulllogo} alt="Redbull" />
        <img src={warnbroslogo} alt="Warner Bros" />
      </div>
    </div>
  );
};

export default CareerLogoScroller;
