import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import "./index.css";

// Handles redirect URI for local vs Amplify deployment
const getRedirectUri = () => {
  if (window.location.hostname.includes("amplifyapp.com")) {
    return window.location.origin;
  }
  return "http://localhost:3000";
};

// ⚙️ OIDC Configuration for Cognito
const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_SkR5VDPNC", // Your User Pool ID
  client_id: "49n44heamsp64gsnrohap7m3s", // Your Cognito App Client ID
  redirect_uri: getRedirectUri(),
  response_type: "code",
  scope: "openid profile email",
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
