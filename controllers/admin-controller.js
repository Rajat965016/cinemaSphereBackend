import Admin from '../models/Admin.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

export const addAdmin = async (req,res,next) => {
    const {email, password} = req.body;
    
    if(
        !email &&
        email.trim()==="" &&
        !password && 
        password.trim()==="" 
    ){
         return res.status(422).json({message : "Invalid inputs"});
    }
    let existingAdmin;

    try {
        existingAdmin = await Admin.findOne({email})
    } catch (error) {
        console.log(error)
    }
    if(existingAdmin){
        return res.status(400).json({message : "Admin already exits"});
    }
    let admin;
    const hashedPass = bcrypt.hashSync(password)
    try {
        admin = new Admin({
            email, password : hashedPass
        })
        admin = await admin.save();
    } catch (error) {
        console.log(error)
    }
    if(!admin){
        return res.status(500).json({message :"Unable to add admin"})
    }
    return res.status(200).json({admin});
}

export const login = async (req,res,next) =>{
    const {email,password} = req.body;
    if(
        !email &&
        email.trim()==="" &&
        !password && 
        password.trim()==="" 
    ){
         return res.status(422).json({message : "Invalid inputs"});
    }
     let existingAdmin;

      try {
        existingAdmin = await Admin.findOne({email});
      } catch (error) {
        console.log(error);
      }
      if(!existingAdmin){
        return res.status(500).json({message : "Unable to find user with this id"});
      }
       const isPassCorrect = bcrypt.compareSync(password,existingAdmin.password)
       if(!isPassCorrect){
        return res.status(400).json({message : "Incorrect password"});
       }

       const token = jwt.sign({id : existingAdmin._id},process.env.SECRET_KEY,{expiresIn:"7d"});
       return res.status(200).json({message : "Authentication complete",token,id : existingAdmin._id});

}

export const getAdmins = async(req,res,next) => {
    let admins;
    try{
        admins = await Admin.find();
    }catch(err){
        console.log(err);
    }

    if(!admins){
        return res.status(500).json({message : "Internal Server Error"})
    }
    return res.status(200).json({admins})

}
export const getAdminById = async(req,res,next) => {
    const id = req.params.id
    let admin;
    try{
        admin = await Admin.findById(id).populate("addmovies");
    }catch(err){
        console.log(err);
    }

    if(!admin){
        return res.status(500).json({message : "Internal Server Error"})
    }
    return res.status(200).json({admin})

}