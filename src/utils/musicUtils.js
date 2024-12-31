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

            // Create a player
            const player = this.client.riffy.createConnection({
                guildId: message.guild.id,
                voiceChannel: message.member.voice.channel.id,
                textChannel: message.channel.id,
                deaf: true,
            });

            const resolve = await this.client.riffy.resolve({
                query: query,
                requester: message.author,
            });

            const { loadType, tracks, playlistInfo } = resolve;

            if (loadType === "playlist") {
                for (const track of resolve.tracks) {
                    track.info.requester = message.author;
                    player.queue.add(track);
                }

                if (!player.playing && !player.paused) player.play();
                return { 
                    success: true, 
                    playlist: true, 
                    tracks: tracks,
                    playlistInfo: playlistInfo 
                };

            } else if (loadType === "search" || loadType === "track") {
                const track = tracks.shift();
                track.info.requester = message.author;

                player.queue.add(track);
                if (!player.playing && !player.paused) player.play();
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

    setVolume(player, volume) {
        return player.setVolume(volume);
    }

    stop(player) {
        return player.stop();
    }

    pause(player) {
        return player.pause(true);
    }

    resume(player) {
        return player.pause(false);
    }

    skip(player) {
        return player.stop();
    }

    shuffle(player) {
        return player.queue.shuffle();
    }
}

module.exports = (client) => new MusicPlayer(client); 