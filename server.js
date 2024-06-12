import expres from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import productRouter from "./routes/productRoute.js"



// app config
const app = expres()
const port = 4000

// middleware
app.use(expres.json())
app.use(cors())

// db connection
connectDB()

// api endpoints
app.use("/api/product",productRouter)

app.get("/",(req,res)=>{
    res.send("API working")
})

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})

