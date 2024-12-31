const { EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../../config.json')

module.exports = {
    name: 'coinflip',
    aliases: ['flip', 'coin'],
    description: 'Flip a coin',
    execute(message) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '🪙' : '💿';

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setAuthor({ name: `🪙 Coin Flip` })
            .setDescription(`${emoji} The coin landed on: **${result}**!`)
            .setTimestamp()
            .setFooter({ 
                text: `Flipped by ${message.author.tag} | By: Enyzelle`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        message.channel.send({ embeds: [embed] });
    }
}; 