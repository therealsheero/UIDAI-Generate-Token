const { GUARD3_TOKEN } =require("../utils/guard.config");

function guard3Auth(req, res, next) {

  const token = req.headers["x-guard-token"];

  if (token !== "GUARD3_SESSION") {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  next();
}

module.exports = guard3Auth;