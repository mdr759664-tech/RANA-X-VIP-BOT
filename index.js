import express from 'express';
import makeWASocket, { useMultiFileAuthState, Browsers, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';

const app = express();
app.use(express.json());

const OWNER_NUMBER = "8801636487523";
const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbDF4POH5JLyfJOmwZ3B";
const BOT_PIC = "https://i.ibb.co/4ZqDk7Yp/3d-crown-golden-logo-with-ai-generated-free-png.png";
const BOT_NAME = "RANA-X-VIP-BOT";

// 100 TA EMOJI - ALL COUNTRY REACT
const RANA_EMOJIS = ["❤️","🔥","👑","💎","😎","🤖","✨","🌸","🎉","😍","💖","🌹","💯","⚡","💥","🌟","⭐","🎈","🎊","💫","🥰","😘","😇","🤩","🥳","🤗","😂","🤣","😁","😃","😄","😊","☺️","🥲","😜","😝","😛","🤪","🤭","🤫","🤔","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","🤓","🧐","😕","😟","🙁","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","😤","😡","😠","🤬","💀","☠️","👻","👽","👾","💪","🙏","👍","👎","👌","✌️"];

let welcomeOn = true;
let antilinkOn = false;

async function sendBeautifulWelcome(sock, groupId, participant){
  if(!welcomeOn) return;
  try {
    let ppUrl;
    try { ppUrl = await sock.profilePictureUrl(participant, 'image'); } catch { ppUrl = BOT_PIC; }
    let groupMeta = await sock.groupMetadata(groupId);
    let memberCount = groupMeta.participants.length;
let welcomeText = `━━━━━━━━━━━━━━━━━━━━━━━━━━
👑 ${BOT_NAME} 👑
━━━━━━━━━━━━━━━━━━━━━━━━━━

🌸 আসসালামু আলাইকুম 🌸
💖 প্রিয় @${participant.split('@')[0]} 💖

🏰 ${groupMeta.subject} 🏰
পরিবারে তোমাকে স্বাগতম

━━━━━━━━━━━━━━━━━━━━━━━━━━
💫 তথ্য 💫
👤 নাম: @${participant.split('@')[0]}
👥 সদস্য: ${memberCount} তম

━━━━━━━━━━━━━━━━━━━━━━━━━━
👑 Owner: +${OWNER_NUMBER}
🤖 Bot: ${BOT_NAME}
📢 Channel: ${CHANNEL_LINK}
━━━━━━━━━━━━━━━━━━━━━━━━━━
  🌍 ALL COUNTRY SUPPORTED 🌍
━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    await sock.sendMessage(groupId, { image: { url: ppUrl }, caption: welcomeText, mentions: [participant] });
  } catch(e){}
}

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>${BOT_NAME} - ALL COUNTRY</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#f3e8ff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:15px}.card{background:#fff;max-width:420px;width:100%;border-radius:25px;padding:25px;box-shadow:0 10px 30px rgba(0,0,0,0.1);text-align:center}.logo{width:90px;height:90px;background:linear-gradient(135deg,#8b5cf6,#6366f1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 15px;font-size:45px;color:white}h1{color:#7c3aed}.btn{width:100%;padding:16px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;border:none;border-radius:15px;font-weight:bold;cursor:pointer}input{width:100%;padding:15px;border:2px solid #e9d5ff;border-radius:15px;background:#faf5ff;box-sizing:border-box} #result{margin-top:15px;padding:15px;border-radius:15px;display:none}.flag{font-size:12px;color:#8b5cf6;margin:10px 0} </style></head><body><div class="card"><div class="logo">🌍</div><h1>RANA-X-VIP-BOT</h1><p>ALL COUNTRY SUPPORTED 🌍</p><div class="flag">🇧🇩 🇵🇰 🇮🇳 🇸🇦 🇦🇪 🇺🇸 🇬🇧 🇹🇷 🇲🇾 🇮🇩 - Sob Desh Colbe!</div><input id="num" placeholder="8801636487523 - Any Country Number" /><br><br><button class="btn" onclick="getPair()">🔑 Generate Pair Code - All Country</button><div id="result"></div><br><small>© 2026 RANA-X-VIP | ALL COUNTRY BOT 📵 Call Reject ON</small></div><script>async function getPair(){let n=document.getElementById('num').value.replace(/[^0-9]/g,'');if(!n){alert('Enter Number Bhai!');return;}document.getElementById('result').style.display='block';document.getElementById('result').innerText='Generating Pair Code for '+n+'...';try{let r=await fetch('/pair?number='+n);let d=await r.json();if(d.code){document.getElementById('result').innerHTML='<b style=font-size:32px;letter-spacing:3px>'+d.code+'</b><br><small>WhatsApp > Linked Devices > Link with phone number</small>';document.getElementById('result').style.background='#dcfce7';document.getElementById('result').style.color='#15803d'}else{document.getElementById('result').innerText='❌ Error: '+ (d.error||'Try Again');document.getElementById('result').style.background='#fee2e2'}}catch(e){document.getElementById('result').innerText='❌ Server Error';document.getElementById('result').style.background='#fee2e2'}} </script></body></html>`);
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session/RANA-SESSION');
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({ version, auth: state, logger: pino({level:'silent'}), browser: Browsers.macOS('Chrome') });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('group-participants.update', async (u)=>{
    for(let p of u.participants){ if(u.action=='add') await sendBeautifulWelcome(sock, u.id, p); }
  });
  sock.ev.on('call', async (calls) => {
    for (let call of calls) {
      if (call.status === 'offer') {
        await sock.rejectCall(call.id, call.from);
        await sock.sendMessage(call.from, { text: `📵 *Auto Call Reject ON!* 🌍\n\n👑 *${BOT_NAME}* All Country Supported Bot!\n\n💬 Message dao!\n\n👑 Owner: +${OWNER_NUMBER}` });
      }
    }
  });
  sock.ev.on('messages.upsert', async (m)=>{
    try {
      const msg=m.messages[0]; if(!msg.message||msg.key.fromMe) return;
      const from=msg.key.remoteJid;
      const isGroup=from.endsWith('@g.us');
      const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
      const args = body.trim().split(/ +/);
      const command = args[0].toLowerCase();
      if(isGroup){ let e=RANA_EMOJIS[Math.floor(Math.random()*RANA_EMOJIS.length)]; await sock.sendMessage(from,{react:{text:e,key:msg.key}}); }

      if(command === '.menu' || command === 'menu'){
let menuText = `━━━━━━━━━━━━━━━━━━━━━━━━━━
👑 ${BOT_NAME} - ALL COUNTRY MENU (900+) 👑
━━━━━━━━━━━━━━━━━━━━━━━━━━

🌸 আসসালামু আলাইকুম - ${BOT_NAME} e Swagotom 🌸
🌍 ALL COUNTRY SUPPORTED - Sob Desh e Colbe!

━━━━━━━━━━━━━━━━━━━━━━━━━━
👥     GROUP ADMIN MENU     📜
━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹.menu - Ei Full Menu Dekho (900+ Char)
🔹.ping - Bot Speed & Active Check
🔹.owner - Bot Owner Info
🔹.groupinfo - Group Full Info
🔹.tagall - Group er Sobaike Tag Korbe
🔹.hidetag - Lukiye Tag (Admin)
🔹.kick @user - Member Kick
🔹.promote @user - Admin Banao
🔹.demote @user - Admin Theke Namo
🔹.link - Group Invite Link
🔹.revoke - Group Link Reset
🔹.close - Group Close (Admin Only)
🔹.open - Group Open (All Chat)

━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ AUTO SYSTEM - ALL COUNTRY
━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹.welcome on/off - Pic Soho Welcome On/Off
🔹.antilink on/off - Link Dile Auto Kick
🔹.autoreact on/off - 100 Emoji Auto React
🔹.callreject on/off - Auto Call Reject 📵
🔹 ALL COUNTRY PAIR - Jekono Desh er Number e Pair Code

━━━━━━━━━━━━━━━━━━━━━━━━━━
💎 VIP FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 100 Bosa Emoji Auto React
✅ Pic Soho Bangla Welcome
✅ Antilink - Link Pathale Kick
✅ Auto Call Reject 📵 - Call Kete Dibe
✅ TagAll - Ek Command e Sob Tag
✅ All Country Supported - 🇧🇩🇵🇰🇮🇳🇸🇦🇺🇸🇬🇧

━━━━━━━━━━━━━━━━━━━━━━━━━━
👑 Owner: +${OWNER_NUMBER}
🤖 Bot: ${BOT_NAME}
📢 Channel: ${CHANNEL_LINK}
🌍 ALL COUNTRY SUPPORTED BOT
━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        await sock.sendMessage(from, { image: { url: BOT_PIC }, caption: menuText });
      }
      if(command === '.ping'){ await sock.sendMessage(from, {text: `🏓 Pong! ${BOT_NAME} ALL COUNTRY ACTIVE 🌍\n⏱️ Fast Speed`}); }
      if(command === '.tagall' && isGroup){
        let groupMeta = await sock.groupMetadata(from);
        let members = groupMeta.participants.map(p=>p.id);
        let text = `👑 *${
