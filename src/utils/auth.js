// auth.js (Simulated Authentication)
const ACCESS_TOKEN_EXPIRATION = 60 * 1000; // 1 minute
const REFRESH_TOKEN_EXPIRATION = 5 * 60 * 1000; // 5 minutes

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

// Function to generate a new token (Fake JWT)
export const generateToken = (type) => {
  const expiresAt = Date.now() + (type === "access" ? ACCESS_TOKEN_EXPIRATION : REFRESH_TOKEN_EXPIRATION);
  return btoa(JSON.stringify({ exp: expiresAt }));
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = JSON.parse(atob(token));
    return Date.now() > decoded.exp;
  } catch {
    return true;
  }
};

// Function to refresh access token
export const refreshAccessToken = () => {
  if (!isTokenExpired(getRefreshToken())) {
    const newAccessToken = generateToken("access");
    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  }
  return null;
};

// Initialize authentication (simulate login)
export const initializeAuth = () => {
  if (!getAccessToken() || isTokenExpired(getAccessToken())) {
    const accessToken = generateToken("access");
    const refreshToken = generateToken("refresh");
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
};
