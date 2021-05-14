const { MessageEmbed } = require("discord.js");
const warnModel = require('../../Models/Warn.js');
const guildModel = require('../../Models/Guild.js');

module.exports = {
    name: "unwarn",
    alias: [],
    run: async (client, message, args) => {
        if(!message.member.hasPermission('ADMINISTRATOR') && !message.member.hasPermission('MANAGE_ROLES') && !message.member.hasPermission('MANAGE_GUILD')) {
            return message.channel.send('No cuentas con los permisos suficientes para ejecutar este comando.');
        }

        let GuildConfig = await guildModel.findOne({ guildID: message.guild.id })

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.channel.send(`Debe mencionar al miembro al cual le quitará la advertencia o ingresar su ID. (Ejemplo: \`${client.config.prefix}unwarn @member <cantidad o all> (reason)\`)`);

        let mentionedPotision = member.roles.highest.position
        let memberPotision = message.member.roles.highest.position

        if (memberPotision <= mentionedPotision) {
            return message.channel.send('No puedes quitarle una advertencia a un miembro por que su rol está por encima del tuyo.');
        }

        let idWarn = args[1];
        let reason = args.slice(2).join(' ') || 'No proporcionada.';

        if(args[1] == 'all') {
            let reason = args.slice(3).join(' ') || 'No proporcionada.';

            warnModel.deleteMany({
                userID: member.id,
                guildID: message.guild.id
            }).then(() => {
                if(GuildConfig.channelID) {
                    let channelLogs = client.channels.cache.get(GuildConfig.channelID);

                    let embed = new MessageEmbed()
                    .setAuthor('Nueva Notificación', message.guild.iconURL())
                    .setDescription('Han sido eliminadas todas las advertencias de un miembro.')
                    .addField('Datos', `ID del Miembro: ${member.id}\nNombre: ${member.user.tag}\nModerador: ${message.member.user.tag} (${message.member.id})\nRazón: ${reason}`)
                    .setColor(client.config.embedColor)
                    .setTimestamp();

                    if(channelLogs) channelLogs.send(embed);
                }

                return message.channel.send(`:scales: Todas las advertencias de **${member.user.tag}** han sido eliminadas por ${message.member}`);
            }).catch((err) => {
                console.log(err);
            });
        } else {
			warnModel.find({
				userID: member.id,
				guildID: message.guild.id,
				warnID: idWarn
			}).then((result) => {
				if(!result.length) return message.channel.send(":x: Este miembro no tiene ninguna advertencia con esa ID.");
					
				warnModel.deleteOne({
					userID: member.id,
					guildID: message.guild.id,
					warnID: idWarn
				}).then(() => {
					if(GuildConfig.channelID) {
						let channelLogs = client.channels.cache.get(GuildConfig.channelID);

						let embed = new MessageEmbed()
						.setAuthor('Advertencia Eliminada', message.guild.iconURL())
						.addField('Datos', `ID del Miembro: ${member.id}\nNombre: ${member.user.tag}\nModerador: ${message.member.user.tag} (${message.member.id})\nRazón: ${reason}`)
						.setColor(client.config.embedColor)
						.setTimestamp();
			
						if(channelLogs) channelLogs.send(embed);
					}

					return message.channel.send(`:snowflake: Una advertencia de **${member.user.tag}** fue eliminada por **${message.member.user.tag}**`);
				}).catch((err) => {
					console.log(err);
				});
			}).catch((err) => {
				console.log(err);
			});
		}
    }
}