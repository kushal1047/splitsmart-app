import api from "./api";
import { API_ENDPOINTS } from "../constants/api";
import { handleApiError } from "../utils/errorHandler";

export const expenseService = {
  getGroupExpenses: async (groupId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GROUP_EXPENSES(groupId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getExpenseById: async (expenseId) => {
    try {
      const response = await api.get(API_ENDPOINTS.EXPENSE_DETAIL(expenseId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createExpense: async (expenseData) => {
    try {
      const response = await api.post(API_ENDPOINTS.EXPENSES, expenseData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

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

  getSettlements: async (groupId) => {
    try {
      const response = await api.get(API_ENDPOINTS.SETTLEMENTS(groupId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
