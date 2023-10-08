import React, { useState } from 'react';
import ToggleButton from './ToggleButton';

const Box = ({ element }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <ToggleButton setIsOpen={setIsOpen} isOpen={isOpen} />
      {isOpen && element}
    </div>
  );
};

export default Box;
