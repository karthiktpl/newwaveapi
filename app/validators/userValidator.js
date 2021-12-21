const { body, validationResult } = require('express-validator');
const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const userValidationRules = () => {
    return [
        body('username')
        .exists().withMessage('Username field is requiered.').bail()
        .not().isEmpty().withMessage('Username is requiered.')
        .isLength({max: 50 }).withMessage('Username must contain maximum 50 charactors.')
        .trim().escape()
        .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
                if(value!=''){   
                    User.findOne({where: {
                        username: value
                    }}).then(user => {
                        if(user){
                            reject(new Error('Username is already in use'))
                        }else{
                            resolve(true)
                        }
                    })                 
                }else{
                    resolve(true)
                }
            });
        }),
        body('password')
        .exists().withMessage('Password field is requiered.').bail()
        .not().isEmpty().withMessage('Password is requiered.').bail()
        .trim().escape(),
        body('confirmPassword')
        .exists().withMessage('Confirm Password field is requiered.').bail()
        .not().isEmpty().withMessage('Confirm Password is requiered.').bail()
        .trim().escape()
        .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
                if(value!=req.body.password){
                    reject(new Error('Confirm password doesnot match'))
                }else{
                    resolve(true)
                }
            });
        }),            
        body('role')
        .exists().withMessage('Role field is requiered.').bail()
        .not().isEmpty().withMessage('Role is requiered.').bail()
        .trim().escape()
        .isIn(['SUPERADMIN','ADMIN','USER']),             
        body('status')
        .exists().withMessage('Status field is requiered')
        .not().isEmpty().withMessage('Status is requiered')
        .isIn(['ACTIVE','INACTIVE'])
    ]
}

const userChangepasswordRules = () => {
    return [
        body('user')
        .exists().withMessage('User ID field is requiered.').bail()
        .not().isEmpty().withMessage('User ID is requiered.').bail()
        .trim().escape(),
        body('password')
        .exists().withMessage('Password field is requiered.').bail()
        .not().isEmpty().withMessage('Password is requiered.').bail()
        .trim().escape(),
        body('confirmPassword')
        .exists().withMessage('Confirm Password field is requiered.').bail()
        .not().isEmpty().withMessage('Confirm Password is requiered.').bail()
        .trim().escape()
        .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
                if(value!=req.body.password){
                    reject(new Error('Confirm password doesnot match'))
                }else{
                    resolve(true)
                }
            });
        })
    ]
}
const userLoginRules = ()=> {
    return [ 
        body('username')
        .exists().withMessage('Username field is requiered.').bail()
        .not().isEmpty().withMessage('Username is requiered.').bail()
        .trim().escape(),
        body('password')
        .exists().withMessage('Password field is requiered.').bail()
        .not().isEmpty().withMessage('Password is requiered.').bail()
        .trim().escape() 
    ]
}
const userUpdateValidationRules = () => {

    return [
        body('username')
        .exists().withMessage('Username field is requiered.').bail()
        .not().isEmpty().withMessage('Username is requiered.')
        .isLength({max: 50 }).withMessage('Username must contain maximum 50 charactors.')
        .trim().escape()
        .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
                if(value!=''){   
                    User.findOne({where: {
                        username: value,
                        id: {[Op.not]:req.params.id}
                    }}).then(user => {
                        if(user){
                            reject(new Error('Username is already in use'))
                        }else{
                            resolve(true)
                        }
                    })                 
                }else{
                    resolve(true)
                }
            });
        }),           
        body('role')
        .exists().withMessage('Role field is requiered.').bail()
        .not().isEmpty().withMessage('Role is requiered.').bail()
        .trim().escape()
        .isIn(['SUPERADMIN','ADMIN','USER']),             
        body('status')
        .exists().withMessage('Status field is requiered')
        .not().isEmpty().withMessage('Status is requiered')
        .isIn(['ACTIVE','INACTIVE'])
    ]

}
const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.status(422).json({
      message :"Error",error:extractedErrors
    })
  }
module.exports = {
    userValidationRules,
    userChangepasswordRules,
    userLoginRules,
    userUpdateValidationRules,
    validate,
  }
