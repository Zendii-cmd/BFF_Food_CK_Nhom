const PhuongThucThanhToan = require('../models/PhuongThucThanhToan.model');
const LichSuDonHang = require('../models/LichSuDonHang.model');
const GioHang = require('../models/GioHang.model');
const NguoiDung = require('../models/NguoiDung.model');

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

const suaPhuongThucThanhToan = async (req, res) => {
  try {
    const { phuongThucId } = req.params;
    const { loai, thongTinThe, viDienTu, macDinh } = req.body;

    // Tìm phương thức thanh toán cần sửa
    let phuongThuc = await PhuongThucThanhToan.findOne({ _id: phuongThucId, nguoiDung: req.nguoiDung._id });
    if (!phuongThuc) {
      return res.status(404).json({
        success: false,
        message: 'Phương thức thanh toán không tồn tại'
      });
    }

    // Nếu đặt làm mặc định, hủy mặc định của các phương thức khác
    if (macDinh) {
      await PhuongThucThanhToan.updateMany(
        { nguoiDung: req.nguoiDung._id, _id: { $ne: phuongThucId } },
        { macDinh: false }
      );
    }

    // Cập nhật thông tin
    phuongThuc.loai = loai || phuongThuc.loai;
    phuongThuc.thongTinThe = thongTinThe || phuongThuc.thongTinThe;
    phuongThuc.viDienTu = viDienTu || phuongThuc.viDienTu;
    phuongThuc.macDinh = macDinh !== undefined ? macDinh : phuongThuc.macDinh;

    await phuongThuc.save();

    res.status(200).json({
      success: true,
      phuongThuc
    });
  } catch (error) {
    console.error('Lỗi khi sửa phương thức thanh toán:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi sửa phương thức thanh toán'
    });
  }
};

const xoaPhuongThucThanhToan = async (req, res) => {
  try {
    const { phuongThucId } = req.params;

    // Tìm và xóa phương thức thanh toán
    const phuongThuc = await PhuongThucThanhToan.findOneAndDelete({ _id: phuongThucId, nguoiDung: req.nguoiDung._id });
    if (!phuongThuc) {
      return res.status(404).json({
        success: false,
        message: 'Phương thức thanh toán không tồn tại'
      });
    }

    // Nếu phương thức bị xóa là mặc định, đặt phương thức khác làm mặc định (nếu có)
    const otherPhuongThuc = await PhuongThucThanhToan.findOne({ nguoiDung: req.nguoiDung._id });
    if (phuongThuc.macDinh && otherPhuongThuc) {
      otherPhuongThuc.macDinh = true;
      await otherPhuongThuc.save();
    }

    res.status(200).json({
      success: true,
      message: 'Xóa phương thức thanh toán thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa phương thức thanh toán:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa phương thức thanh toán'
    });
  }
};

const chonMacDinhPhuongThucThanhToan = async (req, res) => {
  try {
    const { phuongThucId } = req.params;

    // Tìm phương thức thanh toán cần đặt làm mặc định
    const phuongThuc = await PhuongThucThanhToan.findOne({ _id: phuongThucId, nguoiDung: req.nguoiDung._id });
    if (!phuongThuc) {
      return res.status(404).json({
        success: false,
        message: 'Phương thức thanh toán không tồn tại'
      });
    }

    // Hủy mặc định của các phương thức khác
    await PhuongThucThanhToan.updateMany(
      { nguoiDung: req.nguoiDung._id, _id: { $ne: phuongThucId } },
      { macDinh: false }
    );

    // Đặt phương thức hiện tại làm mặc định
    phuongThuc.macDinh = true;
    await phuongThuc.save();

    res.status(200).json({
      success: true,
      phuongThuc
    });
  } catch (error) {
    console.error('Lỗi khi chọn phương thức thanh toán mặc định:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi chọn phương thức thanh toán mặc định'
    });
  }
};


const thanhToanGioHang = async (req, res) => {
  try {
    const { diaChiGiaoHangId, phuongThucThanhToanId, ghiChu } = req.body;

    // 1. Kiểm tra giỏ hàng
    const gioHang = await GioHang.findOne({ nguoiDung: req.nguoiDung._id }).populate('mucGioHang.sanPham');
    if (!gioHang || gioHang.mucGioHang.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng trống'
      });
    }

    // 2. Kiểm tra địa chỉ giao hàng
    const user = await NguoiDung.findById(req.nguoiDung._id);
    const diaChiGiaoHang = user.danhSachDiaChi.id(diaChiGiaoHangId);
    if (!diaChiGiaoHang) {
      return res.status(400).json({
        success: false,
        message: 'Địa chỉ giao hàng không hợp lệ'
      });
    }

    // 3. Kiểm tra phương thức thanh toán
    const phuongThucThanhToan = await PhuongThucThanhToan.findOne({
      _id: phuongThucThanhToanId,
      nguoiDung: req.nguoiDung._id
    });
    if (!phuongThucThanhToan) {
      return res.status(400).json({
        success: false,
        message: 'Phương thức thanh toán không hợp lệ'
      });
    }

    // 4. Tạo đơn hàng mới
    const donHang = new LichSuDonHang({
      nguoiDung: req.nguoiDung._id,
      danhSachSanPham: gioHang.mucGioHang.map(item => ({
        sanPham: item.sanPham._id,
        soLuong: item.soLuong,
        gia: item.gia,
        kichThuoc: item.kichThuoc
      })),
      diaChiGiaoHang: diaChiGiaoHangId,
      phuongThucThanhToan: phuongThucThanhToanId,
      tongTien: gioHang.tongTien,
      ghiChu
    });

    await donHang.save();

    // 5. Xóa giỏ hàng sau khi thanh toán
    await GioHang.findOneAndDelete({ nguoiDung: req.nguoiDung._id });

    res.status(201).json({
      success: true,
      message: 'Thanh toán thành công',
      data: donHang
    });

  } catch (error) {
    console.error('Lỗi khi thanh toán:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thanh toán'
    });
  }
};

module.exports = {
  themPhuongThucThanhToan,
  suaPhuongThucThanhToan,
  xoaPhuongThucThanhToan,
  chonMacDinhPhuongThucThanhToan,
  thanhToanGioHang
};