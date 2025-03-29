const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ message: "❌ Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract Bearer token

    if (!token) {
        return res.status(401).json({ message: "❌ Invalid Authorization format" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId; // Attach user ID to request
        next();
    } catch (err) {
        res.status(401).json({ message: "❌ Invalid Token" });
    }
};
