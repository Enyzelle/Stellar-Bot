const { EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../../config.json');

module.exports = {
    name: 'roleinfo',
    description: 'Get information about a role',
    execute(message, args) {
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) {
            return message.reply('Please mention a role or provide a role ID!');
        }

        const embed = new EmbedBuilder()
            .setColor(role.color || embedColor)
            .setTitle('Role Information')
            .addFields(
                { name: '📛 Name', value: role.name, inline: true },
                { name: '🆔 ID', value: role.id, inline: true },
                { name: '🎨 Color', value: role.hexColor, inline: true },
                { name: '👥 Members', value: role.members.size.toString(), inline: true },
                { name: '📅 Created', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '🏅 Position', value: role.position.toString(), inline: true },
                { name: '🔒 Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
                { name: '🎭 Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true }
            )
            .setFooter({ 
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        message.channel.send({ embeds: [embed] });
    }
}; 