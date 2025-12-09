#!/usr/bin/env node

/**
 * Spacire Tools Build Script
 * Generates index.html from tools-config.json
 * 
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');

// Load config
const config = JSON.parse(fs.readFileSync('tools-config.json', 'utf8'));

// Icon SVGs mapped by name
const icons = {
    bedroom: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
    clock: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>',
    sound: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5"/><path d="M15.54,8.46a5,5,0,0,1,0,7.07"/><path d="M19.07,4.93a10,10,0,0,1,0,14.14"/></svg>',
    moon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    leaf: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>'
};

const checkIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>';
const clockSmall = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>';

// Sort tools by order
const sortedTools = [...config.tools].sort((a, b) => a.order - b.order);
const activeTools = sortedTools.filter(t => t.status === 'active');

// Generate tool card HTML
function generateToolCard(tool, isFirst = false) {
    const isActive = tool.status === 'active';
    const cardClass = isFirst && isActive ? 'tool-card tool-card-featured' : 
                      isActive ? 'tool-card' : 'tool-card tool-card-disabled';
    
    const comingSoonBadge = !isActive ? '<span class="coming-soon-badge">Coming Soon</span>' : '';
    
    const featuresHtml = tool.features.map(f => 
        '<li><span class="feature-check">' + checkIcon + '</span> ' + f + '</li>'
    ).join('\n                        ');
    
    const buttonHtml = isActive 
        ? '<a href="' + tool.file + '" class="tool-btn">' + tool.ctaText + '</a>'
        : '<span class="tool-btn">Coming Soon</span>';
    
    return '\n            <!-- Tool ' + tool.order + ': ' + tool.name + ' -->\n            <article class="' + cardClass + '">\n                <div class="tool-card-header">\n                    ' + comingSoonBadge + '\n                    <div class="tool-icon">\n                        ' + (icons[tool.icon] || icons.bedroom) + '\n                    </div>\n                    <h3>' + tool.name + '</h3>\n                    <p>' + tool.description + '</p>\n                </div>\n                <div class="tool-card-body">\n                    <ul class="tool-features">\n                        ' + featuresHtml + '\n                    </ul>\n                    <div class="tool-meta">\n                        <span class="tool-time">' + clockSmall + ' ' + tool.duration + '</span>\n                        <span class="tool-price">FREE</span>\n                    </div>\n                    ' + buttonHtml + '\n                </div>\n            </article>';
}

// Generate footer tool links
function generateFooterToolLinks() {
    return sortedTools.map(tool => {
        const href = tool.status === 'active' ? tool.file : '#';
        return '<a href="' + href + '">' + tool.name + '</a>';
    }).join('\n                    ');
}

// Generate footer collection links
function generateFooterCollectionLinks() {
    return config.footer.collections.map(col => 
        '<a href="' + col.url + '">' + col.name + '</a>'
    ).join('\n                    ');
}

console.log('Building Spacire Tools site...');
console.log('Active tools: ' + activeTools.map(t => t.name).join(', '));

// Read the template (original index.html saved in templates/)
let templatePath = 'templates/homepage-template.html';
if (!fs.existsSync(templatePath)) {
    console.log('Template not found, using original from spacire-tools backup...');
    // Fallback: we'll generate a minimal page
    templatePath = null;
}

// For now, let's use a direct approach - copy the original and modify tool cards
// This preserves the exact design

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
}

// Generate tool cards
const toolCardsHtml = sortedTools.map((tool, index) => generateToolCard(tool, index === 0)).join('\n');

// Read original template if available
if (fs.existsSync('templates/homepage-template.html')) {
    let html = fs.readFileSync('templates/homepage-template.html', 'utf8');
    
    // Replace tool cards section
    html = html.replace(/<!-- TOOLS_START -->[\s\S]*<!-- TOOLS_END -->/m, 
        '<!-- TOOLS_START -->\n' + toolCardsHtml + '\n            <!-- TOOLS_END -->');
    
    // Replace footer tool links
    html = html.replace(/<!-- FOOTER_TOOLS_START -->[\s\S]*<!-- FOOTER_TOOLS_END -->/m,
        '<!-- FOOTER_TOOLS_START -->\n                    ' + generateFooterToolLinks() + '\n                    <!-- FOOTER_TOOLS_END -->');
    
    fs.writeFileSync('dist/index.html', html);
} else {
    // If no template, just copy index.html if it exists
    console.log('Warning: No template found. Generating basic structure...');
    console.log('Please save the original index.html to templates/homepage-template.html');
    console.log('Add markers: <!-- TOOLS_START --> and <!-- TOOLS_END --> around tool cards');
}

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
