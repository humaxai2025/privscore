import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { motion } from "framer-motion";

// Comprehensive privacy and security quiz (18 questions, full coverage)
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
  {
    question: "Do you use a password manager?",
    answers: [
      { text: "Yes", score: 10, tip: "Password managers help keep your credentials strong and unique." },
      { text: "No", score: 0, tip: "Try using one for stronger, easier password habits." },
      { text: "I write passwords down", score: 0, tip: "Paper can be lost or seen by others. Consider a password manager app." }
    ]
  },
  // Authentication
  {
    question: "Is 2-Factor Authentication enabled on your main accounts?",
    answers: [
      { text: "Yes", score: 10, tip: "2FA is a powerful shield against hacks." },
      { text: "No", score: 0, tip: "Enable 2FA (like SMS, app, or hardware key) on all critical accounts." },
      { text: "Don't Know", score: 0, tip: "Check your security settings and turn on 2FA where possible." }
    ]
  },
  // Device Security
  {
    question: "Are your devices protected with a PIN, password, or biometrics?",
    answers: [
      { text: "All devices", score: 10, tip: "A lock screen is your first line of defense." },
      { text: "Some devices", score: 5, tip: "Enable protection on all devices, including tablets." },
      { text: "None", score: 0, tip: "Anyone can access your data if a device is lost or stolen." }
    ]
  },
  {
    question: "Do you regularly update your devices and apps?",
    answers: [
      { text: "Always", score: 10, tip: "Updates patch security holes fast." },
      { text: "Sometimes", score: 5, tip: "Turn on auto-updates for less hassle." },
      { text: "Never", score: 0, tip: "Outdated devices and apps are easy targets." }
    ]
  },
  // Social & Online Habits
  {
    question: "Do you check your social media privacy settings at least once a year?",
    answers: [
      { text: "Yes", score: 10, tip: "Platforms change privacy defaults—review settings regularly." },
      { text: "No", score: 0, tip: "Out-of-date settings can expose your posts and info to everyone." }
    ]
  },
  {
    question: "Do you avoid sharing sensitive info over email, SMS, or chat apps?",
    answers: [
      { text: "Always", score: 10, tip: "Confidential info should never go in plain text messages." },
      { text: "Sometimes", score: 5, tip: "Always check if the platform is end-to-end encrypted." },
      { text: "Never", score: 0, tip: "It's risky—messages can be hacked, intercepted, or leaked." }
    ]
  },
  {
    question: "Are your browser privacy settings set to block tracking cookies?",
    answers: [
      { text: "Yes", score: 10, tip: "Trackers build profiles for ads and can invade your privacy." },
      { text: "No", score: 0, tip: "Adjust settings or try privacy browsers like Brave or Firefox." },
      { text: "Don't Know", score: 0, tip: "Check your browser settings for privacy and tracking controls." }
    ]
  },
  // Phishing & Scam Awareness
  {
    question: "Do you recognize and avoid phishing emails and scam messages?",
    answers: [
      { text: "Yes, always", score: 10, tip: "Excellent—phishing is the #1 cause of hacks." },
      { text: "Sometimes", score: 5, tip: "Check sender, links, and spelling before clicking anything." },
      { text: "No", score: 0, tip: "Learn to spot fake emails—never click unknown links." }
    ]
  },
  {
    question: "Do you check sender details before clicking links in emails?",
    answers: [
      { text: "Always", score: 10, tip: "Fake sender names are common—always check the address." },
      { text: "Sometimes", score: 5, tip: "Be vigilant—scams are getting more convincing." },
      { text: "Never", score: 0, tip: "Check before you click. Don't trust, always verify." }
    ]
  },
  // Account Management
  {
    question: "Do you regularly remove unused apps and online accounts?",
    answers: [
      { text: "Always", score: 10, tip: "Old accounts are security holes—clean up regularly." },
      { text: "Sometimes", score: 5, tip: "Set a reminder to review your apps/accounts quarterly." },
      { text: "Never", score: 0, tip: "Inactive accounts may be breached without you knowing." }
    ]
  },
  {
    question: "Have you checked your Google/Apple/Facebook account activity logs?",
    answers: [
      { text: "Yes", score: 10, tip: "You can spot and stop suspicious logins early." },
      { text: "No", score: 0, tip: "Check activity logs for unauthorized access now and then." }
    ]
  },
  {
    question: "Do you use public Wi-Fi without a VPN?",
    answers: [
      { text: "Never", score: 10, tip: "Public Wi-Fi is risky—use a VPN if you must connect." },
      { text: "Sometimes", score: 5, tip: "Be cautious—avoid sensitive transactions on public networks." },
      { text: "Often", score: 0, tip: "Your data is exposed on open Wi-Fi." }
    ]
  },
  // App Permissions & Cloud
  {
    question: "Do you review app permissions (camera, microphone, location) before granting access?",
    answers: [
      { text: "Always", score: 10, tip: "Minimizing permissions protects your privacy." },
      { text: "Sometimes", score: 5, tip: "Apps often request more than they need. Stay vigilant." },
      { text: "Never", score: 0, tip: "Review and revoke unnecessary permissions regularly." }
    ]
  },
  {
    question: "Are your cloud backups (Google Drive, iCloud, etc.) protected with strong authentication?",
    answers: [
      { text: "Yes", score: 10, tip: "Cloud backups should be locked down just like your email." },
      { text: "No", score: 0, tip: "Enable 2FA on cloud accounts—these hold all your files and photos." },
      { text: "Don't Know", score: 0, tip: "Check your cloud account security settings." }
    ]
  },
  {
    question: "Do you sign up for apps/services using 'Sign in with Google/Facebook'?",
    answers: [
      { text: "Rarely or never", score: 10, tip: "Creating separate logins gives you more control." },
      { text: "Sometimes", score: 5, tip: "Review what permissions are granted when you use social logins." },
      { text: "Always", score: 0, tip: "Social logins share data and link your accounts across platforms." }
    ]
  },
  // Breaches & Social Engineering
  {
    question: "Have you checked if your email or passwords have been exposed in a data breach?",
    answers: [
      { text: "Yes", score: 10, tip: "Use sites like haveibeenpwned.com to check for breaches." },
      { text: "No", score: 0, tip: "Check if your credentials have leaked, and change them if so." }
    ]
  },
  {
    question: "Would you ever share a one-time code (OTP) with anyone, even if they sound official?",
    answers: [
      { text: "Never", score: 10, tip: "Never share OTPs—no real company or bank will ask." },
      { text: "Not sure", score: 0, tip: "Even customer support should never ask for OTPs." },
      { text: "Yes", score: 0, tip: "Scammers often pose as officials to steal your OTPs." }
    ]
  },
  // Family, Kids, IoT/Smart Devices
  {
    question: "Do you help your family or kids set up privacy on their devices?",
    answers: [
      { text: "Yes", score: 10, tip: "Kids and elders need extra privacy support." },
      { text: "Sometimes", score: 5, tip: "Check in regularly to help with updates and privacy settings." },
      { text: "No", score: 0, tip: "Help your family stay secure—privacy is for everyone." }
    ]
  },
  {
    question: "Do you update and secure your smart home devices (CCTV, Alexa, etc.)?",
    answers: [
      { text: "Always", score: 10, tip: "IoT devices can be hacked if left unsecured." },
      { text: "Sometimes", score: 5, tip: "Set reminders to check your smart device security." },
      { text: "Never", score: 0, tip: "Update and change default passwords on all smart devices." }
    ]
  },
];

// Scoring
function getScoreLevel(score: number) {
  if (score >= quiz.length * 9) return { label: "Privacy Pro", color: "green", icon: <CheckCircle className="w-10 h-10 text-green-600" /> };
  if (score >= quiz.length * 7) return { label: "On The Right Track", color: "yellow", icon: <Info className="w-10 h-10 text-yellow-500" /> };
  return { label: "Needs Attention", color: "red", icon: <AlertCircle className="w-10 h-10 text-red-600" /> };
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
          <h2 className={`text-3xl font-bold mb-2 text-${level.color}-600`}>{level.label}</h2>
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
