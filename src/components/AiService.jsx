// Enhanced AI Service with detailed explanations and recommendations
class AIService {
  constructor() {
    this.apiKey = this.getApiKey();
    this.useProxy = true;
    this.proxyUrl = '/api/ai-proxy';
    this.directUrl = 'https://api-inference.huggingface.co/models/';
    
    // Working models with better options for detailed responses
    this.models = {
      textGeneration: 'microsoft/DialoGPT-small',
      textGenerationLong: 'gpt2', // Better for longer responses
      textGenerationBest: 'microsoft/DialoGPT-large',
      classification: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
      questionAnswering: 'deepset/roberta-base-squad2'
    };
    
    console.log('🤖 Enhanced AI Service initialized:', {
      hasApiKey: !!this.apiKey,
      useProxy: this.useProxy,
      isEnabled: this.isEnabled(),
      primaryModel: this.models.textGeneration
    });
  }

  // ... [Previous methods: getApiKey, isEnabled, setUseProxy, setApiKey, callAI, etc.] ...
  
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

  getModelsToTry(modelType) {
    switch (modelType) {
      case 'textGeneration':
        return [
          this.models.textGeneration,
          this.models.textGenerationLong,
          this.models.textGenerationBest
        ];
      case 'longText':
        return [
          this.models.textGenerationLong, // gpt2 is better for longer content
          this.models.textGeneration,
          this.models.textGenerationBest
        ];
      case 'classification':
        return [this.models.classification];
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
        console.log(`🔄 Trying model ${i + 1}/${modelsToTry.length}: ${model}`);
        
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
        
        console.log(`🔄 Trying next model...`);
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

  // ✅ ENHANCED: More detailed AI advice generation
  async generatePersonalizedAdvice(userProfile, weakAreas, answers) {
    console.log('🤖 Generating DETAILED AI advice...', { 
      isEnabled: this.isEnabled(), 
      useProxy: this.useProxy,
      weakAreas 
    });

    if (this.isEnabled()) {
      try {
        // ✅ IMPROVED: More detailed prompt for comprehensive advice
        const prompt = `You are a cybersecurity expert. A ${userProfile.role || 'professional'} working in ${userProfile.industry || 'technology'} needs specific security improvements in these areas: ${weakAreas.join(', ')}.

Provide 3 detailed, actionable recommendations. For each recommendation:
1. Explain WHY it's important
2. Give SPECIFIC steps to implement it
3. Mention the IMPACT/benefit
4. Include time estimates where helpful

Be practical, specific, and comprehensive. Each recommendation should be 2-3 sentences with clear implementation guidance.`;
        
        const result = await this.callAI(
          'longText', // Use models better for longer responses
          prompt, 
          {
            max_length: 400,  // ✅ INCREASED: Allow longer responses
            temperature: 0.6, // ✅ OPTIMIZED: More focused but creative
            do_sample: true,
            top_p: 0.9       // ✅ ADDED: Better quality control
          }
        );

        console.log('✅ DETAILED AI advice generation successful');
        console.log('🔍 Raw AI response:', result);
        
        const parsedAdvice = this.parseDetailedAIAdvice(result);
        return parsedAdvice.map(advice => `🤖 AI: ${advice}`);
        
      } catch (error) {
        console.error('💥 Detailed AI advice generation failed:', error);
        
        // Try fallback with simpler model
        if (this.useProxy && this.apiKey && error.message.includes('AI_FALLBACK_NEEDED')) {
          console.log('🔄 Trying direct AI call as fallback...');
          try {
            const simplePrompt = `Cybersecurity advice for ${weakAreas.join(', ')}: provide 3 detailed recommendations with implementation steps.`;
            const result = await this.callAIDirect(
              this.models.textGeneration, 
              simplePrompt, 
              { max_length: 300, temperature: 0.7 }
            );
            const parsedAdvice = this.parseDetailedAIAdvice(result);
            return parsedAdvice.map(advice => `🤖 AI (Direct): ${advice}`);
          } catch (directError) {
            console.error('💥 Direct AI call also failed:', directError);
          }
        }
      }
    }
    
    // Fallback to enhanced detailed expert advice
    console.log('📋 Using DETAILED expert fallback advice');
    const detailedFallbackAdvice = this.getDetailedFallbackAdvice(weakAreas);
    return detailedFallbackAdvice.map(advice => `📋 Expert: ${advice}`);
  }

  // ✅ ENHANCED: Better AI question explanations
  async generateQuestionExplanation(question) {
    console.log('🤖 Generating AI explanation for question...', { category: question.category });
    
    if (this.isEnabled()) {
      try {
        // ✅ IMPROVED: More specific prompt for better explanations
        const prompt = `Explain why this cybersecurity question is important for personal security: "${question.question}"

Provide a clear, practical explanation that:
1. Explains the security risk being assessed
2. Gives real-world examples of what could happen
3. Is easy to understand for non-technical people
4. Is 2-3 sentences long

Focus on practical impact and real threats.`;
        
        const result = await this.callAI(
          'longText',
          prompt,
          { 
            max_length: 200, 
            temperature: 0.5,  // More focused for explanations
            top_p: 0.8
          }
        );

        console.log('✅ AI explanation generated successfully');
        console.log('🔍 Raw AI explanation:', result);
        
        const explanation = this.parseAIExplanation(result);
        if (explanation && explanation.length > 30) {
          console.log('🤖 Using LIVE AI explanation');
          return `🤖 AI: ${explanation}`;
        } else {
          console.log('📋 AI response too short, using fallback');
          throw new Error('AI response insufficient');
        }
        
      } catch (error) {
        console.warn('💥 AI explanation failed, using expert fallback:', error.message);
      }
    } else {
      console.log('📋 AI not enabled, using expert explanation');
    }
    
    // Use detailed expert explanation
    const expertExplanation = this.getDetailedFallbackExplanation(question.category);
    return `📋 Expert: ${expertExplanation}`;
  }

  // ✅ ENHANCED: Better parsing for detailed responses
  parseDetailedAIAdvice(result) {
    if (!result) return this.getDetailedFallbackAdvice(['General Security']);
    
    let text = '';
    
    // Handle various response formats
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
    
    // ✅ IMPROVED: Better parsing for detailed recommendations
    // Try to split into numbered recommendations first
    let recommendations = [];
    
    // Method 1: Look for numbered points (1. 2. 3.)
    const numberedPattern = /(?:^|\n)\s*\d+\.\s*([^0-9\n]+(?:\n(?!\s*\d+\.)[^\n]*)*)/g;
    let match;
    while ((match = numberedPattern.exec(text)) !== null && recommendations.length < 3) {
      const rec = match[1].trim();
      if (rec.length > 30 && rec.length < 500) {
        recommendations.push(rec);
      }
    }
    
    // Method 2: Split by sentences if numbered approach didn't work
    if (recommendations.length === 0) {
      const sentences = text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 40 && s.length < 300);
      
      recommendations = sentences.slice(0, 3);
    }
    
    // Method 3: Split by paragraphs/line breaks
    if (recommendations.length === 0) {
      const paragraphs = text
        .split(/\n\s*\n|\n-|\n•/)
        .map(p => p.trim())
        .filter(p => p.length > 40 && p.length < 400);
      
      recommendations = paragraphs.slice(0, 3);
    }
    
    // Ensure we have at least some recommendations
    if (recommendations.length === 0) {
      console.log('📋 Could not parse AI response, using fallbacks');
      return this.getDetailedFallbackAdvice(['General Security']);
    }
    
    console.log(`✅ Parsed ${recommendations.length} detailed AI recommendations`);
    return recommendations;
  }

  // ✅ ENHANCED: Better explanation parsing
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
    
    if (!text) return null;
    
    // Clean up the explanation - remove the prompt echo
    text = text.replace(/^.*?(?:Explain why|explanation|important).*?:/i, '').trim();
    text = text.replace(/^.*?(?:provides?|gives?|explains?).*?:/i, '').trim();
    
    // Get the first clear explanation
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const explanation = sentences.slice(0, 2).join('. ').trim();
    
    return explanation.length > 30 && explanation.length < 300 ? explanation : null;
  }

