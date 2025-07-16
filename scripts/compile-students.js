// scripts/compile-students.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // Import the gray-matter library

// This script reads all .md files from 'src/content/students',
// parses the frontmatter using gray-matter, and outputs a single students.json file.
// This version includes enhanced error handling to identify problematic files.

const studentsDir = path.join(process.cwd(), 'src/content/students');
const outputDir = path.join(process.cwd(), 'public');
const outputFile = path.join(outputDir, 'students.json');

function main() {
    let files;
    try {
        console.log(`Reading files from: ${studentsDir}`);
        files = fs.readdirSync(studentsDir).filter(file => file.endsWith('.md'));
        console.log(`Found ${files.length} student files to process.`);
    } catch (error) {
        console.error(`Error reading directory ${studentsDir}:`, error);
        process.exit(1);
    }
    
    const studentsData = [];
    // Loop through each file to process them one by one
    for (const file of files) {
        const filePath = path.join(studentsDir, file);
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            // Use gray-matter to parse the file.
            const { data } = matter(fileContent);
            data.slug = path.basename(file, '.md');
            studentsData.push(data);
        } catch (error) {
            // --- ENHANCED ERROR HANDLING ---
            // If a single file fails, this block will run, printing a detailed
            // error message that points directly to the problematic file.
            console.error(`\n\n--- ERROR: Failed to process file: ${file} ---\n`);
            console.error(`File Path: ${filePath}`);
            console.error('Error Details:', error.message);
            console.error('\nPlease check the YAML frontmatter syntax in this file.');
            console.error('Common issues include unclosed quotes or incorrect indentation.');
            console.error('--------------------------------------------------\n\n');
            
            // Exit with an error code to fail the entire workflow run.
            process.exit(1);
        }
    }

    // This part of the script only runs if all files were processed successfully.
    try {
        // Ensure the output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        // Write the compiled data to the JSON file
        fs.writeFileSync(outputFile, JSON.stringify(studentsData, null, 2));
        console.log(`Successfully compiled all student data to ${outputFile}`);
    } catch (error) {
        console.error('Error writing the final JSON file:', error);
        process.exit(1);
    }
}

main();
