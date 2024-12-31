module.exports = {
    name: 'pause',
    description: 'Pause the current track',
    async execute(message, args, client) {
        const musicPlayer = require('../../utils/musicUtils')(client);
        const player = musicPlayer.getPlayer(message.guild);
        
        if (!player) {
            return message.reply('❌ No music is playing!');
        }

        try {
            const paused = player.paused;
            await musicPlayer.pause(player);
            message.channel.send(paused ? '▶️ Resumed!' : '⏸️ Paused!');
        } catch (error) {
            console.error(error);
            message.channel.send('❌ Error changing pause state!');
        }
    }
}; 