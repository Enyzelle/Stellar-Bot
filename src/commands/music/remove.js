const { EmbedBuilder } = require('discord.js');
const djManager = require('../../utils/djManager');
const { embedColor } = require('../../../config.json');

module.exports = {
    name: 'remove',
    description: 'Remove a song from the queue (DJ only)',
    async execute(message, args, client) {
        if (!djManager.isDJ(message.member)) {
            return message.reply('❌ This command is for DJs only!');
        }

        const position = parseInt(args[0]);
        if (isNaN(position) || position < 1) {
            return message.reply('Please provide a valid position number!');
        }

        const musicPlayer = require('../../utils/musicUtils')(client);
        const player = musicPlayer.getPlayer(message.guild);
        
        if (!player || !player.queue.length) {
            return message.reply('❌ No songs in queue!');
        }

        if (position > player.queue.length) {
            return message.reply(`❌ Queue only has ${player.queue.length} songs!`);
        }

        const removed = player.queue.remove(position - 1);
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setDescription(`🗑️ Removed from queue: **${removed.title}**`)
            .setFooter({ 
                text: `Removed by DJ ${message.author.tag} | By Enyzelle`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        message.channel.send({ embeds: [embed] });
    }
}; 