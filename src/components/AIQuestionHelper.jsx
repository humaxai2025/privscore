import React, { useState, useEffect } from 'react';
import { Brain, Lightbulb, Target, MessageCircle, Zap, AlertTriangle, CheckCircle, Loader, Info, Sparkles } from 'lucide-react';

// Enhanced AI Question Helper Component with detailed explanations
const AIQuestionHelper = ({ question, aiService }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  const getHelpExplanation = async () => {
    setLoading(true);
    setIsAiGenerated(false);
    
    try {
      console.log('🤖 Requesting AI explanation for question...');
      const result = await aiService.generateQuestionExplanation(question);
      
      // Check if the response is from AI or expert system
      const isFromAI = result.includes('🤖 AI:');
      setIsAiGenerated(isFromAI);
      
      // Clean up the response for display
      const cleanExplanation = result.replace(/^(🤖 AI:|📋 Expert:)\s*/, '');
      setExplanation(cleanExplanation);
      
      console.log(isFromAI ? '✅ AI explanation generated' : '📋 Using expert explanation');
      
    } catch (error) {
      console.error('Error getting explanation:', error);
      setExplanation('This question helps evaluate your security practices and identify potential vulnerabilities.');
      setIsAiGenerated(false);
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
        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-2 transition-colors"
      >
        <Brain className="w-4 h-4" />
        🤖 Need help with this question?
      </button>
    );
  }

  return (
    <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-start gap-2">
        <div className="flex items-center gap-1">
          {isAiGenerated ? (
            <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
          ) : (
            <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
          )}
          {isAiGenerated && <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded font-bold">LIVE AI</span>}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-blue-800 mb-1">
            {isAiGenerated ? '🤖 AI Explanation' : '📋 Expert Explanation'}
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader className="w-3 h-3 animate-spin" />
              <span className="text-xs">AI generating detailed explanation...</span>
            </div>
          ) : (
            <div className="text-sm text-blue-700 leading-relaxed">{explanation}</div>
          )}
        </div>
      </div>
      <button
        onClick={() => setShowHelp(false)}
        className="text-xs text-blue-600 hover:text-blue-800 mt-3 underline"
      >
        Hide explanation
      </button>
    </div>
  );
};

