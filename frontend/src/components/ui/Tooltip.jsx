import React, { useState } from 'react';

const POSITIONS = {
  top: 'bottom-full mb-2',
  bottom: 'top-full mt-2',
  left: 'right-full mr-2',
  right: 'left-full ml-2',
};

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const positionClass = POSITIONS[position] || POSITIONS.top;

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={`
            absolute z-50 px-2 py-1 text-sm text-white 
            bg-gray-900 rounded shadow-lg 
            whitespace-nowrap animate-fade-in
            ${positionClass} ${className}
          `}
          role="tooltip"
        >
          {content}
          <div 
            className={`
              absolute w-2 h-2 bg-gray-900 transform rotate-45
              ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
              ${position === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip; 