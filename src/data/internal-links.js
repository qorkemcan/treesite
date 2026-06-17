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
    .slice(0, 2)
    .map((city) => buildServiceTarget(city, secondaryPrefix, "Related high-intent service page"));

  return [...primaryLinks, ...secondaryLinks].slice(0, 6);
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
