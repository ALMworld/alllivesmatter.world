/**
 * Auto-generate zh-TW (Traditional Chinese) i18n files from zh (Simplified Chinese)
 * using OpenCC s2twp (Simplified → Taiwan Traditional with phrase conversion)
 *
 * Usage: node ptools/generate_zh_tw.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as OpenCC from 'opencc-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ZH_DIR = path.resolve(__dirname, '../src/assets/i18n/zh');
const ZH_TW_DIR = path.resolve(__dirname, '../src/assets/i18n/zh-TW');

// OpenCC converter: Simplified Chinese → Taiwan Traditional (with phrase conversion)
const converter = OpenCC.Converter({ from: 'cn', to: 'twp' });

/**
 * Convert a string value from Simplified to Traditional Chinese.
 * Preserves non-string values (numbers, booleans, null).
 */
function convertValue(value) {
    if (typeof value === 'string') {
        return converter(value);
    }
    if (Array.isArray(value)) {
        return value.map(item => convertValue(item));
    }
    if (value !== null && typeof value === 'object') {
        return convertObject(value);
    }
    return value;
}

/**
 * Recursively convert all string values in an object.
 */
function convertObject(obj) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key] = convertValue(value);
    }
    return result;
}

/**
 * Convert a single JSON file from zh to zh-TW.
 */
function convertJsonFile(srcPath, destPath) {
    const content = fs.readFileSync(srcPath, 'utf-8');
    const data = JSON.parse(content);
    const converted = convertObject(data);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, JSON.stringify(converted, null, 4), 'utf-8');
}

/**
 * Convert a single MDX/text file from zh to zh-TW.
 */
function convertTextFile(srcPath, destPath) {
    const content = fs.readFileSync(srcPath, 'utf-8');
    const converted = converter(content);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, converted, 'utf-8');
}

/**
 * Recursively process all files in the zh directory.
 */
function processDirectory(srcDir, destDir) {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);

        if (entry.isDirectory()) {
            processDirectory(srcPath, destPath);
        } else if (entry.name.endsWith('.json')) {
            convertJsonFile(srcPath, destPath);
            console.log(`  ✓ ${path.relative(ZH_DIR, srcPath)}`);
        } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
            convertTextFile(srcPath, destPath);
            console.log(`  ✓ ${path.relative(ZH_DIR, srcPath)}`);
        } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
            // Rewrite import paths from zh/ to zh-TW/ and rename exports
            let content = fs.readFileSync(srcPath, 'utf-8');
            content = content.replaceAll('/i18n/zh/', '/i18n/zh-TW/');
            content = content.replaceAll("'/zh/", "'/zh-TW/");
            content = content.replaceAll('zhFaqContent', 'zhTWFaqContent');
            content = content.replace('Chinese (Simplified)', 'Chinese (Traditional) — auto-generated');
            content = content.replace('Chinese locale', 'Traditional Chinese locale');
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
            fs.writeFileSync(destPath, content, 'utf-8');
            console.log(`  ✓ ${path.relative(ZH_DIR, srcPath)} (paths rewritten)`);
        } else {
            // Copy other files as-is
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
            fs.copyFileSync(srcPath, destPath);
            console.log(`  → ${path.relative(ZH_DIR, srcPath)} (copied)`);
        }
    }
}

// Main
console.log('🔄 Generating zh-TW from zh using OpenCC (s2twp)...\n');

// Clean output directory
if (fs.existsSync(ZH_TW_DIR)) {
    fs.rmSync(ZH_TW_DIR, { recursive: true });
}
fs.mkdirSync(ZH_TW_DIR, { recursive: true });

processDirectory(ZH_DIR, ZH_TW_DIR);

const fileCount = fs.readdirSync(ZH_TW_DIR, { recursive: true }).length;
console.log(`\n✅ Generated ${fileCount} files in src/assets/i18n/zh-TW/`);
