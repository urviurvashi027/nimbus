const testData = {
  title: "Trauma Test: Healing the Hidden Wounds",
  description:
    "Welcome to our self-screening questionnaire for childhood trauma...",
  questions: [
    {
      id: "1",
      question: "What do you see?",
      image: require("../../assets/images/lonely.png"), // Replace with actual image
      options: ["A. Butterfly", "B. Face"],
    },
    {
      id: "2",
      question:
        "In your eyes, how would you describe your parents' relationship?",
      options: [
        "A. Happily married",
        "B. Unhappily married",
        "C. Divorced",
        "D. Single parent",
        "E. No parent",
      ],
    },
    {
      id: "3",
      question: "Have you experienced any of the following?",
      options: [
        "A. Physical abuse",
        "B. Emotional/Verbal abuse",
        "C. Economic hardship",
        "D. None of the above",
      ],
    },
  ],
  results: {
    title: "Resilient Wanderer",
    description:
      "It appears from your responses that you have a unique set of strengths...",
    image: require("../../assets/images/lonely.png"), // Replace with actual image
    scores: {
      "Household dysfunction": "9%",
      Neglect: "0%",
      Abuse: "9%",
    },
  },
};

export default testData;
