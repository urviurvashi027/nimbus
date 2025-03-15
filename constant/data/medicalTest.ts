export type medicalTestData = {
  id: string;
  title: string;
  description: string;
  image?: string;
  questions: Array<{
    id: string;
    question: string;
    options: Array<string>;
    category: string;
    image?: string;
  }>;
};

const testData: medicalTestData[] = [
  {
    id: "1",
    title: "Childhood Trauma Test",
    description:
      "Welcome to our self-screening questionnaire for childhood trauma...",
    questions: [
      {
        id: "1",
        category: "inattention",
        question: "I make careless mistakes in my work.",
        // image: require("../../assets/images/lonely.png"), // Replace with actual image
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "2",
        question: "I have trouble keeping my attention on tasks.",
        category: "inattention",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "3",
        question: "I often don't seem to listen when spoken to.",
        category: "inattention",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "4",
        question: "I fail to finish tasks I start.",
        category: "inattention",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "5",
        question: "I find it hard to organize my activities.",
        category: "inattention",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "6",
        question: "I avoid tasks that require prolonged mental effort.",
        category: "inattention",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "7",
        question: "I frequently lose items needed for tasks.",
        category: "inattention",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "8",
        question: "I get easily distracted by things around me.",
        category: "inattention",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "9",
        question: "I am forgetful in daily activities.",
        category: "inattention",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "10",
        question: "I often don't seem to listen when spoken to.",
        category: "inattention",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "11",
        question: "Fidgets with or taps hands or feet or squirms in seat.",
        category: "hyperactivity",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "12",
        category: "hyperactivity",
        question:
          "Leaves seat in situations when remaining seated is expected.",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "13",
        category: "hyperactivity",
        question: "Runs about or climbs in inappropriate situations.",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "14",
        category: "hyperactivity",
        question: "Unable to play or engage in leisure activities quietly.",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },

      {
        id: "15",
        category: "hyperactivity",
        question: "On the go or acts as if driven by a motor.",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "16",
        category: "hyperactivity",
        question: "Talks excessively.",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "17",
        category: "hyperactivity",
        question: "Blurts out answers before questions have been completed.",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "18",
        category: "hyperactivity",
        question: "Has difficulty waiting their turn.",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "19",
        category: "hyperactivity",
        question:
          "Interrupts or intrudes on others (e.g., butts into conversations or games).",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
    ],
  },
];

const result = {
  title: "Resilient Wanderer",
  description:
    "It appears from your responses that you have a unique set of strengths...",
  image: require("../../assets/images/lonely.png"), // Replace with actual image
  //  scores: nedds to be added
};

export default testData;
