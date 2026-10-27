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
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🥰","😍","💥","⚡","🌸","🌺","🎉","💯","✅","😂","🤣","😁","🥳","😏","🖤","🤍","💙","💚","💜","🧡","❣️","💕","💞","💓","💗","💘","💝","😘","😗","😙","😚","🤗","🤩","🥰","😍","🤤","😋","🤫","🤭","🫣","🤔","🤨","😐","😑","😶","😏","😒","🙄","😬","😌","😔","😪","😴","🤒","🤕","🤮","🥵","🥶","🥴","😵","🤯","🥳","😎","🤓","🥺","😭","😢","😤","😡","🤬","👿","💀","☠️","👻","👽","🤖","💩","👋","🤚","🖐️","✋","🖖","👌","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","👍","👎","👊","✊","👏","🙌","🫶","🤝","🙏","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🧠","🫀","🫁","🦷","🦴","👀","👁️","👅","👄","🌟","💫","🎊","🎈","🎁","🎀","🌹","🌷","🌼","🍀","🌙","⭐","💎","🏆","🥇"];
const recentMsgs = [];
async function getVersion(){ try{ const {version}=await fetchLatestBaileysVersion(); return version; }catch{ return [2,3000,1015901307]; } }

// COUNTRY DETECT - PAIR 100% WORKING
function getCountryInfo(num){
  num = num.replace(/[^0-9]/g,'');
  const countries = {
    "880": {name:"Bangladesh", flag:"🇧🇩", code:"BD", browser: Browsers.macOS('Desktop')},
    "91": {name:"India", flag:"🇮🇳", code:"IN", browser: Browsers.macOS('Chrome')},
    "92": {name:"Pakistan", flag:"🇵🇰", code:"PK", browser: Browsers.windows('Chrome')},
    "966": {name:"Saudi", flag:"🇸🇦", code:"SA", browser: Browsers.macOS('Desktop')},
    "1": {name:"USA", flag:"🇺🇸", code:"US", browser: Browsers.windows('Chrome')},
    "44": {name:"UK", flag:"🇬🇧", code:"GB", browser: Browsers.windows('Edge')},
  };
  let sorted = Object.keys(countries).sort((a,b)=>b.length-a.length);
  for(let k of sorted) if(num.startsWith(k)) return countries[k];
  return {name:"International", flag:"🌍", code:"INT", browser: Browsers.macOS('Desktop')};
}

// WELCOME DESIGN - আগের মতোই সুন্দর VIP
async function welcome(sock,gid,p){ 
  if(!welcomeOn) return; 
  try{ 
    let ppUrl; try{ ppUrl=await sock.profilePictureUrl(p,'image'); }catch{ ppUrl=BOT_PIC; }
    let groupMeta = await sock.groupMetadata(gid);
    let groupName = groupMeta.subject;
    let totalMembers = groupMeta.participants.length;
    let newMemberTag = p.split('@')[0];
    let e1=EMOJI[Math.floor(Math.random()*EMOJI.length)], e2=EMOJI[Math.floor(Math.random()*EMOJI.length)];
    let welcomeText = `╭───❰ ${e1} 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 ${e2} ❱───╮
│
│  👑 𝗕𝗢𝗧: ${BOT_NAME} 👑
│
│  💖 𝐇𝐞𝐥𝐥𝐨 @${newMemberTag} 💖
│  🌸 আপনাকে স্বাগতম আমাদের পরিবারে 🌸
│
┣━━━━━━━━━━━━━━━━━━━━━━┫
┃  🏰 𝗚𝗥𝗢𝗨𝗣: ${groupName}
┃  👥 𝗠𝗘𝗠𝗕𝗘𝗥: আপনি ${totalMembers} তম সদস্য
┃  ⏰ 𝗝𝗢𝗜𝗡: ${new Date().toLocaleTimeString()} 
┃  📅 𝗗𝗔𝗧𝗘: ${new Date().toLocaleDateString()}
┣━━━━━━━━━━━━━━━━━━━━━━┫
┃  ✨ আশা করি ভালো থাকবেন ✨
┃  💬 সবাইকে সম্মান করবেন 💬
┃  🚫 খারাপ কিছু পোস্ট করবেন না 🚫
╰───❰ 🌍 𝐄𝐧𝐣𝐨𝐲 𝐓𝐡𝐞 𝐆𝐫𝐨𝐮𝐩 🌍 ❱───╯

${EMOJI.slice(0,15).join('')}`;
    await sock.sendMessage(gid,{image:{url:ppUrl},caption:welcomeText,mentions:[p]});
  }catch(e){} 
}

