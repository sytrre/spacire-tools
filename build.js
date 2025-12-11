#!/usr/bin/env node

/**
 * Spacire Tools Build Script
 * Generates index.html from tools-config.json and homepage-template.html
 * 
 * Version: 1.19.0
 * Changes from original:
 * - Added social media icons under Spacire description in footer
 * - Removed .html from all tool links
 * - Added 2 more reasons to "Why Use Spacire Sleep Tools?" section
 * 
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');

// Load config
const config = JSON.parse(fs.readFileSync('tools-config.json', 'utf8'));

// Icon SVGs mapped by name
const icons = {
    environment: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
    shift: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>',
    calculator: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/><line x1="14" y1="18" x2="16" y2="18"/></svg>',
    routine: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    sound: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5"/><path d="M15.54,8.46a5,5,0,0,1,0,7.07"/><path d="M19.07,4.93a10,10,0,0,1,0,14.14"/></svg>',
    remedy: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
    travel: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
    chronotype: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>',
    cycle: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>',
    insomnia: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="15" y1="10" x2="15.01" y2="10"/><path d="M8 15h8"/></svg>',
    nap: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4"/><path d="M21 5h-4"/></svg>',
    assessment: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/></svg>',
    hygiene: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>',
    dream: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M4 9h1"/><path d="M7 6l.7.7"/><path d="M9 3v1"/></svg>',
    sleep: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    caffeine: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>',
    apnea: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 16v-5a6 6 0 10-12 0v5"/><path d="M21 19H3v-2a2 2 0 012-2h14a2 2 0 012 2z"/><path d="M12 6V2"/></svg>',
    tracker: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>',
    bedroom: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
    clock: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>',
    moon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    leaf: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>'
};

const checkIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>';
const clockSmall = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>';

// Sort tools by order
const sortedTools = [...config.tools].sort((a, b) => a.order - b.order);
const activeTools = sortedTools.filter(t => t.status === 'active');

// Helper function to get tool URL without .html
function getToolUrl(tool) {
    if (tool.status !== 'active') return '#';
    return tool.file.replace('.html', '');
}

// Generate tool card HTML (matching original template style)
function generateToolCard(tool, isFirst = false) {
    const isActive = tool.status === 'active';
    const cardClass = isFirst && isActive ? 'tool-card tool-card-featured' : 
                      isActive ? 'tool-card' : 'tool-card tool-card-disabled';
    
    const comingSoonBadge = !isActive ? '<span class="coming-soon-badge">Coming Soon</span>' : '';
    
    const featuresHtml = tool.features.map(f => 
        `<li><span class="feature-check">${checkIcon}</span> ${f}</li>`
    ).join('\n                        ');
    
    const toolUrl = getToolUrl(tool);
    const buttonHtml = isActive 
        ? `<a href="${toolUrl}" class="tool-btn">${tool.ctaText}</a>`
        : '<span class="tool-btn">Coming Soon</span>';
    
    return `
            <!-- Tool ${tool.order}: ${tool.name} -->
            <article class="${cardClass}">
                <div class="tool-card-header">
                    ${comingSoonBadge}
                    <div class="tool-icon">
                        ${icons[tool.icon] || icons.bedroom}
                    </div>
                    <h3>${tool.name}</h3>
                    <p>${tool.description}</p>
                </div>
                <div class="tool-card-body">
                    <ul class="tool-features">
                        ${featuresHtml}
                    </ul>
                    <div class="tool-meta">
                        <span class="tool-time">${clockSmall} ${tool.duration}</span>
                        <span class="tool-price">FREE</span>
                    </div>
                    ${buttonHtml}
                </div>
            </article>`;
}

// Generate footer tool links (without .html)
function generateFooterToolLinks() {
    return activeTools.slice(0, 8).map(tool => {
        const href = getToolUrl(tool);
        return `<a href="${href}">${tool.name}</a>`;
    }).join('\n                    ');
}

console.log('Building Spacire Tools site...');
console.log('Active tools: ' + activeTools.map(t => t.name).join(', '));

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
}

// Generate tool cards
const toolCardsHtml = sortedTools.map((tool, index) => generateToolCard(tool, index === 0)).join('\n');

// Read original template
let html;
if (fs.existsSync('templates/homepage-template.html')) {
    html = fs.readFileSync('templates/homepage-template.html', 'utf8');
    console.log('Using templates/homepage-template.html');
} else {
    console.error('ERROR: templates/homepage-template.html not found!');
    process.exit(1);
}

// 1. Replace tool cards section
html = html.replace(/<!-- TOOLS_START -->[\s\S]*<!-- TOOLS_END -->/m, 
    `<!-- TOOLS_START -->${toolCardsHtml}
            <!-- TOOLS_END -->`);

// 2. Replace footer tool links (without .html)
html = html.replace(/<!-- FOOTER_TOOLS_START -->[\s\S]*<!-- FOOTER_TOOLS_END -->/m,
    `<!-- FOOTER_TOOLS_START -->
                    ${generateFooterToolLinks()}
                    <!-- FOOTER_TOOLS_END -->`);

// 3. Add social media icons after footer-brand description (with nofollow for external links)
// First, remove any existing social-links divs to prevent duplicates
html = html.replace(/<div class="social-links">[\s\S]*?<\/div>\s*(?=<\/div>\s*<div class="footer-section">)/g, '');

const socialLinksHtml = `
                    <div class="social-links">
                        <a href="https://www.facebook.com/spacire" target="_blank" rel="noopener noreferrer nofollow" aria-label="Facebook" class="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a href="https://www.instagram.com/shopspacire/" target="_blank" rel="noopener noreferrer nofollow" aria-label="Instagram" class="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                        <a href="https://www.youtube.com/@spacire" target="_blank" rel="noopener noreferrer nofollow" aria-label="YouTube" class="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </a>
                    </div>`;

html = html.replace(
    /(<div class="footer-brand">[\s\S]*?<p>Spacire is a sleep wellness company dedicated to helping people achieve better rest through natural, science-backed solutions and free tools\.<\/p>)/,
    `$1${socialLinksHtml}`
);

// 4. Add CSS for social links
const socialLinksCss = `
        
        /* Social Links in Footer */
        .social-links {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }
        
        .social-link {
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            transition: var(--transition);
        }
        
        .social-link:hover {
            background: var(--accent);
            color: var(--primary);
        }
        
        @media (max-width: 768px) {
            .social-links {
                justify-content: center;
            }
        }`;

html = html.replace('</style>', socialLinksCss + '\n    </style>');

// 5. Add 2 more "Why Use" cards - insert inside the why-grid, after the last card
const newWhyCards = `
                <div class="why-card">
                    <div class="why-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                            <line x1="12" y1="18" x2="12.01" y2="18"/>
                        </svg>
                    </div>
                    <h3>Works on Any Device</h3>
                    <p>Use on Mac, Windows, iPhone, Android, or any tablet. No app download required - works in your browser.</p>
                </div>
                <div class="why-card">
                    <div class="why-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                    </div>
                    <h3>Instant Results</h3>
                    <p>Get personalized recommendations immediately. No waiting, no appointments - just actionable advice in minutes.</p>
                </div>`;

// Insert the new cards right after the "Private & Secure" card but inside the why-grid
html = html.replace(
    /(<h3>Private & Secure<\/h3>\s*<p>Your data stays in your browser\. We only store information if you opt in for email reports\.<\/p>\s*<\/div>)(\s*<\/div>\s*<\/div>\s*<\/section>)/,
    `$1${newWhyCards}$2`
);

// Write the output
fs.writeFileSync('dist/index.html', html);
console.log('Generated dist/index.html');

// Copy tools to dist
if (fs.existsSync('tools')) {
    const toolFiles = fs.readdirSync('tools');
    toolFiles.forEach(file => {
        fs.copyFileSync(path.join('tools', file), path.join('dist', file));
        console.log('Copied tools/' + file + ' to dist/');
    });
}

// Copy images to dist
if (fs.existsSync('images')) {
    if (!fs.existsSync('dist/images')) {
        fs.mkdirSync('dist/images', { recursive: true });
    }
    const imageFiles = fs.readdirSync('images');
    imageFiles.forEach(file => {
        fs.copyFileSync(path.join('images', file), path.join('dist', 'images', file));
        console.log('Copied images/' + file + ' to dist/images/');
    });
}

console.log('\nBuild complete! Files are in dist/ directory.');
console.log('Total tools: ' + config.tools.length);
console.log('Active tools: ' + activeTools.length);
