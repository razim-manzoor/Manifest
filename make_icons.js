
import fs from 'fs';
import path from 'path';

// Minimal 1x1 pixel transparent PNG
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
const buffer = Buffer.from(base64Png, 'base64');

const iconDir = path.join(process.cwd(), 'extension', 'icons');

['icon16.png', 'icon48.png', 'icon128.png'].forEach(file => {
    fs.writeFileSync(path.join(iconDir, file), buffer);
    console.log(`Generated ${file}`);
});
