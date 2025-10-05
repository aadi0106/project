// App.js
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

  // Sign out redirect (Cognito Hosted UI)
  const signOutRedirect = () => {
    const clientId = "2sck1ajmt6ogei3edviuar4jks";
    const logoutUri = "http://localhost:3000";
    const cognitoDomain = "https://ap-south-1jzalithv6.auth.ap-south-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // Handle loading/error states
  if (auth.isLoading) return <div>Loading authentication...</div>;
  if (auth.error) return <div>Auth error: {auth.error.message}</div>;

  // If user is not authenticated, show sign-in
  if (!auth.isAuthenticated) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Welcome to Resume Generator</h2>
        <button onClick={() => auth.signinRedirect()}>Sign in with Cognito</button>
      </div>
    );
  }

  // Main resume app (only visible after login)
  const handleTemplateSelect = (template) => setSelectedTemplate(template);
  const handleFormSubmit = (data) => setResumeData(data);
  const handleBack = () => {
    setResumeData(null);
    setSelectedTemplate(null);
  };

  return (
    <div className="app-container">
      <div className="auth-header" style={{ textAlign: "right", margin: "10px" }}>
        <span style={{ marginRight: "10px" }}>
          Hello, <strong>{auth.user?.profile?.email}</strong>
        </span>
        <button onClick={() => signOutRedirect()}>Sign out</button>
      </div>

      {!selectedTemplate ? (
        <FrontPage onSelectTemplate={handleTemplateSelect} />
      ) : !resumeData ? (
        <ResumeForm onSubmit={handleFormSubmit} />
      ) : (
        <div id="resume-section">
          {selectedTemplate === 1 ? (
            <ResumeTemplate1 resumeData={resumeData} />
          ) : (
            <ResumeTemplate2 resumeData={resumeData} />
          )}
          <div className="button-group">
            <DownloadPDFButton />
            <button className="back-btn" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
