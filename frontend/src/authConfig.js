// src/authConfig.js
export const msalConfig = {
  auth: {
    clientId: "c837f8a4-213d-4175-b3e0-0336c3c9ffdf", // Ganti dengan Client ID dari Azure
    authority: "https://login.microsoftonline.com/common", // 'common' mendukung email personal & kantor
    redirectUri: "http://localhost:5173",
  },
  cache: {
    cacheLocation: "sessionStorage", 
    storeAuthStateInCookie: false, 
  }
};

export const loginRequest = {
  scopes: ["User.Read"] // Hak akses dasar untuk membaca nama, email, dan foto profil
};