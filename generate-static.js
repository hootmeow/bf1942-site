const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'public/images/forum');
const outputPath = path.join(__dirname, 'app/sig/static-assets.ts');

try {
    console.log(`Scanning ${inputDir}...`);
    const files = fs.readdirSync(inputDir).filter(f => f.toLowerCase().endsWith('.png'));

    console.log(`Found ${files.length} images.`);

    let arrayContent = `// Auto-generated assets for static signature\n// Generated at ${new Date().toISOString()}\n\nexport const SIG_BACKGROUNDS = [\n`;

    for (const file of files) {
        const filePath = path.join(inputDir, file);
        const buffer = fs.readFileSync(filePath);
        const b64 = buffer.toString('base64');
        const mime = 'image/png';

        console.log(`Processing ${file} (${buffer.length} bytes)...`);

        // Append as a string in the array
        arrayContent += `    "data:${mime};base64,${b64}",\n`;
    }

    arrayContent += `];\n`;

    fs.writeFileSync(outputPath, arrayContent);
    console.log(`Successfully wrote ${files.length} images to ${outputPath}`);

    // Check size
    const stats = fs.statSync(outputPath);
    console.log(`Output file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

} catch (err) {
    console.error("Error generating assets:", err);
    process.exit(1);
}
