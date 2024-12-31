const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Check bot latency',
    async execute(message, args, client) {
        const sent = await message.channel.send('Pinging...');
        
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setAuthor({ name: `🏓 Pong!` })
            .addFields(
                { name: 'Bot Latency', value: `${sent.createdTimestamp - message.createdTimestamp}ms`, inline: true },
                { name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true }
            )
            .setFooter({ text: `By Enyzelle`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

        sent.edit({ content: null, embeds: [embed] });
    }
}; 