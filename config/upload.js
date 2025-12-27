const multer = require('multer');
const path = require('path');

// Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ảnh sẽ được lưu vào thư mục này
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        // Đặt tên file mới = Tên gốc + Thời gian hiện tại (để tránh trùng tên) + Đuôi file
        // Ví dụ: laptop-dell-167888999.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Bộ lọc chỉ cho phép upload ảnh (jpg, png, jpeg)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Chỉ được phép upload file ảnh!'), false);
    }
};

// Khởi tạo upload với giới hạn dung lượng (ví dụ 5MB)
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    fileFilter: fileFilter
});

module.exports = upload;