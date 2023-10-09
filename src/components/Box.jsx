import React, { useState } from 'react';
import ToggleButton from './ToggleButton';

const Box = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <ToggleButton setIsOpen={setIsOpen} isOpen={isOpen} />
      {isOpen && children}
    </div>
  );
};

export default Box;
