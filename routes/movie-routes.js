import express from "express";
import { addmovie,getAllmovies,getMovieById } from "../controllers/movie-controller.js";

const movieRouter = express.Router();

movieRouter.get("/", getAllmovies);
movieRouter.get("/:id", getMovieById);
movieRouter.post("/",addmovie);

export default movieRouter;