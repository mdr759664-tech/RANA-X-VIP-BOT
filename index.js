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
let mainSock = null;
let qrSock = null;
let latestQR = null;
let welcomeOn = true;
let callRejectOn = true;
let autoReactOn = true;
const EMOJI = ["❤️","🔥","👑","😎","✨"];
const WA_VERSION = [2, 3000, 1023223823];

async function welcome(sock,gid,p){
  if(!welcomeOn) return;
  try{
    let pp; try{ pp = await sock.profilePictureUrl(p, 'image'); }catch{ pp = BOT_PIC; }
    let m = await sock.groupMetadata(gid);
    let txt = "━━━━━━━━━━━━━━━━━━━━\n"+
"👑 "+BOT_NAME+" 👑\n"+
"━━━━━━━━━━━━━━━━━━━━\n"+
"🌸 আসসালামু আলাইকুম 🌸\n"+
"💖 প্রিয় @"+p.split('@')[0]+" 💖\n"+
"🏰 "+m.subject+" 🏰\n"+
"পরিবারে তোমাকে স্বাগতম\n"+
"━━━━━━━━━━━━━━━━━━━━\n"+
"👤 নাম: @"+p.split('@')[0]+"\n"+
"👥 সদস্য: "+m.participants.length+" তম\n"+
"🕒 সময়: "+new Date().toLocaleTimeString()+"\n"+
"━━━━━━━━━━━━━━━━━━━━\n"+
"👑 Owner: +"+OWNER+"\n"+
"🤖 Bot: "+BOT_NAME+"\n"+
"📢 Channel: "+CHANNEL+"\n"+
"━━━━━━━━━━━━━━━━━━━━\n"+
"🌍 Profile Pic Soho Welcome 🌍\n"+
"━━━━━━━━━━━━━━━━━━━━";
    await sock.sendMessage(gid,{image:{url:pp},caption:txt,mentions:[p]});
  }catch(e){}
}

