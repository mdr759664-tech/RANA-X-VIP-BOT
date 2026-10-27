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

let mainSock = null, welcomeOn = true, autoReactOn = true;
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🥰","😍","💥","⚡","🌸","🌺","🎉","💯","✅","😂","🤣","😁","🥳","😏","🖤","🤍","💙","💚","💜","🧡","❣️","💕","💞","💓","💗","💘","💝","😘","😗","😙","😚","🤗","🤩","🤤","😋","🤫","🤭","🫣","🤔","🤨","😐","😑","😶","😏","😒","🙄","😬","😮‍💨","🤥","😌","😔","😪","😴","🤒","🥵","🥶","😵","🤯","🤠","🥳","😎","🤓","🥺","😭","😢","😤","😡","🤬","👿","💀","☠️","👻","👽","🤖","💩","👋","🤚","🖐️","✋","🖖","👌","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","👍","👎","👊","✊","👏","🙌","🫶","🤝","🙏","💪"];
const recentMsgs = [];
async function getVersion(){ try{ const {version}=await fetchLatestBaileysVersion(); return version; }catch{ return [2,3000,1015901307]; } }
async function welcome(sock,gid,p){ if(!welcomeOn) return; try{ let pp; try{ pp=await sock.profilePictureUrl(p,'image'); }catch{ pp=BOT_PIC; } let m=await sock.groupMetadata(gid); let txt=`╭───❰ 🌸 স্বাগতম 🌸 ❱───╮\n\n   👑 ${BOT_NAME} 👑\n\n   প্রিয় @${p.split('@')[0]} ভাই/আপু আপনাকে স্বাগতম 🥰\n\n┏━━━━━━━━━━━━━━━━━━┓\n┃  🏰 গ্রুপ: ${m.subject}\n┃  👥 আপনি ${m.participants.length} তম সদস্য\n┗━━━━━━━━━━━━━━━━━━┛\n╰───❰ 🌍 ভালো থাকবেন 🌍 ❱───╯`; await sock.sendMessage(gid,{image:{url:pp},caption:txt,mentions:[p]}); }catch(e){} }

