import {
  cityServicePath,
  countySlug as makeCountySlug,
  routeSlug,
} from "../lib/slugs.js";

const serviceLabels = {
  "tree-removal": "Tree Removal",
  "stump-grinding": "Stump Grinding",
  "emergency-service": "Emergency Tree Service",
};

const serviceDescriptions = {
  "tree-removal": "risk review, permit questions, removal planning, and property protection",
  "stump-grinding": "surface restoration, root flare cleanup, chip handling, and replanting prep",
  "emergency-service": "storm damage, blocked access, hanging limbs, and urgent hazard coordination",
};

const priorityCities = [
  { city: "DeLand", county: "Volusia", slug: "deland" },
  { city: "Glen Saint Mary", county: "Baker", slug: "glen-saint-mary" },
  { city: "Macclenny", county: "Baker", slug: "macclenny" },
  { city: "Masaryktown", county: "Hernando", slug: "masaryktown" },
  { city: "Dune Allen Beach", county: "Walton", slug: "dune-allen-beach" },
  { city: "Fort Lauderdale", county: "Broward", slug: "fort-lauderdale" },
  { city: "Tallahassee", county: "Leon", slug: "tallahassee" },
  { city: "Lake City", county: "Columbia", slug: "lake-city" },
  { city: "Destin", county: "Okaloosa", slug: "destin" },
  { city: "Cooper City", county: "Broward", slug: "cooper-city" },
  { city: "Lutz", county: "Hillsborough", slug: "lutz" },
  { city: "Homosassa", county: "Citrus", slug: "homosassa" },
  { city: "Miramar", county: "Broward", slug: "miramar" },
];

export const protectedCoreMoneyUrls = [
  "/tree-removal-dune-allen-beach/",
  "/tree-removal-fort-lauderdale/",
  "/tree-removal-masaryktown/",
  "/stump-grinding-dune-allen-beach/",
  "/stump-grinding-fort-lauderdale/",
  "/tree-removal-deland/",
  "/tree-removal-glen-saint-mary/",
  "/tree-removal-macclenny/",
  "/emergency-service-deland/",
  "/emergency-service-glen-saint-mary/",
  "/emergency-service-macclenny/",
  "/emergency-service-masaryktown/",
  "/stump-grinding-deland/",
  "/stump-grinding-glen-saint-mary/",
  "/stump-grinding-macclenny/",
  "/stump-grinding-masaryktown/",
  "/emergency-service-lake-city/",
  "/stump-grinding-cooper-city/",
  "/stump-grinding-destin/",
  "/emergency-service-dune-allen-beach/",
  "/emergency-service-lutz/",
  "/stump-grinding-homosassa/",
  "/stump-grinding-miramar/",
  "/tree-removal-tallahassee/",
];

