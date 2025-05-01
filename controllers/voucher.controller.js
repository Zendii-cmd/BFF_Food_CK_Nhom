const Voucher = require('../models/Voucher.model');

const apDungVoucher = async (req, res) => {
  try {
    const { maVoucher, tongTien } = req.body;
    
    // Tìm voucher hợp lệ
    const voucher = await Voucher.findOne({
      maVoucher,
      ngayBatDau: { $lte: new Date() },
      ngayKetThuc: { $gte: new Date() },
      $expr: { $lt: ['$daSuDung', '$gioiHanSuDung'] } // Kiểm tra nếu có giới hạn
    });

    if (!voucher) {
      return res.status(400).json({
        success: false,
        message: 'Voucher không hợp lệ hoặc đã hết hạn'
      });
    }

    // Kiểm tra giá trị tối thiểu
    if (voucher.giaTriToiThieu && tongTien < voucher.giaTriToiThieu) {
      return res.status(400).json({
        success: false,
        message: `Đơn hàng tối thiểu ${voucher.giaTriToiThieu} để áp dụng voucher`
      });
    }

    // Tính toán giảm giá
    let giamGia = 0;
    if (voucher.loaiGiamGia === 'phantram') {
      giamGia = tongTien * voucher.giaTri / 100;
    } else {
      giamGia = voucher.giaTri;
    }

    res.json({
      success: true,
      voucher: {
        maVoucher: voucher.maVoucher,
        moTa: voucher.moTa,
        loaiGiamGia: voucher.loaiGiamGia,
        giaTri: voucher.giaTri
      },
      giamGia,
      tongTienSauGiam: tongTien - giamGia
    });
  } catch (error) {
    console.error('Lỗi khi áp dụng voucher:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi áp dụng voucher'
    });
  }
};

module.exports = {
  apDungVoucher
};