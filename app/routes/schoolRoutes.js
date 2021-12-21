const express = require('express')
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const {authenticateJWT,isAdmin, isSuperAdmin,isUser } = require('../middlewares/auth')
const { schoolValidationRules,schoolUpdateValidationRules, validate } = require('../validators/schoolValidator')

router.get('/', authenticateJWT, schoolController.schoolList);
router.get('/:id', authenticateJWT, schoolController.schoolView);
router.post('/', authenticateJWT, schoolValidationRules(), validate, schoolController.schoolCreate);
router.put('/:id', authenticateJWT, schoolUpdateValidationRules(), validate, schoolController.schoolUpdate);
router.delete('/:id',authenticateJWT,isAdmin,isSuperAdmin, schoolController.schoolDelete);
module.exports = router;
