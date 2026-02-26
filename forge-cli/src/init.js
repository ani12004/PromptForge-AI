const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const boxen = require('boxen');

function initProject(projectName) {
    const projectPath = path.join(process.cwd(), projectName);

    console.log(
        boxen(chalk.bold.cyan(`Initializing Forge Studio Project: ${projectName}`), {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'cyan'
        })
    );

    const spinner = ora('Creating directories...').start();

    try {
        if (!fs.existsSync(projectPath)) {
            fs.mkdirSync(projectPath);
        }

        // Create folder structure
        const dirs = ['prompts', 'sessions', 'logs', '.forge'];
        dirs.forEach(dir => {
            fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
        });

        spinner.succeed('Directories created');

        // Create files
        spinner.start('Generating configuration files...');

        const configContent = {
            project: projectName,
            version: '1.0.0',
            defaultModel: 'gpt-4o',
            autoFailover: true
        };
        fs.writeFileSync(
            path.join(projectPath, 'forge.config.json'),
            JSON.stringify(configContent, null, 2)
        );

        const gitignoreContent = `.forge/
logs/
.env
*.log
node_modules/
`;
        fs.writeFileSync(
            path.join(projectPath, '.gitignore'),
            gitignoreContent
        );

        const readmeContent = `# ${projectName}
    
A Prompt Forge Studio project.

## Directory Structure
- \`/prompts\` - Your prompt templates
- \`/sessions\` - Saved studio sessions
- \`/logs\` - Execution logs
- \`/.forge\` - Local project cache (git-ignored)
`;
        fs.writeFileSync(
            path.join(projectPath, 'README.md'),
            readmeContent
        );

        spinner.succeed('Configuration files generated');

        // Initialize git repo if not exists
        spinner.start('Initializing git repository...');
        try {
            if (!fs.existsSync(path.join(projectPath, '.git'))) {
                execSync('git init', { cwd: projectPath, stdio: 'ignore' });
                spinner.succeed('Git repository initialized');
            } else {
                spinner.info('Git repository already exists');
            }
        } catch (e) {
            spinner.warn('Git is not installed or failed to initialize');
        }

        console.log('\n' + chalk.green('✔ Project setup complete!'));
        console.log(`\nNext steps:\n  ${chalk.cyan(`cd ${projectName}`)}\n  ${chalk.cyan('forge')}`);

    } catch (error) {
        spinner.fail('Failed to initialize project');
        console.error(chalk.red(error.message));
    }
}

module.exports = {
    initProject
};
