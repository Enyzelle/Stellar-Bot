const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'coinflip',
    aliases: ['flip', 'coin'],
    description: 'Flip a coin',
    execute(message) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '🪙' : '💿';

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('Coin Flip')
            .setDescription(`${emoji} The coin landed on: **${result}**!`)
            .setTimestamp()
            .setFooter({ 
                text: `Flipped by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        message.channel.send({ embeds: [embed] });
    }
}; 