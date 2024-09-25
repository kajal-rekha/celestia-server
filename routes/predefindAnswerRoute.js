const express = require("express");
const router = express.Router();
const PredefinedAnswer = require("../models/predefindAnsweModel");

router.post("/", async (req, res) => {
    const { question, answer, keywords } = req.body;

    try {
        const newAnswer = new PredefinedAnswer({ question, answer, keywords });
        await newAnswer.save();
        res.status(201).json(newAnswer);
    } catch (error) {
        res.status(400).json({
            message: "Error creating predefined answer",
            error
        });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { question, answer, keywords } = req.body;

    try {
        const updatedAnswer = await PredefinedAnswer.findByIdAndUpdate(
            id,
            { question, answer, keywords },
            { new: true }
        );
        if (!updatedAnswer)

        res.json(updatedAnswer);
    } catch (error) {
        res.status(400).json({ message: "Error updating answer", error });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await PredefinedAnswer.findByIdAndDelete(id);
        res.json({ message: "Answer deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting answer", error });
    }
});

router.get("/", async (req, res) => {
    try {
        const answers = await PredefinedAnswer.find();
        res.json(answers);
    } catch (error) {
        res.status(400).json({ message: "Error fetching answers", error });
    }
});

module.exports = router;