export const phaseOneExpansionCandidates = [
  { city: "Jacksonville", county: "Duval", slug: "jacksonville", servicePrefix: "tree-removal" },
  { city: "Miami", county: "Miami-Dade", slug: "miami", servicePrefix: "tree-removal" },
  { city: "Tampa", county: "Hillsborough", slug: "tampa", servicePrefix: "tree-removal" },
  { city: "Orlando", county: "Orange", slug: "orlando", servicePrefix: "tree-removal" },
  { city: "Cape Coral", county: "Lee", slug: "cape-coral", servicePrefix: "tree-removal" },
  { city: "Hollywood", county: "Broward", slug: "hollywood", servicePrefix: "tree-removal" },
  { city: "Lakeland", county: "Polk", slug: "lakeland", servicePrefix: "tree-removal" },
  { city: "Bradenton", county: "Manatee", slug: "bradenton", servicePrefix: "tree-removal" },
  { city: "Ocala", county: "Marion", slug: "ocala", servicePrefix: "tree-removal" },
  { city: "Stuart", county: "Martin", slug: "stuart", servicePrefix: "tree-removal" },
  { city: "Vero Beach", county: "Indian River", slug: "vero-beach", servicePrefix: "tree-removal" },
  { city: "North Fort Myers", county: "Lee", slug: "north-fort-myers", servicePrefix: "tree-removal" },
  { city: "Gainesville", county: "Alachua", slug: "gainesville", servicePrefix: "stump-grinding" },
  { city: "Clearwater", county: "Pinellas", slug: "clearwater", servicePrefix: "stump-grinding" },
  { city: "Fort Myers", county: "Lee", slug: "fort-myers", servicePrefix: "stump-grinding" },
  { city: "Pensacola", county: "Escambia", slug: "pensacola", servicePrefix: "stump-grinding" },
  { city: "Clermont", county: "Lake", slug: "clermont", servicePrefix: "stump-grinding" },
  { city: "Panama City", county: "Bay", slug: "panama-city", servicePrefix: "stump-grinding" },
  { city: "Leesburg", county: "Lake", slug: "leesburg", servicePrefix: "stump-grinding" },
  { city: "Naples", county: "Collier", slug: "naples", servicePrefix: "stump-grinding" },
  { city: "Brooksville", county: "Hernando", slug: "brooksville", servicePrefix: "stump-grinding" },
  { city: "St. Petersburg", county: "Pinellas", slug: "st-petersburg", servicePrefix: "stump-grinding" },
  { city: "Hialeah", county: "Miami-Dade", slug: "hialeah", servicePrefix: "stump-grinding" },
  { city: "Daytona Beach", county: "Volusia", slug: "daytona-beach", servicePrefix: "stump-grinding" },
  { city: "Port St. Lucie", county: "St. Lucie", slug: "port-st-lucie", servicePrefix: "emergency-service" },
  { city: "Spring Hill", county: "Hernando", slug: "spring-hill", servicePrefix: "emergency-service" },
  { city: "Boca Raton", county: "Palm Beach", slug: "boca-raton", servicePrefix: "emergency-service" },
  { city: "Deltona", county: "Volusia", slug: "deltona", servicePrefix: "emergency-service" },
  { city: "Kissimmee", county: "Osceola", slug: "kissimmee", servicePrefix: "emergency-service" },
  { city: "St. Cloud", county: "Osceola", slug: "st-cloud", servicePrefix: "emergency-service" },
  { city: "Sarasota", county: "Sarasota", slug: "sarasota", servicePrefix: "emergency-service" },
  { city: "Clearwater", county: "Pinellas", slug: "clearwater", servicePrefix: "emergency-service" },
  { city: "Fort Myers", county: "Lee", slug: "fort-myers", servicePrefix: "emergency-service" },
  { city: "Panama City", county: "Bay", slug: "panama-city", servicePrefix: "emergency-service" },
  { city: "Naples", county: "Collier", slug: "naples", servicePrefix: "emergency-service" },
  { city: "Daytona Beach", county: "Volusia", slug: "daytona-beach", servicePrefix: "emergency-service" },
];

const localBlogGuides = [
  {
    citySlug: "deland",
    title: "DeLand stump grinding guide",
    href: "/blog/deland-stump-grinding-guide-costs-access-and-yard-restoration/",
    intent: "stump-grinding",
  },
  {
    citySlug: "glen-st-mary",
    title: "Glen St. Mary stump grinding guide",
    href: "/blog/glen-st-mary-stump-grinding-guide-for-rural-properties/",
    intent: "stump-grinding",
  },
  {
    citySlug: "macclenny",
    title: "Macclenny tree service guide",
    href: "/blog/macclenny-tree-service-guide-removal-stump-grinding-and-arborist-questions/",
    intent: "tree-removal",
  },
  {
    citySlug: "masaryktown",
    title: "Masaryktown arborist guide",
    href: "/blog/masaryktown-arborist-guide-what-rural-property-owners-should-look-for/",
    intent: "tree-removal",
  },
  {
    citySlug: "fort-lauderdale",
    title: "Fort Lauderdale stump grinding guide",
    href: "/blog/fort-lauderdale-stump-grinding-guide-for-homeowners/",
    intent: "stump-grinding",
  },
  {
    citySlug: "fort-lauderdale",
    title: "Fort Lauderdale tree removal permit guide",
    href: "/blog/fort-lauderdale-tree-removal-permit-guide/",
    intent: "tree-removal",
  },
  {
    citySlug: "tallahassee",
    title: "Tallahassee tree removal permit guide",
    href: "/blog/tallahassee-tree-removal-permit-guide-for-homeowners/",
    intent: "tree-removal",
  },
  {
    citySlug: "lake-city",
    title: "Lake City emergency tree service guide",
    href: "/blog/lake-city-emergency-tree-service-guide-storm-risks-and-response-timing/",
    intent: "emergency-service",
  },
  {
    citySlug: "destin",
    title: "Destin stump removal guide",
    href: "/blog/destin-stump-removal-guide-what-homeowners-should-expect/",
    intent: "stump-grinding",
  },
  {
    citySlug: "cooper-city",
    title: "Cooper City stump grinding guide",
    href: "/blog/cooper-city-stump-grinding-guide-costs-access-and-landscape-repair/",
    intent: "stump-grinding",
  },
  {
    citySlug: "miramar",
    title: "Miramar stump grinding guide",
    href: "/blog/miramar-stump-grinding-guide-for-homeowners/",
    intent: "stump-grinding",
  },
];

