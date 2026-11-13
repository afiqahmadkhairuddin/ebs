import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import path from 'node:path';
import { groups } from './content.mjs';

const routes = ['/', '/services', ...groups.flatMap(g => ['/services/'+g.slug,...g.services.map(s=>'/services/'+g.slug+'/'+s.slug)]), '/projects', '/about', '/contact'];
const baseline = JSON.parse(await readFile('docs/tracking-baseline.json','utf8'));
const titles = new Set();
const descriptions = new Set();
let localLinks = 0;
for (const route of routes) {
  const filename = route==='/'?'index.html':route.slice(1)+'/index.html';
  const html = await readFile(filename,'utf8');
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,filename+' must have one H1');
  let lastHeading=0;
  for(const [,level] of html.matchAll(/<h([1-6])\b/g)) {
    assert.ok(Number(level)<=lastHeading+1,'Heading order: '+filename);
    lastHeading=Number(level);
  }
  const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(title&&!titles.has(title),'Unique title: '+filename); titles.add(title);
  assert.ok(description&&!descriptions.has(description),'Unique description: '+filename); descriptions.add(description);
  assert.ok(html.includes(`rel="canonical" href="https://ebsresources.my${route==='/'?'/':route+'/'}"`),'Canonical: '+filename);
  assert.equal((html.match(/src="https:\/\/www.googletagmanager.com\/gtag\/js\?id=AW-10852613132"/g)||[]).length,1,'One tag loader');
  assert.equal((html.match(/src="\/assets\/js\/tracking.js"/g)||[]).length,1,'One tracking initializer');
  assert.ok(!/onclick=|GTM-[A-Z0-9]+|G-[A-Z0-9]{5,}|fbq\(|ttq\(|lorem ipsum|Robert Downturn/i.test(html),'No duplicate handlers, new tags or dummy content');
  const schemas=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(schemas[0]['@type'],'Organization');
  if(route.startsWith('/services/')) assert.ok(schemas.some(s=>s['@type']==='Service'),'Service schema');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,'No duplicate IDs: '+filename);
  for(const [,attribute,value] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    if(value.startsWith('https://wa.me/')) {
      const url=new URL(value.replaceAll('&amp;','&'));
      assert.equal(url.pathname,'/'+baseline.phone); assert.ok(url.searchParams.get('text'),'Specific WhatsApp message');
    }
    if(!value.startsWith('/')&&!value.startsWith('#'))continue;
    const url=new URL(value,'https://ebsresources.my'+route);
    if(attribute==='href'&&url.hash&&url.pathname===route)assert.ok(ids.includes(url.hash.slice(1)),'Fragment exists: '+value);
    if(value.startsWith('#'))continue;
    const local=decodeURIComponent(url.pathname).replace(/\/$/,'')||'/';
    const file=routes.includes(local)?(local==='/'?'index.html':local.slice(1)+'/index.html'):local.slice(1);
    await access(path.resolve(file)); localLinks++;
  }
}
for(const script of ['assets/js/tracking.js','assets/js/site.js','scripts/build.mjs','scripts/content.mjs','scripts/serve.mjs','scripts/check.mjs']) execFileSync(process.execPath,['--check',script],{stdio:'pipe'});
const calls=[];
const context={ window:{ dataLayer:[], location:{},setTimeout:()=>{} },document:{addEventListener:()=>{}},Date,console };
vm.createContext(context);
vm.runInContext(await readFile('assets/js/tracking.js','utf8'),context);
context.window.gtag=(...args)=>calls.push(args);
context.window.gtag_report_conversion();
context.window.gtag_report_conversion_ws();
assert.equal(calls.length,2);
for(const [i,key] of ['email','whatsapp'].entries()) {
  assert.equal(calls[i][0],'event'); assert.equal(calls[i][1],'conversion');
  for(const prop of ['send_to','value','currency'])assert.equal(calls[i][2][prop],baseline[key][prop],key+' preserves '+prop);
}
assert.equal(calls[1][2].event_timeout,2000);
assert.equal(context.window.dataLayer.filter(item=>item[0]==='config').length,1);
// Execute the actual original snippets and compare the emitted conversions.
const original = execFileSync('git',['-c','safe.directory='+process.cwd().replaceAll('\\','/'),'show','91fe243:index.html'],{encoding:'utf8'});
const originalCalls=[];
const originalContext={dataLayer:[],console:{log(){},error(){}},Date};
originalContext.window=originalContext;
vm.createContext(originalContext);
for(const [,script] of original.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(script,originalContext);
originalContext.gtag=(...args)=>originalCalls.push(args);
originalContext.gtag_report_conversion();originalContext.gtag_report_conversion_ws();
for(let i=0;i<2;i++)for(const prop of ['send_to','value','currency'])assert.equal(calls[i][2][prop],originalCalls[i][2][prop],'Matches original runtime '+prop);
// When the Google callback never arrives, the timer still navigates once.
let scheduled, navigationCount=0;
context.window.setTimeout=callback=>{scheduled=callback;};
context.window.location={set href(url){assert.equal(url,'mailto:'+baseline.emailAddress);navigationCount++;}};
context.window.gtag_report_conversion('mailto:'+baseline.emailAddress);
scheduled();calls.at(-1)[2].event_callback();
assert.equal(navigationCount,1,'Fallback and callback do not navigate twice');
const sitemap=await readFile('sitemap.xml','utf8');
assert.equal((sitemap.match(/<loc>/g)||[]).length,17);
for(const route of routes)assert.ok(sitemap.includes('<loc>https://ebsresources.my'+(route==='/'?'/':route+'/')+'</loc>'));
assert.equal((await readFile('CNAME','utf8')).trim(),'ebsresources.my');
await access('.nojekyll');
assert.ok((await readFile('robots.txt','utf8')).includes('Sitemap: https://ebsresources.my/sitemap.xml'));
console.log(`PASS: ${routes.length} pages, ${localLinks} local references, unique metadata, structured data, JS syntax, sitemap and original conversion destinations/parameters.`);
