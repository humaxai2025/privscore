import React from 'react';

export default function RadarChart({ categoryScores }) {
  if (!categoryScores || Object.keys(categoryScores).length === 0) {
    return <div className="text-center text-gray-500">Complete the assessment to see your results</div>;
  }
  
  const categories = Object.keys(categoryScores);
  
  const calculatePoint = (percentage, index, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const radius = (percentage / 100) * 80;
    const x = 100 + radius * Math.cos(angle);
    const y = 100 + radius * Math.sin(angle);
    return { x, y };
  };
  
  const generatePath = () => {
    const points = categories.map((category, i) => {
      const { percentage } = categoryScores[category];
      return calculatePoint(percentage, i, categories.length);
    });
    
    return `M${points[0].x},${points[0].y} ${points.map((p, i) => `L${p.x},${p.y}`).join(' ')} Z`;
  };
  
  const circles = [25, 50, 75, 100].map(percentage => {
    const radius = (percentage / 100) * 80;
    return (
      <circle 
        key={percentage} 
        cx="100" 
        cy="100" 
        r={radius} 
        fill="none" 
        stroke="#e5e7eb" 
        strokeWidth="1" 
        strokeDasharray={percentage === 100 ? "none" : "2,2"}
      />
    );
  });
  
  const axes = categories.map((category, i) => {
    const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
    const outerPoint = calculatePoint(100, i, categories.length);
    const labelPoint = calculatePoint(115, i, categories.length);
    
    return (
      <g key={i}>
        <line 
          x1="100" 
          y1="100" 
          x2={outerPoint.x} 
          y2={outerPoint.y} 
          stroke="#e5e7eb" 
          strokeWidth="1"
        />
        <text
          x={labelPoint.x}
          y={labelPoint.y}
          fontSize="8"
          textAnchor="middle"
          fill="#6b7280"
        >
          {category}
        </text>
      </g>
    );
  });
  
  const dataPoints = categories.map((category, i) => {
    const { percentage } = categoryScores[category];
    const point = calculatePoint(percentage, i, categories.length);
    
    return (
      <circle 
        key={i}
        cx={point.x} 
        cy={point.y} 
        r="3" 
        fill={
          percentage >= 80 ? '#10b981' : 
          percentage >= 60 ? '#3b82f6' : 
          percentage >= 40 ? '#f59e0b' : 
          '#ef4444'
        }
      />
    );
  });
  
  return (
    <svg width="100%" height="200" viewBox="0 0 200 200" className="radar-chart">
      {circles}
      {axes}
      <path
        d={generatePath()}
        fill="rgba(59, 130, 246, 0.2)"
        stroke="#3b82f6"
        strokeWidth="2"
      />
      {dataPoints}
      <circle cx="100" cy="100" r="2" fill="#6b7280" />
    </svg>
  );
}