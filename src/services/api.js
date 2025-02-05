import axios from "axios";

const API_URL = "http://localhost:8080/api";

//auto attach token to request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  Helper function to get token from local storage
const getAuthHeader = () => {
  const token = localStorage.getItem("auth_token");
  if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
  return token ? { Authorization: `Bearer ${token}` } : {};
};

//activities
// Get activities for a specific lead
export const getActivities = (leadId) => {
  return axios.get(`${API_URL}/activities/lead/${leadId}`, {
    headers: getAuthHeader(),
  });
};

//  Add a new activity to a lead
export const addActivity = (leadId, activityData) => {
  return axios.post(`${API_URL}/activities/lead/${leadId}`, activityData, {
    headers: getAuthHeader(),
  });
};

// Delete an activity
export const deleteActivity = (activityId) => {
  return axios.delete(`${API_URL}/activities/${activityId}`, {
    headers: getAuthHeader(),
  });
};


//get leads
export const getLeads = (sortBy = "createdAt", order = "desc", filters = {}) => {
  const params = new URLSearchParams();
  params.append("sortBy", sortBy);
  params.append("order", order);

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  return axios.get(`${API_URL}/leads/leads?${params.toString()}`);
};

//create leads
export const createLead = (leadData) => {
  return axios.post(`${API_URL}/leads`, leadData);
};

//update leads
export const updateLead = (leadData) => {
  return axios.put(`${API_URL}/leads`, leadData);
};

//delete leads
export const deleteLead = (id) => {
  return axios.delete(`${API_URL}/leads/${id}`);
};
