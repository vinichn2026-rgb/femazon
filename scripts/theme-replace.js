const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '..', 'src');

const replacements = [
  { regex: /bg-zinc-900/g, replacement: 'bg-primary' },
  { regex: /text-zinc-900/g, replacement: 'text-primary' },
  { regex: /border-zinc-900/g, replacement: 'border-primary' },
  { regex: /bg-zinc-800/g, replacement: 'bg-primary' },
  { regex: /text-zinc-800/g, replacement: 'text-primary' },
  { regex: /border-zinc-800/g, replacement: 'border-primary' },
  { regex: /bg-black/g, replacement: 'bg-primary' },
  { regex: /text-black/g, replacement: 'text-primary' },
  { regex: /border-black/g, replacement: 'border-primary' },
  { regex: /#000000/g, replacement: '#4A1513' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      for (const rule of replacements) {
        if (rule.regex.test(content)) {
          content = content.replace(rule.regex, rule.replacement);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

console.log('Starting theme replacement...');
processDirectory(directoryPath);
console.log('Theme replacement complete.');
