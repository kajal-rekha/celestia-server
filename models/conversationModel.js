const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["user", "ai"],
            required: true
        },
        content: {
            type: String,
            required: true,
            maxlength: 10000
        }
    },
    { _id: false }
);

const conversationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        conversationId: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        messages: {
            type: [messageSchema],
            required: true,
            validate: {
                validator: (messages) =>
                    messages.length > 0 && messages.length <= 200,
                message: "A conversation must contain between 1 and 200 messages."
            }
        }
    },
    { timestamps: true }
);

conversationSchema.index(
    { user: 1, conversationId: 1 },
    { unique: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
