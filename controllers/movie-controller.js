import { decrypt } from "dotenv";
import Movie from "../models/Movie.js";
import jwt from 'jsonwebtoken'
import { json } from "express";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

export const addmovie = async (req,res,next) => {
    const extractedToken = req.headers.authorization.split(" ")[1];
    if(!extractedToken && extractedToken.trim() === ''){
        return res.status(404).json({message :"Token not found"});
    }
    
    let adminId;
    // verify

    jwt.verify(extractedToken,process.env.SECRET_KEY,(err,decrypted)=>{
        if(err){
            return res.status(400).json({message : `${err.message}`});

        }
        else{
            adminId = decrypted.id;
            return;
        }
    })

    // create a movie

    const {title, description,releasedate,posterUrl,featured,actors} = req.body;
    if(
        !title &&
        title.trim()==="" &&
        !description && 
        description.trim()===""&&
        !releasedate &&
        releasedate.trim()==="" &&
        !featured && 
        featured.trim()==="" &&
        !actors && 
        actors.trim()==="" &&
        !posterUrl &&
        posterUrl.trim()==="" 
    ){
         return res.status(422).json({message : "Invalid inputs"});
    }

    let movie;
    try {
        movie =  new Movie({
            title,
            description,
            releasedate : new Date (`${releasedate}`),
            featured,
            posterUrl,
            actors,
            admin : adminId
        })
        const session = await mongoose.startSession();
        const adminUser = await Admin.findById(adminId);
        session.startTransaction();
        await movie.save({session});
        adminUser.addmovies.push(movie);
        await adminUser.save({session});
        await session.commitTransaction();

        
    } catch (error) {
        console.log(error)
        
    }
    if(!movie){
        return res.status(500).json({message : "Request Failed"});
      }
      return res.status(201).json({movie})
};

export const getMovieById = async (req, res, next)=>{
    let movie;
    const id = req.params.id;
    try {
        movie = await Movie.findById(id);
    } catch (error) {
       console.log(error); 
    }
    if(!movie){
        return res.status(404).json({message : "invalid movie id"});
    }
    return res.status(200).json({movie});
}
export const getAllmovies = async (req, res, next)=>{
    let movies;
    try {
        movies = await Movie.find();
    } catch (error) {
       console.log(error); 
    }
    if(!movies){
        return res.status(500).json({message : "Request Failed"});
    }
    return res.status(200).json({movies});
}