import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodroute.js';

// app config
const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(cors())

//db connect
connectDB();

// api endpoints
app.use("/api/food",foodRouter)

app.get('/',(req,res) => {
    res.send("Mai Zinda hu")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`);
})

