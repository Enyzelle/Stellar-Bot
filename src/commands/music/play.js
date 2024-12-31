const { EmbedBuilder } = require('discord.js');
const djManager = require('../../utils/djManager');
const { embedColor } = require('../../../config.json');

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Play a song or add it to queue',
    async execute(message, args, client) {
        if (!message.member.voice.channel) {
            return message.reply('❌ You must be in a voice channel!');
        }

        // Check for DJ permissions
        if (!djManager.isDJ(message.member)) {
            return message.reply('❌ You need the DJ role to use music commands!');
        }

        if (!args.length) {
            return message.reply('Please provide a song to play!');
        }

        const musicPlayer = require('../../utils/musicUtils')(client);
        const query = args.join(' ');
        const result = await musicPlayer.play(message, query);

        if (!result.success) {
            return message.reply(result.message);
        }

        if (result.playlist) {
            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle('🎵 Added Playlist to Queue')
                .setDescription(`Added ${result.tracks.length} tracks from ${result.playlistInfo.name}`)
                .setTimestamp()
                .setFooter({ 
                    text: `Requested by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                });

            return message.channel.send({ embeds: [embed] });
        }

        // Create embed without thumbnail first
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('🎵 Added to Queue')
            // .setThumbnail(result.track.info.thumbnail)
            .setDescription(`[${result.track.info.title}](${result.track.info.uri})`)
            .addFields(
                { name: '👤 Artist', value: result.track.info.author, inline: true },
                { name: '⏱️ Duration', value: formatTime(result.track.info.length), inline: true }
            )
            .setTimestamp()
            .setFooter({ 
                text: `Requested by ${message.author.tag}`,
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