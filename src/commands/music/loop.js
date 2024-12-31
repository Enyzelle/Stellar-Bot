const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'loop',
    aliases: ['repeat'],
    description: 'Toggle loop mode (off/track/queue)',
    async execute(message, args, client) {
        const musicPlayer = require('../../utils/musicUtils')(client);
        const player = musicPlayer.getPlayer(message.guild);
        
        if (!player) {
            return message.reply('❌ No music is playing!');
        }

        const modes = ['off', 'track', 'queue'];
        const mode = args[0]?.toLowerCase();

        if (!mode || !modes.includes(mode)) {
            return message.reply('Please specify a loop mode: `off`, `track`, or `queue`');
        }

        await player.setLoop(mode);
        message.channel.send(`🔄 Loop mode set to: **${mode}**`);
    }
}; 