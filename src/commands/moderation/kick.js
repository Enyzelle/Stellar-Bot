const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kick a member from the server',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply('❌ You do not have permission to kick members!');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Please mention a member to kick!');
        }

        if (!target.kickable) {
            return message.reply('❌ I cannot kick this member!');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';

        try {
            await target.kick(reason);
            
            const embed = new EmbedBuilder()
                .setColor('Orange')
                .setTitle('👢 Member Kicked')
                .addFields(
                    { name: 'Member', value: target.user.tag, inline: true },
                    { name: 'Moderator', value: message.author.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('❌ An error occurred while trying to kick the member.');
        }
    }
}; 