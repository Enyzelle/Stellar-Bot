const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'say',
    description: 'Make the bot say something',
    execute(message, args) {
        if (!args.length) {
            return message.reply('Please provide something for me to say!');
        }

        // Check for mentions to prevent abuse
        if (message.mentions.everyone || message.mentions.roles.size > 0) {
            if (!message.member.permissions.has(PermissionFlagsBits.MentionEveryone)) {
                return message.reply('❌ You cannot use mentions in the say command!');
            }
        }

        const text = args.join(' ');
        
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setDescription(text)
            .setFooter({ 
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        message.delete().catch(() => {});
        message.channel.send({ embeds: [embed] });
    }
}; 