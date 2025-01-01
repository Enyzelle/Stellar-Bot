const { Riffy } = require('riffy');
const { EmbedBuilder } = require('discord.js');

class MusicPlayer {
    constructor(client) {
        this.client = client;
    }

    async play(message, query) {
        try {
            if (!message.member.voice.channel) {
                return { success: false, message: 'You must be in a voice channel!' };
            }

            let player = this.client.riffy.players.get(message.guild.id);
            
            if (!player) {
                player = await this.client.riffy.createConnection({
                    guildId: message.guild.id,
                    voiceChannel: message.member.voice.channel.id,
                    textChannel: message.channel.id,
                    deaf: true,
                });
            }

            const resolve = await this.client.riffy.resolve({
                query: query,
                requester: message.author,
            });

            const { loadType, tracks, playlistInfo } = resolve;

            if (loadType === "playlist") {
                for (const track of tracks) {
                    player.queue.add(track);
                }

                if (!player.playing) {
                    await player.play();
                }

                return { 
                    success: true, 
                    playlist: true, 
                    tracks: tracks,
                    playlistInfo: playlistInfo 
                };

            } else if (loadType === "search" || loadType === "track") {
                const track = tracks[0];
                player.queue.add(track);

                if (!player.playing) {
                    await player.play();
                }

                return { success: true, track: track };
            } else {
                return { success: false, message: "No results found." };
            }

        } catch (error) {
            console.error(error);
            return { success: false, message: `Error: ${error.message}` };
        }
    }

    getPlayer(guild) {
        return this.client.riffy.players.get(guild.id);
    }

    async setVolume(player, volume) {
        if (player) {
            await player.setVolume(volume);
        }
    }

    async stop(player) {
        if (player) {
            player.queue.clear();
            await player.destroy();
        }
    }

    async pause(player) {
        if (player && !player.paused) {
            await player.pause();
        }
    }

    async resume(player) {
        if (player && player.paused) {
            await player.resume();
        }
    }

    async skip(player) {
        if (player) {
            await player.stop(); // This will trigger trackEnd event and play next song
        }
    }

    shuffle(player) {
        if (player && player.queue.length > 0) {
            player.queue.shuffle();
        }
    }
}

module.exports = (client) => new MusicPlayer(client); 