const express= require('express');

const authRouter=express.Router();

//  const authController=require('./controllers/auth.controller.js');

const {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
} = require('../controllers/auth.controller.js');

const {authUser}=require('../middleware/auth.middleware.js')

/**
 * @route POST /api/auth/register
 * @description regisetr a new user
 * @aceees public
 */

authRouter.post('/register', registerUserController);

/**
 * @route POST /api/auth/login
 * @description login the existing user with email  and password 
 * @aceees public
 */

authRouter.post('/login',loginUserController);

/**
 * @route GET /api/auth/logout
 * @description clear token from the user cookie and add the token in blacklist
 * @aceees public
 */

authRouter.get('/logout',logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @aceees private 
 */

authRouter.get('/get-me', authUser,getMeController )


module.exports=authRouter;