export const calculateCategoryScores = (answers, securityQuestions) => {
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

export const getWeakestCategories = (categoryScores) => {
  return Object.entries(categoryScores)
    .sort((a, b) => a[1].percentage - b[1].percentage)
    .slice(0, 3)
    .map(([category, scores]) => ({ 
      category, 
      percentage: scores.percentage 
    }));
};

export const getRecommendations = (weakCategories) => {
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