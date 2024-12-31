const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { embedColor, prefix: defaultPrefix } = require('../../../config.json');
const prefixManager = require('../../utils/prefixManager');

module.exports = {
    name: 'prefix',
    aliases: ['setprefix', 'changeprefix'],
    description: 'Change the bot prefix for this server',
    usage: '<new_prefix/reset/show>',
    async execute(message, args) {
        // Check if user has admin permissions
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ You need Administrator permission to change the prefix!');
        }

        const currentPrefix = prefixManager.getPrefix(message.guild.id);

        // Show current prefix if no args
        if (!args.length) {
            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setAuthor({ name: `⚙️ Server Prefix` })
                .setDescription(`Current prefix is: \`${currentPrefix}\``)
                .addFields(
                    { name: 'Change Prefix', value: `${currentPrefix}prefix <new_prefix>`, inline: true },
                    { name: 'Reset Prefix', value: `${currentPrefix}prefix reset`, inline: true }
                )
                .setFooter({ text: `By Enyzelle`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.channel.send({ embeds: [embed] });
        }

        const subCommand = args[0].toLowerCase();

        // Handle reset
        if (subCommand === 'reset') {
            const resetPrefix = prefixManager.resetPrefix(message.guild.id);
            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setAuthor({ name: `⚙️ Prefix Reset` })
                .setDescription(`Server prefix has been reset to: \`${resetPrefix}\``)
                .setFooter({ 
                    text: `Reset by ${message.author.tag} | By: Enyzelle`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                });

            return message.channel.send({ embeds: [embed] });
        }

        // Handle show
        if (subCommand === 'show' || subCommand === 'info') {
            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setAuthor({ name: `⚙️ Prefix Information` })
                .addFields(
                    { name: 'Current Prefix', value: `\`${currentPrefix}\``, inline: true },
                    { name: 'Default Prefix', value: `\`${defaultPrefix}\``, inline: true },
                    { name: 'Max Length', value: '3 characters', inline: true },
                    { name: 'Blacklisted Characters', value: prefixManager.blacklistedPrefixes.join(' ') }
                )
                .setFooter({ text: `By Enyzelle`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.channel.send({ embeds: [embed] });
        }

        // Handle prefix change
        const newPrefix = args[0];

        try {
            prefixManager.setPrefix(message.guild.id, newPrefix);

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setAuthor({ name: `⚙️ Prefix Updated` })
                .setDescription(`Server prefix has been changed to: \`${newPrefix}\``)
                .addFields(
                    { name: 'Example', value: `${newPrefix}play`, inline: true },
                    { name: 'Reset Command', value: `${newPrefix}prefix reset`, inline: true }
                )
                .setFooter({ 
                    text: `Changed by ${message.author.tag} | By: Enyzelle`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            message.reply(`❌ ${error.message}`);
        }
    }
}; 