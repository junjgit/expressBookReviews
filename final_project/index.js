const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken'); // Ensure jwt is required for token verification
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Session middleware (applied globally)
app.use(session({
    secret: "fingerprint_customer", // Secret key for session encryption
    resave: false, // Avoid resaving unchanged sessions
    saveUninitialized: true // Save new but unmodified sessions
    // Removed the cookie configuration
}));

// Middleware to authenticate users for /customer/auth/* routes
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        const token = req.session.authorization['accessToken']; // Access Token
        jwt.verify(token, "access", (err, user) => {
            if (err) {
                return res.status(403).json({ message: "User not authenticated" });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Routes
app.use("/customer", customer_routes); // Authenticated routes
app.use("/", genl_routes); // General routes (original and new Axios-based endpoints)

// Start the server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));