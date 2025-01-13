const Product = require("../models/Product");
const multer = require("multer");
const Firm = require('../models/Firm');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Multer config with file size limit and file type filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extname && mimeType) {
            return cb(null, true);
        } else {
            return cb(new Error('Only image files are allowed.'));
        }
    }
}).single('image'); // For single image uploads

// Middleware to handle Multer errors
const handleFileUploadError = (err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else {
            return res.status(400).json({ error: 'Invalid file type' });
        }
    }
    next();
};

const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;

        if (!image) {
            return res.status(400).json({ error: "Image is required." });
        }

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }

        const product = new Product({
            productName,
            price,
            category,
            bestSeller,
            description,
            image,
            firm: firm._id
        });

        const savedProduct = await product.save();
        firm.products.push(savedProduct);

        await firm.save();

        res.status(200).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }

        const firmName = firm.firmName;
        const products = await Product.find({ firm: firmId });

        res.status(200).json({ firmName, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: "No product found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { addProduct: [upload, handleFileUploadError, addProduct], getProductByFirm, deleteProductById  };
