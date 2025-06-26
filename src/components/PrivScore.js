"use client";

import React, { useState, useEffect } from "react";
import { Shield, Lock, Award, CheckCircle, AlertCircle, Info, RefreshCw, TrendingUp, Copy, Download, ExternalLink } from "lucide-react";

// Complete set of questions for the PrivScore assessment
const securityQuestions = [
  // Account Security
  {
    category: "Account Security",
    question: "Do you use two-step verification (where you receive a code on your phone) for important accounts like email and banking?",
    answers: [
      { text: "Yes, for all my important accounts", score: 10, tip: "This extra verification step stops 99% of account hacks, even if someone knows your password." },
      { text: "For some accounts", score: 5, tip: "Start with your email, banking, and social media accounts—they're the most important to protect." },
      { text: "No, I don't use this", score: 0, tip: "This simple step can protect you from most hacking attempts. Look for 'two-factor' or '2FA' in security settings." }
    ]
  },
  {
    category: "Account Security",
    question: "How do you keep track of your passwords?",
    answers: [
      { text: "I use a password manager app", score: 10, tip: "Password managers create and remember strong, unique passwords for all your accounts." },
      { text: "I save them in my browser", score: 7, tip: "Browser password storage is convenient but less secure than dedicated password managers." },
      { text: "I use a pattern I change for each site", score: 3, tip: "Password patterns can be figured out if one of your accounts is hacked." },
      { text: "I use the same password (or a few) everywhere", score: 0, tip: "Using the same password is risky—if one site is hacked, all your accounts are at risk." }
    ]
  },
  {
    category: "Account Security",
    question: "Do you review and remove access for apps and services you no longer use?",
    answers: [
      { text: "Yes, I regularly clean up old accounts and permissions", score: 10, tip: "Removing old access reduces your risk if those services are ever hacked." },
      { text: "Sometimes, when I think about it", score: 5, tip: "Try scheduling a quarterly digital cleanup day on your calendar." },
      { text: "No, I keep everything active", score: 0, tip: "Old, forgotten accounts can be security risks. It's like leaving spare keys around." }
    ]
  },
  
  // Data Protection
  {
    category: "Data Protection",
    question: "Do you protect sensitive information when sending it online?",
    answers: [
      { text: "Yes, I use secure methods (password-protected files, encrypted apps)", score: 10, tip: "Protecting sensitive info is like using an envelope instead of a postcard." },
      { text: "Sometimes, for certain things", score: 5, tip: "Consider using secure messaging apps or password-protected files for sensitive information." },
      { text: "No, I just send things normally", score: 0, tip: "Regular email and texts can be intercepted. Use secure options for private information." }
    ]
  },
  {
    category: "Data Protection",
    question: "Do you keep backups of your important files, photos, and documents?",
    answers: [
      { text: "Yes, in multiple places (like cloud + external drive)", score: 10, tip: "Having backups in different places protects you from device failure, theft, or ransomware." },
      { text: "Yes, but only in one place", score: 5, tip: "Consider adding a second backup location for extra protection." },
      { text: "No, I don't have backups", score: 0, tip: "Without backups, a lost phone or broken computer could mean losing everything forever." }
    ]
  },
  {
    category: "Data Protection",
    question: "How often do you delete old files and data you no longer need?",
    answers: [
      { text: "Regularly, following a system", score: 10, tip: "Regularly removing old data reduces your risk if your accounts are ever hacked." },
      { text: "Occasionally, when I think of it", score: 5, tip: "Set reminders to clean up old files, especially those with personal information." },
      { text: "I keep everything indefinitely", score: 0, tip: "Keeping everything increases your risk—the more data stored, the more can be stolen." }
    ]
  },
  
  // Device Security
  {
    category: "Device Security",
    question: "Do you keep your devices (phone, computer, tablets) updated?",
    answers: [
      { text: "Yes, I update everything promptly", score: 10, tip: "Updates fix security holes that hackers can exploit." },
      { text: "I update eventually, but often delay", score: 7, tip: "Try enabling automatic updates so you don't have to remember." },
      { text: "I update only when I have to", score: 3, tip: "Delaying updates leaves your devices vulnerable to known security problems." },
      { text: "I rarely or never update", score: 0, tip: "Outdated devices are easy targets. Updates are like locks for digital doors." }
    ]
  },
  {
    category: "Device Security",
    question: "When using public Wi-Fi (coffee shops, airports), do you take extra security steps?",
    answers: [
      { text: "Yes, I use a VPN or mobile data instead", score: 10, tip: "Public Wi-Fi is like having a conversation in a crowded room—a VPN creates a private space." },
      { text: "Sometimes I'm careful", score: 5, tip: "Avoid banking or shopping on public Wi-Fi unless you're using a VPN (Virtual Private Network)." },
      { text: "No, I connect normally", score: 0, tip: "Public Wi-Fi can be monitored by others. Use a VPN app or stick to mobile data for sensitive activities." }
    ]
  },
  {
    category: "Device Security",
    question: "Do you have protection against viruses and malware on your devices?",
    answers: [
      { text: "Yes, on all my devices", score: 10, tip: "Security software is your digital immune system against threats." },
      { text: "On some devices", score: 5, tip: "Every connected device needs protection—even smartphones and tablets." },
      { text: "No protection installed", score: 0, tip: "Unprotected devices are easily infected. Many good security options are free or built-in." }
    ]
  },
  
  // Digital Awareness
  {
    category: "Digital Awareness",
    question: "Can you spot fake emails or messages trying to trick you?",
    answers: [
      { text: "Yes, I check carefully before clicking links or attachments", score: 10, tip: "Being skeptical of unexpected messages is your best defense against scams." },
      { text: "Sometimes I'm unsure", score: 5, tip: "When in doubt, contact the company directly using their official website—don't use links in the email." },
      { text: "I've fallen for scams before", score: 0, tip: "Check for misspellings, odd email addresses, and urgent requests—these are warning signs." }
    ]
  },
  {
    category: "Digital Awareness",
    question: "Do you have a plan for what to do if your accounts are hacked?",
    answers: [
      { text: "Yes, I know exactly what steps to take", score: 10, tip: "Having a plan ready helps you respond quickly if something happens." },
      { text: "I have a general idea", score: 5, tip: "Write down the basic steps: change passwords, contact support, check for unauthorized changes." },
      { text: "No plan at all", score: 0, tip: "Create a simple checklist now so you're not panicking if something happens." }
    ]
  },
  {
    category: "Digital Awareness",
    question: "Have you set up alerts for unusual activity on your important accounts?",
    answers: [
      { text: "Yes, I get notifications for logins or changes", score: 10, tip: "Alerts help you catch problems early before serious damage occurs." },
      { text: "On some accounts", score: 5, tip: "Start with email, banking, and shopping accounts—they're common targets." },
      { text: "No alerts set up", score: 0, tip: "Activity alerts are like security cameras for your accounts—they let you know when something's wrong." }
    ]
  },
  
  // Privacy Protection
  {
    category: "Privacy Protection",
    question: "Do you check and adjust privacy settings on your social media and online accounts?",
    answers: [
      { text: "Yes, I review them regularly", score: 10, tip: "Companies often change privacy settings—regular checks help maintain your privacy." },
      { text: "Sometimes I look at them", score: 5, tip: "Set a reminder to check privacy settings every few months, especially after app updates." },
      { text: "I just use default settings", score: 0, tip: "Default settings usually share more of your information than necessary." }
    ]
  },
  {
    category: "Privacy Protection",
    question: "When apps ask for permission to access your camera, location, contacts, etc., what do you do?",
    answers: [
      { text: "I only allow what the app truly needs to function", score: 10, tip: "Being selective about permissions helps protect your personal information." },
      { text: "I sometimes check permissions", score: 5, tip: "Regularly review app permissions in your device settings and remove unnecessary access." },
      { text: "I accept whatever the app asks for", score: 0, tip: "Many apps ask for more access than they need—it's okay to say no." }
    ]
  },
  {
    category: "Privacy Protection",
    question: "How do you handle website cookies and tracking?",
    answers: [
      { text: "I block unnecessary trackers and clear cookies regularly", score: 10, tip: "Controlling cookies helps prevent companies from building detailed profiles about you." },
      { text: "I accept only necessary cookies when possible", score: 7, tip: "Privacy-focused browsers like Firefox or Brave can help manage tracking automatically." },
      { text: "I accept all cookies without thinking about it", score: 0, tip: "Cookies can track your activity across different websites, building a profile of your habits." }
    ]
  },
  
  // Mobile & Smart Home
  {
    category: "Mobile & Smart Home",
    question: "How do you lock your phone or tablet?",
    answers: [
      { text: "With fingerprint/face recognition AND a strong passcode", score: 10, tip: "Your phone contains your digital life—protect it with multiple security layers." },
      { text: "With a simple PIN or pattern", score: 3, tip: "Use at least 6 digits for PINs. Patterns can be guessed by watching you or from screen smudges." },
      { text: "I don't lock my devices", score: 0, tip: "An unlocked phone gives access to your emails, accounts, and personal information." }
    ]
  },
  {
    category: "Mobile & Smart Home",
    question: "For smart home devices (speakers, cameras, TV, doorbell), what security steps do you take?",
    answers: [
      { text: "Changed passwords, regular updates, separate Wi-Fi network", score: 10, tip: "Smart devices can be entry points to your home network—extra protection is important." },
      { text: "Changed the default passwords", score: 5, tip: "Also enable automatic updates and consider creating a guest network just for smart devices." },
      { text: "I use them with default settings", score: 0, tip: "Default passwords are often public knowledge and easily hacked." }
    ]
  },
  {
    category: "Mobile & Smart Home",
    question: "Do you control which apps can track your location?",
    answers: [
      { text: "Yes, I regularly check and limit location tracking", score: 10, tip: "Your location history can reveal sensitive information about your life and habits." },
      { text: "I'm somewhat careful about it", score: 5, tip: "Set apps to use location 'only while using' rather than 'always' when possible." },
      { text: "I've never checked location settings", score: 0, tip: "Many apps track your location even when they don't need to—check your settings." }
    ]
  },
  
  // Personal Data Management
  {
    category: "Personal Data Management",
    question: "Do you check if your email or accounts have been in data breaches?",
    answers: [
      { text: "Yes, I use breach notification services", score: 10, tip: "Services like 'Have I Been Pwned' can alert you if your information appears in known breaches." },
      { text: "I've checked once or twice", score: 5, tip: "Set up alerts for future breaches to stay informed about your exposed data." },
      { text: "Never checked", score: 0, tip: "Data breaches happen frequently—knowing which accounts are affected helps you protect yourself." }
    ]
  },
  {
    category: "Personal Data Management",
    question: "Would you share a verification code sent to your phone if someone asks for it?",
    answers: [
      { text: "Never, under any circumstances", score: 10, tip: "Verification codes should never be shared—they're meant only for you to prove your identity." },
      { text: "I might if it seems legitimate", score: 0, tip: "Even if someone claims to be from your bank or a company you trust, never share verification codes." },
      { text: "Yes, if they explain why they need it", score: 0, tip: "Scammers often pose as support staff to trick you into giving access to your accounts." }
    ]
  }
];

