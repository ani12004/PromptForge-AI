const ora = require('ora');
const { getHealthStatus } = require('./health');
const { requireAuth } = require('./auth');
const chalk = require('chalk');

// Real AI responses based on prompt input using Prompt Forge API
async function generateResponse(prompt, model) {
    const spinner = ora(`Generating response with ${chalk.cyan(model)} via Prompt Forge...`).start();

    try {
        const auth = await requireAuth();
        const apiKey = auth.promptforge;

        if (!apiKey) {
            throw new Error('Prompt Forge API Key is missing. Run `:key` to set it.');
        }

        // Send request to your local or deployed Prompt Forge instance
        // We default to the production URL, but users can override this in their forge.config.json
        const { getConfig } = require('./config');
        const config = getConfig() || {};
        const baseUrl = config.host || 'https://prompt-forge-studio.vercel.app';

        const payload = { prompt };
        if (model) {
            payload.model = model;
        }

        const response = await fetch(`${baseUrl}/api/v1/cli`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || errData.message || `API Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to generate content');
        }

        spinner.succeed(`Received response from ${chalk.cyan(data.meta?.model || model)} using Prompt Forge API in ${data.meta?.latency_ms || '?'}ms`);

        return {
            text: data.data,
            metadata: {
                model: data.meta?.model || model,
                latency: data.meta?.latency_ms,
                tokensInput: data.meta?.tokens_input,
                tokensOutput: data.meta?.tokens_output,
                costMicroUsd: data.meta?.cost_micro_usd
            }
        };

    } catch (error) {
        spinner.fail(`Failed to get response`);
        throw error;
    }
}

async function executeWithFailover(prompt, primaryModel, autoFailover) {
    const healthManager = require('./health');

    try {
        return await generateResponse(prompt, primaryModel);
    } catch (error) {
        if (!autoFailover) {
            throw error;
        }

        // Auto-failover logic
        if (primaryModel === 'gemini') {
            console.log(chalk.red(`\n[!] Google Gemini API outage detected. Switching back to Nvidia API...`));
        } else {
            console.log(chalk.yellow(`\n⚠ Auto-failover triggered. ${primaryModel} failed.`));
        }

        const allModels = ['nvidia', 'gemini'].filter(m => m !== primaryModel);

        // Find next healthy model (simulated)
        for (const backup of allModels) {
            try {
                console.log(chalk.dim(`Attempting fallback to ${backup}...`));
                return await generateResponse(prompt, backup);
            } catch (backupError) {
                // continue
            }
        }

        throw new Error('All failover attempts exhausted.');
    }
}

module.exports = {
    generateResponse,
    executeWithFailover
};
