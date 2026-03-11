const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/User/OneDrive/Desktop/social help platform/HTML';
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// This regex matches the entire <script type="module"> block containing onAuthStateChanged
const authScriptPattern = /<script type="module">\s*import\s*\{\s*onAuthStateChanged.*?<\/script>/gs;

// Also look for simpler auth guards that might just redirect
const authGuardPattern = /\/\/ 🔐 Auth Guard.*?(?=<script|<\/script>).*?<\/script>/gs;
// Some pages might have Auth State Listener commented blocks
const authListenerPattern = /\/\/ 🔐 Auth State Listener.*?(?=<script|<\/script>).*?<\/script>/gs;

let updatedCount = 0;

for (const file of htmlFiles) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;

    // We will meticulously replace the auth-bar inner logic in the HTML if the block was removed, 
    // but the simplest approach is to completely strip out the script blocks and restore the static HTML.

    // First, let's restore the top-bar-right #auth-bar to ALWAYS default to "Login / Sign Up" instead of being empty or displaying dynamic profile.
    // However, looking at the code, most pages already have a fallback or we can just replace the whole auth-bar div.

    // Remove the Auth Guard inline script blocks
    content = content.replace(authGuardPattern, '');

    // Remove the Auth State Listener blocks
    content = content.replace(authListenerPattern, '');

    // Some pages might not have the comment, so fallback to regex on onAuthStateChanged
    if (content.includes('onAuthStateChanged')) {
        // Find the module script that has onAuthStateChanged
        const scriptRegex = /<script type="module">[\s\S]*?onAuthStateChanged[\s\S]*?<\/script>/g;
        content = content.replace(scriptRegex, '');
    }

    // Now, restore the static auth-bar for unauthenticated users
    const staticAuthBar = `<div class="top-bar-right" id="auth-bar">
      <a href="login.html" class="top-bar-link">Login</a>
      <a href="register.html" class="top-bar-link top-bar-link--primary">Sign Up</a>
    </div>`;

    const authBarRegex = /<div class="top-bar-right" id="auth-bar">[\s\S]*?<\/div>/;
    content = content.replace(authBarRegex, staticAuthBar);

    // Clean up empty script tags if any got left behind
    content = content.replace(/<script type="module">\s*<\/script>/g, '');

    if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Removed auth logic from ${file}`);
        updatedCount++;
    }
}

console.log(`Total files updated: ${updatedCount}`);
