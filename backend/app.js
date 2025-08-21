import express from "express";
import connectToDB from "./models/db.js";
import userRoutes from "./routes/user.routes.js";
const app = express();

connectToDB()
app.get("/", (req, res) => {
    res.send("Hello World!");
});


export default app