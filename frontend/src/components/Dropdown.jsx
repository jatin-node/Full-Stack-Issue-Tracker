import React, { useState } from 'react';
import './Dropdown.css'; // Import the CSS file for styling

const DropdownItem = ({ option, onClick }) => (
  <div className="dropdown-item" onClick={() => onClick(option)}>
    {option}
  </div>
);

const Dropdown = ({ message, options, onChange, disabled, customClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(message);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option) => {
    if (!disabled) {
      setSelectedOption(option);
      setIsOpen(false);
      onChange(option);
    }
  };

  return (
    <div className={`dropdown ${disabled ? 'disabled' : ''} ${customClass}`}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        {selectedOption}
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      {isOpen && !disabled && (
        <div className="dropdown-list">
          {options.map((option, index) => (
            <DropdownItem key={index} option={option} onClick={handleOptionClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
