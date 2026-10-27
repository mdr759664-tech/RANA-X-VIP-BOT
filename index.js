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

let welcomeOn = true, autoReactOn = true;
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🥰","😍","💥","⚡","🌸","🌺","🎉","💯","✅","😂","🤣","😁","🥳","😏","🖤","🤍","💙","💚","💜","🧡","❣️","💕","💞","💓","💗","💘","💝","😘","😗","😙","😚","🤗","🤩","🥰","😍","🤤","😋","🤫","🤭","🫣","🤔","🤨","😐","😑","😶","😏","😒","🙄","😬","😌","😔","😪","😴","🤒","🤕","🤮","🥵","🥶","🥴","😵","🤯","🥳","😎","🤓","🥺","😭","😢","😤","😡","🤬","👿","💀","☠️","👻","👽","🤖","💩","👋","🤚","🖐️","✋","🖖","👌","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","👍","👎","👊","✊","👏","🙌","🫶","🤝","🙏","💪"];
const recentMsgs = [];
async function getVersion(){ try{ const v = await fetchLatestBaileysVersion(); return v.version; }catch{ return [2,3000,1015901307]; } }

function getCountryInfo(num){
  num = num.replace(/[^0-9]/g,'');
  const list = {
    "880": {name:"Bangladesh", flag:"🇧🇩", code:"BD", browser: Browsers.macOS('Desktop')},
    "91": {name:"India", flag:"🇮🇳", code:"IN", browser: Browsers.macOS('Chrome')},
    "92": {name:"Pakistan", flag:"🇵🇰", code:"PK", browser: Browsers.windows('Chrome')},
    "1": {name:"USA", flag:"🇺🇸", code:"US", browser: Browsers.windows('Chrome')},
  };
  let keys = Object.keys(list).sort(function(a,b){ return b.length - a.length; });
  for(let k of keys){ if(num.startsWith(k)) return list[k]; }
  return {name:"International", flag:"🌍", code:"INT", browser: Browsers.macOS('Desktop')};
}

async function welcome(sock,gid,p){ 
  if(!welcomeOn) return; 
  try{ 
    let ppUrl; try{ ppUrl = await sock.profilePictureUrl(p,'image'); }catch{ ppUrl = BOT_PIC; }
    let meta = await sock.groupMetadata(gid);
    let e1 = EMOJI[Math.floor(Math.random()*EMOJI.length)];
    let e2 = EMOJI[Math.floor(Math.random()*EMOJI.length)];
    let txt = '╭───❰ ' + e1 + ' WELCOME ' + e2 + ' ❱───╮\n' +
'│  👑 BOT: ' + BOT_NAME + ' 👑\n' +
'│  💖 Hello @' + p.split('@')[0] + ' 💖\n' +
'│  🌸 আপনাকে স্বাগতম আমাদের পরিবারে 🌸\n' +
'┣━━━━━━━━━━━━━━━━━━━━━━┫\n' +
'┃  🏰 GROUP: ' + meta.subject + '\n' +
'┃  👥 MEMBER: ' + meta.participants.length + ' তম সদস্য\n' +
'┃  ⏰ JOIN: ' + new Date().toLocaleTimeString() + '\n' +
'┃  📅 DATE: ' + new Date().toLocaleDateString() + '\n' +
'╰───❰ 🌍 Enjoy 🌍 ❱───╯\n\n' + EMOJI.slice(0,10).join('');
    await sock.sendMessage(gid,{image:{url:ppUrl},caption:txt,mentions:[p]});
  }catch{}
}

