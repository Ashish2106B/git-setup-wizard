
const { execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

function initializeGit() {
    const currentDirectory = process.cwd();

    const gitFolder = path.join(currentDirectory, ".git");

    if (fs.existsSync(gitFolder)) {
        console.log("Git repository already exists.");
        return;
    }

    try {
        execFileSync("git", ["init", "-b", "main"], {
            cwd: currentDirectory,
            stdio: "inherit"
        });

        console.log("Git initialized successfully!");
    } catch (error) {
        console.log("Failed to initialize Git.");
        throw error;
    }
}

function isGitRepository() {
    try {
        execFileSync("git", ["rev-parse", "--is-inside-work-tree"], { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

function stageInitialFiles() {
    if (!isGitRepository()) {
        console.log("Initialize a Git repository before staging files. Skipping.");
        return [];
    }
    try {
        // Keep common credentials and private key files out of the automatic staging set.
        execFileSync("git", ["add", "-A", "--", ".", ":!**/.env*", ":!**/*secret*", ":!**/*.pem", ":!**/*.key"], { stdio: "inherit" });
        const staged = execFileSync("git", ["diff", "--cached", "--name-only"], { encoding: "utf8" }).trim();
        if (!staged) {
            console.log("No files to commit. Skipping.");
            return [];
        }
        return staged.split("\n");
    } catch (error) {
        console.log("Failed to stage project files.");
        throw error;
    }
}

function showStagedChanges() {
    if (!isGitRepository()) return;
    console.log("\nFiles staged for the initial commit:");
    // `git status --short` marks staged entries in its first status column.
    execFileSync("git", ["status", "--short"], { stdio: "inherit" });
    console.log("\nStaged diff:");
    execFileSync("git", ["diff", "--cached", "--"], { stdio: "inherit" });
}

function createInitialCommit() {
    if (!isGitRepository()) {
        console.log("Initialize a Git repository before creating a commit. Skipping.");
        return false;
    }
    try {
        const staged = execFileSync("git", ["diff", "--cached", "--name-only"], { encoding: "utf8" }).trim();
        if (!staged) {
            console.log("No staged files to commit. Skipping.");
            return false;
        }
        if (staged.split("\n").some((file) => /(^|\/)(\.env[^/]*|[^/]*secret[^/]*|[^/]+\.(pem|key))$/i.test(file))) {
            console.log("A sensitive-looking file is staged. Remove it from staging before committing. Skipping.");
            return false;
        }
        execFileSync("git", ["commit", "-m", "Initial commit"], { stdio: "inherit" });
        console.log("Initial commit created successfully!");
        return true;
    } catch (error) {
        console.log("Failed to create the initial commit.");
        throw error;
    }
}

function configureRemote(remoteUrl) {
    if (!isGitRepository()) {
        console.log("Initialize a Git repository before configuring a remote. Skipping.");
        return false;
    }
    if (!/^git@github\.com:[^\s]+\.git$|^https:\/\/github\.com\/[^\s]+$/i.test(remoteUrl || "")) {
        console.log("Enter a valid GitHub HTTPS or SSH repository URL. Skipping.");
        return false;
    }

    try {
        const existing = execFileSync("git", ["remote", "get-url", "origin"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
        if (existing) {
            console.log(`Git remote 'origin' already exists (${existing}). Skipping.`);
            return false;
        }
    } catch {
        // No origin remote exists; it is safe to add one.
    }

    execFileSync("git", ["remote", "add", "origin", remoteUrl], { stdio: "inherit" });
    console.log("GitHub remote 'origin' configured successfully!");
    return true;
}

function pushToGitHub() {
    if (!isGitRepository()) {
        console.log("Initialize a Git repository before pushing. Skipping.");
        return false;
    }
    try {
        execFileSync("git", ["remote", "get-url", "origin"], { stdio: "ignore" });
        const branch = execFileSync("git", ["branch", "--show-current"], { encoding: "utf8" }).trim() || "main";
        execFileSync("git", ["push", "-u", "origin", branch], { stdio: "inherit" });
        console.log("Pushed to GitHub successfully!");
        return true;
    } catch (error) {
        console.log("Could not push. Check that origin is configured, a commit exists, and your Git credentials are available.");
        throw error;
    }
}

module.exports = { initializeGit, isGitRepository, stageInitialFiles, showStagedChanges, createInitialCommit, configureRemote, pushToGitHub };
