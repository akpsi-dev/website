import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Alpha Kappa Psi - UCI";
const DEFAULT_DESCRIPTION =
  "The official website for the UCI Chapter of Professional Business Fraternity - Alpha Kappa Psi";

export default function Seo({ title, description = DEFAULT_DESCRIPTION }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
    </Helmet>
  );
}
