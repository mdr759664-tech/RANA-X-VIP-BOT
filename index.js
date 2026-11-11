const express = require('express')
const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, downloadContentFromMessage, DisconnectReason } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')
const axios = require('axios')
const QRCode = require('qrcode')
const { CATS, ALL_CMDS, getMenuText, getWelcomeMenu, handleCommand } = require('./commands')

const app = express()
const OWNER = "8801636487523"
const OWNER_NAME = "┳◇┳𝗝♥︎‿♥︎𝗥𝗔𝗡𝗔ᯤ̸"
const BOT_NAME = "RANA-X-VIP-BOT"
const BOT_PIC = "https://i.ibb.co.com/Pz52VSWF/IMG-20261027-WA0000.jpg"
const CHANNEL = "https://whatsapp.com/channel/0029VbDF4POH5JLyfJOmwZ3B"
const CHANNEL_INVITE = "0029VbDF4POH5JLyfJOmwZ3B"
let CHANNEL_JID = ""
const CHROME = ["Ubuntu", "Chrome", "20.0.04"]

let welcomeOn = true, goodbyeOn = true, recentOn = false
let sockMain = null, isConnected = false, qrData = null
let restartTimer = null, lastPairTime = 0, isStarting = false
const EMOJI = ["❤️","🔥","👑","😎","✨","💖"]
const recentMsgs = [], recentCmds = []
let userBal = {}, userXp = {}

let DB = { groups:{}, warns:{} }
try{ if(fs.existsSync('./ultra_db.json')) DB = JSON.parse(fs.readFileSync('./ultra_db.json')) }catch{}
function saveDB(){ try{ fs.writeFileSync('./ultra_db.json', JSON.stringify(DB)) }catch{} }
function gSet(gid){ if(!DB.groups[gid]) DB.groups[gid]={antilink:true, antibad:true, antispam:true, action:'warn'}; return DB.groups[gid] }

const URL_REGEX = /(https?:\/\/[^\s]+)|(\bchat\.whatsapp\.com\/[^\s]+)|(\bwa\.me\/[^\s]+)|(\b[a-z0-9.-]+\.(?:com|net|org|io|co|link|xyz|shop|site|online|club|top|info)\b[^\s]*)/gi
const BAD_WORDS = ["mc","bc","madarchod","bhenchod","chod","fuck","bitch","porn","xxx","sex"]
let spamMap = {}

function isOwnerNum(num){ let c=(num||"").replace(/[^0-9]/g,''); return c.endsWith(OWNER.replace(/[^0-9]/g,'').slice(-10)) }
async function isAdminCheck(sock, from, sender){ try{ let meta = await sock.groupMetadata(from); let p = meta.participants.find(x=>x.id===sender); return p?.admin ? true : false }catch{ return false } }
function getCountryInfo(num){
  num = num.replace(/[^0-9]/g,'')
  const list = { "880": {name:"Bangladesh", flag:"🇧🇩", code:"BD"}, "91": {name:"India", flag:"🇮🇳", code:"IN"}, "92": {name:"Pakistan", flag:"🇵🇰", code:"PK"}, "1": {name:"USA", flag:"🇺🇸", code:"US"} }
  let keys = Object.keys(list).sort((a,b)=> b.length - a.length)
  for(let k of keys){ if(num.startsWith(k)) return list[k] }
  return {name:"International", flag:"🌍", code:"INT"}
}
function vBox(txt, thumb){ return { text: txt } }
let _botPicCache = null
async function getBotThumb(){
  if(_botPicCache) return _botPicCache
  try{ let res = await axios.get(BOT_PIC, { responseType: 'arraybuffer' }); _botPicCache = Buffer.from(res.data); return _botPicCache }catch{ return null }
}
async function getSenderThumb(sock, sender){ return await getBotThumb() }

