import * as fs from 'fs';
import * as path from 'path';

const BG_FILES = [
    'sig-bak1.png',
    'sig-back2.png',
    'sig-back3.png',
    'sig-back4.png',
    'sig-back5.png',
    'sig-back6.png',
    'sig-back7.png',
    'sig-back8.png',
    'sig-back9.png',
    'sig-back10.png',
    'sig-back11.png',
];

// Cache loaded at module init — avoids disk reads on every signature request
const BG_CACHE: string[] = BG_FILES.map((filename) => {
    const imgPath = path.join(process.cwd(), 'public', 'images', 'forum', filename);
    const buffer = fs.readFileSync(imgPath);
    return `data:image/png;base64,${buffer.toString('base64')}`;
});

export function getRandomBgDataUri(): string {
    return BG_CACHE[Math.floor(Math.random() * BG_CACHE.length)];
}
