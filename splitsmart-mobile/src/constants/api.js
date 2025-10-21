// Using ngrok for local development - update this when deploying
// To find your local IP: run 'ipconfig' in CMD and look for IPv4 Address
const API_BASE_URL = "https://c16ba71519ad.ngrok-free.app/api";

export const API_ENDPOINTS = {
  // Authentication endpoints
  REGISTER: `${API_BASE_URL}/Auth/register`,
  LOGIN: `${API_BASE_URL}/Auth/login`,
  ME: `${API_BASE_URL}/Auth/me`,
  UPDATE_PROFILE: `${API_BASE_URL}/Auth/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/Auth/change-password`,

  // Group management endpoints
  GROUPS: `${API_BASE_URL}/Group`,
  GROUP_DETAIL: (id) => `${API_BASE_URL}/Group/${id}`,
  GROUP_MEMBERS: (id) => `${API_BASE_URL}/Group/${id}/members`,
  GROUP_BALANCES: (id) => `${API_BASE_URL}/Group/${id}/balances`,

  // Expense tracking endpoints
  EXPENSES: `${API_BASE_URL}/Expense`,
  GROUP_EXPENSES: (groupId) => `${API_BASE_URL}/Expense/group/${groupId}`,
  EXPENSE_DETAIL: (id) => `${API_BASE_URL}/Expense/${id}`,
  SETTLEMENTS: (groupId) =>
    `${API_BASE_URL}/Expense/group/${groupId}/settlements`,
};

export default API_BASE_URL;