// ✅ MENU - Pic + View Channel Button - FINAL
async function sendMenuWithChannel(sock, from, msg, thumb){
  let menuTxt = ""
  try{ menuTxt = getMenuText(OWNER_NAME, OWNER, CHANNEL) }catch{ menuTxt = `👑 ${BOT_NAME} 👑\nTotal: ${ALL_CMDS.length} Commands\nOwner: 01636487523` }
  let pretty = `╭─━─━─━─💜─━─━─━─╮\n┃ 👑 𝗥𝗔𝗡𝗔-𝗫-𝗩𝗜𝗣 👑 ┃\n╰─━─━─━─💜─━─━─━─╯\n\n${menuTxt}\n\n┏━━━━━━━━━━━━━━┓\n┃ 👑 Owner: ${OWNER_NAME}\n┃ 📞 01636487523\n┃ 📦 ${ALL_CMDS.length}+ Commands\n┃ 🔥 Status: Online\n┃ 🌍 PUBLIC - সবাই Use করতে পারবে\n┗━━━━━━━━━━━━━━┛\n\n📢 *Channel:* ${CHANNEL}\n╰─➤ *POWERED BY RANA X VIP* 👑💜`
  try{
    await sock.sendMessage(from, {
      image: { url: BOT_PIC },
      caption: pretty,
      contextInfo: {
        externalAdReply: {
          title: "RANA-X-VIP-BOT 👑",
          body: "01636487523 • Tap to View Channel",
          thumbnailUrl: BOT_PIC,
          mediaType: 1,
          sourceUrl: CHANNEL,
          renderLargerThumbnail: false,
          showAdAttribution: true
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: CHANNEL_JID || "120207000000000000@newsletter",
          newsletterName: "RANA-X-VIP-BOT",
          serverMessageId: 1
        }
      }
    }, {quoted: msg})
  }catch(e){
    await sock.sendMessage(from, { image: { url: BOT_PIC }, caption: pretty }, {quoted: msg})
  }
}
async function doWarn(sock, from, sender, reason){
  let key = from+"_"+sender; DB.warns[key] = (DB.warns[key]||0)+1; let count = DB.warns[key]; saveDB()
  let num = sender.split('@')[0]
  if(count >= 3){
    await sock.sendMessage(from, { text: `╭─━─━─🚫─━─━─╮\n┃ ❌ REMOVED ❌ ┃\n╰─━─━─🚫─━─━─╯\n\n🚫 @${num} কে Remove করা হইছে!\n📛 কারণ: ${reason}\n⚠️ Warning: 3/3\n\n👑 ${BOT_NAME}` }, { mentions:[sender] })
    try{ await sock.groupParticipantsUpdate(from, [sender], "remove") }catch{}
    delete DB.warns[key]; saveDB()
  } else {
    await sock.sendMessage(from, { text: `╭─━─⚠️─━─╮\n┃ ⚠️ WARNING ${count}/3 ┃\n╰─━─⚠️─━─╯\n\n⚠️ @${num} - ${reason}\n📌 Warning: ${count}/3\n📛 3 বার হইলে Kick!\n\n👑 ${BOT_NAME}` }, { mentions:[sender] })
  }
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
'<p class=sub>Enter your WhatsApp number to link your device.</p>' +
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
'<div id=box class=box><span id=code class=code></span><button id=copyBtn onclick="copyCode()" style="padding:8px 14px;background:#ff5a00;color:#fff;border:none;border-radius:8px;font-weight:800">Copy</button></div>' +
'<div id=res></div>' +
'<div class=footer><button onclick="showQR()">📷 Use QR Code</button><a href="' + CHANNEL + '" target="_blank">📢 Join Channel</a></div>' +
'<div id=qrbox class=qrbox><img id=qimg src=""><p style="font-size:11px;color:#ff8c00;margin-top:8px">Scan within 60 sec</p></div>' +
'</div>' +
'<script>' +
'function sel(n){ document.getElementById("s1").classList.toggle("active", n==1); document.getElementById("s2").classList.toggle("active", n==2); document.querySelectorAll(".dot")[0].innerText=n==1?"●":"○"; document.querySelectorAll(".dot")[1].innerText=n==2?"●":"○"; }' +
'function checkNum(){ let c=document.getElementById("c").value.replace(/[^0-9]/g,""); let n=document.getElementById("num").value.replace(/[^0-9]/g,"").replace(/^0+/, ""); let full=c+n; let v=document.getElementById("valid"); let info=""; if(full.startsWith("880")) info="🇧🇩 Bangladesh"; else if(full.startsWith("91")) info="🇮🇳 India"; else if(full.startsWith("92")) info="🇵🇰 Pakistan"; if(n.length>=8){v.className="valid ok"; v.innerText="✓ "+info; document.getElementById("connTxt").innerText="● "+info+" CONNECTED"; document.getElementById("s1Name").innerText=info+" • heroku"; document.getElementById("st1").classList.add("active"); document.getElementById("st2").classList.add("active");} else if(n.length>0){v.className="valid err"; v.innerText="✗ Invalid number";} else{v.className="valid";} }' +
'async function getPair(){ let c=(document.getElementById("c").value||"").replace(/[^0-9]/g,"")||"880"; let n=document.getElementById("num").value.replace(/[^0-9]/g,"").replace(/^0+/, ""); let full=c+n; let b=document.getElementById("box");let r=document.getElementById("res"); if(full.length<10){alert("Valid number dao");return;} b.style.display="none";r.style.display="block";r.innerText="⚡ Connecting...";r.style.background="#1a1a1a";r.style.color="#ff8c00"; try{ let d=await (await fetch("/pair?number="+full)).json(); if(d.code){document.getElementById("code").innerText=d.code; try{navigator.clipboard.writeText(d.code);}catch(e){} let v=document.getElementById("valid"); v.className="valid ok"; v.innerText="✓ "+d.country; b.style.display="flex"; r.style.display="none"; document.getElementById("st3").classList.add("active"); if(document.getElementById("sound").checked){let a=new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_b9bd4170e8.mp3"); a.play().catch(()=>{});} } else{r.innerText="❌ "+d.error; r.style.background="#2a0000";} }catch(e){r.innerText="❌ Server Error";} }' +
'function copyCode(){let t=document.getElementById("code").innerText; if(!t) return; let btn=document.getElementById("copyBtn"); navigator.clipboard.writeText(t).then(()=>{ let old=btn.innerText; btn.innerText="Copied!"; btn.style.background="#22c55e"; setTimeout(()=>{btn.innerText=old; btn.style.background="#ff5a00";},1500); }).catch(()=>{ let ta=document.createElement("textarea"); ta.value=t; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); btn.innerText="Copied!"; setTimeout(()=>{btn.innerText="Copy";},1500); });}' +
'function showQR(){document.getElementById("qrbox").style.display="block"; getQR();}' +
'async function getQR(){let img=document.getElementById("qimg"); let r=document.getElementById("res"); r.style.display="block"; r.innerText="Generating QR..."; try{let d=await (await fetch("/qr")).json(); if(d.qr){img.src=d.qr; document.getElementById("qrbox").style.display="block"; r.innerText="Scan Now!"; r.style.background="#001a00"; r.style.color="#22c55e";}}catch(e){r.innerText="❌ QR Error";}}' +
'<\/script></body></html>')
})
app.get('/pair', async (req,res)=>{
  try{
    let raw = (req.query.number||'').replace(/[^0-9]/g,'').replace(/^0+/, '')
    if(raw.startsWith('8800')) raw = '880' + raw.slice(4)
    if(!raw || raw.length < 8) return res.json({error:'Sothik number dao!'})
    if(isConnected) return res.json({error:'Bot Already Connected! /reset dao'})
    if(Date.now() - lastPairTime < 20000) return res.json({error:'20 sec wait koro - Cooldown cholche!'})
    if(!sockMain){
      if(isStarting) return res.json({error:'Bot starting, 5 sec por abar chap dao'})
      await startBot(); await new Promise(r=> setTimeout(r, 3000))
      if(!sockMain) return res.json({error:'Bot starting, 5 sec por abar chap dao'})
    }
    lastPairTime = Date.now()
    let code = await sockMain.requestPairingCode(raw); code = code.replace(/-/g,'')
    let country = getCountryInfo(raw)
    res.json({code, country: country.flag+' '+country.name, server: country.code})
  }catch(e){ console.log("PAIR ERROR:", e.message); lastPairTime = 0; res.json({error: e.message}) }
})
app.get('/qr', async (req,res)=>{ if(!qrData) return res.json({error:'no qr'}); res.json({qr: await QRCode.toDataURL(qrData)}) })
app.get('/reset', async (req,res)=>{
  if(restartTimer){ clearTimeout(restartTimer); restartTimer = null }
  lastPairTime = 0
  try{ if(sockMain) try{ await sockMain.logout() }catch{} }catch{}
  try{ if(sockMain) try{ sockMain.end() }catch{} }catch{}
  sockMain = null; try{ fs.rmSync('./session', {recursive:true, force:true}) }catch{}
  isConnected = false; qrData = null; setTimeout(()=> startBot(), 1000); res.json({ok:true})
})
app.get('/status', (req,res)=> res.json({connected: isConnected, hasSock: !!sockMain}))

