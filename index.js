import express from 'express';
import makeWASocket, { useMultiFileAuthState, Browsers, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());

const OWNER_NUMBER = "8801636487523";
const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbDF4POH5JLyfJOmwZ3B";
const BOT_PIC = "https://i.ibb.co/4ZqDk7Yp/3d-crown-golden-logo-with-ai-generated-free-png.png";
const BOT_NAME = "RANA-X-VIP-BOT";
const RANA_EMOJIS = ["❤️","🔥","👑","💎","😎","🤖","✨","🌸","🎉","😍","💖","🌹"]

async function sendBeautifulWelcome(sock, groupId, participant){
  try {
    let ppUrl;
    try { ppUrl = await sock.profilePictureUrl(participant, 'image'); } catch { ppUrl = BOT_PIC; }
    let groupMeta = await sock.groupMetadata(groupId);
    let memberCount = groupMeta.participants.length;

let welcomeText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━
👑      RANA-X-VIP-BOT    v  👑
━━━━━━━━━━━━━━━━━━━━━━━━━━

🌸 আসসালামু আলাইকুম 🌸

💖 প্রিয় @${participant.split('@')[0]} 💖

🏰 ${groupMeta.subject} 🏰
পরিবারে তোমাকে স্বাগতম

━━━━━━━━━━━━━━━━━━━━━━━━━━
💫           তথ্য             💫
━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 নাম: @${participant.split('@')[0]}
👥 সদস্য: ${memberCount} তম
💐 এক্টিভ থেকো, সম্মান করো

━━━━━━━━━━━━━━━━━━━━━━━━━━
👑 Owner: +${OWNER_NUMBER}
🤖 Bot: ${BOT_NAME}
━━━━━━━━━━━━━━━━━━━━━━━━━━

📢 Channel:
${CHANNEL_LINK}

━━━━━━━━━━━━━━━━━━━━━━━━━━
    🌹 তোমাকে পেয়ে আনন্দিত 🌹
━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    await sock.sendMessage(groupId, {
      image: { url: ppUrl },
      caption: welcomeText,
      mentions: [participant]
    });
  } catch(e){ console.log(e) }
}

app.get('/', (req, res) => {
  res.send(`<html><body style="background:#000;color:#fff;text-align:center;padding:20px;font-family:sans-serif"><div style="background:#111;border:2px solid #00ff88;padding:20px;border-radius:15px;max-width:400px;margin:auto"><h1>👑 RANA-X-VIP-BOT</h1><input id="num" placeholder="8801XXXXXXXXX" style="width:90%;padding:12px;background:#222;color:#fff;border-radius:10px"/><br><br><button onclick="getPair()" style="width:95%;padding:12px;background:#00ff88;font-weight:bold;border:none;border-radius:10px">GET PAIR CODE</button><div id="res" style="font-size:28px;color:#00ff88;margin-top:15px"></div></div><script>async function getPair(){let n=document.getElementById('num').value;let r=await fetch('/pair?number='+n);let d=await r.json();if(d.code){document.getElementById('res').innerText=d.code;}}</script></body></html>`);
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session/RANA-SESSION');
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({ version, auth: state, logger: pino({level:'silent'}), browser: Browsers.macOS('Chrome') });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('group-participants.update', async (u)=>{
    for(let p of u.participants){ if(u.action=='add') await sendBeautifulWelcome(sock, u.id, p); }
  });
  sock.ev.on('messages.upsert', async (m)=>{
    try {
      const msg=m.messages[0]; if(!msg.message||msg.key.fromMe) return;
      const from=msg.key.remoteJid; const isGroup=from.endsWith('@g.us');
      if(isGroup){ let e=RANA_EMOJIS[Math.floor(Math.random()*RANA_EMOJIS.length)]; await sock.sendMessage(from,{react:{text:e,key:msg.key}}); }
    } catch(e){}
  });
}
startBot();
app.get('/pair', async (req, res) => {
  let num = req.query.number?.replace(/[^0-9]/g,'');
  if(!num) return res.json({error:'Number Dao'});
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./session/'+num);
    const sock = makeWASocket({ auth: state, logger: pino({level:'silent'}), browser: Browsers.macOS('Chrome') });
    if(!sock.authState.creds.registered){ await new Promise(r=>setTimeout(r, 2500)); let code = await sock.requestPairingCode(num); res.json({ code }); }
    sock.ev.on('creds.update', saveCreds);
    setTimeout(()=>{ try{ fs.rmSync('./session/'+num,{recursive:true,force:true}) }catch{} }, 70000);
  } catch(e){ res.json({error:'Try Again'}) }
});
app.listen(process.env.PORT || 3000, ()=> console.log('RANA-X Running'));
