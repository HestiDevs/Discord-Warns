const { MessageEmbed } = require("discord.js");
const warnModel = require('../../Models/Warn.js');
const moment = require("moment");
moment.locale("es"); //THIS IS OPTIONAL. YOU CAN CHANGE IT TO EN

module.exports = {
    name: "warnlist",
    alias: ["warns"],
    run: async (client, message, args) => {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if(!member) return message.channel.send(`Debe mencionar al miembro al cual le aplicará la advertencia o ingresar su ID. (Ejemplo: \`${client.config.prefix}warn @member razón\`)`);

        let isYou = false;
        if(member.id == message.member.id) isYou = true;

        warnModel.find({
            userID: member.id,
            guildID: message.guild.id
        }).then((result) => {
            if(result.length < 1) {
                let embed = new MessageEmbed()
                .setDescription(`${isYou ? 'Usted' : 'El miembro'} no tiene ninguna advertencia.`)
                .setColor(client.config.embedColor);

                return message.channel.send(embed);
            }

            let embed = new MessageEmbed()
            .setAuthor(`Advertencias de ${member.user.tag}`, member.user.displayAvatarURL())
            .setFooter(`Total de advertencias: ${result.length}`)
            .setColor(client.config.embedColor)
            .setTimestamp();

            let number = 0;
            let warnsValue = "";

            result.forEach((warn) => {
                if(number >= 10) return false;
                number++;

                let time = warn.date;
                warnsValue += `**Advertencia #${number}**\n● Razón: ${warn.reason}\n● Moderador: ${client.users.cache.get(warn.moderatorID).tag || warn.moderatorID}\n● ID: ${warn.warnID}\n● Fecha: ${moment(time).fromNow()}\n\n`;
            });

            embed.setDescription(warnsValue);

            message.channel.send(embed);
        });
    }
}