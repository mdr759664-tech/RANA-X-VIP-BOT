// ===== RANA-X-VIP-BOT - FULL index.js - RANDOM EMOJI REACT FIXED =====
const express = require('express')
const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, downloadContentFromMessage, DisconnectReason } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')
const axios = require('axios')
const QRCode = require('qrcode')
const { CATS, ALL_CMDS, getMenuText, getWelcomeMenu, getGoodbyeMenu, getCatMenu, handleCommand } = require('./commands')
const app = express()
const OWNER = "8801636487523"
const OWNER_NAME = "RANA"
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
// ✅ RANDOM EMOJI - অনেক গুলা, প্রতিবার আলাদা আসবো
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🥰","😍","💥","⚡","🌸","🌺","🎉","💯","✅","😂","🤣","😁","🥳","😏","🖤","🤍","💙","💚","💜","🧡","❣️","💕","💞","💓","💗","💘","😘","😗","🤗","🤩","😋","🤫","🤭","🫣","🤔","😌","🥺","😭","😤","👋","🤚","👌","✌️","🤞","🫰","🤟","👍","👎","👊","👏","🙌","🫶","🤝","🙏","💪","😃","😄","😆","😉","😜","🤪","😇","🥰","😻","🙈","🙉","🙊","🐶","🐱","🦁","🐯","🦊","🐼","🌹","🌻","🍓","🍒","🍕","🍔","⚽","🎮","🎲","🎸","🎧","🚀","💎","👑","🦋","🌈","☀️","🌙","⭐","🔥","💥","🎊","🎁"]
const recentMsgs = [], recentCmds = []
const sessions = new Map()
let userBal = {}, userXp = {}
function getCountryInfo(num){ num=num.replace(/[^0-9]/g,''); const list={"880":{name:"Bangladesh",flag:"🇧🇩",code:"BD"},"91":{name:"India",flag:"🇮🇳",code:"IN"},"92":{name:"Pakistan",flag:"🇵🇰",code:"PK"},"1":{name:"USA",flag:"🇺🇸",code:"US"}}; let keys=Object.keys(list).sort((a,b)=>b.length-a.length); for(let k of keys){ if(num.startsWith(k)) return list[k] } return {name:"International",flag:"🌍",code:"INT"} }
function vBox(txt, thumb){ return { text: txt, contextInfo: { externalAdReply: { title: "WhatsApp ✅", body: "01636487523 • Status | Contact: "+OWNER_NAME, thumbnail: thumb || null, mediaType: 1, sourceUrl: "https://whatsapp.com", renderLargerThumbnail: false, showAdAttribution: true } } } }
async function getSenderThumb(sock, sender){ try{ let url = await sock.profilePictureUrl(sender, 'image'); let res = await axios.get(url, { responseType: 'arraybuffer' }); return Buffer.from(res.data) }catch{ try{ let r2 = await axios.get(BOT_PIC, { responseType: 'arraybuffer' }); return Buffer.from(r2.data) }catch{ return null } } }
async function getBotPicBuffer(){ try{ let r = await axios.get(BOT_PIC, { responseType: 'arraybuffer' }); return Buffer.from(r.data) }catch{ return null } }
async function sendMenuWithChannel(sock, from, msg, thumb){
  let recentTxt = recentCmds.length ? "\n\n┏━━〔 🔥 RECENT 〕━━┓\n"+recentCmds.slice(-10).reverse().map(c=>"┃ ✦ ."+c).join("\n")+"\n┗━━━━━━━━━━━━━┛" : ""
  let menuTxt = getMenuText(OWNER_NAME, OWNER, CHANNEL)+recentTxt
  let picBuf = null
  try{ let r = await axios.get(BOT_PIC, {responseType:'arraybuffer'}); picBuf = Buffer.from(r.data) }catch{ picBuf = thumb }
  try{
    if(picBuf){
      await sock.sendMessage(from, { image: picBuf, caption: menuTxt + "\n\n📢 *Channel:* "+CHANNEL, footer: "📢 View Channel বাটনে চাপ দাও 👇", buttons: [{ buttonId: "viewchannel", buttonText: { displayText: "📢 View Channel" }, type: 1 }, { buttonId: "menu", buttonText: { displayText: "📋 Menu" }, type: 1 }, { buttonId: "recent", buttonText: { displayText: "🔥 Recent" }, type: 1 }], headerType: 4, contextInfo: { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: CHANNEL_JID, newsletterName: BOT_NAME, serverMessageId: 1 }, externalAdReply: { title: "WhatsApp ✅", body: "01636487523 • Status | Contact: "+OWNER_NAME, thumbnail: thumb, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: false, showAdAttribution: true } } }, {quoted: msg})
      return
    }
  }catch{}
  await sock.sendMessage(from, { text: menuTxt+"\n\n📢 *Channel:* "+CHANNEL, contextInfo: { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: CHANNEL_JID, newsletterName: BOT_NAME, serverMessageId: 1 }, externalAdReply: { title: "📢 View Channel", body: "RANA X VIP - Tap to View Channel", thumbnail: picBuf || thumb, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: true, showAdAttribution: true } } }, {quoted: msg})
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
          let ppBuf = null; try{ let u = await sock.profilePictureUrl(num, 'image'); let r = await axios.get(u, { responseType: 'arraybuffer' }); ppBuf = Buffer.from(r.data) }catch{ ppBuf = await getBotPicBuffer() }
          if(anu.action == 'add' && welcomeOn){ let txt = getWelcomeMenu(num, meta.subject, meta.participants.length, OWNER_NAME); if(ppBuf) await sock.sendMessage(anu.id, { image: ppBuf, caption: txt, mentions: [num] }); else await sock.sendMessage(anu.id, { image: { url: BOT_PIC }, caption: txt, mentions: [num] }) }
          if(anu.action == 'remove' && goodbyeOn){ let txt2 = getGoodbyeMenu(num, meta.subject, meta.participants.length); if(ppBuf) await sock.sendMessage(anu.id, { image: ppBuf, caption: txt2, mentions: [num] }); else await sock.sendMessage(anu.id, { image: { url: BOT_PIC }, caption: txt2, mentions: [num] }) }
          if(anu.action == 'promote'){ await sock.sendMessage(anu.id, { image: { url: BOT_PIC }, caption: `🎉 অভিনন্দন @${num.split('@')[0]}! তুমি এখন Admin! 👑`, mentions: [num] }) }
        }
      }catch(e){ console.log('Welcome Err:'+e.message) }
    })
    sock.ev.on('messages.upsert', async ({messages})=>{
      const m = messages[0]; if(!m.message || !m.key) return
      const from = m.key.remoteJid; const isGroup = from.endsWith('@g.us'); const sender = m.key.participant || m.key.remoteJid
      // ✅ BODY - সব টাইপের মেসেজ ধরবো
      const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || m.message.buttonsResponseMessage?.selectedButtonId || m.message.templateButtonReplyMessage?.selectedId || m.message.stickerMessage ? "sticker" : "" || m.message.audioMessage ? "audio" : "" || m.message.documentMessage ? "doc" : ""
      const hasAnyMsg = !!m.message
      const qCtx = m.message.extendedTextMessage?.contextInfo; const mentioned = qCtx?.mentionedJid || []
      const senderThumb = await getSenderThumb(sock, sender)
      const sendV = async (txt) => sock.sendMessage(from, vBox(txt, senderThumb), {quoted:m})
      const success = async (txt) => sock.sendMessage(from, vBox(txt.startsWith("✅")||txt.startsWith("❌") ? txt : "✅ "+txt, senderThumb), {quoted:m})
      const getTarget = () => mentioned[0] || (qCtx?.participant) || null
      const needAdmin = async ()=>{ if(!isGroup){ await sendV("❌ Group e use koro!"); return false } return true }
      // ✅ BUTTON CLICK
      let btnId = m.message?.buttonsResponseMessage?.selectedButtonId || m.message?.templateButtonReplyMessage?.selectedId || ""
      if(btnId === "viewchannel"){
        await sock.sendMessage(from, { text: "📢 *RANA X VIP CHANNEL*\n\n👉 নিচের লিংকে চাপ দাও:\n"+CHANNEL+"\n\n💜 Follow করো!", contextInfo: { externalAdReply: { title: "📢 View Channel", body: "RANA X VIP Channel", thumbnail: senderThumb, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: true, showAdAttribution: true } } }, {quoted: m}); return
      }
      if(btnId === "menu"){ await sendMenuWithChannel(sock, from, m, senderThumb); return }
      if(btnId === "recent"){
        let r1 = [...recentMsgs].slice(-10).map(x=> `${x.emoji} @${x.user}: ${x.txt}`).join("\n")
        await sendV(`🔥 *RECENT*\n\n${r1||"No recent yet"}\n\n💜 ${BOT_NAME}`); return
      }
      // ✅ RANDOM EMOJI REACT + RECENT - সবার আগে, সব মেসেজে - এটাই আসল ফিক্স!
      if(autoReactOn && hasAnyMsg && !m.key.fromMe){
        try{
          let randomEmoji = EMOJI[Math.floor(Math.random()*EMOJI.length)]
          await sock.sendMessage(from, { react: { text: randomEmoji, key: m.key } })
          // Recent এ save - Emoji সহ
          let showTxt = (body || "").toString().slice(0,60) || (m.message.imageMessage ? "📷 Photo" : m.message.videoMessage ? "🎥 Video" : m.message.stickerMessage ? "🎨 Sticker" : m.message.audioMessage ? "🎵 Audio" : "📩 Message")
          recentMsgs.push({ txt: showTxt, user: sender.split('@')[0], emoji: randomEmoji })
          if(recentMsgs.length>30) recentMsgs.shift()
        }catch(e){ console.log("React Err:", e.message) }
      }
      // ✅ ANTI-LINK - 3 বার Warning -> Kick
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
                await sock.sendMessage(from, {text:`🚫 *ANTI-LINK - KICKED!*\n\n@${sender.split('@')[0]} 3 বার Link দিছে!\n1st: ⚠️ Warning 1/3\n2nd: ⚠️ Warning 2/3\n3rd: 🚫 KICK!\n\n👑 RANA-X-VIP-BOT`, mentions:[sender]})
                if(isBotAdmin){ try{ await sock.groupParticipantsUpdate(from, [sender], "remove") }catch{ await sock.sendMessage(from, {text:`❌ Kick করতে পারি নাই! বটকে Admin দাও!`}) } }
                else{ await sock.sendMessage(from, {text:`❌ বট Admin না, Kick করতে পারলাম না! বটকে Admin দাও!`}) }
              } else {
                await sock.sendMessage(from, {text:`⚠️ *ANTI-LINK WARNING ${w}/3*\n\n@${sender.split('@')[0]} Link দিছো!\n\n❌ Group এ Link দেওয়া নিষেধ!\n⚠️ Warning: ${w}/3\n${w===2 ? "⚠️ আর 1 বার দিলেই KICK খাইবা!" : "⚠️ আর 2 বার দিলেই KICK খাইবা!"}\n\n👑 RANA-X-VIP-BOT\n📢 Channel: ${CHANNEL}`, mentions:[sender]})
              }
              return
            }
          }catch(e){ console.log("Antilink Err:", e.message) }
        }
      }
      if(!body || !body.startsWith('.')) return
      const args = body.slice(1).trim().split(/ +/); const cmd = args[0].toLowerCase(); const text = args.slice(1).join(' ')
      if(recentOn){ recentCmds.push(cmd); if(recentCmds.length>20) recentCmds.shift() }
      if(cmd==='welcome' && text==='on'){ welcomeOn=true; await success("Welcome ON"); return }
      if(cmd==='welcome' && text==='off'){ welcomeOn=false; await success("Welcome OFF"); return }
      if(cmd==='goodbye' && text==='on'){ goodbyeOn=true; await success("Goodbye ON"); return }
      if(cmd==='goodbye' && text==='off'){ goodbyeOn=false; await success("Goodbye OFF"); return }
      // ✅ RECENT / REACT ON-OFF - ২টাই একসাথে
      if(cmd==='recent' && text==='on'){ recentOn=true; autoReactOn=true; await success("✅ Recent ON + Random Emoji React ON 🔥"); return }
      if(cmd==='recent' && text==='off'){ recentOn=false; autoReactOn=false; await sendV("❌ Recent OFF + Emoji React OFF"); return }
      if(cmd==='react' && text==='on'){ autoReactOn=true; await success("✅ Random Emoji React ON 🔥"); return }
      if(cmd==='react' && text==='off'){ autoReactOn=false; await sendV("❌ Random Emoji React OFF"); return }
      if(cmd==='react'){ await sendV(autoReactOn?"✅ React: ON - Random Emoji দিচ্ছে 🔥":"❌ React: OFF"); return }
      if(cmd==='welcome'){ await sendV(welcomeOn?"✅ Welcome: ON":"❌ Welcome: OFF"); return }
      if(cmd==='goodbye'){ await sendV(goodbyeOn?"✅ Goodbye: ON":"❌ Goodbye: OFF"); return }
      if(cmd==='antilink' && text==='on'){ antilinkOn=true; await success("✅ Anti-Link ON - Link দিলে 3 বার Warning -> Kick"); return }
      if(cmd==='antilink' && text==='off'){ antilinkOn=false; await success("❌ Anti-Link OFF"); return }
      if(cmd==='antilink'){ await sendV(antilinkOn?"✅ Anti-Link: ON\nLink দিলে 3 বার Warning -> Kick":"❌ Anti-Link: OFF"); return }
      if(cmd==='warns' || cmd==='warnlist'){
        let list = Object.entries(warnCount).filter(([k,v])=>v>0)
        if(!list.length){ await sendV("✅ কারো Warn নাই! সবাই ভালো! 💜"); return }
        await sendV("⚠️ *WARN LIST*\n"+list.map(([id,c])=>`@${id.split('@')[0]} - ${c}/3`).join("\n"))
        return
      }
      if(cmd==='resetwarn' || cmd==='resetwarns'){
        let t = getTarget()
        if(!t){ await sendV("❌ কাকে Reset করবো? Tag করো! Ex: .resetwarn @user"); return }
        warnCount[t]=0
        await success(`✅ @${t.split('@')[0]} এর Warn Reset হইছে!`)
        return
      }
      if(cmd==='warn'){
        let t = getTarget()
        if(!t){ await sendV("❌ কাকে Warn দিবা? Tag করো!"); return }
        warnCount[t]=(warnCount[t]||0)+1
        if(warnCount[t]>=3){ warnCount[t]=0; await sock.sendMessage(from,{text:`🚫 @${t.split('@')[0]} 3 বার Warn খাইছে - KICK!`, mentions:[t]}); try{ await sock.groupParticipantsUpdate(from,[t],"remove") }catch{} }
        else{ await success(`⚠️ @${t.split('@')[0]} কে Warn দেওয়া হইছে! ${warnCount[t]}/3`) }
        return
      }
      if(cmd==='recent' || cmd==='trending'){
        let r1 = [...recentMsgs].slice(-10).reverse().map(x=> `${x.emoji} @${x.user}: ${x.txt}`).join("\n")
        let r2 = recentCmds.slice(-10).reverse().map(c=>"┃ ✦ ."+c).join("\n")
        await sendV(`🔥 *RECENT - Random Emoji সহ*\n\n${r1||"No recent yet - এখন মেসেজ করো, Emoji আসবো!"}\n\n┏━━〔 🔥 RECENT COMMANDS 〕━━┓\n${r2||"┃ ✦ .menu"}\n┗━━━━━━━━━━━━━┛\n\n💜 ${BOT_NAME}\n💡 .recent off লিখলে Emoji বন্ধ হবে`)
        return
      }
      if(cmd==='menu' || cmd==='allmenu' || cmd==='commands' || cmd==='list'){ await sendMenuWithChannel(sock, from, m, senderThumb); return }
      if(cmd==='channel' || cmd==='channellink' || cmd==='viewchannel' || cmd==='joinchannel' || cmd==='follow'){
        await sock.sendMessage(from, { text: "📢 *Follow Channel:*", footer: "RANA X VIP 👑💜", buttons: [{ buttonId: "viewchannel", buttonText: { displayText: "📢 View Channel" }, type: 1 }], headerType: 1, contextInfo: { externalAdReply: { title: "📢 View Channel", body: "Tap to View Channel", thumbnail: senderThumb, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: true, showAdAttribution: true } } }, {quoted: m}); return
      }
      if(cmd==='ping' || cmd==='pong' || cmd==='speed'){ await success(`🏖️ PONG: ${Date.now()%200+45} Ms\n👑 Bot: ${BOT_NAME}\n👑 Owner: 01636487523\n📦 Commands: ${ALL_CMDS.length}`); return }
      let done = await handleCommand({ sock, from, m, cmd, text, sender, isGroup, qCtx, mentioned, getTarget, sendV, success, senderThumb, BOT_NAME, OWNER_NAME, OWNER, CHANNEL_LINK: CHANNEL, CHANNEL_JID, needAdmin, userBal, userXp, downloadContentFromMessage, getCatMenu, getWelcomeMenu })
      if(done) return
      if(ALL_CMDS.includes(cmd)){ await success("."+cmd+" Successful!"); return }
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
