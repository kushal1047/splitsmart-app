// Replace with your computer's local IP address
// Find it by running 'ipconfig' in Windows CMD and look for IPv4 Address
const API_BASE_URL = "http://localhost:5088/api";

export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/Auth/register`,
  LOGIN: `${API_BASE_URL}/Auth/login`,
  ME: `${API_BASE_URL}/Auth/me`,

  // Groups
  GROUPS: `${API_BASE_URL}/Group`,
  GROUP_DETAIL: (id) => `${API_BASE_URL}/Group/${id}`,
  GROUP_MEMBERS: (id) => `${API_BASE_URL}/Group/${id}/members`,
  GROUP_BALANCES: (id) => `${API_BASE_URL}/Group/${id}/balances`,

  // Expenses
  EXPENSES: `${API_BASE_URL}/Expense`,
  GROUP_EXPENSES: (groupId) => `${API_BASE_URL}/Expense/group/${groupId}`,
  EXPENSE_DETAIL: (id) => `${API_BASE_URL}/Expense/${id}`,
  SETTLEMENTS: (groupId) =>
    `${API_BASE_URL}/Expense/group/${groupId}/settlements`,
};

export default API_BASE_URL;
