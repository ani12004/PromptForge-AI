const fs = require('fs');
const path = require('path');

const CONFIG_FILE = 'forge.config.json';

function getConfig() {
    const configPath = path.join(process.cwd(), CONFIG_FILE);
    if (!fs.existsSync(configPath)) {
        return null;
    }
    try {
        const rawData = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading forge.config.json', error.message);
        return null;
    }
}

function updateConfig(newConfig) {
    const configPath = path.join(process.cwd(), CONFIG_FILE);
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
}

module.exports = {
    getConfig,
    updateConfig,
};
