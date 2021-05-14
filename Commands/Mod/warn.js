const { MessageEmbed } = require("discord.js");
const warnModel = require('../../Models/Warn.js');
const guildModel = require('../../Models/Guild.js');

module.exports = {
    name: "warn",
    alias: [],
    run: async (client, message, args) => {
        if(!message.member.hasPermission('ADMINISTRATOR') && !message.member.hasPermission('MANAGE_ROLES') && !message.member.hasPermission('MANAGE_GUILD')) {
            return message.channel.send('No cuentas con los permisos suficientes para ejecutar este comando.');
        }

        let GuildConfig = await guildModel.findOne({ guildID: message.guild.id })

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.channel.send(`Debe mencionar al miembro al cual le aplicará la advertencia o ingresar su ID. (Ejemplo: \`${client.config.prefix}warn @member razón\`)`);

        let mentionedPotision = member.roles.highest.position
        let memberPotision = message.member.roles.highest.position

        if (memberPotision <= mentionedPotision) {
            return message.channel.send('No puedes advertir a este miembro por que su rol está en la misma posición o por encima del tuyo.');
        }

        let reason = args.slice(1).join(' ') || 'No especificada';
        let idWarn = makeid(6);

        let warn = new warnModel({
            userID: member.id,
            moderatorID: message.member.id,
            guildID: message.guild.id,
            date: new Date(),
            reason: reason,
            warnID: idWarn
        });

        warn.save().then(() => {
            warnModel.find({
                userID: member.id,
                guildID: message.guild.id
            }).then((result) => {
                message.channel.send(`**${member.user.tag}** ha sido advertido (razón: ${reason}). Ahora tiene ${result.length} advertencias.`)

                if(GuildConfig.channelID) {
                    let embed = new MessageEmbed()
                    .setAuthor('Nueva Advertencia', message.guild.iconURL())
                    .addField('Datos', `ID del Miembro: ${member.id}\nNombre: ${member.user.tag}\nModerador: ${message.member.user.tag} (${message.member.id})\nRazón: ${reason}`)
                    .setColor(client.config.embedColor)
                    .setTimestamp();

                    client.channels.cache.get(GuildConfig.channelID).send(embed);
                }
            })
        }).catch((err) => {
            message.channel.send('Se ha producido un error. Por favor intente mas tarde.');
            console.log(err);
        });
    }
}

function makeid(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result;
}