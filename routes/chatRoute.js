const express = require("express");
const router = express.Router();
const PredefinedAnswer = require("../models/predefindAnsweModel");
const Fuse = require("fuse.js");

router.post("/", async (req, res) => {
    const { message } = req.body;

    try {
        const predefinedAnswers = await PredefinedAnswer.find();

        const fuse = new Fuse(predefinedAnswers, {
            keys: ["question"],
            threshold: 0.3
        });

        const result = fuse.search(message);

        if (result.length > 0) {
            const matchedAnswer = result[0].item.answer;
            return res.json({ response: matchedAnswer });
        } else {
            return res.json({ response: "No matching answer found." });
        }
    } catch (error) {
        res.status(400).json({
            message: "Error processing the message",
            error
        });
    }
});

module.exports = router;
