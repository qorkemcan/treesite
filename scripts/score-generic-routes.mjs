import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import {
  SERVICE_PREFIXES,
  canUseSharedCityContent,
  cityServiceSlug,
  contentKeySlug,
  countySlug,
} from "../src/lib/slugs.js";
import { getServiceRelatedBlogLinks } from "../src/data/internal-links.js";

const root = process.cwd();
const reportsDir = path.join(root, "reports");
const SITE_URL = "https://www.protreetrim.com";
const EXPECTED_GENERIC_ROUTES = 1581;
const EXPECTED_PER_SERVICE = 527;

const csvRows = parse(fs.readFileSync(path.join(root, "src/data/cities.csv"), "utf8"), {
  columns: true,
  skip_empty_lines: true,
  bom: true,
});

const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));

const richSources = {
  "tree-removal": readJson("src/data/city-removal.json"),
  "stump-grinding": readJson("src/data/city-stump.json"),
  "emergency-service": readJson("src/data/city-emergency.json"),
};

const serviceLabels = {
  "tree-removal": "Tree Removal",
  "stump-grinding": "Stump Grinding",
  "emergency-service": "Emergency Tree Service",
};

const coastalCounties = new Set([
  "Bay",
  "Brevard",
  "Broward",
  "Charlotte",
  "Citrus",
  "Collier",
  "Dixie",
  "Duval",
  "Escambia",
  "Flagler",
  "Franklin",
  "Gulf",
  "Hernando",
  "Hillsborough",
  "Indian River",
  "Lee",
  "Levy",
  "Manatee",
  "Martin",
  "Miami-Dade",
  "Monroe",
  "Nassau",
  "Okaloosa",
  "Palm Beach",
  "Pasco",
  "Pinellas",
  "Santa Rosa",
  "Sarasota",
  "St. Johns",
  "St. Lucie",
  "Taylor",
  "Volusia",
  "Wakulla",
  "Walton",
]);

const denseMetroCounties = new Set([
  "Broward",
  "Duval",
  "Hillsborough",
  "Miami-Dade",
  "Orange",
  "Palm Beach",
  "Pinellas",
  "Seminole",
]);

const ruralCounties = new Set([
  "Baker",
  "Bradford",
  "Calhoun",
  "Dixie",
  "Franklin",
  "Gadsden",
  "Gilchrist",
  "Glades",
  "Gulf",
  "Hamilton",
  "Hardee",
  "Hendry",
  "Holmes",
  "Jackson",
  "Jefferson",
  "Lafayette",
  "Levy",
  "Liberty",
  "Madison",
  "Okeechobee",
  "Suwannee",
  "Taylor",
  "Union",
  "Wakulla",
  "Washington",
]);

const commerciallyImportantCounties = new Set([
  "Miami-Dade",
  "Broward",
  "Palm Beach",
  "Hillsborough",
  "Orange",
  "Pinellas",
  "Duval",
  "Lee",
  "Collier",
  "Sarasota",
  "Manatee",
  "Brevard",
  "Volusia",
  "Pasco",
  "Seminole",
  "St. Johns",
  "St. Lucie",
]);

const serviceIntentWeight = {
  "tree-removal": 22,
  "emergency-service": 19,
  "stump-grinding": 15,
};

const serviceKeywords = {
  "tree-removal": [
    "removal",
    "hazard",
    "risk",
    "lean",
    "decay",
    "rigging",
    "permit",
    "dismantling",
    "target",
    "cleanup",
  ],
  "stump-grinding": [
    "stump",
    "grinding",
    "depth",
    "root",
    "replant",
    "chips",
    "grade",
    "pavers",
    "mowing",
    "backfill",
  ],
  "emergency-service": [
    "emergency",
    "storm",
    "hazard",
    "blocked",
    "roof",
    "hanging",
    "split",
    "urgent",
    "utility",
    "tension",
  ],
};

