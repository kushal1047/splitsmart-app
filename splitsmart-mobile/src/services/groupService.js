import api from "./api";
import { API_ENDPOINTS } from "../constants/api";
import { handleApiError } from "../utils/errorHandler";

export const groupService = {
  getAllGroups: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GROUPS);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getGroupById: async (groupId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GROUP_DETAIL(groupId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

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
