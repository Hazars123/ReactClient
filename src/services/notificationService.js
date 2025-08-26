import axios from '../api/axios';

const API_NOTIFICATION = '/notification';

// Ajoute le token dans les headers automatiquement si nécessaire
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* --------------------------------------------------
   1) GET /notifications/unread/user
   -------------------------------------------------- */
export const getUnreadNotificationsUser = async () => {
  const { data } = await axios.get(`${API_NOTIFICATION}/unread/user`, {
    headers: getAuthHeader(),
  });
  return data;
};

/* --------------------------------------------------
   2) GET /notifications/unread/count/user
   -------------------------------------------------- */
export const getUnreadCountUser = async () => {
  const { data } = await axios.get(`${API_NOTIFICATION}/unread/count/user`, {
    headers: getAuthHeader(),
  });
  return data.count;
};

/* --------------------------------------------------
   3) PATCH /notifications/mark-all-read/user
   -------------------------------------------------- */
export const markAllAsReadUser = async () => {
  const { data } = await axios.patch(
    `${API_NOTIFICATION}/mark-all-read/user`,
    {},
    { headers: getAuthHeader() }
  );
  return data;
};

/* --------------------------------------------------
   4) PATCH /notifications/:id/read
   -------------------------------------------------- */
export const markAsRead = async (notificationId) => {
  const { data } = await axios.patch(
    `${API_NOTIFICATION}/${notificationId}/read`,
    {},
    { headers: getAuthHeader() }
  );
  return data;
};