app.get('/', function(req,res){
  res.send('<!DOCTYPE html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><title>RANA-X-VIP-BOT</title><style>' +
'*{box-sizing:border-box} body{margin:0;min-height:100vh;background:#080808;color:#fff;font-family:system-ui;display:flex;justify-content:center;align-items:flex-start;padding:12px}' +
'.card{background:#121212;border:1px solid #242424;border-radius:28px;padding:22px 18px;width:100%;max-width:420px;box-shadow:0 0 60px #000}' +
'.icon{width:80px;height:80px;margin:6px auto 12px;border-radius:20px;background:linear-gradient(135deg,#ff3a00,#ff8c00);display:flex;align-items:center;justify-content:center;overflow:hidden} .icon img{width:100%;height:100%;object-fit:cover}' +
'h1{margin:0;text-align:center;font-size:26px} .w{color:#fff} .o{color:#ff6a00}' +
'.sub{text-align:center;color:#777;font-size:12.5px;margin:8px 0 14px;line-height:1.5}' +
'.conn{display:flex;justify-content:center;margin:8px 0 16px} .conn span{font-size:10px;color:#555;background:#1a1a1a;border:1px solid #222;padding:5px 12px;border-radius:20px;letter-spacing:1px}' +
'.row{display:flex;justify-content:space-between;align-items:center;margin:14px 2px 8px} .row b{font-size:10px;color:#555;letter-spacing:1.5px} .row button{background:none;border:none;color:#ff6a00;font-size:10px;cursor:pointer}' +
'.servers{display:flex;flex-direction:column;gap:10px} .srv{padding:14px 14px;border-radius:16px;border:1.5px solid #2a2a2a;background:#181818;display:flex;justify-content:space-between;align-items:center;cursor:pointer;transition:.2s} .srv.active{border-color:#ff5a00;background:#1f150f;box-shadow:0 0 15px #ff5a001a} .srv .left{display:flex;align-items:center;gap:10px} .dot{width:22px;height:22px;border-radius:50%;background:#222;border:1px solid #333;display:flex;align-items:center;justify-content:center;font-size:12px} .srv.active .dot{background:#ff5a00;border-color:#ff5a00} .srv b{font-size:13px} .srv small{font-size:10px;color:#666} .srv .count{font-size:11px;color:#555}' +
'.steps{display:flex;justify-content:center;gap:0;margin:20px 0;align-items:center} .step{width:36px;height:36px;border-radius:50%;background:#1a1a1a;border:1.5px solid #2a2a2a;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#555;z-index:2} .step.active{background:#ff5a00;color:#fff;border-color:#ff5a00;box-shadow:0 0 12px #ff5a00aa} .line{width:40px;height:1.5px;background:#2a2a2a;margin:0 -2px}' +
'.label{font-size:10px;color:#666;letter-spacing:1.2px;margin:0 2px 8px;font-weight:700}' +
'.phoneBox{display:flex;gap:8px} .cc{width:78px;padding:14px;background:#0e0e0e;border:1.5px solid #2a2a2a;border-radius:14px;color:#fff;font-weight:700;text-align:center} .num{flex:1;padding:14px;background:#0e0e0e;border:1.5px solid #2a2a2a;border-radius:14px;color:#fff;font-weight:600;outline:none} .num:focus,.cc:focus{border-color:#ff5a00}' +
'.valid{font-size:11px;margin:8px 2px;display:none} .valid.ok{color:#22c55e;display:block} .valid.err{color:#ef4444;display:block}' +
'.opts{display:flex;gap:12px;margin:12px 2px;flex-wrap:wrap} .opt{display:flex;align-items:center;gap:6px;font-size:11px;color:#777} .opt input{accent-color:#ff5a00}' +
'.remember{display:flex;align-items:center;gap:8px;margin:10px 2px;font-size:11px;color:#666} .remember input{accent-color:#ff5a00}' +
'.btn{width:100%;margin-top:12px;padding:15px;background:linear-gradient(135deg,#ff4500,#ff8c00);border:none;border-radius:14px;color:#fff;font-weight:900;font-size:15px;cursor:pointer;box-shadow:0 6px 22px #ff5a0040}' +
'.box{margin-top:14px;padding:14px;border-radius:14px;display:none;justify-content:space-between;align-items:center;background:#0e0e0e;border:1.5px dashed #ff5a00} .code{font-size:28px;font-weight:900;color:#ff8c00;letter-spacing:3px}' +
'.qrbox{margin-top:14px;padding:14px;background:#0e0e0e;border:1px solid #2a2a2a;border-radius:16px;display:none;text-align:center} .qrbox img{width:230px;height:230px;background:#fff;padding:8px;border-radius:12px}' +
'#res{margin-top:10px;padding:10px;border-radius:10px;display:none;font-weight:700;font-size:12px}' +
'.footer{margin-top:16px;border-top:1px solid #1e1e1e;padding-top:12px;display:flex;justify-content:space-between} .footer button,.footer a{background:none;border:none;color:#555;font-size:11px;text-decoration:none;font-weight:700;cursor:pointer} .footer a{color:#ff6a00}' +
'</style></head><body><div class=card>' +
'<div class=icon><img src="' + BOT_PIC + '"></div>' +
'<h1><span class=w>RANA-</span><span class=o>X-VIP-</span><span class=w>BOT</span></h1>' +
'<p class=sub>Enter your WhatsApp number to link your device.<br>No QR scan - no app install.</p>' +
'<div class=conn><span id=connTxt>● CONNECTING...</span></div>' +
'<div class=row><b>SELECT SERVER</b><button onclick="location.reload()">↻ refresh</button></div>' +
'<div class=servers>' +
'<div class="srv active" id=s1 onclick="sel(1)"><div class=left><div class=dot>●</div><div><b id=s1Name>heroku</b><br><small id=s1Desc>Fast • Recommended</small></div></div><div class=count>-/100</div></div>' +
'<div class=srv id=s2 onclick="sel(2)"><div class=left><div class=dot>○</div><div><b>railway</b><br><small>Backup Server</small></div></div><div class=count>-/100</div></div>' +
'</div>' +
'<div class=steps><div class="step active" id=st1>1</div><div class=line></div><div class=step id=st2>2</div><div class=line></div><div class=step id=st3>3</div></div>' +
'<p class=label>STEP 1 - YOUR NUMBER</p>' +
'<p style="font-size:11px;color:#444;margin:0 2px 8px">WhatsApp number, with country code</p>' +
'<div class=phoneBox><input id=c class=cc value="+880" placeholder="+880"><input id=num class=num placeholder="16XXXXXXXX" oninput="checkNum()"></div>' +
'<div id=valid class=valid></div>' +
'<div class=opts><label class=opt><input type=checkbox id=sound checked> Enable sound</label><label class=opt><input type=checkbox id=video> Video on</label></div>' +
'<label class=remember><input type=checkbox id=remember checked> Remember this number on this device</label>' +
'<button class=btn onclick="getPair()">⚡ Get Pair Code</button>' +
'<div id=box class=box><span id=code class=code></span><button onclick="copyCode()" style="padding:8px 14px;background:#ff5a00;color:#fff;border:none;border-radius:8px;font-weight:800">Copy</button></div>' +
'<div id=res></div>' +
'<div class=footer><button onclick="showQR()">📷 Use QR Code</button><a href="' + CHANNEL + '" target="_blank">📢 Join Channel</a></div>' +
'<div id=qrbox class=qrbox><img id=qimg src=""><p style="font-size:11px;color:#ff8c00;margin-top:8px">Scan within 60 sec</p></div>' +
'</div>' +
'<script>' +
'function sel(n){' +
'  document.getElementById("s1").classList.toggle("active", n==1);' +
'  document.getElementById("s2").classList.toggle("active", n==2);' +
'  document.querySelectorAll(".dot")[0].innerText=n==1?"●":"○";' +
'  document.querySelectorAll(".dot")[1].innerText=n==2?"●":"○";' +
'}' +
'function checkNum(){' +
'  let c=document.getElementById("c").value.replace(/[^0-9]/g,"");' +
'  let n=document.getElementById("num").value.replace(/[^0-9]/g,"");' +
'  let full=c+n; let v=document.getElementById("valid");' +
'  let info="";' +
'  if(full.startsWith("880")) info="🇧🇩 Bangladesh";' +
'  else if(full.startsWith("91")) info="🇮🇳 India";' +
'  else if(full.startsWith("92")) info="🇵🇰 Pakistan";' +
'  if(n.length>=8){v.className="valid ok"; v.innerText="✓ Looks valid "+info+" | 100% Working"; document.getElementById("connTxt").innerText="● "+info+" CONNECTED"; document.getElementById("s1Name").innerText=info+" • heroku"; document.getElementById("st1").classList.add("active"); document.getElementById("st2").classList.add("active");}' +
'  else if(n.length>0){v.className="valid err"; v.innerText="✗ Invalid number";} else{v.className="valid";}' +
'}' +
'async function getPair(){' +
'let c=(document.getElementById("c").value||"").replace(/[^0-9]/g,"")||"880";' +
'let n=document.getElementById("num").value.replace(/[^0-9]/g,"");' +
'let full=c+n;' +
'let b=document.getElementById("box");let r=document.getElementById("res");' +
'if(n.startsWith("0")){alert("0 ছাড়া লেখো");return;}' +
'if(full.length<10){alert("Valid number dao");return;}' +
'b.style.display="none";r.style.display="block";r.innerText="⚡ Connecting...";r.style.background="#1a1a1a";r.style.color="#ff8c00";' +
'try{' +
'  let d=await (await fetch("/pair?number="+full)).json();' +
'  if(d.code){document.getElementById("code").innerText=d.code; let v=document.getElementById("valid"); v.className="valid ok"; v.innerText="✓ "+d.country+" | "+d.server+" | 100% Working"; b.style.display="flex"; r.style.display="none"; document.getElementById("st3").classList.add("active"); if(document.getElementById("sound").checked){let a=new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_b9bd4170e8.mp3"); a.play().catch(()=>{});} }' +
'  else{r.innerText="❌ "+d.error; r.style.background="#2a0000";}' +
'}catch(e){r.innerText="❌ Server Error - Use QR";}' +
'}' +
'function copyCode(){let t=document.getElementById("code").innerText; navigator.clipboard.writeText(t); alert("✅ Copied: "+t);}' +
'function showQR(){document.getElementById("qrbox").style.display="block"; getQR();}' +
'async function getQR(){let img=document.getElementById("qimg"); let r=document.getElementById("res"); r.style.display="block"; r.innerText="Generating QR..."; try{let d=await (await fetch("/qr")).json(); if(d.qr){img.src=d.qr; document.getElementById("qrbox").style.display="block"; r.innerText="✅ Scan Now!"; r.style.background="#001a00"; r.style.color="#22c55e";}}catch(e){r.innerText="❌ QR Error";}}' +
'<\/script></body></html>');
});