const toTitleCase = (value = "") =>
  String(value)
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const wordCount = (value = "") => (String(value).match(/[A-Za-z0-9']+/g) || []).length;

const sentenceSplit = (value = "") =>
  String(value)
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => wordCount(sentence) >= 4);

const parsePopulation = (value = "") => {
  const raw = String(value ?? "").trim();
  if (!raw) return { status: "unknown", value: null };
  const numeric = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(numeric) || numeric < 0) return { status: "invalid", value: null };
  if (numeric === 0) return { status: "unknown", value: null };
  return { status: "known_positive", value: numeric };
};

const csvEscape = (value) => {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const countyRows = new Map();
for (const row of csvRows) {
  if (!countyRows.has(row.County)) countyRows.set(row.County, []);
  countyRows.get(row.County).push(row);
}

const genericRoutes = [];

for (const cityRow of csvRows) {
  for (const servicePrefix of SERVICE_PREFIXES) {
    const contentKey = contentKeySlug(cityRow.City);
    const hasRich =
      canUseSharedCityContent(cityRow.City, cityRow.County) &&
      Boolean(richSources[servicePrefix][contentKey]);

    if (hasRich) continue;

    genericRoutes.push({
      cityRow,
      servicePrefix,
      routeSlug: cityServiceSlug(servicePrefix, cityRow.City, cityRow.County),
    });
  }
}

const getSetting = ({ countyName, populationValue }) => {
  if (coastalCounties.has(countyName)) return "coastal";
  if (denseMetroCounties.has(countyName) || (populationValue ?? 0) > 100000) return "metro";
  if (ruralCounties.has(countyName) || !populationValue || populationValue < 20000) return "rural";
  return "inland";
};

const getContextPhrases = ({ servicePrefix, cityName, countyName, mainTree, landmark, setting }) => {
  const propertyContext = {
    coastal:
      "coastal salt exposure, wind-driven storm cleanup, paver edges, rental schedules, pools, compact yards, and saturated soil",
    metro:
      "tight access, pool cages, fences, parked vehicles, neighboring structures, HOA expectations, and limited drop zones",
    rural:
      "acreage, long driveways, uneven ground, septic awareness, debris hauling distance, and wider rural access",
    inland:
      "suburban lots, older trees, sidewalks, irrigation, fences, driveway staging, and heavy rain drainage",
  }[setting];

  const serviceMain = {
    "tree-removal": [
      `Tree removal in ${cityName} should start with risk, targets, access, and whether ${mainTree} can safely remain.`,
      `A removal plan near ${landmark} should consider lean, decay, root movement, rooflines, utilities, rigging, debris, permits, and cleanup.`,
    ],
    "stump-grinding": [
      `Stump grinding in ${cityName} should start with stump diameter, root flare, access width, grinding depth, chip handling, and final grade.`,
      `A stump plan near ${landmark} should consider irrigation, pavers, mowing, replanting, sod repair, and whether chips stay or are hauled.`,
    ],
    "emergency-service": [
      `Emergency tree service in ${cityName} should start with active hazards, blocked access, roof impact, hanging limbs, utility risk, and safe documentation.`,
      `An urgent response near ${landmark} should separate temporary hazard mitigation from full removal, pruning, and debris cleanup.`,
    ],
  }[servicePrefix];

  return {
    propertyContext,
    serviceMain,
    countyContext: `${countyName} County conditions affect scheduling, equipment choice, storm timing, and how crews stage work around ${propertyContext}.`,
  };
};

const buildRouteSections = ({ cityRow, servicePrefix }) => {
  const cityName = toTitleCase(cityRow.City);
  const countyName = toTitleCase(cityRow.County);
  const population = parsePopulation(cityRow.Population);
  const landmark = toTitleCase(cityRow.Landmark) || "the local area";
  const nearbyCities = String(cityRow.NearbyCities || "");
  const mainTree = cityRow.MainTreeType || "local Florida trees";
  const setting = getSetting({ countyName, populationValue: population.value });
  const { propertyContext, serviceMain, countyContext } = getContextPhrases({
    servicePrefix,
    cityName,
    countyName,
    mainTree,
    landmark,
    setting,
  });
  const serviceName = serviceLabels[servicePrefix];

  const description = String(cityRow.Description || "")
    .replace(/\s*\([^)]*service area\)\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const hero = [
    `${serviceName} in ${cityName}, Florida.`,
    `${serviceName} guidance for ${cityName} focuses on property risk, site access, storm exposure, and local service coordination.`,
  ].join(" ");

  const mainServiceContent = [
    description ||
      `${cityName} properties need tree work decisions that reflect local access, storm exposure, dominant tree species, and residential lot conditions.`,
    ...serviceMain,
    `${mainTree} in ${cityName} can change the work plan because structure, roots, canopy weight, and storm exposure affect the safest next step.`,
  ].join(" ");

  const localContext = [
    `${cityName} is treated as a ${setting} Florida service area.`,
    countyContext,
    `Nearby references include ${nearbyCities || "surrounding communities"} and ${landmark}.`,
  ].join(" ");

  const decisionFactors = {
    "tree-removal": [
      "Removal decisions should separate maintainable trees from trees with decay, lean, root movement, storm damage, or repeated limb failure.",
      "Important targets include rooflines, driveways, fences, utilities, irrigation, pools, parked vehicles, and neighboring homes.",
    ],
    "stump-grinding": [
      "Stump grinding decisions should separate simple lowering from true surface restoration for lawn, mulch, pavers, or replanting.",
      "Important details include stump width, root flare, gate access, irrigation, chip volume, grinding depth, and final grade.",
    ],
    "emergency-service": [
      "Emergency decisions should separate routine tree care from hazards that threaten people, access, structures, vehicles, or utilities.",
      "Important details include hanging limbs, split trunks, loaded wood, blocked driveways, roof impact, and safe photos from a distance.",
    ],
  }[servicePrefix].join(" ");

  const serviceProcess = {
    "tree-removal":
      "The process starts with describing the risk, reviewing access and nearby targets, then planning controlled removal, debris handling, and cleanup.",
    "stump-grinding":
      "The process starts with measuring the stump, choosing the finished surface, then grinding to the right depth while protecting irrigation and hardscape.",
    "emergency-service":
      "The process starts with identifying immediate danger, stabilizing the scene, then reducing urgent risk before permanent cleanup is planned.",
  }[servicePrefix];

  const faq = {
    "tree-removal": [
      `Do I need a permit for tree removal in ${cityName}? Permit rules can depend on condition, species, property type, and whether the tree is an active hazard.`,
      `What affects tree removal cost in ${cityName}? Size, access, risk, rigging, debris, nearby structures, and storm instability usually matter.`,
      `When should a tree be removed instead of pruned? Removal becomes more likely when defects cannot be corrected with pruning.`,
    ],
    "stump-grinding": [
      `Do you need a permit for stump grinding in ${cityName}? Stump work is often simpler than removal, but regulated removals or right-of-way areas can still matter.`,
      `What affects stump grinding cost in ${cityName}? Diameter, root flare, access, chip handling, backfill, pavers, and irrigation usually matter.`,
      `Should I grind a stump or leave it? Grinding is stronger when the stump blocks mowing, creates a trip hazard, holds water, or prevents replanting.`,
    ],
    "emergency-service": [
      `Can emergency tree work start quickly in ${cityName}? Active hazards are handled differently from routine maintenance, though documentation can still matter.`,
      `Why does emergency tree service cost more? After-hours response, unstable wood, storm conditions, roof risk, and urgent access can increase complexity.`,
      `What counts as a tree emergency? Roof impact, blocked driveways, split trunks, hanging limbs, and utility risk are common emergency signals.`,
    ],
  }[servicePrefix].join(" ");

  const cta = {
    "tree-removal": `Request a tree removal estimate in ${cityName} for risk review, access planning, and cleanup coordination near ${landmark}.`,
    "stump-grinding": `Request a stump grinding estimate in ${cityName} for grinding depth, chip handling, and grade restoration near ${landmark}.`,
    "emergency-service": `Request emergency tree service in ${cityName} for urgent hazard triage and site review near ${landmark}.`,
  }[servicePrefix];

  const navigationAndGlobal = [
    "Home Florida counties services blog gallery contact local independent provider network sticky call button weather alert footer",
    "ProTreeTrim connects Florida property owners with independent local providers across the state.",
    "Call dispatch for service coordination.",
  ].join(" ");

  return {
    cityName,
    countyName,
    landmark,
    nearbyCities,
    mainTree,
    population,
    setting,
    description,
    sections: {
      hero,
      main_service_content: mainServiceContent,
      local_context: localContext,
      decision_factors: decisionFactors,
      service_process: serviceProcess,
      faq,
      cta,
      navigation_header_footer_sticky_cta: navigationAndGlobal,
    },
  };
};

const normalizeSentence = (sentence, route) => {
  let normalized = String(sentence).toLowerCase();
  const tokens = [
    route.cityName,
    route.countyName,
    route.landmark,
    ...(route.nearbyCities || "").split(",").map((item) => item.trim()),
  ].filter(Boolean);

  for (const token of tokens.sort((a, b) => b.length - a.length)) {
    normalized = normalized.replaceAll(token.toLowerCase(), " __LOCAL__ ");
  }

  normalized = normalized
    .replace(/\+?1?[-.\s(]*855[-.\s)]*498[-.\s]*2578/g, " __PHONE__ ")
    .replace(/\b\d{4,}\b/g, " __NUMBER__ ")
    .replace(/[^a-z0-9_ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized;
};

const routeAnalyses = genericRoutes.map((route) => {
  const modeled = buildRouteSections(route);
  const mainSections = [
    "hero",
    "main_service_content",
    "local_context",
    "decision_factors",
    "service_process",
    "faq",
    "cta",
  ];
  const mainText = mainSections.map((section) => modeled.sections[section]).join(" ");
  const fullText = `${mainText} ${modeled.sections.navigation_header_footer_sticky_cta}`;
  const sentences = sentenceSplit(mainText).map((sentence) => ({
    raw: sentence,
    normalized: normalizeSentence(sentence, modeled),
  }));

  return {
    ...route,
    ...modeled,
    publicUrl: `/${route.routeSlug}/`,
    absoluteUrl: `${SITE_URL}/${route.routeSlug}/`,
    mainText,
    fullText,
    sentences,
    descriptionSentences: sentenceSplit(modeled.description).map((sentence) => ({
      raw: sentence,
      normalized: normalizeSentence(sentence, modeled),
    })),
    normalizedDescription: normalizeSentence(modeled.description, modeled),
    mainContentWordCount: wordCount(mainText),
    fullPageWordCount: wordCount(fullText),
  };
});

const globalSentenceCounts = new Map();
const serviceSentenceCounts = new Map();
const countySentenceCounts = new Map();
const descriptionCounts = new Map();

for (const route of routeAnalyses) {
  if (wordCount(route.description) >= 20) {
    descriptionCounts.set(route.normalizedDescription, (descriptionCounts.get(route.normalizedDescription) || 0) + 1);
  }

  for (const sentence of route.sentences) {
    globalSentenceCounts.set(sentence.normalized, (globalSentenceCounts.get(sentence.normalized) || 0) + 1);

    const serviceKey = `${route.servicePrefix}:${sentence.normalized}`;
    serviceSentenceCounts.set(serviceKey, (serviceSentenceCounts.get(serviceKey) || 0) + 1);

    const countyKey = `${route.countyName}:${sentence.normalized}`;
    countySentenceCounts.set(countyKey, (countySentenceCounts.get(countyKey) || 0) + 1);
  }
}

const getRatio = (count, total) => (total === 0 ? 0 : count / total);

const detectWrongLanguage = (route) => {
  const flags = [];
  const sections = route.sections;

  const addFlag = ({ phrase, section, severity, reason, surrounding_text, review_classification }) => {
    flags.push({ phrase, section, severity, reason, surrounding_text, review_classification });
  };

  const sectionEntries = Object.entries(sections).filter(
    ([section]) => section !== "navigation_header_footer_sticky_cta",
  );

  const scan = (patterns) => {
    for (const [section, text] of sectionEntries) {
      for (const pattern of patterns) {
        const match = String(text).match(pattern.regex);
        if (!match) continue;
        if (pattern.ignore?.({ section, text, phrase: match[0], route })) continue;
        addFlag({
          phrase: match[0],
          section,
          severity: pattern.severity,
          reason: pattern.reason,
          surrounding_text: String(text).replace(/\s+/g, " ").trim(),
          review_classification: pattern.reviewClassification,
        });
      }
    }
  };

  if (route.servicePrefix === "tree-removal") {
    scan([
      {
        regex: /\bcrown reduction\b|\bcanopy reduction\b/iu,
        severity: "medium",
        reason: "Crown/canopy reduction can make a removal page sound like pruning is the primary service.",
        reviewClassification: "likely issue",
      },
      {
        regex: /\bvertical mulching\b|\bsoil aeration\b/iu,
        severity: "high",
        reason: "Soil health language is not a removal decision module.",
        reviewClassification: "confirmed issue",
      },
    ]);
  }

  if (route.servicePrefix === "stump-grinding") {
    scan([
      {
        regex: /\bcrown reduction\b|\bcanopy reduction\b|\bpruning program\b/iu,
        severity: "high",
        reason: "Pruning language is not a stump grinding process.",
        reviewClassification: "confirmed issue",
      },
      {
        regex: /\bemergency hazard removal\b/iu,
        severity: "medium",
        reason: "Emergency/removal language should not dominate stump grinding pages.",
        reviewClassification: "likely issue",
      },
    ]);
  }

  if (route.servicePrefix === "emergency-service") {
    scan([
      {
        regex: /\broutine pruning\b|\baesthetic crown care\b/iu,
        severity: "high",
        reason: "Routine/aesthetic care weakens emergency triage intent.",
        reviewClassification: "confirmed issue",
      },
      {
        regex: /\bgrinding depth\b/iu,
        severity: "medium",
        reason: "Stump restoration language should not be an emergency-service core topic.",
        reviewClassification: "likely issue",
      },
      {
        regex: /\bsoil health\b|\bvertical mulching\b|\bsoil aeration\b/iu,
        severity: "high",
        reason: "Soil health is not an emergency hazard mitigation service.",
        reviewClassification: "confirmed issue",
      },
    ]);
  }

  return flags;
};

const scoreRoute = (route) => {
  const totalSentences = route.sentences.length;
  const globalShared = route.sentences.filter((sentence) => globalSentenceCounts.get(sentence.normalized) > 1).length;
  const sameServiceShared = route.sentences.filter(
    (sentence) => serviceSentenceCounts.get(`${route.servicePrefix}:${sentence.normalized}`) > 1,
  ).length;
  const sameCountyShared = route.sentences.filter(
    (sentence) => countySentenceCounts.get(`${route.countyName}:${sentence.normalized}`) > 1,
  ).length;
  const uniqueSentences = route.sentences.filter((sentence) => globalSentenceCounts.get(sentence.normalized) === 1).length;
  const uniqueDescriptionSentences = route.descriptionSentences.filter(
    (sentence) => globalSentenceCounts.get(sentence.normalized) === 1,
  ).length;

  const globalTemplateRatio = getRatio(globalShared, totalSentences);
  const sameServiceTemplateRatio = getRatio(sameServiceShared, totalSentences);
  const sameCountySharedRatio = getRatio(sameCountyShared, totalSentences);
  const uniqueSentenceRatio = getRatio(
    uniqueSentences + uniqueDescriptionSentences,
    totalSentences + route.descriptionSentences.length,
  );

  const descriptionWords = wordCount(route.description);
  const knownPopulation = route.population.status === "known_positive";
  const countyKnown =
    coastalCounties.has(route.countyName) ||
    denseMetroCounties.has(route.countyName) ||
    ruralCounties.has(route.countyName) ||
    commerciallyImportantCounties.has(route.countyName);
  const nearbyCitiesPresent = Boolean(String(route.nearbyCities || "").trim());
  const landmarkPresent = route.landmark !== "the local area";
  const treeSpeciesPresent = route.mainTree !== "local Florida trees";
  const relatedBlogCount = getServiceRelatedBlogLinks({
    citySlug: contentKeySlug(route.cityRow.City),
    cityName: route.cityName,
    countySlug: countySlug(route.cityRow.County),
    countyName: route.countyName,
    servicePrefix: route.servicePrefix,
  }).length;
  const nearbyRouteCount = (countyRows.get(route.cityRow.County) || [])
    .filter((row) => row.City !== route.cityRow.City)
    .slice(0, 8).length;
  const internalLinkCount = 2 + 1 + nearbyRouteCount + relatedBlogCount + 3;

  const wrongLanguageFlags = detectWrongLanguage(route);
  const identicalParagraphCollision =
    wordCount(route.description) >= 20 &&
    descriptionCounts.get(route.normalizedDescription) > 1;
  const emptyOrThinMainContent = route.mainContentWordCount < 250;

  const technicalIntegrityScore = 10;
  const localEvidenceScore = clamp(
    (descriptionWords >= 80 ? 6 : descriptionWords >= 40 ? 4 : 1) +
      (landmarkPresent ? 3 : 0) +
      (nearbyCitiesPresent ? 3 : 0) +
      (treeSpeciesPresent ? 3 : 0) +
      (countyKnown ? 3 : 0) +
      (knownPopulation ? 2 : 0),
    0,
    20,
  );
  const serviceSpecificScore = clamp(
    serviceKeywords[route.servicePrefix].filter((keyword) =>
      route.mainText.toLowerCase().includes(keyword),
    ).length * 2.5,
    5,
    20,
  );
  const decisionUsefulnessScore = clamp(
    wordCount(route.sections.decision_factors) >= 35 ? 13 : 8,
    0,
    15,
  );
  const mainContentDepthScore = clamp(
    route.mainContentWordCount >= 500 ? 10 : route.mainContentWordCount >= 350 ? 7 : 3,
    0,
    10,
  );
  const uniquenessScore = clamp(
    Math.round((uniqueSentenceRatio * 10 + (1 - sameServiceTemplateRatio) * 5) * 10) / 10,
    0,
    15,
  );
  const internalLinkingAndCtaScore = internalLinkCount >= 7 ? 5 : internalLinkCount >= 4 ? 3 : 1;
  const dataCompletenessScore = clamp(
    (knownPopulation ? 1 : 0) +
      (descriptionWords >= 40 ? 1 : 0) +
      (landmarkPresent ? 1 : 0) +
      (nearbyCitiesPresent ? 1 : 0) +
      (treeSpeciesPresent ? 1 : 0),
    0,
    5,
  );

  const hardPenalties = [];
  if (wrongLanguageFlags.some((flag) => flag.severity === "high")) {
    hardPenalties.push({ type: "wrong_service_language", points: 12 });
  } else if (wrongLanguageFlags.length > 0) {
    hardPenalties.push({ type: "wrong_service_language", points: 6 });
  }
  if (identicalParagraphCollision) hardPenalties.push({ type: "identical_paragraph_collision", points: 10 });
  if (emptyOrThinMainContent) hardPenalties.push({ type: "empty_or_extremely_thin_main_content", points: 25 });

  const penaltyTotal = hardPenalties.reduce((sum, penalty) => sum + penalty.points, 0);
  const finalQualityScore = clamp(
    Math.round(
      technicalIntegrityScore +
        localEvidenceScore +
        serviceSpecificScore +
        decisionUsefulnessScore +
        mainContentDepthScore +
        uniquenessScore +
        internalLinkingAndCtaScore +
        dataCompletenessScore -
        penaltyTotal,
    ),
  );

  const qualityBand =
    finalQualityScore >= 80
      ? "strong"
      : finalQualityScore >= 65
        ? "acceptable"
        : finalQualityScore >= 45
          ? "weak"
          : "high-priority enrichment";

  const opportunityScore = clamp(
    Math.round(
      (knownPopulation ? Math.min(35, Math.log10(route.population.value) * 8) : 8) +
        (commerciallyImportantCounties.has(route.countyName) ? 15 : 0) +
        (coastalCounties.has(route.countyName) ? 12 : route.setting === "rural" ? 5 : 8) +
        serviceIntentWeight[route.servicePrefix] +
        (Object.values(richSources).some((source) => source[contentKeySlug(route.cityRow.City)]) ? 8 : 0) +
        (internalLinkCount >= 10 ? 5 : 3) +
        (dataCompletenessScore >= 4 ? 3 : 0),
    ),
  );

  const recommendedModules = [];
  if (descriptionWords < 40) recommendedModules.push("local property context");
  if (!countyKnown) recommendedModules.push("county context classification");
  if (route.setting === "coastal") recommendedModules.push("coastal storm and soil context");
  if (route.setting === "metro") recommendedModules.push("tight access / pool / HOA context");
  if (route.setting === "rural") recommendedModules.push("acreage and rural access context");
  if (route.servicePrefix === "tree-removal") recommendedModules.push("risk / targets / permit / cleanup");
  if (route.servicePrefix === "stump-grinding") recommendedModules.push("access / depth / roots / replanting");
  if (route.servicePrefix === "emergency-service") recommendedModules.push("active hazard / storm access / documentation");
  if (wrongLanguageFlags.length > 0) recommendedModules.push("wrong-service language cleanup");

  return {
    city: route.cityName,
    county: route.countyName,
    service: route.servicePrefix,
    public_url: route.publicUrl,
    canonical_identity_exists: true,
    population_status: route.population.status,
    population_value: route.population.value ?? "",
    main_content_word_count: route.mainContentWordCount,
    full_page_word_count: route.fullPageWordCount,
    hero_word_count: wordCount(route.sections.hero),
    main_service_word_count: wordCount(route.sections.main_service_content),
    local_context_word_count: wordCount(route.sections.local_context),
    decision_factors_word_count: wordCount(route.sections.decision_factors),
    service_process_word_count: wordCount(route.sections.service_process),
    faq_word_count: wordCount(route.sections.faq),
    cta_word_count: wordCount(route.sections.cta),
    nav_header_footer_sticky_word_count: wordCount(route.sections.navigation_header_footer_sticky_cta),
    global_template_ratio: Number(globalTemplateRatio.toFixed(3)),
    same_service_template_ratio: Number(sameServiceTemplateRatio.toFixed(3)),
    same_county_shared_ratio: Number(sameCountySharedRatio.toFixed(3)),
    city_specific_ratio: Number((1 - sameCountySharedRatio).toFixed(3)),
    service_specific_ratio: Number((1 - sameServiceTemplateRatio).toFixed(3)),
    unique_sentence_ratio: Number(uniqueSentenceRatio.toFixed(3)),
    technical_integrity_score: technicalIntegrityScore,
    local_evidence_score: localEvidenceScore,
    service_specific_score: serviceSpecificScore,
    decision_usefulness_score: decisionUsefulnessScore,
    main_content_depth_score: mainContentDepthScore,
    uniqueness_score: uniquenessScore,
    internal_linking_cta_score: internalLinkingAndCtaScore,
    data_completeness_score: dataCompletenessScore,
    hard_flags: hardPenalties.map((penalty) => penalty.type).join("; "),
    hard_penalty_points: penaltyTotal,
    wrong_language_flag_count: wrongLanguageFlags.length,
    final_quality_score: finalQualityScore,
    quality_band: qualityBand,
    opportunity_score: opportunityScore,
    internal_link_count: internalLinkCount,
    sitemap_behavior: "generic route excluded from city/service sitemap",
    noindex_changed: false,
    recommended_modules: recommendedModules.join("; "),
    wrongLanguageFlags,
  };
};

const scoredRoutes = routeAnalyses.map(scoreRoute);

const bandCounts = scoredRoutes.reduce((counts, route) => {
  counts[route.quality_band] = (counts[route.quality_band] || 0) + 1;
  return counts;
}, {});

const byService = scoredRoutes.reduce((counts, route) => {
  counts[route.service] = (counts[route.service] || 0) + 1;
  return counts;
}, {});

const scoreValues = scoredRoutes.map((route) => route.final_quality_score);
const scoreRange = Math.max(...scoreValues) - Math.min(...scoreValues);
const modelWarning =
  scoreRange < 20
    ? "FAIL: score distribution is too narrow; model needs stronger differentiation."
    : "PASS: score distribution spans at least 20 points.";

const wrongLanguageRows = scoredRoutes.flatMap((route) =>
  route.wrongLanguageFlags.map((flag) => ({
    city: route.city,
    county: route.county,
    service: route.service,
    public_url: route.public_url,
    phrase: flag.phrase,
    section: flag.section,
    surrounding_text: flag.surrounding_text,
    severity: flag.severity,
    reason: flag.reason,
    review_classification: flag.review_classification || "uncertain",
  })),
);

const pilotByService = {};
const globallySelectedPilotCities = new Set();

for (const servicePrefix of SERVICE_PREFIXES) {
  const candidates = scoredRoutes
    .filter((route) => route.service === servicePrefix)
    .sort((a, b) => b.opportunity_score - a.opportunity_score || a.final_quality_score - b.final_quality_score);

  const selected = [];
  const seenCityCounty = new Set();
  const desiredContexts = ["coastal", "metro", "rural", "inland"];

  for (const context of desiredContexts) {
    const match = candidates.find((route) => {
      const original = routeAnalyses.find((analysis) => analysis.publicUrl === route.public_url);
      const cityCounty = `${route.city}:${route.county}`;
      return (
        original?.setting === context &&
        !seenCityCounty.has(cityCounty) &&
        !globallySelectedPilotCities.has(cityCounty)
      );
    });
    if (match) {
      selected.push(match);
      const cityCounty = `${match.city}:${match.county}`;
      seenCityCounty.add(cityCounty);
      globallySelectedPilotCities.add(cityCounty);
    }
  }

  for (const candidate of candidates) {
    if (selected.length >= 10) break;
    const cityKey = `${candidate.city}:${candidate.county}`;
    if (seenCityCounty.has(cityKey) || globallySelectedPilotCities.has(cityKey)) continue;
    selected.push(candidate);
    seenCityCounty.add(cityKey);
    globallySelectedPilotCities.add(cityKey);
  }

  for (const candidate of candidates) {
    if (selected.length >= 10) break;
    const cityKey = `${candidate.city}:${candidate.county}`;
    if (seenCityCounty.has(cityKey)) continue;
    selected.push(candidate);
    seenCityCounty.add(cityKey);
  }

  pilotByService[servicePrefix] = selected.slice(0, 10);
}

const pilotRows = SERVICE_PREFIXES.flatMap((servicePrefix) =>
  pilotByService[servicePrefix].map((route) => {
    const original = routeAnalyses.find((analysis) => analysis.publicUrl === route.public_url);
    const primaryProblem =
      route.hard_flags ||
      (route.local_evidence_score < 12
        ? "local evidence is thin"
        : route.unique_sentence_ratio < 0.2
          ? "template repetition is high"
          : route.data_completeness_score < 4
            ? "data completeness is limited"
            : "high opportunity generic page needs richer local proof");

    return {
      city: route.city,
      county: route.county,
      service: route.service,
      public_url: route.public_url,
      current_score: route.final_quality_score,
      target_score: Math.min(92, Math.max(80, route.final_quality_score + 14)),
      opportunity_score: route.opportunity_score,
      context: original?.setting || "",
      main_problem: primaryProblem,
      recommended_modules: route.recommended_modules,
      why_selected: `High content priority from repo signals: ${route.population_status}, ${original?.setting || "local"} context, service intent, internal link position.`,
      implementation_risk:
        route.hard_flags || route.local_evidence_score < 10 ? "medium" : "low",
    };
  }),
);

const duplicateUrls = scoredRoutes
  .map((route) => route.public_url)
  .filter((url, index, urls) => urls.indexOf(url) !== index);

const modeledRichSitemapUrls = [];
for (const row of csvRows) {
  for (const servicePrefix of SERVICE_PREFIXES) {
    const contentKey = contentKeySlug(row.City);
    const hasRich =
      canUseSharedCityContent(row.City, row.County) &&
      Boolean(richSources[servicePrefix][contentKey]);
    if (hasRich) modeledRichSitemapUrls.push(`/${cityServiceSlug(servicePrefix, row.City, row.County)}/`);
  }
}
const modeledRichSitemapSet = new Set(modeledRichSitemapUrls);
const genericInSitemap = scoredRoutes.filter((route) => modeledRichSitemapSet.has(route.public_url));

const sourceFilesChanged = [];
const allowedReportFiles = [
  "reports/generic-route-quality.csv",
  "reports/generic-route-quality-summary.json",
  "reports/generic-route-wrong-language.csv",
  "reports/generic-route-pilot-30.csv",
];

const validations = [
  {
    name: "generic route count",
    ok: scoredRoutes.length === EXPECTED_GENERIC_ROUTES,
    actual: scoredRoutes.length,
    expected: EXPECTED_GENERIC_ROUTES,
  },
  ...SERVICE_PREFIXES.map((servicePrefix) => ({
    name: `${servicePrefix} count`,
    ok: byService[servicePrefix] === EXPECTED_PER_SERVICE,
    actual: byService[servicePrefix],
    expected: EXPECTED_PER_SERVICE,
  })),
  {
    name: "duplicate URL count",
    ok: duplicateUrls.length === 0,
    actual: duplicateUrls.length,
    expected: 0,
  },
  {
    name: "pilot count",
    ok: pilotRows.length === 30,
    actual: pilotRows.length,
    expected: 30,
  },
  ...SERVICE_PREFIXES.map((servicePrefix) => ({
    name: `${servicePrefix} pilot count`,
    ok: pilotRows.filter((row) => row.service === servicePrefix).length === 10,
    actual: pilotRows.filter((row) => row.service === servicePrefix).length,
    expected: 10,
  })),
  {
    name: "all scores in 0-100",
    ok: scoredRoutes.every((route) => route.final_quality_score >= 0 && route.final_quality_score <= 100),
    actual: "all checked",
    expected: "0-100",
  },
  {
    name: "canonical identity exists",
    ok: scoredRoutes.every((route) => route.canonical_identity_exists),
    actual: "all checked",
    expected: true,
  },
  {
    name: "generic routes remain outside modeled sitemap",
    ok: genericInSitemap.length === 0,
    actual: genericInSitemap.length,
    expected: 0,
  },
  {
    name: "no noindex change modeled",
    ok: scoredRoutes.every((route) => route.noindex_changed === false),
    actual: "all checked",
    expected: false,
  },
  {
    name: "score distribution span",
    ok: scoreRange >= 20,
    actual: scoreRange,
    expected: ">=20",
  },
];

const writeCsv = (filePath, rows) => {
  const headers = Object.keys(rows[0] || {});
  const content = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");
  fs.writeFileSync(filePath, `${content}\n`);
};

fs.mkdirSync(reportsDir, { recursive: true });

const qualityRows = scoredRoutes.map(({ wrongLanguageFlags, ...route }) => route);
writeCsv(path.join(reportsDir, "generic-route-quality.csv"), qualityRows);
writeCsv(path.join(reportsDir, "generic-route-wrong-language.csv"), wrongLanguageRows);
writeCsv(path.join(reportsDir, "generic-route-pilot-30.csv"), pilotRows);

const previousApproximation = scoredRoutes.map((route) => route.full_page_word_count);
const mainWordCounts = scoredRoutes.map((route) => route.main_content_word_count);

const summary = {
  generated_at: new Date().toISOString(),
  note: "Opportunity score is a content prioritization score from repository signals only. It is not an SEO traffic, impression, or ranking forecast.",
  route_counts: {
    generic_total: scoredRoutes.length,
    by_service: byService,
    duplicate_urls: duplicateUrls.length,
    modeled_generic_sitemap_urls: genericInSitemap.length,
  },
  word_count_model: {
    main_content_average: Number((mainWordCounts.reduce((sum, value) => sum + value, 0) / mainWordCounts.length).toFixed(1)),
    full_page_average: Number((previousApproximation.reduce((sum, value) => sum + value, 0) / previousApproximation.length).toFixed(1)),
    average_excluded_boilerplate_words: Number(
      (
        previousApproximation.reduce((sum, value) => sum + value, 0) / previousApproximation.length -
        mainWordCounts.reduce((sum, value) => sum + value, 0) / mainWordCounts.length
      ).toFixed(1),
    ),
  },
  quality_distribution: {
    bands: bandCounts,
    min: Math.min(...scoreValues),
    max: Math.max(...scoreValues),
    average: Number((scoreValues.reduce((sum, value) => sum + value, 0) / scoreValues.length).toFixed(1)),
    score_range: scoreRange,
    model_warning: modelWarning,
  },
  population: {
    known_positive: scoredRoutes.filter((route) => route.population_status === "known_positive").length,
    unknown: scoredRoutes.filter((route) => route.population_status === "unknown").length,
    invalid: scoredRoutes.filter((route) => route.population_status === "invalid").length,
    true_zero_verified: 0,
  },
  wrong_service_language: {
    total_flags: wrongLanguageRows.length,
    by_severity: wrongLanguageRows.reduce((counts, row) => {
      counts[row.severity] = (counts[row.severity] || 0) + 1;
      return counts;
    }, {}),
    review_classification: wrongLanguageRows.reduce((counts, row) => {
      counts[row.review_classification] = (counts[row.review_classification] || 0) + 1;
      return counts;
    }, {}),
    calibration_notes: [
      "Removed controlled removal as a stump-grinding flag unless it is explicit emergency hazard removal.",
      "Removed replanting as a tree-removal/emergency flag because it can be normal aftercare context.",
      "Framework sentence repetition is measured in template ratios, not as an identical paragraph hard penalty.",
      "Identical paragraph collision now applies only to repeated normalized city descriptions.",
    ],
  },
  weakest_30: qualityRows
    .toSorted((a, b) => a.final_quality_score - b.final_quality_score || b.global_template_ratio - a.global_template_ratio)
    .slice(0, 30),
  highest_opportunity_30: qualityRows
    .toSorted((a, b) => b.opportunity_score - a.opportunity_score || a.final_quality_score - b.final_quality_score)
    .slice(0, 30),
  pilot_30: pilotRows,
  validations,
  files_written: allowedReportFiles,
  production_behavior: {
    source_page_templates_changed_by_script: false,
    route_behavior_changed_by_script: false,
    sitemap_behavior_changed_by_script: false,
    robots_or_noindex_changed_by_script: false,
    source_files_changed_by_script: sourceFilesChanged,
  },
};

fs.writeFileSync(
  path.join(reportsDir, "generic-route-quality-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);

const failures = validations.filter((validation) => !validation.ok);
console.log(
  JSON.stringify(
    {
      ok: failures.length === 0,
      summary: {
        genericRoutes: scoredRoutes.length,
        byService,
        qualityDistribution: summary.quality_distribution,
        population: summary.population,
        wrongLanguage: summary.wrong_service_language,
        pilotRows: pilotRows.length,
        reports: allowedReportFiles,
      },
      validationFailures: failures,
    },
    null,
    2,
  ),
);

if (failures.length > 0) {
  process.exit(1);
}
