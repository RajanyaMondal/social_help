const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/User/OneDrive/Desktop/social help platform/HTML';

const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const targetPattern = /authBar\.innerHTML\s*=\s*`\s*<span style="font-size:13px; color:#fff; font-weight:600; opacity:0\.85;">👤 \$\{user\.displayName \|\| user\.email\}<\/span>\s*<button onclick="window\.doLogout\(\)" class="top-bar-link" style="background:none; border:none; cursor:pointer; color:#fff; font-size:13px;">Logout<\/button>\s*`;/g;

const replacement = `authBar.innerHTML = '<span style="font-size:13px; color:#fff; font-weight:600; opacity:0.85;">🔄 Loading profile...</span>';
        let photoHtml = '👤 ';
        try {
           const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
           const userDoc = await getDoc(doc(db, "users", user.uid));
           if (userDoc.exists() && userDoc.data().profilePicture) {
             photoHtml = '<img src="' + userDoc.data().profilePicture + '" style="width:28px; height:28px; border-radius:50%; object-fit:cover; margin-right:8px; border: 1px solid rgba(255,255,255,0.4);" alt="Profile">';
           }
        } catch(e) { console.error(e); }
        
        authBar.innerHTML = \`
          <div style="display:flex; align-items:center;">
            \${photoHtml}
            <span style="font-size:13px; color:#fff; font-weight:600; opacity:0.85;">\${user.displayName || user.email}</span>
            <button onclick="window.doLogout()" class="top-bar-link" style="background:none; border:none; cursor:pointer; color:#fff; font-size:13px; margin-left:10px;">Logout</button>
          </div>
        \`;`;

let updatedCount = 0;

for (const file of htmlFiles) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Make sure the callback is async, replace `onAuthStateChanged(auth, (user) => {` with `onAuthStateChanged(auth, async (user) => {`
    if (content.includes('onAuthStateChanged(auth, (user) => {')) {
        content = content.replace('onAuthStateChanged(auth, (user) => {', 'onAuthStateChanged(auth, async (user) => {');
    }

    if (targetPattern.test(content)) {
        content = content.replace(targetPattern, replacement);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${file}`);
        updatedCount++;
    }
}

console.log(`Total files updated: ${updatedCount}`);
