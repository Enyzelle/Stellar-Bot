const { EmbedBuilder } = require('discord.js');
const djManager = require('../../utils/djManager');
const { embedColor } = require('../../../config.json');

module.exports = {
    name: 'forceskip',
    aliases: ['fs'],
    description: 'Force skip the current song (DJ only)',
    async execute(message, args, client) {
        if (!djManager.isDJ(message.member)) {
            return message.reply('❌ This command is for DJs only!');
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
            .setDescription(`⏭️ Force skipped: **${currentTrack.info.title}**`)
            .setFooter({ 
                text: `Force skipped by DJ ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setFooter({ text: `By Enyzelle`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

        message.channel.send({ embeds: [embed] });
    }
}; 