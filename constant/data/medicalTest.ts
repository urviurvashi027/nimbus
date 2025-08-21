import { ImageKey } from "@/utils/getImage";

export type medicalTestData = {
  id: string;
  title: string;
  color?: string;
  description: string;
  image?: ImageKey;
  progressBarBg?: string;
  content: any;
  imageUrl?: any;
  questions: Array<{
    id: string;
    question: string;
    options: Array<string>;
    category: string;
    image?: string;
  }>;
};

export const imageMap: Record<string, any> = {
  anxietyRelease: require("../../assets/images/mentalTest/eqTest.png"),
  // traumaRelease: require("../../assets/images/meditation/traumaRelease.png"),
  // add other images here
};

// export const medicalTestDetails = { image: "anxietyRelease" }

const testData: medicalTestData[] = [
  {
    id: "1",
    title: "Childhood Trauma Assement",
    color: "#cc66ff",
    image: "childhoodTrauma",
    progressBarBg: "#b31aff",
    description: `Welcome to our self-screening questionnaire for childhood trauma.
Throughout our childhood, we have all felt the anguish of rejection, neglect, and even bullying from someone else. 

Yet, when does the pain we experience start to transition into lasting
trauma?`,
    content: [
      {
        title: "Know Yourself",
        body: `Understanding your story is the foundation of healing.

Through this test, you will:

Identify the emotional patterns that govern your behaviors.
Recognize common triggers rooted in your past.
Discover unconscious beliefs you carry from childhood.
This is your first step toward awareness and transformation.`,
      },
      {
        title: "Healing and Recovery",
        body: `Healing is a process, not an event.

Your results will offer:

Gentle reflections on your emotional wounds.
Practical healing strategies to address unresolved emotions.
Techniques like grounding, self-compassion, and mindfulness.
Support to reconnect with your inner child and build emotional resilience.`,
      },
      {
        title: "Recommendations",
        body: `Based on your results, you will receive:

Personalized recommendations for healing practices.

Suggested tools like journaling, breathing exercises, and affirmations.

Guidance to strengthen your emotional well-being.

Steps to help you create a healthier and more secure emotional life.`,
      },
      {
        title: "Solutions",
        body: `You will also be provided with:

Solutions to gently navigate emotional triggers.

Steps to improve your relationship with yourself and others.

Ways to enhance self-awareness, acceptance, and emotional safety.

A roadmap to gradually overcome the lasting impact of childhood trauma.`,
      },
    ],
    questions: [
      {
        id: "1",
        category: "emotional abuse",
        question:
          "Did you frequently feel belittled or criticized by your caregivers during childhood?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "2",
        category: "physical abuse",
        question:
          "Were you ever physically hurt or disciplined harshly as a child?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "3",
        category: "neglect",
        question:
          "Did you often feel emotionally neglected or ignored during your childhood?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "4",
        category: "sexual abuse",
        question:
          "Were you ever subjected to inappropriate physical contact or sexual abuse as a child?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "5",
        category: "emotional abuse",
        question:
          "Did someone in your childhood use words or actions to make you feel worthless or unloved?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "6",
        category: "neglect",
        question:
          "Did you often feel that your basic needs—emotional or physical—were not met during childhood?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "7",
        category: "physical abuse",
        question:
          "Were there frequent instances of physical punishment that left you in pain?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "8",
        category: "emotional abuse",
        question:
          "Did you experience excessive control or manipulation from a caregiver?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "9",
        category: "sexual abuse",
        question:
          "Did you ever feel unsafe around adults or caregivers without knowing why?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
      {
        id: "10",
        category: "neglect",
        question:
          "Did you often feel isolated or unloved during your early years?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      },
    ],
  },
  {
    id: "2",
    title: "Quick ADHD Test",
    color: "#F16767",
    image: "anxietyRelease",
    imageUrl: require("../../assets/images/mentalTest/eqTest.png"),
    progressBarBg: "#b31aff",
    description: `Welcome to our self-screening questionnaire for Attention-Deficit/Hyperactivity Disorder (ADHD).
ADHD can affect your ability to focus, control impulses, and manage time effectively.
This test is designed to help you identify potential symptoms of ADHD, providing insight into areas of your daily life that may be impacted.`,
    content: [
      {
        title: "Know Your Focus",
        body: `Understanding your attention patterns is key to managing ADHD.
Through this test, you will:
- Recognize moments when your focus shifts unexpectedly.
- Identify behaviors that might be impacting your productivity.
- Reflect on how impulsivity and restlessness affect your daily routine.
This is your first step toward greater self-awareness and improved concentration.`,
      },
      {
        title: "Understanding Your Challenges",
        body: `ADHD manifests in different ways, including inattentiveness, hyperactivity, and impulsivity.
Your responses will help you:
- Identify specific triggers that disrupt your focus.
- Understand the challenges you face in structured environments.
- Consider how ADHD symptoms might influence your relationships and work performance.`,
      },
      {
        title: "Recommendations",
        body: `Based on your responses, you will receive:
- Personalized suggestions to improve focus and manage impulsivity.
- Tools and strategies, such as time management techniques, mindfulness, and organizational skills.
- Guidance to help determine if a professional evaluation is needed.
These recommendations are designed to support your journey toward better attention and self-management.`,
      },
      {
        title: "Solutions",
        body: `You will also be provided with:
- Practical steps to build better focus habits.
- Strategies to reduce impulsivity and manage hyperactivity.
- A roadmap to enhance productivity and overall well-being.
This plan is intended to empower you in taking charge of your attention and daily routines.`,
      },
    ],
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
  image: require("../../assets/images/mentalTest/eqTest.png"), // Replace with actual image
  //  scores: nedds to be added
};

export const medTests = [
  {
    id: "1",
    title: "Childhood Trauma Test",
    image: require("../../assets/images/mentalTest/childhoodTrauma.png"), // Replace with actual image
  },
  {
    id: "2",
    title: "Quick ADHD Test",
    image: require("../../assets/images/mentalTest/adhdTest.png"),
  },
  {
    id: "3",
    title: "3 Minutes Depression Test",
    image: require("../../assets/images/mentalTest/depressionTest.png"),
  },
  {
    id: "4",
    title: "Toxic Personality Test",
    image: require("../../assets/images/mentalTest/toxicPersonality.png"),
  },
  {
    id: "5",
    title: "Emotional Quotient",
    image: require("../../assets/images/mentalTest/eqTest.png"),
  },
  {
    id: "6",
    title: "Inner Self",
    image: require("../../assets/images/mentalTest/innerSelf.png"),
  },
  {
    id: "7",
    title: "Self Toxic",
    image: require("../../assets/images/mentalTest/selfLove.png"),
  },
];

export default testData;
