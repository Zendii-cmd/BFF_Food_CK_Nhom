const DanhMuc = require('../models/DanhMuc.model');

/**
 * Tạo danh mục mới (Admin)
 */
const createDanhMuc = async (req, res) => {
  try {
    const { tenDanhMuc, moTa, hinhAnh } = req.body;

    // Kiểm tra danh mục đã tồn tại chưa
    const existingDanhMuc = await DanhMuc.findOne({ tenDanhMuc });
    if (existingDanhMuc) {
      return res.status(400).json({
        success: false,
        message: 'Danh mục đã tồn tại'
      });
    }

    const danhMuc = new DanhMuc({
      tenDanhMuc,
      moTa,
      hinhAnh
    });

    await danhMuc.save();

    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: danhMuc
    });
  } catch (error) {
    console.error('Lỗi khi tạo danh mục:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo danh mục'
    });
  }
};

/**
 * Lấy tất cả danh mục
 */
const getAllDanhMuc = async (req, res) => {
  try {
    const danhMucs = await DanhMuc.find().sort({ tenDanhMuc: 1 });

    res.status(200).json({
      success: true,
      data: danhMucs
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách danh mục'
    });
  }
};

/**
 * Cập nhật danh mục (Admin)
 */
const updateDanhMuc = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenDanhMuc, moTa, hinhAnh } = req.body;

    // Kiểm tra danh mục tồn tại
    const danhMuc = await DanhMuc.findById(id);
    if (!danhMuc) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }

    // Kiểm tra tên danh mục trùng (nếu có thay đổi)
    if (tenDanhMuc && tenDanhMuc !== danhMuc.tenDanhMuc) {
      const existingDanhMuc = await DanhMuc.findOne({ tenDanhMuc });
      if (existingDanhMuc) {
        return res.status(400).json({
          success: false,
          message: 'Tên danh mục đã tồn tại'
        });
      }
      danhMuc.tenDanhMuc = tenDanhMuc;
    }

    if (moTa) danhMuc.moTa = moTa;
    if (hinhAnh) danhMuc.hinhAnh = hinhAnh;

    await danhMuc.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: danhMuc
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật danh mục:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật danh mục'
    });
  }
};

/**
 * Xóa danh mục (Admin)
 */
const deleteDanhMuc = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra danh mục có sản phẩm nào không
    const SanPham = require('../models/SanPham.model');
    const productsInCategory = await SanPham.findOne({ danhMuc: id });
    
    if (productsInCategory) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa danh mục đang có sản phẩm'
      });
    }

    const danhMuc = await DanhMuc.findByIdAndDelete(id);

    if (!danhMuc) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa danh mục thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa danh mục:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa danh mục'
    });
  }
};

module.exports = {
  createDanhMuc,
  getAllDanhMuc,
  updateDanhMuc,
  deleteDanhMuc
};