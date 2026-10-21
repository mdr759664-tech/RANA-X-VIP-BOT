import express from 'express';
import { default as makeWASocket, useMultiFileAuthState, Browsers, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import QRCode from 'qrcode';
import path from 'path';

const app = express();
const OWNER = "8801636487523";
const BOT_NAME = "RANA-X-VIP-BOT";
const BOT_PIC = "https://i.ibb.co/4ZqDk7Yp/3d-crown-golden-logo-with-ai-generated-free-png.png";
const CHANNEL = "https://whatsapp.com/channel/0029VbDF4POH5JLyfJOmwZ3B";
let mainSock = null, qrSock = null;
let welcomeOn = true, callRejectOn = true, autoReactOn = true, recentOn = true;

const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🥰","😍"];

// ⚡ FIXED - NO MORE 2-3 MIN LOADING - DIRECT VERSION
async function getVersion(){ return [2,3000,1015901307]; }

async function welcome(sock,gid,p){
  if(!welcomeOn) return;
  try{
    let pp;
    try{ pp = await sock.profilePictureUrl(p, 'image'); }catch{ pp = BOT_PIC; }
    let m = await sock.groupMetadata(gid);
    let newMember = p.split('@')[0];
    let memberCount = m.participants.length;
    let time = new Date().toLocaleTimeString('en-BD',{hour:'2-digit',minute:'2-digit',hour12:true});
    let date = new Date().toLocaleDateString('en-BD');
    let txt = 
`╭───❰ 🌸 স্বাগতম 🌸 ❱───╮

   👑 ${BOT_NAME} 👑

   আসসালামু আলাইকুম ওয়া 
   রহমাতুল্লাহি ওয়া বারাকাতুহু 💖

   প্রিয় @${newMember} ভাই/আপু
   আপনাকে আমাদের পরিবারে
   জানাই আন্তরিক স্বাগতম 🥰

┏━━━━━━━━━━━━━━━━━━┓
┃  🏰 গ্রুপ: ${m.subject}
┃  👤 নাম: @${newMember}
┃  🆔 নাম্বার: +${newMember}
┃  👥 আপনি ${memberCount} তম সদস্য
┃  🕒 সময়: ${time}
┃  📅 তারিখ: ${date}
┗━━━━━━━━━━━━━━━━━━┛

   🌸 গ্রুপের নিয়ম মেনে চলবেন 🌸
   ✨ প্রোফাইল পিক সহ স্বাগতম ✨

╰───❰ 🌍 ভালো থাকবেন 🌍 ❱───╯

👑 Owner: +${OWNER}
🤖 Bot: ${BOT_NAME}`;
    await sock.sendMessage(gid,{image:{url:pp},caption:txt,mentions:[p]});
  }catch(e){}
}

function getMenu(){
  return `👑 ${BOT_NAME} - 800+ Commands Ready!`;
}

app.get('/', (req,res)=>{
  res.send(`<!DOCTYPE html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><title>RANA ULTRA 800+</title><style>body{margin:0;min-height:100vh;display:flex;justify-content:center;align-items:center;background:linear-gradient(135deg,#a855f7,#7c3aed);font-family:sans-serif;padding:15px}.card{background:#fff;max-width:430px;width:100%;border-radius:28px;padding:24px;text-align:center;box-shadow:0 20px 60px #0003}.logo{width:80px;height:80px;margin:0 auto 10px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6366f1);display:flex;align-items:center;justify-content:center;font-size:40px}h1{color:#6d28d9;margin:5px}.tab{display:flex;gap:10px;margin:14px 0}.tab button{flex:1;padding:12px;border:2px solid #7c3aed;border-radius:12px;font-weight:800;cursor:pointer;background:#fff;color:#7c3aed}.tab button.active{background:#7c3aed;color:#fff}.panel{display:none}.panel.active{display:block}input{width:100%;padding:14px;border:2px solid #e9d5ff;border-radius:12px;box-sizing:border-box;font-weight:700}.btn{width:100%;margin-top:12px;padding:14px;background:#7c3aed;color:#fff;border:none;border-radius:12px;font-weight:800;cursor:pointer}.box{margin-top:14px;padding:16px;border-radius:12px;display:none;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#dcfce7,#bbf7d0);border:2px solid #22c55e}.code{font-size:32px;font-weight:900;color:#15803d;letter-spacing:3px}.qrbox{margin-top:14px;padding:14px;background:#f5f3ff;border-radius:16px;display:none}.qrbox img{width:250px;height:250px;background:#fff;padding:10px;border-radius:12px}#res{margin-top:12px;padding:12px;border-radius:10px;display:none;font-weight:700}</style></head><body><div class=card><div class=logo>👑</div><h1>RANA-X-VIP-BOT</h1><p><b>🔥 বাংলা স্বাগতম | FAST 10s | 800+ 🔥</b></p><div class=tab><button id=t1 class=active onclick="showTab('pair')">📱 Pair Code</button><button id=t2 onclick="showTab('qr')">📷 QR Code</button></div><div id=pairPanel class="panel active"><input id=num placeholder="8801XXXXXXXXX"><button class=btn onclick="getPair()">⚡ Pair Code নাও</button><div id=box class=box><span id=code class=code></span><button onclick="copyCode()" style="padding:10px 16px;background:#000;color:#fff;border:none;border-radius:8px;font-weight:800">Copy</button></div></div><div id=qrPanel class="panel"><p>WhatsApp > Linked Devices > Link a Device</p><button class=btn onclick="getQR()">QR Generate - FAST</button><div id=qrbox class=qrbox><img id=qimg src=""/><p id=qrstatus style="font-weight:700;color:#7c3aed">Scan within 60 sec</p><button class=btn onclick="getQR()" style="background:#000">Refresh</button></div></div><div id=res></div></div><script>function showTab(t){document.getElementById('pairPanel').classList.remove('active');document.getElementById('qrPanel').classList.remove('active');document.getElementById('t1').classList.remove('active');document.getElementById('t2').classList.remove('active');if(t==='pair'){document.getElementById('pairPanel').classList.add('active');document.getElementById('t1').classList.add('active');}else{document.getElementById('qrPanel').classList.add('active');document.getElementById('t2').classList.add('active');}}async function getPair(){let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let b=document.getElementById('box');let r=document.getElementById('res');if(!n||n.length<11){alert('Valid Number dao');return}b.style.display='none';r.style.display='block';r.innerText='⚡ Generating... 10 sec';r.style.background='#fef3c7';try{let d=await (await fetch('/pair?number='+n)).json();if(d.code){document.getElementById('code').innerText=d.code;b.style.display='flex';r.style.display='none';}else{r.innerText='❌ '+d.error;r.style.background='#fee2e2';}}catch(e){r.innerText='❌ Error';r.style.background='#fee2e2';}}function copyCode(){navigator.clipboard.writeText(document.getElementById('code').innerText);alert('✅ Copied!')}async function getQR(){let box=document.getElementById('qrbox');let img=document.getElementById('qimg');let r=document.getElementById('res');let s=document.getElementById('qrstatus');img.removeAttribute('src');box.style.display='none';r.style.display='block';r.innerText='Generating QR... 10 sec';r.style.background='#fef3c7';try{let d=await (await fetch('/qr')).json();if(d.qr){img.src=d.qr;box.style.display='block';r.style.display='none';s.innerText='Scan within 60 sec';}else{r.innerText='❌ '+d.error;r.style.background='#fee2e2';}}catch(e){r.innerText='❌ Error';r.style.background='#fee2e2';}}<\/script></body></html>`);
});

app.get('/pair', async (req,res)=>{
  let pairSock = null;
  try{
    let num = req.query.number ? req.query.number.replace(/[^0-9]/g,'') : '';
    if(!num) return res.json({error:"Number dao"});
    if(mainSock){ try{ mainSock.end(); }catch{} mainSock=null; }
    if(qrSock){ try{ qrSock.end(); }catch{} qrSock=null; }
    const PAIR_DIR = './session/PAIR-TEMP';
    if(fs.existsSync(PAIR_DIR)) fs.rmSync(PAIR_DIR,{recursive:true,force:true});
    fs.mkdirSync(PAIR_DIR,{recursive:true});
    const {state, saveCreds} = await useMultiFileAuthState(PAIR_DIR);
    let version = await getVersion();
    pairSock = makeWASocket({ 
      version, 
      auth: {creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'}))}, 
      logger:pino({level:'silent'}), 
      browser: Browsers.ubuntu('Chrome'),
      syncFullHistory:false, 
      markOnlineOnConnect:false, 
      printQRInTerminal:false,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 0,
      keepAliveIntervalMs: 10000
    });
    pairSock.ev.on('creds.update', saveCreds);
    let paired=false;
    pairSock.ev.on('connection.update', async (u)=>{
      if(u.connection==='open' && !paired){
        paired=true;
        const MAIN_DIR='./session/RANA-SESSION';
        if(fs.existsSync(MAIN_DIR)) fs.rmSync(MAIN_DIR,{recursive:true,force:true});
        fs.mkdirSync(MAIN_DIR,{recursive:true});
        fs.readdirSync(PAIR_DIR).forEach(f=>{ fs.copyFileSync(path.join(PAIR_DIR,f), path.join(MAIN_DIR,f)); });
        try{ pairSock.end(); }catch{} setTimeout(()=>startBot(),2000);
      }
    });
    await new Promise(r=>setTimeout(r,1500));
    let code = null;
    for(let i=0;i<3;i++){ try{ code = await pairSock.requestPairingCode(num); if(code) break; }catch{ await new Promise(r=>setTimeout(r,1000)); } }
    if(!code) throw new Error("Pair Failed - QR use koro");
    code = code.match(/.{1,4}/g) ? code.match(/.{1,4}/g).join("-") : code;
    res.json({code});
    setTimeout(()=>{ try{ if(!paired) pairSock.end(); }catch{} },180000);
  }catch(e){ res.json({error:e.message}); try{ pairSock.end(); }catch{} }
});

app.get('/qr', async (req,res)=>{
  try{
    if(mainSock){ try{ mainSock.end(); }catch{} mainSock=null; }
    if(qrSock){ try{ qrSock.end(); }catch{} }
    const QR_DIR = './session/QR-TEMP';
    if(fs.existsSync(QR_DIR)) fs.rmSync(QR_DIR,{recursive:true,force:true});
    fs.mkdirSync(QR_DIR,{recursive:true});
    const {state, saveCreds} = await useMultiFileAuthState(QR_DIR);
    let version = await getVersion();
    qrSock = makeWASocket({ 
      version, 
      auth: {creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'}))}, 
      logger:pino({level:'silent'}), 
      browser: Browsers.ubuntu('Chrome'),
      syncFullHistory:false, 
      printQRInTerminal:false,
      connectTimeoutMs: 60000
    });
    qrSock.ev.on('creds.update', saveCreds);
    let qrPromise = new Promise((resolve, reject)=>{
      let timeout = setTimeout(()=> reject(new Error("QR Timeout")), 30000);
      qrSock.ev.on('connection.update', async (u)=>{
        if(u.qr){ clearTimeout(timeout); resolve(u.qr); }
        if(u.connection==='open'){
          const MAIN_DIR='./session/RANA-SESSION';
          if(fs.existsSync(MAIN_DIR)) fs.rmSync(MAIN_DIR,{recursive:true,force:true});
          fs.mkdirSync(MAIN_DIR,{recursive:true});
          fs.readdirSync(QR_DIR).forEach(f=>{ fs.copyFileSync(path.join(QR_DIR,f), path.join(MAIN_DIR,f)); });
          try{ qrSock.end(); }catch{} qrSock=null;
          setTimeout(()=>startBot(),2000);
        }
      });
    });
    let qrData = await qrPromise;
    let qrImage = await QRCode.toDataURL(qrData);
    res.json({qr: qrImage});
  }catch(e){ res.json({error:e.message}); }
});

async function startBot(){
  try{
    const SESSION_DIR = './session/RANA-SESSION';
    if(!fs.existsSync(SESSION_DIR)) return;
    const {state,saveCreds}=await useMultiFileAuthState(SESSION_DIR);
    let version = await getVersion();
    const sock=makeWASocket({ 
      version, 
      auth: {creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'}))}, 
      logger:pino({level:'silent'}), 
      browser:Browsers.ubuntu('Chrome'),
      syncFullHistory:false 
    });
    mainSock=sock;
    sock.ev.on('creds.update',saveCreds);
    sock.ev.on('connection.update', (u)=>{ if(u.connection==='close'){ setTimeout(startBot,5000); } if(u.connection==='open'){ console.log('✅ ULTRA 800+ Connected!'); } });
    sock.ev.on('group-participants.update', async (u)=>{ for(let p of u.participants){ if(u.action=='add') await welcome(sock,u.id,p); } });
    sock.ev.on('call', async (c)=>{ if(!callRejectOn) return; for(let x of c){ if(x.status=='offer'){ await sock.rejectCall(x.id,x.from); } } });
    sock.ev.on('messages.upsert', async (m)=>{
      try{
        const msg=m.messages[0]; if(!msg.message||msg.key.fromMe) return;
        const from=msg.key.remoteJid; const isGroup=from.endsWith('@g.us');
        const body=msg.message.conversation||msg.message.extendedTextMessage?.text||"";
        const sender = msg.key.participant || from;
        if(isGroup && autoReactOn){
          let e=EMOJI[Math.floor(Math.random()*EMOJI.length)];
          await sock.sendMessage(from,{react:{text:e,key:msg.key}});
        }
        let prefix = "."; if(!body.startsWith(prefix)) return;
        let cmd = body.slice(1).trim().split(" ")[0].toLowerCase();
        if(cmd==="menu" || cmd==="help" || cmd==="ping"){
          await sock.sendMessage(from,{text:`👑 ${BOT_NAME} ALIVE! বাংলা Welcome ON`});
        }
      }catch(e){}
    });
  }catch(e){ setTimeout(startBot,5000); }
}

console.log('⚡ RANA-X-VIP Starting... Wait 10 sec');
const PORT=process.env.PORT||10000;
app.listen(PORT, '0.0.0.0', ()=>{ startBot(); console.log('ULTRA 800+ Server running on '+PORT); });