app.get('/pair', async function(req,res){
  try{
    let num = (req.query.number || '').replace(/[^0-9]/g,'');
    if(!num) return res.json({error:"Number required"});
    if(num.startsWith('0')) num = '88' + num;
    let country = getCountryInfo(num);
    console.log('PAIR: +' + num + ' | ' + country.flag + ' ' + country.name);
    let PAIR_DIR = './session/PAIR-TEMP';
    if(fs.existsSync(PAIR_DIR)) fs.rmSync(PAIR_DIR,{recursive:true,force:true});
    fs.mkdirSync(PAIR_DIR,{recursive:true});
    let sd = await useMultiFileAuthState(PAIR_DIR);
    let version = await getVersion();
    let sock = makeWASocket({version: version, auth: {creds: sd.state.creds, keys: makeCacheableSignalKeyStore(sd.state.keys, pino({level:'silent'}))}, logger: pino({level:'silent'}), browser: country.browser, markOnlineOnConnect: false});
    sock.ev.on('creds.update', sd.saveCreds);
    sock.ev.on('connection.update', async function(u){
      if(u.connection === 'open'){
        let MAIN = './session/RANA-SESSION';
        if(fs.existsSync(MAIN)) fs.rmSync(MAIN,{recursive:true,force:true});
        fs.mkdirSync(MAIN,{recursive:true});
        try{ fs.readdirSync(PAIR_DIR).forEach(function(f){ fs.copyFileSync(path.join(PAIR_DIR,f), path.join(MAIN,f)); }); }catch{}
        setTimeout(function(){ startBot(); }, 2000);
      }
    });
    await new Promise(function(r){ setTimeout(r, 2500); });
    let code = await sock.requestPairingCode(num);
    code = code.match(/.{1,4}/g).join('-') || code;
    if(!res.headersSent) res.json({code: code, country: country.flag + ' ' + country.name, server: country.code + ' Server 100% Working'});
    setTimeout(function(){ try{ sock.end(); }catch{} }, 65000);
  }catch(e){ if(!res.headersSent) res.json({error: e.message}); }
});

