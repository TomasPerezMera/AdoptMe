import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import { ErrorFactory } from "../utils/customErrors.js";
import { logger } from "../utils/logger.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';


const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        // Validación con custom errors.
        if (!first_name || !last_name || !email || !password) {
            const missingFields = [];
            if (!first_name) missingFields.push('first_name');
            if (!last_name) missingFields.push('last_name');
            if (!email) missingFields.push('email');
            if (!password) missingFields.push('password');
            throw ErrorFactory.userIncompleteValues(missingFields);
        }
        const exists = await usersService.getUserByEmail(email);
        if (exists) {
            throw ErrorFactory.userAlreadyExists(email);
        }
        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        };
        let result = await usersService.create(user);
        logger.info('User registered successfully', { userId: result._id, email });
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        logger.error('Error in register', { error: error.message });
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw ErrorFactory.userIncompleteValues(['email', 'password']);
        }
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            throw ErrorFactory.userNotFound();
        }
        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            throw ErrorFactory.invalidCredentials();
        }
        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto, process.env.JWT_SECRET || 'tokenSecretJWT', {expiresIn:"1h"});
        logger.info('User logged in', { email });
        res.cookie('coderCookie', token, { maxAge: 3600000 })
        .send({ status: "success", message: "Logged in" });
    } catch (error) {
        logger.error('Error in login', { error: error.message });
        next(error);
    }
};

const current = async (req, res, next) => {
    try {
        const cookie = req.cookies['coderCookie'];
        const user = jwt.verify(cookie, 'tokenSecretJWT');
        if (user) {
            return res.send({ status: "success", payload: user });
        }
    } catch (error) {
        logger.error('Error in current', { error: error.message });
        next(error);
    }
};

const unprotectedLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw ErrorFactory.userIncompleteValues(['email', 'password']);
        }
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            throw ErrorFactory.userNotFound();
        }
        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            throw ErrorFactory.invalidCredentials();
        }
        const token = jwt.sign(user.toObject(), 'tokenSecretJWT', { expiresIn: "1h" });
        logger.warning('Unprotected login used', { email });
        res.cookie('unprotectedCookie', token, { maxAge: 3600000 })
        .send({ status: "success", message: "Unprotected Logged in" });
    } catch (error) {
        logger.error('Error in unprotectedLogin', { error: error.message });
        next(error);
    }
};

const unprotectedCurrent = async (req, res, next) => {
    try {
        const cookie = req.cookies['unprotectedCookie'];
        const user = jwt.verify(cookie, 'tokenSecretJWT');
        if (user) {
            return res.send({ status: "success", payload: user });
        }
    } catch (error) {
        logger.error('Error in unprotectedCurrent', { error: error.message });
        next(error);
    }
};

export default {
    current,
    login,
    register,
    unprotectedLogin,
    unprotectedCurrent
};