import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'og32jxcd'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = '2026-09-22'

type PortableTextBlock = {children?: Array<{text?: string}>}
type Tour = {
  _id: string
  title: string
  slug?: string
  summary?: string
  tourStart?: string
  overview?: PortableTextBlock[]
  itinerary?: Array<{title?: string; description?: PortableTextBlock[]; accommodation?: {name?: string}}>
  inclusions?: Array<{title?: string; description?: PortableTextBlock[]}>
}

type TourFeatureFields = {
  tourStyle?: 'Budget' | 'Mid-range' | 'Luxury' | 'Budget Camping'
  accommodationTypes?: string[]
  tourType?: 'Private' | 'Shared'
  maxGroupSize?: number
  departureType?: 'Any Day' | 'Fixed Departure'
  customization?: 'Fully Customizable' | 'Minor Changes Allowed' | 'Not Customizable'
  soloTravelers?: 'Allowed' | 'Not Allowed'
  minimumAge?: number
  activities?: string[]
  gameDriveVehicles?: string[]
  transportTypes?: string[]
  airportTransfer?: 'Included' | 'Available at Extra Cost' | 'Not Included'
}

function textFromBlocks(blocks?: PortableTextBlock[]) {
  return blocks?.flatMap((block) => block.children?.map((child) => child.text ?? '') ?? []).join(' ') ?? ''
}

function unique<T>(values: T[]) {
  return [...new Set(values)]
}

function tourText(tour: Tour) {
  return [
    tour.title,
    tour.summary,
    tour.tourStart,
    textFromBlocks(tour.overview),
    ...(tour.itinerary?.flatMap((day) => [day.title, textFromBlocks(day.description), day.accommodation?.name]) ?? []),
    ...(tour.inclusions?.flatMap((item) => [item.title, textFromBlocks(item.description)]) ?? []),
  ].filter(Boolean).join(' ')
}

function accommodationTypes(tour: Tour) {
  const names = tour.itinerary?.map((day) => day.accommodation?.name ?? '').filter(Boolean).join(' ') ?? ''
  const types: string[] = []
  if (/\bcamping\b/i.test(names)) types.push('Camping')
  if (/\btented camp\b/i.test(names)) types.push('Tented Camp')
  if (/\blodge\b/i.test(names)) types.push('Lodge')
  if (/\bhotel\b/i.test(names)) types.push('Hotel')
  if (/\bcottage\b/i.test(names)) types.push('Cottage')
  if (/\bmountain hut\b/i.test(names)) types.push('Mountain Hut')
  return unique(types)
}

