import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
// If you're using CSS, keep your import
import "./index.css";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_SkR5VDPNC",
  client_id: "49n44heamsp64gsnrohap7m3s",
  redirect_uri: window.location.origin,
  response_type: "code",
  scope: "email openid phone",
  automaticSilentRenew: false,
  loadUserInfo: true,
  post_logout_redirect_uri: window.location.origin,
  silent_redirect_uri: window.location.origin + "/silent-callback.html",
  revokeTokensOnSignout: true,
  includeIdTokenInSilentRenew: true,
  monitorSession: false,
  checkSessionInterval: 2000,
  userStore: window.localStorage,
  stateStore: window.localStorage,
  metadata: {
    issuer: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_SkR5VDPNC",
    authorization_endpoint: "https://ap-south-1skr5vdpnc.auth.ap-south-1.amazoncognito.com/oauth2/authorize",
    token_endpoint: "https://ap-south-1skr5vdpnc.auth.ap-south-1.amazoncognito.com/oauth2/token",
    userinfo_endpoint: "https://ap-south-1skr5vdpnc.auth.ap-south-1.amazoncognito.com/oauth2/userInfo",
    end_session_endpoint: "https://ap-south-1skr5vdpnc.auth.ap-south-1.amazoncognito.com/logout"
  }
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
