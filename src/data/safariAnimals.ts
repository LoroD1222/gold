export const safariAnimals = [
  { id: "elephant", title: "Elephant", src: "/assets/trip-animal-elephant.jpg", imageClass: "h-[165px] max-w-[234px]" },
  { id: "giraffe", title: "Giraffe", src: "/assets/animals/giraffe.jpg", imageClass: "h-[185px] max-w-[137px]" },
  { id: "lion", title: "Lion", src: "/assets/animals/lion.jpg", imageClass: "h-[136px] max-w-[174px]" },
  { id: "leopard", title: "Leopard", src: "/assets/animals/leopard.jpg", imageClass: "h-[136px] max-w-[174px]" },
  { id: "cheetah", title: "Cheetah", src: "/assets/animals/cheetah.jpg", imageClass: "h-[136px] max-w-[174px]" },
  { id: "crocodile", title: "Crocodile", src: "/assets/animals/crocodile.jpg", imageClass: "h-[116px] max-w-[234px]" },
  { id: "baboon", title: "Baboon", src: "/assets/animals/baboon.jpg", imageClass: "h-[144px] max-w-[174px]" },
  { id: "antelope", title: "Antelope", src: "/assets/animals/antelope.jpg", imageClass: "h-[175px] max-w-[137px]" },
  { id: "hyena", title: "Hyena", src: "/assets/animals/hyena.jpg", imageClass: "h-[136px] max-w-[174px]" },
  { id: "ostrich", title: "Ostrich", src: "/assets/animals/ostrich.jpg", imageClass: "h-[175px] max-w-[137px]" },
  { id: "wildebeest", title: "Wildebeest", src: "/assets/animals/wildebeest.jpg", imageClass: "h-[136px] max-w-[174px]" },
  { id: "zebra", title: "Zebra", src: "/assets/animals/zebra.jpg", imageClass: "h-[136px] max-w-[174px]" },
  { id: "hippopotamus", title: "Hippopotamus", src: "/assets/animals/hippopotamus.jpg", imageClass: "h-[136px] max-w-[174px]" },
  { id: "african-buffalo", title: "African buffalo", src: "/assets/animals/african-buffalo.jpg", imageClass: "h-[136px] max-w-[174px]" },
  { id: "rhinoceros", title: "Rhinoceros", src: "/assets/animals/rhinoceros.jpg", imageClass: "h-[136px] max-w-[194px]" },
  { id: "warthog", title: "Warthog", src: "/assets/animals/warthog.jpg", imageClass: "h-[115px] max-w-[174px]" },
  { id: "african-wild-dog", title: "African wild dog", src: "/assets/animals/african-wild-dog.jpg", imageClass: "h-[136px] max-w-[150px]" },
] as const;

export type SafariAnimalId = (typeof safariAnimals)[number]["id"];

export function isSafariAnimalId(value: string): value is SafariAnimalId {
  return safariAnimals.some((animal) => animal.id === value);
}

export function getSafariAnimal(id: SafariAnimalId) {
  return safariAnimals.find((animal) => animal.id === id)!;
}