function deriveFields(tour: Tour): TourFeatureFields {
  const text = tourText(tour)
  const fields: TourFeatureFields = {}

  if (/\bcamping\b/i.test(tour.title)) fields.tourStyle = 'Budget Camping'
  else if (/\bmid[- ]?range\b/i.test(tour.title)) fields.tourStyle = 'Mid-range'
  else if (/\bbudget\b/i.test(tour.title)) fields.tourStyle = 'Budget'
  else if (/\bluxury\b/i.test(tour.title)) fields.tourStyle = 'Luxury'

  const stays = accommodationTypes(tour)
  if (stays.length) fields.accommodationTypes = stays

  if (/\bprivate (?:tour|safari)\b/i.test(`${tour.title} ${tour.summary ?? ''}`)) fields.tourType = 'Private'
  else if (/\bshared (?:tour|safari)\b/i.test(`${tour.title} ${tour.summary ?? ''}`)) fields.tourType = 'Shared'

  const groupSizeMatch = text.match(/\b(?:maximum|max) (?:group size of |of )?(\d+)\b/i)
  if (groupSizeMatch) fields.maxGroupSize = Number.parseInt(groupSizeMatch[1], 10)

  if (/\bany (?:day|date)\b|\bdaily departures?\b/i.test(tour.tourStart ?? '')) fields.departureType = 'Any Day'
  else if (/\bfixed departures?\b|\bselected departure dates?\b/i.test(tour.tourStart ?? '')) fields.departureType = 'Fixed Departure'

  if (/\bfully customi[sz]able\b/i.test(text)) fields.customization = 'Fully Customizable'
  else if (/\bminor changes? (?:are )?allowed\b/i.test(text)) fields.customization = 'Minor Changes Allowed'
  else if (/\bnot customi[sz]able\b/i.test(text)) fields.customization = 'Not Customizable'

  if (/\bsolo travelers? (?:are )?allowed\b/i.test(text)) fields.soloTravelers = 'Allowed'
  else if (/\bsolo travelers? (?:are )?not allowed\b/i.test(text)) fields.soloTravelers = 'Not Allowed'

  const minimumAgeMatch = text.match(/\bminimum age (?:is|:)?\s*(\d+)\b/i)
  if (minimumAgeMatch) fields.minimumAge = Number.parseInt(minimumAgeMatch[1], 10)

  const activities: string[] = []
  if (/\bgame drives?\b/i.test(text)) activities.push('Game Drives')
  if (/\bnight game drives?\b/i.test(text)) activities.push('Night Game Drives')
  if (/\bwalking safari\b/i.test(text)) activities.push('Walking Safari')
  if (/\bnature walks?\b|\bhikes?\b/i.test(text)) activities.push('Nature Walks / Hikes')
  if (/\bboat (?:safari|trip|ride)\b|\bdhow cruise\b/i.test(text)) activities.push('Boat Safari / Boat Trip')
  if (/\bbeach\b|\bsandbank\b|\bblue lagoon\b/i.test(text)) activities.push('Beach Time')
  if (activities.length) fields.activities = unique(activities)

  const vehicles: string[] = []
  if (/\bpop[- ]?up roof.{0,20}(?:4x4|4×4)|(?:4x4|4×4).{0,20}pop[- ]?up roof\b/i.test(text)) vehicles.push('Pop-up Roof 4x4')
  if (/\bpop[- ]?up roof minivan\b/i.test(text)) vehicles.push('Pop-up Roof Minivan')
  else if (/\bminivan\b/i.test(text)) vehicles.push('Minivan')
  if (vehicles.length) fields.gameDriveVehicles = unique(vehicles)

  const transport: string[] = []
  if (/\b(?:4x4|4×4) safari vehicle\b|\b(?:4x4|4×4) transportation\b/i.test(text)) transport.push('4x4 Safari Vehicle')
  if (/\bminivan\b/i.test(text)) transport.push('Minivan')
  if (/\bair transfer\b|\bflight (?:to|from)\b|\bfly (?:to|from)\b|\bairstrip\b/i.test(text)) transport.push('Air Transfer')
  if (/\bboat transfer\b/i.test(text)) transport.push('Boat Transfer')
  if (transport.length) fields.transportTypes = unique(transport)

  const inclusionsText = tour.inclusions?.flatMap((item) => [item.title, textFromBlocks(item.description)]).filter(Boolean).join(' ') ?? ''
  if (/\bairport (?:pick[ -]?up|drop[ -]?off|transfers?)\b/i.test(inclusionsText)) fields.airportTransfer = 'Included'
  else if (/\bairport transfers?.{0,40}\b(?:extra cost|additional cost)\b/i.test(text)) fields.airportTransfer = 'Available at Extra Cost'
  else if (/\bairport transfers?.{0,40}\bnot included\b/i.test(text)) fields.airportTransfer = 'Not Included'

  return fields
}

async function main() {
  const execute = process.argv.includes('--execute')
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (execute && !token) throw new Error('SANITY_API_WRITE_TOKEN is required with --execute.')

  const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})
  const tours = await client.fetch<Tour[]>("*[_type == 'safariTrip'] | order(title asc){_id, title, 'slug': slug.current, summary, tourStart, overview, itinerary[]{title, description, accommodation{name}}, inclusions[]{title, description}}")
  const derivedTours = tours.map((tour) => ({tour, fields: deriveFields(tour)}))
  const fieldCounts = new Map<string, number>()

  for (const {tour, fields} of derivedTours) {
    const entries = Object.entries(fields)
    entries.forEach(([field]) => fieldCounts.set(field, (fieldCounts.get(field) ?? 0) + 1))
    console.log(`${execute ? 'Updating' : 'Would update'} ${tour.slug ?? tour._id}: ${entries.length ? entries.map(([field, value]) => `${field}=${Array.isArray(value) ? value.join(' + ') : value}`).join('; ') : 'no confidently derived features'}`)
  }

  console.log(`\n${execute ? 'Updating' : 'Would update'} ${derivedTours.length} tours. Field coverage: ${[...fieldCounts.entries()].map(([field, count]) => `${field} ${count}`).join(', ') || 'none'}.`)
  if (!execute) return

  const transaction = client.transaction()
  for (const {tour, fields} of derivedTours) {
    if (Object.keys(fields).length) transaction.patch(tour._id, {setIfMissing: fields})
  }
  await transaction.commit()
  console.log('Saved all confidently derived tour feature fields.')
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
