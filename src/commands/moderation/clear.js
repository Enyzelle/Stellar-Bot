const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'clear',
    aliases: ['purge'],
    description: 'Clear messages from the channel',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('❌ You do not have permission to clear messages!');
        }

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply('Please provide a number between 1 and 100!');
        }

        try {
            const deleted = await message.channel.bulkDelete(amount, true);
            message.channel.send(`🗑️ Deleted ${deleted.size} messages!`)
                .then(msg => setTimeout(() => msg.delete(), 5000));
        } catch (error) {
            message.reply('❌ Cannot delete messages older than 14 days!');
        }
    }
}; 