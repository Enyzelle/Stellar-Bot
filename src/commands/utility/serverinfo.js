const { EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../../config.json');

module.exports = {
    name: 'serverinfo',
    aliases: ['server'],
    description: 'Display information about the server',
    execute(message, args, client) {
        const guild = message.guild;
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setAuthor({ name: `${guild.name} Server Information` })
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Members', value: guild.memberCount.toString(), inline: true },
                { name: 'Created At', value: guild.createdAt.toLocaleDateString(), inline: true },
                { name: 'Boost Level', value: guild.premiumTier.toString(), inline: true },
                { name: 'Boost Count', value: guild.premiumSubscriptionCount.toString(), inline: true },
                { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },
                { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
                { name: 'Emojis', value: guild.emojis.cache.size.toString(), inline: true }
            )
            .setFooter({ text: `ID: ${guild.id} | By: Enyzelle` });

        message.channel.send({ embeds: [embed] });
    }
}; 