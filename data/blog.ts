export type BlogSection = { heading?: string; paragraphs: string[] };
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readingMinutes: number;
  cover: string;
  coverAlt: string;
  body: BlogSection[];
};

export const posts: BlogPost[] = [
  {
    slug: "souvlaki-vs-gyro",
    title: "Souvlaki vs Gyro: What's the Difference?",
    excerpt:
      "Two Greek classics, often confused. Here's how souvlaki and gyro actually differ — from the cut of meat to the way it's cooked.",
    category: "Greek food 101",
    date: "2026-07-14",
    readingMinutes: 3,
    cover: "/images/features/gyro-pita.png",
    coverAlt: "Greek gyro pita with tzatziki, tomato, red onion and seasoned fries",
    body: [
      {
        paragraphs: [
          "If you've stood at our counter deciding between a souvlaki and a gyro, you're not alone. They look similar on the plate, they're both wrapped in warm pita, and both come with tzatziki. But they're made in completely different ways.",
        ],
      },
      {
        heading: "Souvlaki: small skewers, open flame",
        paragraphs: [
          "Souvlaki means \"little skewer.\" It's chunks of marinated meat — usually chicken or pork — threaded onto a stick and grilled over an open flame. Each piece gets a little char on the outside while staying juicy inside. Our marinade is lemon, olive oil, garlic and oregano, left to work overnight.",
        ],
      },
      {
        heading: "Gyro: stacked, slow-turned, shaved",
        paragraphs: [
          "Gyro meat is seasoned, stacked in a cone on a vertical rotisserie, and cooked slowly as it turns. We shave thin slices straight off the spit as orders come in, so the edges are crisp and the centre stays tender. It's the same method you'll see on the street in Athens.",
        ],
      },
      {
        heading: "Which should you order?",
        paragraphs: [
          "Want distinct pieces of grilled meat with a smoky edge? Go souvlaki. Want that layered, slow-roasted flavour with crisp shaved edges? Go gyro. Both come as a pita wrap or on a plate with Greek salad and your choice of sides.",
          "Still not sure? Order one of each and share.",
        ],
      },
    ],
  },
  {
    slug: "what-makes-a-great-gyro",
    title: "What Makes a Great Gyro",
    excerpt:
      "A good gyro is three things done right: the meat, the pita, and the tzatziki. Here's what we look for in each.",
    category: "From the kitchen",
    date: "2026-08-02",
    readingMinutes: 3,
    cover: "/images/carving-gyro.png",
    coverAlt: "Greek Mansion cook carving chicken gyro from the vertical spit",
    body: [
      {
        paragraphs: [
          "A gyro has only a handful of parts, which means there's nowhere to hide. Get any one of them wrong and you feel it in the first bite.",
        ],
      },
      {
        heading: "The meat",
        paragraphs: [
          "It starts with seasoning and stacking — layers built into a cone so the fat renders down through the whole stack as it turns. The rotisserie does the slow work; we keep the flame steady and shave to order. Meat left cut and warming under a lamp is the fastest way to ruin a gyro.",
        ],
      },
      {
        heading: "The pita",
        paragraphs: [
          "Greek pita is soft and pillowy, not the dry pocket bread people expect. We warm it on the flat top so it picks up a little colour and stays foldable. A cold, stiff pita cracks the moment you wrap it.",
        ],
      },
      {
        heading: "The tzatziki",
        paragraphs: [
          "Thick strained yogurt, grated cucumber squeezed dry, garlic, lemon, olive oil, a little dill. It should cling to the meat, not run off the wrap. We make it in-house every day.",
        ],
      },
      {
        paragraphs: [
          "Put those three together, add tomato and onion, wrap it tight, and you have the thing people drive across Scarborough for.",
        ],
      },
    ],
  },
  {
    slug: "planning-greek-catering",
    title: "Planning Greek Catering for a Crowd",
    excerpt:
      "Feeding 20 people or 200, the same rules apply. A short guide to building a Greek catering menu that holds up at scale.",
    category: "Catering",
    date: "2026-08-21",
    readingMinutes: 4,
    cover: "/images/catering-boxes.png",
    coverAlt: "Stacked Greek Mansion Family Catering boxes with foil trays and pita at the counter",
    body: [
      {
        paragraphs: [
          "Catering isn't just restaurant food in a bigger tray. Dishes that shine à la carte can fall flat after an hour in a chafing dish. Here's how we think about building a spread for a group.",
        ],
      },
      {
        heading: "Build around things that hold",
        paragraphs: [
          "Grilled and slow-cooked meats — chicken and pork souvlaki, gyro, lamb — travel well and keep their heat. Rice, roasted potatoes and Greek salad round out a plate without needing last-minute attention. Sauces and dressings go on the side so nothing turns soggy.",
        ],
      },
      {
        heading: "Portion for reality, not the spreadsheet",
        paragraphs: [
          "People eat more at a buffet than at a plated dinner, and Greek food invites seconds. We plan generous — that's the whole point of a Greek table — and pack a little extra.",
        ],
      },
      {
        heading: "Keep the setup simple",
        paragraphs: [
          "Everything arrives labelled and ready to serve: trays of mains, containers of sides, pita, tzatziki and Greek salad on the side. Corporate lunch, birthday, shower or memorial — the format is the same, only the quantity changes.",
        ],
      },
      {
        paragraphs: [
          "Tell us the headcount and the date and we'll send back a menu and a quote the same day.",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
