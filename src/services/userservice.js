import axios from "../api/axios";
const USER_API = "users";

export const fetchUsers = async () => {
    return await axios.get(USER_API);
};

export const fetchUserById = async (userId) => {
    return await axios.get(USER_API + '/' + userId);
};

export const deleteUser = async (userId) => {
    return await axios.delete(USER_API + '/' + userId);
};
export const editprofile = async (userId, userData) => {
    try {
      const response = await axios.put(`${USER_API}/${userId}`, userData);
      return response.data; // Return the full response (success case)
    } catch (error) {
      // Throw or return a consistent error object
      throw new Error(error.response?.data?.message || "Failed to update profile");
    }
  };

export const toggleUserStatus = async (email) => {
    return await axios.get(USER_API + "/status/edit?email=" + email);
};

export const updateUserRole = async (userId, role) => {
    return await axios.patch(USER_API + '/' + userId + '/role', { role });
};