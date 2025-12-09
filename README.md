# Spacire Sleep Tools

Free, science-backed tools to help people sleep better. Hosted at [tools.spacire.com](https://tools.spacire.com).


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
