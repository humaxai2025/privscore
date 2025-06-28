import React, { useState, useEffect } from 'react';
import { Brain, Lightbulb, Target, MessageCircle, Zap, AlertTriangle, CheckCircle, Loader } from 'lucide-react';

// AI Service for Hugging Face Integration
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

// AI-Enhanced Question Helper Component
const AIQuestionHelper = ({ question, onConfidenceDetected, aiService }) => {
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
      'multiple_critical_vulnerabilities': 'Multiple critical security gaps significantly increase your attack surface'
    };
    return explanations[pattern] || pattern;
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
  AIService
};