const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Ban a member from the server',
    async execute(message, args, client) {
        // Check permissions
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply('❌ You do not have permission to ban members!');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Please mention a member to ban!');
        }

        // Check if target is bannable
        if (!target.bannable) {
            return message.reply('❌ I cannot ban this member!');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';

        try {
            await target.ban({ reason });
            
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('🔨 Member Banned')
                .addFields(
                    { name: 'Member', value: target.user.tag, inline: true },
                    { name: 'Moderator', value: message.author.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('❌ An error occurred while trying to ban the member.');
        }
    }
}; 