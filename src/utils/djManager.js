const fs = require('fs');
const path = require('path');

class DJManager {
    constructor() {
        this.djRolesPath = path.join(__dirname, '../../data/djRoles.json');
        this.ensureFile();
        this.djRoles = this.loadDJRoles();
    }

    ensureFile() {
        const dir = path.dirname(this.djRolesPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.djRolesPath)) {
            fs.writeFileSync(this.djRolesPath, '{}');
        }
    }

    loadDJRoles() {
        try {
            return JSON.parse(fs.readFileSync(this.djRolesPath, 'utf-8'));
        } catch (error) {
            console.error('Error loading DJ roles:', error);
            return {};
        }
    }

    saveDJRoles() {
        try {
            fs.writeFileSync(this.djRolesPath, JSON.stringify(this.djRoles, null, 2));
        } catch (error) {
            console.error('Error saving DJ roles:', error);
        }
    }

    setDJRole(guildId, roleId) {
        this.djRoles[guildId] = roleId;
        this.saveDJRoles();
    }

    removeDJRole(guildId) {
        delete this.djRoles[guildId];
        this.saveDJRoles();
    }

    getDJRole(guildId) {
        return this.djRoles[guildId];
    }

    isDJ(member) {
        const djRole = this.getDJRole(member.guild.id);
        if (!djRole) return true; // If no DJ role is set, everyone is a DJ
        return member.roles.cache.has(djRole) || member.permissions.has('Administrator');
    }
}

module.exports = new DJManager(); 