const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Kết nối DB của anh

// Trang chủ
router.get('/', async (req, res) => {
    try {
        // Lấy toàn bộ sản phẩm, cái nào mới đăng thì hiện lên đầu
        const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
        
        // Gửi dữ liệu 'products' sang file index.ejs
        res.render('index', { products: products });
    } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
        res.render('index', { products: [] }); // Nếu lỗi thì hiện trang trống
    }
});
// Trang giới thiệu Tin Học Nguyễn Trinh
router.get('/gioi-thieu', (req, res) => {
    res.render('gioi-thieu');
});
module.exports = router;