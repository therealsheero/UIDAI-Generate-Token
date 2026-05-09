const { GUARD2_TOKEN } =require("../utils/guard.config");

function guard2Auth(req, res, next) {

  const token = req.headers["x-guard-token"];

  if (token !== "GUARD2_SESSION") {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  next();
}

module.exports = guard2Auth;