app.get('/', (req,res)=>{
  res.send(`<!DOCTYPE html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><title>RANA 2 IN 1</title><style>body{margin:0;min-height:100vh;display:flex;justify-content:center;align-items:center;background:linear-gradient(135deg,#a855f7,#7c3aed);font-family:sans-serif;padding:15px}.card{background:#fff;max-width:430px;width:100%;border-radius:28px;padding:24px;text-align:center;box-shadow:0 20px 60px #0003}.logo{width:80px;height:80px;margin:0 auto 10px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6366f1);display:flex;align-items:center;justify-content:center;font-size:40px}h1{color:#6d28d9;margin:5px}.tab{display:flex;gap:10px;margin:14px 0}.tab button{flex:1;padding:12px;border:2px solid #7c3aed;border-radius:12px;font-weight:800;cursor:pointer;background:#fff;color:#7c3aed}.tab button.active{background:#7c3aed;color:#fff}.panel{display:none}.panel.active{display:block}input{width:100%;padding:14px;border:2px solid #e9d5ff;border-radius:12px;box-sizing:border-box}.btn{width:100%;margin-top:12px;padding:14px;background:#7c3aed;color:#fff;border:none;border-radius:12px;font-weight:800;cursor:pointer}.box{margin-top:14px;padding:14px;border-radius:12px;display:none;justify-content:space-between;align-items:center;background:#dcfce7}.code{font-size:30px;font-weight:900;color:green}.qrbox{margin-top:14px;padding:14px;background:#f5f3ff;border-radius:16px;display:none}.qrbox img{width:250px;height:250px;background:#fff;padding:10px;border-radius:12px}#res{margin-top:12px;padding:12px;border-radius:10px;display:none;font-weight:700}</style></head><body><div class=card><div class=logo>👑</div><h1>RANA-X-VIP-BOT</h1><p><b>Pair + QR 2 System</b></p><div class=tab><button id=t1 class=active onclick="showTab('pair')">📱 Pair Code</button><button id=t2 onclick="showTab('qr')">📷 QR Code</button></div><div id=pairPanel class="panel active"><input id=num placeholder="8801XXXXXXXXX"><button class=btn onclick="getPair()">Generate Pair Code</button><div id=box class=box><span id=code class=code></span><button onclick="copyCode()" style="padding:8px 14px;background:#000;color:#fff;border:none;border-radius:8px;font-weight:700">Copy</button></div></div><div id=qrPanel class="panel"><p>WhatsApp > Linked Devices > Link a Device</p><button class=btn onclick="getQR()">Generate QR Code</button><div id=qrbox class=qrbox><img id=qimg src=""/><p id=qrstatus style="font-weight:700;color:#7c3aed">Scan within 60 sec</p><button class=btn onclick="getQR()" style="background:#000">Refresh QR</button></div></div><div id=res></div></div><script>function showTab(t){document.getElementById('pairPanel').classList.remove('active');document.getElementById('qrPanel').classList.remove('active');document.getElementById('t1').classList.remove('active');document.getElementById('t2').classList.remove('active');if(t==='pair'){document.getElementById('pairPanel').classList.add('active');document.getElementById('t1').classList.add('active');}else{document.getElementById('qrPanel').classList.add('active');document.getElementById('t2').classList.add('active');}}async function getPair(){let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let b=document.getElementById('box');let r=document.getElementById('res');if(!n){alert('Number dao');return}b.style.display='none';r.style.display='block';r.innerText='Generating...';r.style.background='#fef3c7';try{let d=await (await fetch('/pair?number='+n)).json();if(d.code){document.getElementById('code').innerText=d.code;b.style.display='flex';r.style.display='none';}else{r.innerText='❌ '+d.error;r.style.background='#fee2e2';}}catch(e){r.innerText='❌ Error';r.style.background='#fee2e2';}}function copyCode(){navigator.clipboard.writeText(document.getElementById('code').innerText);alert('Copied!')}async function getQR(){let box=document.getElementById('qrbox');let img=document.getElementById('qimg');let r=document.getElementById('res');let s=document.getElementById('qrstatus');img.removeAttribute('src');box.style.display='none';r.style.display='block';r.innerText='Generating QR... Wait 5 sec';r.style.background='#fef3c7';try{let d=await (await fetch('/qr')).json();if(d.qr){img.src=d.qr;box.style.display='block';r.style.display='none';s.innerText='Scan within 60 sec';}else{r.innerText='❌ '+d.error;r.style.background='#fee2e2';}}catch(e){r.innerText='❌ Error - Refresh click koro';r.style.background='#fee2e2';}}<\/script></body></html>`);
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
    let version = WA_VERSION;
    pairSock = makeWASocket({ version, auth: {creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'}))}, logger:pino({level:'silent'}), browser:Browsers.windows('Chrome'), syncFullHistory:false, markOnlineOnConnect:false, printQRInTerminal:false });
    pairSock.ev.on('creds.update', saveCreds);
    let paired=false;
    pairSock.ev.on('connection.update', async (u)=>{
      if(u.connection==='open' && !paired){
        paired=true;
        const MAIN_DIR='./session/RANA-SESSION';
        if(fs.existsSync(MAIN_DIR)) fs.rmSync(MAIN_DIR,{recursive:true,force:true});
        fs.mkdirSync(MAIN_DIR,{recursive:true});
        let files = fs.readdirSync(PAIR_DIR);
        for(let f of files){ fs.copyFileSync(path.join(PAIR_DIR,f), path.join(MAIN_DIR,f)); }
        try{ pairSock.end(); }catch{}
        setTimeout(()=>startBot(),2000);
      }
    });
    await new Promise(r=>setTimeout(r,3000));
    let code = await pairSock.requestPairingCode(num);
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
    latestQR=null;
    const {state, saveCreds} = await useMultiFileAuthState(QR_DIR);
    let version = WA_VERSION;
    qrSock = makeWASocket({ version, auth: {creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'}))}, logger:pino({level:'silent'}), browser:Browsers.windows('Chrome'), syncFullHistory:false, printQRInTerminal:false });
    qrSock.ev.on('creds.update', saveCreds);
    qrSock.ev.on('connection.update', async (u)=>{
      if(u.qr){ latestQR = u.qr; }
      if(u.connection==='open'){
        const MAIN_DIR='./session/RANA-SESSION';
        if(fs.existsSync(MAIN_DIR)) fs.rmSync(MAIN_DIR,{recursive:true,force:true});
        fs.mkdirSync(MAIN_DIR,{recursive:true});
        let files = fs.readdirSync(QR_DIR);
        for(let f of files){ fs.copyFileSync(path.join(QR_DIR,f), path.join(MAIN_DIR,f)); }
        try{ qrSock.end(); }catch{} qrSock=null; latestQR=null;
        setTimeout(()=>startBot(),2000);
      }
    });
    let tries=0;
    while(!latestQR && tries<20){ await new Promise(r=>setTimeout(r,1000)); tries++; }
    if(!latestQR) return res.json({error:"QR Timeout, Refresh click koro"});
    let qrImage = await QRCode.toDataURL(latestQR);
    res.json({qr: qrImage});
  }catch(e){ res.json({error:e.message}); }
});

async function startBot(){
  try{
    const SESSION_DIR = './session/RANA-X-VIP-SESSION';
    if(!fs.existsSync(SESSION_DIR)) { console.log('No session yet, waiting...'); return; }
    const {state,saveCreds}=await useMultiFileAuthState(SESSION_DIR);
    let version = WA_VERSION;
    const sock=makeWASocket({ version, auth: {creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'}))}, logger:pino({level:'silent'}), browser:Browsers.windows('Chrome'), syncFullHistory:false });
    mainSock=sock;
    sock.ev.on('creds.update',saveCreds);
    sock.ev.on('connection.update', (u)=>{ if(u.connection==='close'){ setTimeout(startBot,5000); } if(u.connection==='open'){ console.log('✅ Connected!'); } });
    sock.ev.on('group-participants.update', async (u)=>{ for(let p of u.participants){ if(u.action=='add') await welcome(sock,u.id,p); } });
    sock.ev.on('call', async (c)=>{ if(!callRejectOn) return; for(let x of c){ if(x.status=='offer'){ await sock.rejectCall(x.id,x.from); } } });
    sock.ev.on('messages.upsert', async (m)=>{
      try{
        const msg=m.messages[0];
        if(!msg.message||msg.key.fromMe) return;
        const from=msg.key.remoteJid;
        const isGroup=from.endsWith('@g.us');
        if(isGroup&&autoReactOn){
          let e=EMOJI[Math.floor(Math.random()*EMOJI.length)];
          await sock.sendMessage(from,{react:{text:e,key:msg.key}});
        }
      }catch{}
    });
  }catch(e){ setTimeout(startBot,5000); }
}
const PORT=process.env.PORT||10000;
app.listen(PORT,()=>{ startBot(); console.log('Server running on '+PORT); });
