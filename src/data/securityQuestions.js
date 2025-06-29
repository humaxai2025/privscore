export const securityQuestions = [
  // Account Security
  {
    category: "Account Security",
    question: "Do you use two-step verification (where you receive a code on your phone) for important accounts like email and banking?",
    answers: [
      { text: "Yes, for all my important accounts", score: 10, tip: "This extra verification step stops 99% of account hacks, even if someone knows your password." },
      { text: "For some accounts", score: 5, tip: "Start with your email, banking, and social media accounts—they're the most important to protect." },
      { text: "No, I don't use this", score: 0, tip: "This simple step can protect you from most hacking attempts. Look for 'two-factor' or '2FA' in security settings." }
    ]
  },
  {
    category: "Account Security",
    question: "How do you keep track of your passwords?",
    answers: [
      { text: "I use a password manager app", score: 10, tip: "Password managers create and remember strong, unique passwords for all your accounts." },
      { text: "I save them in my browser", score: 7, tip: "Browser password storage is convenient but less secure than dedicated password managers." },
      { text: "I use a pattern I change for each site", score: 3, tip: "Password patterns can be figured out if one of your accounts is hacked." },
      { text: "I use the same password (or a few) everywhere", score: 0, tip: "Using the same password is risky—if one site is hacked, all your accounts are at risk." }
    ]
  },
  {
    category: "Account Security",
    question: "Do you review and remove access for apps and services you no longer use?",
    answers: [
      { text: "Yes, I regularly clean up old accounts and permissions", score: 10, tip: "Removing old access reduces your risk if those services are ever hacked." },
      { text: "Sometimes, when I think about it", score: 5, tip: "Try scheduling a quarterly digital cleanup day on your calendar." },
      { text: "No, I keep everything active", score: 0, tip: "Old, forgotten accounts can be security risks. It's like leaving spare keys around." }
    ]
  },
  
  // Data Protection
  {
    category: "Data Protection",
    question: "Do you protect sensitive information when sending it online?",
    answers: [
      { text: "Yes, I use secure methods (password-protected files, encrypted apps)", score: 10, tip: "Protecting sensitive info is like using an envelope instead of a postcard." },
      { text: "Sometimes, for certain things", score: 5, tip: "Consider using secure messaging apps or password-protected files for sensitive information." },
      { text: "No, I just send things normally", score: 0, tip: "Regular email and texts can be intercepted. Use secure options for private information." }
    ]
  },
  {
    category: "Data Protection",
    question: "Do you keep backups of your important files, photos, and documents?",
    answers: [
      { text: "Yes, in multiple places (like cloud + external drive)", score: 10, tip: "Having backups in different places protects you from device failure, theft, or ransomware." },
      { text: "Yes, but only in one place", score: 5, tip: "Consider adding a second backup location for extra protection." },
      { text: "No, I don't have backups", score: 0, tip: "Without backups, a lost phone or broken computer could mean losing everything forever." }
    ]
  },
  {
    category: "Data Protection",
    question: "How often do you delete old files and data you no longer need?",
    answers: [
      { text: "Regularly, following a system", score: 10, tip: "Regularly removing old data reduces your risk if your accounts are ever hacked." },
      { text: "Occasionally, when I think of it", score: 5, tip: "Set reminders to clean up old files, especially those with personal information." },
      { text: "I keep everything indefinitely", score: 0, tip: "Keeping everything increases your risk—the more data stored, the more can be stolen." }
    ]
  },
  
  // Device Security
  {
    category: "Device Security",
    question: "Do you keep your devices (phone, computer, tablets) updated?",
    answers: [
      { text: "Yes, I update everything promptly", score: 10, tip: "Updates fix security holes that hackers can exploit." },
      { text: "I update eventually, but often delay", score: 7, tip: "Try enabling automatic updates so you don't have to remember." },
      { text: "I update only when I have to", score: 3, tip: "Delaying updates leaves your devices vulnerable to known security problems." },
      { text: "I rarely or never update", score: 0, tip: "Outdated devices are easy targets. Updates are like locks for digital doors." }
    ]
  },
  {
    category: "Device Security",
    question: "When using public Wi-Fi (coffee shops, airports), do you take extra security steps?",
    answers: [
      { text: "Yes, I use a VPN or mobile data instead", score: 10, tip: "Public Wi-Fi is like having a conversation in a crowded room—a VPN creates a private space." },
      { text: "Sometimes I'm careful", score: 5, tip: "Avoid banking or shopping on public Wi-Fi unless you're using a VPN (Virtual Private Network)." },
      { text: "No, I connect normally", score: 0, tip: "Public Wi-Fi can be monitored by others. Use a VPN app or stick to mobile data for sensitive activities." }
    ]
  },
  {
    category: "Device Security",
    question: "Do you have protection against viruses and malware on your devices?",
    answers: [
      { text: "Yes, on all my devices", score: 10, tip: "Security software is your digital immune system against threats." },
      { text: "On some devices", score: 5, tip: "Every connected device needs protection—even smartphones and tablets." },
      { text: "No protection installed", score: 0, tip: "Unprotected devices are easily infected. Many good security options are free or built-in." }
    ]
  },
  
  // Digital Awareness
  {
    category: "Digital Awareness",
    question: "Can you spot fake emails or messages trying to trick you?",
    answers: [
      { text: "Yes, I check carefully before clicking links or attachments", score: 10, tip: "Being skeptical of unexpected messages is your best defense against scams." },
      { text: "Sometimes I'm unsure", score: 5, tip: "When in doubt, contact the company directly using their official website—don't use links in the email." },
      { text: "I've fallen for scams before", score: 0, tip: "Check for misspellings, odd email addresses, and urgent requests—these are warning signs." }
    ]
  },
  {
    category: "Digital Awareness",
    question: "Do you have a plan for what to do if your accounts are hacked?",
    answers: [
      { text: "Yes, I know exactly what steps to take", score: 10, tip: "Having a plan ready helps you respond quickly if something happens." },
      { text: "I have a general idea", score: 5, tip: "Write down the basic steps: change passwords, contact support, check for unauthorized changes." },
      { text: "No plan at all", score: 0, tip: "Create a simple checklist now so you're not panicking if something happens." }
    ]
  },
  {
    category: "Digital Awareness",
    question: "Have you set up alerts for unusual activity on your important accounts?",
    answers: [
      { text: "Yes, I get notifications for logins or changes", score: 10, tip: "Alerts help you catch problems early before serious damage occurs." },
      { text: "On some accounts", score: 5, tip: "Start with email, banking, and shopping accounts—they're common targets." },
      { text: "No alerts set up", score: 0, tip: "Activity alerts are like security cameras for your accounts—they let you know when something's wrong." }
    ]
  },
  
  // Privacy Protection
  {
    category: "Privacy Protection",
    question: "Do you check and adjust privacy settings on your social media and online accounts?",
    answers: [
      { text: "Yes, I review them regularly", score: 10, tip: "Companies often change privacy settings—regular checks help maintain your privacy." },
      { text: "Sometimes I look at them", score: 5, tip: "Set a reminder to check privacy settings every few months, especially after app updates." },
      { text: "I just use default settings", score: 0, tip: "Default settings usually share more of your information than necessary." }
    ]
  },
  {
    category: "Privacy Protection",
    question: "When apps ask for permission to access your camera, location, contacts, etc., what do you do?",
    answers: [
      { text: "I only allow what the app truly needs to function", score: 10, tip: "Being selective about permissions helps protect your personal information." },
      { text: "I sometimes check permissions", score: 5, tip: "Regularly review app permissions in your device settings and remove unnecessary access." },
      { text: "I accept whatever the app asks for", score: 0, tip: "Many apps ask for more access than they need—it's okay to say no." }
    ]
  },
  {
    category: "Privacy Protection",
    question: "How do you handle website cookies and tracking?",
    answers: [
      { text: "I block unnecessary trackers and clear cookies regularly", score: 10, tip: "Controlling cookies helps prevent companies from building detailed profiles about you." },
      { text: "I accept only necessary cookies when possible", score: 7, tip: "Privacy-focused browsers like Firefox or Brave can help manage tracking automatically." },
      { text: "I accept all cookies without thinking about it", score: 0, tip: "Cookies can track your activity across different websites, building a profile of your habits." }
    ]
  },
  
  // Mobile & Smart Home
  {
    category: "Mobile & Smart Home",
    question: "How do you lock your phone or tablet?",
    answers: [
      { text: "With fingerprint/face recognition AND a strong passcode", score: 10, tip: "Your phone contains your digital life—protect it with multiple security layers." },
      { text: "With a simple PIN or pattern", score: 3, tip: "Use at least 6 digits for PINs. Patterns can be guessed by watching you or from screen smudges." },
      { text: "I don't lock my devices", score: 0, tip: "An unlocked phone gives access to your emails, accounts, and personal information." }
    ]
  },
  {
    category: "Mobile & Smart Home",
    question: "For smart home devices (speakers, cameras, TV, doorbell), what security steps do you take?",
    answers: [
      { text: "Changed passwords, regular updates, separate Wi-Fi network", score: 10, tip: "Smart devices can be entry points to your home network—extra protection is important." },
      { text: "Changed the default passwords", score: 5, tip: "Also enable automatic updates and consider creating a guest network just for smart devices." },
      { text: "I use them with default settings", score: 0, tip: "Default passwords are often public knowledge and easily hacked." }
    ]
  },
  {
    category: "Mobile & Smart Home",
    question: "Do you control which apps can track your location?",
    answers: [
      { text: "Yes, I regularly check and limit location tracking", score: 10, tip: "Your location history can reveal sensitive information about your life and habits." },
      { text: "I'm somewhat careful about it", score: 5, tip: "Set apps to use location 'only while using' rather than 'always' when possible." },
      { text: "I've never checked location settings", score: 0, tip: "Many apps track your location even when they don't need to—check your settings." }
    ]
  },
  
  // Personal Data Management
  {
    category: "Personal Data Management",
    question: "Do you check if your email or accounts have been in data breaches?",
    answers: [
      { text: "Yes, I use breach notification services", score: 10, tip: "Services like 'Have I Been Pwned' can alert you if your information appears in known breaches." },
      { text: "I've checked once or twice", score: 5, tip: "Set up alerts for future breaches to stay informed about your exposed data." },
      { text: "Never checked", score: 0, tip: "Data breaches happen frequently—knowing which accounts are affected helps you protect yourself." }
    ]
  },
  {
    category: "Personal Data Management",
    question: "Would you share a verification code sent to your phone if someone asks for it?",
    answers: [
      { text: "Never, under any circumstances", score: 10, tip: "Verification codes should never be shared—they're meant only for you to prove your identity." },
      { text: "I might if it seems legitimate", score: 0, tip: "Even if someone claims to be from your bank or a company you trust, never share verification codes." },
      { text: "Yes, if they explain why they need it", score: 0, tip: "Scammers often pose as support staff to trick you into giving access to your accounts." }
    ]
  }
];