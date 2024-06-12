import expres from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"



// app config
const app = expres()
const port = 4000

// middleware
app.use(expres.json())
app.use(cors())

// db connection
connectDB()

app.get("/",(req,res)=>{
    res.send("API working")
})

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})

