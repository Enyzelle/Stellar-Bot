const { EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../../config.json');

module.exports = {
    name: 'filter',
    aliases: ['f'],
    description: 'Apply audio filters to the music',
    async execute(message, args, client) {
        const musicPlayer = require('../../utils/musicUtils')(client);
        const player = musicPlayer.getPlayer(message.guild);

        if (!player) {
            return message.reply('❌ No music is playing!');
        }

        if (!args[0]) {
            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setAuthor({ name: `🎛️ Available Filters` })
                .setDescription(
                    '`bassboost`, `pop`, `soft`, `treblebass`, `nightcore`, `vaporwave`, `clear`\n' +
                    'Use `!filter <name>` to apply a filter.'
                )
                .setFooter({ text: 'Type a filter name to apply it. | By: Enyzelle', iconURL: client.user.displayAvatarURL({ dynamic: true}) });

            return message.channel.send({ embeds: [embed] });
        }

        const filter = args[0].toLowerCase();
        const filterFunctions = {
            bassboost: (player) => player.filters.setBassboost(true, { value: 2 }),
            pop: (player) => player.filters.setTimescale(true, { pitch: 1.2 }),
            soft: (player) => player.filters.setTremolo(true, { frequency: 2, depth: 0.3 }),
            treblebass: (player) => player.filters.setKaraoke(true, { level: 0.5, monoLevel: 0.5 }),
            nightcore: (player) => player.filters.setNightcore(true),
            vaporwave: (player) => player.filters.setVaporwave(true),
            clear: (player) => player.filters.clearFilters(),
        };

        if (!filterFunctions[filter]) {
            return message.reply(
                `❌ Invalid filter! Available filters: ${Object.keys(filterFunctions).join(', ')}`
            );
        }

        try {
            // Apply the selected filter
            await filterFunctions[filter](player);

            const response = filter === 'clear'
                ? '🎛️ Cleared all filters!'
                : `🎛️ Filter applied: **${filter}**`;
            return message.channel.send(response);
        } catch (error) {
            console.error(error);
            return message.channel.send('❌ An error occurred while applying the filter!');
        }
    },
};
