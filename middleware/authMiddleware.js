const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Expect header as: "Bearer <token>"
    if (!token) return res.status(401).json({ msg: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; // attach userId to request
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
