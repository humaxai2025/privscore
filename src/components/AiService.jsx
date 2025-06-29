// Fixed AI Service with working explanations
class AIService {
  constructor() {
    this.apiKey = this.getApiKey();
    this.useProxy = true;
    this.proxyUrl = '/api/ai-proxy';
    this.directUrl = 'https://api-inference.huggingface.co/models/';
    
    // ✅ FIXED: Better models for explanations
    this.models = {
      textGeneration: 'microsoft/DialoGPT-small',
      textGenerationLong: 'gpt2', // Better for longer content
      explanation: 'facebook/blenderbot-400M-distill', // Better for explanations
      explanationAlt: 'microsoft/DialoGPT-small', // Backup for explanations
      questionAnswering: 'deepset/roberta-base-squad2'
    };
    
    console.log('🤖 AI Service initialized with explanation models:', {
      hasApiKey: !!this.apiKey,
      useProxy: this.useProxy,
      explanationModel: this.models.explanation
    });
  }

  // ... [Previous methods: getApiKey, isEnabled, etc.] ...
  
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

  // ✅ FIXED: Better model selection for different tasks
  getModelsToTry(modelType) {
    switch (modelType) {
      case 'explanation':
        return [
          this.models.explanation,      // BlenderBot for explanations
          this.models.explanationAlt,   // DialoGPT backup
          this.models.textGenerationLong // GPT2 final fallback
        ];
      case 'textGeneration':
        return [
          this.models.textGeneration,
          this.models.textGenerationLong
        ];
      case 'longText':
        return [
          this.models.textGenerationLong,
          this.models.textGeneration
        ];
      case 'questionAnswering':
        return [this.models.questionAnswering];
      default:
        return [this.models.textGeneration];
    }
  }

