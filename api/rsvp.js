export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'});}
  let input;
  try{input=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return res.status(400).json({error:'Invalid response.'});}
  if(!input||typeof input!=='object'||Array.isArray(input))return res.status(400).json({error:'Invalid response.'});
  if(input.website)return res.status(400).json({error:'Unable to accept this response.'});
  const {name,email,attendance,guests,meal='',notes=''}=input;
  if(typeof name!=='string'||!name.trim()||name.length>100||typeof email!=='string'||email.length>254||!/^\S+@\S+\.\S+$/.test(email)||!['yes','no'].includes(attendance))return res.status(400).json({error:'Please provide your name, valid email, and attendance.'});
  if(attendance==='yes'&&(!Number.isInteger(guests)||guests<1||guests>6||!['Chicken','Fish','Vegetarian','Vegan'].includes(meal)))return res.status(400).json({error:'Please select 1–6 guests and a meal preference.'});
  if(typeof notes!=='string'||notes.length>1000)return res.status(400).json({error:'Please keep your note under 1,000 characters.'});
  const endpoint=process.env.RSVP_WEBHOOK_URL;
  if(!endpoint)return res.status(503).json({error:'Online RSVPs are not open yet. Please contact the hosts directly; your response has not been sent.'});
  try{
    if(new URL(endpoint).protocol!=='https:')throw new Error('Invalid endpoint');
    const response=await fetch(endpoint,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',...(process.env.RSVP_WEBHOOK_TOKEN?{Authorization:`Bearer ${process.env.RSVP_WEBHOOK_TOKEN}`}:{})},body:JSON.stringify({name:name.trim(),email:email.trim(),attendance,guests:attendance==='yes'?guests:0,meal:attendance==='yes'?meal:'',notes,receivedAt:new Date().toISOString()}),signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw new Error('Delivery rejected');
    return res.status(200).json({ok:true});
  }catch{return res.status(502).json({error:'We could not confirm receipt. Please contact the hosts before retrying.'});}
}
