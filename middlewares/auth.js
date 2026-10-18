const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const tokenMatch = authHeader.match(/^Bearer\s+(\S+)$/i);

    if (!tokenMatch) {
        return res.status(401).json({ error: "A valid bearer token is required." });
    }

    let payload;
    try {
        payload = jwt.verify(tokenMatch[1], process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }

    if (!payload || typeof payload.id !== "string") {
        return res.status(401).json({ error: "Invalid token payload." });
    }

    try {
        req.user = await User.findById(payload.id);
    } catch (error) {
        console.error("Could not verify the authenticated user:", error);
        return res.status(500).json({ error: "Could not verify the account." });
    }

    if (!req.user) {
        return res.status(401).json({ error: "Account no longer exists." });
    }

    return next();
};

module.exports = { isAuthenticated };