const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('dark:')) {
        // Remove dark variants
        content = content.replace(/(?:[a-z-]+:)*dark:[^\s"'\`]+/g, '');
        // Clean up multiple spaces that might have been left behind inside class strings
        content = content.replace(/  +/g, ' ');
        fs.writeFileSync(fullPath, content);
        console.log(`Stripped dark classes from ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
