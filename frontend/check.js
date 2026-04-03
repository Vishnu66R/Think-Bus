const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/pages');
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Match all components like <MapPin>
  const tags = [...content.matchAll(/<([A-Z][a-zA-Z0-9]*)/g)].map(m => m[1]);
  const uniqueTags = [...new Set(tags)];
  
  uniqueTags.forEach(tag => {
    // Check if the tag is imported or declared
    // A simple heuristic: check if `tag` exists in the file outside of a JSX block
    // Or just count occurrences. If it's only found after `<` or `</`, it's not imported.
    const regex = new RegExp(`\\b${tag}\\b`, 'g');
    const matches = [...content.matchAll(regex)];
    let importedOrDeclared = false;
    for (const match of matches) {
      const precedingStr = content.substring(Math.max(0, match.index - 20), match.index);
      if (precedingStr.includes('import ') || precedingStr.includes('function ') || precedingStr.includes('const ') || precedingStr.includes('class ') || precedingStr.includes('{') || precedingStr.includes(',')) {
        // Just checking if it appears in the import block
        const importBlockMatch = content.substring(0, content.indexOf('function')).match(new RegExp(`\\b${tag}\\b`));
        if (importBlockMatch) {
            importedOrDeclared = true;
            break;
        }
      }
    }
    
    // Additional simple check for import block
    const importArea = content.slice(0, content.indexOf('function '));
    if (!importArea.includes(tag) && !content.includes(`function ${tag}`)) {
        console.log(`${file}: Missing ${tag}`);
    }
  });
});
