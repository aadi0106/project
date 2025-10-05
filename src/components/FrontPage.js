import React from "react";
import "../styles/styles.css";

const FrontPage = ({ onSelectTemplate }) => {
  return (
    <div className="front-page">
      <h1>Choose Your Resume Template</h1>
      <div className="template-buttons">
        <button onClick={() => onSelectTemplate(1)}>Template1</button>
        <button onClick={() => onSelectTemplate(2)}>Template2</button>
      </div>
    </div>
  );
};

export default FrontPage;
