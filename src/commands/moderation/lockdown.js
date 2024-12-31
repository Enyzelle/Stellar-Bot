const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'lockdown',
    description: 'Lock/unlock the current channel',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return message.reply('❌ You do not have permission to manage channels!');
        }

        const state = args[0]?.toLowerCase();
        if (!state || !['on', 'off'].includes(state)) {
            return message.reply('Please specify `on` or `off`');
        }

        try {
            await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: state === 'off'
            });

            const embed = new EmbedBuilder()
                .setColor(state === 'on' ? 'Red' : 'Green')
                .setTitle(`🔒 Channel ${state === 'on' ? 'Locked' : 'Unlocked'}`)
                .setDescription(`This channel has been ${state === 'on' ? 'locked' : 'unlocked'} by ${message.author.tag}`)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('❌ An error occurred while managing channel permissions.');
        }
    }
}; 