const { EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../config.json');
const chalk = require('chalk');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        // Node events
        client.riffy.on("nodeConnect", (node) => {
            console.log(
                chalk.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n') +
                chalk.blue(`[Lavalink] `) + 
                chalk.green(`Node "${chalk.cyan(node.name)}" connected successfully!\n`) +
                chalk.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            );
        });

        client.riffy.on("nodeError", (node, error) => {
            console.log(
                chalk.red('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n') +
                chalk.yellow(`[Lavalink] `) + 
                chalk.red(`Node "${chalk.cyan(node.name)}" encountered an error:\n`) +
                chalk.red(`${error.message}\n`) +
                chalk.red('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            );
        });

        client.riffy.on("nodeDisconnect", (node) => {
            console.log(
                chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n') +
                chalk.red(`[Lavalink] `) + 
                chalk.yellow(`Node "${chalk.cyan(node.name)}" disconnected!\n`) +
                chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            );
        });

        // Track events
        client.riffy.on("trackStart", async (player, track) => {
            const channel = client.channels.cache.get(player.textChannel);
            if (!channel) return;

            try {
                const embed = new EmbedBuilder()
                    .setColor(embedColor)
                    .setTitle('🎵 Now Playing')
                    .setDescription(`[${track.info.title}](${track.info.uri})`)
                    .setThumbnail(track.info.thumbnail || null)
                    .addFields(
                        { 
                            name: '👤 Artist', 
                            value: track.info.author || 'Unknown',
                            inline: true 
                        },
                        { 
                            name: '⏱️ Duration', 
                            value: formatTime(track.info.length),
                            inline: true 
                        },
                        { 
                            name: '🎧 Requested By', 
                            value: track.info.requester.tag,
                            inline: true 
                        }
                    )
                    .setTimestamp()
                    .setFooter({ 
                        text: `Queue Length: ${player.queue.length} tracks`, 
                        iconURL: client.user.displayAvatarURL() 
                    });

                await channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Error in trackStart event:', error);
            }
        });

        client.riffy.on("trackEnd", async (player, track) => {
            const channel = client.channels.cache.get(player.textChannel);
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setDescription(`✅ Finished playing: **${track.info.title}**`)
                .setTimestamp();

            channel.send({ embeds: [embed] });
        });

        client.riffy.on("queueEnd", async (player) => {
            const channel = client.channels.cache.get(player.textChannel);
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setDescription('📭 Queue has ended!')
                .setTimestamp();

            channel.send({ embeds: [embed] });
            player.destroy();
        });

        client.riffy.on("playerMove", (player, oldChannel, newChannel) => {
            const channel = client.channels.cache.get(player.textChannel);
            if (!channel) return;

            if (!newChannel) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('❌ Disconnected from voice channel!')
                    .setTimestamp();

                channel.send({ embeds: [embed] });
                player.destroy();
            } else {
                const embed = new EmbedBuilder()
                    .setColor(embedColor)
                    .setDescription(`📤 Moved to: ${newChannel}`)
                    .setTimestamp();

                channel.send({ embeds: [embed] });
            }
        });

        // Initialize Riffy after setting up events
        client.riffy.init(client.user.id);
    }
};

function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);

    return hours > 0 
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes}:${seconds.toString().padStart(2, '0')}`;
} 