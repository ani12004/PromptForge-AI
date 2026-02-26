#!/usr/bin/env node

const { program } = require('commander');
const { initProject } = require('./init');
const { startStudio } = require('./studio');
const { showBanner } = require('./ui');
const fs = require('fs');
const path = require('path');

program
    .name('forge')
    .description('Prompt Forge Studio - Professional Terminal-Native Prompt Engineering Studio')
    .version('1.0.0');

// Command: init
program
    .command('init [project]')
    .description('Initialize a new Forge project')
    .action((project) => {
        initProject(project || 'prompt-forge-project');
    });

// Default behavior: Studio mode
program
    .action(() => {
        const isProjectDir = fs.existsSync(path.join(process.cwd(), 'forge.config.json'));

        showBanner();

        if (!isProjectDir) {
            console.log('\nWarning: Not inside a Forge project. Run `forge init <project>` to set one up.\n');
        }

        startStudio();
    });

program.parse(process.argv);
