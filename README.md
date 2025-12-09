# Spacire Sleep Tools

Free, science-backed tools to help people sleep better. Hosted at [tools.spacire.com](https://tools.spacire.com).

## What's Working (DO NOT BREAK)
- **Sleep Environment Optimizer** - Fully functional with email reports
- **Appwrite database** - Collecting tool submissions
- **Appwrite function** - Sending emails via Mailgun

## Project Structure

```
spacire-tools/
├── tools-config.json      # Central control - add/activate tools here
├── build.js               # Generates homepage from config
├── package.json
├── templates/
│   └── homepage-template.html  # Original design with markers
├── tools/                 # Individual tool HTML files
│   ├── sleep-environment-optimizer.html
│   └── shift-worker-sleep-planner.html
├── functions/             # Appwrite functions
│   └── send_sleep_report/
└── images/
```

## Deployment

**Appwrite Sites handles deployment automatically via Git integration.**

When you push to `main`:
1. Appwrite detects the push
2. Runs `node build.js`
3. Deploys contents of `dist/`

### Appwrite Build Settings
- **Build command:** `node build.js`
- **Output directory:** `dist`

## Adding a New Tool

1. **Create the tool HTML file** in `tools/new-tool.html`
2. **Add to `tools-config.json`:**
   ```json
   {
     "id": "new-tool",
     "name": "New Tool Name",
     "description": "Tool description",
     "status": "active",
     "file": "new-tool.html",
     "icon": "moon",
     "duration": "3-4 minutes",
     "features": ["Feature 1", "Feature 2"],
     "ctaText": "Start Now",
     "order": 6
   }
   ```
3. **If tool needs email**, update `functions/send_sleep_report/src/main.js`
4. **Push to main** - auto-deploys

## Activating a "Coming Soon" Tool

Change `"status": "coming-soon"` to `"status": "active"` in `tools-config.json`, then push.

## Local Development

```bash
node build.js
# Output is in dist/
```

## Rollback

If something breaks:
```bash
git revert HEAD
git push
```

## File Ownership

| File | Purpose | Safe to Edit? |
|------|---------|---------------|
| `tools-config.json` | Control which tools are active | YES |
| `tools/*.html` | Individual tool files | YES (new tools) |
| `build.js` | Generates homepage | RARELY |
| `templates/homepage-template.html` | Original design | NO (unless fixing bugs) |
| `functions/` | Email/data backend | When adding new tools |

## Appwrite Resources

- **Site ID:** 6937398d00002827ae17
- **Project ID:** 6839f9c60026aborfc7a
- **Database ID:** 6839fbb20004c220250a
- **Collection ID:** 683a003c0025bf169ceb
- **Function ID:** 683a0144003b3bfc5ee0
