const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../server/routes.ts');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Define the start and end markers
    const startMarker = '// TEMPORARY FIX ENDPOINT';
    const nextRoute = 'app.get("/api/me", async (req, res) => {';

    const startIndex = content.indexOf(startMarker);
    const endIndex = content.indexOf(nextRoute);

    if (startIndex !== -1 && endIndex !== -1) {
        console.log(`Found block from index ${startIndex} to ${endIndex}`);

        // Remove the block, keeping the next route
        const newContent = content.substring(0, startIndex) + content.substring(endIndex);

        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Successfully reverted server/routes.ts');
    } else {
        console.log('Could not find the temporary endpoint block.');
        if (startIndex === -1) console.log('Start marker not found');
        if (endIndex === -1) console.log('End marker not found');
    }
} catch (err) {
    console.error('Failed to revert file:', err);
}
