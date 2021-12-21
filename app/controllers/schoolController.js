const db = require("../models/index");
var fs = require('fs');
const config = require("../config/auth.config");
const School = db.school;
const Op = db.Sequelize.Op;

exports.schoolList = async function(req,res){
    let  Searchattributes ={};
    if(req.query.search && req.query.status){
        Searchattributes = {
          where: {
            [Op.or]: [{name: {[Op.like]: `%${req.query.search}%`}}, {address: {[Op.like]: `%${req.query.search}%`}}, {email: {[Op.like]: `%${req.query.search}%`}}, {phone: {[Op.like]: `%${req.query.search}%`}}, {fax: {[Op.like]: `%${req.query.search}%`}}],
            [Op.and]: [{status: req.query.status}],            
          }
        }        
    }else if(!req.query.search && req.query.status){
      Searchattributes = {
        where: {
          [Op.and]: [{status: req.query.status}],            
        }
      } 
    }else if(req.query.search && !req.query.status){
      Searchattributes = {
        where: {
          [Op.or]: [{name: {[Op.like]: `%${req.query.search}%`}}, {address: {[Op.like]: `%${req.query.search}%`}}, {email: {[Op.like]: `%${req.query.search}%`}}, {phone: {[Op.like]: `%${req.query.search}%`}}, {fax: {[Op.like]: `%${req.query.search}%`}}],
        }
      }
    }
    School.findAll(Searchattributes).then(result => {
      if(result.length > 0){
        res.status(200).json({message:"Success",data:result}); 
      }else{
        res.status(200).json({message:"Sorry! No schools found."}); 
      }
    }).catch(err => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while Fetching data."
      });
    });    
};
exports.schoolView =  async function(req,res){
    School.findByPk(req.params.id).then(result => {
        if(result){
          res.status(200).json({message:"Success",data:result}); 
        }else{
          res.status(200).json({message:"Sorry! No school found."}); 
        }
    }).catch(err => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while Fetching data."
      });
    });  
}
exports.schoolCreate = async function(req,res){
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    let diretory = req.body.alias;
    School.create({
      name: req.body.name,
      alias: req.body.alias,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      fax: req.body.fax,    
      folder_path:diretory,       
      status: req.body.status || 'ACTIVE',
      created_by:req.user.id
    }).then(school => {
      if (!fs.existsSync(diretory)) {
        fs.mkdirSync(diretory, {
          recursive: true
        });
        fs.mkdirSync(diretory+'/students', {
          recursive: true
        });
        fs.mkdirSync(diretory+'/divisions', {
          recursive: true
        });
      }
      res.json({message:"Success",data:school});
    }).catch(err => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while creating the School."
      });
    });       
};
exports.schoolUpdate = async function(req,res){
    if (!req.body) {
      res.status(400).json({
        message: "Content can not be empty!"
      });
    }
    const school = await School.findByPk(req.params.id);
    if(school === null){
       res.status(204).send({message:"Sorry! No school found."}); 
    }else{
      school.name = req.body.name,
      school.address = req.body.address,
      school.email = req.body.email,
      school.phone = req.body.phone,
      school.fax = req.body.fax,
      school.email = req.body.email,      
      school.status = req.body.status
      await school.save();
      res.status(200).json({message:"Success",data:school}); 
    }     
}
exports.schoolDelete = async function(req,res){
  const id = req.params.id;
  const school = await School.findByPk(req.params.id);
  if(school === null){
    res.status(204).json({message:"Sorry! No school found."}); 
  }else{
    await school.destroy();
    res.status(200).json({message:"School deleted successfully"}); 
  }
}