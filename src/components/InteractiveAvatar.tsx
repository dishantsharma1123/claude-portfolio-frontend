import { useState } from 'react';

export const InteractiveAvatar = ({ className = "" }: { className?: string }) => {
  const [isClicking, setIsClicking] = useState(false);

  const handleClick = () => {
    if (isClicking) return; 
    
    setIsClicking(true);
    // Matches the 200ms deep squeeze animation we set in Tailwind
    setTimeout(() => {
      setIsClicking(false);
    }, 200); 
  };

  return (
    <div 
      onClick={handleClick} 
      className={`cursor-pointer inline-flex items-center justify-center shrink-0 origin-center transition-transform ${isClicking ? 'animate-claude-click' : ''} ${className}`}
    >
      <img 
        src="/logo.png" 
        alt="Claude Avatar" 
        className="w-8 h-8 object-contain" 
      />
    </div>
  );
};