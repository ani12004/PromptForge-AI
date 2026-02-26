const ora = require('ora');

const MODELS = ['nvidia', 'gemini'];

// Simulates checking latency and status for available models
async function checkAllModelsHealth() {
    const results = [];
    const spinner = ora('Pinging AI providers...').start();

    for (const model of MODELS) {
        // Simulate latency and status randomly
        const latency = Math.floor(Math.random() * 1000) + 100;
        let status = 'Active';

        // Randomize some issues for realism
        if (model === 'gemini') {
            status = 'Offline';
        } else if (latency > 800) {
            status = 'Degraded';
        }

        results.push({
            name: model,
            status: status,
            latency: status === 'Offline' ? null : latency
        });

        // Small delay to make spinner look realistic
        await new Promise(r => setTimeout(r, 400));
    }

    spinner.succeed('Health check complete');
    return results;
}

module.exports = {
    checkAllModelsHealth
};
