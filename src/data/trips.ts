export type Trip = {
  slug: string;
  title: string;
  duration: number;
  priceFrom: number;
  image: string;
  category: string;
  shortDescription: string;
};

export const trips: Trip[] = [
  {
    slug: "great-migration-river-crossing-serengeti",
    title: "Family Safari & Beach Escape",
    duration: 8,
    priceFrom: 2286,
    image: "/assets/home-trips-img-trip-card1-family-safari-beach-escape.png",
    category: "Safari & Beach",
    shortDescription: "A private family safari paired with a relaxing Indian Ocean escape.",
  },
  {
    slug: "great-migration-river-crossing-serengeti",
    title: "Classic Family Safari Circuit",
    duration: 8,
    priceFrom: 1468,
    image: "/assets/home-trips-img-trip-card2-classic-family-safari-circuit.png",
    category: "Safari",
    shortDescription: "A family-paced journey through Tanzania's classic northern parks.",
  },
  {
    slug: "great-migration-river-crossing-serengeti",
    title: "Short Family Safari from Zanzibar",
    duration: 8,
    priceFrom: 1089,
    image: "/assets/home-trips-img-trip-card3-short-family-safari-from-zanzibar.png",
    category: "Zanzibar",
    shortDescription: "An easy safari extension designed to connect with a Zanzibar stay.",
  },
  {
    slug: "great-migration-river-crossing-serengeti",
    title: "Private Family Safari Getaway",
    duration: 8,
    priceFrom: 1992,
    image: "/assets/home-trips-img-trip-card4-private-family-safari-getaway.png",
    category: "Safari",
    shortDescription: "A private safari with flexible pacing for every generation.",
  },
  {
    slug: "great-migration-river-crossing-serengeti",
    title: "Great Migration Family Adventure",
    duration: 9,
    priceFrom: 2640,
    image: "/assets/trip-hero-img-frame1321315437.png",
    category: "Safari",
    shortDescription: "A front-row family safari timed around the Serengeti migration.",
  },
  {
    slug: "great-migration-river-crossing-serengeti",
    title: "Northern Tanzania Explorer",
    duration: 10,
    priceFrom: 2380,
    image: "/assets/destination-ngorongoro.jpg",
    category: "Safari",
    shortDescription: "A relaxed route through Tanzania's best-loved northern parks.",
  },
  {
    slug: "great-migration-river-crossing-serengeti",
    title: "Tarangire & Ngorongoro Discovery",
    duration: 7,
    priceFrom: 1795,
    image: "/assets/destination-tarangire.jpg",
    category: "Safari",
    shortDescription: "Elephants, baobabs, and crater wildlife at a family-friendly pace.",
  },
  {
    slug: "great-migration-river-crossing-serengeti",
    title: "Zanzibar Family Beach Week",
    duration: 7,
    priceFrom: 1210,
    image: "/assets/destination-zanzibar.jpg",
    category: "Zanzibar",
    shortDescription: "A carefree Indian Ocean stay with room to relax together.",
  },
  {
    slug: "great-migration-river-crossing-serengeti",
    title: "Kilimanjaro & Safari Family Escape",
    duration: 11,
    priceFrom: 2870,
    image: "/assets/destination-kilimanjaro.jpg",
    category: "Safari",
    shortDescription: "Highland views and classic wildlife encounters for every generation.",
  },
  {
    slug: "great-migration-river-crossing-serengeti",
    title: "Southern Tanzania Wildlife Escape",
    duration: 8,
    priceFrom: 2165,
    image: "/assets/destination-nyerere.jpg",
    category: "Safari",
    shortDescription: "A quieter private safari among river landscapes and big wildlife.",
  },
];

export const tripHref = (trip: Trip) => `/tanzania-safaris/${trip.slug}`;