  async callAI(modelType, inputs, parameters = {}) {
    const modelsToTry = this.getModelsToTry(modelType);
    
    for (let i = 0; i < modelsToTry.length; i++) {
      const model = modelsToTry[i];
      try {
        console.log(`🔄 Trying ${modelType} model ${i + 1}/${modelsToTry.length}: ${model}`);
        
        if (this.useProxy) {
          return await this.callAIProxy(model, inputs, parameters);
        } else {
          return await this.callAIDirect(model, inputs, parameters);
        }
      } catch (error) {
        console.warn(`❌ Model ${model} failed:`, error.message);
        
        if (i === modelsToTry.length - 1) {
          throw error;
        }
        
        console.log(`🔄 Trying next ${modelType} model...`);
      }
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

  // ✅ FIXED: Much more robust AI explanation generation
  async generateQuestionExplanation(question) {
    console.log('🤖 STARTING AI explanation generation for:', question.category);
    
    if (!this.isEnabled()) {
      console.log('📋 AI not enabled, using expert explanation');
      const expertExplanation = this.getDetailedFallbackExplanation(question.category);
      return `📋 Expert: ${expertExplanation}`;
    }

    try {
      // ✅ IMPROVED: Multiple prompt strategies
      const prompts = [
        // Strategy 1: Direct explanation request
        `Why is this cybersecurity question important: "${question.question}"? Explain in 2-3 sentences why this matters for personal security.`,
        
        // Strategy 2: More conversational
        `Explain to a non-technical person why this security question matters: "${question.question}". What could happen if someone doesn't follow this practice?`,
        
        // Strategy 3: Simple format
        `Question: ${question.question}\nExplanation: This question is important because`
      ];

      for (let promptIndex = 0; promptIndex < prompts.length; promptIndex++) {
        const prompt = prompts[promptIndex];
        console.log(`🔄 Trying explanation prompt ${promptIndex + 1}/${prompts.length}`);
        
        try {
          const result = await this.callAI(
            'explanation',
            prompt,
            { 
              max_length: 150,
              temperature: 0.6,
              do_sample: true,
              top_p: 0.9,
              pad_token_id: 50256 // Add padding token
            }
          );

          console.log('🔍 Raw AI explanation response:', result);
          
          const explanation = this.parseAIExplanation(result, prompt);
          
          if (explanation && explanation.length > 50 && explanation.length < 400) {
            console.log('✅ LIVE AI explanation generated successfully!');
            console.log('🎯 Final AI explanation:', explanation);
            return `🤖 AI: ${explanation}`;
          } else {
            console.log(`⚠️ AI explanation too short/long (${explanation?.length || 0} chars), trying next prompt...`);
          }
          
        } catch (promptError) {
          console.warn(`❌ Prompt ${promptIndex + 1} failed:`, promptError.message);
        }
      }
      
      // If all prompts failed, throw error to trigger fallback
      throw new Error('All AI explanation prompts failed');
      
    } catch (error) {
      console.error('💥 AI explanation generation completely failed:', error.message);
      console.log('📋 Using detailed expert fallback explanation');
      
      const expertExplanation = this.getDetailedFallbackExplanation(question.category);
      return `📋 Expert: ${expertExplanation}`;
    }
  }

  // ✅ FIXED: Much better explanation parsing
  parseAIExplanation(result, originalPrompt) {
    if (!result) {
      console.log('❌ No AI result to parse');
      return null;
    }
    
    let text = '';
    
    // Handle different response formats
    if (Array.isArray(result)) {
      if (result[0]?.generated_text) {
        text = result[0].generated_text;
      } else if (result[0]?.text) {
        text = result[0].text;
      } else if (typeof result[0] === 'string') {
        text = result[0];
      }
    } else if (result.generated_text) {
      text = result.generated_text;
    } else if (result.text) {
      text = result.text;
    } else if (typeof result === 'string') {
      text = result;
    }
    
    if (!text || text.length < 20) {
      console.log('❌ AI response too short or empty:', text);
      return null;
    }
    
    console.log('🔍 Parsing AI response text:', text);
    
    // ✅ IMPROVED: Better cleaning of AI responses
    let cleaned = text;
    
    // Remove the original prompt if it's echoed back
    const promptStart = originalPrompt.substring(0, 30);
    if (cleaned.includes(promptStart)) {
      cleaned = cleaned.split(promptStart)[1] || cleaned;
    }
    
    // Remove common prompt patterns
    cleaned = cleaned.replace(/^.*?(?:Why is this|Explain|Question:|important|because|matters?).*?[:?]\s*/i, '');
    cleaned = cleaned.replace(/^.*?(?:This question is important because|This matters because)\s*/i, '');
    cleaned = cleaned.replace(/^.*?(?:Explanation:|Answer:)\s*/i, '');
    
    // Clean up formatting
    cleaned = cleaned.replace(/^\s*[-•]\s*/, ''); // Remove bullet points
    cleaned = cleaned.replace(/^\s*\d+\.\s*/, ''); // Remove numbering
    cleaned = cleaned.trim();
    
    // Get the first 1-2 sentences
    const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 15);
    let explanation = sentences.slice(0, 2).join('. ').trim();
    
    // Ensure it ends with a period
    if (explanation && !explanation.match(/[.!?]$/)) {
      explanation += '.';
    }
    
    console.log('🎯 Cleaned explanation:', explanation);
    console.log('📏 Explanation length:', explanation?.length || 0);
    
    // Quality check
    if (explanation.length > 50 && explanation.length < 400) {
      return explanation;
    } else {
      console.log(`❌ Explanation failed quality check (length: ${explanation.length})`);
      return null;
    }
  }

  // ✅ IMPROVED: Better fallback explanations for comparison
  getDetailedFallbackExplanation(category) {
    const detailedExplanations = {
      'Account Security': 'Strong account security prevents unauthorized access to your personal accounts and data. Two-factor authentication blocks 99% of automated attacks, even when passwords are compromised. Without proper account security, cybercriminals can easily steal your identity, access your finances, and use your accounts for further attacks.',
      
      'Device Security': 'Device security protects your computers and phones from malware and unauthorized access. Outdated devices with security holes are prime targets for cybercriminals who exploit known vulnerabilities. Keeping devices updated and protected prevents data theft, ransomware attacks, and unauthorized surveillance.',
      
      'Digital Awareness': 'Digital awareness helps you recognize and avoid sophisticated online scams and phishing attempts. Most cyber attacks succeed through social engineering rather than technical exploits. Understanding how attackers manipulate people significantly reduces your risk of falling victim to fraud and identity theft.',
      
      'Privacy Protection': 'Privacy protection controls how much personal information you share online and limits your digital footprint. Excessive data sharing creates detailed profiles that criminals use for targeted scams and identity theft. Protecting your privacy reduces the information available for malicious use.',
      
      'Data Protection': 'Data protection ensures your important files and memories are safe from loss, theft, or ransomware. Without proper backups, a single device failure or cyber attack could permanently destroy years of irreplaceable data. Regular backups and encryption provide multiple layers of protection.',
      
      'Mobile & Smart Home': 'Mobile and smart device security prevents these connected devices from becoming entry points for larger attacks. Unsecured devices can be hijacked to spy on your activities, steal personal information, or attack other devices on your network. Proper security isolates and protects your entire digital ecosystem.',
      
      'Personal Data Management': 'Personal data management helps you track where your information appears online and respond quickly to security breaches. With frequent data breaches, knowing when your information is exposed allows you to take protective action before criminals exploit it for fraud or identity theft.'
    };
    
    return detailedExplanations[category] || 'This security practice helps protect you from common cyber threats that could compromise your personal information and digital safety.';
  }

  // ... [Rest of the existing methods: generatePersonalizedAdvice, analyzeRiskPatterns, etc.]
  
  async generatePersonalizedAdvice(userProfile, weakAreas, answers) {
    console.log('🤖 Generating DETAILED AI advice...', { 
      isEnabled: this.isEnabled(), 
      useProxy: this.useProxy,
      weakAreas 
    });

    if (this.isEnabled()) {
      try {
        const prompt = `You are a cybersecurity expert. A ${userProfile.role || 'professional'} working in ${userProfile.industry || 'technology'} needs specific security improvements in these areas: ${weakAreas.join(', ')}.

Provide 3 detailed, actionable recommendations. For each recommendation:
1. Explain WHY it's important
2. Give SPECIFIC steps to implement it
3. Mention the IMPACT/benefit
4. Include time estimates where helpful

Be practical, specific, and comprehensive. Each recommendation should be 2-3 sentences with clear implementation guidance.`;
        
        const result = await this.callAI(
          'longText',
          prompt, 
          {
            max_length: 400,
            temperature: 0.6,
            do_sample: true,
            top_p: 0.9
          }
        );

        console.log('✅ DETAILED AI advice generation successful');
        console.log('🔍 Raw AI response:', result);
        
        const parsedAdvice = this.parseDetailedAIAdvice(result);
        return parsedAdvice.map(advice => `🤖 AI: ${advice}`);
        
      } catch (error) {
        console.error('💥 Detailed AI advice generation failed:', error);
      }
    }
    
    console.log('📋 Using DETAILED expert fallback advice');
    const detailedFallbackAdvice = this.getDetailedFallbackAdvice(weakAreas);
    return detailedFallbackAdvice.map(advice => `📋 Expert: ${advice}`);
  }

  parseDetailedAIAdvice(result) {
    if (!result) return this.getDetailedFallbackAdvice(['General Security']);
    
    let text = '';
    
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
    
    if (!text || text.length < 50) {
      console.log('📋 AI response too short, using detailed fallbacks');
      return this.getDetailedFallbackAdvice(['General Security']);
    }
    
    console.log('🔍 Processing AI response of length:', text.length);
    
    let recommendations = [];
    
    const numberedPattern = /(?:^|\n)\s*\d+\.\s*([^0-9\n]+(?:\n(?!\s*\d+\.)[^\n]*)*)/g;
    let match;
    while ((match = numberedPattern.exec(text)) !== null && recommendations.length < 3) {
      const rec = match[1].trim();
      if (rec.length > 30 && rec.length < 500) {
        recommendations.push(rec);
      }
    }
    
    if (recommendations.length === 0) {
      const sentences = text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 40 && s.length < 300);
      
      recommendations = sentences.slice(0, 3);
    }
    
    if (recommendations.length === 0) {
      const paragraphs = text
        .split(/\n\s*\n|\n-|\n•/)
        .map(p => p.trim())
        .filter(p => p.length > 40 && p.length < 400);
      
      recommendations = paragraphs.slice(0, 3);
    }
    
    if (recommendations.length === 0) {
      console.log('📋 Could not parse AI response, using fallbacks');
      return this.getDetailedFallbackAdvice(['General Security']);
    }
    
    console.log(`✅ Parsed ${recommendations.length} detailed AI recommendations`);
    return recommendations;
  }

