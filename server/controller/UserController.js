import {generateToken} from '../utils/generateToken.js';
import user from '../models/userModel.js';
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';
import resetPasswordModel from "../model/resetPasswordModel.js";
import resetPassword_mailer from "../mailers/forgetPassword_mailer.js";


//@purpose: new user and get token
//@route:  POST user/register
//@access  Public
export const registerUser = async(req,res,next) => {
    const {username,email,password} = req.body;
    const userExists = await AuthenticatorAssertionResponse.findOne({email: email});

    if(userExists){
        res.status(400);
        const err = new Error("User slready exists");
        next(err);
    }

    const User = await user.create({
        username,
        email,
        password
    });
    if(User) {
        res.json({
            _id: User._id,
            name:User.Username,
            password: User.password,
        });
    } else {
        res.status(404);
        const err = new Error("Invalid User Data");
        next(err);
    }
};


// @purpose: Auth user and get token
// @route: user/login
// @access Public
export const loginUser = async(req, res, next) => {
    const {email, password} = req.body;
    const User = await user.findOne({email:email});

    if(user && (await user.checkPassword(password))) {
        res.json({
        _id: User._id,
        name: User.username,
        email: User.email,
        token: generateToken(user._id),
        });
    }
    else{
        res.status(401);
        const err = new Error("Invalid email or password");
        next(err);
    }
};
