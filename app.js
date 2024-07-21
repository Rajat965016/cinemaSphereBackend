import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user-routes.js';
import adminRouter from './routes/admin-routes.js';
import movieRouter from './routes/movie-routes.js';
import bookingRouter from './routes/booking-routes.js';
dotenv.config();


const app = express();
app.use(cors());

// middlewares
app.use(express.json());
app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/movie",movieRouter);
app.use("/booking",bookingRouter);

mongoose
  .connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.ofrr0vi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    ).then(() => 
        app.listen(5000,() =>
        console.log("Connected to Database and server is running")
    )
    ).catch(e => console.log(e));



