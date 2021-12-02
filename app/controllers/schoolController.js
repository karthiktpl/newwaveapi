const School = require("../models/School")

exports.schoolCreate = async function(req,res){
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    const newSchool = new School({
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      fax: req.body.fax,
      email: req.body.email,      
      status: req.body.status || 'ACTIVE'
    });
    School.create(newSchool, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      else res.send(data);
    });    
/*   try{
      const savedSchool = await School.create(newSchool)
      return res.json({message:"success",data:savedSchool})
  }catch(err){
      return res.status(400).json({msg:err})
  } */
  
};