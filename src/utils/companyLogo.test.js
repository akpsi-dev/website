import {
  normalizeCompany,
  lookupCompanyLogo,
  companyMonogram,
} from "./companyLogo";

/* Every string quoted here is one that actually appears in the careers sheet.
   The point of the fallback is that it holds for the ~170 distinct company
   names typed into a form nobody validates, so the fixtures come from the
   data rather than from what would be convenient to pass. */

describe("normalizeCompany", () => {
  it("folds case variants together", () => {
    expect(normalizeCompany("PWC")).toBe(normalizeCompany("PwC"));
    expect(normalizeCompany("GlobalFoundries")).toBe(
      normalizeCompany("globalfoundries"),
    );
  });

  /* Spacing is deliberately NOT folded here — "baker tilly" and "bakertilly"
     stay distinct keys, and it is lookupCompanyLogo that reconciles them. That
     keeps the exact spelling as the primary match. */
  it("preserves word boundaries", () => {
    expect(normalizeCompany("Baker Tilly")).toBe("baker tilly");
    expect(normalizeCompany("Bakertilly")).toBe("bakertilly");
  });

  it("strips trailing legal suffixes, including several in a row", () => {
    expect(normalizeCompany("Ryan LLC")).toBe("ryan");
    expect(normalizeCompany("SAP SE")).toBe("sap");
    expect(normalizeCompany("Custom Research Labs, Inc.")).toBe(
      "custom research labs",
    );
    // cpas, then co, then the dangling "and"
    expect(normalizeCompany("Ronald Blue and Co CPAs")).toBe("ronald blue");
    expect(normalizeCompany("Bain & Company")).toBe("bain");
  });

  it("does not strip words that only look like suffixes", () => {
    // "group" is not boilerplate here — dropping it would merge Capital Group
    // into Capital One's neighbourhood of names.
    expect(normalizeCompany("Capital Group")).toBe("capital group");
    expect(normalizeCompany("The VOS Group")).toBe("the vos group");
  });

  it("removes accents without splitting the word", () => {
    expect(normalizeCompany("Guayakí")).toBe("guayaki");
    // A combining mark mid-string must not become a space.
    expect(normalizeCompany("José García")).toBe("jose garcia");
  });

  it("never strips the only token", () => {
    expect(normalizeCompany("Co")).toBe("co");
  });

  it("returns empty for blank or missing input", () => {
    expect(normalizeCompany("")).toBe("");
    expect(normalizeCompany(null)).toBe("");
    expect(normalizeCompany(undefined)).toBe("");
    expect(normalizeCompany("   ")).toBe("");
  });
});

describe("lookupCompanyLogo", () => {
  it("matches spelling variants to the same logo", () => {
    // Spacing differences are reconciled by the space-free fallback, so only
    // one spelling of each of these is listed in the map.
    expect(lookupCompanyLogo("Baker Tilly")).toBe(
      lookupCompanyLogo("Bakertilly"),
    );
    expect(lookupCompanyLogo("Capital One")).toBe(
      lookupCompanyLogo("CapitalOne"),
    );
    expect(lookupCompanyLogo("PWC")).toBe(lookupCompanyLogo("PwC"));
    expect(lookupCompanyLogo("PwC")).toBe(
      lookupCompanyLogo("Price Waterhouse Coopers"),
    );
    expect(lookupCompanyLogo("Tik Tok")).toBe(lookupCompanyLogo("TikTok"));
    expect(lookupCompanyLogo("EY")).toBe(lookupCompanyLogo("Ernst & Young"));
    expect(lookupCompanyLogo("Amazon")).toBe(
      lookupCompanyLogo("Amazon Web Services"),
    );
  });

  it("finds a logo through a legal suffix", () => {
    expect(lookupCompanyLogo("Ryan LLC")).toBeTruthy();
    expect(lookupCompanyLogo("SAP SE")).toBeTruthy();
    expect(lookupCompanyLogo("Bain & Company")).toBeTruthy();
  });

  it("tolerates the misspelling that exists in the sheet", () => {
    expect(lookupCompanyLogo("Kaiser Permananente")).toBe(
      lookupCompanyLogo("Kaiser Permanente"),
    );
  });

  it("returns null for companies with no artwork, which is most of them", () => {
    expect(lookupCompanyLogo("Sapphire Delight LTD")).toBeNull();
    expect(lookupCompanyLogo("Tomikawa Japanese Restaurant")).toBeNull();
    expect(lookupCompanyLogo("5-hour ENERGY")).toBeNull();
    expect(lookupCompanyLogo("")).toBeNull();
    expect(lookupCompanyLogo(undefined)).toBeNull();
  });

  it("refuses known-opaque artwork so those rows use the monogram", () => {
    expect(lookupCompanyLogo("Wells Fargo")).toBeNull();
    expect(lookupCompanyLogo("Microsoft")).toBeNull();
    expect(lookupCompanyLogo("Concordia Capital")).toBeNull();
  });
});

describe("companyMonogram", () => {
  it("takes the first letter, uppercased", () => {
    expect(companyMonogram("Deloitte")).toBe("D");
    expect(companyMonogram("bloomberg")).toBe("B");
  });

  it("skips leading punctuation rather than showing it", () => {
    expect(companyMonogram("5-hour ENERGY")).toBe("5");
    expect(companyMonogram("  Ingram Micro")).toBe("I");
  });

  it("falls back to a dash when there is no company at all", () => {
    expect(companyMonogram("")).toBe("—");
    expect(companyMonogram(null)).toBe("—");
  });
});