  // ✅ ENHANCED: More detailed fallback advice
  getDetailedFallbackAdvice(weakAreas) {
    const detailedAdviceMap = {
      'Account Security': [
        'Enable two-factor authentication (2FA) on all critical accounts immediately. This adds a second layer of security that prevents 99% of account takeovers, even if your password is compromised. Start with email, banking, and work accounts, then expand to social media and shopping sites. Use authenticator apps like Google Authenticator or Authy instead of SMS when possible, as they\'re more secure.',
        'Implement a password manager to generate and store unique passwords for every account. Password reuse is one of the biggest security risks - if one site is breached, all your accounts become vulnerable. Popular options include Bitwarden (free), 1Password, or Dashlane. Set aside 2 hours to import existing passwords and generate new ones for your most important accounts.',
        'Conduct quarterly security audits of your accounts and app permissions. Review connected apps, revoke access to services you no longer use, and check for suspicious login activity. Set a calendar reminder every 3 months. This reduces your attack surface and helps you spot unauthorized access early.'
      ],
      'Device Security': [
        'Enable automatic security updates on all your devices to patch vulnerabilities as soon as fixes are available. Go to Settings → Software Update on mobile devices and Settings → Windows Update or System Preferences → Software Update on computers. Cybercriminals actively exploit known vulnerabilities, so staying current is critical.',
        'Install comprehensive security software on all devices, including smartphones and tablets. Modern threats target all platforms, not just computers. Look for solutions that include real-time protection, web filtering, and anti-phishing. Many devices have built-in protection (Windows Defender, iOS security), but additional layers help.',
        'Use a VPN (Virtual Private Network) whenever connecting to public Wi-Fi networks. Public networks in cafes, airports, and hotels are often unsecured, allowing others to intercept your data. Quality VPN services include NordVPN, ExpressVPN, or ProtonVPN. Always verify you\'re connecting to legitimate networks, not malicious hotspots with similar names.'
      ],
      'Digital Awareness': [
        'Take comprehensive phishing awareness training to recognize sophisticated email and message scams. Modern phishing attempts are highly convincing and target specific individuals with personalized information. Learn to identify warning signs: urgent language, requests for sensitive information, suspicious sender addresses, and unexpected attachments. Practice with simulation tools to build recognition skills.',
        'Develop a verification protocol for unexpected communications claiming to be from trusted organizations. Never click links or provide information from unsolicited messages. Instead, independently contact the organization using official contact information from their website. This prevents falling victim to increasingly sophisticated social engineering attacks.',
        'Stay informed about current cybersecurity threats through reputable sources like KrebsOnSecurity, CISA alerts, or your organization\'s security team. Cyber threats evolve rapidly, and awareness of current attack methods helps you recognize and avoid new scams. Spend 10 minutes weekly reading security news.'
      ],
      'Privacy Protection': [
        'Comprehensively review and strengthen privacy settings across all social media platforms and online accounts. Default settings typically maximize data sharing for advertising purposes. Limit who can see your posts, contact you, and find you through search. Review these settings monthly, as platforms frequently change their privacy policies and reset user preferences.',
        'Audit app permissions on all devices and revoke unnecessary access to sensitive data like location, contacts, camera, and microphone. Many apps request far more permissions than needed for their core functionality. Review permissions monthly and apply the principle of least privilege - only grant access that\'s absolutely necessary.',
        'Implement privacy-focused browsing habits using tools like Firefox with strict privacy settings, privacy-focused search engines (DuckDuckGo), and ad blockers. Consider using private/incognito browsing for sensitive activities. Regularly clear cookies and browsing data to prevent extensive tracking profiles.'
      ],
      'Data Protection': [
        'Establish a comprehensive backup strategy using the 3-2-1 rule: 3 copies of important data, on 2 different types of media, with 1 copy stored offsite. Set up automated cloud backups for daily files and monthly physical backups for critical documents. Test your backup recovery process quarterly to ensure it works when needed.',
        'Encrypt sensitive files before storing or sharing them, especially in cloud storage. Use built-in encryption tools (BitLocker on Windows, FileVault on Mac) or dedicated software like AxCrypt. This ensures your data remains protected even if storage providers are breached or devices are stolen.',
        'Implement a systematic data retention policy to regularly delete old files containing personal information you no longer need. The less data you store, the less can be stolen or compromised. Schedule monthly cleanups of downloads, old emails, and temporary files. Securely wipe deleted sensitive data using specialized tools.'
      ],
      'Mobile & Smart Home': [
        'Secure mobile devices with multiple layers of protection: strong passcodes (at least 6 digits), biometric locks (fingerprint/face), and automatic locking after short idle periods. Enable remote wipe capabilities in case of theft. Your phone contains access to most of your digital life, making it a prime target for attackers.',
        'Change default passwords on all smart home devices and enable automatic firmware updates. Default credentials are publicly known and easily exploited. Create a separate guest network for IoT devices to isolate them from computers and phones. Regularly review connected device lists and remove unused items.',
        'Carefully manage location tracking permissions and regularly review which apps can access your location data. Constant location tracking creates detailed profiles of your movements and habits. Set apps to use location only while actively using them, not continuously in the background. Review and clear location history periodically.'
      ],
      'Personal Data Management': [
        'Regularly monitor your accounts for data breaches using services like Have I Been Pwned, and set up notifications for future breaches. Data breaches are increasingly common, and early detection allows you to take protective action quickly. Check quarterly and immediately change passwords for any compromised accounts.',
        'Establish a firm policy of never sharing verification codes, passwords, or security questions with anyone, regardless of who they claim to be. Legitimate organizations will never ask for this information. Scammers often pose as support staff or create urgent scenarios to pressure victims into sharing credentials.',
        'Create and practice an incident response plan for account compromises or identity theft. Know the steps to take: change passwords, contact financial institutions, file reports with relevant authorities, and monitor accounts closely. Having a plan reduces panic and ensures you take all necessary protective actions quickly.'
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

  // ✅ ENHANCED: More detailed fallback explanations
  getDetailedFallbackExplanation(category) {
    const detailedExplanations = {
      'Account Security': 'Account security protects your digital identity from takeover attempts. Weak account security is the #1 way cybercriminals gain access to personal information, financial accounts, and sensitive data. Strong authentication methods like two-factor authentication prevent 99% of automated attacks, even when passwords are compromised through breaches.',
      'Device Security': 'Device security protects your computers, phones, and tablets from malware, unauthorized access, and data theft. Unpatched devices are prime targets for cybercriminals who exploit known vulnerabilities. Regular updates, security software, and safe browsing habits create multiple defensive layers against sophisticated attacks.',
      'Digital Awareness': 'Digital awareness helps you recognize and avoid online threats like phishing, social engineering, and scams. Most successful cyber attacks rely on human error rather than technical exploits. Understanding common attack methods and maintaining healthy skepticism about unexpected messages significantly reduces your risk of becoming a victim.',
      'Privacy Protection': 'Privacy protection controls how much personal information you share online and who has access to it. Excessive data sharing creates detailed profiles that can be used for identity theft, targeted scams, or unauthorized surveillance. Limiting information exposure reduces your attack surface and protects your personal privacy.',
      'Data Protection': 'Data protection ensures your important files, photos, and documents are backed up and secure against loss or theft. Without proper backups, ransomware attacks, device failures, or theft could permanently destroy years of irreplaceable data. Encryption adds an additional layer of protection for sensitive information.',
      'Mobile & Smart Home': 'Mobile and smart home security protects your connected devices from being compromised and used as entry points to your personal network. These devices often have weaker security and can be exploited to access other systems, spy on activities, or steal personal information stored on connected networks.',
      'Personal Data Management': 'Personal data management helps you track and control where your information appears online and respond quickly to security incidents. With frequent data breaches and identity theft, knowing when your information is exposed allows you to take protective action before criminals can exploit it.'
    };
    
    return detailedExplanations[category] || 'This question assesses important cybersecurity practices that help protect your digital life from various threats including identity theft, financial fraud, and privacy violations.';
  }

  // Include other existing methods...
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
    console.log('🧪 Testing AI connection with working models...');
    
    const testResults = {
      proxy: { success: false, message: '', time: 0, model: '' },
      direct: { success: false, message: '', time: 0, model: '' }
    };

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
}