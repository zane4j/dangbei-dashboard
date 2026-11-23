#!/usr/bin/env node
// Replace only the DATA object. Source must be a compatible historical dashboard HTML.
import fs from 'node:fs';
import process from 'node:process';
const [source, jsonPath, output] = process.argv.slice(2);
if(!source||!jsonPath||!output) {
  console.error('Usage: node scripts/update-dashboard.mjs <previous.html> <snapshot.json> <output.html>');
  process.exit(2);
}
if(source===output) { console.error('Do not overwrite source HTML. Choose a new dated filename.');process.exit(2); }
const html=fs.readFileSync(source,'utf8');
const data=JSON.parse(fs.readFileSync(jsonPath,'utf8'));
for(const key of ['N3_COUNTRY','N3_SUMMARY','EOL','EOL_COUNTRY','EOL_SUMMARY','meta']) {
  if(data[key]===undefined) throw new Error('Snapshot missing '+key);
}
const marker=/const DATA\s*=\s*\{[\s\S]*?\};(?=\s*const N3\s*=\s*DATA\.N3_COUNTRY)/m;
if(!marker.test(html)) throw new Error('Expected embedded DATA section not found; source HTML layout may differ');
const safe=JSON.stringify(data,null,2).replaceAll('<','\\u003c');
const updated=html.replace(marker,'const DATA = '+safe+';');
if(updated===html) throw new Error('No replacement performed');
fs.writeFileSync(output,updated,'utf8');
console.log('Dashboard generated:',output);
console.warn('Review hard-coded header/footer/source/date descriptions and test the browser before use.');
