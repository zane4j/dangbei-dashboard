#!/usr/bin/env node
// Dependency-free structural validator; a workbook reconciliation is still required.
import fs from 'node:fs';
import process from 'node:process';
const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/validate-snapshot.mjs <snapshot.json>'); process.exit(2); }
let data;
try { data = JSON.parse(fs.readFileSync(file,'utf8')); } catch(e) { console.error('Invalid JSON:',e.message); process.exit(2); }
const errors=[], warnings=[];
const needs = ['N3_COUNTRY','N3_SUMMARY','EOL','EOL_COUNTRY','EOL_SUMMARY','meta'];
for(const name of needs) if(data[name]===undefined) errors.push('Missing key: '+name);
for(const name of ['N3_COUNTRY','EOL','EOL_COUNTRY']) if(data[name]!==undefined&&!Array.isArray(data[name])) errors.push(name+' must be an array');
for(const name of ['N3_SUMMARY','EOL_SUMMARY','meta']) if(data[name]!==undefined&&(typeof data[name]!=='object'||data[name]===null||Array.isArray(data[name]))) errors.push(name+' must be an object');
const amounts=['m7','m8','m9','m10','avg710','fcst10','fba','wh','unproduced','dom','transit','total','unsellable','cost','refurb_new','refurb_used','refurb_pending','refurb_cost','total_after'];
const close=(a,b)=>Math.abs(a-b)<=Math.max(.01,Math.abs(b)*1e-7);
for(const group of ['N3_COUNTRY','EOL','EOL_COUNTRY']){
 const rows=Array.isArray(data[group])?data[group]:[];
 const seen=new Set();
 for(const [i,r] of rows.entries()){
   if(!r||typeof r!=='object'){errors.push(group+'['+i+'] invalid row');continue;}
   for(const k of amounts) if(r[k]!==undefined && r[k]!==null && (typeof r[k]!=='number'||!Number.isFinite(r[k])||r[k]<0))
     errors.push(group+'['+i+'].'+k+' should be a nonnegative finite number');
   const ident=[r.major,r.model,r.country].join('|');
   if(group!=='EOL' && seen.has(ident)) warnings.push('Possible duplicate '+group+' '+ident);
   seen.add(ident);
   const fba=r.fba??0,wh=r.wh??0,dom=r.dom??0,unproduced=r.unproduced??0;
   if(r.total!==undefined&&!close(r.total,fba+wh+dom+unproduced))
     errors.push(group+'['+i+']: total does not equal FBA + WH + DOM + unproduced (transit is already included)');
   if(r.total_after!==undefined&&!close(r.total_after,(r.total??0)+(r.refurb_new??0)+(r.refurb_used??0)))
     errors.push(group+'['+i+']: total_after mismatch (exclude refurb_pending)');
 }
}
if(data.meta && typeof data.meta === 'object'){
 for(const k of ['export_date','source_file']) if(!data.meta[k]) warnings.push('Missing meta.'+k);
 if(Array.isArray(data.EOL) && data.meta.eol_major_count!==undefined && data.meta.eol_major_count!==data.EOL.length)
   warnings.push('meta.eol_major_count does not match EOL.length');
}
for(const group of ['N3_COUNTRY','EOL_COUNTRY']){
 const rows=Array.isArray(data[group])?data[group]:[];
 const summary=group==='N3_COUNTRY'?data.N3_SUMMARY:data.EOL_SUMMARY;
 if(!summary||typeof summary!=='object')continue;
 for(const k of ['m10','fcst10','fba','wh','unproduced','dom','total','unsellable','cost']){
   if(summary[k]!==undefined){
     const total=rows.reduce((a,r)=>a+(typeof r?.[k]==='number'?r[k]:0),0);
     if(!close(summary[k],total)) warnings.push(group+' summary '+k+' differs from sum of detail: '+summary[k]+' vs '+total);
   }
 }
}
for(const x of errors) console.error('ERROR',x);
for(const x of warnings) console.warn('WARN',x);
console.log(`Validation finished: ${errors.length} errors; ${warnings.length} warnings.`);
process.exit(errors.length?1:0);
