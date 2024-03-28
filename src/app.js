const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

// Routes
const productRoutes = require("./routes/products.routes");
const categoriesRoutes = require("./routes/categories.routes");
const suppliersRoutes = require('./routes/suppliers.routes')
const customersRoutes = require('./routes/customers.routes')
const userRoutes = require('./routes/user.routes')

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// EndPoints

app.use([
    productRoutes,
    categoriesRoutes,
    suppliersRoutes,
    customersRoutes,
    userRoutes
])


module.exports = app;
