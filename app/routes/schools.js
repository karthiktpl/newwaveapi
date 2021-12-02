const express = require('express')
const router = express.Router();
const schoolController = require('../controllers/schoolController');
// const { departmentValidationrules,departmentUpdateValidationrules,departmentStatusValidationrules, validate } = require('../../validators/departmentValidator')
//get all members
// router.get('/', departmentController.departmentList);
// router.get('/:id',departmentController.departmentView)
router.post('/', schoolController.schoolCreate);
router.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
  });
// router.put('/:id', departmentUpdateValidationrules(), validate, departmentController.departmentUpdate);
// router.put('/status/:id',departmentStatusValidationrules(), validate,departmentController.departmentStatus);
// router.delete('/:id',departmentController.departmentDelete);
module.exports = router;
