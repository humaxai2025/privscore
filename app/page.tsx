import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const quiz = [
  // Password Hygiene
  {
    question: "Do you use unique passwords for each account?",
    answers: [
      { text: "Always", score: 10, tip: "Unique passwords reduce the risk of all your accounts being compromised at once." },
      { text: "Sometimes", score: 5, tip: "Using a password manager can help you keep passwords unique." },
      { text: "Never", score: 0, tip: "Reusing passwords means a single breach can compromise everything." }
    ]
  },
  // ... (keep all your existing quiz questions)
];

function getScoreLevel(score: number) {
  if (score >= quiz.length * 9) return { label: "Privacy Pro", color: "text-green-600", icon: <CheckCircle className="w-10 h-10 text-green-600" /> };
  if (score >= quiz.length * 7) return { label: "On The Right Track", color: "text-yellow-500", icon: <Info className="w-10 h-10 text-yellow-500" /> };
  return { label: "Needs Attention", color: "text-red-600", icon: <AlertCircle className="w-10 h-10 text-red-600" /> };
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const totalScore = answers.reduce((a, b) => a + b, 0);
  const progress = (step / quiz.length) * 100;

  if (step >= quiz.length) {
    const level = getScoreLevel(totalScore);
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 px-4">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full flex flex-col items-center"
        >
          {level.icon}
          <h2 className={`text-3xl font-bold mb-2 ${level.color}`}>{level.label}</h2>
          <div className="text-6xl font-extrabold my-4">{totalScore} <span className="text-2xl">/ {quiz.length * 10}</span></div>
          <div className="mb-4">Your digital privacy self-assessment score</div>
          <ul className="w-full space-y-2 mb-6">
            {answers.map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-medium">{quiz[i].question}</span>
                <span className="text-gray-500 ml-auto">{quiz[i].answers.find(opt => opt.score === a)?.tip}</span>
              </li>
            ))}
          </ul>
          <Button onClick={() => { setStep(0); setAnswers([]); }} className="w-full mt-2">Retake Quiz</Button>
        </motion.div>
        <div className="text-xs text-gray-400 mt-6">Built with ❤️ by HumanXAI</div>
      </main>
    );
  }

  const currentQ = quiz[step];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 px-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full"
      >
        <Progress value={progress} className="mb-6" />
        <div className="text-sm text-gray-500 mb-2">Question {step + 1} of {quiz.length}</div>
        <h1 className="text-xl font-semibold mb-4">{currentQ.question}</h1>
        <div className="space-y-3">
          {currentQ.answers.map((ans, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardContent>
                <Button
                  className="w-full text-left py-6"
                  variant="outline"
                  onClick={() => {
                    setAnswers([...answers, ans.score]);
                    setStep(step + 1);
                  }}
                >
                  <span className="font-semibold">{ans.text}</span>
                </Button>
                <div className="text-xs mt-2 text-gray-500">{ans.tip}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 text-sm text-blue-500">Your privacy is in your hands. Simple steps can make a big difference!</div>
      </motion.div>
      <div className="text-xs text-gray-400 mt-6">Built with ❤️ by HumanXAI</div>
    </main>
  );
}