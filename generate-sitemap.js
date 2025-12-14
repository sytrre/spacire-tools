#!/usr/bin/env node

/**
 * Spacire Tools Sitemap Generator
 * Automatically generates sitemap.xml from tools-config.json
 * 
 * Usage: node generate-sitemap.js
 * 
 * This script reads the tools configuration and generates a sitemap
 * that includes all active tools. When you add a new tool to
 * tools-config.json, simply run this script again to update the sitemap.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://tools.spacire.com';
const OUTPUT_DIR = 'dist';
const OUTPUT_FILE = 'sitemap.xml';

// Load tools config
let config;
try {
    config = JSON.parse(fs.readFileSync('tools-config.json', 'utf8'));
    console.log('Loaded tools-config.json');
} catch (err) {
    console.error('ERROR: Could not read tools-config.json');
    console.error(err.message);
    process.exit(1);
}

// Get current date in W3C format (YYYY-MM-DD)
const today = new Date().toISOString().split('T')[0];

// Static pages to include in sitemap
const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' }
];

// Filter active tools and sort by order
const activeTools = config.tools
    .filter(tool => tool.status === 'active')
    .sort((a, b) => a.order - b.order);

console.log(`Found ${activeTools.length} active tools`);

// Generate URL entries for tools
const toolUrls = activeTools.map(tool => {
    // Remove .html extension for clean URLs
    const urlPath = tool.file.replace('.html', '');
    return {
        url: `/${urlPath}`,
        priority: '0.8',
        changefreq: 'monthly'
    };
});

// Combine all URLs
const allUrls = [...staticPages, ...toolUrls];

// Generate XML
const xmlUrls = allUrls.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>
`;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Write sitemap
const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);
fs.writeFileSync(outputPath, sitemap);

console.log(`\nGenerated ${outputPath}`);
console.log(`Total URLs: ${allUrls.length}`);
console.log('  - Static pages: ' + staticPages.length);
console.log('  - Tool pages: ' + activeTools.length);
console.log('\nTools included:');
activeTools.forEach((tool, i) => {
    console.log(`  ${i + 1}. ${tool.name}`);
});
