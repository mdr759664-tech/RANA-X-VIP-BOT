// ===== RANA-X-VIP-BOT - FULL index.js - VIDEO + AUDIO FINAL =====
const express = require('express')
const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, downloadContentFromMessage, DisconnectReason } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')
const axios = require('axios')
const QRCode = require('qrcode')
const { CATS, ALL_CMDS, getMenuText, getWelcomeMenu, getGoodbyeMenu, getCatMenu, handleCommand } = require('./commands')
const app = express()
const OWNER = "8801636487523"
const OWNER_NAME = "🐬⃟ᴠͥɪͣᴘͫ×͜×🇷┳◇┳𝗝♥︎‿♥︎𝗥𝗔𝗡𝗔ᯤ̸"
const BOT_NAME = "RANA-X-VIP-BOT"
const BOT_PIC = "https://i.ibb.co.com/Pz52VSWF/IMG-20261027-WA0000.jpg"
const CHANNEL = "https://whatsapp.com/channel/0029VbDF4POH5JLyfJOmwZ3B"
const CHANNEL_INVITE = "0029VbDF4POH5JLyfJOmwZ3B"
let CHANNEL_JID = ""
const CHROME = ["Ubuntu", "Chrome", "20.0.04"]
let welcomeOn = true, goodbyeOn = true, recentOn = true, autoReactOn = true
let antilinkOn = true
let warnCount = {}
let sockMain = null, isConnected = false, qrData = null
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🥰","😍","💥","⚡","🌸","🌺","🎉","💯","✅","😂","🤣","😁","🥳","😏","🖤","🤍","💙","💚","💜","🧡","❣️","💕","💞","💓","💗","💘","😘","😗","🤗","🤩","😋","🤫","🤭","🫣","🤔","😌","🥺","😭","😤","👋","🤚","👌","✌️","🤞","🫰","🤟","👍","👎","👊","👏","🙌","🫶","🤝","🙏","💪","😃","😄","😆","😉","😜","🤪","😇","🥰","😻","🙈","🙉","🙊","🐶","🐱","🦁","🐯","🦊","🐼","🌹","🌻","🍓","🍒","🍕","🍔","⚽","🎮","🎲","🎸","🎧","🚀","💎","👑","🦋","🌈","☀️","🌙","⭐","🔥","💥","🎊","🎁"]
const recentMsgs = [], recentCmds = []
const sessions = new Map()
let userBal = {}, userXp = {}
function getCountryInfo(num){ num=num.replace(/[^0-9]/g,''); const list={"880":{name:"Bangladesh",flag:"🇧🇩",code:"BD"},"91":{name:"India",flag:"🇮🇳",code:"IN"},"92":{name:"Pakistan",flag:"🇵🇰",code:"PK"},"1":{name:"USA",flag:"🇺🇸",code:"US"}}; let keys=Object.keys(list).sort((a,b)=>b.length-a.length); for(let k of keys){ if(num.startsWith(k)) return list[k] } return {name:"International",flag:"🌍",code:"INT"} }
let BOT_PIC_BUF = null
async function getBotPicBuffer(){ if(BOT_PIC_BUF) return BOT_PIC_BUF; try{ let r = await axios.get(BOT_PIC, { responseType: 'arraybuffer' }); BOT_PIC_BUF = Buffer.from(r.data); return BOT_PIC_BUF }catch{ return null } }
async function getBotThumb(){ return await getBotPicBuffer() }
async function getSenderThumb(sock, sender){ return await getBotPicBuffer() }
function vBox(txt, thumb){ return { text: txt, contextInfo: { externalAdReply: { title: "WhatsApp ✅", body: "01636487523 • Status | Contact: "+OWNER_NAME, thumbnail: BOT_PIC_BUF || null, mediaType: 1, sourceUrl: "https://whatsapp.com", renderLargerThumbnail: false, showAdAttribution: true } } } }
async function sendMenuWithChannel(sock, from, msg, thumb){
  let recentTxt = recentCmds.length ? "\n\n┏━━〔 🔥 RECENT 〕━━┓\n"+recentCmds.slice(-10).reverse().map(c=>"┃ ✦ ."+c).join("\n")+"\n┗━━━━━━━━━━━━━┛" : ""
  let menuTxt = getMenuText(OWNER_NAME, OWNER, CHANNEL)+recentTxt
  let picBuf = await getBotPicBuffer()
  try{
    if(picBuf){
      await sock.sendMessage(from, { image: picBuf, caption: menuTxt + "\n\n📢 *Channel:* "+CHANNEL, footer: "📢 View Channel বাটনে চাপ দাও 👇", buttons: [{ buttonId: "viewchannel", buttonText: { displayText: "📢 View Channel" }, type: 1 }, { buttonId: "menu", buttonText: { displayText: "📋 Menu" }, type: 1 }, { buttonId: "recent", buttonText: { displayText: "🔥 Recent" }, type: 1 }], headerType: 4, contextInfo: { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: CHANNEL_JID, newsletterName: BOT_NAME, serverMessageId: 1 }, externalAdReply: { title: "WhatsApp ✅", body: "01636487523 • Status | Contact: "+OWNER_NAME, thumbnail: picBuf, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: false, showAdAttribution: true } } }, {quoted: msg})
      return
    }
  }catch{}
  await sock.sendMessage(from, { text: menuTxt+"\n\n📢 *Channel:* "+CHANNEL, contextInfo: { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: CHANNEL_JID, newsletterName: BOT_NAME, serverMessageId: 1 }, externalAdReply: { title: "📢 View Channel", body: "RANA X VIP - Tap to View Channel", thumbnail: picBuf, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: true, showAdAttribution: true } } }, {quoted: msg})
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
'.servers{display:flex;flex-direction:column;gap:10px} .srv{padding:14px 14px;border-radius:16px;border:1.5px solid #2a2a2a;background:#181818;display:flex;justify-content:space-between;align-items:center;cursor:pointer} .srv.active{border-color:#ff5a00;background:#1f150f;box-shadow:0 0 15px #ff5a001a} .srv .left{display:flex;align-items:center;gap:10px} .dot{width:22px;height:22px;border-radius:50%;background:#222;border:1px solid #333;display:flex;align-items:center;justify-content:center;font-size:12px} .srv.active .dot{background:#ff5a00;border-color:#ff5a00} .srv b{font-size:13px} .srv small{font-size:10px;color:#666} .srv .count{font-size:11px;color:#555}' +
'.steps{display:flex;justify-content:center;gap:0;margin:20px 0;align-items:center} .step{width:36px;height:36px;border-radius:50%;background:#1a1a1a;border:1.5px solid #2a2a2a;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#555} .step.active{background:#ff5a00;color:#fff;border-color:#ff5a00;box-shadow:0 0 12px #ff5a00aa} .line{width:40px;height:1.5px;background:#2a2a2a;margin:0 -2px}' +
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
'.tg{margin-top:12px;padding:12px;border-radius:14px;background:#0e1a2a;border:1px solid #1e3a5a;text-align:center} .tg b{font-size:12px;color:#2AABEE} .tg small{font-size:11px;color:#777} .tg a{color:#2AABEE;font-weight:800;text-decoration:none}' +
'</style></head><body><div class=card>' +
'<div class=icon><img src="' + BOT_PIC + '"></div>' +
'<h1><span class=w>RANA-</span><span class=o>X-VIP-</span><span class=w>BOT</span></h1>' +
'<p class=sub>Enter your WhatsApp number to link your device. Unlimited - sobai nijer number diye bot calate parbe.</p>' +
'<div class=conn><span id=connTxt>● UNLIMITED PUBLIC BOT - '+sessions.size+' CONNECTED</span></div>' +
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
'<div class=tg><b>✈️ TELEGRAM থেকে Pair Code নাও</b><br><small>Telegram এ গিয়া <b>@RanaXVIPBot</b> কে <b>/pair 88016XXXXXXXX</b> লিখো<br><a href="https://t.me/RanaXVIPBot" target="_blank">👉 Telegram Bot খোলো</a></small></div>' +
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
    let sess = sessions.get(raw)
    if(sess && sess.connected) return res.json({error:'Ei number already CONNECTED ache!'})
    if(!sess){ sess = await startBot(raw); if(!sess || !sess.sock) return res.json({error:'Bot starting, abar chap dao'}); await new Promise(r=> setTimeout(r, 4000)) }
    let code = ""
    for(let i=0;i<3;i++){ try{ code = await sess.sock.requestPairingCode(raw); break }catch(e){ await new Promise(r=> setTimeout(r, 2000)) } }
    if(!code) return res.json({error:'Abar chap dao'})
    res.json({code: code.replace(/-/g,''), country: getCountryInfo(raw).flag+' '+getCountryInfo(raw).name})
  }catch(e){ res.json({error: e.message}) }
})
app.get('/qr', async (req,res)=>{ let num=(req.query.number||'').replace(/[^0-9]/g,''); let sess=sessions.get(num); let q=sess?.qr||qrData; if(!q) return res.json({error:'no qr'}); res.json({qr: await QRCode.toDataURL(q)}) })
app.get('/reset', async (req,res)=>{ let raw=(req.query.number||'').replace(/[^0-9]/g,''); if(raw){ let sess=sessions.get(raw); if(sess){ try{ await sess.sock.logout() }catch{}; try{ sess.sock.end() }catch{}; sessions.delete(raw) } try{ fs.rmSync('./sessions/'+raw,{recursive:true,force:true}) }catch{}; return res.json({ok:true}) } res.json({ok:true}) })
app.get('/status', (req,res)=> res.json({connected: sessions.size, totalBots: sessions.size, bots: [...sessions.keys()]}))
async function startBot(number){
  let numKey = number || OWNER
  let existing = sessions.get(numKey); if(existing && existing.sock) return existing
  let sess = { sock: null, connected: false, qr: null }; sessions.set(numKey, sess)
  try{
    if(!fs.existsSync('./sessions')) fs.mkdirSync('./sessions', {recursive:true})
    let sd = await useMultiFileAuthState('./sessions/'+numKey)
    let ver = await fetchLatestBaileysVersion()
    let sock = makeWASocket({version: ver.version, auth: {creds: sd.state.creds, keys: makeCacheableSignalKeyStore(sd.state.keys, P({level:'silent'}))}, logger: P({level:'silent'}), browser: CHROME, markOnlineOnConnect: false, syncFullHistory: false, getMessage: async ()=> undefined})
    sess.sock = sock; sockMain = sock
    sock.ev.on('creds.update', sd.saveCreds)
    sock.ev.on('connection.update', async (u)=>{
      if(u.qr){ sess.qr = u.qr; qrData = u.qr }
      if(u.connection === 'close'){ sess.connected=false; let r=u.lastDisconnect?.error?.output?.statusCode; if(r===DisconnectReason.loggedOut){ try{ fs.rmSync('./sessions/'+numKey,{recursive:true,force:true}) }catch{}; sessions.delete(numKey); return } sessions.delete(numKey); setTimeout(()=>{ startBot(numKey) }, 5000) }
      if(u.connection === 'open'){ sess.connected=true; isConnected=true; console.log('RANA-X-VIP CONNECTED: '+numKey); try{ let meta = await sock.newsletterMetadata('invite', CHANNEL_INVITE); if(meta?.id) CHANNEL_JID = meta.id }catch{} }
    })
    sock.ev.on('group-participants.update', async (anu)=>{
      try{
        let meta = await sock.groupMetadata(anu.id)
        for(let num of anu.participants){
          let ppBuf = await getBotPicBuffer()
          if(anu.action == 'add' && welcomeOn){ let txt = getWelcomeMenu(num, meta.subject, meta.participants.length, OWNER_NAME); await sock.sendMessage(anu.id, { image: ppBuf, caption: txt, mentions: [num] }) }
          if(anu.action == 'remove' && goodbyeOn){ let txt2 = getGoodbyeMenu(num, meta.subject, meta.participants.length); await sock.sendMessage(anu.id, { image: ppBuf, caption: txt2, mentions: [num] }) }
          if(anu.action == 'promote'){ await sock.sendMessage(anu.id, { image: ppBuf, caption: `🎉 অভিনন্দন @${num.split('@')[0]}! তুমি এখন Admin! 👑`, mentions: [num] }) }
        }
      }catch(e){ console.log('Welcome Err:'+e.message) }
    })
    sock.ev.on('messages.upsert', async ({messages})=>{
      for(const m of messages){
      if(!m.message || !m.key) continue
      const from = m.key.remoteJid; const isGroup = from.endsWith('@g.us'); const sender = m.key.participant || m.key.remoteJid
      const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || m.message.buttonsResponseMessage?.selectedButtonId || m.message.templateButtonReplyMessage?.selectedId || ""
      const hasAnyMsg = !!m.message
      const qCtx = m.message.extendedTextMessage?.contextInfo; const mentioned = qCtx?.mentionedJid || []
      const senderThumb = await getBotPicBuffer()
      const botThumb = senderThumb
      const sendV = async (txt) => sock.sendMessage(from, vBox(txt, botThumb), {quoted:m})
      const success = async (txt) => sock.sendMessage(from, vBox(txt.startsWith("✅")||txt.startsWith("❌") ? txt : "✅ "+txt, botThumb), {quoted:m})
      const getTarget = () => mentioned[0] || (qCtx?.participant) || null
      const needAdmin = async ()=>{ if(!isGroup){ await sendV("❌ Group e use koro!"); return false } return true }
      let btnId = m.message?.buttonsResponseMessage?.selectedButtonId || m.message?.templateButtonReplyMessage?.selectedId || ""
      if(btnId === "viewchannel"){
        await sock.sendMessage(from, { text: "📢 *RANA X VIP CHANNEL*\n\n👉 নিচের লিংকে চাপ দাও:\n"+CHANNEL+"\n\n💜 Follow করো!", contextInfo: { externalAdReply: { title: "📢 View Channel", body: "RANA X VIP Channel", thumbnail: botThumb, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: true, showAdAttribution: true } } }, {quoted: m}); continue
      }
      if(btnId === "menu"){ await sendMenuWithChannel(sock, from, m, botThumb); continue }
      if(btnId === "recent"){
        let r1 = [...recentMsgs].slice(-10).map(x=> `${x.emoji} @${x.user}: ${x.txt}`).join("\n")
        await sendV(`🔥 *RECENT*\n\n${r1||"No recent yet"}\n\n💜 ${BOT_NAME}`); continue
      }
      if(autoReactOn && hasAnyMsg && (!m.key.fromMe || isGroup)){
        try{
          let randomEmoji = EMOJI[Math.floor(Math.random()*EMOJI.length)]
          await sock.sendMessage(from, { react: { text: randomEmoji, key: m.key } })
          let showTxt = (body || "").toString().slice(0,60) || (m.message.imageMessage ? "📷 Photo" : m.message.videoMessage ? "🎥 Video" : m.message.stickerMessage ? "🎨 Sticker" : m.message.audioMessage ? "🎵 Audio" : "📩 Message")
          recentMsgs.push({ txt: showTxt, user: sender.split('@')[0], emoji: randomEmoji })
          if(recentMsgs.length>30) recentMsgs.shift()
        }catch(e){ console.log("React Err:", e.message) }
      }
      if(isGroup && antilinkOn && body && !m.key.fromMe){
        let hasLink = /https?:\/\/|www\.|chat\.whatsapp\.com|t\.me|telegram\.me|instagram\.com|facebook\.com|youtube\.com|youtu\.be|tiktok\.com/i.test(body)
        if(hasLink){
          try{
            let meta = await sock.groupMetadata(from)
            let senderInfo = meta.participants.find(p=>p.id===sender)
            let isAdmin = senderInfo?.admin
            let isBotAdmin = meta.participants.find(p=>p.id===sock.user.id)?.admin
            if(!isAdmin){
              try{ await sock.sendMessage(from, {delete:{remoteJid:from, fromMe:false, id:m.key.id, participant:sender}}) }catch{}
              warnCount[sender] = (warnCount[sender]||0) + 1
              let w = warnCount[sender]
              if(w >= 3){
                warnCount[sender] = 0
                await sock.sendMessage(from, {text:`🚫 *ANTI-LINK - KICKED!*\n\n@${sender.split('@')[0]} 3 বার Link দিছে!\n\n👑 RANA-X-VIP-BOT`, mentions:[sender]})
                if(isBotAdmin){ try{ await sock.groupParticipantsUpdate(from, [sender], "remove") }catch{ await sock.sendMessage(from, {text:`❌ Kick করতে পারি নাই! বটকে Admin দাও!`}) } }
                else{ await sock.sendMessage(from, {text:`❌ বট Admin না, Kick করতে পারলাম না! বটকে Admin দাও!`}) }
              } else {
                await sock.sendMessage(from, {text:`⚠️ *ANTI-LINK WARNING ${w}/3*\n\n@${sender.split('@')[0]} Link দিছো!\n\n❌ Group এ Link দেওয়া নিষেধ!\n⚠️ Warning: ${w}/3\n\n👑 RANA-X-VIP-BOT\n📢 Channel: ${CHANNEL}`, mentions:[sender]})
              }
              continue
            }
          }catch(e){ console.log("Antilink Err:", e.message) }
        }
      }
      if(!body || !body.startsWith('.')) continue
      const args = body.slice(1).trim().split(/ +/); const cmd = args[0].toLowerCase(); const text = args.slice(1).join(' ')
      if(recentOn){ recentCmds.push(cmd); if(recentCmds.length>20) recentCmds.shift() }
      if(cmd==='welcome' && text==='on'){ welcomeOn=true; await success("Welcome ON"); continue }
      if(cmd==='welcome' && text==='off'){ welcomeOn=false; await success("Welcome OFF"); continue }
      if(cmd==='goodbye' && text==='on'){ goodbyeOn=true; await success("Goodbye ON"); continue }
      if(cmd==='goodbye' && text==='off'){ goodbyeOn=false; await success("Goodbye OFF"); continue }
      if(cmd==='recent' && text==='on'){ recentOn=true; autoReactOn=true; await success("✅ Recent ON + Random Emoji React ON 🔥"); continue }
      if(cmd==='recent' && text==='off'){ recentOn=false; autoReactOn=false; await sendV("❌ Recent OFF + Emoji React OFF"); continue }
      if(cmd==='react' && text==='on'){ autoReactOn=true; await success("✅ Random Emoji React ON 🔥"); continue }
      if(cmd==='react' && text==='off'){ autoReactOn=false; await sendV("❌ Random Emoji React OFF"); continue }
      if(cmd==='react'){ await sendV(autoReactOn?"✅ React: ON - Random Emoji দিচ্ছে 🔥":"❌ React: OFF"); continue }
      if(cmd==='welcome'){ await sendV(welcomeOn?"✅ Welcome: ON":"❌ Welcome: OFF"); continue }
      if(cmd==='goodbye'){ await sendV(goodbyeOn?"✅ Goodbye: ON":"❌ Goodbye: OFF"); continue }
      if(cmd==='antilink' && text==='on'){ antilinkOn=true; await success("✅ Anti-Link ON - Link দিলে 3 বার Warning -> Kick"); continue }
      if(cmd==='antilink' && text==='off'){ antilinkOn=false; await success("❌ Anti-Link OFF"); continue }
      if(cmd==='antilink'){ await sendV(antilinkOn?"✅ Anti-Link: ON\nLink দিলে 3 বার Warning -> Kick":"❌ Anti-Link: OFF"); continue }
      if(cmd==='warns' || cmd==='warnlist'){
        let list = Object.entries(warnCount).filter(([k,v])=>v>0)
        if(!list.length){ await sendV("✅ কারো Warn নাই! সবাই ভালো! 💜"); continue }
        await sendV("⚠️ *WARN LIST*\n"+list.map(([id,c])=>`@${id.split('@')[0]} - ${c}/3`).join("\n"))
        continue
      }
      if(cmd==='resetwarn' || cmd==='resetwarns'){
        let t = getTarget()
        if(!t){ await sendV("❌ কাকে Reset করবো? Tag করো! Ex: .resetwarn @user"); continue }
        warnCount[t]=0
        await success(`✅ @${t.split('@')[0]} এর Warn Reset হইছে!`)
        continue
      }
      if(cmd==='warn'){
        let t = getTarget()
        if(!t){ await sendV("❌ কাকে Warn দিবা? Tag করো!"); continue }
        warnCount[t]=(warnCount[t]||0)+1
        if(warnCount[t]>=3){ warnCount[t]=0; await sock.sendMessage(from,{text:`🚫 @${t.split('@')[0]} 3 বার Warn খাইছে - KICK!`, mentions:[t]}); try{ await sock.groupParticipantsUpdate(from,[t],"remove") }catch{} }
        else{ await success(`⚠️ @${t.split('@')[0]} কে Warn দেওয়া হইছে! ${warnCount[t]}/3`) }
        continue
      }
      if(cmd==='recent' || cmd==='trending'){
        let r1 = [...recentMsgs].slice(-10).reverse().map(x=> `${x.emoji} @${x.user}: ${x.txt}`).join("\n")
        let r2 = recentCmds.slice(-10).reverse().map(c=>"┃ ✦ ."+c).join("\n")
        await sendV(`🔥 *RECENT - Random Emoji সহ*\n\n${r1||"No recent yet - এখন মেসেজ করো, Emoji আসবো!"}\n\n┏━━〔 🔥 RECENT COMMANDS 〕━━┓\n${r2||"┃ ✦ .menu"}\n┗━━━━━━━━━━━━━┛\n\n💜 ${BOT_NAME}\n💡 .recent off লিখলে Emoji বন্ধ হবে`)
        continue
      }
      if(cmd==='menu' || cmd==='allmenu' || cmd==='commands' || cmd==='list'){ await sendMenuWithChannel(sock, from, m, botThumb); continue }
      if(cmd==='channel' || cmd==='channellink' || cmd==='viewchannel' || cmd==='joinchannel' || cmd==='follow'){
        await sock.sendMessage(from, { text: "📢 *Follow Channel:*", footer: "RANA X VIP 👑💜", buttons: [{ buttonId: "viewchannel", buttonText: { displayText: "📢 View Channel" }, type: 1 }], headerType: 1, contextInfo: { externalAdReply: { title: "📢 View Channel", body: "Tap to View Channel", thumbnail: botThumb, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: true, showAdAttribution: true } } }, {quoted: m}); continue
      }
      if(cmd==='ping' || cmd==='pong' || cmd==='speed'){
        let pic = await getBotPicBuffer()
        let txt = `🏖️ PONG: ${Date.now()%200+45} Ms\n👑 Bot: ${BOT_NAME}\n👑 Owner: 01636487523\n📦 Commands: ${ALL_CMDS.length}`
        if(pic) await sock.sendMessage(from, { image: pic, caption: txt }, {quoted: m})
        else await success(txt)
        continue
      }
      if(cmd==='status' || cmd==='bot' || cmd==='alive'){
        let pic = await getBotPicBuffer()
        let txt = `╭─━─━─👑─━─━─╮\n┃ 🤖 *${BOT_NAME}* ┃\n╰─━─━─👑─━─━─╯\n\n✅ *Status:* Online 🟢\n👑 *Owner:* ${OWNER_NAME}\n📞 *Owner:* ${OWNER}\n📦 *Commands:* ${ALL_CMDS.length}+\n👥 *Connected Bots:* ${sessions.size}\n\n💜 *RANA-X-VIP-BOT*`
        if(pic) await sock.sendMessage(from, { image: pic, caption: txt }, {quoted: m})
        else await sendV(txt)
        continue
      }
      if(cmd==='owner' || cmd==='creator' || cmd==='rana'){
        let pic = await getBotPicBuffer()
        let txt = `👑 *OWNER INFO*\n\n👤 *Name:* ${OWNER_NAME}\n📞 *Number:* ${OWNER}\n📢 *Channel:* ${CHANNEL}\n\n💜 ${BOT_NAME}`
        if(pic) await sock.sendMessage(from, { image: pic, caption: txt }, {quoted: m})
        else await sendV(txt)
        continue
      }
      if(cmd==='song' || cmd==='play' || cmd==='gan' || cmd==='music' || cmd==='gaan' || cmd==='gana'){
        if(!text){ await sendV("❌ গানের নাম দে ভাই!\nEx: .song Ami Tomake Valobashi"); continue }
        await sendV("🔍 খুঁজতেছি... *"+text+"*")
        let found = false
        try{
          let servers = ["https://piped.video", "https://pipedapi.kavin.rocks", "https://pipedapi-libre.kavin.rocks"]
          let v = null, svUsed = ""
          for(let sv of servers){
            try{ let r = await axios.get(sv+"/search?q="+encodeURIComponent(text)+"&filter=videos", {timeout: 15000}); let items = r.data?.items || []; v = items[0]; if(v){ svUsed = sv; break } }catch{}
          }
          if(v){
            let vid = (v.url || "").split("watch?v=")[1] || v.id
            let st = await axios.get(svUsed+"/streams/"+vid, {timeout: 20000})
            let audios = st.data?.audioStreams || []
            audios.sort((a,b)=> (b.bitrate||0)-(a.bitrate||0))
            let audioUrl = audios[0]?.url
            if(audioUrl){
              let aud = await axios.get(audioUrl, { responseType: 'arraybuffer', timeout: 60000, headers: { 'User-Agent': 'Mozilla/5.0' } })
              await sock.sendMessage(from, { audio: Buffer.from(aud.data), mimetype: 'audio/mp4', fileName: (v.title||text)+".mp3", ptt: false, contextInfo: { externalAdReply: { title: v.title || text, body: "👑 RANA-X-VIP-BOT", thumbnail: botThumb, mediaType: 1, sourceUrl: CHANNEL } } }, {quoted: m})
              await sock.sendMessage(from, { image: botThumb, caption: `🎵 *${v.title || text}*\n👤 ${v.uploaderName || ""}\n\n👑 *RANA-X-VIP-BOT*\n▶️ উপরের Audio তে চাপ দিলেই গ্রুপে বাজবো!` }, {quoted: m})
              found = true
            }
          }
        }catch(e){ console.log("Piped song fail:", e.message) }
        if(!found){
          try{
            let r = await axios.get("https://itunes.apple.com/search?term="+encodeURIComponent(text)+"&media=music&limit=1", {timeout: 15000})
            let s = r.data?.results?.[0]
            if(s?.previewUrl){
              let aud = await axios.get(s.previewUrl, { responseType: 'arraybuffer' })
              await sock.sendMessage(from, { audio: Buffer.from(aud.data), mimetype: 'audio/mp4', fileName: s.trackName+".mp3", contextInfo: { externalAdReply: { title: s.trackName, body: "👑 RANA-X-VIP-BOT", thumbnail: botThumb, mediaType: 1, sourceUrl: CHANNEL } } }, {quoted: m})
              await sendV(`🎵 *${s.trackName}*\n👤 ${s.artistName}\n\n👑 *RANA-X-VIP-BOT*`)
              found = true
            }
          }catch(e){ console.log("iTunes fail:", e.message) }
        }
        if(!found) await sendV("❌ গান পাইলাম না! আবার লেখ:\nEx: .song Ami Tomake Valobashi\nEx: .song Kesariya Arijit Singh")
        continue
      }
      // ✅ VIDEO DILE VIDEO + AUDIO 2 TAI ASBO
      if(cmd==='video' || cmd==='vsong' || cmd==='vgan' || cmd==='vgana'){
        if(!text){ await sendV("❌ ভিডিও গানের নাম দে!\nEx: .video Ami Tomake Valobashi"); continue }
        await sendV("🎬 ভিডিও খুঁজতেছি... *"+text+"*")
        try{
          let servers = ["https://piped.video", "https://pipedapi.kavin.rocks"]
          let v = null, svUsed = ""
          for(let sv of servers){ try{ let r = await axios.get(sv+"/search?q="+encodeURIComponent(text)+"&filter=videos", {timeout: 15000}); let items = r.data?.items || []; v = items[0]; if(v){ svUsed = sv; break } }catch{} }
          if(!v){ await sendV("❌ ভিডিও পাইলাম না!"); continue }
          let vid = (v.url || "").split("watch?v=")[1] || v.id
          let st = await axios.get(svUsed+"/streams/"+vid, {timeout: 20000})
          let vids = st.data?.videoStreams || []
          let audios = st.data?.audioStreams || []
          audios.sort((a,b)=> (b.bitrate||0)-(a.bitrate||0))
          let vv = vids.find(x=>x.quality==="720p") || vids.find(x=>x.quality==="360p") || vids[0]
          if(vv?.url) await sock.sendMessage(from, { video: { url: vv.url }, caption: `🎬 *${v.title}*\n👤 ${v.uploaderName || ""}\n\n👑 *RANA-X-VIP-BOT*`, mimetype: 'video/mp4' }, {quoted: m})
          if(audios[0]?.url){
            let aud = await axios.get(audios[0].url, { responseType: 'arraybuffer', timeout: 60000, headers: { 'User-Agent': 'Mozilla/5.0' } })
            await sock.sendMessage(from, { audio: Buffer.from(aud.data), mimetype: 'audio/mp4', fileName: (v.title||text)+".mp3", contextInfo: { externalAdReply: { title: v.title || text, body: "👑 RANA-X-VIP-BOT - Audio", thumbnail: botThumb, mediaType: 1, sourceUrl: CHANNEL } } }, {quoted: m})
            await sendV(`🎵 *${v.title}*\n✅ ভিডিও + অডিও ২টাই পাইছো!\n👑 *RANA-X-VIP-BOT*`)
          }
        }catch(e){ await sendV("❌ ভিডিও আনতে পারলাম না!") }
        continue
      }
      // ✅ JE KONO VIDEO TE REPLY DIYA .audio DILE AUDIO HOIYA JAIBO
      if(cmd==='audio' || cmd==='mp3' || cmd==='toaudio' || cmd==='songaudio'){
        let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        let vidMsg = m.message.videoMessage || q?.videoMessage
        if(!vidMsg){ await sendV("❌ যেই ভিডিওরে অডিও বানাইবা, ঐ ভিডিওতে Reply দিয়া লেখ:\n.audio"); continue }
        await sendV("🎵 ভিডিও থেকে অডিও বানাইতেছি...")
        try{
          let stream = await downloadContentFromMessage(vidMsg, 'video')
          let buf = Buffer.concat([]); for await(let c of stream) buf = Buffer.concat([buf, c])
          await sock.sendMessage(from, { audio: buf, mimetype: 'audio/mp4', fileName: "RANA-X-VIP-Audio.mp3", contextInfo: { externalAdReply: { title: "RANA-X-VIP Audio", body: "👑 RANA-X-VIP-BOT", thumbnail: botThumb, mediaType: 1, sourceUrl: CHANNEL } } }, {quoted: m})
          await sendV("✅ হইছে! ভিডিও এখন অডিও হইয়া গেছে! ▶️ চাপ দিলেই বাজবো!")
        }catch(e){ await sendV("❌ অডিও বানাইতে পারলাম না! ভিডিওটা আবার পাঠাও!") }
        continue
      }
      if(cmd==='sticker' || cmd==='s' || cmd==='stiker'){
        let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        let imgMsg = m.message.imageMessage || m.message.videoMessage || q?.imageMessage || q?.videoMessage
        if(!imgMsg){ await sendV("❌ ছবি / ভিডিও দিয়া .sticker লেখ!"); continue }
        try{
          let stream = await downloadContentFromMessage(imgMsg, imgMsg.imageMessage ? 'image' : 'video')
          let buf = Buffer.concat([]); for await(let c of stream) buf = Buffer.concat([buf, c])
          await sock.sendMessage(from, { sticker: buf }, {quoted: m})
        }catch(e){ await sendV("❌ Sticker বানাইতে পারলাম না!") }
        continue
      }
      if(cmd==='toimg' || cmd==='toimage'){
        let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        let st = q?.stickerMessage
        if(!st){ await sendV("❌ Sticker এ Reply দিয়া .toimg লেখ"); continue }
        try{
          let stream = await downloadContentFromMessage(st, 'sticker'); let buf = Buffer.concat([]); for await(let c of stream) buf = Buffer.concat([buf, c])
          await sock.sendMessage(from, { image: buf, caption: "✅ Sticker -> Image\n👑 "+BOT_NAME }, {quoted: m})
        }catch(e){ await sendV("❌ Image বানাইতে পারলাম না!") }
        continue
      }
      if(cmd==='tagall' || cmd==='tag' || cmd==='all'){
        if(!isGroup){ await sendV("❌ Group এ use করো!"); continue }
        try{
          let meta = await sock.groupMetadata(from); let mem = meta.participants.map(p=>p.id)
          let txt = `📢 *TAG ALL - ${meta.subject}*\n\n${mem.map((id,i)=>`${i+1}. @${id.split('@')[0]}`).join("\n")}\n\n${text || "সবাই আসো!"}\n\n👑 ${BOT_NAME}`
          await sock.sendMessage(from, { text: txt, mentions: mem }, {quoted: m})
        }catch(e){ await sendV("❌ TagAll হইলো না!") }
        continue
      }
      if(cmd==='kick'){
        let t = getTarget(); if(!t){ await sendV("❌ কাকে Kick করবো? Tag করো!"); continue }
        try{ await sock.groupParticipantsUpdate(from, [t], "remove"); await success(`🚫 @${t.split('@')[0]} Kicked!`) }catch{ await sendV("❌ Kick করতে পারলাম না! বটকে Admin দাও!") }
        continue
      }
      if(cmd==='promote' || cmd==='admin'){
        let t = getTarget(); if(!t){ await sendV("❌ কাকে Admin করবো? Tag করো!"); continue }
        try{ await sock.groupParticipantsUpdate(from, [t], "promote"); await success(`👑 @${t.split('@')[0]} এখন Admin!`) }catch{ await sendV("❌ Promote হইলো না!") }
        continue
      }
      if(cmd==='demote'){
        let t = getTarget(); if(!t){ await sendV("❌ কাকে Demote করবো?"); continue }
        try{ await sock.groupParticipantsUpdate(from, [t], "demote"); await success(`😢 @${t.split('@')[0]} Admin থেকে সরানো হইছে`) }catch{ await sendV("❌ Demote হইলো না!") }
        continue
      }
      if(cmd==='groupinfo' || cmd==='ginfo'){
        if(!isGroup){ await sendV("❌ Group এ use করো!"); continue }
        let meta = await sock.groupMetadata(from)
        await sendV(`📋 *GROUP INFO*\n\n📛 *Name:* ${meta.subject}\n👥 *Members:* ${meta.participants.length}\n📝 *Desc:* ${meta.desc || "No Desc"}`)
        continue
      }
      if(cmd==='id' || cmd==='myid' || cmd==='jid'){
        await sendV(`🆔 *Your ID:*\n${sender}\n📱 *Number:* ${sender.split('@')[0]}\n👥 *Group ID:*\n${from}`)
        continue
      }
      if(cmd==='time' || cmd==='date'){
        let d = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', dateStyle: 'full', timeStyle: 'medium' })
        await sendV(`🕒 *TIME*\n${d}\n\n👑 ${BOT_NAME}`)
        continue
      }
      if(cmd==='joke' || cmd==='funny'){
        let jokes = ["😂 শিক্ষক: পড়া পারো না কেন?\nছাত্র: স্যার, মাথায় ঢুকে না!\nশিক্ষক: মাথায় কি ঢুকে?\nছাত্র: গান ঢুকে! 🎵","😂 বউ: তুমি আমারে ভালোবাসো?\nজামাই: হ, ফেসবুকে Like দিছি তো! 👍"]
        await sendV(`😂 *JOKE*\n\n${jokes[Math.floor(Math.random()*jokes.length)]}`)
        continue
      }
      if(cmd==='quote' || cmd==='shayari'){
        let qs = ["💜 সফলতা একদিনে আসে না, প্রতিদিনের চেষ্টায় আসে!", "🔥 হার মানা মানে শেষ না, আবার উঠে দাঁড়ানোই আসল জয়!"]
        await sendV(`💜 *QUOTE*\n\n${qs[Math.floor(Math.random()*qs.length)]}`)
        continue
      }
      if(cmd==='ai' || cmd==='gpt' || cmd==='ask'){
        if(!text){ await sendV("❌ কিছু জিজ্ঞেস কর!\nEx: .ai Bangladesh কি?"); continue }
        await sendV("🤖 AI ভাবতেছে... *"+text+"*")
        try{
          let r = await axios.get("https://api.zenzxz.my.id/api/ai/gpt4?text="+encodeURIComponent(text))
          await sendV(`🤖 *AI ANSWER*\n\n${r.data?.result || r.data?.answer || "উত্তর পাইলাম না!"}`)
        }catch{ await sendV("🤖 আমি RANA-X-VIP-BOT! তুমি বলছো: "+text) }
        continue
      }
      let done = await handleCommand({ sock, from, m, cmd, text, sender, isGroup, qCtx, mentioned, getTarget, sendV, success, senderThumb: botThumb, BOT_NAME, OWNER_NAME, OWNER, CHANNEL_LINK: CHANNEL, CHANNEL_JID, needAdmin, userBal, userXp, downloadContentFromMessage, getCatMenu, getWelcomeMenu })
      if(done) continue
      if(ALL_CMDS.includes(cmd)){ await sendV(`✅ *${cmd.toUpperCase()}*\n\nএই Command Menu তে আছে, Owner কে বলো কাজ বসাইতে।\n👑 Owner: ${OWNER}`); continue }
      }
    })
    return sess
  }catch(e){ console.log("START ERROR:", e.message); sessions.delete(numKey); return null }
}
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ""
let tgBot = null
if(TELEGRAM_TOKEN){
  try{
    const TelegramBot = require('node-telegram-bot-api')
    tgBot = new TelegramBot(TELEGRAM_TOKEN, {polling: true})
    tgBot.onText(/\/start/, (msg)=>{
      tgBot.sendMessage(msg.chat.id, `👑 *RANA-X-VIP-BOT* 👑\n\nPublic Pair Bot - সবাই নিতে পারবে!\n\n📱 Pair নিতে লেখো:\n\`/pair 88016XXXXXXXX\`\n\n✈️ Telegram থেকে Pair Code নাও, WhatsApp এ গিয়া Link করো!`, {parse_mode:'Markdown'})
    })
    tgBot.onText(/\/pair (.+)/, async (msg, match)=>{
      let raw = (match[1]||"").replace(/[^0-9]/g,'').replace(/^0+/,'')
      if(raw.startsWith('8800')) raw = '880'+raw.slice(4)
      if(!raw || raw.length < 10){ tgBot.sendMessage(msg.chat.id, "❌ সঠিক নাম্বার দাও! Ex: /pair 8801636487523"); return }
      tgBot.sendMessage(msg.chat.id, "⚡ Connecting... 10 sec wait করো...")
      try{
        let sess = sessions.get(raw)
        if(!sess){ sess = await startBot(raw); await new Promise(r=>setTimeout(r, 4000)) }
        let code = ""
        for(let i=0;i<3;i++){ try{ code = await sess.sock.requestPairingCode(raw); break }catch{ await new Promise(r=>setTimeout(r, 2000)) } }
        if(!code){ tgBot.sendMessage(msg.chat.id, "❌ আবার চাপ দাও: /pair "+raw); return }
        let c = getCountryInfo(raw)
        tgBot.sendMessage(msg.chat.id, `✅ *PAIR CODE পাইছো!* ✅\n\n📞 Number: +${raw}\n🌍 Country: ${c.flag} ${c.name}\n🔑 *Code: \`${code.replace(/-/g,'')}\`*\n\n📱 WhatsApp এ যাও:\nSettings > Linked Devices > Link a Device > Link with phone number instead > এই Code দাও\n\n👑 RANA-X-VIP-BOT`, {parse_mode:'Markdown'})
      }catch(e){ tgBot.sendMessage(msg.chat.id, "❌ Error: "+e.message) }
    })
    tgBot.onText(/\/menu|\/help/, (msg)=>{ tgBot.sendMessage(msg.chat.id, "Commands:\n/pair 88016XXXXXXXX - Pair Code নাও\n/start - Start") })
    console.log("✅ Telegram Pair Bot ON")
  }catch(e){ console.log("Telegram Err:", e.message) }
}
let PORT = process.env.PORT || 10000
app.listen(PORT,'0.0.0.0',()=>{ console.log('RANA-X VIP UNLIMITED Running on '+PORT+' | '+ALL_CMDS.length+' Commands'); try{ if(fs.existsSync('./sessions')){ for(let f of fs.readdirSync('./sessions')){ startBot(f) } } }catch{} })
