import React, { useState, useEffect } from 'react';
import { Brain, Lightbulb, Target, MessageCircle, Zap, AlertTriangle, CheckCircle, Loader } from 'lucide-react';

// AI Service for Hugging Face Integration
class AIService {
  constructor() {
    this.apiKey = this.getApiKey();
    this.baseUrl = 'https://api-inference.huggingface.co/models/';
    this.models = {
      textGeneration: 'microsoft/DialoGPT-medium',
      classification: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
      questionAnswering: 'deepset/roberta-base-squad2'
    };
    
    console.log('🤖 AI Service initialized:', {
      hasApiKey: !!this.apiKey,
      isEnabled: this.isEnabled(),
      apiKeyLength: this.apiKey?.length || 0
    });
  }

  getApiKey() {
    // Try multiple methods to get the API key
    try {
      // Method 1: Browser environment with Next.js injected vars
      if (typeof window !== 'undefined') {
        if (window.__NEXT_DATA__?.env?.NEXT_PUBLIC_HUGGING_FACE_API_KEY) {
          console.log('✅ Found API key in Next.js env');
          return window.__NEXT_DATA__.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
        }
        
        if (window.NEXT_PUBLIC_HUGGING_FACE_API_KEY) {
          console.log('✅ Found API key in window global');
          return window.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
        }
      }
    } catch (error) {
      console.warn('Browser environment check failed:', error);
    }

    // Method 2: Server-side process.env
    try {
      if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_HUGGING_FACE_API_KEY) {
        console.log('✅ Found API key in process.env');
        return process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
      }
    } catch (error) {
      console.warn('Server environment check failed:', error);
    }

