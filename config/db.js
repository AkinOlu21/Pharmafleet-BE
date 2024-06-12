import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://PharmaFleet:PharmaFleet02$@cluster0.lv10znl.mongodb.net/PharmaFleet').then(()=>console.log("DB connected"))
}

