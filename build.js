#!/usr/bin/env node

/**
 * Spacire Tools Build Script
 * Generates index.html from tools-config.json
 * 
 * Version: 2.0.0
 * Updates:
 * - Added social media icons in footer
 * - Removed .html from all tool links
 * - Added additional "Why Use" reasons
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
    shift: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/><path d="M12 2v2"/><path d="M12 20v2"/></svg>',
    calculator: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/><line x1="14" y1="18" x2="16" y2="18"/></svg>',
    routine: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><path d="M15 9l-6 6"/><path d="M9 9h6v6"/></svg>',
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

// Social media SVG icons
const socialIcons = {
    facebook: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    instagram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    youtube: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
};

const checkIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>';
const clockSmall = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>';

// "Why Use" benefit icons
const benefitIcons = {
    science: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6v2H9zM12 5v3M6 8h12v2a8 8 0 1 1-12 0V8z"/></svg>',
    free: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    privacy: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    instant: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    devices: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    personalized: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
};

// Sort tools by order
const sortedTools = [...config.tools].sort((a, b) => a.order - b.order);
const activeTools = sortedTools.filter(t => t.status === 'active');

// Helper function to get tool URL without .html
function getToolUrl(tool) {
    if (tool.status !== 'active') return '#';
    // Remove .html extension from file name
    const urlPath = tool.file.replace('.html', '');
    return urlPath;
}

// Generate tool card HTML
function generateToolCard(tool, isFirst = false) {
    const isActive = tool.status === 'active';
    const cardClass = isFirst && isActive ? 'tool-card tool-card-featured' : 
                      isActive ? 'tool-card' : 'tool-card tool-card-disabled';
    
    const comingSoonBadge = !isActive ? '<span class="coming-soon-badge">Coming Soon</span>' : '';
    
    const featuresHtml = tool.features.map(f => 
        '<li><span class="feature-check">' + checkIcon + '</span> ' + f + '</li>'
    ).join('\n                        ');
    
    const toolUrl = getToolUrl(tool);
    const buttonHtml = isActive 
        ? '<a href="' + toolUrl + '" class="tool-btn">' + tool.ctaText + '</a>'
        : '<span class="tool-btn">Coming Soon</span>';
    
    return '\n            <!-- Tool ' + tool.order + ': ' + tool.name + ' -->\n            <article class="' + cardClass + '">\n                <div class="tool-card-header">\n                    ' + comingSoonBadge + '\n                    <div class="tool-icon">\n                        ' + (icons[tool.icon] || icons.bedroom) + '\n                    </div>\n                    <h3>' + tool.name + '</h3>\n                    <p>' + tool.description + '</p>\n                </div>\n                <div class="tool-card-body">\n                    <ul class="tool-features">\n                        ' + featuresHtml + '\n                    </ul>\n                    <div class="tool-meta">\n                        <span class="tool-time">' + clockSmall + ' ' + tool.duration + '</span>\n                        <span class="tool-price">FREE</span>\n                    </div>\n                    ' + buttonHtml + '\n                </div>\n            </article>';
}

// Generate footer tool links (without .html)
function generateFooterToolLinks() {
    return activeTools.slice(0, 8).map(tool => {
        const href = getToolUrl(tool);
        return '<a href="' + href + '">' + tool.name + '</a>';
    }).join('\n                    ');
}

// Generate "Why Use Spacire Sleep Tools?" section
function generateWhyUseSection() {
    const benefits = [
        {
            icon: benefitIcons.science,
            title: 'Science-Backed',
            description: 'Every tool uses clinically validated assessments and evidence-based sleep science.'
        },
        {
            icon: benefitIcons.free,
            title: '100% Free',
            description: 'No subscriptions, no hidden costs. All tools are completely free to use.'
        },
        {
            icon: benefitIcons.privacy,
            title: 'Privacy First',
            description: 'Your data stays on your device. We never sell or share your personal information.'
        },
        {
            icon: benefitIcons.instant,
            title: 'Instant Results',
            description: 'Get personalized recommendations in minutes, not days.'
        },
        {
            icon: benefitIcons.devices,
            title: 'Works on Any Device',
            description: 'Use on Mac, Windows, iPhone, Android, or any tablet. No app download needed.'
        },
        {
            icon: benefitIcons.personalized,
            title: 'Personalized for You',
            description: 'Every recommendation is tailored to your unique sleep patterns and challenges.'
        }
    ];

    return benefits.map(b => `
                <div class="benefit-card">
                    <div class="benefit-icon">${b.icon}</div>
                    <h4>${b.title}</h4>
                    <p>${b.description}</p>
                </div>`).join('\n');
}

// Generate social media links for footer
function generateSocialLinks() {
    return `
                    <div class="social-links">
                        <a href="https://www.facebook.com/spacire" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="social-link">
                            ${socialIcons.facebook}
                        </a>
                        <a href="https://www.instagram.com/shopspacire/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-link">
                            ${socialIcons.instagram}
                        </a>
                        <a href="https://www.youtube.com/@spacire" target="_blank" rel="noopener noreferrer" aria-label="YouTube" class="social-link">
                            ${socialIcons.youtube}
                        </a>
                    </div>`;
}

console.log('Building Spacire Tools site...');
console.log('Active tools: ' + activeTools.map(t => t.name).join(', '));

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
    
    // Replace "Why Use" benefits section
    html = html.replace(/<!-- BENEFITS_START -->[\s\S]*<!-- BENEFITS_END -->/m,
        '<!-- BENEFITS_START -->\n' + generateWhyUseSection() + '\n            <!-- BENEFITS_END -->');
    
    // Replace/Add social media links in footer
    html = html.replace(/<!-- SOCIAL_START -->[\s\S]*<!-- SOCIAL_END -->/m,
        '<!-- SOCIAL_START -->\n' + generateSocialLinks() + '\n                    <!-- SOCIAL_END -->');
    
    fs.writeFileSync('dist/index.html', html);
    console.log('Generated dist/index.html');
} else {
    console.log('Warning: No template found at templates/homepage-template.html');
    console.log('Generating standalone homepage...');
    
    // Generate complete standalone homepage
    const standaloneHtml = generateStandaloneHomepage();
    fs.writeFileSync('dist/index.html', standaloneHtml);
    console.log('Generated standalone dist/index.html');
}

// Copy tools to dist (without .html extension handling - server should handle this)
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

// Generate standalone homepage (when no template exists)
function generateStandaloneHomepage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Free sleep tools to help you sleep better. Science-backed calculators, quizzes, and planners for better rest.">
    <title>Spacire Sleep Tools - Free Science-Backed Sleep Resources</title>
    <link rel="canonical" href="https://tools.spacire.com">
    <link rel="icon" type="image/png" href="images/favicon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Domine:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #042548;
            --primary-light: #0a3a6b;
            --accent: #E0B252;
            --accent-light: #f5e6c4;
            --text-primary: #1a1a1a;
            --text-secondary: #555;
            --text-muted: #888;
            --bg: #ffffff;
            --bg-light: #f8f9fa;
            --border: #e0e0e0;
            --success: #28a745;
            --radius: 12px;
            --shadow: 0 4px 20px rgba(0,0,0,0.08);
            --shadow-lg: 0 8px 30px rgba(0,0,0,0.12);
            --font-primary: 'Domine', Georgia, serif;
        }
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; padding: 0; font-family: var(--font-primary); background: var(--bg-light); color: var(--text-primary); line-height: 1.6; }
        
        /* Header */
        .site-header { background: var(--primary); padding: 16px 0; position: sticky; top: 0; z-index: 100; }
        .header-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
        .logo-link { text-decoration: none; }
        .logo-text { font-size: 24px; font-weight: 700; color: #fff; letter-spacing: 0.02em; }
        .header-nav { display: flex; gap: 32px; }
        .header-nav a { color: rgba(255,255,255,0.85); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .header-nav a:hover { color: var(--accent); }
        @media (max-width: 768px) { .header-nav { display: none; } }
        
        /* Hero */
        .hero { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%); color: #fff; padding: 80px 20px; text-align: center; }
        .hero h1 { font-size: 42px; font-weight: 700; margin: 0 0 16px; }
        .hero p { font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto; }
        @media (max-width: 768px) { .hero h1 { font-size: 28px; } .hero p { font-size: 16px; } }
        
        /* Tool Grid */
        .tools-section { max-width: 1200px; margin: -40px auto 60px; padding: 0 20px; }
        .tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        
        /* Tool Card */
        .tool-card { background: #fff; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; }
        .tool-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .tool-card-featured { border: 2px solid var(--accent); }
        .tool-card-disabled { opacity: 0.7; }
        .tool-card-header { padding: 24px 24px 16px; text-align: center; position: relative; }
        .coming-soon-badge { position: absolute; top: 12px; right: 12px; background: var(--accent); color: var(--primary); font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 12px; }
        .tool-icon { width: 56px; height: 56px; background: var(--bg-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--primary); }
        .tool-card-header h3 { font-size: 18px; font-weight: 600; margin: 0 0 8px; color: var(--primary); }
        .tool-card-header p { font-size: 14px; color: var(--text-secondary); margin: 0; }
        .tool-card-body { padding: 0 24px 24px; flex: 1; display: flex; flex-direction: column; }
        .tool-features { list-style: none; margin: 0 0 16px; padding: 0; flex: 1; }
        .tool-features li { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; }
        .feature-check { color: var(--success); flex-shrink: 0; }
        .tool-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-muted); margin-bottom: 16px; }
        .tool-time { display: flex; align-items: center; gap: 4px; }
        .tool-price { font-weight: 600; color: var(--success); }
        .tool-btn { display: block; width: 100%; padding: 12px; background: var(--accent); color: var(--primary); text-align: center; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 8px; transition: background 0.2s; }
        .tool-btn:hover { background: #c9a047; }
        .tool-card-disabled .tool-btn { background: var(--border); cursor: not-allowed; }
        
        /* Benefits Section */
        .benefits-section { background: #fff; padding: 80px 20px; }
        .benefits-section h2 { text-align: center; font-size: 28px; color: var(--primary); margin: 0 0 48px; }
        .benefits-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; }
        .benefit-card { text-align: center; padding: 24px; }
        .benefit-icon { width: 64px; height: 64px; background: var(--bg-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--primary); }
        .benefit-card h4 { font-size: 16px; font-weight: 600; color: var(--primary); margin: 0 0 8px; }
        .benefit-card p { font-size: 14px; color: var(--text-secondary); margin: 0; }
        
        /* Footer */
        .site-footer { background: var(--primary); color: #fff; padding: 60px 20px 24px; }
        .footer-content { max-width: 1200px; margin: 0 auto; }
        .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; margin-bottom: 40px; }
        .footer-section h4 { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 20px; color: var(--accent); }
        .footer-section a { display: block; color: rgba(255,255,255,0.8); text-decoration: none; font-size: 14px; margin-bottom: 12px; transition: color 0.2s; }
        .footer-section a:hover { color: var(--accent); }
        .social-links { display: flex; gap: 16px; margin-top: 16px; }
        .social-link { width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; transition: background 0.2s; }
        .social-link:hover { background: var(--accent); color: var(--primary); }
        .footer-bottom { padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; font-size: 12px; color: rgba(255,255,255,0.6); }
        .footer-legal { margin-top: 12px; display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; }
        .footer-legal a { color: rgba(255,255,255,0.6); text-decoration: none; }
        .footer-legal a:hover { color: var(--accent); }
    </style>
</head>
<body>
    <header class="site-header">
        <div class="header-content">
            <a href="https://tools.spacire.com" class="logo-link">
                <span class="logo-text">Spacire</span>
            </a>
            <nav class="header-nav">
                <a href="https://tools.spacire.com">Sleep Tools</a>
                <a href="https://spacire.com/collections/sleep-aids-for-better-rest">Sleep Products</a>
                <a href="https://spacire.com/blogs/journal">Sleep Journal</a>
                <a href="https://spacire.com">Shop</a>
            </nav>
        </div>
    </header>
    
    <section class="hero">
        <h1>Free Sleep Tools</h1>
        <p>Science-backed calculators, quizzes, and planners to help you sleep better, naturally.</p>
    </section>
    
    <main class="tools-section">
        <div class="tools-grid">
            <!-- TOOLS_START -->
${toolCardsHtml}
            <!-- TOOLS_END -->
        </div>
    </main>
    
    <section class="benefits-section">
        <h2>Why Use Spacire Sleep Tools?</h2>
        <div class="benefits-grid">
            <!-- BENEFITS_START -->
${generateWhyUseSection()}
            <!-- BENEFITS_END -->
        </div>
    </section>
    
    <footer class="site-footer">
        <div class="footer-content">
            <div class="footer-grid">
                <div class="footer-section">
                    <h4>Sleep Tools</h4>
                    <!-- FOOTER_TOOLS_START -->
                    ${generateFooterToolLinks()}
                    <!-- FOOTER_TOOLS_END -->
                </div>
                <div class="footer-section">
                    <h4>Shop</h4>
                    <a href="https://spacire.com/collections/sleep-masks">Sleep Masks</a>
                    <a href="https://spacire.com/collections/white-noise-machines">White Noise Machines</a>
                    <a href="https://spacire.com/collections/blackout-curtains">Blackout Curtains</a>
                    <a href="https://spacire.com/collections/pillow-sleep-sprays">Sleep Sprays</a>
                </div>
                <div class="footer-section">
                    <h4>Company</h4>
                    <a href="https://spacire.com/pages/about-us">About Us</a>
                    <a href="https://spacire.com/pages/contact">Contact</a>
                    <a href="https://spacire.com/pages/faqs">FAQs</a>
                    <a href="https://spacire.com/blogs/journal">Sleep Journal</a>
                    <!-- SOCIAL_START -->
${generateSocialLinks()}
                    <!-- SOCIAL_END -->
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Spacire (The Valen Collective LTD). Company Registered in England & Wales. Reg: 16695657.</p>
                <div class="footer-legal">
                    <a href="https://spacire.com/policies/privacy-policy">Privacy Policy</a>
                    <a href="https://spacire.com/policies/terms-of-service">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>`;
}

console.log('\nBuild complete! Files are in dist/ directory.');
console.log('Total tools: ' + config.tools.length);
console.log('Active tools: ' + activeTools.length);