const evergreenGuides = {
  "tree-removal": [
    {
      title: "Florida tree removal permit guide",
      href: "/blog/florida-tree-removal-permit-guide/",
    },
    {
      title: "When to choose tree removal over pruning",
      href: "/blog/when-to-choose-tree-removal-over-pruning/",
    },
    {
      title: "What happens during a tree removal estimate",
      href: "/blog/what-happens-during-a-tree-removal-estimate-in-florida/",
    },
    {
      title: "Removing a tree in a tight backyard",
      href: "/blog/removing-a-tree-in-a-tight-backyard-what-makes-it-more-complex/",
    },
  ],
  "stump-grinding": [
    {
      title: "Stump grinding vs. removal",
      href: "/blog/stump-grinding-vs-removal-which-is-best-for-your-property/",
    },
    {
      title: "How long does it take for a stump to rot?",
      href: "/blog/how-long-does-it-take-for-a-stump-to-rot-in-florida/",
    },
    {
      title: "Tree root removal after tree removal",
      href: "/blog/tree-root-removal-after-tree-removal-what-homeowners-should-expect/",
    },
    {
      title: "How to use wood chips after stump grinding",
      href: "/blog/how-to-use-wood-chips-after-stump-grinding-in-florida-landscapes/",
    },
  ],
  "emergency-service": [
    {
      title: "What defines a tree emergency?",
      href: "/blog/24-7-emergency-tree-service-what-defines-a-tree-emergency/",
    },
    {
      title: "What to do if a tree blocks your driveway",
      href: "/blog/what-to-do-if-a-tree-blocks-your-driveway-after-a-storm/",
    },
    {
      title: "Emergency tree service at night",
      href: "/blog/emergency-tree-service-at-night-what-can-safely-wait-until-morning/",
    },
    {
      title: "Storm cleanup vs. full tree removal",
      href: "/blog/storm-cleanup-vs-full-tree-removal-what-happens-first/",
    },
  ],
};

const defaultCountyGuides = [
  {
    title: "Florida tree removal permit guide",
    href: "/blog/florida-tree-removal-permit-guide/",
  },
  {
    title: "Emergency tree service cost factors",
    href: "/blog/emergency-tree-service-costs-why-they-differ-from-standard-rates/",
  },
  {
    title: "Stump grinding vs. removal",
    href: "/blog/stump-grinding-vs-removal-which-is-best-for-your-property/",
  },
];

