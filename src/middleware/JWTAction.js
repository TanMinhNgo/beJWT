import jwt from 'jsonwebtoken';
require('dotenv').config();

const createJWT = (data) => {
    let payload = data;
    let key = process.env.JWT_SECRET;

    let token = null;

    try {
        token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRES_IN });
    } catch (error) {
        console.error('Error creating JWT:', error);
    }
    return token;
};

const verifyJWT = (token) => {
    let key = process.env.JWT_SECRET;
    let decoded = null;

    try {
        decoded = jwt.verify(token, key);
    } catch (error) {
        console.error('Error verifying JWT:', error);
    }

    return decoded;
};

const checkUserJWT = (req, res, next) => {
    let cookies = req.cookies;
    if (cookies?.jwt) {
        let token = cookies.jwt;
        let decoded = verifyJWT(token);
        if (decoded) {
            req.user = decoded;
            req.token = token;
            next();
        } else {
            res.status(401).json({
                message: "Unauthorized"
            });
        }
    } else {
        res.status(401).json({
            message: "Unauthorized"
        });
    }
}

const checkUserPermission = (req, res, next) => {
    if (req.user) {
        let roles = req.user.groupWithRoles.Roles;
        let currentPath = req.path;

        if (!roles || roles.length === 0) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        let canAccess = roles.some(role => role.url === currentPath);
        if (canAccess) {
            next();
        } else {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
    }
}

module.exports = {
    createJWT,
    verifyJWT,
    checkUserJWT,
    checkUserPermission
};