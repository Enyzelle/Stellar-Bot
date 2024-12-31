const { EmbedBuilder, version: djsversion } = require('discord.js');
const { version } = require('../../../package.json');
const { embedColor } = require('../../../config.json');
const os = require('os');

module.exports = {
    name: 'botinfo',
    aliases: ['bi', 'info'],
    description: 'Display bot information',
    execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('Bot Information')
            .addFields(
                { name: '🤖 Bot Name', value: client.user.tag, inline: true },
                { name: '📊 Servers', value: client.guilds.cache.size.toString(), inline: true },
                { name: '👥 Users', value: client.users.cache.size.toString(), inline: true },
                { name: '⚙️ Version', value: version, inline: true },
                { name: '📚 Discord.js', value: `v${djsversion}`, inline: true },
                { name: '📡 Node.js', value: process.version, inline: true },
                { name: '💾 Memory', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: '💻 Platform', value: os.platform(), inline: true },
                { name: '⏰ Uptime', value: formatUptime(client.uptime), inline: true }
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};

function formatUptime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / 1000 / 60 / 60) % 24);
    const days = Math.floor(ms / 1000 / 60 / 60 / 24);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
} 