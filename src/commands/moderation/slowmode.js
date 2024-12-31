const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'slowmode',
    description: 'Set channel slowmode',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply('❌ You need Manage Channels permission!');
        }

        const time = parseInt(args[0]);
        if (isNaN(time)) {
            return message.reply('Please provide a valid number of seconds!');
        }

        if (time < 0 || time > 21600) {
            return message.reply('Slowmode must be between 0 and 21600 seconds!');
        }

        await message.channel.setRateLimitPerUser(time);
        
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('⏱️ Slowmode Updated')
            .setDescription(`Slowmode has been set to ${time} seconds`)
            .setFooter({ 
                text: `Set by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        message.channel.send({ embeds: [embed] });
    }
}; 