import express from 'express'
import { addfood, listFood, removeFood } from '../controllers/foodcontroller.js'
import multer from 'multer'

const foodRouter = express.Router();

// Image storage engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,callback)=>{
        return callback(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

foodRouter.post("/add",upload.single("image"),addfood)
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood)



export default foodRouter;