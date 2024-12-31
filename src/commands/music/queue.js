const { EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../../config.json');

module.exports = {
    name: 'queue',
    aliases: ['q'],
    description: 'Display the current queue',
    async execute(message, args, client) {
        const musicPlayer = require('../../utils/musicUtils')(client);
        const player = musicPlayer.getPlayer(message.guild);

        if (!player || !player.queue.length) {
            return message.reply('❌ No songs in queue!');
        }

        const queue = player.queue;
        const multiple = 10;
        const page = args[0] ? parseInt(args[0]) : 1;
        const end = page * multiple;
        const start = end - multiple;

        const tracks = queue.slice(start, end);
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('🎵 Queue')
            .setDescription(tracks.map((track, i) => 
                `**${start + (i + 1)}.** [${track.info.title}](${track.info.uri}) - ${track.info.author}`
            ).join('\n'))
            .addFields(
                { name: 'Now Playing', value: `[${player.current.info.title}](${player.current.info.uri})`, inline: false },
                { name: 'Total Queue Time', value: formatTime(queue.reduce((acc, cur) => acc + cur.info.length, 0)), inline: true },
                { name: 'Total Songs', value: queue.length.toString(), inline: true }
            )
            .setFooter({ 
                text: `Page ${page} of ${Math.ceil(queue.length / multiple)}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        message.channel.send({ embeds: [embed] });
    }
};

function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);

    return hours > 0 
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes}:${seconds.toString().padStart(2, '0')}`;
} 