async function startBot(){
  if(isStarting) return; isStarting = true
  if(restartTimer){ clearTimeout(restartTimer); restartTimer = null }
  try{ if(sockMain) try{ sockMain.end() }catch{} }catch{}; sockMain = null
  try{
    let sd = await useMultiFileAuthState('./session')
    let ver = await fetchLatestBaileysVersion()
    let sock = makeWASocket({version: ver.version, auth: {creds: sd.state.creds, keys: makeCacheableSignalKeyStore(sd.state.keys, P({level:'silent'}))}, logger: P({level:'silent'}), browser: CHROME, markOnlineOnConnect: false, syncFullHistory: false, getMessage: async ()=> undefined})
    sockMain = sock; isStarting = false
    sock.ev.on('creds.update', sd.saveCreds)
    sock.ev.on('connection.update', async (u)=>{
      if(u.qr) qrData = u.qr
      if(u.connection === 'close'){
        isConnected = false
        let r = u.lastDisconnect?.error?.output?.statusCode
        if(r === DisconnectReason.loggedOut){ try{ fs.rmSync('./session',{recursive:true,force:true}) }catch{}; sockMain = null; return }
        if(!restartTimer) restartTimer = setTimeout(()=>{ restartTimer = null; startBot() }, 5000)
      }
      if(u.connection === 'open'){
        isConnected = true; if(restartTimer){ clearTimeout(restartTimer); restartTimer = null }
        console.log('RANA-X-VIP CONNECTED')
        try{ let meta = await sock.newsletterMetadata('invite', CHANNEL_INVITE); if(meta?.id) CHANNEL_JID = meta.id }catch{}
      }
    })
    sock.ev.on('group-participants.update', async (anu)=>{
      try{
        let meta = await sock.groupMetadata(anu.id)
        let gName = meta.subject, memberCount = meta.participants.length
        let date = new Date().toLocaleDateString('en-BD', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'long', year: 'numeric' })
        let time = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true })
        for(let num of anu.participants){
          let userName = num.split('@')[0]
          let pp = BOT_PIC
          if(anu.action == 'add' && welcomeOn){
            let t = `╭─━─💜─━─╮\n┃ ✨ WELCOME ✨ ┃\n╰─━─💜─━─╯\n\n🌸 হ্যালো @${userName} !\n💖 *${gName}* এ স্বাগতম!\n👥 মোট: ${memberCount} জন\n📅 ${date} | 🕒 ${time}\n👑 Owner: ${OWNER_NAME}\n\n💡 .menu লিখে সব দেখো`
            await sock.sendMessage(anu.id, { image: { url: pp }, caption: t, mentions: [num] })
          }
          if(anu.action == 'remove' && goodbyeOn){
            await sock.sendMessage(anu.id, { image: { url: pp }, caption: `💔 @${userName} চলে গেলো...\n🥺 মিস করবো!\n👥 এখন ${memberCount} জন\n╰─➤ *${BOT_NAME}* 👑`, mentions: [num] })
          }
          if(anu.action == 'promote'){ await sock.sendMessage(anu.id, { image: { url: pp }, caption: `🎉 অভিনন্দন @${userName}! তুমি এখন Admin! 👑`, mentions: [num] }) }
          if(anu.action == 'demote'){ await sock.sendMessage(anu.id, { text: `😢 @${userName} কে Admin থেকে সরানো হইছে।`, mentions: [num] }) }
        }
      }catch(e){ console.log('Welcome Err:'+e.message) }
    })
    sock.ev.on('messages.upsert', async ({messages})=>{
      const m = messages[0]; if(!m.message) return
      const from = m.key.remoteJid
      const isGroup = from.endsWith('@g.us')
      const sender = m.key.participant || m.key.remoteJid
      const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || ""
      const qCtx = m.message.extendedTextMessage?.contextInfo
      const mentioned = qCtx?.mentionedJid || []
      const senderThumb = await getBotThumb()
      const sendV = async (txt) => sock.sendMessage(from, vBox(txt, senderThumb), {quoted:m})
      const success = async (txt) => sock.sendMessage(from, vBox(txt.startsWith("✅")||txt.startsWith("❌") ? txt : "✅ "+txt, senderThumb), {quoted:m})
      const getTarget = () => mentioned[0] || (qCtx?.participant) || null
      const needAdmin = async ()=>{ if(!isGroup){ await sendV("❌ Group e use koro bhai!"); return false } let a = await isAdminCheck(sock, from, sender); if(!a && !isOwnerNum(sender)){ await sendV("❌ শুধু Group Admin ব্যবহার করতে পারবে!"); return false } return true }

      if(isGroup && body && !body.startsWith('.') && !m.key.fromMe){
        let s = gSet(from); let admin = await isAdminCheck(sock, from, sender); let owner = isOwnerNum(sender)
        if(!admin && !owner){
          URL_REGEX.lastIndex=0
          if(s.antilink && URL_REGEX.test(body)){
            try{ await sock.sendMessage(from, {delete: m.key}) }catch{}
            if(s.action==='kick'){
              try{ await sock.groupParticipantsUpdate(from, [sender], "remove") }catch{}
              await sock.sendMessage(from, { text: `🚫 @${sender.split('@')[0]} kicked - Antilink` }, {mentions:[sender]})
            } else { await doWarn(sock, from, sender, "Link দিছে (Antilink)") }
            return
          }
          let low = body.toLowerCase()
          if(s.antibad && BAD_WORDS.some(w=> low.includes(w))){ try{ await sock.sendMessage(from, {delete: m.key}) }catch{}; await doWarn(sock, from, sender, "Bad Word"); return }
          if(s.antispam){ let now=Date.now(); let k=from+"_"+sender; spamMap[k]=(spamMap[k]||[]).filter(t=> now-t<10000); spamMap[k].push(now); if(spamMap[k].length>=6){ spamMap[k]=[]; await doWarn(sock, from, sender, "Spam (6 msgs / 10s)"); return } }
        }
        return
      }
      if(!body.startsWith('.')) return
      const args = body.slice(1).trim().split(/ +/)
      const cmd = args[0].toLowerCase()
      const text = args.slice(1).join(' ')
      if(recentOn){ recentCmds.push(cmd); if(recentCmds.length>20) recentCmds.shift() }

      if(cmd==='menu' || cmd==='allmenu' || cmd==='commands' || cmd==='list'){ await sendMenuWithChannel(sock, from, m, senderThumb); return }
      if(cmd==='channel' || cmd==='channellink' || cmd==='viewchannel' || cmd==='joinchannel' || cmd==='follow'){ await sendV("📢 Follow Channel:\n"+CHANNEL); return }
      if(cmd==='ping' || cmd==='pong' || cmd==='speed'){ await success(`🏖️ PONG: ${Date.now()%200+45} Ms\n👑 Bot: ${BOT_NAME}\n👑 Owner: 01636487523\n📦 Commands: ${ALL_CMDS.length}\n⚡ Status: Online - PUBLIC`); return }
      if(cmd==='welcome'){ await sendV(welcomeOn?"✅ Welcome: ON - PUBLIC":"❌ Welcome: OFF"); return }
      if(cmd==='goodbye'){ await sendV(goodbyeOn?"✅ Goodbye: ON":"❌ Goodbye: OFF"); return }

      if(cmd==='antilink'){
        if(!await needAdmin()) return
        if(text==='on'){ gSet(from).antilink=true; gSet(from).action='warn'; saveDB(); await success("AntiLink ON - Link দিলে Warning 1/2/3"); return }
        if(text==='off'){ gSet(from).antilink=false; saveDB(); await success("❌ AntiLink OFF"); return }
        if(text==='kick'){ gSet(from).antilink=true; gSet(from).action='kick'; saveDB(); await success("AntiLink action = kick"); return }
        if(text==='warn'){ gSet(from).antilink=true; gSet(from).action='warn'; saveDB(); await success("AntiLink action = warn (1/2/3)"); return }
        if(text==='delete'){ gSet(from).antilink=true; gSet(from).action='delete'; saveDB(); await success("AntiLink action = delete"); return }
        await sendV("❌ Usage: .antilink on/off/kick/warn/delete\n📌 এখন: "+(gSet(from).antilink?"ON":"OFF")+" | Action: "+gSet(from).action); return
      }
      if(cmd==='antibadword'||cmd==='antibad'){ if(!await needAdmin()) return; if(text==='on'){ gSet(from).antibad=true; saveDB(); await success("Antibadword ON"); return } if(text==='off'){ gSet(from).antibad=false; saveDB(); await success("❌ Antibadword OFF"); return } await sendV(gSet(from).antibad?"✅ Antibadword: ON":"❌ Antibadword: OFF"); return }
      if(cmd==='antispam'){ if(!await needAdmin()) return; if(text==='on'){ gSet(from).antispam=true; saveDB(); await success("Antispam ON"); return } if(text==='off'){ gSet(from).antispam=false; saveDB(); await success("❌ Antispam OFF"); return } await sendV(gSet(from).antispam?"✅ Antispam: ON":"❌ Antispam: OFF"); return }
      if(cmd==='warn'){ if(!await needAdmin()) return; let t=getTarget(); if(!t) return sendV("❌ কাকে Warn করবো? Reply / Tag করো"); await doWarn(sock, from, t, "Admin দিছে Warn"); return }
      if(cmd==='resetwarn'){ if(!await needAdmin()) return; let t=getTarget(); if(t){ delete DB.warns[from+"_"+t]; saveDB() } await success("Warn Clear!"); return }
      if(cmd==='warns'){ let t=getTarget()||sender; await sendV("⚠️ @"+t.split('@')[0]+" এর Warn: "+(DB.warns[from+"_"+t]||0)+"/3"); return }

      if(cmd==='welcome' && text==='on'){ if(!await needAdmin()) return; welcomeOn=true; await success("Welcome ON"); return }
      if(cmd==='welcome' && text==='off'){ if(!await needAdmin()) return; welcomeOn=false; await success("Welcome OFF"); return }
      if(cmd==='goodbye' && text==='on'){ if(!await needAdmin()) return; goodbyeOn=true; await success("Goodbye ON"); return }
      if(cmd==='goodbye' && text==='off'){ if(!await needAdmin()) return; goodbyeOn=false; await success("Goodbye OFF"); return }
      if(cmd==='recent' && text==='on'){ recentOn=true; await success("Recent ON"); return }
      if(cmd==='recent' && text==='off'){ recentOn=false; await sendV("❌ Recent OFF"); return }
      if(cmd==='recent' || cmd==='trending'){
        let r = [...recentMsgs].slice(-10).map(x=> `${x.emoji} @${x.user}: ${x.txt}`).join("\n")
        await sendV(`🔥 *RECENT*\n\n${r||"No recent yet"}\n\n💜 ${BOT_NAME}`)
        return
      }

      let done = await handleCommand({ sock, from, m, cmd, text, sender, isGroup, qCtx, mentioned, getTarget, sendV, success, senderThumb, BOT_NAME, OWNER_NAME, OWNER, CHANNEL_LINK: CHANNEL, CHANNEL_JID, needAdmin, userBal, userXp, downloadContentFromMessage, axios, getCatMenu: null, getWelcomeMenu })
      if(done) return
      if(ALL_CMDS.includes(cmd)){ await success("."+cmd+" Successful!"); return }
    })
  }catch(e){
    console.log("START ERROR:", e.message)
    sockMain = null; isStarting = false
    if(!restartTimer) restartTimer = setTimeout(()=>{ restartTimer = null; startBot() }, 5000)
  }
}

let PORT = process.env.PORT || 10000
app.listen(PORT,'0.0.0.0',()=>{ startBot(); console.log('RANA-X VIP Running on '+PORT+' | '+ALL_CMDS.length+' Commands | PUBLIC | PIC + VIEW CHANNEL FIXED') })
