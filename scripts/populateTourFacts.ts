import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'og32jxcd'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = '2026-09-22'

type Tour = {
  _id: string
  title: string
  slug?: string
  itinerary?: Array<{title?: string}>
}

type Difficulty = 'Easy level' | 'Moderate level' | 'Challenging level'

function routeText(tour: Tour) {
  return [tour.title, tour.slug, ...(tour.itinerary?.map((day) => day.title) ?? [])].filter(Boolean).join(' ')
}

function bestTime(tour: Tour) {
  const text = routeText(tour)

  if (/\bndutu\b|\bcalving season\b/i.test(text)) return 'December–March'
  if (/\bmara river\b|\briver[- ]crossings?\b|\bmigration crossings?\b|\bmigration area\b/i.test(text)) return 'July–October'
  if (/\bgreat migration\b|\bwildebeest migration\b/i.test(text)) return 'June–October'
  if (/\bzanzibar\b|\bbeach (?:holiday|adventure|escape)\b/i.test(text)) return 'June–October & December–February'

  return 'June–October'
}

function difficulty(tour: Tour): Difficulty {
  const text = routeText(tour)

  if (/\bkilimanjaro (?:climb|trek|route)\b|\bclimb(?:ing)? (?:mount )?kilimanjaro\b|\buhuru peak\b/i.test(text)) {
    return 'Challenging level'
  }

  if (/\bwalking safari\b|\bcanopy walk\b|\bnature walks?\b|\bhiking\b|\btrekking\b/i.test(text)) {
    return 'Moderate level'
  }

  return 'Easy level'
}

async function main() {
  const execute = process.argv.includes('--execute')
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (execute && !token) throw new Error('SANITY_API_WRITE_TOKEN is required with --execute.')

  const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})
  const tours = await client.fetch<Tour[]>("*[_type == 'safariTrip'] | order(title asc){_id, title, 'slug': slug.current, itinerary[]{title}}")

  const totals = new Map<string, number>()
  for (const tour of tours) {
    const time = bestTime(tour)
    const level = difficulty(tour)
    totals.set(`${time} | ${level}`, (totals.get(`${time} | ${level}`) ?? 0) + 1)
    console.log(`${execute ? 'Updating' : 'Would update'} ${tour.slug ?? tour._id}: ${time}; ${level}`)
  }

  console.log(`\nDistribution for ${tours.length} tours:`)
  for (const [facts, count] of totals) console.log(`  ${facts}: ${count}`)

  if (!execute) return

  const transaction = client.transaction()
  for (const tour of tours) {
    transaction.patch(tour._id, {
      setIfMissing: {
        tourStart: bestTime(tour),
        difficulty: difficulty(tour),
      },
    })
  }
  await transaction.commit()
  console.log(`Populated best time and difficulty for ${tours.length} tours.`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
