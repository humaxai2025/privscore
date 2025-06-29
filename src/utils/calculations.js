export const calculateCategoryScores = (answers, securityQuestions) => {
  const categories = {};
  
  // Initialize categories
  securityQuestions.forEach(q => {
    if (!categories[q.category]) {
      categories[q.category] = { 
        total: 0, 
        possible: 0, 
        percentage: 0,
        questions: 0,
        averageScore: 0
      };
    }
  });
  
  // Calculate scores for each category
  answers.forEach((score, index) => {
    if (index < securityQuestions.length) {
      const category = securityQuestions[index].category;
      categories[category].total += score;
      categories[category].possible += 10; // Max score per question
      categories[category].questions += 1;
    }
  });
  
  // Calculate percentages and averages
  Object.keys(categories).forEach(cat => {
    if (categories[cat].possible > 0) {
      categories[cat].percentage = Math.round((categories[cat].total / categories[cat].possible) * 100);
      categories[cat].averageScore = categories[cat].questions > 0 
        ? Math.round(categories[cat].total / categories[cat].questions)
        : 0;
    }
  });
  
  return categories;
};

export const getWeakestCategories = (categoryScores) => {
  return Object.entries(categoryScores)
    .sort((a, b) => a[1].percentage - b[1].percentage)
    .slice(0, 3)
    .map(([category, scores]) => ({ 
      category, 
      percentage: scores.percentage,
      total: scores.total,
      possible: scores.possible,
      averageScore: scores.averageScore
    }));
};

export const getStrongestCategories = (categoryScores) => {
  return Object.entries(categoryScores)
    .sort((a, b) => b[1].percentage - a[1].percentage)
    .slice(0, 3)
    .map(([category, scores]) => ({ 
      category, 
      percentage: scores.percentage,
      total: scores.total,
      possible: scores.possible,
      averageScore: scores.averageScore
    }));
};

