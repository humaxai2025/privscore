export const getSecurityLevel = (totalScore, maxScore) => {
  const percentage = Math.round((totalScore / maxScore) * 100);
  
  if (percentage >= 90) {
    return { 
      level: "Security Champion", 
      description: "Excellent security practices! You're well-protected against most threats.",
      color: "green",
      icon: "award",
      recommendations: [
        "Maintain your excellent security habits",
        "Help others improve their security",
        "Stay updated on emerging threats",
        "Consider advanced security certifications"
      ],
      insights: "You're in the top 10% of security-conscious users. Your practices significantly reduce your risk of cyber attacks."
    };
  }
  
  if (percentage >= 70) {
    return { 
      level: "Security Aware", 
      description: "Good foundation with some areas to strengthen for better protection.",
      color: "blue",
      icon: "shield",
      recommendations: [
        "Address remaining security gaps",
        "Automate security processes where possible",
        "Regular security reviews",
        "Advanced threat protection tools"
      ],
      insights: "You have solid security fundamentals but could benefit from addressing a few key vulnerabilities."
    };
  }
  
  if (percentage >= 50) {
    return { 
      level: "Developing Security", 
      description: "You've taken some important steps, but significant vulnerabilities remain.",
      color: "yellow",
      icon: "info",
      recommendations: [
        "Focus on critical vulnerabilities first",
        "Implement basic security tools",
        "Create security habits and routines",
        "Regular password and account reviews"
      ],
      insights: "You're on the right track but need to prioritize the most critical security measures to reduce your risk."
    };
  }
  
  return { 
    level: "At Risk", 
    description: "Your current practices leave you vulnerable to common security threats.",
    color: "red",
    icon: "alert-circle",
    recommendations: [
      "Immediate action required on all fronts",
      "Start with two-factor authentication",
      "Use a password manager",
      "Enable automatic updates",
      "Basic security awareness training"
    ],
    insights: "Your security posture needs immediate attention. Multiple critical vulnerabilities put you at high risk of cyber attacks."
  };
};

export const SECURITY_LEVEL_COLORS = {
  green: {
    text: "text-green-600",
    bg: "bg-green-100",
    border: "border-green-200",
    progress: "bg-green-500"
  },
  blue: {
    text: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
    progress: "bg-blue-500"
  },
  yellow: {
    text: "text-yellow-600",
    bg: "bg-yellow-100",
    border: "border-yellow-200",
    progress: "bg-yellow-500"
  },
  red: {
    text: "text-red-600",
    bg: "bg-red-100",
    border: "border-red-200",
    progress: "bg-red-500"
  }
};

export const PRIORITY_LEVELS = {
  CRITICAL: {
    color: "red",
    bgColor: "bg-red-50",
    textColor: "text-red-800",
    badgeColor: "bg-red-200",
    borderColor: "border-red-500",
    description: "Immediate action required - high security risk"
  },
  HIGH: {
    color: "orange",
    bgColor: "bg-orange-50",
    textColor: "text-orange-800",
    badgeColor: "bg-orange-200",
    borderColor: "border-orange-500",
    description: "Important security improvement needed"
  },
  MEDIUM: {
    color: "blue",
    bgColor: "bg-blue-50",
    textColor: "text-blue-800",
    badgeColor: "bg-blue-200",
    borderColor: "border-blue-500",
    description: "Recommended security enhancement"
  },
  LOW: {
    color: "gray",
    bgColor: "bg-gray-50",
    textColor: "text-gray-800",
    badgeColor: "bg-gray-200",
    borderColor: "border-gray-500",
    description: "Optional security improvement"
  },
  EXCELLENT: {
    color: "green",
    bgColor: "bg-green-50",
    textColor: "text-green-800",
    badgeColor: "bg-green-200",
    borderColor: "border-green-500",
    description: "Excellent security practices - maintain current level"
  },
  MAINTENANCE: {
    color: "purple",
    bgColor: "bg-purple-50",
    textColor: "text-purple-800",
    badgeColor: "bg-purple-200",
    borderColor: "border-purple-500",
    description: "Regular maintenance recommended"
  }
};

export const getRecommendationPriority = (score, maxScore, category) => {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 90) return 'EXCELLENT';
  if (percentage >= 70) return 'MAINTENANCE';
  if (percentage >= 50) return 'MEDIUM';
  if (percentage >= 30) return 'HIGH';
  return 'CRITICAL';
};

export const RISK_LEVELS = {
  EXTREME: {
    color: "red",
    description: "Multiple critical vulnerabilities detected",
    actionRequired: "Immediate comprehensive security overhaul needed",
    threatLevel: "Very High"
  },
  HIGH: {
    color: "orange", 
    description: "Several important security gaps identified",
    actionRequired: "Prompt action needed to address key vulnerabilities",
    threatLevel: "High"
  },
  MODERATE: {
    color: "yellow",
    description: "Some security improvements recommended",
    actionRequired: "Regular security maintenance and improvements",
    threatLevel: "Medium"
  },
  LOW: {
    color: "green",
    description: "Good security posture with minor areas for improvement",
    actionRequired: "Maintain current practices and stay vigilant",
    threatLevel: "Low"
  }
};