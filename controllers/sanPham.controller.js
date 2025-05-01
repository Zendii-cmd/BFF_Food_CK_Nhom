const SanPham = require('../models/SanPham.model');

/**
 * Tạo sản phẩm mới (Admin)
 */
const createSanPham = async (req, res) => {
  try {
    const { tenSanPham, danhMuc } = req.body;

    // Kiểm tra tên sản phẩm đã tồn tại chưa
    const existingSanPham = await SanPham.findOne({ tenSanPham });
    if (existingSanPham) {
      return res.status(400).json({
        success: false,
        message: 'Tên sản phẩm đã tồn tại'
      });
    }

    // Kiểm tra danh mục tồn tại
    const DanhMuc = require('../models/DanhMuc.model');
    const categoryExists = await DanhMuc.findById(danhMuc);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Danh mục không tồn tại'
      });
    }

    const sanPham = new SanPham(req.body);
    await sanPham.save();

    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: sanPham
    });
  } catch (error) {
    console.error('Lỗi khi tạo sản phẩm:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo sản phẩm'
    });
  }
};

/**
 * Lấy tất cả sản phẩm (có phân trang, lọc, sắp xếp)
 */
const getAllSanPham = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      danhMuc, 
      sortBy, 
      sortOrder = 'asc',
      search 
    } = req.query;

    const query = { hoatDong: true };
    const sortOptions = {};

    // Lọc theo danh mục
    if (danhMuc) {
      query.danhMuc = danhMuc;
    }

    // Tìm kiếm
    if (search) {
      query.$or = [
        { tenSanPham: { $regex: search, $options: 'i' } },
        { moTa: { $regex: search, $options: 'i' } }
      ];
    }

    // Sắp xếp
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOptions,
      populate: 'danhMuc'
    };

    const result = await SanPham.paginate(query, options);

    res.status(200).json({
      success: true,
      data: {
        sanPhams: result.docs,
        total: result.totalDocs,
        pages: result.totalPages,
        currentPage: result.page
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách sản phẩm'
    });
  }
};

/**
 * Lấy chi tiết sản phẩm
 */
const getSanPhamById = async (req, res) => {
  try {
    const { id } = req.params;
    const sanPham = await SanPham.findById(id).populate('danhMuc');

    if (!sanPham) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.status(200).json({
      success: true,
      data: sanPham
    });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy chi tiết sản phẩm'
    });
  }
};

/**
 * Cập nhật sản phẩm (Admin)
 */
const updateSanPham = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Kiểm tra sản phẩm tồn tại
    const sanPham = await SanPham.findById(id);
    if (!sanPham) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Kiểm tra tên sản phẩm trùng (nếu có thay đổi)
    if (updates.tenSanPham && updates.tenSanPham !== sanPham.tenSanPham) {
      const existingSanPham = await SanPham.findOne({ tenSanPham: updates.tenSanPham });
      if (existingSanPham) {
        return res.status(400).json({
          success: false,
          message: 'Tên sản phẩm đã tồn tại'
        });
      }
    }

    // Kiểm tra danh mục tồn tại (nếu có thay đổi)
    if (updates.danhMuc) {
      const DanhMuc = require('../models/DanhMuc.model');
      const categoryExists = await DanhMuc.findById(updates.danhMuc);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Danh mục không tồn tại'
        });
      }
    }

    // Cập nhật thông tin
    Object.keys(updates).forEach(key => {
      sanPham[key] = updates[key];
    });

    await sanPham.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: sanPham
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật sản phẩm'
    });
  }
};

/**
 * Xóa sản phẩm (Admin)
 */
const deleteSanPham = async (req, res) => {
  try {
    const { id } = req.params;

    // Thay vì xóa, chúng ta sẽ set hoatDong = false
    const sanPham = await SanPham.findByIdAndUpdate(
      id,
      { hoatDong: false },
      { new: true }
    );

    if (!sanPham) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Đã vô hiệu hóa sản phẩm thành công'
    });
  } catch (error) {
    console.error('Lỗi khi vô hiệu hóa sản phẩm:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi vô hiệu hóa sản phẩm'
    });
  }
};

module.exports = {
  createSanPham,
  getAllSanPham,
  getSanPhamById,
  updateSanPham,
  deleteSanPham
};