// Current security incidents - updated from recent sources
const getCurrentSecurityIncidents = () => [
  {
    title: "Oracle Cloud Security Breach Exposes 6 Million Records",
    date: "March 21, 2025",
    description: "Threat actor compromised Oracle Cloud SSO and LDAP systems, affecting over 140,000 tenants. Check if your company uses Oracle Cloud services.",
    severity: "high"
  },
  {
    title: "Yale New Haven Health System Data Breach",
    date: "February 2025", 
    description: "Healthcare data breach affects approximately 5.6 million patients. Personal and medical information potentially compromised.",
    severity: "high"
  },
  {
    title: "Western Sydney University Student Data Exposed",
    date: "February 2025",
    description: "Personal information of 10,000 current and former students compromised through single sign-on system breach.",
    severity: "medium"
  }
];

// Comparison data with general public
const comparisonData = {
  "General Public": 64,
  "Tech Savvy": 78,
  "Security Professionals": 92
};

// Radar chart component
function RadarChart({ categoryScores }) {
  if (!categoryScores || Object.keys(categoryScores).length === 0) {
    return <div className="text-center text-gray-500">Complete the assessment to see your results</div>;
  }
  
  const categories = Object.keys(categoryScores);
  
  const calculatePoint = (percentage, index, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const radius = (percentage / 100) * 80;
    const x = 100 + radius * Math.cos(angle);
    const y = 100 + radius * Math.sin(angle);
    return { x, y };
  };
  
  const generatePath = () => {
    const points = categories.map((category, i) => {
      const { percentage } = categoryScores[category];
      return calculatePoint(percentage, i, categories.length);
    });
    
    return `M${points[0].x},${points[0].y} ${points.map((p, i) => `L${p.x},${p.y}`).join(' ')} Z`;
  };
  
  const circles = [25, 50, 75, 100].map(percentage => {
    const radius = (percentage / 100) * 80;
    return (
      <circle 
        key={percentage} 
        cx="100" 
        cy="100" 
        r={radius} 
        fill="none" 
        stroke="#e5e7eb" 
        strokeWidth="1" 
        strokeDasharray={percentage === 100 ? "none" : "2,2"}
      />
    );
  });
  
  const axes = categories.map((category, i) => {
    const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
    const outerPoint = calculatePoint(100, i, categories.length);
    const labelPoint = calculatePoint(115, i, categories.length);
    
    return (
      <g key={i}>
        <line 
          x1="100" 
          y1="100" 
          x2={outerPoint.x} 
          y2={outerPoint.y} 
          stroke="#e5e7eb" 
          strokeWidth="1"
        />
        <text
          x={labelPoint.x}
          y={labelPoint.y}
          fontSize="8"
          textAnchor="middle"
          fill="#6b7280"
        >
          {category}
        </text>
      </g>
    );
  });
  
  const dataPoints = categories.map((category, i) => {
    const { percentage } = categoryScores[category];
    const point = calculatePoint(percentage, i, categories.length);
    
    return (
      <circle 
        key={i}
        cx={point.x} 
        cy={point.y} 
        r="3" 
        fill={
          percentage >= 80 ? '#10b981' : 
          percentage >= 60 ? '#3b82f6' : 
          percentage >= 40 ? '#f59e0b' : 
          '#ef4444'
        }
      />
    );
  });
  
  return (
    <svg width="100%" height="200" viewBox="0 0 200 200" className="radar-chart">
      {circles}
      {axes}
      <path
        d={generatePath()}
        fill="rgba(59, 130, 246, 0.2)"
        stroke="#3b82f6"
        strokeWidth="2"
      />
      {dataPoints}
      <circle cx="100" cy="100" r="2" fill="#6b7280" />
    </svg>
  );
}

