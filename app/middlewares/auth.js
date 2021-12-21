const jwt = require('jsonwebtoken');
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.secret, (err, user) => {
            if (err) {
                return res.status(403).json({
                    message: "User authentication failed."
                  });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({
            message: "You are not authorized to perform this action."
          });
        res.sendStatus(401);
    }
};
const isAdmin = (req, res, next) => {
    User.findByPk(req.user.id).then(user => {
        if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
            next();
            return;
        }
        res.status(403).send({
            message: "Require Admin/Super Admin Role!"
        });
        return;
    });
};  
const isSuperAdmin = (req, res, next) => {
    const userId = req.user.id;
    console.log("userId",userId);
    User.findByPk(userId).then(user => {
        if (user.role === "SUPERADMIN") {
            next();
            return;
        }
        res.status(403).send({
            message: "Require Super Admin Role!"
        });
        return;
    });
};  
const isUser = (req, res, next) => {
    User.findByPk(req.user.id).then(user => {
        if (user.role === "USER" || user.role === "SUPERADMIN" || user.role === "ADMIN") {
            next();
            return;
        }
        res.status(403).send({
            message: "Require User Role!"
        });
        return;
    });
};  

module.exports={authenticateJWT,isAdmin, isSuperAdmin,isUser};