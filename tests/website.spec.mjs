import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { groups } from '../scripts/content.mjs';
const routes = ['/', '/services', ...groups.flatMap(g => ['/services/'+g.slug,...g.services.map(s=>'/services/'+g.slug+'/'+s.slug)]), '/projects', '/about', '/contact'];

test.beforeEach(async ({context})=>{
  // No requests or conversions reach advertising systems during QA.
  await context.route(/https:\/\/(www\.)?(googletagmanager|googleadservices|google-analytics|doubleclick)\./,route=>route.fulfill({status:200,body:'',contentType:'text/javascript'}));
});

for(const width of [1440,768,390]) {
  test(`${width}px: every route, overflow, accessibility and screenshots`,async({page},testInfo)=>{
    await page.setViewportSize({width,height:1000});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const badResponses=[];
    page.on('response',response=>{if(response.url().includes('127.0.0.1')&&response.status()>=400)badResponses.push(response.url());});
    for(const route of routes) {
      const response=await page.goto(route);
      expect(response.status(),route).toBe(200);
      await page.evaluate(()=>document.fonts.ready);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' has no horizontal overflow').toBe(true);
      const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      expect(results.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),route+' accessibility').toEqual([]);
      const counts=await page.evaluate(()=>({config:window.dataLayer.filter(x=>x[0]==='config').length,conversion:window.dataLayer.filter(x=>x[1]==='conversion').length}));
      expect(counts).toEqual({config:1,conversion:0});
      if(['/', '/services','/services/industrial-systems/imcs-enmcs','/projects','/about','/contact'].includes(route))await page.screenshot({path:testInfo.outputPath(`${route==='/'?'home':route.slice(1).replaceAll('/','-')}-${width}.png`),fullPage:true});
    }
    expect(errors).toEqual([]); expect(badResponses).toEqual([]);
  });
  test(`${width}px: navigation, mega-menu, Escape and quotation context`,async({page})=>{
    await page.setViewportSize({width,height:1000});
    await page.goto('/');
    if(width<1000) {
      await page.getByRole('button',{name:'Menu'}).click();
      await expect(page.getByRole('button',{name:'Menu'})).toHaveAttribute('aria-expanded','true');
    }
    await page.locator('#services-menu summary').click();
    await expect(page.locator('.mega-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.mega-menu')).not.toBeVisible();
    await page.locator('#services-menu summary').click();
    await page.locator('.mega-menu').getByRole('link',{name:'IMCS & ENMCS integration',exact:true}).click();
    await expect(page).toHaveURL(/\/services\/industrial-systems\/imcs-enmcs/);
    await page.locator('.service-hero').getByRole('link',{name:'Request a quotation'}).click();
    await expect(page.locator('#service')).toHaveValue('IMCS & ENMCS integration');
    expect(await page.evaluate(()=>window.dataLayer.filter(x=>x[1]==='conversion').length)).toBe(0);
  });
}

test('WhatsApp links retain the phone, contextual message and exactly one original conversion',async({page,context})=>{
  await context.route('https://wa.me/**',route=>route.fulfill({body:'WhatsApp handoff intercepted for QA'}));
  await page.goto('/services/it-hardware/computer-laptop-repair');
  const link=page.locator('.service-hero a[data-conversion="whatsapp"]');
  const destination=new URL(await link.getAttribute('href'));
  expect(destination.pathname).toBe('/60109216457');
  expect(destination.searchParams.get('text')).toContain('Computer & laptop repair');
  const popupPromise=context.waitForEvent('page');
  await link.click(); const popup=await popupPromise; await popup.close();
  const events=await page.evaluate(()=>window.dataLayer.filter(x=>x[1]==='conversion').map(x=>x[2]));
  expect(events).toHaveLength(1);
  expect(events[0]).toMatchObject({send_to:'AW-10852613132/Z6GjCJXF5dQcEIz49rYo',value:1,currency:'MYR',event_timeout:2000});
});

