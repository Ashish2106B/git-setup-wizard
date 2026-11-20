
const { initializeGit } = require("./git");
const { generateGitignore } = require("./gitignore");
const { generateReadme } = require("./readme");
const { stageInitialFiles, showStagedChanges, createInitialCommit, configureRemote, pushToGitHub } = require("./git");

async function askQuestions() {
    const inquirer = await import("inquirer");

    const answers = await inquirer.default.prompt([
        {
            type: "input",
            name: "projectName",
            message: "What is your project name?"
        },
        {
            type: "select",
            name: "projectType",
            message: "Select your project type:",
            choices: ["Node.js", "Python", "Java"]
        },
        {
            type: "confirm",
            name: "initializeGit",
            message: "Initialize Git repository?",
            default: true
        },
        {
            type: "confirm",
            name: "generateGitignore",
            message: "Generate .gitignore?",
            default: true
        },
        {
            type: "confirm",
            name: "generateReadme",
            message: "Generate README.md?",
            default: true
        },
        {
            type: "confirm",
            name: "setupRemote",
            message: "Configure GitHub remote?",
            default: false
        },
        {
            type: "confirm",
            name: "pushToGitHub",
            message: "Push to GitHub after setup?",
            default: false
        }
    ]);

    console.log("\nYour Setup Configuration:");
    console.log(answers);

    if (answers.initializeGit) {
        initializeGit();
    }

    if (answers.generateGitignore) {
        generateGitignore(answers.projectType);
    }

    if (answers.generateReadme) {
        generateReadme(answers.projectName, answers.projectType);
    }

    const stagedFiles = stageInitialFiles();
    if (stagedFiles.length > 0) {
        showStagedChanges();
        const { confirmed } = await inquirer.default.prompt([{
            type: "confirm",
            name: "confirmed",
            message: "Create an initial commit with the staged files shown above?",
            default: false
        }]);
        if (confirmed) createInitialCommit();
        else console.log("Initial commit skipped.");
    }

    if (answers.setupRemote) {
        const { remoteUrl } = await inquirer.default.prompt([{
            type: "input",
            name: "remoteUrl",
            message: "GitHub repository URL (HTTPS or SSH):",
            validate: (value) => /^git@github\.com:[^\s]+\.git$|^https:\/\/github\.com\/[^\s]+$/i.test(value) || "Enter a valid GitHub HTTPS or SSH URL."
        }]);
        configureRemote(remoteUrl);
    }

    if (answers.pushToGitHub) {
        const { confirmed } = await inquirer.default.prompt([{
            type: "confirm",
            name: "confirmed",
            message: "Push the current branch and its commits to origin?",
            default: false
        }]);
        if (confirmed) pushToGitHub();
        else console.log("Push skipped.");
    }
}

askQuestions().catch((error) => {
    console.error("Setup stopped because an operation failed:", error.message);
    process.exitCode = 1;
});
