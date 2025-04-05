import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js';

// app config
const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(cors())

//db connect
connectDB();

app.get('/',(req,res) => {
    res.send("Mai Zinda hu")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`);
})

//mongodb+srv://atlas-sample-dataset-load-67f0d93e76d84f705e6b9e2a:<db_password>@cluster0.ac35rhl.mongodb.net/?

//mongodb+srv://atlas-sample-dataset-load-67f0d93e76d84f705e6b9e2a:<db_password>@cluster0.ac35rhl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0