require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const predefinedAnswersRoutes = require("./routes/predefindAnswerRoute");
const chatRoutes = require("./routes/chatRoute");
const userRoute = require("./routes/userRoute");
const conversationRoute = require("./routes/conversationRoute");

// express app
const app = express();

// port
const port = process.env.PORT || 4000;

// middlewares
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// test api
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the celestia server!" });
});

mongoose.set("strictQuery", false);

let databaseConnection;

const connectToDatabase = () => {
    if (mongoose.connection.readyState === 1) {
        return Promise.resolve();
    }

    if (!databaseConnection) {
        if (!process.env.MONGO_URI) {
            return Promise.reject(new Error("MONGO_URI is not configured."));
        }

        databaseConnection = mongoose
            .connect(process.env.MONGO_URI)
            .then(() => undefined)
            .catch((error) => {
                databaseConnection = null;
                throw error;
            });
    }

    return databaseConnection;
};

app.use("/api", async (req, res, next) => {
    try {
        await connectToDatabase();
        return next();
    } catch (error) {
        console.error("Could not connect to MongoDB:", error.message);
        return res.status(503).json({
            error: "The Celestia database is unavailable. Please try again later."
        });
    }
});

app.use("/api/users", userRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/predefined-answers", predefinedAnswersRoutes);
app.use("/api/chat", chatRoutes);

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Celestia server listening on port ${port}`);
    });
}

module.exports = app;
