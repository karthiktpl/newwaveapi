const { body, validationResult } = require('express-validator');
const db = require("../models");
const Division = db.division;
const Op = db.Sequelize.Op;
const divisionValidationRules = () => {
    return [
        body('name')
        .exists().withMessage('Name field is requiered.').bail()
        .not().isEmpty().withMessage('Name is requiered.')
        .isLength({max: 250 }).withMessage('Name must contain maximum 100 charactors.')
        .trim().escape()
        .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
                if(value!=''){
                    Division.findOne({where: {
                        name: value,
                        school_id: req.params.schoolid
                    }}).then(school => {
                        if(school){
                            reject(new Error('Division name is already in use for this school'))
                        }else{
                            resolve(true)
                        }
                    });
                }else{
                    resolve(true)
                }
            });
        }),     
        body('status')
        .exists().withMessage('Status field is requiered')
        .not().isEmpty().withMessage('Status is requiered')
        .isIn(['ACTIVE','INACTIVE'])
    ]
}

const divisionUpdateValidationRules = () => {

    return [
        body('name')
        .exists().withMessage('Name field is requiered.').bail()
        .not().isEmpty().withMessage('Name is requiered.')
        .isLength({max: 250 }).withMessage('Name must contain maximum 250 charactors.')
        .trim().escape()
        .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
                if(value!=''){
                    Division.findOne({where: {
                        name: value,
                        school_id: req.params.schoolid,
                        id: {[Op.not]:req.params.id}
                    }}).then(school => {
                        if(school){
                            reject(new Error('Division name is already in use for this school'))
                        }else{
                            resolve(true)
                        }
                    });
                }else{
                    resolve(true)
                }
            });
        }),  
        body('status')
        .exists().withMessage('Status field is requiered').bail()
        .not().isEmpty().withMessage('Status is requiered').bail()
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
    divisionValidationRules,
    divisionUpdateValidationRules,
    validate,
  }