test('invalid enquiry is blocked; preparation is honest and sending tracks only the chosen channel',async({page,context},testInfo)=>{
  await page.setViewportSize({width:390,height:1000});
  await page.goto('/contact?service=Business%20systems%20%26%20dashboards');
  await page.getByRole('button',{name:'Prepare my enquiry'}).click();
  await expect(page.locator('#enquiry-ready')).not.toBeVisible();
  expect(await page.locator('#name').evaluate(e=>e.validity.valueMissing)).toBe(true);
  await page.locator('#name').fill('Test Enquirer');
  await page.locator('#company').fill('QA Example');
  await page.locator('#email').fill('qa@example.com');
  await page.locator('#message').fill('We need monthly reporting & database integration.');
  await page.getByRole('button',{name:'Prepare my enquiry'}).click();
  await expect(page.locator('#enquiry-ready')).toBeVisible();
  await expect(page.locator('#enquiry-ready')).toContainText('not been sent yet');
  const accessibility=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(accessibility.violations).toEqual([]);
  await expect(page.locator('.whatsapp-float')).toHaveCount(0);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:testInfo.outputPath('enquiry-ready-390.png'),fullPage:true});
  expect(await page.evaluate(()=>window.dataLayer.filter(x=>x[1]==='conversion').length)).toBe(0);
  const wa=new URL(await page.locator('[data-send-whatsapp]').getAttribute('href'));
  expect(wa.searchParams.get('text')).toContain('Business systems & dashboards');
  expect(wa.searchParams.get('text')).toContain('We need monthly reporting & database integration.');
  await context.route('https://wa.me/**',route=>route.fulfill({body:'QA'}));
  const popupPromise=context.waitForEvent('page'); await page.locator('[data-send-whatsapp]').click(); const popup=await popupPromise;await popup.close();
  expect(await page.evaluate(()=>window.dataLayer.filter(x=>x[1]==='conversion').map(x=>x[2].send_to))).toEqual(['AW-10852613132/Z6GjCJXF5dQcEIz49rYo']);
  await page.locator('#message').fill('Updated requirements');
  await expect(page.locator('#enquiry-ready')).not.toBeVisible();
  await page.getByRole('button',{name:'Prepare my enquiry'}).click();
  const updated=new URL(await page.locator('[data-send-whatsapp]').getAttribute('href'));
  expect(updated.searchParams.get('text')).toContain('Updated requirements');
});

test('email conversion retains baseline and navigation fallback works with tag blocked',async({page})=>{
  await page.goto('/contact');
  await page.evaluate(()=>{
    window.__fallbacks=[];
    window.setTimeout=callback=>{window.__fallbacks.push(callback.toString());return 1;};
  });
  await page.locator('.contact-method a[data-conversion="email"]').click();
  const events=await page.evaluate(()=>window.dataLayer.filter(x=>x[1]==='conversion').map(x=>({send_to:x[2].send_to,value:x[2].value,currency:x[2].currency})));
  expect(events).toEqual([{send_to:'AW-10852613132/HSdnCJDq5dQcEIz49rYo',value:1,currency:'MYR'}]);
  expect(await page.evaluate(()=>window.__fallbacks.length)).toBe(1);
});

test('legacy URLs redirect; server hides source; static content remains usable without JS',async({page,context,request})=>{
  for(const [old,target] of [['about-us.html','about'],['contact-us.html','contact'],['features.html','services'],['pricing.html','contact']]) {
    await page.goto('/'+old); await expect(page).toHaveURL(new RegExp('/'+target+'/?$'));
    await page.goto('/'+old+'?utm_source=regression&gclid=qa-test#main');
    await expect(page).toHaveURL(new RegExp('/'+target+'/\\?utm_source=regression&gclid=qa-test#main$'));
  }
  expect((await request.get('/scripts/content.mjs')).status()).toBe(404);
  const noJS=await context.browser().newContext({javaScriptEnabled:false});
  const p=await noJS.newPage(); await p.goto('http://127.0.0.1:4173/services');
  await expect(p.getByRole('heading',{level:1})).toBeVisible();
  await p.locator('#services-menu summary').click(); await expect(p.locator('.mega-menu')).toBeVisible();
  await noJS.close();
});
