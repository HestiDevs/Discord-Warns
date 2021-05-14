const { MessageEmbed } = require("discord.js");
const guildModel = require('../../Models/Guild.js');

module.exports = {
	name: "warns-channel-logs",
	alias: ["wcl", "wchannel", "wlogs"],
	run: async (client, message, args) => {
		let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
		if(!channel) return message.channel.send(":x: Debe mencionar o proporcionar la ID de un canal para enviar los registros de advertencias.");
		
		guildModel.updateOne({
			guildID: message.guild.id,
			channelID: channel.id
		}).then(() => {
			let embed = new MessageEmbed()
			.setDescription(`Se ha establecido el canal donde se enviarán los registros de advertencias.`)
			.setColor(client.config.embedColor);
			
			message.channel.send(embed);
		});
	}
}