const fs = require('fs');
const path = require('path');

const maps = ['wake', 'el_alamein', 'stalingrad', 'midway'];
const outPath = path.join(__dirname, 'assets.ts');

let content = '// Auto-generated assets\n\n';

maps.forEach(map => {
    const filePath = path.join(process.cwd(), 'public', 'images', 'maps', `${map}.png`);
    if (fs.existsSync(filePath)) {
        const b64 = fs.readFileSync(filePath, 'base64');
        const varName = map.toUpperCase() + '_B64';
        content += `export const ${varName} = "data:image/png;base64,${b64}";\n`;
        console.log(`Generated ${varName}`);
    } else {
        console.error(`Missing ${filePath}`);
    }
});

fs.writeFileSync(outPath, content);
console.log(`Wrote assets to ${outPath}`);
