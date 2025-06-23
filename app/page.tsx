"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Info, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";

const quiz = [
  // Password Hygiene
  {
    question: "Do you use unique passwords for each account?",
    answers: [
      { 
        text: "Always", 
        score: 10, 
        tip: "Unique passwords reduce the risk of all your accounts being compromised at once." 
      },
      // ... (keep all your existing quiz questions)
    ]
  },
  // ... (rest of your quiz questions)
];

function getScoreLevel(score: number) {
  if (score >= quiz.length * 9) return { 
    label: "Privacy Pro", 
    color: "text-green-600 dark:text-green-400",
    icon: <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" /> 
  };
  if (score >= quiz.length * 7) return { 
    label: "On The Right Track", 
    color: "text-yellow-500 dark:text-yellow-400",
    icon: <Info className="w-10 h-10 text-yellow-500 dark:text-yellow-400" /> 
  };
  return { 
    label: "Needs Attention", 
    color: "text-red-600 dark:text-red-400",
    icon: <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" /> 
  };
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const totalScore = answers.reduce((a, b) => a + b, 0);
  const progress = (step / quiz.length) * 100;

  if (step >= quiz.length) {
    const level = getScoreLevel(totalScore);
    
    if (level.label === "Privacy Pro") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 max-w-lg w-full flex flex-col items-center border border-gray-200 dark:border-gray-700"
        >
          {level.icon}
          <h2 className={`text-4xl font-bold mb-4 ${level.color} flex items-center gap-2 mt-4`}>
            {level.label}
            {level.label === "Privacy Pro" && <Sparkles className="w-8 h-8 text-yellow-500" />}
          </h2>
          
          <div className="relative my-6">
            <div className="absolute -inset-4 bg-blue-100 dark:bg-blue-900 rounded-full blur opacity-75"></div>
            <div className="relative text-6xl font-extrabold bg-white dark:bg-gray-800 p-8 rounded-full">
              {totalScore} <span className="text-2xl">/ {quiz.length * 10}</span>
            </div>
          </div>

          <div className="mb-6 text-gray-600 dark:text-gray-300 text-center">
            Your digital privacy self-assessment score
          </div>

          <ul className="w-full space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
            {answers.map((a, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <span className="font-medium text-gray-900 dark:text-white flex-shrink-0 min-w-[30px]">{i + 1}.</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{quiz[i].question}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {quiz[i].answers.find(opt => opt.score === a)?.tip}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <Button 
            onClick={() => { setStep(0); setAnswers([]); }} 
            className="w-full mt-2 py-6 text-lg font-semibold bg-primary hover:bg-primary-dark transition-colors"
          >
            Retake Quiz
          </Button>
        </motion.div>
        
        <footer className="text-xs text-gray-400 mt-8 pb-4 text-center">
          <p>Built with ❤️ by HumanXAI</p>
          <p className="mt-1">Helping you stay safe since 2023</p>
        </footer>
      </main>
    );
  }

  const currentQ = quiz[step];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 max-w-lg w-full border border-gray-200 dark:border-gray-700"
      >
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>Question {step + 1} of {quiz.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {currentQ.question}
        </h1>

        <div className="space-y-4">
          {currentQ.answers.map((ans, idx) => (
            <Card 
              key={idx} 
              className="hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 hover:border-primary"
            >
              <CardContent className="p-0">
                <Button
                  className="w-full text-left p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  variant="ghost"
                  onClick={() => {
                    setAnswers([...answers, ans.score]);
                    setStep(step + 1);
                  }}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-lg text-gray-900 dark:text-white">
                      {ans.text}
                    </span>
                    <span className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                      {ans.tip}
                    </span>
                  </div>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-sm text-blue-500 dark:text-blue-400 text-center">
          Your privacy is in your hands. Simple steps can make a big difference!
        </p>
      </motion.div>
      
      <footer className="text-xs text-gray-400 mt-8 pb-4 text-center">
        <p>Built with ❤️ by HumanXAI</p>
      </footer>
    </main>
  );
}