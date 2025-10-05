import React from "react";
import "../styles/template1.css";

const ResumeTemplate1 = ({ resumeData }) => {
  const { personalInfo, objective, experience, education, skills } = resumeData;

  return (
    <div className="resume-container template1">
      <aside className="sidebar">
        <h1>{personalInfo.fullName}</h1>
        <p>{personalInfo.email}</p>
        <p>{personalInfo.phone}</p>
        <p>{personalInfo.address}</p>
        <p><a href={personalInfo.linkedin}>LinkedIn</a></p>
        <p><a href={personalInfo.github}>GitHub</a></p>

        <h2>Skills</h2>
        <ul>
          {skills?.map((skill, index) => <li key={index}>{skill}</li>)}
        </ul>
      </aside>

      <main className="main-content">
        <section>
          <h2>Objective</h2>
          <p>{objective}</p>
        </section>

        <section>
          <h2>Experience</h2>
          {experience?.map((exp, index) => (
            <div key={index} className="exp-item">
              <h3>{exp.company}</h3>
              <p><b>Role:</b> {exp.role}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>

        <section>
          <h2>Education</h2>
          {education?.map((edu, index) => (
            <div key={index} className="edu-item">
              <h3>{edu.institution}</h3>
              <p>{edu.degree}</p>
              <p>{edu.year}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ResumeTemplate1;
