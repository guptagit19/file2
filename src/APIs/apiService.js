import axios from 'axios';

export const API_BASE_URL = 'http://192.168.0.159:8080/social'; // no trailing slash

export const endPoints = {
  generateOtp: '/otp/generateOtp',
  verifyOTP: '/otp/verifyOTP',
  checkPhone: '/user/checkPhoneNumber',
  registerUser: '/user/register',
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',

    // Agar aapko kisi default authorization token ki zarurat hai toh yahan set kar sakte hain
    // 'Authorization': `Bearer ${yourAuthToken}`,
  },
});

// Request interceptor (optional: for logging or adding headers to every request)
api.interceptors.request.use(
  config => {
    // console.log('Request sent to:', config.url);
    return config;
  },
  error => {
    // console.log('Request error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor (optional: for handling global errors or modifying responses)
api.interceptors.response.use(
  response => {
    // console.log('Response received:', response);
    return response;
  },
  error => {
    // console.log('Response error:', error);
    return Promise.reject(error);
  },
);

export const APIsGet = async (endpoint, params = {}) => {
  try {
    const response = await api.get(endpoint, {params});
    console.log('APIsGet response :- ' + response);
    return response;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error(`GET ${endpoint} failed:`, msg);
    throw new Error(msg);
  }
};

export const APIsPost = async (endpoint, data = {}) => {
  try {
    const response = await api.post(endpoint, data);
    return response;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error(`POST ${endpoint} failed:`, msg);
    throw new Error(msg);
  }
};

export const APIsPut = async (endpoint, data = {}) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error(`PUT ${endpoint} failed:`, msg);
    throw new Error(msg);
  }
};

export const APIsDelete = async (endpoint, params = {}) => {
  try {
    const response = await api.delete(endpoint, {params});
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error(`DELETE ${endpoint} failed:`, msg);
    throw new Error(msg);
  }
};

// Aap aur bhi methods add kar sakte hain jaise patch, etc.
