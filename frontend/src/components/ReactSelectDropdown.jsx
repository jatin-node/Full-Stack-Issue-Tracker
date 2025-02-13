import React from 'react';
import Select from 'react-select';

const ReactSelectDropdown = ({ options, onChange, placeholder, value }) => {
  return (
    <Select
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      className="w-full"
    />
  );
};

export default ReactSelectDropdown;
