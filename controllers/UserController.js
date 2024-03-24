const userModel = require("../models/UserModel");
const passwordUtil = require("../utils/PasswordUtill");
const tokenUtil = require("../utils/TokenUtil");
const mailUtil = require('../utils/MailUtil')

const createUser = async (req, res) => {

  const hashedPassword = await passwordUtil.hashPassword(req.body.password);
  const user = Object.assign(req.body, { password: hashedPassword });
  // console.log(user);

  try {
    if(user){
    const savedUser = await userModel.create(user);
    mailUtil.sendMail(user.email , 'Welcome to Expense Manager' ,`<<h2>Hello , ${savedUser.firstName}</h2>`+ '\n<h4>Successfully created account at Expense Manager</h4>')  
    

    res.status(201).json({
      status: "success",
      data: savedUser,
    });
  }else{
    res.status(404).json({
      status: "fail",
      message : "User not getting from req body"
    });
  }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const getAllUsersById = async (req, res) => {
  try {
    const users = await userModel.find({_id:req.params.id }).populate("role");
    if (users) {
      res.status(200).json({
        status: "success",
        data: users,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "No user found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;


  try {
    const userFromEmail = await userModel.findOne({ email: email }).populate("role");
    // console.log(userFromEmail)
    if (userFromEmail) {
      const isPasswordMatched = await passwordUtil.comparePassword(
        password,
        userFromEmail.password
      );

      if (isPasswordMatched) {
        const token = tokenUtil.generateToken(userFromEmail.toObject());
        res.status(200).json({
          status: "success",
          data: token,
          role: userFromEmail.role,
          id : userFromEmail._id,
        });

      } else {
        res.status(401).json({
          status: "fail",
          message: "Incorrect password",
        });

      }
    } else {
      res.status(404).json({
        status: "fail",
        message: "No user found",
      });

    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });

  }
};

const employeeExist = async(req,res)=>{
  
  try {
      const user = await userModel.findOne({email:req.body.email})
      // console.log("uusser",user)
      if(user != undefined || null){
        res.status(201).json({
          data : user,
          status:"success",
          message:"User found"
        })
      }else{
        res.status(404).json({
          data : [],
          status:"fail",
          message:"User Not found"
        })
      }
    } catch (error) {
      res.status(500).json({
       
        status:"fail",
        message:error.message
      })
    }
}

const resetPassword = async(req,res)=>{
  const hashedPassword = await passwordUtil.hashPassword(req.body.password);
  try {
    const upadatedPass  = await userModel.findOneAndUpdate({email:req.body.email},{password:hashedPassword},{new:true})
   
    res.status(201).json({
      data : upadatedPass,
      status:"success",
      message:"Password updated successfully"
    })
   
   
  } catch (error) {
    res.status(500).json({
      data : upadatedPass,
      status:"fail",
      message:"Password updatinmg error"
    })
  }
}
module.exports = {
  createUser,
  getAllUsersById,
  loginUser,
  employeeExist,
  resetPassword,
};