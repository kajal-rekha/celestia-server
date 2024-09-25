const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const predefindAnswerSchema = new Schema(
    {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        keywords: { type: [String], required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("PredefinedAnswer", predefindAnswerSchema);
