import React from "react";
import "./CustomInput.css";

const CustomInput = ({ label, value, setValue, type = "text" }) => {
  return (
    <div className="custom-input">
      <label>{label}</label>
      <input
        style={{ width: "100%" }}
        value={value}
        type={type}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default CustomInput;
