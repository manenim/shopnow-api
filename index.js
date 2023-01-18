
import express from "express"
import dotenv from 'dotenv';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import stripeRoute from "./routes/stripe.js"
import cartRoute from "./routes/cart.js";
import orderRoute from "./routes/order.js";


dotenv.config();
const app = express() 

const PORT = process.env.PORT || 5000;


const mongoUrl = process.env.MONGO_URL

mongoose
    .connect(mongoUrl)
    .then(() => console.log("connected"))
    .catch((err) => console.log(err))

app.use(bodyParser.json({ limit: "30mb", extended: true }))

app.use(cors())

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.get('/', (req, res) => res.send('Hello World!'))
 
app.listen(PORT, () => console.log(`Example app listening on ${PORT}!`))


