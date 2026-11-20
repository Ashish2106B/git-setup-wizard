# Git Setup Wizard

Git Setup Wizard is an interactive command-line tool for preparing a new project for Git and GitHub. It can initialize a Git repository, create starter project files, make an initial commit, configure a GitHub remote, and push the current branch.

## Requirements

- Node.js 18 or newer
- Git installed and available on your `PATH`
- Git credentials configured in Git for GitHub operations

## Run with npx

From the project directory you want to set up, run:

```sh
npx git-setup-wizard
```

The wizard runs in the current directory. Review the prompts before confirming Git operations.

## Supported project types

Choose one of the following project types. The selection is used to create a starter `.gitignore`:

- **Node.js** — ignores dependencies, environment files, build output, coverage output, and npm debug logs.
- **Python** — ignores bytecode caches, virtual environments, and `.env` files.
- **Java** — ignores compiled classes, Maven `target/` output, and common IntelliJ IDEA files.

## Interactive options

The wizard asks for a project name and type, then offers these operations:

1. **Initialize Git repository** — runs `git init -b main`. If the current directory already contains a `.git` entry, initialization is skipped.
2. **Generate `.gitignore`** — writes the template for the selected project type. An existing `.gitignore` is left unchanged.
3. **Generate `README.md`** — writes a small project README using the project name and type. An existing `README.md` is left unchanged.
4. **Create initial commit** — stages eligible project files, displays the staged file list and diff, then asks for confirmation before committing. Automatic staging excludes `.env*`, `*secret*`, `*.pem`, and `*.key` filenames at the repository root and in nested directories; sensitive-looking staged filenames also block the commit.
5. **Configure GitHub remote** — asks for a GitHub HTTPS or SSH URL and adds it as `origin` only when no `origin` remote already exists. Create the GitHub repository first; the wizard does not create repositories or use the GitHub CLI.
6. **Push to GitHub** — asks for confirmation before pushing the current branch to `origin`. Git uses the credentials already configured on your machine; the wizard does not save credentials.

Each operation can be declined. Git initialization, file generation, commit creation, remote configuration, and pushing are controlled independently by your answers.

## Example workflow

For a new Node.js project:

1. Create and enter the project directory.
2. Run `npx git-setup-wizard`.
3. Enter the project name and select **Node.js**.
4. Accept Git initialization and starter file generation.
5. Review the displayed staged files and diff, then confirm the initial commit when prompted.
6. If you want to push, create an empty repository on GitHub, configure it as `origin` when prompted, then confirm the push.

To run the wizard from a local checkout during development, use:

```sh
npm install
npm start
```

## Safety notes

- Existing `.gitignore`, `README.md`, and `origin` remote settings are not overwritten.
- The wizard does not delete project files or configure GitHub credentials.
- Initial staging excludes filenames matching `.env*`, `*secret*`, `*.pem`, and `*.key` at the repository root and in nested directories, then shows the staged changes for review before asking for commit confirmation.
- Filename checks cannot detect secrets stored in ordinary-looking files. Inspect the displayed diff carefully before approving a commit.
- A push sends the current branch and its commits to the configured remote after you confirm.

## License

MIT. See [LICENSE](LICENSE).
