const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'filter',
    aliases: ['f'],
    description: 'Apply audio filter to the music',
    async execute(message, args, client) {
        const musicPlayer = require('../../utils/musicUtils')(client);
        const player = musicPlayer.getPlayer(message.guild);
        
        if (!player) {
            return message.reply('❌ No music is playing!');
        }

        if (!args[0]) {
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🎛️ Available Filters')
                .setDescription('`bass`, `pop`, `soft`, `treblebass`, `nightcore`, `vaporwave`, `clear`')
                .setFooter({ text: 'Usage: !filter <name>' });
            
            return message.channel.send({ embeds: [embed] });
        }

        const filter = args[0].toLowerCase();
        const validFilters = ['bass', 'pop', 'soft', 'treblebass', 'nightcore', 'vaporwave', 'clear'];

        if (!validFilters.includes(filter)) {
            return message.reply(`Invalid filter! Available filters: ${validFilters.join(', ')}`);
        }

        try {
            if (filter === 'clear') {
                await player.clearFilters();
                return message.channel.send('🎛️ Cleared all filters!');
            }

            await player.setFilter(filter);
            message.channel.send(`🎛️ Filter set to: **${filter}**`);
        } catch (error) {
            console.error(error);
            message.channel.send('❌ Error applying filter!');
        }
    }
}; 