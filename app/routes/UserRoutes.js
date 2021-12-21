const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const {authenticateJWT,isAdmin, isSuperAdmin,isUser } = require('../middlewares/auth')
const { userValidationRules,userChangepasswordRules,userLoginRules,userUpdateValidationRules,userStatusValidationRules, validate } = require('../validators/userValidator')
router.post('/', authenticateJWT,isSuperAdmin,userValidationRules(), validate, userController.userCreate);
router.post('/login', userLoginRules(), validate, userController.userLogin);
router.put('/changepassword', authenticateJWT, userChangepasswordRules(), validate, userController.userChangepassword);
router.get('/', authenticateJWT, userController.userList);
/* router.post('/token', userController.TokenRefresh); */
router.get('/:id', authenticateJWT, userController.userView);
router.put('/:id', authenticateJWT, isAdmin, userUpdateValidationRules(), validate, userController.userUpdate);
router.delete('/:id', authenticateJWT, isSuperAdmin, userController.userDelete);
module.exports = router;