app.get('/', (req,res)=>{
  res.send(`<!DOCTYPE html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><title>RANA-X-VIP-BOT</title><style>
*{box-sizing:border-box} body{margin:0;min-height:100vh;background:#080808;color:#fff;font-family:system-ui;display:flex;justify-content:center;align-items:flex-start;padding:12px}
.card{background:#121212;border:1px solid #242424;border-radius:28px;padding:22px 18px;width:100%;max-width:420px;box-shadow:0 0 60px #000}
.icon{width:80px;height:80px;margin:6px auto 12px;border-radius:20px;background:linear-gradient(135deg,#ff3a00,#ff8c00);display:flex;align-items:center;justify-content:center;overflow:hidden} .icon img{width:100%;height:100%;object-fit:cover}
h1{margin:0;text-align:center;font-size:26px} .w{color:#fff} .o{color:#ff6a00}
.sub{text-align:center;color:#777;font-size:12.5px;margin:8px 0 14px;line-height:1.5}
.conn{display:flex;justify-content:center;margin:8px 0 16px} .conn span{font-size:10px;color:#22c55e;background:#0a1a0a;border:1px solid #1a3a1a;padding:5px 12px;border-radius:20px}
.row{display:flex;justify-content:space-between;align-items:center;margin:14px 2px 8px} .row b{font-size:10px;color:#555;letter-spacing:1.5px} .row button{background:none;border:none;color:#ff6a00;font-size:10px;cursor:pointer}
.servers{display:flex;flex-direction:column;gap:10px} .srv{padding:14px 14px;border-radius:16px;border:1.5px solid #2a2a2a;background:#181818;display:flex;justify-content:space-between;align-items:center;cursor:pointer} .srv.active{border-color:#ff5a00;background:#1f150f} .srv .left{display:flex;align-items:center;gap:10px} .dot{width:22px;height:22px;border-radius:50%;background:#222;border:1px solid #333;display:flex;align-items:center;justify-content:center;font-size:12px} .srv.active .dot{background:#ff5a00} .srv b{font-size:13px} .srv small{font-size:10px;color:#666} .srv .count{font-size:11px;color:#555}
.steps{display:flex;justify-content:center;gap:0;margin:20px 0;align-items:center} .step{width:36px;height:36px;border-radius:50%;background:#1a1a1a;border:1.5px solid #2a2a2a;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#555} .step.active{background:#ff5a00;color:#fff;border-color:#ff5a00} .line{width:40px;height:1.5px;background:#2a2a2a;margin:0 -2px}
.label{font-size:10px;color:#666;letter-spacing:1.2px;margin:0 2px 8px;font-weight:700}
.phoneBox{display:flex;gap:8px} .cc{width:80px;padding:14px;background:#0e0e0e;border:1.5px solid #2a2a2a;border-radius:14px;color:#fff;font-weight:700;text-align:center} .num{flex:1;padding:14px;background:#0e0e0e;border:1.5px solid #2a2a2a;border-radius:14px;color:#fff;font-weight:600;outline:none} .num:focus,.cc:focus{border-color:#ff5a00}
.valid{font-size:11px;margin:8px 2px;display:none} .valid.ok{color:#22c55e;display:block} .valid.err{color:#ef4444;display:block}
.btn{width:100%;margin-top:12px;padding:15px;background:linear-gradient(135deg,#ff4500,#ff8c00);border:none;border-radius:14px;color:#fff;font-weight:900;font-size:15px;cursor:pointer}
.box{margin-top:14px;padding:14px;border-radius:14px;display:none;justify-content:space-between;align-items:center;background:#0e0e0e;border:1.5px dashed #ff5a00} .code{font-size:28px;font-weight:900;color:#ff8c00;letter-spacing:3px}
.qrbox{margin-top:14px;padding:14px;background:#0e0e0e;border:1px solid #2a2a2a;border-radius:16px;display:none;text-align:center} .qrbox img{width:230px;height:230px;background:#fff;padding:8px;border-radius:12px}
#res{margin-top:10px;padding:10px;border-radius:10px;display:none;font-weight:700;font-size:12px}
.footer{margin-top:16px;border-top:1px solid #1e1e1e;padding-top:12px;display:flex;justify-content:space-between} .footer button,.footer a{background:none;border:none;color:#555;font-size:11px;font-weight:700;cursor:pointer} .footer a{color:#ff6a00;text-decoration:none}
</style></head><body><div class=card>
<div class=icon><img src="${BOT_PIC}"></div>
<h1><span class=w>RANA-</span><span class=o>X-VIP-</span><span class=w>BOT</span></h1>
<p class=sub>Auto Country Server • Pair Code 100% Working</p>
<div class=conn><span id=connTxt>● CONNECTED - READY</span></div>
<div class=row><b>SELECT SERVER</b><button onclick="location.reload()">↻ refresh</button></div>
<div class=servers>
<div class="srv active" id=s1><div class=left><div class=dot>●</div><div><b id=s1Name>Auto Detect</b><br><small id=s1Desc>Country Wise Server</small></div></div><div class=count>Live</div></div>
<div class=srv id=s2 onclick="showQR()"><div class=left><div class=dot>📷</div><div><b>QR Code</b><br><small>100% Working Guarantee</small></div></div><div class=count>Fast</div></div>
</div>
<div class=steps><div class="step active" id=st1>1</div><div class=line></div><div class=step id=st2>2</div><div class=line></div><div class=step id=st3>3</div></div>
<p class=label>STEP 1 - YOUR NUMBER</p>
<div class=phoneBox><input id=c class=cc value="+880" placeholder="+880"><input id=num class=num placeholder="16XXXXXXXX" oninput="checkNum()"></div>
<div id=valid class=valid></div>
<button class=btn onclick="getPair()">⚡ Get Pair Code</button>
<div id=box class=box><span id=code class=code></span><button onclick="copyCode()" style="padding:8px 14px;background:#ff5a00;color:#fff;border:none;border-radius:8px;font-weight:800">Copy</button></div>
<div id=res></div>
<div class=footer><button onclick="showQR()">📷 Use QR Code</button><a href="${CHANNEL}" target="_blank">📢 Join Channel</a></div>
<div id=qrbox class=qrbox><img id=qimg src=""><p style="font-size:11px;color:#ff8c00;margin-top:8px">Scan within 60 sec</p></div>
</div>
<script>
function checkNum(){
  let c=(document.getElementById('c').value||'').replace(/[^0-9]/g,'');
  let n=document.getElementById('num').value.replace(/[^0-9]/g,'');
  let full=c+n; let v=document.getElementById('valid');
  let info="🌍 International";
  if(full.startsWith('880')) info="🇧🇩 Bangladesh • BD Server";
  else if(full.startsWith('91')) info="🇮🇳 India • IN Server";
  else if(full.startsWith('92')) info="🇵🇰 Pakistan • PK Server";
  if(n.length>=8){v.className='valid ok';v.innerText='✓ '+info+' | Looks valid | 100% Working'; document.getElementById('s1Name').innerText=info; document.getElementById('connTxt').innerText='● '+info+' READY';}
  else if(n.length>0){v.className='valid err';v.innerText='✗ Invalid number';}else{v.className='valid';}
}
async function getPair(){
let c=(document.getElementById('c').value||'').replace(/[^0-9]/g,'')||'880';
let n=document.getElementById('num').value.replace(/[^0-9]/g,'');
let full=c+n;
let b=document.getElementById('box');let r=document.getElementById('res');
if(n.startsWith('0')){alert('0 ছাড়া লেখো');return;}
if(full.length<10){alert('Valid number dao');return;}
b.style.display='none';r.style.display='block';r.innerText='⚡ Connecting... 100% Working...';r.style.background='#1a1500';r.style.color='#ff8c00';
try{
  let d=await (await fetch('/pair?number='+full)).json();
  if(d.code){
    document.getElementById('code').innerText=d.code;
    let v=document.getElementById('valid'); v.className='valid ok'; v.innerText=d.country+' | '+d.server+' | 100% ✓';
    document.getElementById('s1Name').innerText=d.country; document.getElementById('s1Desc').innerText=d.server; document.getElementById('connTxt').innerText='● '+d.country+' CONNECTED ✓';
    b.style.display='flex';r.style.display='none';document.getElementById('st3').classList.add('active');
  }else{r.innerText='❌ '+d.error+' | Use QR';r.style.background='#2a0000';}
}catch(e){r.innerText='❌ Error | Use QR - 100% Working';}
}
function copyCode(){let t=document.getElementById('code').innerText;navigator.clipboard.writeText(t);alert('✅ Copied: '+t)}
function showQR(){document.getElementById('qrbox').style.display='block';getQR()}
async function getQR(){let img=document.getElementById('qimg');let r=document.getElementById('res');r.style.display='block';r.innerText='Generating QR...';try{let d=await (await fetch('/qr')).json();if(d.qr){img.src=d.qr;document.getElementById('qrbox').style.display='block';r.innerText='✅ Scan Now!';r.style.background='#001a00';r.style.color='#22c55e';}}catch(e){r.innerText='❌ QR Error';}}
<\/script></body></html>`);
});

