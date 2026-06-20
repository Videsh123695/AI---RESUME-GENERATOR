const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

/*
|--------------------------------------------------------------------------
| Authentication Middleware
|--------------------------------------------------------------------------
| Verify user token before accessing protected routes
|--------------------------------------------------------------------------
*/

async function authUser(req, res, next) {
  try {
    /*
    |--------------------------------------------------------------------------
    | Get Token From Cookie
    |--------------------------------------------------------------------------
    */

    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,

        message: "Authentication failed. Token not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check Token Blacklist
    |--------------------------------------------------------------------------
    */

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
      token,
    });

    if (isTokenBlacklisted) {
      return res.status(401).json({
        success: false,

        message: "Token expired. Please login again",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Verify JWT Token
    |--------------------------------------------------------------------------
    */

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    /*
    |--------------------------------------------------------------------------
    | JWT Expired Error
    |--------------------------------------------------------------------------
    */

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,

        message: "Session expired. Please login again",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Wrong Token Error
    |--------------------------------------------------------------------------
    */

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,

        message: "Invalid token",
      });
    }

    return res.status(500).json({
      success: false,

      message: "Internal server error in authentication",
    });
  }
}

module.exports = {
  authUser,
};
