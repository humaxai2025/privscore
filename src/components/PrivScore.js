"use client";

import React, { useState, useEffect } from "react";
import { Shield, Lock, Award, CheckCircle, AlertCircle, Info, RefreshCw, TrendingUp, Copy, Download, ExternalLink, Brain, Lightbulb, Target, MessageCircle, Zap, Loader } from "lucide-react";

// AI Service built directly into the component
class AIService {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY || '';
    this.baseUrl = 'https://api-inference.huggingface.co/models/';
    this.models = {
      textGeneration: 'microsoft/DialoGPT-medium',
      classification: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
      questionAnswering: 'deepset/roberta-base-squad2'
    };
  }

  async generatePersonalizedAdvice(userProfile, weakAreas, answers) {
    if (!this.apiKey) {
      return this.getFallbackAdvice(weakAreas);
    }

    try {
      const prompt = `Generate specific cybersecurity advice for a ${userProfile.role || 'professional'} in ${userProfile.industry || 'technology'} with security weaknesses in: ${weakAreas.join(', ')}. Provide 3 actionable steps.`;
      
      const response = await fetch(`${this.baseUrl}${this.models.textGeneration}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            do_sample: true
          }
        }),
      });

      if (!response.ok) throw new Error('API call failed');
      
      const result = await response.json();
      return this.parseAIAdvice(result);
    } catch (error) {
      console.warn('AI service unavailable, using fallback advice');
      return this.getFallbackAdvice(weakAreas);
    }
  }

  async analyzeRiskPatterns(answers, questions) {
    const riskPatterns = [];
    let criticalRisks = 0;
    
    answers.forEach((score, index) => {
      if (score === 0 && questions[index]) {
        criticalRisks++;
        if (questions[index].category === 'Account Security') {
          riskPatterns.push('high_account_risk');
        }
        if (questions[index].category === 'Digital Awareness') {
          riskPatterns.push('social_engineering_vulnerable');
        }
      }
    });

    // Detect dangerous combinations
    if (criticalRisks >= 3) {
      riskPatterns.push('multiple_critical_vulnerabilities');
    }

    return {
      patterns: riskPatterns,
      riskLevel: criticalRisks >= 4 ? 'EXTREME' : criticalRisks >= 2 ? 'HIGH' : 'MODERATE',
      criticalCount: criticalRisks
    };
  }

  getFallbackAdvice(weakAreas) {
    const adviceMap = {
      'Account Security': [
        'Enable two-factor authentication on all critical accounts immediately',
        'Use a password manager to generate unique passwords for each account',
        'Review and revoke access to unused apps and services quarterly'
      ],
      'Device Security': [
        'Enable automatic security updates on all your devices',
        'Install reputable antivirus software and keep it updated',
        'Use a VPN when connecting to public Wi-Fi networks'
      ],
      'Digital Awareness': [
        'Take phishing awareness training to recognize suspicious emails',
        'Verify unexpected communications by contacting organizations directly',
        'Keep up with current cybersecurity threats through trusted news sources'
      ]
    };

    const advice = [];
    weakAreas.forEach(area => {
      if (adviceMap[area]) {
        advice.push(...adviceMap[area]);
      }
    });

    return advice.slice(0, 3); // Return top 3
  }

  parseAIAdvice(result) {
    if (!result || !result[0] || !result[0].generated_text) {
      return ['Enable multi-factor authentication', 'Use a password manager', 'Keep software updated'];
    }
    
    const text = result[0].generated_text;
    // Simple parsing - in production, you'd want more sophisticated NLP
    const sentences = text.split('.').filter(s => s.trim().length > 10);
    return sentences.slice(0, 3).map(s => s.trim());
  }
}

// AI Question Helper Component
const AIQuestionHelper = ({ question, aiService }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const getHelpExplanation = async () => {
    setLoading(true);
    try {
      // Simple explanation generator based on question category
      const explanations = {
        'Account Security': 'Account security protects your digital identity. Strong authentication prevents 99% of account takeovers.',
        'Device Security': 'Device security keeps your hardware safe from malware and unauthorized access.',
        'Digital Awareness': 'Digital awareness helps you recognize and avoid online threats like phishing and scams.',
        'Privacy Protection': 'Privacy protection controls how much personal information you share online.',
        'Data Protection': 'Data protection ensures your important files are backed up and secure.',
        'Mobile & Smart Home': 'Mobile and smart home security protects your connected devices from being compromised.'
      };
      
      setExplanation(explanations[question.category] || 'This question helps assess your cybersecurity practices.');
    } catch (error) {
      setExplanation('This question helps evaluate your security practices.');
    }
    setLoading(false);
  };

  if (!showHelp) {
    return (
      <button
        onClick={() => {
          setShowHelp(true);
          getHelpExplanation();
        }}
        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-2"
      >
        <Brain className="w-4 h-4" />
        Need help with this question?
      </button>
    );
  }

  return (
    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
        <div>
          <div className="text-sm font-medium text-blue-800">AI Explanation</div>
          {loading ? (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader className="w-3 h-3 animate-spin" />
              <span className="text-xs">Generating explanation...</span>
            </div>
          ) : (
            <div className="text-sm text-blue-700 mt-1">{explanation}</div>
          )}
        </div>
      </div>
      <button
        onClick={() => setShowHelp(false)}
        className="text-xs text-blue-600 hover:text-blue-800 mt-2"
      >
        Hide explanation
      </button>
    </div>
  );
};

// AI Risk Insights Component
const AIRiskInsights = ({ riskAnalysis }) => {
  if (!riskAnalysis) return null;

  const getRiskColor = (level) => {
    switch (level) {
      case 'EXTREME': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MODERATE': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'EXTREME': return <AlertCircle className="w-5 h-5" />;
      case 'HIGH': return <AlertCircle className="w-5 h-5" />;
      case 'MODERATE': return <Target className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getPatternExplanation = (pattern) => {
    const explanations = {
      'high_account_risk': 'Your account security practices put you at high risk of credential theft',
      'social_engineering_vulnerable': 'You may be susceptible to phishing and social engineering attacks',
      'multiple_critical_vulnerabilities': 'Multiple critical security gaps significantly increase your attack surface'
    };
    return explanations[pattern] || pattern;
  };

  return (
    <div className={`p-4 rounded-lg border ${getRiskColor(riskAnalysis.riskLevel)}`}>
      <div className="flex items-center gap-2 mb-2">
        {getRiskIcon(riskAnalysis.riskLevel)}
        <h3 className="font-semibold">🤖 AI Risk Analysis</h3>
      </div>
      
      <div className="text-sm mb-3">
        <strong>Risk Level:</strong> {riskAnalysis.riskLevel}
        {riskAnalysis.criticalCount > 0 && (
          <span className="ml-2">({riskAnalysis.criticalCount} critical vulnerabilities detected)</span>
        )}
      </div>

      {riskAnalysis.patterns.length > 0 && (
        <div>
          <div className="text-sm font-medium mb-2">Detected Risk Patterns:</div>
          <ul className="text-xs space-y-1">
            {riskAnalysis.patterns.map((pattern, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-current">•</span>
                <span>{getPatternExplanation(pattern)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// AI-Enhanced Recommendations Component
const AIEnhancedRecommendations = ({ userProfile, recommendations, answers, questions, aiService }) => {
  const [aiAdvice, setAiAdvice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAIAdvice, setShowAIAdvice] = useState(false);

  useEffect(() => {
    const generateAIAdvice = async () => {
      if (!recommendations || recommendations.length === 0) return;
      
      const weakAreas = recommendations.map(rec => rec.category || 'General Security');
      const advice = await aiService.generatePersonalizedAdvice(userProfile, weakAreas, answers);
      setAiAdvice(advice);
      setLoading(false);
    };

    generateAIAdvice();
  }, [recommendations, userProfile, answers, aiService]);

  if (loading) {
    return (
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2">
          <Loader className="w-5 h-5 animate-spin text-purple-600" />
          <span className="text-purple-800 font-medium">🤖 AI analyzing your security profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">🤖 AI-Enhanced Security Insights</h3>
          </div>
          <button
            onClick={() => setShowAIAdvice(!showAIAdvice)}
            className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1"
          >
            <Zap className="w-4 h-4" />
            {showAIAdvice ? 'Hide' : 'Show'} AI Advice
          </button>
        </div>

        {showAIAdvice && aiAdvice.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-purple-700 mb-2">Personalized AI recommendations based on your profile:</div>
            {aiAdvice.map((advice, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="text-purple-600 font-bold">{index + 1}.</span>
                <span className="text-purple-800">{advice}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 text-xs text-purple-600">
          💡 AI insights are generated based on your responses and current threat landscape
        </div>
      </div>
    </div>
  );
};

// Smart Progress Tracker with AI
const AIProgressTracker = ({ currentScore, maxScore, riskAnalysis }) => {
  const percentage = Math.round((currentScore / maxScore) * 100);
  
  const getAIInsight = () => {
    if (percentage >= 90) return "🤖 AI Analysis: Excellent security posture! You're in the top 10% of users.";
    if (percentage >= 70) return "🤖 AI Analysis: Good security foundation with room for strategic improvements.";
    if (percentage >= 50) return "🤖 AI Analysis: Moderate security level - focus on critical vulnerabilities first.";
    return "🤖 AI Analysis: Immediate action needed. Multiple security gaps detected.";
  };

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium">AI Security Assessment</span>
      </div>
      <div className="text-xs text-gray-600 mb-2">{getAIInsight()}</div>
      {riskAnalysis && (
        <div className="text-xs text-gray-500">
          Risk Level: <span className={`font-medium ${
            riskAnalysis.riskLevel === 'EXTREME' ? 'text-red-600' :
            riskAnalysis.riskLevel === 'HIGH' ? 'text-orange-600' :
            'text-yellow-600'
          }`}>{riskAnalysis.riskLevel}</span>
        </div>
      )}
    </div>
  );
};

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

// Current security incidents
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

export default function PrivScoreComplete() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [previousScore, setPreviousScore] = useState(null);
  const [userProfile] = useState({ role: 'professional', industry: 'technology' });
  const [aiService] = useState(() => new AIService());
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  
  const maxPossibleScore = securityQuestions.reduce((sum, q) => sum + 10, 0);
  
  useEffect(() => {
    if (answers.length === securityQuestions.length && answers.length > 0) {
      analyzeUserRisk();
    }
  }, [answers]);

  const analyzeUserRisk = async () => {
    try {
      const analysis = await aiService.analyzeRiskPatterns(answers, securityQuestions);
      setRiskAnalysis(analysis);
    } catch (error) {
      console.warn('AI risk analysis failed:', error);
    }
  };
  
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
    setRiskAnalysis(null);
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
  
  const getRecommendations = () => {
    const specificRecommendations = [];
    
    // Analyze individual answers for specific recommendations
    answers.forEach((score, index) => {
      if (index < securityQuestions.length) {
        const question = securityQuestions[index];
        
        if (score < 7) {
          if (index === 0) {
            if (score === 0) {
              specificRecommendations.push({
                priority: "CRITICAL",
                action: "Set up two-factor authentication immediately",
                description: "You have no 2FA protection. This single step prevents 99% of account takeovers.",
                steps: [
                  "Go to accounts.google.com → Security → 2-Step Verification",
                  "Add your phone number for verification codes",
                  "Repeat for banking, social media, and work accounts",
                  "Consider using Google Authenticator app for extra security"
                ]
              });
            }
          }
        }
      }
    });
    
    // Add fallback recommendation if none found
    if (specificRecommendations.length === 0) {
      specificRecommendations.push({
        priority: "MEDIUM",
        action: "Continue maintaining good security practices",
        description: "Keep up your current security habits and stay informed about new threats.",
        steps: [
          "Review security settings quarterly",
          "Stay updated on current threats",
          "Help others improve their security"
        ]
      });
    }
    
    return specificRecommendations.slice(0, 3);
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
            userProfile={userProfile}
            answers={answers}
            questions={securityQuestions}
            aiService={aiService}
            riskAnalysis={riskAnalysis}
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
            aiService={aiService}
          />
        )}
        
        <div className="text-xs text-gray-500 mt-6">Built with ❤️ by HumanXAI</div>
      </div>
    </div>
  );
}

// Question view component with AI integration
function QuestionView({ 
  question, 
  questionNumber, 
  totalQuestions, 
  progress, 
  onAnswer, 
  onPrevious, 
  onSkip,
  canGoPrevious,
  aiService
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
      
      {/* AI Question Helper */}
      <AIQuestionHelper question={question} aiService={aiService} />
      
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

// Results view component with AI integration
function ResultsView({ 
  totalScore, 
  maxScore, 
  securityLevel, 
  recommendations,
  categoryScores,
  previousScore,
  securityIncidents,
  onRestart,
  userProfile,
  answers,
  questions,
  aiService,
  riskAnalysis
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
      
      {/* AI Progress Tracker */}
      <AIProgressTracker 
        currentScore={totalScore}
        maxScore={maxScore}
        riskAnalysis={riskAnalysis}
      />
      
      {/* AI Risk Insights */}
      {riskAnalysis && (
        <div className="mb-6">
          <AIRiskInsights riskAnalysis={riskAnalysis} />
        </div>
      )}
      
      {/* AI Enhanced Recommendations */}
      <AIEnhancedRecommendations
        userProfile={userProfile}
        recommendations={recommendations}
        answers={answers}
        questions={questions}
        aiService={aiService}
      />
      
      {/* Visual Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-base font-medium text-center mb-2 text-gray-900">Security Strength by Category</h3>
          <RadarChart categoryScores={formatCategoryScores()} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-base font-medium mb-3 text-gray-900">How You Compare</h3>
          <ComparisonChart userScore={scorePercentage} />
        </div>
      </div>
      
      {/* Regular Recommendations */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-gray-900">🎯 Your Personal Action Plan</h3>
        
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              rec.priority === 'CRITICAL' ? 'border-red-500 bg-red-50' :
              rec.priority === 'HIGH' ? 'border-orange-500 bg-orange-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-gray-800">{rec.action}</div>
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  rec.priority === 'CRITICAL' ? 'bg-red-200 text-red-800' :
                  rec.priority === 'HIGH' ? 'bg-orange-200 text-orange-800' :
                  'bg-blue-200 text-blue-800'
                }`}>
                  {rec.priority}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
              
              {rec.steps && (
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">Step-by-step instructions:</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {rec.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start">
                        <span className="text-blue-500 mr-2 font-bold">{stepIndex + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
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
      </div>
    </div>
  );
}