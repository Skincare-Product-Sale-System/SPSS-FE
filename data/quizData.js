export const quizTypes = [
  {
    id: 1,
    title: "Skin Type Quiz",
    description:
      "Find out your skin type and get personalized product recommendations",
    image: "/images/quiz/skin-type.jpg",
    questionCount: 5,
    questions: [
      {
        text: "How does your skin feel after cleansing?",
        options: [
          "Tight and dry",
          "Normal and comfortable",
          "Oily all over",
          "Combination of oily and dry",
        ],
      },
      {
        text: "How often do you experience breakouts?",
        options: [
          "Rarely or never",
          "Occasionally",
          "Frequently",
          "Only in specific areas",
        ],
      },
      {
        text: "How visible are your pores?",
        options: [
          "Barely visible",
          "Slightly visible",
          "Very visible in T-zone",
          "Very visible all over",
        ],
      },
      {
        text: "How does your skin look by mid-day?",
        options: [
          "Feels dry and tight",
          "Looks the same as morning",
          "Becomes shiny and oily",
          "Only T-zone becomes oily",
        ],
      },
      {
        text: "How does your skin react to new products?",
        options: [
          "Often becomes irritated",
          "Rarely has reactions",
          "Sometimes breaks out",
          "Depends on the product",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Hair Care Quiz",
    description:
      "Discover your hair type and get customized hair care recommendations",
    image: "/images/quiz/hair-care.jpg",
    questionCount: 4,
    questions: [
      {
        text: "What is your hair texture?",
        options: ["Straight", "Wavy", "Curly", "Coily"],
      },
      {
        text: "How often do you wash your hair?",
        options: ["Daily", "Every other day", "Twice a week", "Once a week"],
      },
      {
        text: "What is your main hair concern?",
        options: ["Dryness", "Oiliness", "Damage", "Hair loss"],
      },
      {
        text: "Have you chemically treated your hair?",
        options: [
          "Never",
          "Colored only",
          "Permed or relaxed",
          "Both colored and treated",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Fragrance Finder",
    description: "Find your perfect signature scent based on your preferences",
    image: "/images/quiz/fragrance.jpg",
    questionCount: 3,
    questions: [
      {
        text: "What type of scents do you prefer?",
        options: [
          "Floral and sweet",
          "Fresh and clean",
          "Woody and earthy",
          "Spicy and warm",
        ],
      },
      {
        text: "When do you typically wear fragrance?",
        options: [
          "Daily wear",
          "Special occasions",
          "Evening events",
          "Seasonal use",
        ],
      },
      {
        text: "How long do you want your fragrance to last?",
        options: [
          "Just a few hours",
          "Half day",
          "Full day",
          "As long as possible",
        ],
      },
    ],
  },
];

export const quizImage = {
  skinType1: "https://cdn.hswstatic.com/gif/combination-skin.jpg",
  skinType2: "https://www.dermalogica.co.uk/cdn/shop/articles/Sensitive-skin-blog-image.jpg",
  fragrance: "/images/quiz/fragrance.jpg",
};
