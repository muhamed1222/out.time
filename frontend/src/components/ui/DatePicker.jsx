import React, { useRef } from 'react';

const DatePicker = ({ label, name, value, onChange }) => {
  const inputRef = useRef(null);

  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker();
    }
  };
  
  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="date"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="custom-date-input w-full px-3 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-accent bg-white"
        />
        <div 
          onClick={handleIconClick} 
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
