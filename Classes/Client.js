const { Client, Collection } = require("discord.js");

class DiscordWarns extends Client {
    constructor(options) {
        super(options);

        this.commands = new Collection();
        this.config = require('../config.js');
        this.devs = ["772104444720054293"];
    }
}

module.exports = DiscordWarns;