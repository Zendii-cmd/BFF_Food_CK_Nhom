// API/auth.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.32:5000/api'; // ví dụ: http://192.168.1.5:3000/api/auth

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
    try {
      const token = await AsyncStorage.getItem('userToken');
      await instance.post('/nguoidung/dangxuat', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error.response?.data || error.message);
      throw error;
    }
  },



  //Lấy tất cả sản phẩm 
  getAll: async (params = {}) => {
    try {
      const response = await instance.get('/sanpham/list', { params });
      return response.data.data.sanPhams; // trả về danh sách sản phẩm
    } catch (error) {
      console.error('Lỗi khi gọi API sản phẩm:', error);
      throw error;
    }
  },
  // Lấy chi tiết sản phẩm theo ID
  getSanPhamById: async (id) => {
    try {
      const response = await instance.get(`/sanpham/${id}`);
      return response.data.data; // trả về chi tiết sản phẩm
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
      throw error;
    }
  },
  //Thêm địa chỉ 
  addAddress: async (data) => {
    try {
      const response = await instance.post('/nguoidung/diachi', data);
  return response.data; // Trả về kết quả thêm địa chỉ
    } catch (error) {
      console.error('Lỗi khi thêm địa chỉ:', error);
      throw error;
    }
  },

  // Cập nhật địa chỉ
  updateAddress: async (id, data) => {
    try {
      const response = await instance.put(`/nguoidung/diachi/${id}`, data);
  return response.data; // Trả về kết quả cập nhật địa chỉ
    } catch (error) {
      console.error('Lỗi khi cập nhật địa chỉ:', error);
      throw error;
    }
  },

  // Xóa địa chỉ
  deleteAddress: async (id) => {
    try {
       const response = await instance.delete(`/nguoidung/diachi/${id}`);
  return response.data; // Trả về kết quả xóa địa chỉ
    } catch (error) {
      console.error('Lỗi khi xóa địa chỉ:', error);
      throw error;
    }
  },

  // Đặt địa chỉ mặc định
  setDefaultAddress: async (id) => {
    try {
  const response = await instance.put(`/nguoidung/diachi/${id}/macdinh`);
      return response.data; // Trả về kết quả đặt địa chỉ mặc định
    } catch (error) {
      console.error('Lỗi khi đặt địa chỉ mặc định:', error);
      throw error;
    }
  },
  // Thêm sản phẩm vào giỏ hàng
addToCart: async (sanPhamId, soLuong = 1, kichThuoc = null, ghiChu = '') => {
  try {
    const response = await instance.post('/giohang', {
      sanPhamId,
      soLuong,
      kichThuoc,
      ghiChu,
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    throw error;
  }
},

// Xoá sản phẩm khỏi giỏ hàng
removeFromCart: async (sanPhamId= null) => {
  try {
    const response = await instance.delete(`/giohang/${sanPhamId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xoá khỏi giỏ hàng:', error);
    throw error;
  }
},

// Lấy danh sách giỏ hàng
getCart: async () => {
  try {
    const response = await instance.get('/giohang');
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng:', error);
    throw error;
  }
},

// thanh toán 
thanhToan: async (data) => {
  try {
    const response = await instance.post('/thanhtoan', data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thanh toán:', error.response?.data || error.message);
    throw error;
  }
}

};
