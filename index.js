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

// AUTO ON BY DEFAULT
let welcomeOn = true;
let callRejectOn = true;
let autoReactOn = true;

const RANA_EMOJIS = ["❤️","🔥","👑","💎","😎","🤖","✨","🌸","🎉","😍","💖","🌹","💯","⚡","💥","🌟","⭐","🎈","🎊","💫","🥰","😘","😇","🤩","🥳","🤗","😂","🤣","😁","😃","😄","😊","☺️","🥲","😜","😝","😛","🤪","🤭","🤫","🤔","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","🤓","🧐","😕","😟","🙁","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","😤","😡","😠","🤬","💀","☠️","👻","👽","👾","💪","🙏","👍","👎","👌","✌️"];

async function sendBeautifulWelcome(sock, groupId, participant){
  if(!welcomeOn) return;
  try {
    let ppUrl;
    try {
      ppUrl = await sock.profilePictureUrl(participant, 'image');
    } catch {
      ppUrl = BOT_PIC;
    }
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
🌍 Profile Pic Soho Welcome 🌍
━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    await sock.sendMessage(groupId, { image: { url: ppUrl }, caption: welcomeText, mentions: [participant] });
  } catch(e){ console.log("Welcome Error:", e.message) }
}

app.get('/', (req, res) => {
  res.send(`<h1>${BOT_NAME} - CallReject ON - AutoReact ON - Welcome Pic ON</h1><p>Bot Live!</p><a href="/pair?number=8801">Test Pair</a><br><input id="num" placeholder="880..."><button onclick="fetch('/pair?number='+document.getElementById('num').value).then(r=>r.json()).then(d=>alert(JSON.stringify(d)))">Pair</button>`);
});

app.get('/pair', async (req, res) => {
  try {
    let num = req.query.number?.replace(/[^0-9]/g,'');
    if (!num) return res.json({ error: "Number lagbe!" });
    if (fs.existsSync('./session/RANA-SESSION')) {
        fs.rmSync('./session/RANA-SESSION', { recursive: true, force: true });
    }
    const { state, saveCreds } = await useMultiFileAuthState('./session/RANA-SESSION');
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({ version, auth: state, logger: pino({level:'silent'}), browser: Browsers.macOS('Chrome') });
    sock.ev.on('creds.update', saveCreds);
    await new Promise(r => setTimeout(r, 3000));
    let code = await sock.requestPairingCode(num);
    res.json({ code: code });
  } catch (e) {
    res.json({ error: "Retry - 10 sec por!" });
  }
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session/RANA-SESSION');
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({ version, auth: state, logger: pino({level:'silent'}), browser: Browsers.macOS('Chrome') });
  sock.ev.on('creds.update', saveCreds);

  // WELCOME WITH PROFILE PIC
  sock.ev.on('group-participants.update', async (u)=>{
    for(let p of u.participants){ if(u.action=='add') await sendBeautifulWelcome(sock, u.id, p); }
  });

  // CALL REJECT AUTO ON
  sock.ev.on('call', async (calls) => {
    if(!callRejectOn) return;
    for (let call of calls) {
      if (call.status === 'offer') {
        await sock.rejectCall(call.id, call.from);
        await sock.sendMessage(call.from, { text: `📵 *Auto Call Reject ON!* 👑 ${BOT_NAME} Call Kete Dilo! Message Dao!` });
      }
    }
  });

  sock.ev.on('messages.upsert', async (m)=>{
    try {
      const msg=m.messages[0]; if(!msg.message||msg.key.fromMe) return;
      const from=msg.key.remoteJid;
      const isGroup=from.endsWith('@g.us');
      const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
      const command = body.trim().split(/ +/)[0].toLowerCase();

      // RECENT EMOJI AUTO REACT ON
      if(isGroup && autoReactOn){
        let e=RANA_EMOJIS[Math.floor(Math.random()*RANA_EMOJIS.length)];
        await sock.sendMessage(from,{react:{text:e,key:msg.key}});
      }

      if(command === '.menu'){
let menuText = `👑 ${BOT_NAME} - 800+ MENU 👑
📵 CallReject: ${callRejectOn?'ON':'OFF'}
