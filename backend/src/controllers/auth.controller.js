const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

/*
|--------------------------------------------------------------------------
| Common Cookie Options
|--------------------------------------------------------------------------
*/

const cookieOptions = {
  httpOnly: true,

  secure: process.env.NODE_ENV === "production",

  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

  maxAge: 24 * 60 * 60 * 1000,
};

/*
|--------------------------------------------------------------------------
| Generate Token Helper
|--------------------------------------------------------------------------
*/

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "1d",
    },
  );
}

/**
 * @name registerUserController
 * @description register a new user
 * @access public
 */

async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, email and password",
      });
    }

    const isUseralreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUseralreadyExists) {
      return res.status(409).json({
        success: false,

        message: "Account already exists with email or username",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,

      email,

      password: hash,
    });

    const token = generateToken(newUser);

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,

      message: "User registered successfully",

      user: {
        id: newUser._id,

        username: newUser.username,

        email: newUser.email,
      },

      token,
    });
  } catch (error) {
    console.error("Register Error:", error.message);

    return res.status(500).json({
      success: false,

      message: "Internal server error while registering user",
    });
  }
}

/**
 * @name loginUserController
 * @description login user
 * @access public
 */

async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,

        message: "Please provide email and password",
      });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,

        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,

        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,

      message: "User logged in successfully",

      user: {
        id: user._id,

        username: user.username,

        email: user.email,
      },

      token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error while login",
    });
  }
}

/**
 * @name logoutUserController
 * @description logout user
 * @access private
 */

async function logoutUserController(req, res) {
  try {
    const token = req.cookies?.token;

    if (token) {
      await tokenBlacklistModel.create({
        token,
      });
    }

    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      success: true,

      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error.message);

    return res.status(500).json({
      success: false,

      message: "Internal server error while logout",
    });
  }
}

/**
 * @name getMeController
 * @description get current user
 * @access private
 */

async function getMeController(req, res) {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,

      message: "User details fetched successfully",

      user,
    });
  } catch (error) {
    console.error("GetMe Error:", error.message);

    return res.status(500).json({
      success: false,

      message: "Internal server error",
    });
  }
}

module.exports = {
  registerUserController,

  loginUserController,

  logoutUserController,

  getMeController,
};
