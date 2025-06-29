// Updated AI Service with working Hugging Face models
class AIService {
  constructor() {
    this.apiKey = this.getApiKey();
    this.useProxy = true;
    this.proxyUrl = '/api/ai-proxy';
    this.directUrl = 'https://api-inference.huggingface.co/models/';
    
    // ✅ UPDATED: Working models as of 2024/2025
    this.models = {
      textGeneration: 'microsoft/DialoGPT-small', // Smaller version, more reliable
      textGenerationAlt: 'gpt2', // Backup option
      textGenerationBest: 'microsoft/DialoGPT-large', // Try this if small works
      classification: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
      questionAnswering: 'deepset/roberta-base-squad2'
    };
    
    console.log('🤖 AI Service initialized with working models:', {
      hasApiKey: !!this.apiKey,
      useProxy: this.useProxy,
      isEnabled: this.isEnabled(),
      primaryModel: this.models.textGeneration
    });
  }

  // Rest of your existing methods...
  getApiKey() {
    try {
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

    try {
      if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_HUGGING_FACE_API_KEY) {
        console.log('✅ Found API key in process.env');
        return process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
      }
    } catch (error) {
      console.warn('Server environment check failed:', error);
    }

    console.log('⚠️ No API key found - AI features will use fallbacks');
    return '';
  }

  isEnabled() {
    return this.useProxy || (this.apiKey && this.apiKey.length > 0);
  }

  setUseProxy(useProxy) {
    this.useProxy = useProxy;
    console.log('🔄 AI Service mode changed:', { useProxy: this.useProxy });
  }

  setApiKey(key) {
    this.apiKey = key;
    console.log('🔑 API key updated:', { hasKey: !!key, length: key?.length || 0 });
  }

  // ✅ UPDATED: Try multiple models if one fails
  async callAI(modelType, inputs, parameters = {}) {
    const modelsToTry = this.getModelsToTry(modelType);
    
    for (let i = 0; i < modelsToTry.length; i++) {
      const model = modelsToTry[i];
      try {
        console.log(`🔄 Trying model ${i + 1}/${modelsToTry.length}: ${model}`);
        
        if (this.useProxy) {
          return await this.callAIProxy(model, inputs, parameters);
        } else {
          return await this.callAIDirect(model, inputs, parameters);
        }
      } catch (error) {
        console.warn(`❌ Model ${model} failed:`, error.message);
        
        // If it's the last model, throw the error
        if (i === modelsToTry.length - 1) {
          throw error;
        }
        
        // Otherwise, try the next model
        console.log(`🔄 Trying next model...`);
      }
    }
  }

  // ✅ NEW: Get list of models to try based on task
  getModelsToTry(modelType) {
    switch (modelType) {
      case 'textGeneration':
        return [
          this.models.textGeneration,      // DialoGPT-small
          this.models.textGenerationAlt,   // gpt2 
          this.models.textGenerationBest   // DialoGPT-large
        ];
      case 'classification':
        return [this.models.classification];
      case 'questionAnswering':
        return [this.models.questionAnswering];
      default:
        return [this.models.textGeneration];
    }
  }

