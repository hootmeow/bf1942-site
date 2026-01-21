const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper: Manual .env parser
function loadEnv(filename) {
    const filePath = path.join(__dirname, '..', filename);
    if (fs.existsSync(filePath)) {
        console.log(`Loading env from ${filename}`);
        const content = fs.readFileSync(filePath, 'utf8');
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                if (!process.env[key]) process.env[key] = value;
            }
        });
    }
}

// 1. Load Environment Variables (Priority: Process -> .env.local -> .env)
loadEnv('.env.local');
loadEnv('.env');

const webhookUrl = process.env.DISCORD_DEPLOY_WEBHOOK_URL;

if (!webhookUrl) {
    console.log('⚠️  No DISCORD_DEPLOY_WEBHOOK_URL found. Skipping deployment notification.');
    process.exit(0);
}

// 2. Gather Git Info
let commitHash = 'Unknown';
let commitMsg = 'Unknown';
let author = 'Unknown';
let branch = 'Unknown';

try {
    commitHash = execSync('git rev-parse --short HEAD').toString().trim() || 'Unknown';
    // Get subject line only to avoid overly long messages or formatting issues
    commitMsg = execSync('git log -1 --pretty=%s').toString().trim() || 'No commit message';
    author = execSync('git log -1 --pretty=%an').toString().trim() || 'Unknown';
    branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim() || 'Unknown';
} catch (e) {
    console.error('Failed to get git info:', e.message);
}

// Validation: Discord fields cannot be empty strings
if (commitMsg.length > 1000) commitMsg = commitMsg.substring(0, 997) + "...";

// 3. Construct Payload
const payload = JSON.stringify({
    username: "Deployment Bot",
    avatar_url: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    embeds: [
        {
            title: "🚀 Site Deployment Successful",
            description: "A new version of the **BF1942 Command Center** has been built and is ready.",
            color: 5763719, // Green
            fields: [
                { name: "Commit", value: `\`${commitHash}\``, inline: true },
                { name: "Branch", value: `\`${branch}\``, inline: true },
                { name: "Author", value: author, inline: true },
                { name: "Message", value: commitMsg }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "System Update",
            }
        }
    ]
});

// 4. Send Request (Native Node HTTPS)
const url = new URL(webhookUrl);
const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload) // handle multi-byte chars correctly
    }
};

const req = https.request(options, (res) => {
    console.log(`Notification sent. Status: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error('Notification failed:', error);
});

req.write(payload);
req.end();
