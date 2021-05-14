const fs = require("fs");

module.exports = (client) => {
    const eventsDir = fs.readdirSync('./Events');

    for (const dir of eventsDir) {
        const eventFiles = fs.readdirSync(`./Events/${dir}`).filter((file) => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`../Events/${dir}/${file}`);
            const eventName = file.split('.')[0];

            client.on(eventName, event.bind(null, client))
        }
    }
}