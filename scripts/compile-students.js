// scripts/compile-students.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // Import the gray-matter library

// This script reads all .md files from 'src/content/students',
// parses the frontmatter using gray-matter, and outputs a single students.json file.

const studentsDir = path.join(process.cwd(), 'src/content/students');
const outputDir = path.join(process.cwd(), 'public');
const outputFile = path.join(outputDir, 'students.json');

function main() {
    try {
        console.log(`Reading files from: ${studentsDir}`);
        const files = fs.readdirSync(studentsDir).filter(file => file.endsWith('.md'));
        console.log(`Found ${files.length} student files to process.`);

        const studentsData = files.map(file => {
            const filePath = path.join(studentsDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            // Use gray-matter to parse the file. It correctly handles multi-line fields.
            // It returns an object with 'data' (frontmatter) and 'content' (the rest of the file).
            const { data } = matter(fileContent);
            
            // Add the filename as a slug, without the .md extension
            data.slug = path.basename(file, '.md');

            return data;
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
