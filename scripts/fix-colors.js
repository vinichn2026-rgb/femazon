const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walkDir(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walkDir(path.join(__dirname, '..', 'src'));

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('#a85b9b')) {
    // text-[#a85b9b] -> text-primary
    // hover:text-[#a85b9b] -> hover:text-primary
    // bg-[#a85b9b] -> bg-primary
    // border-[#a85b9b] -> border-primary
    // To handle everything safely: replace "-[#a85b9b]" with "-primary"
    const updated = content.replace(/-\[#a85b9b\]/g, '-primary');
    fs.writeFileSync(file, updated, 'utf8');
    console.log('Updated:', file);
  }
});
