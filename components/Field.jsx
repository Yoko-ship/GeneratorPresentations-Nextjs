import React from "react";

function Field({ label, type, ...props }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type={type}required {...props} />
    </div>
  );
}

export default Field;