const countyGuideMap = {
  "baker": [
    {
      title: "Macclenny tree service guide",
      href: "/blog/macclenny-tree-service-guide-removal-stump-grinding-and-arborist-questions/",
    },
    {
      title: "Certified arborist guide for Macclenny and Glen St. Mary",
      href: "/blog/certified-arborist-guide-for-macclenny-and-glen-st-mary/",
    },
    {
      title: "Glen St. Mary stump grinding guide",
      href: "/blog/glen-st-mary-stump-grinding-guide-for-rural-properties/",
    },
  ],
  "broward": [
    {
      title: "Fort Lauderdale tree removal permit guide",
      href: "/blog/fort-lauderdale-tree-removal-permit-guide/",
    },
    {
      title: "Fort Lauderdale stump grinding guide",
      href: "/blog/fort-lauderdale-stump-grinding-guide-for-homeowners/",
    },
    {
      title: "Cooper City stump grinding guide",
      href: "/blog/cooper-city-stump-grinding-guide-costs-access-and-landscape-repair/",
    },
  ],
  "volusia": [
    {
      title: "DeLand stump grinding guide",
      href: "/blog/deland-stump-grinding-guide-costs-access-and-yard-restoration/",
    },
    {
      title: "Tree root removal after tree removal",
      href: "/blog/tree-root-removal-after-tree-removal-what-homeowners-should-expect/",
    },
    {
      title: "Stump grinding vs. removal",
      href: "/blog/stump-grinding-vs-removal-which-is-best-for-your-property/",
    },
  ],
  "leon": [
    {
      title: "Tallahassee tree removal permit guide",
      href: "/blog/tallahassee-tree-removal-permit-guide-for-homeowners/",
    },
    {
      title: "Florida Statute 163.045 guide",
      href: "/blog/florida-statute-163-045-what-homeowners-should-understand-before-tree-removal/",
    },
    {
      title: "Hurricane tree risk in Florida",
      href: "/blog/hurricane-tree-risk-florida/",
    },
  ],
  "columbia": [
    {
      title: "Lake City emergency tree service guide",
      href: "/blog/lake-city-emergency-tree-service-guide-storm-risks-and-response-timing/",
    },
    {
      title: "What to do if a tree blocks your driveway",
      href: "/blog/what-to-do-if-a-tree-blocks-your-driveway-after-a-storm/",
    },
    {
      title: "Storm cleanup vs. full tree removal",
      href: "/blog/storm-cleanup-vs-full-tree-removal-what-happens-first/",
    },
  ],
  "okaloosa": [
    {
      title: "Destin stump removal guide",
      href: "/blog/destin-stump-removal-guide-what-homeowners-should-expect/",
    },
    {
      title: "Salt spray damage on coastal Florida trees",
      href: "/blog/salt-spray-damage-on-coastal-florida-trees-signs-prevention-and-long-term-care/",
    },
    {
      title: "Tree service in the Florida Keys: coastal challenges",
      href: "/blog/tree-service-in-the-florida-keys-unique-coastal-challenges/",
    },
  ],
  "walton": [
    {
      title: "Salt spray damage on coastal Florida trees",
      href: "/blog/salt-spray-damage-on-coastal-florida-trees-signs-prevention-and-long-term-care/",
    },
    {
      title: "Tree service in coastal Florida: unique challenges",
      href: "/blog/tree-service-in-the-florida-keys-unique-coastal-challenges/",
    },
    {
      title: "Emergency tree service cost factors",
      href: "/blog/emergency-tree-service-costs-why-they-differ-from-standard-rates/",
    },
  ],
};

const inferServiceIntent = ({ slug = "", title = "", category = "", tags = [] } = {}) => {
  const text = `${slug} ${title} ${category} ${Array.isArray(tags) ? tags.join(" ") : ""}`.toLowerCase();

  if (/stump|root flare|wood chips|root removal|grinding/.test(text)) {
    return "stump-grinding";
  }

  if (/emergency|storm|hurricane|fallen|blocked|roof|driveway|lightning|wind|urgent|after-hours|cleanup/.test(text)) {
    return "emergency-service";
  }

  if (/permit|removal|remove|hazard|protected|ordinance|fine|statute|liability|insurance|hoa|neighbor|boundary|construction|root|tree survey|risk assessment/.test(text)) {
    return "tree-removal";
  }

  return "tree-removal";
};

const buildServiceTarget = (city, servicePrefix, reason = "Priority local service page") => ({
  title: `${serviceLabels[servicePrefix]} in ${city.city}, FL`,
  href: city.href || cityServicePath(servicePrefix, city.city, city.county),
  eyebrow: serviceLabels[servicePrefix],
  reason,
});

const stableIndex = (value = "", length = 1) => {
  let hash = 0;
  for (const char of String(value)) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return length > 0 ? hash % length : 0;
};

