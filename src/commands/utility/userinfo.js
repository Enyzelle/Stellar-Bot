const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    aliases: ['ui', 'user'],
    description: 'Display information about a user',
    execute(message, args) {
        const target = message.mentions.members.first() || message.member;
        const roles = target.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1); // Remove @everyone

        const embed = new EmbedBuilder()
            .setColor(target.displayHexColor)
            .setTitle('User Information')
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: '👤 Username', value: target.user.tag, inline: true },
                { name: '🆔 ID', value: target.user.id, inline: true },
                { name: '🎭 Nickname', value: target.nickname || 'None', inline: true },
                { name: '📅 Account Created', value: `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '📥 Joined Server', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: `📋 Roles [${roles.length}]`, value: roles.length ? roles.join(', ') : 'None' }
            )
            .setFooter({ 
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
}; 