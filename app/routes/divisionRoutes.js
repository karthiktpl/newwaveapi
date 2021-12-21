const express = require('express')
const router = express.Router();
const divisionController = require('../controllers/divisionController');
const {authenticateJWT,isAdmin, isSuperAdmin,isUser } = require('../middlewares/auth')
const { divisionValidationRules,divisionUpdateValidationRules, validate } = require('../validators/divisionValidator')
const upload = require('../middlewares/excelupload');


router.get('/school/:schoolid', authenticateJWT, divisionController.divisionList);
router.get('/school/:schoolid/:id', authenticateJWT, divisionController.divisionView);
router.post('/school/:schoolid', authenticateJWT, divisionValidationRules(), validate, divisionController.divisionCreate);
router.put('/:school/:schoolid/:id/', authenticateJWT, divisionUpdateValidationRules(), validate, divisionController.divisionUpdate);
router.delete('/:school/:schoolid/:id',authenticateJWT,isAdmin,isSuperAdmin, divisionController.divisionDelete);
router.post('/school/:schoolid/import', authenticateJWT, upload.single("file"), divisionController.divisionImport);
module.exports = router;
