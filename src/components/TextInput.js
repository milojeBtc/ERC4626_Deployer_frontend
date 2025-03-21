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
        width: "100%",
        padding: "6px",
      }}
    >
      <span style={{ width: "180px", textAlign: "left", paddingLeft: "10px" }}>
        {title}
      </span>
      <div
        style={{
          display: "flex",
          padding: "10px",
          backgroundColor: "#47505D",
          gap: "10px",
          borderRadius: "5px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "120px" }}>{subtitle}</div>
        <input
          className="no-hover-input"
          style={{ background: "transparent", border: "none" }}
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