export const getRecommendations = (answers, securityQuestions) => {
  const specificRecommendations = [];
  const categoryWeaknesses = {};
  
  // Analyze individual answers for specific recommendations
  answers.forEach((score, index) => {
    if (index < securityQuestions.length) {
      const question = securityQuestions[index];
      const category = question.category;
      
      // Track category weaknesses
      if (!categoryWeaknesses[category]) {
        categoryWeaknesses[category] = { count: 0, totalScore: 0, questions: 0 };
      }
      categoryWeaknesses[category].totalScore += score;
      categoryWeaknesses[category].questions += 1;
      if (score < 7) {
        categoryWeaknesses[category].count += 1;
      }
      
      // Specific critical recommendations
      if (score < 7) {
        // Two-factor authentication (Question 1)
        if (index === 0) {
          if (score === 0) {
            specificRecommendations.push({
              priority: "CRITICAL",
              category: "Account Security",
              action: "Set up two-factor authentication immediately",
              description: "You have no 2FA protection. This single step prevents 99% of account takeovers.",
              impact: "Prevents 99% of account takeovers",
              timeToImplement: "15 minutes",
              steps: [
                "Go to accounts.google.com → Security → 2-Step Verification",
                "Add your phone number for verification codes",
                "Repeat for banking, social media, and work accounts",
                "Consider using Google Authenticator app for extra security"
              ]
            });
          } else if (score === 5) {
            specificRecommendations.push({
              priority: "HIGH",
              category: "Account Security",
              action: "Complete two-factor authentication setup",
              description: "You've started but need to add 2FA to ALL important accounts.",
              impact: "Comprehensive account protection",
              timeToImplement: "30 minutes",
              steps: [
                "List all your important accounts (email, banking, social media, work)",
                "Check which ones already have 2FA enabled", 
                "Add 2FA to remaining accounts, starting with banking",
                "Use authenticator apps instead of SMS when possible"
              ]
            });
          }
        }
        
        // Password management (Question 2)
        else if (index === 1) {
          if (score === 0) {
            specificRecommendations.push({
              priority: "CRITICAL",
              category: "Account Security",
              action: "Stop reusing passwords - get a password manager",
              description: "Using the same password everywhere means one breach exposes everything.",
              impact: "Protects all accounts from credential stuffing attacks",
              timeToImplement: "1 hour",
              steps: [
                "Download Bitwarden (free) or 1Password",
                "Import existing passwords from your browser",
                "Generate new unique passwords for email and banking first",
                "Never reuse passwords again"
              ]
            });
          }
        }
        
        // Device updates (Question 7)
        else if (index === 6) {
          if (score <= 3) {
            specificRecommendations.push({
              priority: score === 0 ? "CRITICAL" : "HIGH",
              category: "Device Security",
              action: "Enable automatic updates on all devices",
              description: "Outdated devices are vulnerable to known security exploits.",
              impact: "Protects against known vulnerabilities",
              timeToImplement: "20 minutes",
              steps: [
                "Enable automatic updates on your phone (Settings → Software Update)",
                "Enable automatic updates on Windows (Settings → Update & Security)",
                "Enable automatic updates on Mac (System Preferences → Software Update)",
                "Set apps to auto-update in app stores"
              ]
            });
          }
        }
        
        // Phishing awareness (Question 10)
        else if (index === 9) {
          if (score === 0) {
            specificRecommendations.push({
              priority: "HIGH",
              category: "Digital Awareness",
              action: "Learn to identify phishing attempts",
              description: "You've fallen for scams before. Build recognition skills.",
              impact: "Prevents social engineering attacks",
              timeToImplement: "2 hours learning",
              steps: [
                "Take free phishing awareness training online",
                "Learn warning signs: urgent language, spelling errors, odd sender addresses",
                "Always verify unexpected requests by calling the company directly",
                "Use official websites instead of clicking email links"
              ]
            });
          }
        }
      }
    }
  });
  
  // Add category-based recommendations if no specific ones found
  const categoryScores = calculateCategoryScores(answers, securityQuestions);
  const weakestCategories = getWeakestCategories(categoryScores);
  
  if (specificRecommendations.length < 3) {
    weakestCategories.forEach(catInfo => {
      const category = catInfo.category;
      
      // Only add if we don't already have recommendations for this category
      const hasRecommendation = specificRecommendations.some(rec => rec.category === category);
      if (!hasRecommendation) {
        
        switch(category) {
          case "Account Security":
            specificRecommendations.push({
              priority: catInfo.percentage < 50 ? "HIGH" : "MEDIUM",
              category: "Account Security",
              action: "Strengthen account security practices",
              description: "Multiple account security improvements needed.",
              impact: "Reduces account takeover risk",
              timeToImplement: "1-2 hours",
              steps: [
                "Review and strengthen passwords",
                "Enable 2FA on remaining accounts",
                "Remove unnecessary app permissions"
              ]
            });
            break;
            
          case "Device Security":
            specificRecommendations.push({
              priority: catInfo.percentage < 50 ? "HIGH" : "MEDIUM",
              category: "Device Security",
              action: "Improve device security posture",
              description: "Your devices need better protection against threats.",
              impact: "Prevents malware and unauthorized access",
              timeToImplement: "1 hour",
              steps: [
                "Install security software on all devices",
                "Enable automatic updates",
                "Use VPN for public Wi-Fi"
              ]
            });
            break;
            
          case "Data Protection":
            specificRecommendations.push({
              priority: catInfo.percentage < 50 ? "HIGH" : "MEDIUM",
              category: "Data Protection",
              action: "Create secure backup strategy",
              description: "Protect your important data from loss or ransomware.",
              impact: "Prevents data loss",
              timeToImplement: "2 hours setup",
              steps: [
                "Set up cloud backup for important files",
                "Create local backup to external drive",
                "Test restore process monthly"
              ]
            });
            break;
            
          case "Digital Awareness":
            specificRecommendations.push({
              priority: catInfo.percentage < 50 ? "HIGH" : "MEDIUM",
              category: "Digital Awareness",
              action: "Develop threat recognition skills",
              description: "Improve your ability to spot and avoid online threats.",
              impact: "Prevents social engineering attacks",
              timeToImplement: "2-3 hours learning",
              steps: [
                "Take phishing awareness training",
                "Learn current scam techniques",
                "Practice suspicious email identification"
              ]
            });
            break;
            
          case "Privacy Protection":
            specificRecommendations.push({
              priority: catInfo.percentage < 50 ? "MEDIUM" : "LOW",
              category: "Privacy Protection",
              action: "Enhance privacy controls",
              description: "Better control over your personal information sharing.",
              impact: "Reduces data exposure",
              timeToImplement: "1 hour",
              steps: [
                "Review social media privacy settings",
                "Audit app permissions",
                "Use privacy-focused browser"
              ]
            });
            break;
            
          case "Mobile & Smart Home":
            specificRecommendations.push({
              priority: catInfo.percentage < 50 ? "MEDIUM" : "LOW",
              category: "Mobile & Smart Home",
              action: "Secure mobile and IoT devices",
              description: "Strengthen security for connected devices.",
              impact: "Prevents device compromise",
              timeToImplement: "1 hour",
              steps: [
                "Use strong device lock screens",
                "Change default IoT passwords",
                "Review location tracking settings"
              ]
            });
            break;
            
          case "Personal Data Management":
            specificRecommendations.push({
              priority: catInfo.percentage < 50 ? "MEDIUM" : "LOW",
              category: "Personal Data Management",
              action: "Monitor and manage data exposure",
              description: "Stay informed about your data in breaches.",
              impact: "Early breach detection",
              timeToImplement: "30 minutes",
              steps: [
                "Check Have I Been Pwned regularly",
                "Set up breach notifications",
                "Never share verification codes"
              ]
            });
            break;
            
          default:
            specificRecommendations.push({
              priority: "MEDIUM",
              category: "General Security",
              action: "Create comprehensive security plan",
              description: "Develop a systematic approach to your digital security.",
              impact: "Overall security improvement",
              timeToImplement: "2 hours",
              steps: [
                "Assess current security practices",
                "Prioritize highest-impact improvements",
                "Create security maintenance schedule"
              ]
            });
        }
      }
    });
  }
  
  // Add positive reinforcement for excellent scores
  const totalScore = answers.reduce((sum, score) => sum + score, 0);
  const maxScore = securityQuestions.length * 10;
  const percentage = (totalScore / maxScore) * 100;
  
  if (percentage >= 90 && specificRecommendations.length === 0) {
    specificRecommendations.push({
      priority: "EXCELLENT",
      category: "General Security",
      action: "Maintain your excellent security practices",
      description: "You have outstanding security habits. Keep up the great work!",
      impact: "Sustained high security posture",
      timeToImplement: "Ongoing",
      steps: [
        "Review security settings quarterly",
        "Stay updated on current threats",
        "Help others improve their security",
        "Consider advanced security training"
      ]
    });
  }
  
  return specificRecommendations.slice(0, 3); // Return top 3 recommendations
};

