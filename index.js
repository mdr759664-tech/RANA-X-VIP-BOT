import express from 'express';
import makeWASocket, { useMultiFileAuthState, Browsers, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
const app = express();
const OWNER = "8801636487523";
const BOT_NAME = "RANA-X-VIP-BOT";
const BOT_PIC = "https://i.ibb.co/4ZqDk7Yp/3d-crown-golden-logo-with-ai-generated-free-png.png";
const CHANNEL = "https://whatsapp.com/channel/0029VbDF4POH5JLyfJOmwZ3B";
let welcomeOn = true, callRejectOn = true, autoReactOn = true;
const EMOJI = ["❤️","🔥","👑","😎","✨","🎉","🌸","💖","💎","🤖"];

async function welcome(sock,gid,p){
  if(!welcomeOn) return;
  try{
    let pp; try{ pp=await sock.profilePictureUrl(p,'image'); }catch{ pp=BOT_PIC; }
    let m=await sock.groupMetadata(gid);
    let txt = `━━━━━━━━━━━━━━━━━━━━
👑 ${BOT_NAME} 👑
━━━━━━━━━━━━━━━━━━━━
🌸 আসসালামু আলাইকুম 🌸
💖 প্রিয় @${p.split('@')[0]} 💖
🏰 ${m.subject} 🏰
পরিবারে তোমাকে স্বাগতম
━━━━━━━━━━━━━━━━━━━━
💫 তথ্য 💫
👤 নাম: @${p.split('@')[0]}
👥 সদস্য: ${m.participants.length} তম
🕒 সময়: ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━━━━━━━━
👑 Owner: +${OWNER}
🤖 Bot: ${BOT_NAME}
📢 Channel: ${CHANNEL}
━━━━━━━━━━━━━━━━━━━━
🌍 Profile Pic Soho Welcome 🌍
━━━━━━━━━━━━━━━━━━━━`;
    await sock.sendMessage(gid,{image:{url:pp},caption:txt,mentions:[p]});
  }catch{}
}

app.get('/', (req,res)=>{
  res.send(`<!DOCTYPE html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><title>RANA</title><style>body{margin:0;min-height:100vh;display:flex;justify-content:center;align-items:center;background:linear-gradient(135deg,#a855f7,#7c3aed,#4f46e5);font-family:sans-serif;padding:15px}.card{background:#fff;max-width:400px;width:100%;border-radius:28px;padding:28px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.3)}.logo{width:90px;height:90px;margin:0 auto 10px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6366f1);display:flex;align-items:center;justify-content:center;font-size:45px;color:#fff}h1{color:#6d28d9;font-size:22px}input{width:100%;padding:14px;border:2px solid #e9d5ff;border-radius:12px;background:#faf5ff;box-sizing:border-box}.btn{width:100%;margin-top:12px;padding:14px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;border:none;border-radius:12px;font-weight:800;cursor:pointer}#res{margin-top:12px;padding:12px;border-radius:10px;display:none;font-weight:700}</style></head><body><div class=card><div class=logo>👑</div><h1>RANA-X-VIP-BOT</h1><p style=color:#7c3aed;font-weight:700>ALL COUNTRY 🌍</p><input id=num placeholder="880..."><button class=btn onclick="getPair()">Generate Pair Code</button><div id=res></div></div><script>async function getPair(){let n=document.getElementById('num').value.replace(/[^0-9]/g,'');if(!n){alert('Number dao');return}let r=document.getElementById('res');r.style.display='block';r.innerText='Generating...';try{let d=await (await fetch('/pair?number='+n)).json();if(d.code){r.innerHTML='<b style=font-size:32px;color:green>'+d.code+'</b>';r.style.background='#dcfce7'}else{r.innerText=d.error;r.style.background='#fee2e2'}}catch{r.innerText='Error';r.style.background='#fee2e2'}}</script></body></html>`);
});

app.get('/pair', async (req,res)=>{
  try{
    let num=req.query.number?.replace(/[^0-9]/g,'');
    if(fs.existsSync('./session/RANA-SESSION')) fs.rmSync('./session/RANA-SESSION',{recursive:true,force:true});
    const {state,saveCreds}=await useMultiFileAuthState('./session/RANA-SESSION');
    const {version}=await fetchLatestBaileysVersion();
    const sock=makeWASocket({version,auth:state,logger:pino({level:'silent'}),browser:Browsers.macOS('Chrome')});
    sock.ev.on('creds.update',saveCreds);
    await new Promise(r=>setTimeout(r,3000));
    let code=await sock.requestPairingCode(num);
    res.json({code});
  }catch{ res.json({error:"10 sec por try"}); }
});

async function startBot(){
  const {state,saveCreds}=await useMultiFileAuthState('./session/RANA-SESSION');
  const {version}=await fetchLatestBaileysVersion();
  const sock=makeWASocket({version,auth:state,logger:pino({level:'silent'}),browser:Browsers.macOS('Chrome')});
  sock.ev.on('creds.update',saveCreds);
  sock.ev.on('group-participants.update', async u=>{ for(let p of u.participants) if(u.action=='add') await welcome(sock,u.id,p); });
  sock.ev.on('call', async c=>{ if(!callRejectOn) return; for(let x of c) if(x.status=='offer'){ await sock.rejectCall(x.id,x.from); } });
  sock.ev.on('messages.upsert', async m=>{
    try{
      const msg=m.messages[0]; if(!msg.message||msg.key.fromMe) return;
      const from=msg.key.remoteJid, isGroup=from.endsWith('@g.us');
      const body=msg.message.conversation||msg.message.extendedTextMessage?.text||"";
      const cmd=body.split(' ')[0].toLowerCase();
      if(isGroup&&autoReactOn){ let e=EMOJI[Math.floor(Math.random()*EMOJI.length)]; await sock.sendMessage(from,{react:{text:e,key:msg.key}}); }
      if(cmd=='.menu') await sock.sendMessage(from,{image:{url:BOT_PIC},caption:`👑 ${BOT_NAME} 800+ MENU\n📵 CallReject:${callRejectOn?'ON':'OFF'} .callreject on/off\n😍 AutoReact:${autoReactOn?'ON':'OFF'} .autoreact on/off\n👋 Welcome:${welcomeOn?'ON Pic':'OFF'} .welcome on/off\nGROUP: menu ping owner groupinfo grouplink tagall hidetag kick add promote demote\nVIP: sticker s toimg tovideo tomp3 tourl removebg hd emojimix qc fancy logo wallpaper pinterest ytsearch play song video tiktok fbdl igdl\nOwner:+${OWNER}`});
      if(cmd=='.callreject'){ if(body.includes('off')) callRejectOn=false; else callRejectOn=true; await sock.sendMessage(from,{text:`CallReject ${callRejectOn?'ON':'OFF'}`}); }
      if(cmd=='.autoreact'){ if(body.includes('off')) autoReactOn=false; else autoReactOn=true; await sock.sendMessage(from,{text:`AutoReact ${autoReactOn?'ON':'OFF'}`}); }
      if(cmd=='.welcome'){ if(body.includes('off')) welcomeOn=false; else welcomeOn=true; await sock.sendMessage(from,{text:`Welcome ${welcomeOn?'ON Pic Soho':'OFF'}`}); }
      if(cmd=='.ping') await sock.sendMessage(from,{text:'Pong!'});
      if(cmd=='.tagall'&&isGroup){ let gm=await sock.groupMetadata(from); let mem=gm.participants.map(p=>p.id); let txt=`TagAll:\n`; mem.forEach(x=>txt+=`@${x.split('@')[0]} `); await sock.sendMessage(from,{text:txt,mentions:mem}); }
    }catch{}
  });
}
const PORT=process.env.PORT||10000;
app.listen(PORT,()=>{ startBot(); });
