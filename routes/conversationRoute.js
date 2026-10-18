const express = require("express");
const Conversation = require("../models/conversationModel");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();
const MAX_CONVERSATIONS = 50;
const MAX_TOTAL_MESSAGE_LENGTH = 50000;

router.use(isAuthenticated);

router.get("/", async (req, res) => {
    try {
        const conversations = await Conversation.find({ user: req.user._id })
            .sort({ updatedAt: -1 })
            .limit(MAX_CONVERSATIONS)
            .lean();

        return res.status(200).json(
            conversations.map((conversation) => ({
                id: conversation.conversationId,
                title: conversation.title,
                messages: conversation.messages,
                updatedAt: conversation.updatedAt
            }))
        );
    } catch (error) {
        console.error("Could not load conversations:", error);
        return res.status(500).json({ error: "Could not load conversations." });
    }
});

router.put("/:conversationId", async (req, res) => {
    const { conversationId } = req.params;
    const { messages } = req.body || {};

    if (
        !/^[\w-]{1,100}$/.test(conversationId) ||
        !Array.isArray(messages) ||
        messages.length === 0 ||
        messages.length > 200
    ) {
        return res.status(400).json({ error: "Invalid conversation data." });
    }

    let totalMessageLength = 0;
    const validatedMessages = [];

    for (const message of messages) {
        if (
            !message ||
            !["user", "ai"].includes(message.role) ||
            typeof message.content !== "string" ||
            !message.content.trim() ||
            message.content.length > 10000
        ) {
            return res.status(400).json({ error: "Invalid conversation message." });
        }

        totalMessageLength += message.content.length;
        if (totalMessageLength > MAX_TOTAL_MESSAGE_LENGTH) {
            return res.status(413).json({ error: "Conversation is too large." });
        }

        validatedMessages.push({
            role: message.role,
            content: message.content
        });
    }

    const firstUserMessage = validatedMessages.find(
        (message) => message.role === "user"
    );
    if (!firstUserMessage) {
        return res.status(400).json({ error: "Conversation must include a user message." });
    }

    const title = firstUserMessage.content.trim().slice(0, 200);

    try {
        const conversation = await Conversation.findOneAndUpdate(
            { user: req.user._id, conversationId },
            {
                $set: {
                    title,
                    messages: validatedMessages,
                    updatedAt: new Date()
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        ).lean();

        return res.status(200).json({
            id: conversation.conversationId,
            title: conversation.title,
            messages: conversation.messages,
            updatedAt: conversation.updatedAt
        });
    } catch (error) {
        console.error("Could not save conversation:", error);
        return res.status(500).json({ error: "Could not save conversation." });
    }
});

router.delete("/", async (req, res) => {
    try {
        const result = await Conversation.deleteMany({ user: req.user._id });
        return res.status(200).json({ deletedCount: result.deletedCount });
    } catch (error) {
        console.error("Could not clear conversation history:", error);
        return res.status(500).json({ error: "Could not clear conversation history." });
    }
});

router.delete("/:conversationId", async (req, res) => {
    const { conversationId } = req.params;

    if (!/^[\w-]{1,100}$/.test(conversationId)) {
        return res.status(400).json({ error: "Invalid conversation ID." });
    }

    try {
        const result = await Conversation.deleteOne({
            user: req.user._id,
            conversationId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Conversation not found." });
        }

        return res.status(200).json({ deleted: true });
    } catch (error) {
        console.error("Could not delete conversation:", error);
        return res.status(500).json({ error: "Could not delete conversation." });
    }
});

module.exports = router;
