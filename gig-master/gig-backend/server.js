
import express from 'express'
import mongoose from 'mongoose';
import authRouter from './Routers/authRouter.js';
import userRouter from './Routers/userRoutes.js';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express();

app.use(cors()); 
app.use(bodyParser.json()); 

const port = 4000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
app.use(express.json());
// app.use("/auth2",googleAuthRouter)
app.use('/user',userRouter);
app.use('/auth',authRouter);


const mongoURI = 'mongodb+srv://yash:gogig1234@cluster0.0osrczt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

try {
    mongoose.connect(mongoURI);
    console.log("Connected to db successfully !");
} catch (error) {
    console.log("error connecting to db")
}
