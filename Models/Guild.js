const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
    guildID: {
        type: String,
        required: true
    },
    channelID: {
        type: String
    }
});

module.exports = mongoose.model("Guild", guildSchema)