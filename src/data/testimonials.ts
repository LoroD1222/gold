export const testimonials = [
  {
    id: "sarah",
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
    id: "garrett",
    name: "Garrett B",
    date: "April 2026",
    title: "GTT Made the Trip of a Lifetime Possible",
    text: "My family just returned from a truly unforgettable two-week journey with Golden Trips Tanzania, and I can't recommend them highly enough. From start to finish, their team was professional, flexible, and genuinely invested in creating a meaningful and curated experience for our family (a group of 4–6 at different points in the trip).",
    avatar: "/assets/home-testimonials-img-ellipse7.png",
    images: [
      "/assets/home-testimonials-img-rectangle84.png",
      "/assets/home-testimonials-img-rectangle86.png",
    ],
  },
  {
    id: "brian",
    name: "Brian B",
    date: "Jul 2026",
    title: "Incredible Sarafri Experience",
    text: "I had the pleasure of experiencing Tanzania with Golden Trips. Let me just say that it was one of the most incredible experiences of my life. Not only was Golden Trips organized, they went out of their way on every detail to make the experience incredible beyond words. We worked very closely with Joel and let me tell you he is an amazing manager...",
    avatar: "/assets/home-testimonials-img-ellipse8.png",
    images: [
      "/assets/home-testimonials-img-rectangle87.png",
      "/assets/home-testimonials-img-rectangle88.png",
    ],
  },
  {
    id: "matt",
    name: "Matt L",
    date: "January 2026",
    title: "Top-tier experience for a very good price",
    text: "Samson was very accommodating when planning our safari. We were not entirely sure what we wanted to do and he worked with us to plan the perfect safari. He gave us a couple of different quotes and explained the difference between them well. He was also able to book us a hot-air balloon ride (which I highly recommend) and accommodations before and after the safari.",
    avatar: "/assets/home-testimonials-img-ellipse9.png",
    images: [
      "/assets/home-testimonials-img-rectangle89.png",
      "/assets/home-testimonials-img-rectangle90.png",
    ],
  },
] as const;

export type Testimonial = (typeof testimonials)[number];
