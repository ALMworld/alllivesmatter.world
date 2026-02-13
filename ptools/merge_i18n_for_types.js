// Merges split i18n JSON files into a single combined JSON for quicktype type generation.
// Output: src/assets/i18n/en_combined.json (gitignored)
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const enDir = path.join(projectRoot, 'src/assets/i18n/en');

const common = JSON.parse(readFileSync(path.join(enDir, 'common.json'), 'utf-8'));
const advocacy = JSON.parse(readFileSync(path.join(enDir, 'advocacy.json'), 'utf-8'));
const how = JSON.parse(readFileSync(path.join(enDir, 'how.json'), 'utf-8'));
const why = JSON.parse(readFileSync(path.join(enDir, 'why.json'), 'utf-8'));
const about = JSON.parse(readFileSync(path.join(enDir, 'about.json'), 'utf-8'));

const combined = {
    ...common,
    advocacy_data: advocacy,
    how_data: how,
    why_data: why,
    about_data: about,
};

const tempDir = path.join(projectRoot, '.temp_data');
mkdirSync(tempDir, { recursive: true });
const outputPath = path.join(tempDir, 'en_combined.json');
writeFileSync(outputPath, JSON.stringify(combined, null, 2));
console.log(`Combined JSON written to ${outputPath}`);