// Comparison chart component
function ComparisonChart({ userScore }) {
  return (
    <div className="space-y-4">
      {Object.entries(comparisonData).map(([group, score]) => (
        <div key={group} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">{group}</span>
            <span className="text-gray-500">{score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gray-500 h-2.5 rounded-full"
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>
      ))}
      
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-blue-600">Your Score</span>
          <span className="font-medium text-blue-600">{userScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${userScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// Export results as text - simple and reliable
function exportResults(totalScore, maxScore, securityLevel, recommendations, categoryScores) {
  const scorePercentage = Math.round((totalScore / maxScore) * 100);
  const currentDate = new Date().toLocaleDateString('en-US');
  
  const exportText = `PrivScore Security Assessment Results
Generated on: ${currentDate}

=== OVERALL SCORE ===
Score: ${totalScore}/${maxScore} (${scorePercentage}%)
Security Level: ${securityLevel.level}
${securityLevel.description}

=== CATEGORY BREAKDOWN ===
${Object.entries(categoryScores).map(([category, scores]) => 
  `${category}: ${scores.total}/${scores.possible} (${scores.percentage}%)`
).join('\n')}

=== TOP RECOMMENDATIONS ===
${recommendations.map((rec, index) => 
  `${index + 1}. ${rec.action}\n   ${rec.description}`
).join('\n\n')}

=== SECURITY RESOURCES ===
• Two-Factor Authentication Guide: https://www.cisa.gov/secure-our-world/turn-on-multifactor-authentication
• Password Security Guide: https://www.nist.gov/cybersecurity/how-do-i-create-good-password
• Check for Data Breaches: https://haveibeenpwned.com/
• Phishing Prevention: https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks
• Password Strength Checker: https://passgaurd.humanxaihome.com/`;

  // Create and trigger download
  const element = document.createElement('a');
  const file = new Blob([exportText], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `PrivScore-Results-${Date.now()}.txt`;
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
}

export default function PrivScoreComplete() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [previousScore, setPreviousScore] = useState(null);
  
  const maxPossibleScore = securityQuestions.reduce((sum, q) => sum + 10, 0);
  
  const handleAnswer = (score) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    
    if (currentQuestion < securityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };
  
  const handleSkip = () => {
    handleAnswer(0);
  };
  
  const handleRestart = () => {
    const currentScore = answers.reduce((a, b) => a + b, 0);
    setPreviousScore(currentScore);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };
  
  const totalScore = answers.reduce((sum, score) => sum + score, 0);
  
  const calculateCategoryScores = () => {
    const categories = {};
    
    securityQuestions.forEach(q => {
      if (!categories[q.category]) {
        categories[q.category] = { total: 0, possible: 0, percentage: 0 };
      }
    });
    
    answers.forEach((score, index) => {
      if (index < securityQuestions.length) {
        const category = securityQuestions[index].category;
        categories[category].total += score;
        categories[category].possible += 10;
      }
    });
    
    Object.keys(categories).forEach(cat => {
      if (categories[cat].possible > 0) {
        categories[cat].percentage = Math.round((categories[cat].total / categories[cat].possible) * 100);
      }
    });
    
    return categories;
  };
  
  const getSecurityLevel = () => {
    const percentage = Math.round((totalScore / maxPossibleScore) * 100);
    
    if (percentage >= 90) return { 
      level: "Security Champion", 
      description: "Excellent security practices! You're well-protected against most threats.",
      color: "green"
    };
    
    if (percentage >= 70) return { 
      level: "Security Aware", 
      description: "Good foundation with some areas to strengthen for better protection.",
      color: "blue"
    };
    
    if (percentage >= 50) return { 
      level: "Developing Security", 
      description: "You've taken some important steps, but significant vulnerabilities remain.",
      color: "yellow"
    };
    
    return { 
      level: "At Risk", 
      description: "Your current practices leave you vulnerable to common security threats.",
      color: "red"
    };
  };
  
  const getWeakestCategories = () => {
    const categoryScores = calculateCategoryScores();
    return Object.entries(categoryScores)
      .sort((a, b) => a[1].percentage - b[1].percentage)
      .slice(0, 3)
      .map(([category, scores]) => ({ 
        category, 
        percentage: scores.percentage 
      }));
  };
  
  const getRecommendations = () => {
    const weakCategories = getWeakestCategories();
    const recommendations = [];
    
    weakCategories.forEach(catInfo => {
      const category = catInfo.category;
      
      switch(category) {
        case "Account Security":
          recommendations.push({
            category: "Account Security",
            action: "Enable two-factor authentication",
            description: "Set this up on your email and banking accounts first"
          });
          break;
        case "Device Security":
          recommendations.push({
            category: "Device Security",
            action: "Turn on automatic updates",
            description: "Keep your devices protected against known security flaws"
          });
          break;
        case "Data Protection":
          recommendations.push({
            category: "Data Protection",
            action: "Create secure backups",
            description: "Keep copies of important files in at least two different places"
          });
          break;
        case "Digital Awareness":
          recommendations.push({
            category: "Digital Awareness",
            action: "Learn to identify phishing attempts",
            description: "Check sender emails carefully and be cautious of unexpected messages"
          });
          break;
        case "Privacy Protection":
          recommendations.push({
            category: "Privacy Protection",
            action: "Review app permissions",
            description: "Check which apps can access your location, contacts and camera"
          });
          break;
        case "Mobile & Smart Home":
          recommendations.push({
            category: "Mobile & Smart Home",
            action: "Use strong passcodes on devices",
            description: "Combine biometrics with a strong passcode for maximum protection"
          });
          break;
        case "Personal Data Management":
          recommendations.push({
            category: "Personal Data Management",
            action: "Check for account breaches",
            description: "Use haveibeenpwned.com to see if your accounts have been compromised"
          });
          break;
        default:
          recommendations.push({
            category: "General Security",
            action: "Create a security plan",
            description: "Develop a simple checklist for maintaining your digital security"
          });
      }
    });
    
    if (recommendations.length < 3) {
      recommendations.push({
        category: "General Security",
        action: "Stay informed about threats",
        description: "Follow trusted security sources to keep updated on emerging risks"
      });
    }
    
    return recommendations.slice(0, 3);
  };
  
  const progressPercentage = (currentQuestion / securityQuestions.length) * 100;
  
  return (
    <div className="font-sans">
      <div className="bg-gradient-to-br from-slate-50 to-blue-100 p-6 min-h-screen flex flex-col items-center transition-colors">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">PrivScore Security Assessment</h1>
        
        {showResults ? (
          <ResultsView 
            totalScore={totalScore}
            maxScore={maxPossibleScore}
            securityLevel={getSecurityLevel()}
            recommendations={getRecommendations()}
            categoryScores={calculateCategoryScores()}
            previousScore={previousScore}
            securityIncidents={getCurrentSecurityIncidents()}
            onRestart={handleRestart}
          />
        ) : (
          <QuestionView 
            question={securityQuestions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={securityQuestions.length}
            progress={progressPercentage}
            onAnswer={handleAnswer}
            onPrevious={handlePrevious}
            onSkip={handleSkip}
            canGoPrevious={currentQuestion > 0}
          />
        )}
        
        <div className="text-xs text-gray-500 mt-6">Built with ❤️ by HumanXAI</div>
      </div>
    </div>
  );
}

// Question view component
function QuestionView({ 
  question, 
  questionNumber, 
  totalQuestions, 
  progress, 
  onAnswer, 
  onPrevious, 
  onSkip,
  canGoPrevious
}) {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 max-w-2xl w-full transition-colors">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-500">Question {questionNumber} of {totalQuestions}</div>
          <div className="text-sm font-medium text-blue-600">{question.category}</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900">{question.question}</h2>
      
      <div className="space-y-3">
        {question.answers.map((answer, idx) => (
          <button 
            key={idx} 
            onClick={() => onAnswer(answer.score)}
            className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-150 group bg-white"
          >
            <div className="font-medium group-hover:text-blue-600">{answer.text}</div>
            <div className="text-sm text-gray-500 mt-1 group-hover:text-gray-700">{answer.tip}</div>
          </button>
        ))}
      </div>
      
      <div className="flex justify-between mt-8">
        <button 
          onClick={onPrevious}
          className={`px-4 py-2 rounded-lg ${
            canGoPrevious 
              ? 'text-gray-700 hover:bg-gray-100' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
          disabled={!canGoPrevious}
        >
          Previous
        </button>
        
        <button 
          onClick={onSkip}
          className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:underline"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

// Results view component
function ResultsView({ 
  totalScore, 
  maxScore, 
  securityLevel, 
  recommendations,
  categoryScores,
  previousScore,
  securityIncidents,
  onRestart 
}) {
  const formatCategoryScores = () => {
    return Object.fromEntries(
      Object.entries(categoryScores).map(([category, data]) => [
        category, 
        { percentage: data.percentage }
      ])
    );
  };
  
  const levelColorMap = {
    green: "text-green-600",
    blue: "text-blue-600",
    yellow: "text-yellow-600",
    red: "text-red-600"
  };
  
  const badgeBgMap = {
    green: "bg-green-100",
    blue: "bg-blue-100",
    yellow: "bg-yellow-100",
    red: "bg-red-100"
  };
  
  const getLevelIcon = () => {
    switch(securityLevel.color) {
      case "green": return <Award className="w-12 h-12 text-green-600" />;
      case "blue": return <Shield className="w-12 h-12 text-blue-600" />;
      case "yellow": return <Info className="w-12 h-12 text-yellow-600" />;
      case "red": return <AlertCircle className="w-12 h-12 text-red-600" />;
      default: return <Shield className="w-12 h-12 text-blue-600" />;
    }
  };
  
  const scorePercentage = Math.round((totalScore / maxScore) * 100);
  
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 max-w-3xl w-full transition-colors">
      <div className="flex flex-col items-center text-center mb-6">
        <div className={`p-6 rounded-full ${badgeBgMap[securityLevel.color]} mb-4`}>
          {getLevelIcon()}
        </div>
        
        <h1 className={`text-2xl font-bold mb-2 ${levelColorMap[securityLevel.color]}`}>
          {securityLevel.level}
        </h1>
        
        <div className="flex items-baseline gap-2 my-3">
          <span className="text-4xl font-bold text-gray-900">{totalScore}</span>
          <span className="text-lg text-gray-500">/ {maxScore}</span>
          <span className="text-lg text-gray-500 ml-2">({scorePercentage}%)</span>
        </div>
        
        <p className="text-gray-700 max-w-md text-sm">
          {securityLevel.description}
        </p>
      </div>
      
      {/* Progress Indicator */}
      {previousScore && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2 text-gray-900">Your Progress</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs text-gray-500">Previous:</span>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-gray-400 h-4 rounded-l-full" style={{ width: `${(previousScore / maxScore) * 100}%` }}></div>
            </div>
            <span className="text-sm text-gray-500">{Math.round((previousScore / maxScore) * 100)}%</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-blue-600">Current:</span>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-blue-600 h-4 rounded-l-full" style={{ width: `${scorePercentage}%` }}></div>
            </div>
            <span className="text-sm font-medium text-blue-600">{scorePercentage}%</span>
          </div>
          
          <div className="flex justify-center mt-2">
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              totalScore > previousScore ? 'bg-green-100 text-green-800' : 
              totalScore < previousScore ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {totalScore > previousScore ? (
                <>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Improved by {totalScore - previousScore} points
                </>
              ) : totalScore < previousScore ? (
                <>
                  <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />
                  Decreased by {previousScore - totalScore} points
                </>
              ) : (
                'No change'
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* PassGuard Tool Promotion */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">🔐 Strengthen Your Passwords</h3>
          </div>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            Want to check if your current passwords are strong enough or generate ultra-secure new ones? 
            Use our <strong>PassGuard</strong> tool - a powerful password checker and generator that works 
            completely in your browser. <span className="text-purple-600 font-medium">
            Nothing is stored on our servers</span> - your privacy is guaranteed!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://passgaurd.humanxaihome.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Lock className="w-5 h-5 mr-2" />
              Check & Generate Passwords
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              100% Client-Side • Nothing Stored
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Check password strength instantly
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Generate secure passwords
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Complete privacy protection
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Works offline in your browser
            </div>
          </div>
        </div>
      </div>

      {/* Top Actions */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-gray-900">🎯 Top Priority Actions</h3>
        
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
              <div className="font-medium text-gray-800">{rec.action}</div>
              <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Visual Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-base font-medium text-center mb-2 text-gray-900">Security Strength by Category</h3>
          <RadarChart categoryScores={formatCategoryScores()} />
          <div className="mt-2 text-center text-xs text-gray-500 flex justify-center gap-4 flex-wrap">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>80-100%</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>60-79%</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>40-59%</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>0-39%</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-base font-medium mb-3 text-gray-900">How You Compare</h3>
          <ComparisonChart userScore={scorePercentage} />
        </div>
      </div>
      
      {/* Current Security Incidents */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-gray-900">⚠️ Recent Security Incidents</h3>
        <div className="space-y-3">
          {securityIncidents.map((incident, index) => (
            <div 
              key={index} 
              className={`p-3 border-l-4 rounded-r-md ${
                incident.severity === 'high' 
                  ? 'bg-red-50 border-red-500' 
                  : 'bg-yellow-50 border-yellow-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="font-medium text-gray-800">
                  {incident.title}
                </div>
                <div className="text-xs text-gray-500 ml-2">{incident.date}</div>
              </div>
              <p className="text-gray-700 mt-1 text-sm">{incident.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Category Breakdown */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-gray-900">📊 Category Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(categoryScores).map(([category, scores]) => (
            <div key={category} className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-800">{category}</span>
                <span className="text-gray-500">{scores.total}/{scores.possible} ({scores.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    scores.percentage >= 80 ? 'bg-green-500' :
                    scores.percentage >= 60 ? 'bg-blue-500' :
                    scores.percentage >= 40 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} 
                  style={{ width: `${scores.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Resources */}
      <div className="mb-8">
        <h3 className="font-medium mb-3 text-gray-900">🔗 Security Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <a 
            href="https://www.cisa.gov/secure-our-world/turn-on-multifactor-authentication" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline p-2 rounded hover:bg-blue-50"
          >
            <ExternalLink className="w-3 h-3" />
            Two-Factor Authentication Guide
          </a>
          <a 
            href="https://haveibeenpwned.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline p-2 rounded hover:bg-blue-50"
          >
            <ExternalLink className="w-3 h-3" />
            Check for Data Breaches
          </a>
          <a 
            href="https://www.nist.gov/cybersecurity/how-do-i-create-good-password" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline p-2 rounded hover:bg-blue-50"
          >
            <ExternalLink className="w-3 h-3" />
            NIST Password Security Guide
          </a>
          <a 
            href="https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline p-2 rounded hover:bg-blue-50"
          >
            <ExternalLink className="w-3 h-3" />
            Avoid Phishing Attacks
          </a>
        </div>
      </div>
      
      {/* Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button 
          onClick={onRestart}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retake Assessment
        </button>
        
        <button 
          onClick={() => exportResults(totalScore, maxScore, securityLevel, recommendations, categoryScores)}
          className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Results
        </button>
      </div>

      {/* Support Section */}
      <div className="mb-4">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">☕</div>
            <h3 className="text-lg font-semibold text-gray-900">Support PrivScore Development</h3>
          </div>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            Building free, privacy-first security tools takes time and resources. If PrivScore helped you improve your security posture, 
            consider supporting our mission to make cybersecurity accessible to everyone.
          </p>

           <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Keeps tools free for everyone
            </div>
          
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <a
              href="https://buymeacoffee.com/humanxai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              ☕ Buy me a coffee
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            
           
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            Your support enables us to continue creating innovative security solutions that protect professionals worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}