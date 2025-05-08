const GioHang = require('../models/GioHang.model');
const SanPham = require('../models/SanPham.model');

const themVaoGioHang = async (req, res) => {
  try {
    const { sanPhamId, soLuong, kichThuoc, ghiChu } = req.body;

    // 1. Kiểm tra sản phẩm tồn tại
    const sanPham = await SanPham.findById(sanPhamId);
    if (!sanPham || !sanPham.hoatDong) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại hoặc đã ngừng bán'
      });
    }

    // 2. Tính toán giá cuối cùng (bao gồm giá thêm kích thước nếu có)
    let giaCuoiCung = sanPham.gia;
    let selectedSize = null;

    if (kichThuoc && kichThuoc.ten) {
      // Tìm kích thước được chọn trong sản phẩm
      const sizeInfo = sanPham.kichThuoc.find(
        kt => kt.tenKichThuoc === kichThuoc.ten
      );
      
      if (sizeInfo) {
        selectedSize = {
          ten: sizeInfo.tenKichThuoc,
          giaThem: sizeInfo.giaThem
        };
        giaCuoiCung += sizeInfo.giaThem;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Kích thước không hợp lệ cho sản phẩm này'
        });
      }
    }

    // 3. Tìm hoặc tạo giỏ hàng
    let gioHang = await GioHang.findOne({ nguoiDung: req.nguoiDung._id });
    
    if (!gioHang) {
      gioHang = new GioHang({
        nguoiDung: req.nguoiDung._id,
        mucGioHang: [],
        tongTien: 0
      });
    }

    // 4. Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItemIndex = gioHang.mucGioHang.findIndex(item => {
      // So sánh ID sản phẩm và tên kích thước (nếu có)
      const sameProduct = item.sanPham.toString() === sanPhamId;
      const sameSize = 
        (!item.kichThuoc && !kichThuoc) || // Cả hai không có kích thước
        (item.kichThuoc?.ten === kichThuoc?.ten); // Hoặc cùng kích thước
        
      return sameProduct && sameSize;
    });

    if (existingItemIndex >= 0) {
      // Cập nhật số lượng nếu đã có
      gioHang.mucGioHang[existingItemIndex].soLuong += soLuong;
      // Cập nhật lại giá (phòng trường hợp giá sản phẩm thay đổi)
      gioHang.mucGioHang[existingItemIndex].gia = giaCuoiCung;
    } else {
      // Thêm mới nếu chưa có
      gioHang.mucGioHang.push({
        sanPham: sanPhamId,
        soLuong,
        gia: giaCuoiCung,
        kichThuoc: selectedSize,
        ghiChu
      });
    }

    // 5. Tính lại tổng tiền
    gioHang.tongTien = gioHang.mucGioHang.reduce(
      (total, item) => total + (item.gia * item.soLuong), 0
    );
    gioHang.updatedAt = new Date();

    await gioHang.save();

    // 6. Trả về response
    res.status(200).json({
      success: true,
      message: 'Thêm vào giỏ hàng thành công',
      data: {
        gioHang,
        giaDaTinh: giaCuoiCung // Giá đã bao gồm cả giá thêm kích thước (nếu có)
      }
    });

  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm vào giỏ hàng',
      error: error.message
    });
  }
};

const xoaKhoiGioHang = async (req, res) => {
  try {
    const { sanPhamId } = req.params;
    const { kichThuoc } = req.body; // Optional: nếu muốn xóa theo kích thước

    // Tìm giỏ hàng của người dùng
    let gioHang = await GioHang.findOne({ nguoiDung: req.nguoiDung._id });
    
    if (!gioHang) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giỏ hàng'
      });
    }

    // Lọc bỏ sản phẩm cần xóa
    const initialLength = gioHang.mucGioHang.length;
    
    gioHang.mucGioHang = gioHang.mucGioHang.filter(item => {
      // Nếu có truyền kích thước thì xóa đúng sản phẩm + kích thước
      if (kichThuoc && kichThuoc.ten) {
        return !(item.sanPham.toString() === sanPhamId && 
               item.kichThuoc?.ten === kichThuoc.ten);
      }
      // Ngược lại xóa tất cả các mục có sanPhamId này
      return item.sanPham.toString() !== sanPhamId;
    });

    // Kiểm tra nếu không có gì thay đổi
    if (gioHang.mucGioHang.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm trong giỏ hàng'
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
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
      gioHang
    });
  } catch (error) {
    console.error('Lỗi khi xóa khỏi giỏ hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa khỏi giỏ hàng'
    });
  }
};

module.exports = {
  themVaoGioHang,
  xoaKhoiGioHang
};