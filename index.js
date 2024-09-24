require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");


// express app
const app = express();

// port
const port = process.env.PORT || 4000;

// middlewares
app.use(
    cors({
        credentials: true
    })
);
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// test api
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the quirkle server!" });
});


// mongodb
mongoose.set("strictQuery", false);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        // listen to server
        app.listen(port, () => {
            console.log(`connected to mongodb and listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.log(err.message);
    });
