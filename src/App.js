import React, { useState } from "react";
import { useAuth } from "react-oidc-context";
import FrontPage from "./components/FrontPage";
import ResumeForm from "./components/ResumeForm";
import ResumeTemplate1 from "./components/ResumeTemplate1";
import ResumeTemplate2 from "./components/ResumeTemplate2";
import DownloadPDFButton from "./components/DownloadPDFButton";

function App() {
  const auth = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  // 🟢 Select template
  const handleTemplateSelect = (template) => setSelectedTemplate(template);

  // 🟢 Submit resume data to API Gateway
  const handleFormSubmit = async (data) => {
    try {
      const userEmail = auth.user?.profile?.email || "unknown@example.com";
      const userSub = auth.user?.profile?.sub || "unknown-user";

      const payload = {
        userSub,
        userEmail,
        resumeData: data,
      };

      // 🔹 Replace this with your real API Gateway endpoint
      const apiUrl = "https://qhzfou1fwd.execute-api.ap-south-1.amazonaws.com/resumes";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Resume saved:", result);

      alert("Resume saved successfully!");
      setResumeData(data);
    } catch (err) {
      console.error("❌ Error saving resume:", err);
      alert("Failed to save resume: " + err.message);
    }
  };

  // 🟢 Go back to template selection
  const handleBack = () => {
    setResumeData(null);
    setSelectedTemplate(null);
  };

  // 🟢 Sign out (redirect to Cognito login page)
  const signOutRedirect = () => {
    const clientId = "2sck1ajmt6ogei3edviuar4jks"; // replace with your Cognito App Client ID
    const logoutUri = window.location.origin; // e.g., Amplify hosted app root
    const cognitoDomain = "https://ap-south-1jzalithv6.auth.ap-south-1.amazoncognito.com"; // replace with your Cognito domain
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // 🕒 Loading state
  if (auth.isLoading) return <div>Loading...</div>;

  // 🚫 Not authenticated → Show login
  if (!auth.isAuthenticated) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <h2>Welcome to the Resume Builder</h2>
        <p>Please sign in to start creating your professional resume.</p>
        <button
          onClick={() => auth.signinRedirect()}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Sign in with Cognito
        </button>
      </div>
    );
  }

  // ✅ Authenticated → Show app
  return (
    <div className="app-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          backgroundColor: "#f5f5f5",
          alignItems: "center",
        }}
      >
        <h3>Cloud Resume Generator</h3>
        <button
          onClick={signOutRedirect}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Conditional UI Rendering */}
      {!selectedTemplate ? (
        <FrontPage onSelectTemplate={handleTemplateSelect} />
      ) : !resumeData ? (
        <ResumeForm onSubmit={handleFormSubmit} />
      ) : (
        <div id="resume-section" style={{ padding: "20px" }}>
          {selectedTemplate === 1 ? (
            <ResumeTemplate1 resumeData={resumeData} />
          ) : (
            <ResumeTemplate2 resumeData={resumeData} />
          )}
          <div className="button-group" style={{ marginTop: "20px" }}>
            <DownloadPDFButton />
            <button
              onClick={handleBack}
              style={{
                marginLeft: "10px",
                backgroundColor: "#6c757d",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
