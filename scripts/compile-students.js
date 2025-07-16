// scripts/compile-students.js
const fs = require('fs');
const path = require('path');

// This script reads all .md files from 'src/content/students',
// parses the frontmatter and content, and outputs a single students.json file.

const studentsDir = path.join(process.cwd(), 'src/content/students');
const outputDir = path.join(process.cwd(), 'public');
const outputFile = path.join(outputDir, 'students.json');

// A simple function to parse YAML frontmatter from a markdown file.
// This is a basic implementation. For more complex frontmatter, a library
// like 'gray-matter' would be a better choice.
function parseFrontmatter(fileContent) {
    const frontmatter = {};
    const contentLines = fileContent.split('\n');
    if (contentLines[0].trim() === '---') {
        let i = 1;
        while (i < contentLines.length && contentLines[i].trim() !== '---') {
            const line = contentLines[i];
            const separatorIndex = line.indexOf(':');
            if (separatorIndex > 0) {
                const key = line.slice(0, separatorIndex).trim();
                let value = line.slice(separatorIndex + 1).trim();
                // Remove quotes if they exist
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                frontmatter[key] = value;
            }
            i++;
        }
    }
    return frontmatter;
}


function main() {
    try {
        console.log(`Reading files from: ${studentsDir}`);
        const files = fs.readdirSync(studentsDir).filter(file => file.endsWith('.md'));
        console.log(`Found ${files.length} student files to process.`);

        const studentsData = files.map(file => {
            const filePath = path.join(studentsDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const frontmatter = parseFrontmatter(fileContent);
            
            // Add the filename as a slug, without the .md extension
            frontmatter.slug = path.basename(file, '.md');

            return frontmatter;
        });

        // Ensure the output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write the compiled data to the JSON file
        fs.writeFileSync(outputFile, JSON.stringify(studentsData, null, 2));
        console.log(`Successfully compiled student data to ${outputFile}`);

    } catch (error) {
        console.error('An error occurred during script execution:');
        console.error(error);
        process.exit(1); // Exit with an error code
    }
}

main();
