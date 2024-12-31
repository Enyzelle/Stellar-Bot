const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'warn',
    description: 'Warn a member',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.reply('❌ You do not have permission to warn members!');
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Please mention a member to warn!');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';
        const warnsPath = path.join(__dirname, '../../../data/warns.json');

        // Load or create warns file
        let warns = {};
        if (fs.existsSync(warnsPath)) {
            warns = JSON.parse(fs.readFileSync(warnsPath));
        }

        // Initialize guild and user warns if they don't exist
        if (!warns[message.guild.id]) warns[message.guild.id] = {};
        if (!warns[message.guild.id][target.id]) warns[message.guild.id][target.id] = [];

        // Add new warning
        warns[message.guild.id][target.id].push({
            reason,
            moderator: message.author.id,
            timestamp: Date.now()
        });

        // Save warns
        fs.writeFileSync(warnsPath, JSON.stringify(warns, null, 2));

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setAuthor({ name: `⚠️ Member Warned` })
            .addFields(
                { name: 'Member', value: target.user.tag, inline: true },
                { name: 'Moderator', value: message.author.tag, inline: true },
                { name: 'Reason', value: reason },
                { name: 'Total Warnings', value: warns[message.guild.id][target.id].length.toString() }
            )
            .setTimestamp()
            .setFooter({ text: `By Enyzelle`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

        message.channel.send({ embeds: [embed] });
    }
}; 