// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Nettverksfeil' }));
    throw new Error(error.error || 'API-forespørsel feilet');
  }

  return response.json();
};

export const login = (email, password) =>
  apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (email, password, companyName) =>
  apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, companyName }),
  });

export const setupTripletex = (sessionToken) =>
  apiCall('/api/tripletex/setup', {
    method: 'POST',
    body: JSON.stringify({ sessionToken }),
  });

export const getLiquidityAnalysis = () => apiCall('/api/analysis/liquidity');
export const getCashFlowAnalysis = () => apiCall('/api/analysis/cashflow');
export const getProfitabilityAnalysis = () => apiCall('/api/analysis/profitability');
