// CSP-Safe AI Service that avoids eval() issues
class AIService {
  constructor() {
    this.apiKey = this.getApiKey();
    this.useProxy = true; // Force proxy mode to avoid CSP issues
    this.proxyUrl = '/api/ai-proxy';
    
    // ✅ SIMPLIFIED: Use only reliable, simple models
    this.models = {
      textGeneration: 'gpt2',  // Most reliable, no eval issues
      textGenerationAlt: 'microsoft/DialoGPT-small',
      questionAnswering: 'deepset/roberta-base-squad2'
    };
    
    console.log('🤖 CSP-Safe AI Service initialized:', {
      hasApiKey: !!this.apiKey,
      useProxy: this.useProxy,
      primaryModel: this.models.textGeneration
    });
  }

  getApiKey() {
    try {
      if (typeof window !== 'undefined') {
        if (window.__NEXT_DATA__?.env?.NEXT_PUBLIC_HUGGING_FACE_API_KEY) {
          return window.__NEXT_DATA__.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
        }
        if (window.NEXT_PUBLIC_HUGGING_FACE_API_KEY) {
          return window.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
        }
      }
    } catch (error) {
      console.warn('Browser environment check failed:', error);
    }

    try {
      if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_HUGGING_FACE_API_KEY) {
        return process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
      }
    } catch (error) {
      console.warn('Server environment check failed:', error);
    }

