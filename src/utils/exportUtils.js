export const exportResults = (totalScore, maxScore, securityLevel, recommendations, categoryScores) => {
  const scorePercentage = Math.round((totalScore / maxScore) * 100);
  const currentDate = new Date().toLocaleDateString('en-US');
  
  let exportText = `PrivScore Security Assessment Results\n`;
  exportText += `Generated on: ${currentDate}\n\n`;
  exportText += `=== OVERALL SCORE ===\n`;
  exportText += `Score: ${totalScore}/${maxScore} (${scorePercentage}%)\n`;
  exportText += `Security Level: ${securityLevel.level}\n`;
  exportText += `${securityLevel.description}\n\n`;
  
  exportText += `=== CATEGORY BREAKDOWN ===\n`;
  Object.entries(categoryScores).forEach(([category, scores]) => {
    exportText += `${category}: ${scores.total}/${scores.possible} (${scores.percentage}%)\n`;
  });
  
  exportText += `\n=== TOP RECOMMENDATIONS ===\n`;
  recommendations.forEach((rec, index) => {
    exportText += `${index + 1}. ${rec.action}\n`;
    exportText += `   ${rec.description}\n\n`;
  });
  
  exportText += `=== SECURITY RESOURCES ===\n`;
  exportText += `• Two-Factor Authentication Guide: https://www.cisa.gov/secure-our-world/turn-on-multifactor-authentication\n`;
  exportText += `• Password Security Guide: https://www.nist.gov/cybersecurity/how-do-i-create-good-password\n`;
  exportText += `• Check for Data Breaches: https://haveibeenpwned.com/\n`;
  exportText += `• Phishing Prevention: https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks\n`;
  exportText += `• Password Strength Checker: https://passgaurd.humanxaihome.com/\n`;
  
  // Modal implementation for export
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    font-family: monospace;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 80%;
    max-height: 80%;
    overflow: auto;
    position: relative;
  `;
  
  const textarea = document.createElement('textarea');
  textarea.value = exportText;
  textarea.style.cssText = `
    width: 600px;
    height: 400px;
    font-family: monospace;
    font-size: 12px;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  `;
  textarea.readOnly = true;
  
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  `;
  
  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy to Clipboard';
  copyButton.style.cssText = `
    padding: 8px 16px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  const downloadButton = document.createElement('button');
  downloadButton.textContent = 'Download File';
  downloadButton.style.cssText = `
    padding: 8px 16px;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.cssText = `
    padding: 8px 16px;
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  // Copy functionality
  copyButton.onclick = () => {
    textarea.select();
    document.execCommand('copy');
    copyButton.textContent = 'Copied!';
    setTimeout(() => {
      copyButton.textContent = 'Copy to Clipboard';
    }, 2000);
  };
  
  // Download functionality
  downloadButton.onclick = () => {
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PrivScore_Results_${currentDate.replace(/\//g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Close functionality
  closeButton.onclick = () => {
    document.body.removeChild(modal);
  };
  
  // Assemble modal
  buttonContainer.appendChild(copyButton);
  buttonContainer.appendChild(downloadButton);
  buttonContainer.appendChild(closeButton);
  
  modalContent.appendChild(document.createTextNode('Your PrivScore Results:'));
  modalContent.appendChild(document.createElement('br'));
  modalContent.appendChild(document.createElement('br'));
  modalContent.appendChild(textarea);
  modalContent.appendChild(buttonContainer);
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Auto-select text
  textarea.select();
};