app.get('/', (req,res)=>{
  res.send(`<!DOCTYPE html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><title>RANA-X-VIP-BOT</title><style>
*{box-sizing:border-box} body{margin:0;min-height:100vh;background:#080808;color:#fff;font-family:system-ui;display:flex;justify-content:center;align-items:flex-start;padding:12px}
.card{background:#121212;border:1px solid #242424;border-radius:28px;padding:22px 18px;width:100%;max-width:420px;box-shadow:0 0 60px #000}
.icon{width:80px;height:80px;margin:6px auto 12px;border-radius:20px;background:linear-gradient(135deg,#ff3a00,#ff8c00);display:flex;align-items:center;justify-content:center;overflow:hidden} .icon img{width:100%;height:100%;object-fit:cover}
h1{margin:0;text-align:center;font-size:26px} .w{color:#fff} .o{color:#ff6a00}
.sub{text-align:center;color:#777;font-size:12.5px;margin:8px 0 14px}
.conn{display:flex;justify-content:center;margin:8px 0 16px} .conn span{font-size:10px;color:#22c55e;background:#0a1a0a;border:1px solid #1a3a1a;padding:5px 12px;border-radius:20px}
.label{font-size:10px;color:#666;letter-spacing:1.2px;margin:0 2px 8px;font-weight:700}
.phoneBox{display:flex;gap:8px} .cc{width:78px;padding:14px;background:#0e0e0e;border:1.5px solid #2a2a2a;border-radius:14px;color:#fff;font-weight:700;text-align:center} .num{flex:1;padding:14px;background:#0e0e0e;border:1.5px solid #2a2a2a;border-radius:14px;color:#fff;font-weight:600;outline:none} .num:focus,.cc:focus{border-color:#ff5a00}
.valid{font-size:11px;margin:8px 2px;display:none} .valid.ok{color:#22c55e;display:block} .valid.err{color:#ef4444;display:block}
.btn{width:100%;margin-top:12px;padding:15px;background:linear-gradient(135deg,#ff4500,#ff8c00);border:none;border-radius:14px;color:#fff;font-weight:900;font-size:15px;cursor:pointer}
.box{margin-top:14px;padding:14px;border-radius:14px;display:none;justify-content:space-between;align-items:center;background:#0e0e0e;border:1.5px dashed #ff5a00} .code{font-size:28px;font-weight:900;color:#ff8c00;letter-spacing:3px}
.qrbox{margin-top:14px;padding:14px;background:#0e0e0e;border:1px solid #2a2a2a;border-radius:16px;display:none;text-align:center} .qrbox img{width:230px;height:230px;background:#fff;padding:8px;border-radius:12px}
#res{margin-top:10px;padding:10px;border-radius:10px;display:none;font-weight:700;font-size:12px}
.footer{margin-top:16px;border-top:1px solid #1e1e1e;padding-top:12px;display:flex;justify-content:space-between} .footer button,.footer a{background:none;border:none;color:#555;font-size:11px;font-weight:700;cursor:pointer} .footer a{color:#ff6a00;text-decoration:none}
</style></head><body><div class=card>
<div class=icon><img src="${BOT_PIC}"></div>
<h1><span class=w>RANA-</span><span class=o>X-VIP-</span><span class=w>BOT</span></h1>
<p class=sub>Enter WhatsApp number to link device</p>
<div class=conn><span>● CONNECTED - READY</span></div>
<p class=label>STEP 1 - YOUR NUMBER</p>
<div class=phoneBox><input id=c class=cc value="880"><input id=num class=num placeholder="1636XXXXXX" oninput="checkNum()"></div>
<div id=valid class=valid></div>
<button class=btn onclick="getPair()">⚡ Get Pair Code</button>
<div id=box class=box><span id=code class=code></span><button onclick="copyCode()" style="padding:8px 14px;background:#ff5a00;color:#fff;border:none;border-radius:8px;font-weight:800">Copy</button></div>
<div id=res></div>
<div class=footer><button onclick="showQR()">📷 Use QR Code</button><a href="${CHANNEL}" target="_blank">📢 Channel</a></div>
<div id=qrbox class=qrbox><img id=qimg src=""><p style="font-size:11px;color:#ff8c00;margin-top:8px">Scan within 60 sec</p></div>
</div>
<script>
function checkNum(){let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let v=document.getElementById('valid');if(n.length>=8){v.className='valid ok';v.innerText='✓ Valid - 880'+n;}else if(n.length>0){v.className='valid err';v.innerText='✗ Invalid';}else{v.className='valid';}}
async function getPair(){
let c=document.getElementById('c').value.replace(/[^0-9]/g,'')||'880';let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let full=c+n;let b=document.getElementById('box');let r=document.getElementById('res');
if(n.startsWith('0')){alert('0 ছাড়া লেখো - 1636XXXXXX');return;}
if(full.length<10){alert('Valid number দাও');return;}
b.style.display='none';r.style.display='block';r.innerText='⚡ Connecting...';r.style.background='#1a1a1a';r.style.color='#ff8c00';
try{let d=await (await fetch('/pair?number='+full)).json();if(d.code){document.getElementById('code').innerText=d.code;b.style.display='flex';r.style.display='none';}else{r.innerText='❌ '+d.error;}}catch(e){r.innerText='❌ Server Error - Use QR';}
}
function copyCode(){navigator.clipboard.writeText(document.getElementById('code').innerText);alert('Copied!');}
async function showQR(){document.getElementById('qrbox').style.display='block';let r=document.getElementById('res');r.style.display='block';r.innerText='Generating QR...';try{let d=await (await fetch('/qr')).json();if(d.qr){document.getElementById('qimg').src=d.qr;r.innerText='✅ Scan Now!';r.style.background='#001a00';r.style.color='#22c55e';}}catch(e){r.innerText='❌ QR Error';}}
<\/script></body></html>`);
});

