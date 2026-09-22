import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";
import { createClient } from "@sanity/client";

const legacyBaseUrl = "https://goldentripstanzania.com";
const familyFriendlyTermId = 15;
const sampleNdutuSlug = "3-day-ndutu-calving-season-photographic-safari";
const apiVersion = "2026-09-22";
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(path.join(repositoryRoot, ".env.local"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "og32jxcd";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const extractedDirectory = path.join(repositoryRoot, "migration", "extracted");
const reportsDirectory = path.join(repositoryRoot, "migration", "reports");

type WordPressMedia = { source_url?: string; alt_text?: string };
type WordPressTerm = { name?: string };
type WordPressTour = {
  id: number;
  slug: string;
  link: string;
  title: { rendered?: string };
  content: { rendered?: string };
  excerpt?: { rendered?: string };
  featured_media?: number;
  _embedded?: { "wp:featuredmedia"?: WordPressMedia[]; "wp:term"?: WordPressTerm[][] };
};

type PortableTextBlock = {
  _key: string;
  _type: "block";
  style: "normal";
  markDefs: [];
  children: Array<{ _key: string; _type: "span"; marks: []; text: string }>;
};

type PriceTier = { _key: string; groupSize: string; pricePerPerson: number };
type ItineraryDay = {
  _key: string;
  dayRange: string;
  title: string;
  description?: PortableTextBlock[];
  images?: LegacyImage[];
  meals?: string;
  accommodation?: { name: string };
};
type LegacyImage = { url: string; alt: string };
type ExtractedTour = {
  sourceId: string;
  legacyUrl: string;
  slug: string;
  title: string;
  summary?: string;
  durationDays?: number;
  categories: string[];
  overview?: PortableTextBlock[];
  pricingTiers: PriceTier[];
  itinerary: ItineraryDay[];
  inclusions: Array<{ _key: string; title: string }>;
  exclusions: Array<{ _key: string; title: string }>;
  gallery: LegacyImage[];
  seo: { title?: string; description?: string; shareImage?: LegacyImage };
  warnings: string[];
};

type CommandOptions = {
  dryRun: boolean;
  slug?: string;
  limit?: number;
};

type ExtractionResult = {
  sourceId: string;
  slug: string;
  legacyUrl: string;
  tour?: ExtractedTour;
  error?: string;
};

type ImportResult = {
  assetErrors: string[];
};

function stableKey(value: string) {
  return createHash("sha1").update(value).digest("hex").slice(0, 12);
}

function cleanText(value: string | undefined) {
  if (!value) return "";
  return load(`<div>${value}</div>`)("div").text().replace(/\s+/g, " ").trim();
}

async function fetchWithRetry(url: string, init?: RequestInit, attempts = 3) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, init);
      if (response.ok || (response.status < 429 && response.status < 500)) return response;
      lastError = new Error(`Request failed with ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 500));
  }

  throw lastError instanceof Error ? lastError : new Error(`Could not fetch ${url}`);
}

function asPortableText(paragraphs: string[], sourceKey: string): PortableTextBlock[] | undefined {
  const blocks = paragraphs
    .map((paragraph) => cleanText(paragraph))
    .filter(Boolean)
    .map((text, index) => ({
      _key: stableKey(`${sourceKey}-${index}-${text}`),
      _type: "block" as const,
      style: "normal" as const,
      markDefs: [] as [],
      children: [{ _key: stableKey(`${sourceKey}-${index}-${text}-span`), _type: "span" as const, marks: [] as [], text }],
    }));

  return blocks.length ? blocks : undefined;
}

function blocksFromHtml(html: string | undefined, sourceKey: string) {
  if (!html) return undefined;
  const $ = load(html);
  const paragraphs = $("p").map((_, element) => $(element).text()).get();
  return asPortableText(paragraphs.length ? paragraphs : [$.text()], sourceKey);
}

function parseDuration(title: string) {
  const match = title.match(/\b(\d+)\s*[-–]?\s*day\b/i);
  return match ? Number.parseInt(match[1], 10) : undefined;
}

function imageFromWordPress(tour: WordPressTour): LegacyImage | undefined {
  const media = tour._embedded?.["wp:featuredmedia"]?.[0];
  if (!media?.source_url) return undefined;
  return { url: media.source_url, alt: cleanText(media.alt_text) || cleanText(tour.title.rendered) };
}

function sourceImageFromElement($: ReturnType<typeof load>, element: Parameters<ReturnType<typeof load>>[0]): LegacyImage | undefined {
  const image = $(element);
  const candidates = [image.attr("data-lzl-srcset"), image.attr("srcset")]
    .filter((sourceSet): sourceSet is string => Boolean(sourceSet))
    .flatMap((sourceSet) => sourceSet.split(",").map((candidate) => {
      const [url, descriptor] = candidate.trim().split(/\s+/, 2);
      return {url, width: Number.parseInt(descriptor, 10) || 0};
    }));

  const fallbackUrl = image.attr("data-lzl-src") ?? image.attr("src");
  if (fallbackUrl) candidates.push({url: fallbackUrl, width: 0});

  const selected = candidates
    .filter((candidate) => candidate.url.startsWith(`${legacyBaseUrl}/wp-content/uploads/`))
    .sort((left, right) => right.width - left.width)[0];

  return selected ? {url: selected.url, alt: cleanText(image.attr("alt"))} : undefined;
}

function extractItineraryImages($: ReturnType<typeof load>) {
  const imagesByDay = new Map<number, LegacyImage[]>();

  $(".jet-listing-grid__item").each((_, item) => {
    const itemText = cleanText($(item).text());
    const dayMatch = itemText.match(/^Day\s+(\d+)(?:\s*[-–]\s*\d+)?\b/i);
    if (!dayMatch || !/Meals Plan:/i.test(itemText)) return;

    const images = $(item).find("img").toArray()
      .flatMap((image) => {
        const extracted = sourceImageFromElement($, image);
        return extracted ? [extracted] : [];
      })
      .filter((image, index, values) => values.findIndex((candidate) => candidate.url === image.url) === index);

    if (images.length) imagesByDay.set(Number.parseInt(dayMatch[1], 10), images);
  });

  return imagesByDay;
}

function extractPriceTiers($: ReturnType<typeof load>, sourceKey: string) {
  const table = $("table.jet-table").filter((_, element) => {
    const headers = $(element).find("thead th").map((__, header) => cleanText($(header).text())).get();
    const prices = $(element).find("tbody tr").first().find("td").map((__, cell) => cleanText($(cell).text())).get();
    return headers.some((header) => /person/i.test(header)) && prices.some((price) => /\$\s*[\d,]+(?:\.\d{1,2})?/.test(price));
  }).first();

  if (!table.length) return [];

  const headers = table.find("thead th").map((_, header) => cleanText($(header).text())).get();
  const prices = table.find("tbody tr").first().find("td").map((_, cell) => cleanText($(cell).text())).get();

  return headers.flatMap((groupSize, index) => {
    const price = Number.parseFloat((prices[index] ?? "").replace(/[^0-9.]/g, ""));
    if (!groupSize || !Number.isFinite(price)) return [];
    return [{ _key: stableKey(`${sourceKey}-price-${groupSize}-${price}`), groupSize, pricePerPerson: price }];
  });
}

function extractSummaryDays($: ReturnType<typeof load>) {
  const days = new Map<number, string>();

  $(".jet-listing-grid__item").each((_, item) => {
    const values = $(item).find(".jet-listing-dynamic-field__content").map((__, field) => cleanText($(field).text())).get();
    const dayIndex = values.findIndex((value) => /^Day\s+\d+(?:\s*[-–]\s*\d+)?$/i.test(value));
    if (dayIndex === -1 || !values[dayIndex + 1]) return;
    const match = values[dayIndex].match(/^Day\s+(\d+)/i);
    if (match) days.set(Number.parseInt(match[1], 10), values[dayIndex + 1]);
  });

  return days;
}

function extractItinerary($: ReturnType<typeof load>, sourceKey: string) {
  const summaryDays = extractSummaryDays($);
  const imagesByDay = extractItineraryImages($);
  const body = cleanText($("body").text());
  const priceIndex = body.indexOf("Price Rates");
  const quoteIndex = body.indexOf("Get My Quote", Math.max(priceIndex, 0));
  const detailText = quoteIndex >= 0 ? body.slice(quoteIndex + "Get My Quote".length) : "";
  const dayMatches = [...detailText.matchAll(/\bDay\s+(\d+)(?:\s*[-–]\s*(\d+))?\b/gi)];
  const days: ItineraryDay[] = [];

  dayMatches.forEach((match, index) => {
    const dayNumber = Number.parseInt(match[1], 10);
    if (!summaryDays.has(dayNumber)) return;
    const nextMatch = dayMatches[index + 1];
    const end = nextMatch?.index ?? detailText.search(/\bIncluded\b|\bRELATED TOURS\b/i);
    const segment = detailText.slice(match.index! + match[0].length, end >= 0 ? end : undefined).trim();
    const title = summaryDays.get(dayNumber)!;
    const mealMatch = segment.match(/Meals Plan:\s*(.+?)(?=\s+Accommodations?:|$)/i);
    const accommodationMatch = segment.match(/Accommodations?:\s*(.+?)$/i);
    const description = segment
      .replace(/Meals Plan:\s*.+?(?=\s+Accommodations?:|$)/i, "")
      .replace(/Accommodations?:\s*.+?$/i, "")
      .trim();
    const dayRange = match[2] ? `Day ${dayNumber}–${match[2]}` : `Day ${dayNumber}`;
    const images = imagesByDay.get(dayNumber);

    days.push({
      _key: stableKey(`${sourceKey}-${dayRange}-${title}`),
      dayRange,
      title,
      ...(asPortableText([description], `${sourceKey}-${dayRange}-description`) ? { description: asPortableText([description], `${sourceKey}-${dayRange}-description`) } : {}),
      ...(images?.length ? { images } : {}),
      ...(mealMatch ? { meals: cleanText(mealMatch[1]) } : {}),
      ...(accommodationMatch ? { accommodation: { name: cleanText(accommodationMatch[1]) } } : {}),
    });
  });

  return days.filter((day, index, values) => values.findIndex((candidate) => candidate.dayRange === day.dayRange) === index);
}

function extractSectionItems($: ReturnType<typeof load>, heading: "Included" | "Excluded", sourceKey: string) {
  const headings = $("h1, h2, h3, h4, h5, h6").map((_, element) => ({ tag: element.tagName.toLowerCase(), text: cleanText($(element).text()) })).get();
  const start = headings.findIndex((item) => item.text.toLowerCase() === heading.toLowerCase());
  if (start === -1) return [];

  const endMarkers = heading === "Included" ? ["excluded"] : ["related tours", "let us design", "sample itineraries"];
  const values: string[] = [];
  for (let index = start + 1; index < headings.length; index += 1) {
    const item = headings[index];
    if (endMarkers.some((marker) => item.text.toLowerCase().includes(marker))) break;
    if (item.tag === "h3" && item.text) values.push(item.text);
  }

  return values
    .filter((value, index, all) => all.indexOf(value) === index)
    .map((title) => ({ _key: stableKey(`${sourceKey}-${heading}-${title}`), title }));
}

function extractSeo($: ReturnType<typeof load>, fallbackTitle: string) {
  const title = cleanText($("meta[property='og:title']").attr("content")) || fallbackTitle;
  const description = cleanText($("meta[name='description']").attr("content"));
  const shareImageUrl = $("meta[property='og:image']").attr("content");
  const shareImageAlt = cleanText($("meta[property='og:image:alt']").attr("content")) || fallbackTitle;
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(shareImageUrl ? { shareImage: { url: shareImageUrl, alt: shareImageAlt } } : {}),
  };
}

async function extractTour(tour: WordPressTour): Promise<ExtractedTour> {
  const response = await fetchWithRetry(tour.link, { headers: { "user-agent": "GoldenTripsSanityMigration/1.0" } });
  if (!response.ok) throw new Error(`Could not fetch ${tour.link}: ${response.status}`);

  const html = await response.text();
  const $ = load(html);
  const sourceKey = `wordpress-${tour.id}`;
  const title = cleanText(tour.title.rendered);
  const durationDays = parseDuration(title);
  const overview = blocksFromHtml(tour.content.rendered, `${sourceKey}-overview`);
  const summary = cleanText(tour.excerpt?.rendered);
  const pricingTiers = extractPriceTiers($, sourceKey);
  const itinerary = extractItinerary($, sourceKey);
  const inclusions = extractSectionItems($, "Included", sourceKey);
  const exclusions = extractSectionItems($, "Excluded", sourceKey);
  const featuredImage = imageFromWordPress(tour);
  const seo = extractSeo($, title);
  const warnings: string[] = [];

  if (!durationDays) warnings.push("No duration could be parsed from the source title.");
  if (!overview?.length) warnings.push("No overview content was available from the public WordPress API.");
  if (!pricingTiers.length) warnings.push("No structured price table was found.");
  if (!itinerary.length) warnings.push("No detailed itinerary could be parsed from the rendered page.");
  if (!featuredImage) warnings.push("No WordPress featured image was available for the hero gallery.");
  if (!inclusions.length) warnings.push("No included-services list was found.");
  if (!exclusions.length) warnings.push("No excluded-services list was found.");
  if (itinerary.some((day) => !day.description?.length)) warnings.push("One or more itinerary days have no usable description.");
  if (itinerary.some((day) => !day.images?.length)) warnings.push("One or more itinerary days have no source image gallery.");
  if (itinerary.some((day) => !day.meals)) warnings.push("One or more itinerary days have no stated meals.");
  if (itinerary.some((day) => !day.accommodation?.name)) warnings.push("One or more itinerary days have no stated accommodation.");

  const categories = (tour._embedded?.["wp:term"] ?? [])
    .flat()
    .map((term) => cleanText(term.name))
    .filter((name, index, values) => name && values.indexOf(name) === index);

  return {
    sourceId: String(tour.id),
    legacyUrl: tour.link,
    slug: tour.slug,
    title,
    ...(summary ? { summary } : {}),
    ...(durationDays ? { durationDays } : {}),
    categories,
    ...(overview ? { overview } : {}),
    pricingTiers,
    itinerary,
    inclusions,
    exclusions,
    gallery: featuredImage ? [featuredImage] : [],
    seo,
    warnings,
  };
}

async function fetchTours(options: CommandOptions) {
  const endpoint = options.slug
    ? `${legacyBaseUrl}/wp-json/wp/v2/tours?slug=${encodeURIComponent(options.slug)}&_embed=1`
    : `${legacyBaseUrl}/wp-json/wp/v2/tours?trip-type=${familyFriendlyTermId}&per_page=100&_embed=1`;
  const response = await fetchWithRetry(endpoint, { headers: { "user-agent": "GoldenTripsSanityMigration/1.0" } });
  if (!response.ok) throw new Error(`Could not fetch WordPress tours: ${response.status}`);
  const tours = (await response.json()) as WordPressTour[];
  return options.limit ? tours.slice(0, options.limit) : tours;
}

async function mapWithConcurrency<T, R>(items: T[], worker: (item: T) => Promise<R>, concurrency = 4) {
  const results: R[] = [];
  let nextIndex = 0;

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index]);
    }
  }));

  return results;
}

async function uploadImage(client: ReturnType<typeof createClient>, image: LegacyImage, cache: Map<string, string>) {
  const cached = cache.get(image.url);
  if (cached) return {_type: "image", asset: {_type: "reference", _ref: cached}, alt: image.alt};

  const response = await fetchWithRetry(image.url);
  if (!response.ok) throw new Error(`Could not download image ${image.url}: ${response.status}`);
  const asset = await client.assets.upload("image", Buffer.from(await response.arrayBuffer()), {
    filename: path.basename(new URL(image.url).pathname),
    contentType: response.headers.get("content-type") ?? undefined,
  });
  cache.set(image.url, asset._id);
  return {_type: "image", asset: {_type: "reference", _ref: asset._id}, alt: image.alt};
}

async function importTour(client: ReturnType<typeof createClient>, tour: ExtractedTour, assetCache: Map<string, string>) {
  const assetErrors: string[] = [];
  const gallery = [];
  for (const image of tour.gallery) {
    try {
      gallery.push(await uploadImage(client, image, assetCache));
    } catch (error) {
      assetErrors.push(`Hero image skipped (${image.url}): ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  let shareImage;
  if (tour.seo.shareImage) {
    try {
      shareImage = await uploadImage(client, tour.seo.shareImage, assetCache);
    } catch (error) {
      assetErrors.push(`SEO image skipped (${tour.seo.shareImage.url}): ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  const itinerary = await Promise.all(tour.itinerary.map(async (day) => {
    const {images: sourceImages, ...dayFields} = day;
    const images = [];
    for (const image of sourceImages ?? []) {
      try {
        images.push(await uploadImage(client, image, assetCache));
      } catch (error) {
        assetErrors.push(`Itinerary image skipped (${day.dayRange}, ${image.url}): ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    return {...dayFields, ...(images.length ? {images} : {})};
  }));

  const fields = {
    title: tour.title,
    slug: {_type: "slug", current: tour.slug},
    ...(tour.summary ? {summary: tour.summary} : {}),
    ...(tour.durationDays ? {durationDays: tour.durationDays} : {}),
    ...(tour.categories.length ? {categories: tour.categories} : {}),
    ...(gallery.length ? {gallery} : {}),
    ...(tour.overview?.length ? {overview: tour.overview} : {}),
    ...(tour.pricingTiers.length ? {pricingTiers: tour.pricingTiers, startingPrice: Math.min(...tour.pricingTiers.map((tier) => tier.pricePerPerson))} : {}),
    ...(itinerary.length ? {itinerary} : {}),
    ...(tour.inclusions.length ? {inclusions: tour.inclusions} : {}),
    ...(tour.exclusions.length ? {exclusions: tour.exclusions} : {}),
    ...(Object.keys(tour.seo).length ? {seo: {...tour.seo, ...(shareImage ? {shareImage} : {})}} : {}),
    legacy: {source: "WordPress", sourceId: tour.sourceId, url: tour.legacyUrl, migratedAt: new Date().toISOString()},
  };
  const document = {_type: "safariTrip", ...fields};
  const existing = await client.fetch<{_id: string} | null>(
    "*[_type == 'safariTrip' && (legacy.sourceId == $sourceId || slug.current == $slug)][0]{_id}",
    {sourceId: tour.sourceId, slug: tour.slug},
  );
  if (existing?._id) {
    await client.patch(existing._id).set(fields).commit({autoGenerateArrayKeys: true});
  } else {
    await client.create(document, {autoGenerateArrayKeys: true});
  }
  return {assetErrors} satisfies ImportResult;
}

function parseOptions(): CommandOptions {
  const argumentsList = process.argv.slice(2);
  const slugArgument = argumentsList.find((argument) => argument.startsWith("--slug="));
  const limitArgument = argumentsList.find((argument) => argument.startsWith("--limit="));
  return {
    dryRun: !argumentsList.includes("--execute"),
    ...(slugArgument ? {slug: slugArgument.slice("--slug=".length)} : {}),
    ...(limitArgument ? {limit: Number.parseInt(limitArgument.slice("--limit=".length), 10)} : {}),
  };
}

function reportTour(tour: ExtractedTour) {
  console.log(`\n${tour.title}`);
  console.log(`  URL: ${tour.legacyUrl}`);
  console.log(`  Slug: ${tour.slug}`);
  console.log(`  Duration: ${tour.durationDays ?? "missing"} days`);
  console.log(`  Pricing tiers: ${tour.pricingTiers.length ? tour.pricingTiers.map((tier) => `${tier.groupSize} $${tier.pricePerPerson}`).join(", ") : "none"}`);
  console.log(`  Itinerary days: ${tour.itinerary.length}`);
  console.log(`  Itinerary images: ${tour.itinerary.reduce((total, day) => total + (day.images?.length ?? 0), 0)}`);
  console.log(`  Images: ${tour.gallery.length}`);
  console.log(`  Included: ${tour.inclusions.length}; excluded: ${tour.exclusions.length}`);
  if (tour.warnings.length) console.log(`  Warnings: ${tour.warnings.join(" | ")}`);
}

async function main() {
  const options = parseOptions();
  const requestedSlug = options.slug ?? "family-friendly-safaris";
  const rawTours = await fetchTours(options);
  if (options.slug && options.slug === sampleNdutuSlug) console.log("Running the requested standalone Ndutu validation sample.");
  if (!rawTours.length) throw new Error(`No WordPress tours found for ${requestedSlug}.`);

  const extractionResults = await mapWithConcurrency<WordPressTour, ExtractionResult>(rawTours, async (rawTour) => {
    try {
      return {
        sourceId: String(rawTour.id),
        slug: rawTour.slug,
        legacyUrl: rawTour.link,
        tour: await extractTour(rawTour),
      };
    } catch (error) {
      return {
        sourceId: String(rawTour.id),
        slug: rawTour.slug,
        legacyUrl: rawTour.link,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });
  const extractedTours = extractionResults.flatMap((result) => result.tour ? [result.tour] : []);
  const failures = extractionResults.flatMap((result) => result.error ? [{sourceId: result.sourceId, slug: result.slug, url: result.legacyUrl, error: result.error}] : []);
  await Promise.all([mkdir(extractedDirectory, {recursive: true}), mkdir(reportsDirectory, {recursive: true})]);
  const reportName = options.slug ? options.slug : "family-friendly-safaris";
  await writeFile(path.join(extractedDirectory, `${reportName}.json`), JSON.stringify({retrievedAt: new Date().toISOString(), source: legacyBaseUrl, rawTours, extractionResults}, null, 2));
  await writeFile(path.join(reportsDirectory, `${reportName}.json`), JSON.stringify({scope: reportName, dryRun: options.dryRun, requested: rawTours.length, extracted: extractedTours.length, failed: failures, warnings: extractedTours.flatMap((tour) => tour.warnings.map((warning) => ({slug: tour.slug, warning}))), tours: extractedTours.map((tour) => ({title: tour.title, url: tour.legacyUrl, slug: tour.slug, durationDays: tour.durationDays, pricingTiers: tour.pricingTiers, itineraryDays: tour.itinerary.length, images: tour.gallery.length, itineraryImages: tour.itinerary.reduce((total, day) => total + (day.images?.length ?? 0), 0), inclusions: tour.inclusions.length, exclusions: tour.exclusions.length, warnings: tour.warnings}))}, null, 2));

  console.log(`${options.dryRun ? "DRY RUN" : "IMPORT"}: ${extractedTours.length}/${rawTours.length} tour(s) extracted in ${reportName}`);
  extractedTours.forEach(reportTour);
  if (failures.length) {
    console.warn(`\n${failures.length} source page(s) could not be extracted:`);
    failures.forEach((failure) => console.warn(`  ${failure.slug}: ${failure.error}`));
  }

  if (options.dryRun) return;
  if (failures.length) throw new Error("Import stopped because one or more source pages could not be extracted. Resolve the report failures before using --execute.");

  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("SANITY_API_WRITE_TOKEN is required when using --execute. Dry runs never need a token.");
  const client = createClient({projectId, dataset, apiVersion, token, useCdn: false});
  const assetCache = new Map<string, string>();
  const importFailures: Array<{slug: string; error: string}> = [];
  for (const tour of extractedTours) {
    try {
      const result = await importTour(client, tour, assetCache);
      console.log(`Imported ${tour.title}`);
      result.assetErrors.forEach((assetError) => console.warn(`  ${assetError}`));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      importFailures.push({slug: tour.slug, error: message});
      console.error(`Failed to import ${tour.title}: ${message}`);
    }
  }
  if (importFailures.length) throw new Error(`${importFailures.length} tour document(s) could not be imported: ${importFailures.map((failure) => failure.slug).join(", ")}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
