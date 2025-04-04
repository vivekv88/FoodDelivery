import express from 'express'
import cors from 'cors'

// app config
const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(cors())

app.get('/',(req,res) => {
    res.send("Mai Zinda hu")
})

app.listen(port,()=>{
    console.log(`Server Started on https://localhost:${port}`);
    
})