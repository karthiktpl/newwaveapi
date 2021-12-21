const { body, validationResult } = require('express-validator');
const db = require("../models");
const School = db.school;
const Op = db.Sequelize.Op;
const schoolValidationRules = () => {
    return [
        body('name')
        .exists().withMessage('Name field is requiered.').bail()
        .not().isEmpty().withMessage('Name is requiered.')
        .isLength({max: 250 }).withMessage('Name must contain maximum 250 charactors.')
        .trim().escape()
        .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
                if(value!=''){
                    School.findOne({where: {
                        name: value
                    }}).then(school => {
                        if(school){
                            reject(new Error('School name is already in use'))
                        }else{
                            resolve(true)
                        }
                    });
                }else{
                    resolve(true)
                }
            });
        }),
        body('alias')
        .exists().withMessage('Name alias field is requiered.').bail()
        .not().isEmpty().withMessage('Name alias is requiered.')
        .isLength({max: 250 }).withMessage('Name alias must contain maximum 250 charactors.')
        .trim()
        .matches(/^[A-Za-z0-9_]+$/i).withMessage('Name alias must contain only aplphabets,_ and - characters.'),        
        body('address')
        .exists().withMessage('Address field is requiered.').bail()
        .not().isEmpty().withMessage('Address is requiered.').bail()
        .trim().escape(),    
        body('phone')
        .exists().withMessage('Phone field is requiered').bail()
        .not().isEmpty().withMessage('Phone is requiered').bail()
        .isMobilePhone().withMessage('Provide valid phone number.').bail()
        .trim().escape(),        
        body('email')
        .exists().withMessage('Email field is requiered.').bail()
        .not().isEmpty().withMessage('Email is requiered.').bail()
        .isEmail().withMessage('Provide valid email ID').normalizeEmail().bail()
        .trim().escape(),   
        body('status')
        .exists().withMessage('Status field is requiered')
        .not().isEmpty().withMessage('Status is requiered')
        .isIn(['ACTIVE','INACTIVE'])
    ]
}

const schoolUpdateValidationRules = () => {

    return [
        body('name')
        .exists().withMessage('Name field is requiered.').bail()
        .not().isEmpty().withMessage('Name is requiered.')
        .isLength({max: 250 }).withMessage('Name must contain maximum 250 charactors.')
        .trim().escape()
        .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
                if(value!=''){
                    School.findOne({where: {
                        name: value,
                        id: {[Op.not]:req.params.id}
                    }}).then(school => {
                        if(school){
                            reject(new Error('School name is already in use'))
                        }else{
                            resolve(true)
                        }
                    });
                }else{
                    resolve(true)
                }
            });
        }),
        body('address')
        .exists().withMessage('Address field is requiered.').bail()
        .not().isEmpty().withMessage('Address is requiered.').bail()
        .trim().escape(),    
        body('phone')
        .exists().withMessage('Phone field is requiered').bail()
        .not().isEmpty().withMessage('Phone is requiered').bail()
        .isMobilePhone().withMessage('Provide valid phone number.').bail()
        .trim().escape(),        
        body('email')
        .exists().withMessage('Email field is requiered.').bail()
        .not().isEmpty().withMessage('Email is requiered.').bail()
        .isEmail().withMessage('Provide valid email ID').normalizeEmail().bail()
        .trim().escape(),   
        body('status')
        .exists().withMessage('Status field is requiered').bail()
        .not().isEmpty().withMessage('Status is requiered').bail()
        .isIn(['ACTIVE','INACTIVE'])        
    ]

}
/* const schoolStatusValidationRules = () => {
    return [
        body('status')
        .exists().withMessage('Status field is requiered').bail()
        .not().isEmpty().withMessage('Status is requiered').bail()
        .isIn(['ACTIVE','INACTIVE'])
      ];
} */
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
    schoolValidationRules,
    schoolUpdateValidationRules,
    validate,
  }
