module.exports = {
    name: 'messageCreate',
    async execute(msg, client) {
        const config = client.config;
        const channelID = config.channelID;

        const filterBanWords = config.filterBanWords;
        const createMessage = ll.import('discord', 'createMessage');

        if (msg.channel.id == channelID && !msg.author.bot) {
            mc.broadcast(`§a| §bDS §7| §f${msg.author.username} §b>> §r${createMessage(msg.content, filterBanWords)}`);
            logger.info(`<Discord ${ msg.author.username }> ${ msg.content }`);
        };
    },
};