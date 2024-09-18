#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { spawnSync } = require('child_process');

/**
 * Displays usage instructions.
 */
function displayUsage() {
  console.log('Usage: node sww.js [-all] <command> [args...]');
  console.log('Commands:');
  console.log('  git <args...>');
  console.log('  gh <args...>');
  console.log('Examples:');
  console.log('  node sww.js git status');
  console.log('  node sww.js gh pr list');
  console.log('  node sww.js -all git pull origin main');
}

const reposFile = path.join(os.homedir(), '.sww-repos');

let reposData;
try {
  const data = fs.readFileSync(reposFile, 'utf8');
  reposData = JSON.parse(data);
} catch (err) {
  console.error(chalk.red('Error: Failed to load .sww-repos file.'));
  console.error('Please ensure that .sww-repos exists in your home directory and is correctly formatted.');
  process.exit(1);
}

if (!reposData.repositories || !Array.isArray(reposData.repositories)) {
  console.error(chalk.red('Error: .sww-repos file is incorrectly formatted.'));
  console.error('It should contain a "repositories" array with repository definitions.');
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(chalk.red('Error: No command provided.'));
  displayUsage();
  process.exit(1);
}

let isAll = false;
if (args[0] === '-all') {
  isAll = true;
  args.shift();
}

// Extract the command and its arguments
const [cmd, ...cmdArgs] = args;

// Validate that only 'git' or 'gh' commands are allowed
if (!['git', 'gh'].includes(cmd)) {
  console.error(chalk.red(`Error: Unsupported command "${cmd}".`));
  console.error('Only "git" and "gh" commands are allowed for safety.');
  displayUsage();
  process.exit(1);
}

(async () => {
  let repositoriesToUse;

  if (cmd === 'cd') {
    await handleCd(cmdArgs);
    return;
  }

  if (isAll) {
    repositoriesToUse = reposData.repositories;
  } else {
    repositoriesToUse = await selectRepositories(reposData.repositories);
  }

  if (repositoriesToUse.length === 0) {
    console.error(chalk.red('Error: No repositories selected.'));
    process.exit(1);
  }

  await executeCommandInRepositories(repositoriesToUse, cmd, cmdArgs);
})();

async function selectRepositories(repositories) {
  const choices = repositories.map((repo, index) => ({
    name: repo.name,
    value: index,
  }));
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedRepos',
      message: 'Select repositories:',
      choices: choices,
    },
  ]);
  return answers.selectedRepos.map((index) => repositories[index]);
}

async function executeCommandInRepositories(repositories, command, args) {
  for (const repo of repositories) {
    console.log(chalk.blue.bold(`\n===== Repository: ${repo.name} =====`));
    try {
      // Execute the command with preserved color output
      const result = spawnSync(command, args, {
        cwd: repo.path,
        stdio: 'inherit',
        shell: false, // Disable shell to prevent shell-specific security issues
      });

      if (result.error) {
        console.error(chalk.red(`Error executing command in ${repo.name}: ${result.error.message}`));
      } else if (result.status !== 0) {
        console.error(chalk.red(`Command exited with code ${result.status} in ${repo.name}`));
      }
    } catch (err) {
      console.error(chalk.red(`Error executing command in ${repo.name}: ${err.message}`));
    }
  }
}

async function handleCd(args) {
  const key = args[0];

  let repo;

  if (key) {
    repo = reposData.repositories.find(
      (r) => r.name.toLowerCase() === key.toLowerCase()
    );
    if (!repo) {
      console.error(chalk.red(`Error: Repository with key "${key}" not found.`));
      process.exit(1);
    }
  } else {
    const choices = reposData.repositories.map((repo, index) => ({
      name: repo.name,
      value: index,
    }));
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedRepo',
        message: 'Select a repository to cd into:',
        choices: choices,
      },
    ]);
    repo = reposData.repositories[answers.selectedRepo];
  }

  // Output the repository path
  console.log(repo.path);
}
