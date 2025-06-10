import React, { useState, useId } from "react";
import './Switch.css';

const Switch = () => {
  const [checked, setChecked] = useState(false);
  const id = useId(); // Generates a unique id per component instance

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <>
      <input
        className="react-switch-checkbox"
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      <label
        className="react-switch-label"
        htmlFor={id}
      >
        <span className="react-switch-button" />
      </label>
    </>
  );
};

export default Switch;
