const NguoiDung = require('../models/NguoiDung.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Lấy thông tin người dùng hiện tại
 */
const getCurrentUser = async (req, res) => {
  try {
    if (req.nguoiDung?.taiKhoan) {
      req.nguoiDung.taiKhoan.matKhau = undefined; // Ẩn mật khẩu
    }

    res.status(200).json({
      success: true,
      data: req.nguoiDung
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin người dùng'
    });
  }
};

/**
 * Cập nhật thông tin người dùng
 */
const updateUserInfo = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['hoTen', 'ngaySinh'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Cập nhật không hợp lệ'
      });
    }

    updates.forEach(update => {
      req.nguoiDung[update] = req.body[update];
    });

    await req.nguoiDung.save();

    if (req.nguoiDung?.taiKhoan) {
      req.nguoiDung.taiKhoan.matKhau = undefined;
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: req.nguoiDung
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thông tin'
    });
  }
};

/**
 * Đăng ký người dùng mới
 */
const dangKy = async (req, res) => {
    try {
      const { email, matKhau, hoTen } = req.body;
  
      // Kiểm tra email đã tồn tại chưa
      const tonTai = await NguoiDung.findOne({ 'taiKhoan.email': email });
      if (tonTai) {
        return res.status(400).json({
          success: false,
          message: 'Email đã tồn tại'
        });
      }
  
      const salt = await bcrypt.genSalt(10);
      const matKhauMaHoa = await bcrypt.hash(matKhau, salt);
  
      const nguoiDungMoi = new NguoiDung({
        hoTen,
        vaiTro: "nguoidung",
        // ngaySinh,
        taiKhoan: {
          email,
          matKhau: matKhauMaHoa,         
        }
      });
  
      await nguoiDungMoi.save();
  
      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: {
          _id: nguoiDungMoi._id,
          email: nguoiDungMoi.taiKhoan.email,
          hoTen: nguoiDungMoi.hoTen
        }
      });
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đăng ký'
      });
    }
  };
  
  /**
   * Đăng nhập
   */
  const dangNhap = async (req, res) => {
    try {
      const { email, matKhau } = req.body;
  
      const nguoiDung = await NguoiDung.findOne({ 'taiKhoan.email': email });
      if (!nguoiDung) {
        return res.status(400).json({
          success: false,
          message: 'Email không tồn tại'
        });
      }
  
      const isMatch = await bcrypt.compare(matKhau, nguoiDung.taiKhoan.matKhau);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu không đúng'
        });
      }
  
       // Tạo token
    const token = jwt.sign(
      { id: nguoiDung._id, vaiTro: nguoiDung.vaiTro },
      process.env.JWT_SECRET,
      { expiresIn: '5d' }
    );

    // Lưu token vào user
    nguoiDung.tokens = nguoiDung.tokens.concat({ token });
    await nguoiDung.save();

    res.json({
      success: true,
      token,
      nguoiDung: {
        id: nguoiDung._id,
        hoTen: nguoiDung.hoTen,
        email: nguoiDung.email,
        vaiTro: nguoiDung.vaiTro
      }
    });
  
      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        token,
        data: nguoiDung
      });
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đăng nhập'
      });
    }
  };
  

/**
 * Đổi mật khẩu
 */
const changePassword = async (req, res) => {
  try {
    const { matKhauCu, matKhauMoi } = req.body;

    if (!req.nguoiDung?.taiKhoan?.matKhau) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy tài khoản để đổi mật khẩu'
      });
    }

    const isMatch = await bcrypt.compare(matKhauCu, req.nguoiDung.taiKhoan.matKhau);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu cũ không chính xác'
      });
    }

    const salt = await bcrypt.genSalt(10);
    req.nguoiDung.taiKhoan.matKhau = await bcrypt.hash(matKhauMoi, salt);

    await req.nguoiDung.save();

    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Lỗi khi đổi mật khẩu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đổi mật khẩu'
    });
  }
};

/**
 * Thêm địa chỉ mới
 */
const addAddress = async (req, res) => {
  try {
    const newAddress = {
      ...req.body,
      macDinh: req.nguoiDung.danhSachDiaChi.length === 0
    };

    req.nguoiDung.danhSachDiaChi.push(newAddress);
    await req.nguoiDung.save();

    res.status(201).json({
      success: true,
      message: 'Thêm địa chỉ thành công',
      data: newAddress
    });
  } catch (error) {
    console.error('Lỗi khi thêm địa chỉ:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm địa chỉ'
    });
  }
};

/**
 * Cập nhật địa chỉ
 */
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const addressIndex = req.nguoiDung.danhSachDiaChi.findIndex(
      addr => addr._id.toString() === id
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ'
      });
    }

    for (const key in updates) {
      if (key in req.nguoiDung.danhSachDiaChi[addressIndex]) {
        req.nguoiDung.danhSachDiaChi[addressIndex][key] = updates[key];
      }
    }

    await req.nguoiDung.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật địa chỉ thành công',
      data: req.nguoiDung.danhSachDiaChi[addressIndex]
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật địa chỉ:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật địa chỉ'
    });
  }
};

/**
 * Xóa địa chỉ
 */
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    req.nguoiDung.danhSachDiaChi = req.nguoiDung.danhSachDiaChi.filter(
      addr => addr._id.toString() !== id
    );

    await req.nguoiDung.save();

    res.status(200).json({
      success: true,
      message: 'Xóa địa chỉ thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa địa chỉ:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa địa chỉ'
    });
  }
};

/**
 * Đặt địa chỉ mặc định
 */
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    req.nguoiDung.danhSachDiaChi.forEach(addr => {
      addr.macDinh = addr._id.toString() === id;
    });

    await req.nguoiDung.save();

    res.status(200).json({
      success: true,
      message: 'Đặt địa chỉ mặc định thành công'
    });
  } catch (error) {
    console.error('Lỗi khi đặt địa chỉ mặc định:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đặt địa chỉ mặc định'
    });
  }
};

module.exports = {
  getCurrentUser,
  updateUserInfo,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  dangKy,
  dangNhap
};
