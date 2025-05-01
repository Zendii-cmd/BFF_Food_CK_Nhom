const GioHang = require('../models/GioHang.model');
const SanPham = require('../models/SanPham.model');

const themVaoGioHang = async (req, res) => {
  try {
    const { sanPhamId, soLuong, kichThuoc, ghiChu } = req.body;
    
    // Kiểm tra sản phẩm tồn tại
    const sanPham = await SanPham.findById(sanPhamId);
    if (!sanPham) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại'
      });
    }

    // Tính giá sản phẩm (có thể thêm giá size nếu có)
    let gia = sanPham.gia;
    if (kichThuoc && kichThuoc.giaThem) {
      gia += kichThuoc.giaThem;
    }

    // Tìm hoặc tạo giỏ hàng
    let gioHang = await GioHang.findOne({ nguoiDung: req.nguoiDung._id });
    
    if (!gioHang) {
      gioHang = new GioHang({
        nguoiDung: req.nguoiDung._id,
        mucGioHang: []
      });
    }

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItemIndex = gioHang.mucGioHang.findIndex(
      item => item.sanPham.toString() === sanPhamId && 
             item.kichThuoc?.ten === kichThuoc?.ten
    );

    if (existingItemIndex >= 0) {
      // Cập nhật số lượng nếu đã có
      gioHang.mucGioHang[existingItemIndex].soLuong += soLuong;
    } else {
      // Thêm mới nếu chưa có
      gioHang.mucGioHang.push({
        sanPham: sanPhamId,
        soLuong,
        gia,
        kichThuoc,
        ghiChu
      });
    }

    // Tính lại tổng tiền
    gioHang.tongTien = gioHang.mucGioHang.reduce(
      (total, item) => total + (item.gia * item.soLuong), 0
    );
    gioHang.updatedAt = new Date();

    await gioHang.save();

    res.status(200).json({
      success: true,
      gioHang
    });
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm vào giỏ hàng'
    });
  }
};

module.exports = {
  themVaoGioHang
};