import React from "react";
import "../styles/template2.css";

const ResumeTemplate2 = ({ resumeData }) => {
  const { personalInfo, objective, experience, education, skills } = resumeData;

  return (
    <div className="resume-container template2">
      <header className="header">
        <h1>{personalInfo.fullName}</h1>
        <div className="contact-info">
          <span>{personalInfo.email}</span> | <span>{personalInfo.phone}</span> | <span>{personalInfo.address}</span>
          <br />
          <a href={personalInfo.linkedin}>LinkedIn</a> | <a href={personalInfo.github}>GitHub</a>
        </div>
      </header>

      <div className="content">
        <div className="left">
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
        </div>

        <div className="right">
          <section>
            <h2>Skills</h2>
            <ul>
              {skills?.map((skill, index) => <li key={index}>{skill}</li>)}
            </ul>
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
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate2;
