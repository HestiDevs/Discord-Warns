module.exports = (client) => {
    console.log(`Ready as ${client.user.tag}`);

    client.user.setPresence({
        status: 'dnd',
        activity: {
            name: 'hestibots.xyz',
            type: 'PLAYING'
        }
    });
}