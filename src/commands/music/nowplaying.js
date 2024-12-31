const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Show currently playing track',
    execute(message, args, client) {
        const musicPlayer = require('../../utils/musicUtils')(client);
        const player = musicPlayer.getPlayer(message.guild);
        
        if (!player || !player.current) {
            return message.reply('❌ No music is playing!');
        }

        const track = player.current;
        const position = player.position;
        const duration = track.info.length;

        const progress = createProgressBar(position, duration);

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setAuthor({ name: `🎵 Now Playing` })
            .setDescription(`[${track.info.title}](${track.info.uri})`)
            .addFields(
                { name: 'Author', value: track.info.author, inline: true },
                { name: 'Requested By', value: track.info.requester.tag, inline: true },
                { name: 'Progress', value: `${progress}\n\`${formatTime(position)} / ${formatTime(duration)}\``, inline: false }
            )
            .setFooter({ text: `By Enyzelle`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

        message.channel.send({ embeds: [embed] });
    }
};

function createProgressBar(current, total, barSize = 15) {
    const percentage = current / total;
    const progress = Math.round(barSize * percentage);
    const emptyProgress = barSize - progress;

    const progressText = '▇'.repeat(progress);
    const emptyProgressText = '—'.repeat(emptyProgress);
    const percentageText = Math.round(percentage * 100);

    return `\`[${progressText}${emptyProgressText}]\` ${percentageText}%`;
}

function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);

    return hours > 0 
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes}:${seconds.toString().padStart(2, '0')}`;
} 