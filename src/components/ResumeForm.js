import React, { useState } from "react";
import "../styles/styles.css";

const ResumeForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    personalInfo: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      github: ""
    },
    summary: "",
    skills: "",
    experience: [],
    education: []
  });

  // --- Handle personal info ---
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  // --- Handle summary & skills ---
  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handle Experience ---
  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...form.experience];
    updated[index][name] = value;
    setForm({ ...form, experience: updated });
  };

  const addExperience = () => {
    setForm({
      ...form,
      experience: [...form.experience, { company: "", role: "", from: "", to: "", description: "" }]
    });
  };

  const removeExperience = (index) => {
    const updated = [...form.experience];
    updated.splice(index, 1);
    setForm({ ...form, experience: updated });
  };

  // --- Handle Education ---
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...form.education];
    updated[index][name] = value;
    setForm({ ...form, education: updated });
  };

  const addEducation = () => {
    setForm({
      ...form,
      education: [...form.education, { institution: "", degree: "", year: "" }]
    });
  };

  const removeEducation = (index) => {
    const updated = [...form.education];
    updated.splice(index, 1);
    setForm({ ...form, education: updated });
  };

  // --- Submit form ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      ...form,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)
    };

    onSubmit(formattedData);
  };

  return (
    <form className="resume-form" onSubmit={handleSubmit}>
      <h2>Editing — Template 1</h2>
      <p style={{ color: "gray" }}>Fill your details below to generate your resume</p>

      <h3>Personal Information</h3>
      <input name="fullName" placeholder="Full Name" onChange={handlePersonalChange} />
      <input name="title" placeholder="Title / Position (e.g. Software Engineer)" onChange={handlePersonalChange} />
      <input name="email" placeholder="Email" onChange={handlePersonalChange} />
      <input name="phone" placeholder="Phone" onChange={handlePersonalChange} />
      <input name="address" placeholder="Address" onChange={handlePersonalChange} />
      <input name="linkedin" placeholder="LinkedIn URL" onChange={handlePersonalChange} />
      <input name="github" placeholder="GitHub URL" onChange={handlePersonalChange} />

      <h3>Summary</h3>
      <textarea
        name="summary"
        placeholder="Short professional summary"
        onChange={handleSimpleChange}
      />

      <h3>Skills (comma separated)</h3>
      <input
        name="skills"
        placeholder="e.g. Java, Python, AWS"
        onChange={handleSimpleChange}
      />

      <h3>Experience</h3>
      {form.experience.map((exp, index) => (
        <div key={index} className="section-block">
          <input
            name="company"
            placeholder="Company"
            value={exp.company}
            onChange={(e) => handleExperienceChange(index, e)}
          />
          <input
            name="role"
            placeholder="Role"
            value={exp.role}
            onChange={(e) => handleExperienceChange(index, e)}
          />
          <div className="inline-inputs">
            <input
              name="from"
              placeholder="From"
              value={exp.from}
              onChange={(e) => handleExperienceChange(index, e)}
            />
            <input
              name="to"
              placeholder="To"
              value={exp.to}
              onChange={(e) => handleExperienceChange(index, e)}
            />
          </div>
          <textarea
            name="description"
            placeholder="Description"
            value={exp.description}
            onChange={(e) => handleExperienceChange(index, e)}
          />
          <button
            type="button"
            className="remove-btn"
            onClick={() => removeExperience(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addExperience}>+ Add Experience</button>

      <h3>Education</h3>
      {form.education.map((edu, index) => (
        <div key={index} className="section-block">
          <input
            name="institution"
            placeholder="School / University"
            value={edu.institution}
            onChange={(e) => handleEducationChange(index, e)}
          />
          <input
            name="degree"
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) => handleEducationChange(index, e)}
          />
          <input
            name="year"
            placeholder="Year"
            value={edu.year}
            onChange={(e) => handleEducationChange(index, e)}
          />
          <button
            type="button"
            className="remove-btn"
            onClick={() => removeEducation(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addEducation}>+ Add Education</button>

      <br />
      <button type="submit" className="generate-btn">Generate Resume</button>
    </form>
  );
};

export default ResumeForm;
