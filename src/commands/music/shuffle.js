const { EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../../config.json');
const djManager = require('../../utils/djManager');

module.exports = {
    name: 'shuffle',
    description: 'Shuffle the current queue',
    async execute(message, args, client) {
        if (!message.member.voice.channel) {
            return message.reply('❌ You must be in a voice channel!');
        }

        if (!djManager.isDJ(message.member)) {
            return message.reply('❌ You need the DJ role to use this command!');
        }

        const musicPlayer = require('../../utils/musicUtils')(client);
        const player = musicPlayer.getPlayer(message.guild);

        if (!player || !player.queue.length) {
            return message.reply('❌ Not enough songs in queue to shuffle!');
        }

        player.queue.shuffle();

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setDescription('🔀 Queue has been shuffled!')
            .setFooter({ 
                text: `Shuffled by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        message.channel.send({ embeds: [embed] });
    }
}; 