export const calculateRiskScore = (answers, securityQuestions) => {
  let criticalRisks = 0;
  let moderateRisks = 0;
  let lowRisks = 0;
  
  answers.forEach((score, index) => {
    if (index < securityQuestions.length) {
      if (score === 0) criticalRisks++;
      else if (score <= 3) moderateRisks++;
      else if (score <= 6) lowRisks++;
    }
  });
  
  return {
    critical: criticalRisks,
    moderate: moderateRisks,
    low: lowRisks,
    total: criticalRisks + moderateRisks + lowRisks
  };
};

export const getSecurityInsights = (categoryScores, totalScore, maxScore) => {
  const percentage = (totalScore / maxScore) * 100;
  const weakest = getWeakestCategories(categoryScores);
  const strongest = getStrongestCategories(categoryScores);
  
  const insights = [];
  
  // Overall performance insight
  if (percentage >= 90) {
    insights.push("🌟 Exceptional security posture - you're in the top 10% of users!");
  } else if (percentage >= 70) {
    insights.push("✅ Solid security foundation with room for strategic improvements.");
  } else if (percentage >= 50) {
    insights.push("⚠️ Moderate security level - focus on critical gaps first.");
  } else {
    insights.push("🚨 Multiple security vulnerabilities need immediate attention.");
  }
  
  // Category-specific insights
  if (weakest.length > 0) {
    const weakestCategory = weakest[0];
    if (weakestCategory.percentage < 30) {
      insights.push(`🔴 ${weakestCategory.category} is critically weak and needs immediate focus.`);
    } else if (weakestCategory.percentage < 60) {
      insights.push(`🟡 ${weakestCategory.category} shows significant room for improvement.`);
    }
  }
  
  if (strongest.length > 0) {
    const strongestCategory = strongest[0];
    if (strongestCategory.percentage >= 90) {
      insights.push(`🟢 Excellent ${strongestCategory.category} practices - keep it up!`);
    }
  }
  
  // Pattern-based insights
  const accountSecurity = categoryScores['Account Security'];
  const digitalAwareness = categoryScores['Digital Awareness'];
  
  if (accountSecurity && digitalAwareness) {
    if (accountSecurity.percentage < 50 && digitalAwareness.percentage < 50) {
      insights.push("⚠️ Low account security + poor awareness = high risk of credential theft.");
    }
  }
  
  return insights;
};

export const compareToBaselines = (totalScore, maxScore) => {
  const percentage = (totalScore / maxScore) * 100;
  
  const baselines = {
    "General Public": 64,
    "Tech Savvy Users": 78,
    "Security Professionals": 92
  };
  
  const comparisons = Object.entries(baselines).map(([group, baseline]) => ({
    group,
    baseline,
    difference: percentage - baseline,
    betterThan: percentage > baseline
  }));
  
  return {
    userScore: percentage,
    comparisons,
    rank: percentage >= 92 ? "Expert" : 
          percentage >= 78 ? "Advanced" :
          percentage >= 64 ? "Average" : "Beginner"
  };
};