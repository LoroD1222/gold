export const testimonials = [
  {
    id: "sarah-mechanic",
    name: "Sarah B",
    date: "September 2026",
    title: "three-day trip from Arusha to Lake Natron",
    text: "My family and I took a three-day trip from Arusha to Lake Natron. Ola was a fantastic guide, professional, helpful, but above all he became a friend! We did several daily trips and he always made himself available and participated in the various activities, creating a wonderful relationship with us and sharing moments of joy.",
    avatar: "/assets/home-testimonials-img-ellipse6.png",
    images: [
      "/assets/home-testimonials-img-rectangle83.png",
      "/assets/home-testimonials-img-rectangle85.png",
    ],
  },
  {
    id: "garrett-first",
    name: "Garrett B",
    date: "September 2026",
    title: "GTT Made the Trip of a Lifetime Possible",
    text: "My family just returned from a truly unforgettable two-week journey with Golden Trips Tanzania, and I can't recommend them highly enough. From start to finish, their team was professional, flexible, and genuinely invested in creating a meaningful and curated experience for our family (a group of 4–6 at different points in the trip).",
    avatar: "/assets/home-testimonials-img-ellipse7.png",
    images: [
      "/assets/home-testimonials-img-rectangle84.png",
      "/assets/home-testimonials-img-rectangle86.png",
    ],
  },
  {
    id: "sarah-family",
    name: "Sarah B",
    date: "September 2026",
    title: "three-day trip from Arusha to Lake Natron",
    text: "My family and I took a three-day trip from Arusha to Lake Natron. Ola was a fantastic guide, professional, helpful, but above all he became a friend! We did several daily trips and he always made himself available and participated in the various activities, creating a wonderful relationship with us and sharing moments of joy.",
    avatar: "/assets/home-testimonials-img-ellipse6.png",
    images: [
      "/assets/home-testimonials-img-rectangle87.png",
      "/assets/home-testimonials-img-rectangle84.png",
    ],
  },
  {
    id: "garrett-second",
    name: "Garrett B",
    date: "September 2026",
    title: "GTT Made the Trip of a Lifetime Possible",
    text: "My family just returned from a truly unforgettable two-week journey with Golden Trips Tanzania, and I can't recommend them highly enough. From start to finish, their team was professional, flexible, and genuinely invested in creating a meaningful and curated experience for our family (a group of 4–6 at different points in the trip).",
    avatar: "/assets/home-testimonials-img-ellipse7.png",
    images: [
      "/assets/home-testimonials-img-rectangle85.png",
      "/assets/home-testimonials-img-rectangle86.png",
    ],
  },
  {
    id: "sarah-third",
    name: "Sarah B",
    date: "September 2026",
    title: "three-day trip from Arusha to Lake Natron",
    text: "My family and I took a three-day trip from Arusha to Lake Natron. Ola was a fantastic guide, professional, helpful, but above all he became a friend! We did several daily trips and he always made himself available and participated in the various activities, creating a wonderful relationship with us and sharing moments of joy.",
    avatar: "/assets/home-testimonials-img-ellipse6.png",
    images: [
      "/assets/home-testimonials-img-rectangle87.png",
      "/assets/home-testimonials-img-rectangle85.png",
    ],
  },
  {
    id: "garrett-third",
    name: "Garrett B",
    date: "September 2026",
    title: "GTT Made the Trip of a Lifetime Possible",
    text: "My family just returned from a truly unforgettable two-week journey with Golden Trips Tanzania, and I can't recommend them highly enough. From start to finish, their team was professional, flexible, and genuinely invested in creating a meaningful and curated experience for our family (a group of 4–6 at different points in the trip).",
    avatar: "/assets/home-testimonials-img-ellipse7.png",
    images: [
      "/assets/home-testimonials-img-rectangle85.png",
      "/assets/home-testimonials-img-rectangle86.png",
    ],
  },
] as const;

export type Testimonial = (typeof testimonials)[number];
