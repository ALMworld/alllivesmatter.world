// Script to extract FAQ answers from about.json and create MDX files
import fs from 'fs';
import path from 'path';

const aboutJson = JSON.parse(fs.readFileSync('src/assets/i18n/en/about.json', 'utf8'));
const faqList = aboutJson.faq_list;
const outputDir = 'src/assets/i18n/en/faq';

// Helper to create slug from question
function createSlug(question, index) {
    const slug = question
        .toLowerCase()
        .replace(/['"?:,\.]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 40);
    return `${String(index + 1).padStart(2, '0')}-${slug}`;
}

// Convert HTML-ish content to MDX-friendly format
function convertToMdx(answer) {
    // Convert class= to className= for JSX compatibility
    let mdx = answer.replace(/class=/g, 'className=');
    // Keep other HTML as-is since MDX supports it
    return mdx;
}

// Create MDX files
faqList.forEach((faq, index) => {
    const slug = createSlug(faq.question, index);
    const filename = `${slug}.mdx`;
    const filepath = path.join(outputDir, filename);

    // Create MDX content from answers array
    const content = faq.answers.map(answer => convertToMdx(answer)).join('\n\n');

    fs.writeFileSync(filepath, content);
    console.log(`Created: ${filename}`);

    // Store the slug for updating about.json
    faq.answersFile = slug;
});

// Update about.json - remove answers, add answersFile
const updatedFaqList = faqList.map(faq => {
    const { answers, _answers, ...rest } = faq;
    return rest;
});

aboutJson.faq_list = updatedFaqList;
fs.writeFileSync('src/assets/i18n/en/about.json', JSON.stringify(aboutJson, null, 2));
console.log('\nUpdated about.json with answersFile references');
