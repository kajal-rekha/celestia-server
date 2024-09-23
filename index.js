require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();

const port = process.env.PORT || 6000;

app.use(cors({ credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the quirkle server" });
});

app.listen(port, () => {
    console.log(`connected to mongodb and listening on port ${port}`);
});
