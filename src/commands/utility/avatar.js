const { EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../../config.json');

module.exports = {
    name: 'avatar',
    aliases: ['av'],
    description: 'Get user avatar',
    execute(message, args) {
        const target = message.mentions.users.first() || message.author;
        
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setAuthor({ name: `${target.tag}'s Avatar` })
            .setImage(target.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setFooter({ 
                text: `Requested by ${message.author.tag} | By: Enyzelle`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        message.channel.send({ embeds: [embed] });
    }
}; 