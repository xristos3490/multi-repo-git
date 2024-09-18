# Multi Repo Git

**Multi Repo Git** is a command-line tool designed to streamline the management of `git` and `gh` commands across multiple repositories. By acting as a wrapper around these commands, it enables you to perform operations on multiple repositories simultaneously, reducing the time and effort required for repetitive tasks.

## Features

- Execute `git` and `gh` commands across multiple repositories with a single command.
- Supports all `git` and `gh` commands with their original specifications.
- Offers flexibility in selecting repositories using an interactive picker or the `-all` flag to target all repositories.
- Easy setup and usage with a simple configuration file.

## Installation

Follow these steps to install and set up Multi Repo Git:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/xristos3490/multi-repo-git.git
   ```
2. **Navigate to the cloned directory** and install dependencies:
   ```bash
   cd multi-repo-git
   npm install
   ```
3. **Add an alias**:
   Edit your `.zshrc` or `.bashrc` file and add the following alias:
   ```bash
   export mgit="node /path/to/multi-repo-git/mgit.js"
   ```
   Replace `/path/to/multi-repo-git` with the path where you cloned the repository.

4. **Set up GitHub CLI**:
   Ensure you have the `gh` CLI installed and authenticated to interact with your GitHub account:
   ```bash
   gh auth login
   ```

5. **Create the `.mgit-repos` JSON file**:
   In your home directory, create a file named `.mgit-repos` with the following structure:
   ```json
   {
     "repositories": [
       {
         "name": "Repository 1",
         "path": "/path/to/repository-1"
       },
       {
         "name": "Repository 2",
         "path": "/path/to/repository-2"
       },
       {
         "name": "Repository 3",
         "path": "/path/to/repository-3"
       }
     ]
   }
   ```
   Replace `/path/to/repository-x` with the actual paths to your repositories.

## Usage

### Selecting Repositories

You can choose which repositories to target in two ways:

- **Using the `-all` Argument**: To run a command on all repositories listed in your `.mgit-repos` file, include the `-all` flag right after `mgit`:
  ```bash
  mgit -all git status
  ```
  This command will execute `git status` across all the repositories defined in the `.mgit-repos` file.

- **Interactive Picker**: If you omit the `-all` flag, Multi Repo Git will display an interactive picker for you to select the repositories where you want to run the command.

### Example Commands

Here are some example workflows using Multi Repo Git:

1. **Check the status of all repositories**:
   ```bash
   mgit -all git status
   ```
2. **Create a new branch in each repository**:
   ```bash
   mgit -all git checkout -b fix/issue
   ```
3. **Add and commit changes**:
   ```bash
   mgit -all git add . && mgit -all git commit -m "Fix issue"
   ```
4. **Push changes to the remote**:
   ```bash
   mgit -all git push origin fix/issue
   ```
5. **Create pull requests for each repository**:
   ```bash
   mgit -all gh pr create --title "Fix issue" --body "Description of the fix"
   ```

## Final Thoughts

Multi Repo Git simplifies the process of managing multiple repositories by allowing you to run `git` and `gh` commands across them simultaneously. Whether you need to execute a command on all repositories using the `-all` flag or prefer selecting specific ones through the interactive picker, this tool provides a flexible and efficient solution.