app.get('/pair', async (req,res)=>{ 
  try{ 
    let num=(req.query.number||'').replace(/[^0-9]/g,''); 
    if(!num) return res.json({error:"Number required"});
    if(num.startsWith('0')) num='88'+num; 
    let country = getCountryInfo(num);
    console.log(\`🌍 PAIR: +\${num} | \${country.flag} \${country.name}\`);
    const PAIR_DIR='./session/PAIR-TEMP'; 
    if(fs.existsSync(PAIR_DIR)) fs.rmSync(PAIR_DIR,{recursive:true,force:true}); 
    fs.mkdirSync(PAIR_DIR,{recursive:true}); 
    const {state,saveCreds}=await useMultiFileAuthState(PAIR_DIR); 
    let version=await getVersion(); 
    const sock=makeWASocket({version,auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))},logger:pino({level:'silent'}),browser: country.browser,markOnlineOnConnect:false,syncFullHistory:false});
    sock.ev.on('creds.update',saveCreds); 
    sock.ev.on('connection.update',async(u)=>{ if(u.connection==='open'){ const MAIN='./session/RANA-SESSION'; if(fs.existsSync(MAIN)) fs.rmSync(MAIN,{recursive:true,force:true}); fs.mkdirSync(MAIN,{recursive:true}); try{fs.readdirSync(PAIR_DIR).forEach(f=>fs.copyFileSync(path.join(PAIR_DIR,f),path.join(MAIN,f)));}catch{} setTimeout(()=>startBot(),2000); }});
    await new Promise(r=>setTimeout(r,2500)); 
    let code=await sock.requestPairingCode(num); 
    code=code.match(/.{1,4}/g)?.join("-")||code; 
    if(!res.headersSent) res.json({code, country: \`\${country.flag} \${country.name}\`, server: \`\${country.code} Server 100% Working\`});
    setTimeout(()=>{try{sock.end();}catch{}},65000);
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
    let sent=false;
    sock.ev.on('connection.update',async(u)=>{ if(u.qr&&!sent){sent=true; let qr=await QRCode.toDataURL(u.qr); if(!res.headersSent) res.json({qr});} if(u.connection==='open'){ const MAIN='./session/RANA-SESSION'; if(fs.existsSync(MAIN)) fs.rmSync(MAIN,{recursive:true,force:true}); fs.mkdirSync(MAIN,{recursive:true}); try{fs.readdirSync(QR_DIR).forEach(f=>fs.copyFileSync(path.join(QR_DIR,f),path.join(MAIN,f)));}catch{} setTimeout(()=>startBot(),2000);} });
  }catch(e){ if(!res.headersSent) res.json({error:e.message}); } 
});

async function startBot(){ 
  const SESSION_DIR='./session/RANA-SESSION'; 
  if(!fs.existsSync(SESSION_DIR)) return; 
  const {state,saveCreds}=await useMultiFileAuthState(SESSION_DIR); 
  let version=await getVersion(); 
  const sock=makeWASocket({version,auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))},logger:pino({level:'silent'}),browser:Browsers.macOS('Desktop'),markOnlineOnConnect:false,syncFullHistory:false,getMessage: async () => undefined}); 
  mainSock=sock; 
  sock.ev.on('creds.update',saveCreds); 
  sock.ev.on('group-participants.update',async(u)=>{ for(let p of u.participants) if(u.action=='add') await welcome(sock,u.id,p); }); 
  sock.ev.on('messages.upsert',async(m)=>{ 
    const msg=m.messages[0]; if(!msg.message||msg.key.fromMe) return; 
    const from=msg.key.remoteJid; const body=msg.message.conversation||msg.message.extendedTextMessage?.text||""; 
    recentMsgs.push({from,body,time:new Date().toLocaleTimeString(), date: new Date().toLocaleDateString()}); 
    if(recentMsgs.length>800) recentMsgs.shift(); 
    if(autoReactOn){ let e=EMOJI[Math.floor(Math.random()*EMOJI.length)]; try{ await sock.sendMessage(from,{react:{text:e,key:msg.key}}); }catch{} } 
    if(!body.startsWith(".")) return; 
    let args=body.slice(1).trim().split(" "); let cmd=args[0].toLowerCase(); let arg = args[1]?.toLowerCase();
    if(cmd==="menu"){ 
      let menu=\`╭───👑 \${BOT_NAME} VIP 👑───╮
│ 🔥 Owner: +\${OWNER}
│ 🌍 Country Server Auto
│ 💯 Pair 100% Working
╰──────────────────────╯

🌸 .welcome on/off - Pic সহ Welcome
😎 .emoji on/off - 700+ Emoji
📜 .recent - 800 Messages
🤖 .ping .cam .owner
\${EMOJI.slice(0,20).join(' ')}\`; 
      await sock.sendMessage(from,{image:{url:BOT_PIC},caption:menu}); 
    } 
    if(cmd==="recent"){ 
      let limit = parseInt(args[1]) || 800; if(limit>800) limit=800;
      if(recentMsgs.length===0){ await sock.sendMessage(from,{text:"📭 0/800"}); return; }
      let sliced=recentMsgs.slice(-limit);
      let txt=\`📜 Recent \${sliced.length}/800\\n\\n\`+sliced.map((r,i)=>\`\${i+1}. \${r.from.split('@')[0]}: \${r.body.slice(0,80)}\`).join("\\n");
      if(txt.length>4000){ let ch=txt.match(/[\\s\\S]{1,4000}/g)||[]; for(let c of ch){ await sock.sendMessage(from,{text:c}); await new Promise(r=>setTimeout(r,300)); } } else await sock.sendMessage(from,{text:txt});
    }
    if(cmd==="ping") await sock.sendMessage(from,{text:\`👑 \${BOT_NAME} ALIVE ✅\\n\${recentMsgs.length}/800\\nWelcome: \${welcomeOn?'ON':'OFF'} | Emoji: \${autoReactOn?'ON':'OFF'}\`});
    if(cmd==="cam"||cmd==="pic") await sock.sendMessage(from,{image:{url:BOT_PIC},caption: BOT_NAME});
    if(cmd==="welcome"){ if(arg==="on") welcomeOn=true; else if(arg==="off") welcomeOn=false; await sock.sendMessage(from,{text: welcomeOn?"✅ Welcome ON Pic সহ সুন্দর Design":"❌ Welcome OFF"}); }
    if(cmd==="emoji"){ if(arg==="on") autoReactOn=true; else if(arg==="off") autoReactOn=false; await sock.sendMessage(from,{text: autoReactOn?"✅ Emoji ON 700+":"❌ Emoji OFF"}); }
  }); 
}
const PORT=process.env.PORT||10000; 
app.listen(PORT,'0.0.0.0',()=>{ startBot(); console.log('RANA-X VIP Running on '+PORT); });
