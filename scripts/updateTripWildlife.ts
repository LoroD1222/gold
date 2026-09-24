import {createHash} from 'node:crypto'
import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'og32jxcd'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = '2026-09-22'

type Availability = 'Abundant' | 'Common' | 'Rare'
type AnimalId =
  | 'wildebeest'
  | 'zebra'
  | 'lion'
  | 'hyena'
  | 'antelope'
  | 'giraffe'
  | 'african-buffalo'
  | 'cheetah'
  | 'leopard'
  | 'warthog'
  | 'hippopotamus'
  | 'ostrich'
  | 'baboon'
  | 'crocodile'
  | 'rhinoceros'
  | 'african-wild-dog'

type WildlifeProfile = Record<Availability, AnimalId[]>
type Trip = {_id: string; title: string; slug?: string; stops?: string[]}

const wildlifeHeading = 'Wildlife you may encounter'

const profiles: Record<string, WildlifeProfile> = {
  serengeti: {
    Abundant: ['wildebeest', 'zebra', 'lion', 'hyena', 'antelope'],
    Common: ['giraffe', 'african-buffalo', 'cheetah', 'leopard', 'warthog', 'hippopotamus', 'ostrich', 'baboon', 'crocodile'],
    Rare: ['rhinoceros', 'african-wild-dog'],
  },
  ngorongoro: {
    Abundant: ['wildebeest', 'zebra', 'african-buffalo', 'lion', 'hyena'],
    Common: ['hippopotamus', 'warthog', 'ostrich', 'baboon', 'cheetah', 'giraffe', 'antelope'],
    Rare: ['rhinoceros', 'leopard', 'african-wild-dog', 'crocodile'],
  },
  tarangire: {
    Abundant: ['giraffe', 'zebra', 'wildebeest', 'african-buffalo', 'antelope'],
    Common: ['lion', 'leopard', 'hyena', 'warthog', 'baboon', 'ostrich'],
    Rare: ['cheetah', 'african-wild-dog'],
  },
  lakeManyara: {
    Abundant: ['baboon', 'african-buffalo'],
    Common: ['giraffe', 'zebra', 'wildebeest', 'hippopotamus', 'antelope', 'warthog', 'lion'],
    Rare: ['leopard', 'cheetah', 'hyena', 'african-wild-dog', 'ostrich'],
  },
  arusha: {
    Abundant: ['giraffe', 'african-buffalo', 'zebra', 'baboon'],
    Common: ['warthog', 'hippopotamus'],
    Rare: ['leopard', 'hyena', 'antelope'],
  },
  mkomazi: {
    Abundant: ['giraffe', 'zebra', 'antelope'],
    Common: ['african-buffalo', 'warthog', 'ostrich'],
    Rare: ['lion', 'leopard', 'cheetah', 'hyena', 'rhinoceros', 'african-wild-dog', 'wildebeest'],
  },
  mikumi: {
    Abundant: ['zebra', 'giraffe', 'african-buffalo', 'wildebeest', 'antelope'],
    Common: ['lion', 'hippopotamus', 'warthog', 'baboon', 'hyena', 'ostrich', 'crocodile'],
    Rare: ['leopard', 'cheetah', 'african-wild-dog', 'rhinoceros'],
  },
  ruaha: {
    Abundant: ['african-buffalo', 'giraffe', 'antelope'],
    Common: ['lion', 'leopard', 'hyena', 'zebra', 'hippopotamus', 'crocodile', 'warthog', 'baboon', 'cheetah'],
    Rare: ['african-wild-dog', 'ostrich'],
  },
  nyerere: {
    Abundant: ['hippopotamus', 'crocodile', 'african-buffalo', 'giraffe', 'antelope'],
    Common: ['lion', 'zebra', 'warthog', 'hyena', 'baboon', 'african-wild-dog'],
    Rare: ['leopard', 'wildebeest', 'cheetah', 'rhinoceros'],
  },
}

