import api from "./api";
import { API_ENDPOINTS } from "../constants/api";
import { handleApiError } from "../utils/errorHandler";

// Service for managing expenses and settlements
export const expenseService = {
  // Get all expenses for a specific group
  getGroupExpenses: async (groupId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GROUP_EXPENSES(groupId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get details of a specific expense
  getExpenseById: async (expenseId) => {
    try {
      const response = await api.get(API_ENDPOINTS.EXPENSE_DETAIL(expenseId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create a new expense with splits
  createExpense: async (expenseData) => {
    try {
      const response = await api.post(API_ENDPOINTS.EXPENSES, expenseData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete an expense
  deleteExpense: async (expenseId) => {
    try {
      const response = await api.delete(
        API_ENDPOINTS.EXPENSE_DETAIL(expenseId)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get settlement suggestions for a group
  getSettlements: async (groupId) => {
    try {
      const response = await api.get(API_ENDPOINTS.SETTLEMENTS(groupId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