app.get('/qr', async function(req,res){
  try{
    let QR_DIR = './session/QR-TEMP';
    if(fs.existsSync(QR_DIR)) fs.rmSync(QR_DIR,{recursive:true,force:true});
    fs.mkdirSync(QR_DIR,{recursive:true});
    let sd = await useMultiFileAuthState(QR_DIR);
    let version = await getVersion();
    let sock = makeWASocket({version: version, auth: {creds: sd.state.creds, keys: makeCacheableSignalKeyStore(sd.state.keys, pino({level:'silent'}))}, logger: pino({level:'silent'}), browser: Browsers.macOS('Desktop')});
    sock.ev.on('creds.update', sd.saveCreds);
    let sent = false;
    sock.ev.on('connection.update', async function(u){
      if(u.qr && !sent){ sent = true; let qr = await QRCode.toDataURL(u.qr); if(!res.headersSent) res.json({qr: qr}); }
      if(u.connection === 'open'){
        let MAIN = './session/RANA-SESSION';
        if(fs.existsSync(MAIN)) fs.rmSync(MAIN,{recursive:true,force:true});
        fs.mkdirSync(MAIN,{recursive:true});
        try{ fs.readdirSync(QR_DIR).forEach(function(f){ fs.copyFileSync(path.join(QR_DIR,f), path.join(MAIN,f)); }); }catch{}
        setTimeout(function(){ startBot(); }, 2000);
      }
    });
  }catch(e){ if(!res.headersSent) res.json({error: e.message}); }
});

