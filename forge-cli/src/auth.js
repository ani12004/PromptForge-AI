const fs = require('fs');
const path = require('path');
const os = require('os');
const inquirer = require('inquirer');
const chalk = require('chalk');

const FORGE_HOME = path.join(os.homedir(), '.forge');
const AUTH_FILE = path.join(FORGE_HOME, 'auth.json');

// SECURITY NOTE: API keys are stored as plain JSON with 0o600 permissions.
// For production-grade security, consider using OS-native credential stores:
//   - macOS: Keychain (via 'keytar' npm package)
//   - Windows: Credential Manager (via 'keytar')
//   - Linux: libsecret / GNOME Keyring (via 'keytar')

function ensureForgeHomeDir() {
    if (!fs.existsSync(FORGE_HOME)) {
        fs.mkdirSync(FORGE_HOME, { recursive: true });
    }
}

function getAuth() {
    if (!fs.existsSync(AUTH_FILE)) {
        return {};
    }
    try {
        const rawData = fs.readFileSync(AUTH_FILE, 'utf8');
        return JSON.parse(rawData);
    } catch (err) {
        return {};
    }
}

function setAuth(key) {
    ensureForgeHomeDir();
    const currentAuth = getAuth();
    currentAuth['promptforge'] = key.trim();
    fs.writeFileSync(AUTH_FILE, JSON.stringify(currentAuth, null, 2), { mode: 0o600 });
}

async function requireAuth() {
    const auth = getAuth();
    if (!auth.promptforge) {
        console.log(chalk.yellow('\nNo Prompt Forge API key found. Let\'s get you authenticated.'));

        const { key } = await inquirer.prompt([
            {
                type: 'password',
                name: 'key',
                message: `Enter your Prompt Forge API Key:`,
                mask: '*'
            }
        ]);

        setAuth(key);
        console.log(chalk.green('\n✔ Prompt Forge API key saved securely locally.'));
        return getAuth();
    }
    return auth;
}

module.exports = {
    getAuth,
    setAuth,
    requireAuth
};
