const express = require("express");
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 4000;

dotEnv.config();

app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((error) => console.log(error));

// Middleware to parse JSON requests
app.use(express.json());

// Route to handle root URL (should be defined before other routes)
app.use('/', (req, res) => {
    res.send("<h1> Welcome to SELENOPHILE_SRI.03");
});

// Route handling
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);

// Serve static files from 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server started and running at http://localhost:${PORT}`);
});
