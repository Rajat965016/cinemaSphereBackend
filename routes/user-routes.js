import express from 'express'
import { getAllUsers,getUserById,singup, upDateUser, delUser, login, getBookingsOfUser } from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/signup", singup);
userRouter.put("/:id", upDateUser);
userRouter.delete("/:id", delUser);
userRouter.post("/login", login);
userRouter.get("/booking/:id", getBookingsOfUser);


export default userRouter;