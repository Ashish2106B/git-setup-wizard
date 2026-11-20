
const fs = require("fs");
const path = require("path");

function generateGitignore(projectType) {
    const templates = {
        "Node.js": `
node_modules/
.env
.env.*
dist/
coverage/
npm-debug.log
`,

        "Python": `
__pycache__/
*.pyc
.venv/
venv/
.env
`,

        "Java": `
*.class
target/
.idea/
*.iml
`
    };

    const content = templates[projectType];

    if (!content) {
        throw new Error("Unsupported project type");
    }

    const filePath = path.join(process.cwd(), ".gitignore");

    if (fs.existsSync(filePath)) {
        console.log(".gitignore already exists. Skipping.");
        return;
    }

    fs.writeFileSync(filePath, content.trim() + "\n");

    console.log(".gitignore generated successfully!");
}

module.exports = { generateGitignore };
