import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
// If you're using CSS, keep your import
import "./index.css";

// Get the current origin, handling both local development and Amplify deployment
const getRedirectUri = () => {
  // For Amplify deployment, use the production domain
  if (window.location.hostname.includes('amplifyapp.com')) 
    {
    return window.location.origin;
  }
  // For local development
  return window.location.origin;
};

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_SkR5VDPNC",
  client_id: "49n44heamsp64gsnrohap7m3s",
  redirect_uri: getRedirectUri(),
  response_type: "code",
  scope: "email openid phone"
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
