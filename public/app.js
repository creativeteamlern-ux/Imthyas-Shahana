(() => {
  'use strict';
  const config = window.WEDDING;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const date = new Date(config.date);
  const prettyDate = new Intl.DateTimeFormat('en-US', {month:'long',day:'numeric',year:'numeric',timeZone:config.timeZone}).format(date);
  for (const [attribute,value] of Object.entries({names:config.names,date:prettyDate,venue:config.venue,address:config.address,location:config.location})) {
    $$(`[data-${attribute}]`).forEach(el => { el.textContent = value; });
  }
  const [groom, bride] = config.names.split('&').map(name => name.trim());
const heroNames = $('.hero .names');

heroNames.replaceChildren(
  document.createTextNode(groom),
  document.createElement('br'),
  document.createTextNode('&'),
  document.createElement('br'),
  document.createTextNode(bride)
);
  document.title = `${config.names} — A day, a lifetime`;
  $('#deadline').textContent = config.rsvpDeadline;
  $('#directions').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.venue + ', ' + config.address)}`;
  const initials = config.names.split('&').map(name => name.trim()[0]).filter(Boolean);
  if (initials.length === 2) $$('.monogram').forEach(el => {el.replaceChildren(document.createTextNode(initials[0]), Object.assign(document.createElement('span'),{textContent:'&'}), document.createTextNode(initials[1]));});

  function tick() {
    const remaining = Math.max(0,date.getTime()-Date.now());
    const values = [Math.floor(remaining/86400000),Math.floor(remaining/3600000)%24,Math.floor(remaining/60000)%60,Math.floor(remaining/1000)%60];
    ['days','hours','minutes','seconds'].forEach((key,i)=>{$(`#${key}`).textContent=String(values[i]).padStart(2,'0');});
    if (!remaining) {$('#countdown-message').hidden=false; $('#countdown-message').textContent='Our forever has begun.';}
  }
  tick(); setInterval(() => {if (!document.hidden) tick();},1000);
  document.addEventListener('visibilitychange',tick);

  const calendarEscape = value => value.replaceAll('\\','\\\\').replaceAll('\n','\\n').replaceAll(',','\\,').replaceAll(';','\\;');
  const calendarDate = value => new Date(value).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z/,'Z');
  $('#calendar').addEventListener('click',()=>{
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation//EN','BEGIN:VEVENT',`UID:wedding-${date.getTime()}@invitation.local`,`DTSTAMP:${calendarDate(Date.now())}`,`DTSTART:${calendarDate(config.date)}`,`DTEND:${calendarDate(config.endDate)}`,`SUMMARY:${calendarEscape(config.names)} — Wedding`,`LOCATION:${calendarEscape(config.venue+', '+config.address)}`,'DESCRIPTION:We cannot wait to celebrate with you.','END:VEVENT','END:VCALENDAR'];
    const url=URL.createObjectURL(new Blob([lines.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'}));
    const link=Object.assign(document.createElement('a'),{href:url,download:'our-wedding.ics'});document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });

  const menu=$('.menu-dialog');
  $('.menu-toggle').addEventListener('click',()=>menu.showModal());
  $('.menu-close').addEventListener('click',()=>menu.close());
  $$('.menu-dialog a').forEach(a=>a.addEventListener('click',()=>menu.close()));

  const lightbox=$('#lightbox'), gallery=$$('.gallery-item'); let activeIndex=0;
  function showImage(index){activeIndex=(index+gallery.length)%gallery.length;const trigger=gallery[activeIndex];$('#lightbox-image').src=trigger.dataset.image;$('#lightbox-image').alt=trigger.querySelector('img').alt;$('#lightbox-caption').textContent=trigger.dataset.caption;}
  gallery.forEach((item,index)=>item.addEventListener('click',()=>{showImage(index);lightbox.showModal();}));
  $('.lightbox-close').addEventListener('click',()=>lightbox.close());
  $('.lightbox-prev').addEventListener('click',()=>showImage(activeIndex-1));
  $('.lightbox-next').addEventListener('click',()=>showImage(activeIndex+1));
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});
  lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showImage(activeIndex-1);}if(e.key==='ArrowRight'){e.preventDefault();showImage(activeIndex+1);}});

  if (!reduced.matches && 'IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
    document.documentElement.classList.add('motion');$$('.reveal').forEach(el=>observer.observe(el));
    reduced.addEventListener('change',()=>{if(reduced.matches){document.documentElement.classList.remove('motion');observer.disconnect();}});
  }
  // Small desktop-only parallax; bounded to the hero and one frame per scroll.
  const heroImage=$('.hero-photo img'); let parallaxPending=false;
  function parallax(){parallaxPending=false;if(reduced.matches||innerWidth<900){heroImage.style.transform='';return;}const offset=Math.min(18,Math.max(0,scrollY*.035));heroImage.style.transform=`scale(1.035) translateY(${offset}px)`;}
  addEventListener('scroll',()=>{if(!parallaxPending&&scrollY<innerHeight*1.5){parallaxPending=true;requestAnimationFrame(parallax);}},{passive:true});
  addEventListener('resize',parallax); reduced.addEventListener('change',parallax); parallax();

  const video=$('#hero-video'),videoToggle=$('#video-toggle');
  if(config.heroVideo){
    video.src=config.heroVideo;video.hidden=false;videoToggle.hidden=false;
    videoToggle.textContent='Play film';
    const syncVideo=()=>{videoToggle.textContent=video.paused?'Play film':'Pause film';};
    video.addEventListener('play',syncVideo);video.addEventListener('pause',syncVideo);
    video.addEventListener('error',()=>{video.hidden=true;videoToggle.hidden=true;});
    videoToggle.addEventListener('click',()=>{if(video.paused)video.play().catch(()=>{});else video.pause();});
    if(!reduced.matches&&!navigator.connection?.saveData)video.play().catch(()=>{});
    reduced.addEventListener('change',()=>{if(reduced.matches)video.pause();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
  }

  const form=$('#rsvp-form'),status=$('#form-status');
  $$('input[name="attendance"]').forEach(input=>input.addEventListener('change',()=>{
    const declined=input.value==='no';$('#guest-fields').hidden=declined;
    $$('#guest-fields input, #guest-fields select, #guest-fields textarea').forEach(field=>field.disabled=declined);
  }));
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const payload=Object.fromEntries(new FormData(form));payload.name=payload.name.trim();payload.email=payload.email.trim();
    if(!payload.name){status.textContent='Please enter your name.';status.classList.add('error');$('#name').focus();return;}
    payload.guests=payload.attendance==='no'?0:Number(payload.guests);
    const button=form.querySelector('[type="submit"]');button.disabled=true;status.classList.remove('error');status.textContent='Sending your response…';
    try{
      const response=await fetch(config.rsvpEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
      const result=await response.json().catch(()=>({error:'The response service is unavailable. Please try again later.'}));
      if(!response.ok)throw new Error(result.error||'Your response could not be sent. Please try again.');
      status.textContent=payload.attendance==='yes'?`Thank you, ${payload.name}. Your response for ${payload.guests} ${payload.guests===1?'guest':'guests'} has been received. We cannot wait to celebrate with you!`:`Thank you, ${payload.name}. Your response has been received. You will be with us in spirit.`;
      form.reset();$('#guest-fields').hidden=false;$$('#guest-fields select, #guest-fields textarea').forEach(field=>field.disabled=false);
    }catch(error){status.classList.add('error');status.textContent=error.name==='TimeoutError'?'The request timed out. Your response may have arrived; please contact the hosts before retrying.':error.message==='Failed to fetch'?'We could not connect. Please check your connection and try again.':error.message;}
    finally{button.disabled=false;}
  });
})();
