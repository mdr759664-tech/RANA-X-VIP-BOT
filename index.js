import express from 'express';
import baileys from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import QRCode from 'qrcode';

const makeWASocket = baileys.default;
const { useMultiFileAuthState, Browsers, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = baileys;
const app = express();
const OWNER = "8801636487523";
const BOT_NAME = "RANA-X-VIP-BOT";
const BOT_PIC = "https://i.ibb.co/4ZqDk7Yp/3d-crown-golden-logo-with-ai-generated-free-png.png";
const CHANNEL = "https://whatsapp.com/channel/0029VbDF4POH5JLyfJOmwZ3B";
let welcomeOn = true, callRejectOn = true, autoReactOn = true;
const EMOJI = ["❤️","🔥","👑","😎","✨","🎉","🌸","💖","💎","🤖"];
let mainSock = null;
let qrSock = null;
let latestQR = null;

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
  res.send(`<!DOCTYPE html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><title>RANA 2 IN 1</title><style>body{margin:0;min-height:100vh;display:flex;justify-content:center;align-items:center;background:linear-gradient(135deg,#a855f7,#7c3aed);font-family:sans-serif;padding:15px}.card{background:#fff;max-width:440px;width:100%;border-radius:28px;padding:24px;text-align:center;box-shadow:0 20px 60px #0003}.logo{width:80px;height:80px;margin:0 auto 10px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6366f1);display:flex;align-items:center;justify-content:center;font-size:40px}h1{color:#6d28d9;margin:5px}.flags{background:#f5f3ff;padding:8px;border-radius:10px;margin:8px 0}.tab{display:flex;gap:10px;margin:15px 0}.tab button{flex:1;padding:12px;border:2px solid #7c3aed;border-radius:12px;font-weight:800;cursor:pointer;background:#fff;color:#7c3aed}.tab button.active{background:#7c3aed;color:#fff}.panel{display:none}.panel.active{display:block}input{width:100%;padding:14px;border:2px solid #e9d5ff;border-radius:12px;box-sizing:border-box}.btn{width:100%;margin-top:12px;padding:14px;background:#7c3aed;color:#fff;border:none;border-radius:12px;font-weight:800;cursor:pointer}.box{margin-top:14px;padding:14px;border-radius:12px;display:none;justify-content:space-between;align-items:center;background:#dcfce7}.code{font-size:28px;font-weight:900;color:green}.qrbox{margin-top:15px;padding:15px;background:#f5f3ff;border-radius:16px;display:none}.qrbox img{width:260px;height:260px;border-radius:12px;background:#fff;padding:10px}#res{margin-top:12px;padding:12px;border-radius:10px;display:none;font-weight:700}.footer{margin-top:15px;padding:12px;background:#f9f5ff;border-radius:12px;font-size:13px;font-weight:700}</style></head><body><div class=card><div class=logo>👑</div><h1>RANA-X-VIP-BOT</h1><p style=font-weight:700>ALL COUNTRY SUPPORTED 🌍</p><div class=flags>🇧🇩 🇵🇰 🇮🇳 🇸🇦 🇦🇪 🇺🇸 🇬🇧 🇹🇷 🇲🇾 🇮🇩</div><div class=tab><button id=t1 class=active onclick="showTab('pair')">📱 Pair Code</button><button id=t2 onclick="showTab('qr')">📷 QR Code</button></div>
<div id=pairPanel class="panel active"><input id=num placeholder="8801XXXXXXXXX"><button class=btn onclick="getPair()">Generate Pair Code</button><div id=box class=box><span id=code class=code></span><button onclick="copyCode()" style="padding:8px 14px;background:#000;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer">Copy</button></div></div>
<div id=qrPanel class="panel"><p>WhatsApp > Linked Devices > Link a Device এ গিয়ে QR Scan করো</p><button class=btn onclick="getQR()">Generate QR Code</button><div id=qrbox class=qrbox><img id=qimg src=""/><p id=qrstatus style="font-weight:700;color:#7c3aed">Scan within 60 sec</p><button class=btn onclick="getQR()" style="background:#000">Refresh QR</button></div></div>
<div id=res></div><div class=footer>© 2026 RANA-X-VIP | Pair + QR 2 IN 1 | CROWN FIXED 👑</div></div>
<script>
let qrInterval=null;
function showTab(t){document.getElementById('pairPanel').classList.remove('active');document.getElementById('qrPanel').classList.remove('active');document.getElementById('t1').classList.remove('active');document.getElementById('t2').classList.remove('active');if(t==='pair'){document.getElementById('pairPanel').classList.add('active');document.getElementById('t1').classList.add('active');}else{document.getElementById('qrPanel').classList.add('active');document.getElementById('t2').classList.add('active');}}
async function getPair(){let n=document.getElementById('num').value.replace(/[^0-9]/g,'');let b=document.getElementById('box');let r=document.getElementById('res');
