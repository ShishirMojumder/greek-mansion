// Real Google reviews from the Greek Mansion business profile, quoted verbatim
// (guest spelling and punctuation intact). Google's own UI chrome — photo
// captions, parking and group-size chips — is not part of a review and is left out.

export type Review = {
  name: string;
  initials: string;
  /** Reviewer standing on Google, e.g. "Local Guide · 27 reviews · 66 photos". */
  credit: string;
  when: string;
  /** The visit chips Google shows: order type, meal, price band. */
  context: string[];
  quote: string;
  ratings?: { food: number; service: number; atmosphere: number };
  /** Reactions the review has collected on Google. */
  reactions?: string;
};

export const reviews: Review[] = [
  {
    name: "Laila R",
    initials: "LR",
    credit: "Local Guide · 3 reviews · 5 photos",
    when: "6 months ago",
    context: ["Delivery", "Lunch", "$20–30"],
    quote:
      "Ive been ordering from Greek Mansion since it first opened in my neighborhood. I am so happy they did. Ive tried most of the menu since then and love everything. I usually order their chicken plate with the potatoes and rice for lunch. Best potatoes ever and it comes with their tasty greek salad! Their wraps (gyro!), sandwiches (try the philly cheese steak!!) and appetizers (greek fries!) are all great too. My favourite dessert is the walnut fudge brownie! Its authentic, fresh, Greek cuisine and it has been consistently delicious. The meat quality is always the best. Their customer service is also excellent. Generous portions and affordable prices. I dont post much on Google reviews but they deserve this review! The manager Jason is always kind and helpful.",
    ratings: { food: 5, service: 5, atmosphere: 5 },
    reactions: "❤️ 2",
  },
  {
    name: "Raph S",
    initials: "RS",
    credit: "Local Guide · 15 reviews · 10 photos",
    when: "5 months ago",
    context: ["Takeaway", "Dinner", "$10–20"],
    quote:
      "We recently put a catering order with Jason who was very friendly and accommodating from the start! He took care of our catering order for 28 people and helped us through the entire process. He even gave us a great deal on catering compared to other greek restaurants. On day of pickup he provided us a large box to put all the food in and wrapped it up nicely to prevent any spills. He even told us ways to reheat the food if it gets cold. Food was amazing and the party loved everything. We had plenty of leftovers too. Will definitely order again from here. Highly recommend 👍",
    ratings: { food: 5, service: 5, atmosphere: 5 },
  },
  {
    name: "K. Shah",
    initials: "KS",
    credit: "Local Guide · 27 reviews · 66 photos",
    when: "9 months ago",
    context: ["Takeaway", "Dinner", "$10–20"],
    quote:
      "Service was quick and the food was delicious. The serving sizes are very generous.\n\nIf you like spicy food, make sure to try the spicy tzatziki 😋\n\nThey also have a very wide variety of canned pop. There were lots that I've never seen or tried before, can't wait to try them all.\n\nIf you plan on eating in, seating is limited but there are some tables available.",
    ratings: { food: 5, service: 5, atmosphere: 4 },
  },
  {
    name: "Farheen Shamji",
    initials: "FS",
    credit: "Local Guide · 38 reviews · 10 photos",
    when: "2 months ago",
    context: ["Takeaway"],
    quote:
      "By far my favourite Greek takeout in the city. Consistently delicious, great portions and great price. Me and my family get food from here at least once a month and we've ordered their food for catering multiple times. Fresh food, good communication and great service.",
    ratings: { food: 5, service: 5, atmosphere: 5 },
  },
  {
    name: "Roshan Guna",
    initials: "RG",
    credit: "8 reviews",
    when: "4 months ago",
    context: ["Delivery", "Lunch"],
    quote:
      "We placed a catering order for 40 people for my daughter's birthday, and the food was great. The portions were generous and reasonably priced. The team was accommodating and patient while walking us through menu options and possible substitutions. Everyone loved the food, highly recommend!",
  },
  {
    name: "Hermione Shou",
    initials: "HS",
    credit: "Local Guide · 133 reviews · 338 photos",
    when: "3 months ago",
    context: [],
    quote:
      "We've ordered party platters from Greek Mansion twice and will continue to come back, time and time again. Their food was nicely cooked neatly packaged. Their salad was beautifully presented, with the dressing packaged separately. Everything tasted fresh and delicious!",
    ratings: { food: 5, service: 5, atmosphere: 5 },
    reactions: "❤️ 1",
  },
  {
    name: "Ari Kanapathypillai",
    initials: "AK",
    credit: "Local Guide · 153 reviews · 499 photos",
    when: "3 months ago",
    context: ["Takeaway", "Lunch", "$20–30"],
    quote:
      "Don't let the size fool you—this little gem serves some of the best Greek food in Scarborough. The food is always fresh, flavorful, and made with care. Portions are generous, prices are reasonable, and the service is friendly and welcoming. Whether you're grabbing takeout or enjoying a meal at one of the few tables inside, you can count on a delicious and satisfying experience every time. Highly recommended!",
    ratings: { food: 5, service: 5, atmosphere: 5 },
  },
  {
    name: "Pria K",
    initials: "PK",
    credit: "Local Guide · 134 reviews · 420 photos",
    when: "a year ago",
    context: ["Takeaway", "Dinner", "$10–20"],
    quote:
      "We saw a new restaurant open up and decided to try it out 15min before closing 😅\nHe said the kitchen is closed when we entered the store! Then he said it's ok let me know what you want and we chose the Large chicken plate. It comes with rice chicken and potatoes and a big salad portion and pita bread.\nNice people! They don't rush your food. He made sure the chicken is cooked well and the dressing for the salad is good. The potatoes are juicy and rice is well cooked, the chicken is flavoured well and not dry. Worth it for the price.\nHighly recommend you try it out they have other options available as well. A little bit of a fusion !",
    ratings: { food: 5, service: 5, atmosphere: 5 },
  },
  {
    name: "Christine Lawrence",
    initials: "CL",
    credit: "Local Guide · 34 reviews · 4 photos",
    when: "Edited 5 months ago",
    context: [],
    quote:
      "My husband and I ate here the other day for lunch. The prices are very reasonable, the taste of the food is awesome, made fresh, chicken taken off the stick 👍, perfect portion, clean establishment and enjoyable light music in the background, the service was polite and she lets you know how long it will take to make. There are a few tables inside, we sat and ate. If we are in the area again we definitely would come back. My husband had a Greek pita and I had the lunch plate.",
    ratings: { food: 5, service: 5, atmosphere: 5 },
    reactions: "❤️ 2",
  },
  {
    name: "ISS87",
    initials: "IS",
    credit: "11 reviews",
    when: "4 months ago",
    context: ["Takeaway", "Dinner"],
    quote:
      "We did a catering order for 10 (chicken souvlaki).\nThe customer service was friendly, all the food tasted fresh and flavorful. Everyone really enjoyed their dinner. The sauces went well with the meal, especially the Spicy Tzatziki",
    ratings: { food: 5, service: 5, atmosphere: 5 },
    reactions: "🔥 1",
  },
  {
    name: "Kunal Desai",
    initials: "KD",
    credit: "Local Guide · 74 reviews",
    when: "a month ago",
    context: ["Takeaway", "Lunch", "$10–20"],
    quote:
      "Authentic Greek flavours. Priced well, fresh, and healthy food. Clean restaurant and friendly service. They are great for catering too!",
    ratings: { food: 5, service: 5, atmosphere: 5 },
  },
];
