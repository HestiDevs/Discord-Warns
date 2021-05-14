const mongoose = require("mongoose");

const warnSchema = new mongoose.Schema({
    userID: {
        type: String
    },
    moderatorID: {
        type: String
    },
    guildID: {
        type: String
    },
    date: {
        type: Date
    },
    reason: {
        type: String
    },
    warnID: {
        type: String
    }
});

module.exports = mongoose.model("Warn", warnSchema)