const { GUARD_TOKEN } = require("../utils/guard.config");

function guardAuth(req, res, next) {
  const token = req.headers["x-guard-token"];

  if (token !== "GUARD_SESSION") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}

module.exports = guardAuth;
