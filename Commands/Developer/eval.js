const Discord = require('discord.js');
const ms = require('ms');
const { inspect } = require('util');

module.exports = {
    name: "eval",
    alias: ["e"],
    run: async (client, message, args) => {
		if(!client.devs.includes(message.author.id)) return;
		
        let evaled;
        let code = args.join(" ");
        try {
            const hrStart = process.hrtime();
            evaled = eval(code);

            if (evaled instanceof Promise) evaled = await evaled;
            const hrStop = process.hrtime(hrStart);

            let response = '';

            response += `\`\`\`js\n${await clean(client, evaled)}\n\`\`\`\n`;
            response += `• Discord.js ${Discord.version}\n`;
            response += ` • Type: \`${typeof evaled}\`\n`;
            response += ` • Time taken: \`${(((hrStop[0] * 1e9) + hrStop[1])) / 1e6}ms\``;

            let embed = new Discord.MessageEmbed()
            .setAuthor('Success')
            .setDescription(response)
            .setColor(client.config.embedColor)

            return message.channel.send(embed);
        } catch (err) {
        	let embed = new Discord.MessageEmbed()
			.setTitle("An error occured")
			.setDescription(`Error: ${await clean(client, err.message)}`)
			.setColor('RED')
			.setFooter(client.user.username, client.user.displayAvatarURL())
			.setAuthor(message.author.tag, message.author.displayAvatarURL())

            return message.channel.send(embed)
        }
    }
}

async function clean(client, text) {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, {
        depth: 1
      });

    text = text
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
      .replace(client.config.token, "mfa.VkO_2G4Qv3T--NOt--lWetW_--A--tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  }