const db = require("../models/index");
const config = require("../config/auth.config");
const readXlsxFile = require("read-excel-file/node");
const { division } = require("../models/index");
const Division = db.division;
const Op = db.Sequelize.Op;
const fs = require("fs")

exports.divisionList = async function(req,res){
    let  Searchattributes ={};
    if(req.query.search && req.query.status){
        Searchattributes = {
          where: {
            [Op.and]: [{name: {[Op.like]: `%${req.query.search}%`}},{school_id: req.params.schoolid},{status: req.query.status}],            
          }
        }        
    }else if(!req.query.search && req.query.status){
      Searchattributes = {
        where: {
          [Op.and]: [{school_id: req.params.schoolid},{status: req.query.status}],
        }
      } 
    }else if(req.query.search && !req.query.status){
      Searchattributes = {
        where: {
          [Op.and]: [{name: {[Op.like]: `%${req.query.search}%`}}, {school_id: req.params.schoolid}]
        }
      }
    } else{
      Searchattributes = {
        where: {
          [Op.and]: [{school_id: req.params.schoolid}],
        }
      }      
    }
    Division.findAll(Searchattributes).then(result => {
      if(result.length > 0){
        res.status(200).json({message:"Success",data:result}); 
      }else{
        res.status(200).json({message:"Sorry! No divisions found."}); 
      }
    }).catch(err => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while Fetching data."
      });
    });    
};
exports.divisionView =  async function(req,res){
  Division.findByPk(req.params.id).then(result => {
        if(result){
          res.status(200).json({message:"Success",data:result}); 
        }else{
          res.status(200).json({message:"Sorry! No division found."}); 
        }
    }).catch(err => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while Fetching data."
      });
    });  
}
exports.divisionCreate = async function(req,res){
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    Division.create({
      name: req.body.name,
      school_id: req.params.schoolid,       
      status: req.body.status || 'ACTIVE',
      created_by:req.user.id
    }).then(school => {
      res.status(201).json({message:"Success",data:school});
    }).catch(err => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while creating the division."
      });
    });       
};
exports.divisionUpdate = async function(req,res){
    if (!req.body) {
      res.status(400).json({
        message: "Content can not be empty!"
      });
    }
    const division = await Division.findOne({where: {
      [Op.and]: [{school_id: req.params.schoolid},{id: req.params.id}],
    }});
    if(division === null){
       res.status(204).json({message:"Sorry! No division found."}); 
    }else{
      division.name = req.body.name,    
      division.status = req.body.status
      await division.save();
      res.status(200).json({message:"Success",data:division}); 
    }     
}
exports.divisionDelete = async function(req,res){
  const id = req.params.id;
  const division = await Division.findOne({where: {
    [Op.and]: [{school_id: req.params.schoolid},{id: req.params.id}],
  }});
  if(division === null){
    res.status(204).json({message:"Sorry! No division found."}); 
  }else{
    await division.destroy();
    res.status(200).json({message:"division deleted successfully"}); 
  }
}
exports.divisionImport = async function(req,res){
  try {
      if (req.file == undefined) {
        return res.status(400).send("Please upload an excel file!");
      }
      let insertedDivisions = [];
      let failedDivisions = [];
      let path = __basedir + "/resources/static/assets/uploads/" + req.file.filename;
      readXlsxFile(path).then( async (rows) => {
        let divisions = [];
        let duplicateDivisions = [];
          rows.shift();
          rows.forEach( (row) => {
             let newDivision = {
              name: row[0],
              school_id: req.params.schoolid,
              image: row[1],
              status: row[2] || 'ACTIVE',
              created_by : req.user.id
            };
            console.log(newDivision);
            divisions.push(newDivision)                
          });
          var itemsProcessed = 0;
          divisions.forEach(async (division) => {
            const checkDivision = await Division.findOne({where: {
              [Op.and]: [{school_id: req.params.schoolid},{name: division.name}],
            }})
            if(checkDivision === null){
                    const divisionInsert = await Division.create({
                      name: division.name,
                      school_id: division.school_id,       
                      image: division.image,       
                      status: division.status,    
                      created_by: division.created_by
                    }); 
                    if(divisionInsert) {
                      var insertedDivision = {
                        name: division.name,                  
                      };
                      insertedDivisions.push(insertedDivision);   
                    } else {
                      let failedDivision = {
                        name: division.name,                  
                        error: err.message,                  
                      }
                      failedDivisions.push(failedDivision);
                    }       
            }else{
              var duplicateDivision = {
                name: division.name,                  
              };
              duplicateDivisions.push(duplicateDivision);
            }
            itemsProcessed++
            if(itemsProcessed === divisions.length) {
              callback(duplicateDivisions,insertedDivisions,failedDivisions);
            } 
          })                    
          function callback (duplicateDivisions,insertedDivisions,failedDivisions) { 
            console.log(path);
            fs.unlink(path, function(){console.log('Deleted excel')});
            if(insertedDivisions.length > 0){
              res.status(200).json({message:"division imported successfully",insertedDivisions:insertedDivisions,duplicateDivisions:duplicateDivisions,failedDivisions:failedDivisions}); 
            }else{
              res.status(200).json({message:"failed to import divisions",insertedDivisions:insertedDivisions,duplicateDivisions:duplicateDivisions,failedDivisions:failedDivisions});               
            }
          }

      });   

  } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Could not upload the file: " + req.file.originalname,
      });
  }
}