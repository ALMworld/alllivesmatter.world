/**
 * Auto-generate llms.txt and llms-full.txt for the ALM project.
 * Reads English i18n JSON + FAQ MDX files → outputs to public/
 *
 * Follows the llmstxt.org specification.
 * Usage: node ptools/generate_llms_txt.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://alllivesmatter.world';
const I18N_DIR = path.resolve(__dirname, '../src/assets/i18n/en');
const FAQ_DIR = path.resolve(__dirname, '../src/assets/i18n/en/faq');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// ── Helpers ─────────────────────────────────────────────────────────────────

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function readMdx(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    // Strip JSX import/export lines that aren't useful for LLMs
    content = content.replace(/^import\s.+$/gm, '');
    content = content.replace(/^export\s.+$/gm, '');
    // Strip HTML/JSX tags but keep text content
    content = content.replace(/<[^>]+>/g, '');
    return content.trim();
}

function stripHtml(str) {
    if (!str) return '';
    return str.replace(/<[^>]+>/g, '').trim();
}

// ── Data Loading ────────────────────────────────────────────────────────────

function loadAllData() {
    const about = readJson(path.join(I18N_DIR, 'about.json'));
    const advocacy = readJson(path.join(I18N_DIR, 'advocacy.json'));
    const common = readJson(path.join(I18N_DIR, 'common.json'));
    const how = readJson(path.join(I18N_DIR, 'how.json'));
    const why = readJson(path.join(I18N_DIR, 'why.json'));

    // Load all FAQ MDX files
    const faqFiles = fs.readdirSync(FAQ_DIR)
        .filter(f => f.endsWith('.mdx'))
        .sort();

    const faqContents = {};
    for (const file of faqFiles) {
        const baseName = file.replace('.mdx', '');
        faqContents[baseName] = readMdx(path.join(FAQ_DIR, file));
    }

    return { about, advocacy, common, how, why, faqContents };
}

// ── llms.txt (Index) ────────────────────────────────────────────────────────

function generateIndex(data) {
    const { about, common, how } = data;
    const lines = [];

    // Header
    lines.push('# All Lives Matter World');
    lines.push('');
    lines.push('> Advocacy for universal kindness, fairness, and DUKI (Decentralized Universal Kindness Income) — a vision where all lives truly matter. Love Is The Way: Kindness First, Fairness Always, and DUKI In Action.');
    lines.push('');

    // Pages
    lines.push('## Pages');
    lines.push('');
    lines.push(`- [Home](${BASE_URL}/en): Main landing page with advocacy mission and global vision`);
    lines.push(`- [About](${BASE_URL}/en/about): Mission statement, FAQ, and thought posters on media, war, peace, and DUKI`);
    lines.push(`- [Why](${BASE_URL}/en/why): Evolutionary perspective — why cooperation and kindness are the fittest survival strategy`);
    lines.push(`- [How](${BASE_URL}/en/how): DUKI marketing strategy, blockchain implementation, and proof-of-concept projects`);
    lines.push('');

    // FAQ
    lines.push('## FAQ');
    lines.push('');
    if (about.faq_list) {
        about.faq_list.forEach((faq, i) => {
            const num = i + 1;
            lines.push(`- [${faq.question}](${BASE_URL}/en/about#faq-${num})`);
        });
    }
    lines.push('');

    // Key Concepts (DUKI Terms)
    lines.push('## Key Concepts');
    lines.push('');
    if (common.common_data?.duki_terms) {
        for (const term of common.common_data.duki_terms) {
            // Extract the short term name from the full term string
            const shortName = term.term.split(':')[0].trim();
            const shortDef = term.definition.split('.')[0].trim() + '.';
            lines.push(`- **${shortName}**: ${shortDef}`);
        }
    }
    lines.push('');

    // Proof of Concept Projects
    if (how.sections?.proof_of_concept?.projects) {
        lines.push('## Projects');
        lines.push('');
        for (const project of how.sections.proof_of_concept.projects) {
            if (project.link) {
                lines.push(`- [${project.name}](${project.link}): ${project.description} [${project.status}]`);
            }
        }
        lines.push('');
    }

    // Recommended Books
    lines.push('## Recommended Reading');
    lines.push('');
    lines.push(`- [llms-full.txt](${BASE_URL}/llms-full.txt): Complete content of the website in a single file`);

    return lines.join('\n');
}

// ── llms-full.txt (Full Content) ────────────────────────────────────────────

function generateFull(data) {
    const { about, advocacy, common, how, why, faqContents } = data;
    const lines = [];

    // Header
    lines.push('# All Lives Matter World — Full Content');
    lines.push('');
    lines.push('> Advocacy for universal kindness, fairness, and DUKI (Decentralized Universal Kindness Income) — a vision where all lives truly matter.');
    lines.push('');

    // ── About / Mission ─────────────────────────────────────────────────────
    lines.push('---');
    lines.push('');
    lines.push('## About');
    lines.push('');
    lines.push(`**${about.title}**`);
    lines.push('');
    if (about.sub_title) {
        lines.push(stripHtml(about.sub_title));
        lines.push('');
    }
    if (about.sections) {
        for (const section of about.sections) {
            lines.push(stripHtml(section));
            lines.push('');
        }
    }

    // ── Advocacy ────────────────────────────────────────────────────────────
    lines.push('---');
    lines.push('');
    lines.push('## Advocacy');
    lines.push('');
    lines.push(`**${advocacy.slogan}**`);
    lines.push('');
    lines.push(`*${advocacy.mantra} — ${advocacy.mantraDao}*`);
    lines.push('');

    if (advocacy.mantra_details) {
        for (const mantra of advocacy.mantra_details) {
            lines.push(`### ${mantra.mantra.trim()}`);
            lines.push('');
            lines.push(stripHtml(mantra.description));
            lines.push('');
            if (mantra.keyPoints) {
                for (const kp of mantra.keyPoints) {
                    lines.push(`**${kp.title}**: ${stripHtml(kp.description)}`);
                    lines.push('');
                }
            }
        }
    }

    // ── DUKI Terms ──────────────────────────────────────────────────────────
    lines.push('---');
    lines.push('');
    lines.push('## DUKI Terms');
    lines.push('');
    if (common.common_data?.duki_terms) {
        for (const term of common.common_data.duki_terms) {
            lines.push(`### ${term.term}`);
            lines.push('');
            lines.push(term.definition);
            lines.push('');
        }
    }

    // ── Why — Evolutionary Perspective ───────────────────────────────────────
    lines.push('---');
    lines.push('');
    lines.push('## Why: Evolutionary Perspective');
    lines.push('');
    if (why.highlight) {
        lines.push(`> ${stripHtml(why.highlight.situation)}`);
        lines.push('');
        lines.push(`**${why.highlight.question}**`);
        lines.push('');
    }

    if (why.books) {
        for (const book of why.books) {
            lines.push(`### ${book.title} — by ${book.author}`);
            lines.push('');
            lines.push(book.intro);
            lines.push('');
            if (book.topic1) {
                lines.push(`**${book.topic1.headline}**: ${book.topic1.content}`);
                lines.push('');
            }
            if (book.topic2) {
                lines.push(`**${book.topic2.headline}**: ${book.topic2.content}`);
                lines.push('');
            }
        }
    }

    // ── How — DUKI Marketing ────────────────────────────────────────────────
    lines.push('---');
    lines.push('');
    lines.push('## How: DUKI Marketing & Blockchain');
    lines.push('');
    if (how.header) {
        lines.push(`**${how.header.title}**`);
        lines.push('');
        lines.push(how.header.subtitle);
        lines.push('');
    }

    if (how.sections?.why_duki_captures_attention) {
        const section = how.sections.why_duki_captures_attention;
        lines.push(`### ${section.title}`);
        lines.push('');
        for (const benefit of section.benefits) {
            lines.push(`- **${benefit.title}**: ${benefit.description}`);
        }
        lines.push('');
    }

    if (how.sections?.implementation_guide) {
        const section = how.sections.implementation_guide;
        lines.push(`### ${section.title}`);
        lines.push('');
        lines.push(section.subtitle);
        lines.push('');
        for (const step of section.steps) {
            lines.push(`**Step ${step.step_number}: ${step.title}** — ${step.subtitle}`);
            lines.push(step.description);
            lines.push('');
        }
    }

    if (how.sections?.proof_of_concept) {
        const section = how.sections.proof_of_concept;
        lines.push(`### ${section.title}`);
        lines.push('');
        for (const project of section.projects) {
            const link = project.link ? ` → [${project.link}](${project.link})` : '';
            lines.push(`- **${project.name}** [${project.status}]: ${project.description}${link}`);
        }
        lines.push('');
    }

    // ── FAQ ─────────────────────────────────────────────────────────────────
    lines.push('---');
    lines.push('');
    lines.push('## Frequently Asked Questions');
    lines.push('');

    if (about.faq_list) {
        about.faq_list.forEach((faq, i) => {
            lines.push(`### FAQ ${i + 1}: ${faq.question}`);
            lines.push('');

            // Try to load the MDX content
            if (faq.answersFile && faqContents[faq.answersFile]) {
                lines.push(faqContents[faq.answersFile]);
            }
            lines.push('');
        });
    }

    // ── Thought Posters ─────────────────────────────────────────────────────
    lines.push('---');
    lines.push('');
    lines.push('## Thought Posters');
    lines.push('');

    if (about.thoughtPosters) {
        for (const poster of about.thoughtPosters) {
            const title = poster.title || (poster.titleSegments ? poster.titleSegments.join(' — ') : '');
            if (title) {
                lines.push(`### ${title}`);
                lines.push('');
            }
            if (poster.paragraphs) {
                for (const p of poster.paragraphs) {
                    lines.push(stripHtml(p));
                    lines.push('');
                }
            }
        }
    }

    return lines.join('\n');
}

// ── Main ────────────────────────────────────────────────────────────────────

console.log('📝 Generating llms.txt and llms-full.txt...\n');

const data = loadAllData();

const indexContent = generateIndex(data);
const fullContent = generateFull(data);

fs.mkdirSync(PUBLIC_DIR, { recursive: true });

fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), indexContent, 'utf-8');
console.log(`  ✓ public/llms.txt (${indexContent.length} bytes)`);

fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), fullContent, 'utf-8');
console.log(`  ✓ public/llms-full.txt (${fullContent.length} bytes)`);

console.log('\n✅ llms.txt generation complete!');