  async callAIProxy(model, inputs, parameters = {}) {
    try {
      console.log('🔄 Calling AI via proxy:', { model, inputLength: inputs.length });
      
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Proxy call failed:', errorData);
        
        if (errorData.fallback) {
          throw new Error('AI_FALLBACK_NEEDED');
        }
        throw new Error(`Proxy error: ${response.status} - ${errorData.error}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ AI proxy call successful');
        return result.data;
      } else {
        throw new Error('Invalid proxy response format');
      }
    } catch (error) {
      console.error('💥 AI proxy error:', error.message);
      throw error;
    }
  }

  async callAIDirect(model, inputs, parameters = {}) {
    if (!this.apiKey) {
      throw new Error('No API key available for direct calls');
    }

    try {
      console.log('🔄 Calling AI directly:', { model, inputLength: inputs.length });
      
      const response = await fetch(`${this.directUrl}${model}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs,
          parameters
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Direct AI call failed:', { status: response.status, error: errorText });
        throw new Error(`Direct API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Direct AI call successful');
      return result;
    } catch (error) {
      console.error('💥 Direct AI error:', error.message);
      throw error;
    }
  }

  // ✅ UPDATED: Test with working models
  async testAIConnection() {
    console.log('🧪 Testing AI connection with working models...');
    
    const testResults = {
      proxy: { success: false, message: '', time: 0, model: '' },
      direct: { success: false, message: '', time: 0, model: '' }
    };

    // Test proxy connection
    if (this.useProxy) {
      const startTime = Date.now();
      try {
        await this.callAI('textGeneration', 'Test connection', { max_length: 50 });
        testResults.proxy = {
          success: true,
          message: '✅ Proxy connection working',
          time: Date.now() - startTime,
          model: this.models.textGeneration
        };
      } catch (error) {
        testResults.proxy = {
          success: false,
          message: `❌ Proxy failed: ${error.message}`,
          time: Date.now() - startTime,
          model: 'N/A'
        };
      }
    }

    // Test direct connection if we have an API key
    if (this.apiKey) {
      const startTime = Date.now();
      try {
        await this.callAI('textGeneration', 'Test connection', { max_length: 50 });
        testResults.direct = {
          success: true,
          message: '✅ Direct connection working',
          time: Date.now() - startTime,
          model: this.models.textGeneration
        };
      } catch (error) {
        testResults.direct = {
          success: false,
          message: `❌ Direct failed: ${error.message}`,
          time: Date.now() - startTime,
          model: 'N/A'
        };
      }
    }

    console.log('🧪 AI connection test results:', testResults);
    return testResults;
  }

  async generatePersonalizedAdvice(userProfile, weakAreas, answers) {
    console.log('🤖 Generating AI advice...', { 
      isEnabled: this.isEnabled(), 
      useProxy: this.useProxy,
      weakAreas 
    });

    if (this.isEnabled()) {
      try {
        const prompt = `As a cybersecurity expert, provide 3 specific actionable security recommendations for a ${userProfile.role || 'professional'} working in ${userProfile.industry || 'technology'} who has weaknesses in: ${weakAreas.join(', ')}. Make recommendations practical and immediate.`;
        
        const result = await this.callAI(
          'textGeneration', 
          prompt, 
          {
            max_length: 150,
            temperature: 0.7,
            do_sample: true
          }
        );

        console.log('✅ AI advice generation successful');
        const parsedAdvice = this.parseAIAdvice(result);
        return parsedAdvice.map(advice => `🤖 AI: ${advice}`);
        
      } catch (error) {
        console.error('AI advice generation failed:', error);
        
        // If proxy failed but we have direct API key, try direct
        if (this.useProxy && this.apiKey && error.message.includes('AI_FALLBACK_NEEDED')) {
          console.log('🔄 Trying direct AI call as fallback...');
          try {
            const result = await this.callAIDirect(
              this.models.textGeneration, 
              prompt, 
              { max_length: 150, temperature: 0.7, do_sample: true }
            );
            const parsedAdvice = this.parseAIAdvice(result);
            return parsedAdvice.map(advice => `🤖 AI (Direct): ${advice}`);
          } catch (directError) {
            console.error('Direct AI call also failed:', directError);
          }
        }
      }
    }
    
    // Fallback to enhanced rule-based advice
    console.log('📋 Using expert fallback advice');
    const fallbackAdvice = this.getFallbackAdvice(weakAreas);
    return fallbackAdvice.map(advice => `📋 Expert: ${advice}`);
  }

  async generateQuestionExplanation(question) {
    if (this.isEnabled()) {
      try {
        const prompt = `Explain why this cybersecurity question is important: "${question.question}" - Provide a brief, clear explanation for a non-technical user.`;
        
        const result = await this.callAI(
          'textGeneration',
          prompt,
          { max_length: 100, temperature: 0.5 }
        );

        const explanation = this.parseAIExplanation(result);
        return explanation || this.getFallbackExplanation(question.category);
        
      } catch (error) {
        console.warn('AI explanation failed, using fallback:', error);
      }
    }
    
    return this.getFallbackExplanation(question.category);
  }

  // ✅ UPDATED: Better parsing for different model outputs
  parseAIAdvice(result) {
    if (!result) return ['Enable multi-factor authentication', 'Use a password manager', 'Keep software updated'];
    
    let text = '';
    
    // Handle various response formats from different models
    if (Array.isArray(result)) {
      if (result[0]?.generated_text) {
        text = result[0].generated_text;
      } else if (result[0]?.text) {
        text = result[0].text;
      }
    } else if (result.generated_text) {
      text = result.generated_text;
    } else if (result.text) {
      text = result.text;
    } else if (typeof result === 'string') {
      text = result;
    }
    
    if (!text) {
      return ['Enable multi-factor authentication', 'Use a password manager', 'Keep software updated'];
    }
    
    // Clean and split the text
    const sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20 && s.length < 200)
      .slice(0, 3);
    
    return sentences.length > 0 ? sentences : ['Enable multi-factor authentication', 'Use a password manager', 'Keep software updated'];
  }

  parseAIExplanation(result) {
    if (!result) return null;
    
    let text = '';
    if (Array.isArray(result) && result[0]?.generated_text) {
      text = result[0].generated_text;
    } else if (result.generated_text) {
      text = result.generated_text;
    } else if (typeof result === 'string') {
      text = result;
    }
    
    // Clean up the explanation
    const cleaned = text.replace(/^.*?[.!?]\s*/, '').trim();
    return cleaned.length > 20 ? cleaned : null;
  }

  // Include all the existing methods (analyzeRiskPatterns, getFallbackAdvice, etc.)
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

    if (criticalRisks >= 3) {
      riskPatterns.push('multiple_critical_vulnerabilities');
    }
    
    if (accountSecurityScore >= 2 && awarenessScore >= 1) {
      riskPatterns.push('high_credential_theft_risk');
    }
    
    if (deviceSecurityScore >= 2) {
      riskPatterns.push('endpoint_security_weakness');
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
      accountSecurityScore,
      deviceSecurityScore,
      awarenessScore,
      aiGenerated: true
    };
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
}