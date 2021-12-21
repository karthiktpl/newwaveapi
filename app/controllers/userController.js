const db = require("../models/index");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


exports.userCreate = async function(req,res){
    if (!req.body) {
      res.status(400).json({
        message: "Content can not be empty!"
      });
    }
    User.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role || 'USER',     
      last_login: '',     
      status: req.body.status || 'ACTIVE'
    }).then(user => {
      res.json({message:"Success",data:{
        id : user.id,
        username : user.username,
        role : user.role,
        last_login : user.last_login,
        status : user.status,
        updatedAt : user.updatedAt,
        createdAt : user.createdAt,
      }});
    }).catch(err => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while creating the User."
      });
    }); 
};
exports.userLogin = async function(req,res){
    if (!req.body) {
      res.status(400).json({
        message: "Content can not be empty!"
      });
    }  
    const { username, password } = req.body;
    User.findOne({
      where: {
        username: req.body.username
      }
    }).then(user => {
        if (!user) {
          return res.status(404).send({ message: "Username or password is incorrect." });
        }
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        ); 
        if (!passwordIsValid) {
          return res.status(404).send({ message: "Username or password is incorrect." });
        } 
        var token = jwt.sign({ id: user.id, username: user.username,  role: user.role }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
        user.last_login = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        user.save()
        res.json({message:"Login successfull",data:{
          id : user.id,
          username : user.username,
          role : user.role,
          last_login : user.last_login,
          status : user.status,
          updatedAt : user.updatedAt,
          createdAt : user.createdAt,
          accessToken:token
        }});                            
    }).catch(err => {
      res.status(500).send({ message: err.message });
    })
}
 exports.userChangepassword = async function(req,res){
  if (!req.body) {
    res.status(400).json({
      message: "Content can not be empty!"
    });
  }
  const id = req.body.user;
  const password = bcrypt.hashSync(req.body.password, 8);
  if(password){
    User.update({password:password},{
      where: {
        id: id
      }
    }).then(result => {
        res.json({message:"Password changes successfully"});   
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        message:
          err.message || "Some error occurred while changing password."
      });
    })
  }
   
}

exports.userList = async function(req,res){
    // const searchQuery = (req.query.search ? [{username: searchQuery}, {role: searchQuery}] : '');
    // const status = (req.query.status ? [{status: status}] : '' );
    let  Searchattributes ={};
    if(req.query.search && req.query.status){
        Searchattributes = {
          attributes: ['id', 'username','role','last_login','status','updatedAt','createdAt'],
          where: {
            [Op.or]: [{username: {[Op.like]: `%${req.query.search}%`}}, {role: {[Op.like]: `%${req.query.search}%`}}],
            [Op.and]: [{status: req.query.status}],            
          }
        }        
    }else if(!req.query.search && req.query.status){
      Searchattributes = {
        attributes: ['id', 'username','role','last_login','status','updatedAt','createdAt'],
        where: {
          [Op.and]: [{status: req.query.status}],            
        }
      } 
    }else if(req.query.search && !req.query.status){
      Searchattributes = {
        attributes: ['id', 'username','role','last_login','status','updatedAt','createdAt'],
        where: {
          [Op.or]: [{username: {[Op.like]: `%${req.query.search}%`}}, {role: {[Op.like]: `%${req.query.search}%`}}],
        }
      }
    }
    User.findAll(Searchattributes).then(result => {
      if(result.length > 0){
        res.status(200).json({message:"Success",data:result}); 
      }else{
        res.status(200).json({message:"Sorry! No users found."}); 
      }
    }).catch(err => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while Fetching data."
      });
    });
};

exports.userView =  async function(req,res){
    User.findByPk(req.params.id,{
      attributes: ['id', 'username','role','last_login','status','updatedAt','createdAt']}).then(result => {
        if(result){
          res.status(200).json({message:"Success",data:result}); 
        }else{
          res.status(200).json({message:"Sorry! No user found."}); 
        }
    }).catch(err => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while Fetching data."
      });
    })
}
exports.userUpdate = async function(req,res){

    if (!req.body) {
      res.status(400).json({
        message: "Content can not be empty!"
      });
    }
    const id = req.params.id;
    const user = await User.findByPk(req.params.id,{
      attributes: ['id', 'username','role','last_login','status','updatedAt','createdAt']});
    if(user === null){
       res.status(204).send({message:"Sorry! No user found."}); 
    }else{
      user.username = req.body.username,
      user.role = req.body.role || 'USER',    
      user.status = req.body.status || 'ACTIVE'
      await user.save();
      res.status(200).json({message:"Success",data:user}); 
    }

}

exports.userDelete = async function(req,res){
  const id = req.params.id;
  const user = await User.findByPk(req.params.id);
  if(user === null){
    res.status(204).json({message:"Sorry! No user found."}); 
  }else{
    await user.destroy();
    res.status(200).json({message:"User deleted successfully"}); 
  }
}

/* exports.TokenRefresh = async function(req,res){
    const { token } = req.body;

    if (!token) {
      return res.sendStatus(401);
    }
    console.log(refreshTokens);
    if (!refreshTokens.includes(token)) {
      return res.sendStatus(403);
    }

    jwt.verify(token, process.env.REFRESHSECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, process.env.SECRET, { expiresIn: '20m' });

        res.json({accessToken:accessToken});      
    });
} */