// Enhanced AI-Enhanced Recommendations Component with detailed display
const AIEnhancedRecommendations = ({ userProfile, recommendations, answers, questions, aiService }) => {
  const [aiAdvice, setAiAdvice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAIAdvice, setShowAIAdvice] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const generateAIAdvice = async () => {
      console.log('🤖 Starting AI advice generation...');
      setDebugInfo('Initializing AI advice generation...');
      
      const weakAreas = recommendations && recommendations.length > 0 
        ? recommendations.map(rec => rec.category || 'General Security')
        : ['Account Security', 'Digital Awareness', 'Data Protection'];
      
      setDebugInfo(`Analyzing weak areas: ${weakAreas.join(', ')}`);
      
      try {
        console.log('🔄 Calling AI service for personalized advice...');
        const advice = await aiService.generatePersonalizedAdvice(userProfile, weakAreas, answers);
        
        // Check if advice contains AI markers
        const containsAiMarker = advice.some(a => a.includes('🤖 AI'));
        const containsExpertMarker = advice.some(a => a.includes('📋 Expert'));
        
        console.log('🔍 AI Advice Analysis:', {
          totalAdvice: advice.length,
          hasAiMarker: containsAiMarker,
          hasExpertMarker: containsExpertMarker,
          firstAdvicePreview: advice[0]?.substring(0, 50) + '...'
        });
        
        setAiAdvice(advice);
        setIsAiGenerated(containsAiMarker);
        setDebugInfo(containsAiMarker ? 'Live AI recommendations generated!' : 'Using expert fallback recommendations');
        
      } catch (error) {
        console.error('💥 AI advice generation failed:', error);
        setAiAdvice([
          '📋 Expert: Strengthen account security with two-factor authentication across all critical accounts',
          '📋 Expert: Implement a comprehensive password management strategy using dedicated tools',
          '📋 Expert: Establish regular security update routines for all connected devices'
        ]);
        setIsAiGenerated(false);
        setDebugInfo(`AI generation failed: ${error.message}. Using expert recommendations.`);
      }
      
      setLoading(false);
    };

    generateAIAdvice();
  }, [recommendations, userProfile, answers, aiService]);

  if (loading) {
    return (
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <Loader className="w-5 h-5 animate-spin text-purple-600" />
          <span className="text-purple-800 font-medium">🤖 AI analyzing your security profile...</span>
        </div>
        <div className="text-xs text-purple-600">{debugInfo}</div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isAiGenerated ? (
              <Sparkles className="w-5 h-5 text-purple-600" />
            ) : (
              <Brain className="w-5 h-5 text-purple-600" />
            )}
            <h3 className="font-semibold text-gray-900">🤖 AI-Enhanced Security Insights</h3>
            {isAiGenerated && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                🟢 LIVE AI
              </span>
            )}
            {!isAiGenerated && (
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded font-bold">📋 EXPERT</span>
            )}
          </div>
          <button
            onClick={() => setShowAIAdvice(!showAIAdvice)}
            className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1 transition-colors"
          >
            <Zap className="w-4 h-4" />
            {showAIAdvice ? 'Hide' : 'Show'} Detailed Advice
          </button>
        </div>

        {showAIAdvice && (
          <div className="space-y-4">
            <div className="text-sm text-purple-700 mb-3 font-medium">
              {isAiGenerated ? 
                '🤖 Live AI recommendations tailored to your profile:' : 
                '📋 Expert recommendations based on security best practices:'
              }
            </div>
            
            {aiAdvice.map((advice, index) => {
              // Clean up the advice text for display
              const cleanAdvice = advice.replace(/^(🤖 AI:|📋 Expert:)\s*/, '');
              const isFromAI = advice.includes('🤖 AI');
              
              return (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  isFromAI ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-start gap-2">
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-purple-600 font-bold text-sm">{index + 1}.</span>
                      {isFromAI && <Sparkles className="w-3 h-3 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-purple-800 leading-relaxed">{cleanAdvice}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Debug information for transparency */}
            <div className="mt-3 p-2 bg-gray-100 rounded text-xs text-gray-600">
              <strong>Debug Info:</strong> {debugInfo}
            </div>
          </div>
        )}

        <div className="mt-3 text-xs text-purple-600">
          💡 {isAiGenerated ? 
            '🟢 Powered by Hugging Face AI models with personalized analysis' : 
            '📋 Expert cybersecurity guidance based on industry best practices'
          }
        </div>
      </div>
    </div>
  );
};

// Enhanced AI Risk Insights Component
const AIRiskInsights = ({ riskAnalysis }) => {
  if (!riskAnalysis) return null;

  const getRiskColor = (level) => {
    switch (level) {
      case 'EXTREME': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MODERATE': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'EXTREME': return <AlertTriangle className="w-5 h-5" />;
      case 'HIGH': return <AlertTriangle className="w-5 h-5" />;
      case 'MODERATE': return <Target className="w-5 h-5" />;
      case 'LOW': return <CheckCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getPatternExplanation = (pattern) => {
    const explanations = {
      'high_account_risk': 'Your account security practices put you at high risk of credential theft and unauthorized access',
      'social_engineering_vulnerable': 'You may be susceptible to phishing, social engineering attacks, and online scams',
      'multiple_critical_vulnerabilities': 'Multiple critical security gaps significantly increase your overall attack surface',
      'device_vulnerability': 'Your devices may be vulnerable to malware, unauthorized access, and data theft',
      'high_credential_theft_risk': 'Combined account and awareness weaknesses create elevated credential theft risk',
      'endpoint_security_weakness': 'Your endpoints (computers, phones, tablets) lack proper security protections'
    };
    return explanations[pattern] || pattern.replace(/_/g, ' ');
  };

  return (
    <div className={`p-4 rounded-lg border ${getRiskColor(riskAnalysis.riskLevel)} mb-6`}>
      <div className="flex items-center gap-2 mb-3">
        {getRiskIcon(riskAnalysis.riskLevel)}
        <h3 className="font-semibold">🤖 AI Risk Analysis</h3>
        {riskAnalysis.aiGenerated && (
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Generated
          </span>
        )}
      </div>
      
      <div className="text-sm mb-3">
        <strong>Risk Level:</strong> <span className="font-bold">{riskAnalysis.riskLevel}</span>
        {riskAnalysis.criticalCount > 0 && (
          <span className="ml-2">({riskAnalysis.criticalCount} critical vulnerabilities detected)</span>
        )}
      </div>

      {riskAnalysis.patterns.length > 0 && (
        <div>
          <div className="text-sm font-medium mb-2">🔍 Detected Risk Patterns:</div>
          <ul className="text-xs space-y-2">
            {riskAnalysis.patterns.map((pattern, index) => (
              <li key={index} className="flex items-start gap-2 p-2 bg-white bg-opacity-50 rounded">
                <span className="text-current">•</span>
                <span className="leading-relaxed">{getPatternExplanation(pattern)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {riskAnalysis.criticalCount > 0 && (
        <div className="mt-3 p-2 bg-white bg-opacity-70 rounded">
          <div className="text-xs font-medium">⚠️ Immediate Action Required:</div>
          <div className="text-xs mt-1">
            Address the {riskAnalysis.criticalCount} critical vulnerabilities first, as they represent the highest risk to your security.
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Smart Progress Tracker with AI
const AIProgressTracker = ({ currentScore, maxScore, riskAnalysis }) => {
  const percentage = Math.round((currentScore / maxScore) * 100);
  
  const getAIInsight = () => {
    if (percentage >= 90) return "🤖 AI Analysis: Excellent security posture! You're in the top 10% of users with comprehensive protection.";
    if (percentage >= 70) return "🤖 AI Analysis: Good security foundation with room for strategic improvements in key areas.";
    if (percentage >= 50) return "🤖 AI Analysis: Moderate security level - focus on critical vulnerabilities first for maximum impact.";
    return "🤖 AI Analysis: Immediate action needed. Multiple security gaps detected that require urgent attention.";
  };

  const getPerformanceCategory = () => {
    if (percentage >= 90) return { label: "Security Expert", color: "text-green-600", bg: "bg-green-100" };
    if (percentage >= 70) return { label: "Security Aware", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 50) return { label: "Developing", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { label: "At Risk", color: "text-red-600", bg: "bg-red-100" };
  };

  const category = getPerformanceCategory();

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium">🤖 AI Security Assessment</span>
        <span className={`text-xs px-2 py-1 rounded ${category.bg} ${category.color} font-medium`}>
          {category.label}
        </span>
        {riskAnalysis?.aiGenerated && (
          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Powered
          </span>
        )}
      </div>
      
      <div className="text-xs text-gray-600 mb-3 leading-relaxed">{getAIInsight()}</div>
      
      {riskAnalysis && (
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-500">Risk Level:</span>
            <span className={`font-medium ml-1 ${
              riskAnalysis.riskLevel === 'EXTREME' ? 'text-red-600' :
              riskAnalysis.riskLevel === 'HIGH' ? 'text-orange-600' :
              riskAnalysis.riskLevel === 'MODERATE' ? 'text-yellow-600' :
              'text-green-600'
            }`}>{riskAnalysis.riskLevel}</span>
          </div>
          <div>
            <span className="text-gray-500">Security Score:</span>
            <span className={`font-medium ml-1 ${category.color}`}>{percentage}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

// API Key Configuration Component with enhanced testing
const ApiKeyConfig = ({ aiService, onKeyUpdate }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [useProxy, setUseProxy] = useState(aiService.useProxy);

  const handleSaveKey = async () => {
    if (tempKey.trim()) {
      aiService.setApiKey(tempKey.trim());
      setTesting(true);
      
      const results = await aiService.testAIConnection();
      setTestResult(results);
      setTesting(false);
      
      const success = results.proxy.success || results.direct.success;
      if (success) {
        onKeyUpdate(tempKey.trim());
        setTimeout(() => {
          setShowConfig(false);
          setTestResult(null);
        }, 3000);
      }
    }
  };

  const handleToggleProxy = (checked) => {
    setUseProxy(checked);
    aiService.setUseProxy(checked);
  };

  const handleRemoveKey = () => {
    aiService.setApiKey('');
    setTempKey('');
    setTestResult(null);
    onKeyUpdate('');
  };

  const handleTestConnection = async () => {
    setTesting(true);
    const results = await aiService.testAIConnection();
    setTestResult(results);
    setTesting(false);
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
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
              {aiService.useProxy ? 'Proxy Mode' : 'Direct Mode'}
            </span>
          </div>
          <button
            onClick={() => setShowConfig(true)}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            {aiService.isEnabled() ? 'AI Settings' : 'Configure AI'}
          </button>
        </div>
        {!aiService.isEnabled() && (
          <p className="text-xs text-blue-600 mt-1">
            AI features work via server proxy or with your Hugging Face API key for enhanced personalization
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        🤖 AI Configuration
      </h4>
      
      <div className="space-y-3">
        <div>
          <label className="flex items-center gap-2 text-sm text-blue-700">
            <input
              type="checkbox"
              checked={useProxy}
              onChange={(e) => handleToggleProxy(e.target.checked)}
              className="rounded"
            />
            Use server proxy (recommended for reliability)
          </label>
          <p className="text-xs text-blue-600 mt-1">
            Server proxy provides better reliability, CORS handling, and consistent AI responses
          </p>
        </div>

        {!useProxy && (
          <div>
            <label className="block text-xs font-medium text-blue-700 mb-1">
              Hugging Face API Key (for direct AI calls)
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
        )}

        {testResult && (
          <div className="space-y-2">
            {testResult.proxy && (
              <div className={`p-3 rounded text-xs ${
                testResult.proxy.success 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                <div className="font-medium">Proxy Connection:</div>
                <div>{testResult.proxy.message}</div>
                <div className="text-xs opacity-75">Response time: {testResult.proxy.time}ms</div>
              </div>
            )}
            {testResult.direct && (
              <div className={`p-3 rounded text-xs ${
                testResult.direct.success 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                <div className="font-medium">Direct Connection:</div>
                <div>{testResult.direct.message}</div>
                <div className="text-xs opacity-75">Response time: {testResult.direct.time}ms</div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
          >
            {testing ? <Loader className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {testing ? 'Testing AI...' : 'Test AI Connection'}
          </button>

          {!useProxy && (
            <button
              onClick={handleSaveKey}
              disabled={testing || !tempKey.trim()}
              className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Save & Test Key
            </button>
          )}
          
          {aiService.apiKey && (
            <button
              onClick={handleRemoveKey}
              className="px-3 py-2 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
            >
              Remove Key
            </button>
          )}
          
          <button
            onClick={() => {
              setShowConfig(false);
              setTestResult(null);
            }}
            className="px-3 py-2 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
        <strong>Tip:</strong> AI features work even without an API key using intelligent fallbacks. 
        Adding an API key enables personalized, live AI recommendations.
      </div>
    </div>
  );
};

export {
  AIQuestionHelper,
  AIEnhancedRecommendations,
  AIRiskInsights,
  AIProgressTracker,
  ApiKeyConfig
};