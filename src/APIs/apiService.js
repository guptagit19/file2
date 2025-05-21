import axios from 'axios';
import Toast from 'react-native-toast-message';

export const API_BASE_URL = 'http://192.168.165.82:8080/users'; // no trailing slash

export const endPoints = {
  generateOtp: '/otp/generateOtp',
  verifyOTP: '/otp/verifyOTP',
  checkPhone: '/user/checkPhoneNumber',
  registerUser: '/user/register',
  getUserProfile: '/user/getUserProfile',
  updateUser: '/user/updateUser',
  saveUserLocation: '/location/saveUserLocation',
  //saveUserLocation: phone => `/location/${phone}/saveUserLocation`,
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
  response => response,
  error => {
    // prefer the server’s `data.message`, fallback to generic
    const msg = error.response?.data?.message || error.message;
    // show your custom toast style
    Toast.show({
      type: 'error',
      text1: 'Request Failed',
      text2: msg,
    });
    return Promise.reject(error);
  },
);

export const APIsGet = async (endpoint, params = {}) => {
  try {
    const {status, data} = await api.get(endpoint, {params});
    return {status, data};
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
    //const msg = error.response?.data?.message || error.message;
    const msg = error.response?.data?.data || error.message;
    console.error(`POST ${endpoint} failed:`, msg);
    throw error.response?.data?.data || error;
  }
};

// Replace your existing APIsPut with this:

export const APIsPut = async (endpoint, data = {}) => {
  try {
    // Send 'data' as the JSON body, not inside { params: ... }
    const {status, data: respData} = await api.put(endpoint, data);
    console.log(`PUT ${endpoint} → status:`, status, 'data:', respData);
    return {status, data: respData};
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
