const fs = require('fs');
const path = require('path');
const { prefix: defaultPrefix } = require('../../config.json');

class PrefixManager {
    constructor() {
        this.prefixesPath = path.join(__dirname, '../../data/prefixes.json');
        this.blacklistedPrefixes = ['/', '>', '<', '@', '#', '$', '%', '^', '&', '*', '\\'];
        this.prefixes = this.loadPrefixes();
    }

    loadPrefixes() {
        try {
            if (fs.existsSync(this.prefixesPath)) {
                return JSON.parse(fs.readFileSync(this.prefixesPath));
            }
            return {};
        } catch (error) {
            console.error('Error loading prefixes:', error);
            return {};
        }
    }

    getPrefix(guildId) {
        return this.prefixes[guildId] || defaultPrefix;
    }

    validatePrefix(prefix) {
        // Check length
        if (prefix.length > 3) {
            return { valid: false, reason: 'Prefix must be 3 characters or less' };
        }

        // Check blacklist
        if (this.blacklistedPrefixes.includes(prefix)) {
            return { valid: false, reason: 'This prefix is not allowed' };
        }

        // Check for spaces
        if (prefix.includes(' ')) {
            return { valid: false, reason: 'Prefix cannot contain spaces' };
        }

        // Check for discord mentions
        if (prefix.match(/<@!?&?\d+>/)) {
            return { valid: false, reason: 'Prefix cannot be a Discord mention' };
        }

        return { valid: true };
    }

    setPrefix(guildId, newPrefix) {
        const validation = this.validatePrefix(newPrefix);
        if (!validation.valid) {
            throw new Error(validation.reason);
        }

        this.prefixes[guildId] = newPrefix;
        this.savePrefixes();
        return true;
    }

    resetPrefix(guildId) {
        delete this.prefixes[guildId];
        this.savePrefixes();
        return defaultPrefix;
    }

    savePrefixes() {
        try {
            const dir = path.dirname(this.prefixesPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.prefixesPath, JSON.stringify(this.prefixes, null, 2));
        } catch (error) {
            console.error('Error saving prefixes:', error);
            throw error;
        }
    }
}

module.exports = new PrefixManager(); 