const getPhaseOneExpansionLink = (post, servicePrefix, existingLinks) => {
  const candidates = phaseOneExpansionCandidates.filter((candidate) => candidate.servicePrefix === servicePrefix);
  if (candidates.length === 0) return null;

  const seed = `${post.slug || ""}:${post.title || ""}:${servicePrefix}`;
  const start = stableIndex(seed, candidates.length);

  for (let offset = 0; offset < candidates.length; offset += 1) {
    const candidate = candidates[(start + offset) % candidates.length];
    const link = buildServiceTarget(candidate, candidate.servicePrefix, "Related local service page");
    if (!existingLinks.some((existing) => existing.href === link.href)) {
      return link;
    }
  }

  return null;
};

export const getBlogMoneyLinks = (post = {}) => {
  const servicePrefix = inferServiceIntent(post);
  const text = `${post.slug || ""} ${post.title || ""}`.toLowerCase();

  const cityMatches = priorityCities.filter((city) => text.includes(city.slug) || text.includes(city.city.toLowerCase()));
  const prioritized = cityMatches.length > 0
    ? [...cityMatches, ...priorityCities.filter((city) => !cityMatches.some((match) => match.slug === city.slug))]
    : priorityCities;

  const primaryLinks = prioritized.slice(0, 4).map((city) =>
    buildServiceTarget(city, servicePrefix, serviceDescriptions[servicePrefix])
  );

  const secondaryPrefix =
    servicePrefix === "stump-grinding"
      ? "tree-removal"
      : servicePrefix === "emergency-service"
        ? "tree-removal"
        : "stump-grinding";

  const secondaryLinks = priorityCities
    .filter((city) => !primaryLinks.some((link) => link.href.includes(`-${city.slug}/`)))
    .slice(0, 1)
    .map((city) => buildServiceTarget(city, secondaryPrefix, "Related high-intent service page"));

  const expansionLink = getPhaseOneExpansionLink(post, servicePrefix, [...primaryLinks, ...secondaryLinks]);

  return [...primaryLinks, ...secondaryLinks, expansionLink].filter(Boolean).slice(0, 6);
};

export const getServiceRelatedBlogLinks = ({ citySlug = "", servicePrefix = "tree-removal" } = {}) => {
  const localMatches = localBlogGuides.filter(
    (guide) => guide.citySlug === citySlug && (guide.intent === servicePrefix || servicePrefix === "tree-removal")
  );

  const evergreen = evergreenGuides[servicePrefix] || evergreenGuides["tree-removal"];
  const merged = [...localMatches, ...evergreen];
  const seen = new Set();

  return merged
    .filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    })
    .slice(0, 4);
};

export const getCountyMoneyLinkGroups = (countyName, cities = []) => {
  const countySlug = makeCountySlug(countyName);
  const countyPriority = priorityCities.filter((city) => makeCountySlug(city.county) === countySlug);
  const cityRecords = cities.map((city) => ({
    city: city.City,
    county: city.County,
    slug: routeSlug(city.City),
    population: Number(String(city.Population || "0").replace(/,/g, "")) || 0,
    focus: city.FocusService || "Tree service",
  }));

  const fallbackCities = cityRecords
    .sort((a, b) => b.population - a.population)
    .slice(0, 4)
    .map((city) => ({ city: city.city, county: city.county, slug: city.slug, focus: city.focus }));

  const merged = [...countyPriority, ...fallbackCities];
  const seen = new Set();

  return merged
    .filter((city) => {
      const key = `${routeSlug(city.city)}:${makeCountySlug(city.county)}`;
      if (!city.slug || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 4)
    .map((city) => ({
      city: city.city,
      focus: city.focus || "Local tree service planning",
      links: [
        buildServiceTarget(city, "tree-removal", "Removal and permit planning"),
        buildServiceTarget(city, "stump-grinding", "Stump cleanup and yard restoration"),
        buildServiceTarget(city, "emergency-service", "Storm and urgent hazard response"),
      ],
    }));
};

export const getCountyGuideLinks = (countyName) => {
  const countySlug = makeCountySlug(countyName);
  return countyGuideMap[countySlug] || defaultCountyGuides;
};

export const getServiceLabel = (servicePrefix) => serviceLabels[servicePrefix] || serviceLabels["tree-removal"];
