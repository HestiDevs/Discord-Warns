const Discord = require("discord.js");
const mongoose = require("mongoose");
const DiscordWarns = require("./Classes/Client.js");
const client = new DiscordWarns();
require('./Classes/Message.js');

["Commands", "Events"].forEach(x => require(`./Handlers/${x}`)(client));

mongoose.connect(client.config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Conectado a la base de datos MongoDB.");
}).catch((err) => {
    console.log("No se puede conectar a la base de datos MongoDB. Error: "+err);
});

client.login(client.config.token);