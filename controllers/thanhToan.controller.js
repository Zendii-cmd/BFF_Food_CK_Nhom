const PhuongThucThanhToan = require('../models/PhuongThucThanhToan.model');

const themPhuongThucThanhToan = async (req, res) => {
  try {
    const { loai, thongTinThe, viDienTu, macDinh } = req.body;
    
    // Nếu đặt làm mặc định, hủy mặc định của các phương thức khác
    if (macDinh) {
      await PhuongThucThanhToan.updateMany(
        { nguoiDung: req.nguoiDung._id },
        { macDinh: false }
      );
    }

    const phuongThuc = new PhuongThucThanhToan({
      nguoiDung: req.nguoiDung._id,
      loai,
      thongTinThe,
      viDienTu,
      macDinh
    });

    await phuongThuc.save();

    res.status(201).json({
      success: true,
      phuongThuc
    });
  } catch (error) {
    console.error('Lỗi khi thêm phương thức thanh toán:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm phương thức thanh toán'
    });
  }
};

module.exports = {
  themPhuongThucThanhToan
};