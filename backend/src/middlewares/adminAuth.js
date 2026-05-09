const { ADMIN_TOKEN } = require("../utils/admin.config");

function adminAuth(req, res, next) {
  const token = req.headers["x-admin-token"];

  if (token !== "ADMIN_SESSION") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}

module.exports = adminAuth;