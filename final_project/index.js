const express = require('express');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Session middleware (applied globally)
app.use(session({
    secret: "fingerprint_customer",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Routes
app.use("/customer", customer_routes); // Authenticated routes
app.use("/", genl_routes); // General routes

// Start the server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));