const musicPlayer = require('../../utils/musicUtils');

module.exports = {
    name: 'volume',
    aliases: ['vol'],
    description: 'Adjust the music volume',
    execute(message, args) {
        const queue = musicPlayer.getQueue(message.guild);
        
        if (!queue) {
            return message.reply('❌ No music is playing!');
        }

        const volume = parseInt(args[0]);
        if (isNaN(volume) || volume < 0 || volume > 200) {
            return message.reply('Please provide a valid volume level (0-200)');
        }

        musicPlayer.setVolume(queue, volume);
        message.channel.send(`🔊 Volume set to: **${volume}%**`);
    }
}; 