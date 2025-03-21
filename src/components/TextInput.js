import React from "react";
import { useState } from "react";
const TextInput = ({ text, setText, title, subtitle, placeholder }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#343e4b",
        borderRadius: "4px",
        padding: "5px",
      }}
    >
      <span style={{ width: "30%", textAlign: "left", paddingLeft: "10px" }}>
        {title}
      </span>
      <div
        style={{
          display: "flex",
          width: "65%",
          backgroundColor: "#47505D",
          borderRadius: "5px",
          justifyContent: "space-between",
          padding: "6px",
        }}
      >
        <div style={{ width: "40%" }}>{subtitle}</div>
        <input
          className="no-hover-input"
          style={{ background: "transparent", border: "none", width: "50%" }}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default TextInput;