app.get('/pair', async (req,res)=>{ 
  try{ 
    let num=(req.query.number||'').replace(/[^0-9]/g,''); 
    if(!num) return res.json({error:"Number missing"});
    if(num.startsWith('0')) num='88'+num;
    const PAIR_DIR='./session/PAIR-TEMP'; 
    if(fs.existsSync(PAIR_DIR)) fs.rmSync(PAIR_DIR,{recursive:true,force:true}); 
    fs.mkdirSync(PAIR_DIR,{recursive:true}); 
    const {state,saveCreds}=await useMultiFileAuthState(PAIR_DIR); 
    let version=await getVersion(); 
    const sock=makeWASocket({version,auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))},logger:pino({level:'silent'}),browser:Browsers.macOS('Desktop'),markOnlineOnConnect:false,syncFullHistory:false}); 
    sock.ev.on('creds.update',saveCreds); 
    sock.ev.on('connection.update',async(u)=>{ if(u.connection==='open'){ const MAIN='./session/RANA-SESSION'; if(fs.existsSync(MAIN)) fs.rmSync(MAIN,{recursive:true,force:true}); fs.mkdirSync(MAIN,{recursive:true}); try{fs.readdirSync(PAIR_DIR).forEach(f=>fs.copyFileSync(path.join(PAIR_DIR,f),path.join(MAIN,f)));}catch{} setTimeout(()=>startBot(),1500); }});
    await new Promise(r=>setTimeout(r,2000)); 
    let code=await sock.requestPairingCode(num); 
    code=code.match(/.{1,4}/g).join("-");
    if(!res.headersSent) res.json({code});
    setTimeout(()=>{try{sock.end();}catch{}},60000);
  }catch(e){ if(!res.headersSent) res.json({error:e.message}); } 
});

app.get('/qr', async (req,res)=>{ 
  try{ 
    const QR_DIR='./session/QR-TEMP'; 
    if(fs.existsSync(QR_DIR)) fs.rmSync(QR_DIR,{recursive:true,force:true}); 
    fs.mkdirSync(QR_DIR,{recursive:true}); 
    const {state,saveCreds}=await useMultiFileAuthState(QR_DIR); 
    let version=await getVersion(); 
    const sock=makeWASocket({version,auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))},logger:pino({level:'silent'}),browser:Browsers.macOS('Desktop')}); 
    sock.ev.on('creds.update',saveCreds); 
    let done=false;
    sock.ev.on('connection.update',async(u)=>{ 
      if(u.qr && !done){ done=true; let img=await QRCode.toDataURL(u.qr); if(!res.headersSent) res.json({qr:img}); } 
      if(u.connection==='open'){ const MAIN='./session/RANA-SESSION'; if(fs.existsSync(MAIN)) fs.rmSync(MAIN,{recursive:true,force:true}); fs.mkdirSync(MAIN,{recursive:true}); try{fs.readdirSync(QR_DIR).forEach(f=>fs.copyFileSync(path.join(QR_DIR,f),path.join(MAIN,f)));}catch{} setTimeout(()=>startBot(),1500); }
    });
  }catch(e){ if(!res.headersSent) res.json({error:e.message}); } 
});

async function startBot(){ 
  const DIR='./session/RANA-SESSION'; if(!fs.existsSync(DIR)) return; 
  const {state,saveCreds}=await useMultiFileAuthState(DIR); 
  let version=await getVersion(); 
  const sock=makeWASocket({version,auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))},logger:pino({level:'silent'}),browser:Browsers.macOS('Desktop'),markOnlineOnConnect:false,syncFullHistory:false,getMessage:async()=>undefined}); 
  sock.ev.on('creds.update',saveCreds); 
  sock.ev.on('group-participants.update',async(u)=>{ for(let p of u.participants) if(u.action=='add') await welcome(sock,u.id,p); });
  sock.ev.on('messages.upsert',async(m)=>{ 
    const msg=m.messages[0]; if(!msg.message||msg.key.fromMe) return; 
    const from=msg.key.remoteJid; const body=msg.message.conversation||msg.message.extendedTextMessage?.text||""; 
    recentMsgs.push({from,body,time:new Date().toLocaleTimeString()}); if(recentMsgs.length>800) recentMsgs.shift();
    if(autoReactOn){ try{ await sock.sendMessage(from,{react:{text:EMOJI[Math.floor(Math.random()*EMOJI.length)],key:msg.key}}); }catch{} }
    if(!body.startsWith(".")) return; let cmd=body.slice(1).trim().split(" ")[0].toLowerCase();
    if(cmd==="menu") await sock.sendMessage(from,{image:{url:BOT_PIC},caption:`👑 ${BOT_NAME}\n.menu .ping .cam .recent`});
    if(cmd==="ping") await sock.sendMessage(from,{text:`👑 ${BOT_NAME} ALIVE ✅`});
    if(cmd==="cam") await sock.sendMessage(from,{image:{url:BOT_PIC},caption:`👑 ${BOT_NAME}`});
    if(cmd==="recent") await sock.sendMessage(from,{text:recentMsgs.slice(-15).map(r=>r.body).join("\\n")});
  }); 
}
app.listen(process.env.PORT||10000,'0.0.0.0',()=>{ startBot(); console.log('RANA-X VIP Running'); });
