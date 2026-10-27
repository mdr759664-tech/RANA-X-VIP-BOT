import express from 'express';
import { default as makeWASocket, useMultiFileAuthState, Browsers, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import QRCode from 'qrcode';
import path from 'path';

const app = express();
const OWNER = "8801636487523";
const BOT_NAME = "RANA-X-VIP-BOT";
const BOT_PIC = "https://i.ibb.co.com/Pz52VSWF/IMG-20261027-WA0000.jpg";
const CHANNEL = "https://whatsapp.com/channel/0029VbDF4POH5JLyfJOmwZ3B";

let mainSock = null;
let welcomeOn = true, autoReactOn = true;
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🥰","😍"];
const recentMsgs = [];

async function getVersion(){ 
  try { const { version } = await fetchLatestBaileysVersion(); return version; } 
  catch { return [2,3000,1015901307]; }
}

async function welcome(sock,gid,p){
  if(!welcomeOn) return;
  try{
    let pp;
    try{ pp = await sock.profilePictureUrl(p, 'image'); }catch{ pp = BOT_PIC; }
    let m = await sock.groupMetadata(gid);
    let newMember = p.split('@')[0];
    let txt = `╭───❰ 🌸 স্বাগতম 🌸 ❱───╮

   👑 ${BOT_NAME} 👑

   প্রিয় @${newMember} ভাই/আপু
   আপনাকে স্বাগতম 🥰

┏━━━━━━━━━━━━━━━━━━┓
┃  🏰 গ্রুপ: ${m.subject}
┃  👤 নাম: @${newMember}
┃  👥 আপনি ${m.participants.length} তম সদস্য
┗━━━━━━━━━━━━━━━━━━┛

   ✨ প্রোফাইল পিক সহ স্বাগতম ✨
╰───❰ 🌍 ভালো থাকবেন 🌍 ❱───╯`;
    await sock.sendMessage(gid,{image:{url:pp},caption:txt,mentions:[p]});
  }catch(e){}
}

// --- PROFESSIONAL REDX STYLE UI ---
app.get('/', (req,res)=>{
  res.send(`<!DOCTYPE html>
<html><head><meta name=viewport content="width=device-width,initial-scale=1">
<title>RANA-X-VIP-BOT</title>
<style>
body{margin:0;min-height:100vh;background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;display:flex;justify-content:center;align-items:center;padding:15px}
.card{background:#151515;border:1px solid #2a2a2a;border-radius:28px;padding:28px 22px;width:100%;max-width:410px;text-align:center;box-shadow:0 0 50px #000}
.icon{width:90px;height:90px;margin:0 auto 14px;border-radius:22px;overflow:hidden;border:2px solid #ff6a00;box-shadow:0 0 25px #ff6a0066}
.icon img{width:100%;height:100%;object-fit:cover}
h1{margin:6px 0;font-size:26px;letter-spacing:1px}.r{color:#fff}.x{color:#ff6a00}
.sub{color:#888;font-size:13px;margin:8px 0 18px;line-height:1.4}
.server{display:flex;flex-direction:column;gap:10px;margin:16px 0;text-align:left}
.srv{padding:13px 16px;border-radius:14px;border:1.5px solid #333;display:flex;justify-content:space-between;align-items:center;background:#1e1e1e;cursor:pointer;transition:.2s}
.srv.active{border-color:#ff6a00;background:#23160a}
.srv b{font-size:13px}.srv span{font-size:12px;color:#ff8c00}
.steps{display:flex;justify-content:center;gap:28px;margin:22px 0}
.step{width:38px;height:38px;border-radius:50%;background:#1e1e1e;border:1.5px solid #333;display:flex;align-items:center;justify-content:center;font-weight:800;color:#666}
.step.active{background:#ff6a00;color:#fff;border-color:#ff6a00;box-shadow:0 0 15px #ff6a00aa}
.label{text-align:left;font-size:11px;color:#aaa;margin:0 0 6px;letter-spacing:1px;font-weight:700}
input{width:100%;padding:15px;background:#0f0f0f;border:1.5px solid #2a2a2a;border-radius:14px;color:#fff;box-sizing:border-box;font-weight:600;outline:none;transition:.2s}
input:focus{border-color:#ff6a00}
.btn{width:100%;margin-top:16px;padding:15px;background:linear-gradient(135deg,#ff4500,#ff8c00);color:#fff;border:none;border-radius:14px;font-weight:900;cursor:pointer;font-size:15px;letter-spacing:.5px;box-shadow:0 5px 20px #ff6a0044}
.box{margin-top:16px;padding:16px;border-radius:14px;display:none;justify-content:space-between;align-items:center;background:#0f0f0f;border:1.5px dashed #ff6a00}
.code{font-size:30px;font-weight:900;color:#ff8c00;letter-spacing:3px}
.qrbox{margin-top:16px;padding:16px;background:#0f0f0f;border:1px solid #2a2a2a;border-radius:18px;display:none}
.qrbox img{width:240px;height:240px;background:#fff;padding:10px;border-radius:14px}
#res{margin-top:12px;padding:12px;border-radius:10px;display:none;font-weight:700;font-size:13px}
.footer{margin-top:20px;border-top:1px solid #222;padding-top:14px;display:flex;justify-content:space-between;align-items:center}
.footer button{background:none;border:none;color:#777;font-size:12px;font-weight:700;cursor:pointer}
.footer a{color:#ff6a00;text-decoration:none;font-weight:800;font-size:12px}
</style></head>
<body><div class=card>
<div class=icon><img src="${BOT_PIC}" alt="logo"></div>
<h1><span class=r>RANA</span><span class=x>-X-VIP</span><span class=r>-BOT</span></h1>
<p class=sub>Enter your WhatsApp number to link your device.<br>No QR scan - no app install.</p>

<div class=server>
<div class="srv active" id=s1 onclick="sel('heroku')"><div><b>🔶 heroku</b><div style="font-size:10px;color:#666">Recommended</div></div><span>—/100</span></div>
<div class="srv" id=s2 onclick="sel('railway')"><div><b>⚫ railway</b><div style="font-size:10px;color:#666">Backup Server</div></div><span>—/100</span></div>
</div>

<div class=steps><div class="step active" id=st1>1</div><div class=step id=st2>2</div><div class=step id=st3>3</div></div>

<p class=label>STEP 1 - YOUR NUMBER</p>
<p style="text-align:left;font-size:11px;color:#555;margin:0 0 10px">WhatsApp number, with country code</p>

<div style="display:flex;gap:8px">
<input id=c placeholder="+880" style="width:85px">
<input id=num placeholder="16XXXXXXXX">
</div>

<button class=btn onclick="getPair()">⚡ Get Pair Code</button>
<div id=box class=box><span id=code class=code></span><button onclick="copyCode()" style="padding:10px 16px;background:#ff6a00;color:#fff;border:none;border-radius:10px;font-weight:800;cursor:pointer">Copy</button></div>
<div id=res></div>

<div class=footer>
<button onclick="showQR()">📷 Use QR Code</button>
<a href="${CHANNEL}" target="_blank">📢 Join Channel</a>
</div>

<div id=qrbox class=qrbox><img id=qimg src=""/><p id=qrstatus style="font-size:12px;color:#ff8c00;margin-top:10px">Scan within 60 sec</p></div>
</div>
<script>
let server='heroku';
function sel(s){
  server=s;
  document.getElementById('s1').classList.toggle('active',s=='heroku');
  document.getElementById('s2').classList.toggle('active',s=='railway');
  document.getElementById('st1').classList.add('active');
}
async function getPair(){
  let c=document.getElementById('c').value.replace(/[^0-9+]/g,'');
  let n=document.getElementById('num').value.replace(/[^0-9]/g,'');
  let full=(c+n).replace(/[^0-9]/g,'');
  let b=document.getElementById('box');let r=document.getElementById('res');
  if(!full||full.length<10){alert('Valid Number dao - e.g. 8801636...');return}
  b.style.display='none';r.style.display='block';r.innerText='⚡ Connecting to '+server+'...';r.style.background='#1e1e1e';r.style.color='#ff8c00';
  document.getElementById('st1').classList.add('active');document.getElementById('st2').classList.add('active');
  try{
    let d=await (await fetch('/pair?number='+full)).json();
    if(d.code){
      document.getElementById('code').innerText=d.code;b.style.display='flex';r.style.display='none';
      document.getElementById('st3').classList.add('active');
    }else{r.innerText='❌ '+d.error;r.style.background='#2a0000';r.style.color='#ff6a6a';}
  }catch(e){r.innerText='❌ Server Error - Try Again';r.style.background='#2a0000';}
}
function copyCode(){let t=document.getElementById('code').innerText;navigator.clipboard.writeText(t);alert('✅ Copied: '+t)}
function showQR(){document.getElementById('qrbox').style.display='block';getQR()}
async function getQR(){
  let img=document.getElementById('qimg');let r=document.getElementById('res');
  r.style.display='block';r.innerText='⚡ Generating QR...';r.style.background='#1e1e1e';r.style.color='#ff8c00';
  try{let d=await (await fetch('/qr')).json();if(d.qr){img.src=d.qr;document.getElementById('qrbox').style.display='block';r.style.display='none';}}catch(e){r.innerText='❌ Error';}
}
<\/script></body></html>`);
});

app.get('/pair', async (req,res)=>{
  let pairSock = null;
  try{
    let num = req.query.number.replace(/[^0-9]/g,'');
    if(num.startsWith('0')) num = '88' + num;
    const PAIR_DIR = './session/PAIR-TEMP';
    if(fs.existsSync(PAIR_DIR)) fs.rmSync(PAIR_DIR,{recursive:true,force:true});
    fs.mkdirSync(PAIR_DIR,{recursive:true});
    const {state, saveCreds} = await useMultiFileAuthState(PAIR_DIR);
    let version = await getVersion();
    pairSock = makeWASocket({ version, auth: {creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'}))}, logger:pino({level:'silent'}), browser: Browsers.macOS('Chrome'), printQRInTerminal:false });
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
    await new Promise(r=>setTimeout(r,2500));
    let code = await pairSock.requestPairingCode(num);
    code = code.match(/.{1,4}/g)?.join("-") || code;
    res.json({code});
  }catch(e){ res.json({error:e.message}); }
});

app.get('/qr', async (req,res)=>{
  try{
    const QR_DIR = './session/QR-TEMP';
    if(fs.existsSync(QR_DIR)) fs.rmSync(QR_DIR,{recursive:true,force:true});
    fs.mkdirSync(QR_DIR,{recursive:true});
    const {state, saveCreds} = await useMultiFileAuthState(QR_DIR);
    let version = await getVersion();
    const sock = makeWASocket({ version, auth: {creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'}))}, logger:pino({level:'silent'}), browser: Browsers.macOS('Chrome') });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', async (u)=>{
      if(u.qr){ let qrImage = await QRCode.toDataURL(u.qr); res.json({qr: qrImage}); }
      if(u.connection==='open'){
        const MAIN_DIR='./session/RANA-SESSION';
        if(fs.existsSync(MAIN_DIR)) fs.rmSync(MAIN_DIR,{recursive:true,force:true});
        fs.mkdirSync(MAIN_DIR,{recursive:true});
        fs.readdirSync(QR_DIR).forEach(f=>{ fs.copyFileSync(path.join(QR_DIR,f), path.join(MAIN_DIR,f)); });
        setTimeout(()=>startBot(),2000);
      }
    });
  }catch(e){ res.json({error:e.message}); }
});

async function startBot(){
  const SESSION_DIR = './session/RANA-SESSION';
  if(!fs.existsSync(SESSION_DIR)) return;
  const {state,saveCreds}=await useMultiFileAuthState(SESSION_DIR);
  let version = await getVersion();
  const sock=makeWASocket({ version, auth: {creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'}))}, logger:pino({level:'silent'}), browser:Browsers.macOS('Chrome') });
  mainSock=sock;
  sock.ev.on('creds.update',saveCreds);
  sock.ev.on('group-participants.update', async (u)=>{ for(let p of u.participants){ if(u.action=='add') await welcome(sock,u.id,p); } });
  sock.ev.on('messages.upsert', async (m)=>{
    const msg=m.messages[0]; if(!msg.message||msg.key.fromMe) return;
    const from=msg.key.remoteJid; const body=msg.message.conversation||msg.message.extendedTextMessage?.text||"";
    recentMsgs.push({from, body, time: new Date().toLocaleTimeString()}); if(recentMsgs.length>10) recentMsgs.shift();
    if(autoReactOn){ let e=EMOJI[Math.floor(Math.random()*EMOJI.length)]; await sock.sendMessage(from,{react:{text:e,key:msg.key}}); }
    if(!body.startsWith(".")) return;
    let cmd = body.slice(1).trim().split(" ")[0].toLowerCase();
    if(cmd==="menu"||cmd==="help"){
      let menu = `╭───👑 ${BOT_NAME} ───╮
│ 🔥 Owner: +${OWNER}
│ ✨ Prefix: .
│ 📢 Channel: ${CHANNEL}
╰─────────────────╯
┏━━━❰ COMMANDS ❱━━━┓
┃ .menu - এই মেনু
┃ .ping - বট Active কিনা
┃ .recent - শেষ 10 মেসেজ
┃ .welcome on/off
┃ .emoji on/off
┃ .tagall - সবাইকে ট্যাগ
┗━━━━━━━━━━━━━━━━━┛
👑 Powered by RANA-X`;
      await sock.sendMessage(from,{image:{url:BOT_PIC},caption:menu});
    }
    if(cmd==="recent"){ let txt = "📜 *Recent Messages:*\n\n" + recentMsgs.map((r,i)=>`${i+1}. ${r.from.split('@')[0]}: ${r.body}`).join("\n"); await sock.sendMessage(from,{text:txt}); }
    if(cmd==="ping"){ await sock.sendMessage(from,{text:`👑 ${BOT_NAME} ALIVE! ✅\n⚡ Speed: Fast`}); }
  });
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', ()=>{ startBot(); console.log('RANA-X VIP Running on '+PORT); });
