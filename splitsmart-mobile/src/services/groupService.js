import api from "./api";
import { API_ENDPOINTS } from "../constants/api";
import { handleApiError } from "../utils/errorHandler";

// Service for managing expense groups
export const groupService = {
  // Get all groups for the current user
  getAllGroups: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GROUPS);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get specific group details including members and expenses
  getGroupById: async (groupId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GROUP_DETAIL(groupId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create a new expense group
  createGroup: async (name, description) => {
    try {
      const response = await api.post(API_ENDPOINTS.GROUPS, {
        name,
        description,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update group name and description
  updateGroup: async (groupId, name, description) => {
    try {
      const response = await api.put(API_ENDPOINTS.GROUP_DETAIL(groupId), {
        name,
        description,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete a group (this will also delete all associated expenses)
  deleteGroup: async (groupId) => {
    try {
      const response = await api.delete(API_ENDPOINTS.GROUP_DETAIL(groupId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  addMember: async (groupId, email) => {
    try {
      const response = await api.post(API_ENDPOINTS.GROUP_MEMBERS(groupId), {
        email,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  removeMember: async (groupId, memberUserId) => {
    try {
      const response = await api.delete(
        `${API_ENDPOINTS.GROUP_MEMBERS(groupId)}/${memberUserId}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getGroupBalances: async (groupId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GROUP_BALANCES(groupId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
