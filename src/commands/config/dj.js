const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const djManager = require('../../utils/djManager');

module.exports = {
    name: 'dj',
    description: 'Manage DJ role settings',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply('❌ You need Manage Roles permission to use this command!');
        }

        const subCommand = args[0]?.toLowerCase();

        if (!subCommand || !['set', 'remove', 'info'].includes(subCommand)) {
            return message.reply('Usage: !dj <set/remove/info> [role mention]');
        }

        if (subCommand === 'set') {
            const role = message.mentions.roles.first();
            if (!role) {
                return message.reply('Please mention a role to set as DJ!');
            }

            djManager.setDJRole(message.guild.id, role.id);
            
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setAuthor({ name: `DJ Role Set` })
                .setDescription(`Successfully set ${role} as the DJ role!`)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        }
        else if (subCommand === 'remove') {
            djManager.removeDJRole(message.guild.id);
            
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setAuthor({ name: `DJ Role Removed` })
                .setDescription('DJ role requirement has been removed.')
                .setTimestamp()
                .setFooter({ text: `By Enyzelle`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            message.channel.send({ embeds: [embed] });
        }
        else if (subCommand === 'info') {
            const djRoleId = djManager.getDJRole(message.guild.id);
            const djRole = djRoleId ? message.guild.roles.cache.get(djRoleId) : null;
            
            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setAuthor({ name: `DJ Role Information` })
                .setDescription(djRole 
                    ? `Current DJ role: ${djRole}`
                    : 'No DJ role set - anyone can use music commands!')
                .setTimestamp()
                .setFooter({ text: `By Enyzelle`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            message.channel.send({ embeds: [embed] });
        }
    }
}; 