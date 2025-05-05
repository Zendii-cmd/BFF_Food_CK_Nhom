// API/auth.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.225:5000/api'; // ví dụ: http://192.168.1.5:3000/api/auth

const instance = axios.create({
  baseURL: API_URL,
  timeout: 1000, // timeout 10 giây để tránh treo lâu nếu server không phản hồi
  headers: {
    'Content-Type': 'application/json'
  }
});
// Interceptor gắn token vào header của mỗi request
instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Gắn token vào header
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const authApi = {
  register: (hoTen, email, matKhau) =>
    axios.post(`${API_URL}/nguoidung/dangky`, {
      hoTen,
      email,
      matKhau
    }),
// Đăng nhập
login: async (email, matKhau) => {
  try {
    const { data } = await axios.post(`${API_URL}/nguoidung/dangnhap`, { email, matKhau });
    if (data.success) {
      // Lưu token vào AsyncStorage
      await AsyncStorage.setItem('userToken', data.token);
      return data; // Trả về thông tin người dùng và token
    } else {
      throw new Error(data.message || 'Đăng nhập thất bại');
    }
  } catch (error) {
    console.log('Lỗi khi đăng nhập:', error);
    throw error;
  }
},
  // Lấy thông tin người dùng hiện tại
  getCurrentUser: async () => {
    try {
      const response = await instance.get('/nguoidung/me');
      return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      throw error; // Bắt lỗi nếu không thể lấy thông tin
    }
  },

  // Cập nhật thông tin người dùng
  updateUserInfo: async (hoTen, ngaySinh) => {
    try {
      const response = await instance.put('/nguoidung/me', {
        hoTen,
        ngaySinh,
      });
      return response.data; // Trả về kết quả sau khi cập nhật
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin người dùng:', error);
      throw error; // Bắt lỗi nếu không thể cập nhật
    }
  },
   // Đăng xuất
   logout: async () => {
    await AsyncStorage.removeItem('userToken');
  },
};
