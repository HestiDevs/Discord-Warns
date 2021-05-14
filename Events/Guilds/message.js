module.exports = async (client, message) => {
    if(message.author.bot) return;
    if(!message.content.startsWith(client.config.prefix)) return;
    if(!message.guild) return;

    let args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    let commandName = args.shift().toLowerCase();

    let command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.alias && cmd.alias.includes(commandName));
    if(!command) return;

    command.run(client, message, args);
}