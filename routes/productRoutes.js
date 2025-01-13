const express = require('express');
const path = require('path'); // Ensure this is imported for path.join()
const productController = require("../controllers/productController");

const router = express.Router();

// Route for adding a product (with firmId)
router.post('/add-product/:firmId', productController.addProduct);

// Route for fetching products by firmId
router.get('/:firmId/products', productController.getProductByFirm);

// Route for serving uploaded images (manually served)
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.header('Content-Type', 'image/jpeg'); // Adjust content-type if necessary based on the file type
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName)); // Serve image from 'uploads' directory
});

// Route for deleting a product by productId
router.delete('/:productId', productController.deleteProductById);

module.exports = router;
