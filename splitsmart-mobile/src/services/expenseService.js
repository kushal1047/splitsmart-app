import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const expenseService = {
  getGroupExpenses: async (groupId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GROUP_EXPENSES(groupId));
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch expenses";
    }
  },

  getExpenseById: async (expenseId) => {
    try {
      const response = await api.get(API_ENDPOINTS.EXPENSE_DETAIL(expenseId));
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch expense details";
    }
  },

  createExpense: async (expenseData) => {
    try {
      const response = await api.post(API_ENDPOINTS.EXPENSES, expenseData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to create expense";
    }
  },

  deleteExpense: async (expenseId) => {
    try {
      const response = await api.delete(
        API_ENDPOINTS.EXPENSE_DETAIL(expenseId)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to delete expense";
    }
  },

  getSettlements: async (groupId) => {
    try {
      const response = await api.get(API_ENDPOINTS.SETTLEMENTS(groupId));
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to calculate settlements";
    }
  },
};
