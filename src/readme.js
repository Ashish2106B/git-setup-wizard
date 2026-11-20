const fs = require("fs");
const path = require("path");

function generateReadme(projectName, projectType) {
    const safeName = (projectName || "My Project").trim() || "My Project";
    const content = `# ${safeName}\n\nA ${projectType || "software"} project.\n\n## Getting started\n\nAdd setup and usage instructions for this project here.\n\n## License\n\nAdd a license before distributing this project.\n`;
    const filePath = path.join(process.cwd(), "README.md");

    if (fs.existsSync(filePath)) {
        console.log("README.md already exists. Skipping.");
        return false;
    }

    fs.writeFileSync(filePath, content, { flag: "wx" });
    console.log("README.md generated successfully!");
    return true;
}

module.exports = { generateReadme };