async function startBot(){
  let SESSION_DIR = './session/RANA-SESSION';
  if(!fs.existsSync(SESSION_DIR)) return;
  let sd = await useMultiFileAuthState(SESSION_DIR);
  let version = await getVersion();
  let sock = makeWASocket({version: version, auth: {creds: sd.state.creds, keys: makeCacheableSignalKeyStore(sd.state.keys, pino({level:'silent'}))}, logger: pino({level:'silent'}), browser: Browsers.macOS('Desktop'), markOnlineOnConnect: false, getMessage: async function(){ return undefined; }});
  sock.ev.on('creds.update', sd.saveCreds);
  sock.ev.on('group-participants.update', async function(u){ for(let p of u.participants){ if(u.action === 'add') await welcome(sock, u.id, p); } });
  sock.ev.on('messages.upsert', async function(m){
    let msg = m.messages[0];
    if(!msg.message || msg.key.fromMe) return;
    let from = msg.key.remoteJid;
    let body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    recentMsgs.push({from: from, body: body, time: new Date().toLocaleTimeString()});
    if(recentMsgs.length > 800) recentMsgs.shift();
    if(autoReactOn){ try{ let e = EMOJI[Math.floor(Math.random()*EMOJI.length)]; await sock.sendMessage(from,{react:{text:e,key:msg.key}}); }catch{} }
    if(!body.startsWith('.')) return;
    let args = body.slice(1).trim().split(' ');
    let cmd = args[0].toLowerCase();
    let arg = args[1] ? args[1].toLowerCase() : '';
    if(cmd === 'menu'){
      let menu = '╭───👑 ' + BOT_NAME + ' VIP 👑───╮\n' +
'│ 🔥 Owner: +' + OWNER + '\n' +
'│ 🌍 Country Auto Server\n' +
'│ 💯 Pair 100% Working\n' +
'╰──────────────────────╯\n\n' +
'🌸 .welcome on/off - Pic সহ Welcome (সুন্দর Design)\n' +
'😎 .emoji on/off - 700+ Emoji\n' +
'📜 .recent - 800 Messages\n' +
'🤖 .ping .cam .owner\n\n' + EMOJI.slice(0,15).join(' ');
      await sock.sendMessage(from,{image:{url:BOT_PIC},caption:menu});
    }
    if(cmd === 'recent'){
      let limit = parseInt(args[1]) || 800;
      if(limit > 800) limit = 800;
      if(recentMsgs.length === 0){ await sock.sendMessage(from,{text:'📭 0/800'}); return; }
      let sliced = recentMsgs.slice(-limit);
      let txt = '📜 Recent ' + sliced.length + '/800\n\n' + sliced.map(function(r,i){ return (i+1) + '. ' + r.from.split('@')[0] + ': ' + r.body.slice(0,80); }).join('\n');
      await sock.sendMessage(from,{text: txt.slice(0,4000)});
    }
    if(cmd === 'ping') await sock.sendMessage(from,{text:'👑 ' + BOT_NAME + ' ALIVE ✅\n' + recentMsgs.length + '/800'});
    if(cmd === 'cam' || cmd === 'pic') await sock.sendMessage(from,{image:{url:BOT_PIC},caption: BOT_NAME});
    if(cmd === 'welcome'){ if(arg === 'on') welcomeOn = true; else if(arg === 'off') welcomeOn = false; await sock.sendMessage(from,{text: welcomeOn ? '✅ Welcome ON Pic সহ সুন্দর Design' : '❌ Welcome OFF'}); }
    if(cmd === 'emoji'){ if(arg === 'on') autoReactOn = true; else if(arg === 'off') autoReactOn = false; await sock.sendMessage(from,{text: autoReactOn ? '✅ Emoji ON 700+' : '❌ Emoji OFF'}); }
  });
}

let PORT = process.env.PORT || 10000;
app.listen(PORT,'0.0.0.0',function(){ startBot(); console.log('RANA-X VIP Running on ' + PORT); });