  getDetailedFallbackAdvice(weakAreas) {
    const detailedAdviceMap = {
      'Account Security': [
        'Enable two-factor authentication (2FA) on all critical accounts immediately. This adds a second layer of security that prevents 99% of account takeovers, even if your password is compromised. Start with email, banking, and work accounts, then expand to social media and shopping sites.',
        'Implement a password manager to generate and store unique passwords for every account. Password reuse is one of the biggest security risks - if one site is breached, all your accounts become vulnerable. Set aside 2 hours to import existing passwords and generate new ones.',
        'Conduct quarterly security audits of your accounts and app permissions. Review connected apps, revoke access to services you no longer use, and check for suspicious login activity. This reduces your attack surface and helps spot unauthorized access early.'
      ],
      'Device Security': [
        'Enable automatic security updates on all your devices to patch vulnerabilities as soon as fixes are available. Cybercriminals actively exploit known vulnerabilities, so staying current is critical for preventing successful attacks.',
        'Install comprehensive security software on all devices, including smartphones and tablets. Modern threats target all platforms, not just computers. Quality security solutions provide real-time protection against malware and suspicious activities.',
        'Use a VPN when connecting to public Wi-Fi networks in cafes, airports, and hotels. Public networks are often unsecured, allowing others to intercept your data and monitor your online activities.'
      ],
      'Digital Awareness': [
        'Take comprehensive phishing awareness training to recognize sophisticated email and message scams. Modern phishing attempts are highly convincing and use personalized information to appear legitimate. Learning warning signs significantly reduces your risk.',
        'Develop a verification protocol for unexpected communications claiming to be from trusted organizations. Never click links or provide information from unsolicited messages - instead, contact organizations directly using official contact information.',
        'Stay informed about current cybersecurity threats through reputable sources. Cyber threats evolve rapidly, and awareness of current attack methods helps you recognize and avoid new scams targeting people like you.'
      ]
    };

    const advice = [];
    weakAreas.forEach(area => {
      if (detailedAdviceMap[area]) {
        advice.push(...detailedAdviceMap[area]);
      }
    });

    return advice.slice(0, 3);
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

  async testAIConnection() {
    console.log('🧪 Testing AI connection with explanation models...');
    
    const testResults = {
      proxy: { success: false, message: '', time: 0, model: '' },
      direct: { success: false, message: '', time: 0, model: '' }
    };

    if (this.useProxy) {
      const startTime = Date.now();
      try {
        // Test with explanation model
        await this.callAI('explanation', 'Test explanation generation', { max_length: 50 });
        testResults.proxy = {
          success: true,
          message: '✅ Proxy connection working (explanation model tested)',
          time: Date.now() - startTime,
          model: this.models.explanation
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

    if (this.apiKey) {
      const startTime = Date.now();
      try {
        await this.callAI('explanation', 'Test explanation generation', { max_length: 50 });
        testResults.direct = {
          success: true,
          message: '✅ Direct connection working (explanation model tested)',
          time: Date.now() - startTime,
          model: this.models.explanation
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
}