    return '';
  }

  isEnabled() {
    // Always true for proxy mode
    return this.useProxy || (this.apiKey && this.apiKey.length > 0);
  }

  setUseProxy(useProxy) {
    this.useProxy = useProxy;
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  // ✅ SIMPLIFIED: Direct proxy calls only to avoid CSP issues
  async callAIProxy(model, inputs, parameters = {}) {
    try {
      console.log('🔄 Calling AI via proxy (CSP-safe):', { model, inputType: typeof inputs });
      
      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          inputs,
          parameters
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ AI proxy call successful (CSP-safe)');
        return result.data;
      } else {
        console.error('❌ AI proxy call failed:', result);
        throw new Error(result.error || 'Proxy call failed');
      }
    } catch (error) {
      console.error('💥 AI proxy error:', error.message);
      throw error;
    }
  }

  // ✅ FIXED: Much simpler explanation generation to avoid CSP issues
  async generateQuestionExplanation(question) {
    console.log('🤖 Generating CSP-safe AI explanation for:', question.category);
    
    if (!this.isEnabled()) {
      console.log('📋 AI not enabled, using expert explanation');
      return `📋 Expert: ${this.getDetailedFallbackExplanation(question.category)}`;
    }

    try {
      // ✅ SIMPLE: Direct question format to avoid complex processing
      const simplePrompt = `Explain in simple terms why this cybersecurity question is important: "${question.question}". Give a practical reason in 1-2 sentences.`;
      
      console.log('🔄 Sending simple explanation request...');
      
      const result = await this.callAIProxy(
        this.models.textGeneration,
        simplePrompt,
        { 
          max_length: 120,
          temperature: 0.7,
          do_sample: true
        }
      );

      console.log('🔍 Raw AI explanation result:', result);
      
      // ✅ SIMPLE: Basic string processing only
      const explanation = this.extractSimpleExplanation(result, simplePrompt);
      
      if (explanation && explanation.length > 30) {
        console.log('✅ AI explanation extracted:', explanation);
        return `🤖 AI: ${explanation}`;
      } else {
        console.log('⚠️ AI explanation too short, using expert fallback');
        throw new Error('AI explanation insufficient');
      }
      
    } catch (error) {
      console.error('💥 AI explanation failed:', error.message);
      console.log('📋 Using expert fallback explanation');
      return `📋 Expert: ${this.getDetailedFallbackExplanation(question.category)}`;
    }
  }

  // ✅ SIMPLE: Basic string extraction without complex parsing
  extractSimpleExplanation(result, originalPrompt) {
    if (!result) return null;
    
    let text = '';
    
    // Simple extraction
    if (Array.isArray(result) && result[0]) {
      text = result[0].generated_text || result[0].text || result[0];
    } else if (result.generated_text) {
      text = result.generated_text;
    } else if (result.text) {
      text = result.text;
    } else if (typeof result === 'string') {
      text = result;
    }
    
    if (!text || text.length < 20) {
      return null;
    }
    
    console.log('🔍 Extracting from text:', text.substring(0, 100) + '...');
    
    // ✅ SIMPLE: Basic cleaning without complex regex
    let cleaned = text;
    
    // Remove prompt if echoed
    if (cleaned.includes('Explain in simple terms')) {
      const parts = cleaned.split('.');
      cleaned = parts.slice(1).join('.').trim();
    }
    
    // Get first sentence or two
    const sentences = cleaned.split('.').filter(s => s.trim().length > 10);
    let explanation = sentences.slice(0, 2).join('.').trim();
    
    if (explanation && !explanation.endsWith('.')) {
      explanation += '.';
    }
    
    console.log('🎯 Extracted explanation:', explanation);
    
    return explanation.length > 30 && explanation.length < 300 ? explanation : null;
  }

  // ✅ SIMPLIFIED: Advice generation
  async generatePersonalizedAdvice(userProfile, weakAreas, answers) {
    console.log('🤖 Generating CSP-safe AI advice...', { weakAreas });

    if (!this.isEnabled()) {
      console.log('📋 Using expert advice (AI not enabled)');
      const expertAdvice = this.getDetailedFallbackAdvice(weakAreas);
      return expertAdvice.map(advice => `📋 Expert: ${advice}`);
    }

    try {
      // ✅ SIMPLE: Basic prompt format
      const simplePrompt = `Give 3 cybersecurity recommendations for someone with weaknesses in: ${weakAreas.join(', ')}. Be specific and practical.`;
      
      console.log('🔄 Generating AI advice...');
      
      const result = await this.callAIProxy(
        this.models.textGeneration,
        simplePrompt,
        {
          max_length: 300,
          temperature: 0.8,
          do_sample: true
        }
      );

      console.log('✅ AI advice generation successful');
      
      const advice = this.extractSimpleAdvice(result);
      return advice.map(a => `🤖 AI: ${a}`);
      
    } catch (error) {
      console.error('💥 AI advice generation failed:', error);
      console.log('📋 Using expert fallback advice');
      const expertAdvice = this.getDetailedFallbackAdvice(weakAreas);
      return expertAdvice.map(advice => `📋 Expert: ${advice}`);
    }
  }

  // ✅ SIMPLE: Basic advice extraction
  extractSimpleAdvice(result) {
    if (!result) return this.getDetailedFallbackAdvice(['General Security']);
    
    let text = '';
    
    if (Array.isArray(result) && result[0]) {
      text = result[0].generated_text || result[0].text || result[0];
    } else if (result.generated_text) {
      text = result.generated_text;
    } else if (typeof result === 'string') {
      text = result;
    }
    
    if (!text || text.length < 30) {
      return this.getDetailedFallbackAdvice(['General Security']);
    }
    
    // Simple splitting
    const lines = text.split('\n').filter(line => line.trim().length > 20);
    const sentences = text.split('.').filter(s => s.trim().length > 20);
    
    let advice = [];
    
    // Try numbered lines first
    for (const line of lines) {
      if (line.match(/^\s*\d+/) && advice.length < 3) {
        advice.push(line.replace(/^\s*\d+\.\s*/, '').trim());
      }
    }
    
    // Fallback to sentences
    if (advice.length === 0) {
      advice = sentences.slice(0, 3);
    }
    
    // Ensure we have some advice
    if (advice.length === 0) {
      return this.getDetailedFallbackAdvice(['General Security']);
    }
    
    return advice.slice(0, 3);
  }

  // Risk analysis (no CSP issues)
  async analyzeRiskPatterns(answers, questions) {
    const riskPatterns = [];
    let criticalRisks = 0;
    
    answers.forEach((score, index) => {
      if (index < questions.length) {
        const question = questions[index];
        
        if (score === 0) {
          criticalRisks++;
          
          if (question.category === 'Account Security') {
            riskPatterns.push('high_account_risk');
          }
          if (question.category === 'Digital Awareness') {
            riskPatterns.push('social_engineering_vulnerable');
          }
          if (question.category === 'Device Security') {
            riskPatterns.push('device_vulnerability');
          }
        }
      }
    });

    if (criticalRisks >= 3) {
      riskPatterns.push('multiple_critical_vulnerabilities');
    }

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
      patterns: [...new Set(riskPatterns)],
      riskLevel,
      criticalCount: criticalRisks,
      aiGenerated: true
    };
  }

  // Test connection
  async testAIConnection() {
    console.log('🧪 Testing CSP-safe AI connection...');
    
    const testResults = {
      proxy: { success: false, message: '', time: 0 }
    };

    const startTime = Date.now();
    try {
      await this.callAIProxy(this.models.textGeneration, 'Test', { max_length: 20 });
      testResults.proxy = {
        success: true,
        message: '✅ CSP-safe proxy connection working',
        time: Date.now() - startTime
      };
    } catch (error) {
      testResults.proxy = {
        success: false,
        message: `❌ Proxy failed: ${error.message}`,
        time: Date.now() - startTime
      };
    }

    console.log('🧪 CSP-safe test results:', testResults);
    return testResults;
  }

  // Enhanced fallback explanations
  getDetailedFallbackExplanation(category) {
    const explanations = {
      'Account Security': 'Strong passwords and two-factor authentication prevent most account takeovers. Without proper account security, cybercriminals can easily access your personal information, financial accounts, and use your identity for further attacks.',
      
      'Device Security': 'Keeping devices updated and protected prevents malware infections and unauthorized access. Outdated devices with security vulnerabilities are prime targets for cybercriminals who exploit known weaknesses.',
      
      'Digital Awareness': 'Understanding common online scams and phishing techniques helps you avoid becoming a victim. Most successful cyber attacks rely on tricking people rather than technical exploits.',
      
      'Privacy Protection': 'Controlling what information you share online reduces your risk of identity theft and targeted attacks. Too much personal information makes you an easy target for scammers.',
      
      'Data Protection': 'Regular backups protect your important files from ransomware, device failure, and theft. Without backups, you could lose years of irreplaceable photos and documents forever.',
      
      'Mobile & Smart Home': 'Securing connected devices prevents them from being hijacked and used to spy on you or attack other devices on your network. Unsecured smart devices are common entry points for hackers.',
      
      'Personal Data Management': 'Monitoring where your information appears online helps you respond quickly to data breaches and identity theft attempts. Early detection allows you to protect yourself before serious damage occurs.'
    };
    
    return explanations[category] || 'This security practice helps protect you from common cyber threats and keeps your personal information safe from criminals.';
  }

  getDetailedFallbackAdvice(weakAreas) {
    const adviceMap = {
      'Account Security': [
        'Enable two-factor authentication on all important accounts like email, banking, and social media. This prevents 99% of account takeovers even if your password is stolen.',
        'Use a password manager to create unique passwords for every account. Password reuse is one of the biggest security risks that criminals exploit.',
        'Regularly review and remove access for old apps and services you no longer use. This reduces your attack surface and prevents unauthorized access.'
      ],
      'Device Security': [
        'Enable automatic updates on all devices to patch security vulnerabilities as soon as fixes are available. Outdated devices are easy targets for cybercriminals.',
        'Install security software on all devices including phones and tablets. Modern threats target all platforms and need comprehensive protection.',
        'Use a VPN when connecting to public Wi-Fi to prevent others from intercepting your internet traffic and personal information.'
      ],
      'Digital Awareness': [
        'Learn to recognize phishing emails and suspicious messages that try to steal your information. Look for urgent requests, spelling errors, and unexpected attachments.',
        'Verify unexpected communications by contacting organizations directly rather than clicking links or calling numbers in suspicious messages.',
        'Stay informed about current scams and cyber threats so you can recognize new attack methods targeting people in your situation.'
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
}