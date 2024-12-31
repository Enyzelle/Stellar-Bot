const { EmbedBuilder } = require('discord.js');
const djManager = require('../../utils/djManager');
const { embedColor } = require('../../../config.json');

module.exports = {
    name: 'skip',
    aliases: ['s'],
    description: 'Skip the current song',
    async execute(message, args, client) {
        if (!message.member.voice.channel) {
            return message.reply('❌ You must be in a voice channel!');
        }

        if (!djManager.isDJ(message.member)) {
            return message.reply('❌ You need the DJ role to use music commands!');
        }

        const musicPlayer = require('../../utils/musicUtils')(client);
        const player = musicPlayer.getPlayer(message.guild);
        
        if (!player || !player.current) {
            return message.reply('❌ No music is playing!');
        }

        const currentTrack = player.current;
        await player.stop();

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setDescription(`⏭️ Skipped: **${currentTrack.info.title}**`)
            .setTimestamp()
            .setFooter({ 
                text: `Skipped by ${message.author.tag} | By: Enyzelle`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        message.channel.send({ embeds: [embed] });
    }
}; 