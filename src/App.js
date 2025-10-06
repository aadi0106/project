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

  const handleTemplateSelect = (template) => setSelectedTemplate(template);
  const handleFormSubmit = (data) => setResumeData(data);
  const handleBack = () => {
    setResumeData(null);
    setSelectedTemplate(null);
  };

  // Sign out function with redirect to login page
  const signOutRedirect = () => {
    const clientId = "2sck1ajmt6ogei3edviuar4jks";
    const logoutUri = window.location.origin; // app root
    const cognitoDomain = "https://ap-south-1jzalithv6.auth.ap-south-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // Loading state while checking auth
  if (auth.isLoading) return <div>Loading...</div>;

  // If not authenticated, show login page
  if (!auth.isAuthenticated) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Please Sign In</h2>
        <button onClick={() => auth.signinRedirect()}>Sign in with Cognito</button>
      </div>
    );
  }

  // Authenticated: show resume builder
  return (
    <div className="app-container">
      <button className="signout-btn" onClick={signOutRedirect} style={{ float: "right" }}>
        Sign Out
      </button>

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
