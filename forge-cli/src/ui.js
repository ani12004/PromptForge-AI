const figlet = require('figlet');
const gradient = require('gradient-string');
const boxen = require('boxen');
const chalk = require('chalk');
const Table = require('cli-table3');

function showBanner() {
    const bannerText = figlet.textSync('FORGE STUDIO', { font: 'Standard', horizontalLayout: 'fitted' });
    console.log(gradient.pastel.multiline(bannerText));
}

function showSessionPanel(model, status, autoFailover) {
    let statusColor;
    switch (status.toLowerCase()) {
        case 'active':
            statusColor = chalk.green(status);
            break;
        case 'degraded':
            statusColor = chalk.yellow(status);
            break;
        case 'offline':
            statusColor = chalk.red(status);
            break;
        default:
            statusColor = chalk.white(status);
    }

    const autoText = autoFailover ? chalk.green('ON') : chalk.red('OFF');

    const content = [
        chalk.bold.cyan('Forge Studio (beta)'),
        `Model: ${chalk.white(model)}`,
        `Status: ${statusColor}`,
        `Auto-Failover: ${autoText}`
    ].join('\n');

    console.log(
        boxen(content, {
            padding: 1,
            margin: { top: 1, bottom: 1 },
            borderStyle: 'bold',
            borderColor: 'blue',
            dimBorder: true
        })
    );
}

function showModelComparison(modelsInfo) {
    const table = new Table({
        head: [chalk.cyan('Model'), chalk.cyan('Status'), chalk.cyan('Latency')],
        chars: {
            'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
            'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
            'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
            'right': '│', 'right-mid': '┤', 'middle': '│'
        }
    });

    modelsInfo.forEach(info => {
        let statusColor, latencyDisplay;

        if (info.status === 'Active') {
            statusColor = chalk.green(info.status);
            latencyDisplay = info.latency ? chalk.white(`${info.latency}ms`) : '-';
        } else if (info.status === 'Degraded') {
            statusColor = chalk.yellow(info.status);
            latencyDisplay = info.latency ? chalk.yellow(`${info.latency}ms`) : '-';
        } else {
            statusColor = chalk.red(info.status);
            latencyDisplay = chalk.dim('-');
        }

        table.push([info.name, statusColor, latencyDisplay]);
    });

    console.log('\n' + table.toString() + '\n');
}

function formatAIResponse(text, metadata = {}) {
    const metaText = Object.keys(metadata).length > 0
        ? chalk.dim(`\n\n---\n[Model: ${metadata.model || 'unknown'} | Latency: ${metadata.latency || 0}ms]`)
        : '';

    const boxedResponse = boxen(chalk.white(text) + metaText, {
        padding: 1,
        margin: { top: 1, bottom: 1 },
        borderStyle: 'round',
        borderColor: 'magenta',
        title: chalk.magenta.bold(' AI Response '),
        titleAlignment: 'left'
    });

    console.log(boxedResponse);
}

function showErrorBox(title, message) {
    console.log(
        boxen(chalk.red(message), {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: 'red',
            title: chalk.red.bold(` Error: ${title} `)
        })
    );
}

function showInfoBox(message) {
    console.log(
        boxen(chalk.cyan(message), {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'cyan'
        })
    );
}

module.exports = {
    showBanner,
    showSessionPanel,
    showModelComparison,
    formatAIResponse,
    showErrorBox,
    showInfoBox
};
