module.exports = {
    name: "ping",
    alias: [],
    run: async (client, message, args) => {
        message.lineReplyNoMention(`:ping_pong: Ping: ${client.ws.ping}ms`);
    }
}