import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/rsvp.js';
const valid={name:'Test Guest',email:'guest@example.com',attendance:'yes',guests:2,meal:'Vegetarian',notes:''};
async function request(body,method='POST') {const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(data){this.data=data;return this;}};await handler({method,body},res);return res;}
test('RSVP endpoint validates and reports delivery honestly',async t=>{
 const originalFetch=globalThis.fetch, originalURL=process.env.RSVP_WEBHOOK_URL;
 try{
  delete process.env.RSVP_WEBHOOK_URL;
  await t.test('rejects GET',async()=>assert.equal((await request(null,'GET')).code,405));
  await t.test('rejects malformed JSON',async()=>assert.equal((await request('{')).code,400));
  await t.test('rejects whitespace-only names',async()=>assert.equal((await request({...valid,name:'   '})).code,400));
  await t.test('rejects invalid email',async()=>assert.equal((await request({...valid,email:'wrong'})).code,400));
  await t.test('rejects invalid guest counts',async()=>assert.equal((await request({...valid,guests:99})).code,400));
  await t.test('rejects honeypot',async()=>assert.equal((await request({...valid,website:'bot'})).code,400));
  await t.test('unconfigured service never claims success',async()=>assert.equal((await request(valid)).code,503));
  process.env.RSVP_WEBHOOK_URL='https://example.com/test';let received;
  globalThis.fetch=async(url,options)=>{received=JSON.parse(options.body);return{ok:true};};
  await t.test('forwards a valid RSVP',async()=>{assert.equal((await request(valid)).code,200);assert.equal(received.guests,2);assert.equal(received.name,'Test Guest');});
  await t.test('declines have zero guests',async()=>{assert.equal((await request({...valid,attendance:'no',guests:5})).code,200);assert.equal(received.guests,0);assert.equal(received.meal,'');});
  globalThis.fetch=async()=>({ok:false});
  await t.test('delivery failure never claims success',async()=>assert.equal((await request(valid)).code,502));
 }finally{globalThis.fetch=originalFetch;if(originalURL===undefined)delete process.env.RSVP_WEBHOOK_URL;else process.env.RSVP_WEBHOOK_URL=originalURL;}
});