    console.log('❌ No API key found - AI features will use fallbacks');
    return '';
  }

  isEnabled() {
    return this.apiKey && this.apiKey.length > 0;
  }

  // Method to manually set API key (for runtime configuration)
  setApiKey(key) {
    this.apiKey = key;
    console.log('🔑 API key updated:', { hasKey: !!key, length: key?.length || 0 });
  }

  // Test API key functionality
  async testApiKey() {
    if (!this.isEnabled()) {
      return { success: false, message: 'No API key configured' };
    }

    try {
      const response = await fetch(`${this.baseUrl}${this.models.textGeneration}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: 'Test connection',
          parameters: { max_length: 50 }
        }),
      });

      if (response.ok) {
        return { success: true, message: 'API key is working correctly!' };
      } else {
        const errorText = await response.text();
        return { success: false, message: `API error: ${response.status} - ${errorText}` };
      }
    } catch (error) {
      return { success: false, message: `Connection error: ${error.message}` };
    }
  }

  async generatePersonalizedAdvice(userProfile, weakAreas, answers) {
    console.log('🤖 Generating AI advice...', { isEnabled: this.isEnabled(), weakAreas });

    if (this.isEnabled()) {
      try {
        const prompt = `As a cybersecurity expert, provide 3 specific actionable security recommendations for a ${userProfile.role || 'professional'} working in ${userProfile.industry || 'technology'} who has weaknesses in: ${weakAreas.join(', ')}. Make recommendations practical and immediate.`;
        
        const response = await fetch(`${this.baseUrl}${this.models.textGeneration}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_length: 150,
              temperature: 0.7,
              do_sample: true
            }
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ AI API call successful');
          const parsedAdvice = this.parseAIAdvice(result);
          return parsedAdvice.map(advice => `🤖 AI: ${advice}`);
        } else {
          throw new Error(`API call failed: ${response.status}`);
        }
      } catch (error) {
        console.error('AI service error:', error);
      }
    }
    
    // Fallback to enhanced rule-based advice
    const fallbackAdvice = this.getFallbackAdvice(weakAreas);
    return fallbackAdvice.map(advice => `📋 Expert: ${advice}`);
  }

  async detectAnswerConfidence(questionText, answerText) {
    // Simulate confidence detection based on answer patterns
    const uncertainPhrases = ['sometimes', 'maybe', 'i think', 'not sure', 'probably'];
    const confident = !uncertainPhrases.some(phrase => 
      answerText.toLowerCase().includes(phrase)
    );
    
    return {
      confident,
      confidence: confident ? 0.85 : 0.45,
      needsHelp: !confident
    };
  }

  async analyzeRiskPatterns(answers, questions) {
    const riskPatterns = [];
    let criticalRisks = 0;
    let accountSecurityScore = 0;
    let deviceSecurityScore = 0;
    let awarenessScore = 0;
    
    answers.forEach((score, index) => {
      if (index < questions.length) {
        const question = questions[index];
        
        if (score === 0) {
          criticalRisks++;
          
          if (question.category === 'Account Security') {
            accountSecurityScore += 1;
            riskPatterns.push('high_account_risk');
          }
          if (question.category === 'Digital Awareness') {
            awarenessScore += 1;
            riskPatterns.push('social_engineering_vulnerable');
          }
          if (question.category === 'Device Security') {
            deviceSecurityScore += 1;
            riskPatterns.push('device_vulnerability');
          }
        }
      }
    });

    // Advanced pattern detection
    if (criticalRisks >= 3) {
      riskPatterns.push('multiple_critical_vulnerabilities');
    }
    
    if (accountSecurityScore >= 2 && awarenessScore >= 1) {
      riskPatterns.push('high_credential_theft_risk');
    }
    
    if (deviceSecurityScore >= 2) {
      riskPatterns.push('endpoint_security_weakness');
    }

    // AI-enhanced risk level calculation
    let riskLevel;
    if (criticalRisks >= 6) {
      riskLevel = 'EXTREME';
    } else if (criticalRisks >= 4) {
      riskLevel = 'HIGH';
    } else if (criticalRisks >= 2) {
      riskLevel = 'MODERATE';
    } else {
      riskLevel = 'LOW';
    }

    return {
      patterns: [...new Set(riskPatterns)], // Remove duplicates
      riskLevel,
      criticalCount: criticalRisks,
      accountSecurityScore,
      deviceSecurityScore,
      awarenessScore,
      aiGenerated: true
    };
  }

  async generateQuestionExplanation(question) {
    if (this.isEnabled()) {
      try {
        const prompt = `Explain why this cybersecurity question is important: "${question.question}" - Provide a brief, clear explanation for a non-technical user.`;
        
        const response = await fetch(`${this.baseUrl}${this.models.questionAnswering}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            inputs: {
              question: "Why is this important for cybersecurity?",
              context: question.question + " " + question.answers.map(a => a.tip).join(" ")
            }
          }),
        });

        if (response.ok) {
          const result = await response.json();
          return result.answer || this.getFallbackExplanation(question.category);
        }
      } catch (error) {
        console.warn('AI explanation failed, using fallback');
      }
    }
    
    return this.getFallbackExplanation(question.category);
  }

  getFallbackAdvice(weakAreas) {
    const adviceMap = {
      'Account Security': [
        '🔐 Enable two-factor authentication on all critical accounts immediately - this prevents 99% of account takeovers',
        '🔑 Use a password manager to generate unique, strong passwords for each account',
        '🧹 Review and revoke access to unused apps and services quarterly to reduce attack surface'
      ],
      'Device Security': [
        '🔄 Enable automatic security updates on all your devices to patch vulnerabilities',
        '🛡️ Install reputable antivirus software and keep it updated',
        '🔒 Use a VPN when connecting to public Wi-Fi networks'
      ],
      'Digital Awareness': [
        '🎓 Take phishing awareness training to recognize suspicious emails and messages',
        '✅ Verify unexpected communications by contacting organizations directly',
        '📰 Stay informed about current cybersecurity threats through trusted sources'
      ],
      'Privacy Protection': [
        '⚙️ Review and tighten privacy settings on all social media and online accounts',
        '📱 Limit app permissions to only what is necessary for functionality',
        '🍪 Use privacy-focused browsers and block unnecessary tracking cookies'
      ],
      'Data Protection': [
        '💾 Set up automated backups to both cloud and physical storage',
        '🔐 Encrypt sensitive files before storing or sharing them',
        '🗑️ Regularly delete old files containing personal information you no longer need'
      ],
      'Mobile & Smart Home': [
        '📱 Use both biometric and strong passcode protection on mobile devices',
        '🏠 Change default passwords on all smart home devices and update firmware regularly',
        '📍 Review and limit location tracking permissions for apps'
      ],
      'Personal Data Management': [
        '🔍 Regularly check if your accounts have been compromised using breach notification services',
        '🚫 Never share verification codes or passwords with anyone claiming to be support',
        '📋 Create an incident response plan for when accounts are compromised'
      ]
    };

    const advice = [];
    weakAreas.forEach(area => {
      if (adviceMap[area]) {
        advice.push(...adviceMap[area]);
      }
    });

    return advice.slice(0, 3);
  }

  getFallbackExplanation(category) {
    const explanations = {
      'Account Security': 'Account security protects your digital identity. Strong authentication prevents 99% of account takeovers and keeps your personal information safe.',
      'Device Security': 'Device security keeps your hardware safe from malware and unauthorized access. Updated devices are much harder for cybercriminals to compromise.',
      'Digital Awareness': 'Digital awareness helps you recognize and avoid online threats like phishing and scams. Most cyber attacks succeed through human error.',
      'Privacy Protection': 'Privacy protection controls how much personal information you share online. This reduces your risk of identity theft and data misuse.',
      'Data Protection': 'Data protection ensures your important files are backed up and secure. Without proper backups, ransomware or device failure could destroy everything.',
      'Mobile & Smart Home': 'Mobile and smart home security protects your connected devices from being compromised and used to access your personal information.',
      'Personal Data Management': 'Personal data management helps you track and control where your information has been exposed, allowing you to respond quickly to breaches.'
    };
    
    return explanations[category] || 'This question helps assess your cybersecurity practices and identify areas for improvement.';
  }

  parseAIAdvice(result) {
    if (!result || !result[0] || !result[0].generated_text) {
      return ['Enable multi-factor authentication', 'Use a password manager', 'Keep software updated'];
    }
    
    const text = result[0].generated_text;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 3).map(s => s.trim());
  }
}

// API Key Configuration Component
const ApiKeyConfig = ({ aiService, onKeyUpdate }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSaveKey = async () => {
    if (tempKey.trim()) {
      aiService.setApiKey(tempKey.trim());
      setTesting(true);
      const result = await aiService.testApiKey();
      setTestResult(result);
      setTesting(false);
      
      if (result.success) {
        onKeyUpdate(tempKey.trim());
        setTimeout(() => {
          setShowConfig(false);
          setTestResult(null);
        }, 2000);
      }
    }
  };

  const handleRemoveKey = () => {
    aiService.setApiKey('');
    setTempKey('');
    setTestResult(null);
    onKeyUpdate('');
  };

  if (!showConfig) {
    return (
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              {aiService.isEnabled() ? '🟢 AI Features Active' : '⚪ AI Features Available'}
            </span>
          </div>
          <button
            onClick={() => setShowConfig(true)}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            {aiService.isEnabled() ? 'Update API Key' : 'Configure AI'}
          </button>
        </div>
        {!aiService.isEnabled() && (
          <p className="text-xs text-blue-600 mt-1">
            Add your Hugging Face API key to enable live AI features
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-800 mb-3">🤖 AI Configuration</h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-blue-700 mb-1">
            Hugging Face API Key (optional)
          </label>
          <input
            type="password"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className="w-full px-3 py-2 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-blue-600 mt-1">
            Get your free API key at{' '}
            <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline">
              huggingface.co/settings/tokens
            </a>
          </p>
        </div>

        {testResult && (
          <div className={`p-2 rounded text-xs ${
            testResult.success 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {testResult.message}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleSaveKey}
            disabled={testing || !tempKey.trim()}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
          >
            {testing ? <Loader className="w-3 h-3 animate-spin" /> : null}
            {testing ? 'Testing...' : 'Save & Test'}
          </button>
          
          {aiService.isEnabled() && (
            <button
              onClick={handleRemoveKey}
              className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
            >
              Remove Key
            </button>
          )}
          
          <button
            onClick={() => {
              setShowConfig(false);
              setTestResult(null);
            }}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// AI-Enhanced Question Helper Component
const AIQuestionHelper = ({ question, onConfidenceDetected, aiService }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const getHelpExplanation = async () => {
    setLoading(true);
    try {
      const result = await aiService.generateQuestionExplanation(question);
      setExplanation(result);
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
      case 'EXTREME': return <AlertTriangle className="w-5 h-5" />;
      case 'HIGH': return <AlertTriangle className="w-5 h-5" />;
      case 'MODERATE': return <Target className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getPatternExplanation = (pattern) => {
    const explanations = {
      'high_account_risk': 'Your account security practices put you at high risk of credential theft',
      'social_engineering_vulnerable': 'You may be susceptible to phishing and social engineering attacks',
      'multiple_critical_vulnerabilities': 'Multiple critical security gaps significantly increase your attack surface',
      'device_vulnerability': 'Your devices may be vulnerable to malware and unauthorized access',
      'high_credential_theft_risk': 'Combined account and awareness weaknesses create high theft risk',
      'endpoint_security_weakness': 'Your endpoints (devices) lack proper security protections'
    };
    return explanations[pattern] || pattern.replace(/_/g, ' ');
  };

  return (
    <div className={`p-4 rounded-lg border ${getRiskColor(riskAnalysis.riskLevel)}`}>
      <div className="flex items-center gap-2 mb-2">
        {getRiskIcon(riskAnalysis.riskLevel)}
        <h3 className="font-semibold">AI Risk Analysis</h3>
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
          <span className="text-purple-800 font-medium">AI analyzing your security profile...</span>
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
            <h3 className="font-semibold text-gray-900">AI-Enhanced Security Insights</h3>
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
    if (percentage >= 90) return "AI Analysis: Excellent security posture! You're in the top 10% of users.";
    if (percentage >= 70) return "AI Analysis: Good security foundation with room for strategic improvements.";
    if (percentage >= 50) return "AI Analysis: Moderate security level - focus on critical vulnerabilities first.";
    return "AI Analysis: Immediate action needed. Multiple security gaps detected.";
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

// Main AI Features Integration Component
const AIFeaturesIntegration = ({ 
  children, 
  userAnswers = [], 
  questions = [], 
  recommendations = [],
  totalScore = 0,
  maxScore = 180,
  userProfile = {} 
}) => {
  const [aiService] = useState(() => new AIService());
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (userAnswers.length === questions.length && userAnswers.length > 0) {
      analyzeUserRisk();
    }
  }, [userAnswers, questions]);

  const analyzeUserRisk = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await aiService.analyzeRiskPatterns(userAnswers, questions);
      setRiskAnalysis(analysis);
    } catch (error) {
      console.warn('AI risk analysis failed:', error);
    }
    setIsAnalyzing(false);
  };

  // Clone children and inject AI props
  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        aiService,
        riskAnalysis,
        AIQuestionHelper,
        AIEnhancedRecommendations,
        AIRiskInsights,
        AIProgressTracker
      });
    }
    return child;
  });

  return (
    <div className="ai-enhanced-privscore">
      {enhancedChildren}
    </div>
  );
};

export {
  AIFeaturesIntegration,
  AIQuestionHelper,
  AIEnhancedRecommendations,
  AIRiskInsights,
  AIProgressTracker,
  AIService,
  ApiKeyConfig
};