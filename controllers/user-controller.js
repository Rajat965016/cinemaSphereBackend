import Bookings from '../models/Bookings.js';
import User from '../models/User.js'
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req,res,next) =>{
    let users;
    try{
        users = await User.find();
    } catch(err){
        return console.log(err);
    }
    if(!users){
        return res.status(500).json({ message : "Unexpected error occured"});
    }
    return res.status(200).json({users});
};

export const getUserById = async (req,res,next) =>{
    const id = req.params.id;
    let user;
    try{
        user = await User.findById(id)
        
    } catch(err){
        return console.log(err);
    }
    if(!user){
        return res.status(500).json({ message : "Unexpected error occured"});
    }
    return res.status(200).json({user});
};

export const singup = async (req,res,next) =>{ 
    const {name,email,password} = req.body;
    if(
        !name && 
        name.trim()=== "" &&
        !email &&
        email.trim()==="" &&
        !password && 
        password.trim()==="" 
    ){
         return res.status(422).json({message : "Invalid inputs"});
    }
    let user;
    const hashedPass = bcrypt.hashSync(password)
    try{
        user = new User({name, email, password : hashedPass});
        user = await user.save();
    } catch(err){
        return console.log(err);
    }
    if(!user){
        return res.status(500).json({message : "Unexpected Error Occured"});
    }
    return res.status(201).json({id : user._id });

};

export const upDateUser = async (req,res,next) => {
    const id = req.params.id;
    const {name,email,password} = req.body;
    if(
        !name && 
        name.trim()=== "" &&
        !email &&
        email.trim()==="" &&
        !password && 
        password.trim()==="" 
    ){
         return res.status(422).json({message : "Invalid inputs"});
    }
    let user;
    try{
    const hashedPass = bcrypt.hashSync(password);
    user = await User.findByIdAndUpdate(id,{name, email, password : hashedPass});
    }catch(err){
        console.log(err);
    }
    if(!user){
        return res.status(500).json({message : "Unexpected Error Occured"});
    }
    res.status(201).json({message: "Updated Successfully"});

};

export const delUser = async (req,res,next) =>{
    const id = req.params.id;
    let user;
    try {
        
        user = await User.findByIdAndDelete(id)
    } catch (error) {
        console.log(error)
        
    }
    if(!user){
        return res.status(500).json({message : "Unexpected Error Occured"});
    }
    res.status(201).json({message: "Delete Successfully"});

}

export const login = async (req,res,next) => {
    
    const {email,password} = req.body;
    if(
        !email &&
        email.trim()==="" &&
        !password && 
        password.trim()==="" 
    ){
         return res.status(422).json({message : "Invalid inputs"});
    }
    // const hashedPass = bcrypt.hashSync(password);
    let existingUser;
    try{
    
    existingUser = await User.findOne({ email});
    }catch(err){
        console.log(err);
    }
    if(!existingUser){
        return res.status(500).json({message : "Unable to find user with this id"});
    }
    const isPassCorrect = bcrypt.compareSync(password,existingUser.password)
    if(!isPassCorrect){
        return res.status(400).json({message : "Incorrect Password"});
    }
    return res.status(200).json({message: "Login Successfully", id : existingUser._id });

};

export const getBookingsOfUser = async (req,res,next) =>{
    const id = req.params.id;
    let bookings;
    try {
        bookings = await Bookings.find({ user: id })
        .populate('user', 'name email password')
        .populate('movie', 'title description posterUrl releasedate featured actors bookings');
    } catch (error) {
        console.log(error)
    }
    if(!bookings){
        return res.status(500).json({message : "Unable to get bookings"});
    }
    return res.status(200).json({bookings});
}
