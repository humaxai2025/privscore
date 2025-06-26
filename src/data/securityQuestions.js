export const securityQuestions = [
  {
    category: "Account Security",
    question: "Do you use two-step verification (where you receive a code on your phone) for important accounts like email and banking?",
    answers: [
      { text: "Yes, for all my important accounts", score: 10, tip: "This extra verification step stops 99% of account hacks, even if someone knows your password." },
      { text: "For some accounts", score: 5, tip: "Start with your email, banking, and social media accounts—they're the most important to protect." },
      { text: "No, I don't use this", score: 0, tip: "This simple step can protect you from most hacking attempts. Look for 'two-factor' or '2FA' in security settings." }
    ]
  },
  // ... rest of the 18 questions (copy from the main component)
];