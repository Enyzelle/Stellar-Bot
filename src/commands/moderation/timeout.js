const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'timeout',
    aliases: ['mute'],
    description: 'Timeout a member',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('❌ You do not have permission to timeout members!');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Please mention a member to timeout!');
        }

        const duration = args[1];
        if (!duration || !['1m', '5m', '10m', '1h', '1d', '7d'].includes(duration)) {
            return message.reply('Please specify a valid duration (1m, 5m, 10m, 1h, 1d, 7d)');
        }

        const reason = args.slice(2).join(' ') || 'No reason provided';
        const durationMs = parseDuration(duration);

        try {
            await target.timeout(durationMs, reason);
            
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('⏰ Member Timed Out')
                .addFields(
                    { name: 'Member', value: target.user.tag, inline: true },
                    { name: 'Duration', value: duration, inline: true },
                    { name: 'Moderator', value: message.author.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('❌ An error occurred while trying to timeout the member.');
        }
    }
};

function parseDuration(duration) {
    const unit = duration.slice(-1);
    const amount = parseInt(duration.slice(0, -1));
    
    switch (unit) {
        case 'm': return amount * 60 * 1000;
        case 'h': return amount * 60 * 60 * 1000;
        case 'd': return amount * 24 * 60 * 60 * 1000;
        default: return 60 * 1000;
    }
} 