const profileMatchers: Array<{name: keyof typeof profiles; pattern: RegExp}> = [
  {name: 'serengeti', pattern: /serengeti|seronera|mara river|ndutu|masai mara|great migration/i},
  {name: 'ngorongoro', pattern: /ngorongoro|crater/i},
  {name: 'tarangire', pattern: /tarangire/i},
  {name: 'lakeManyara', pattern: /lake manyara/i},
  {name: 'arusha', pattern: /arusha national park/i},
  {name: 'mkomazi', pattern: /mkomazi/i},
  {name: 'mikumi', pattern: /mikumi/i},
  {name: 'ruaha', pattern: /ruaha/i},
  {name: 'nyerere', pattern: /nyerere|selous/i},
]

const availabilityRank: Record<Availability, number> = {Abundant: 3, Common: 2, Rare: 1}
const animalOrder: AnimalId[] = [
  'wildebeest', 'zebra', 'lion', 'hyena', 'antelope', 'giraffe', 'african-buffalo', 'cheetah',
  'leopard', 'warthog', 'hippopotamus', 'ostrich', 'baboon', 'crocodile', 'rhinoceros', 'african-wild-dog',
]

function stableKey(value: string) {
  return createHash('sha1').update(value).digest('hex').slice(0, 12)
}

function matchingProfiles(trip: Trip) {
  const route = [trip.title, trip.slug, ...(trip.stops ?? [])].filter(Boolean).join(' ')
  return profileMatchers.filter((matcher) => matcher.pattern.test(route)).map((matcher) => matcher.name)
}

function wildlifeFor(profilesForTrip: Array<keyof typeof profiles>, sourceKey: string) {
  const availabilityByAnimal = new Map<AnimalId, Availability>()

  for (const profileName of profilesForTrip) {
    const profile = profiles[profileName]
    for (const availability of ['Abundant', 'Common', 'Rare'] as const) {
      for (const animal of profile[availability]) {
        const currentAvailability = availabilityByAnimal.get(animal)
        if (!currentAvailability || availabilityRank[availability] > availabilityRank[currentAvailability]) {
          availabilityByAnimal.set(animal, availability)
        }
      }
    }
  }

  return animalOrder
    .filter((animal) => availabilityByAnimal.has(animal))
    .sort((left, right) => {
      const availabilityDifference = availabilityRank[availabilityByAnimal.get(right)!] - availabilityRank[availabilityByAnimal.get(left)!]
      return availabilityDifference || animalOrder.indexOf(left) - animalOrder.indexOf(right)
    })
    .map((animal) => ({
      _key: stableKey(`${sourceKey}-wildlife-${animal}`),
      _type: 'object' as const,
      animal,
      availability: availabilityByAnimal.get(animal)!,
    }))
}

async function main() {
  const execute = process.argv.includes('--execute')
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (execute && !token) throw new Error('SANITY_API_WRITE_TOKEN is required with --execute.')

  const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})
  const trips = await client.fetch<Trip[]>("*[_type == 'safariTrip'] | order(title asc){_id, title, 'slug': slug.current, 'stops': itinerary[].title}")
  const mappedTrips = trips.map((trip) => ({trip, profiles: matchingProfiles(trip)}))
  const unmapped = mappedTrips.filter(({profiles}) => !profiles.length).map(({trip}) => `${trip.title} (${trip.slug ?? trip._id})`)

  if (unmapped.length) throw new Error(`No supplied wildlife profile matches: ${unmapped.join(', ')}`)

  for (const {trip, profiles: profilesForTrip} of mappedTrips) {
    const wildlife = wildlifeFor(profilesForTrip, trip._id)
    if (!wildlife.length) throw new Error(`No wildlife entries created for ${trip.title}.`)
    console.log(`${execute ? 'Updating' : 'Would update'} ${trip.slug ?? trip._id}: ${profilesForTrip.join(', ')} (${wildlife.length} animals)`)
  }

  if (!execute) return

  const transaction = client.transaction()
  for (const {trip, profiles: profilesForTrip} of mappedTrips) {
    transaction.patch(trip._id, {
      set: {
        wildlifeHeading,
        wildlife: wildlifeFor(profilesForTrip, trip._id),
      },
    })
  }
  await transaction.commit()
  console.log(`Updated wildlife content for ${mappedTrips.length} trips.`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
