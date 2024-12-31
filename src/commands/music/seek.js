module.exports = {
    name: 'seek',
    description: 'Seek to a specific position in the current track',
    async execute(message, args, client) {
        const musicPlayer = require('../../utils/musicUtils')(client);
        const player = musicPlayer.getPlayer(message.guild);
        
        if (!player) {
            return message.reply('❌ No music is playing!');
        }

        if (!args[0]) {
            return message.reply('Please specify a time (in seconds)');
        }

        const time = parseInt(args[0]) * 1000; // Convert to milliseconds
        await player.seek(time);
        message.channel.send(`⏩ Seeked to: ${formatTime(time)}`);
    }
};

function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
} 