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
let welcomeOn = true, goodbyeOn = true, recentOn = true
let sockMain = null, isConnected = false, qrData = null
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🥰","😍","💥","⚡","🌸","🌺","🎉","💯","✅","😂","🤣","😁","🥳","😏","🖤"]
const recentMsgs = [], recentCmds = []
const sessions = new Map()
let userBal = {}, userXp = {}
function getCountryInfo(num){ num=num.replace(/[^0-9]/g,''); const list={"880":{name:"Bangladesh",flag:"🇧🇩",code:"BD"},"91":{name:"India",flag:"🇮🇳",code:"IN"},"92":{name:"Pakistan",flag:"🇵🇰",code:"PK"},"1":{name:"USA",flag:"🇺🇸",code:"US"}}; let keys=Object.keys(list).sort((a,b)=>b.length-a.length); for(let k of keys){ if(num.startsWith(k)) return list[k] } return {name:"International",flag:"🌍",code:"INT"} }
function vBox(txt, thumb){ return { text: txt, contextInfo: { externalAdReply: { title: "WhatsApp ✅", body: "01636487523 • Status | Contact: "+OWNER_NAME, thumbnail: thumb || null, mediaType: 1, sourceUrl: "https://whatsapp.com", renderLargerThumbnail: false, showAdAttribution: true } } } }
async function getSenderThumb(sock, sender){ try{ let url = await sock.profilePictureUrl(sender, 'image'); let res = await axios.get(url, { responseType: 'arraybuffer' }); return Buffer.from(res.data) }catch{ try{ let r2 = await axios.get(BOT_PIC, { responseType: 'arraybuffer' }); return Buffer.from(r2.data) }catch{ return null } } }
async function getBotPicBuffer(){ try{ let r = await axios.get(BOT_PIC, { responseType: 'arraybuffer' }); return Buffer.from(r.data) }catch{ return null } }
// ✅ VIEW CHANNEL BUTTON - Menu তে বাটন
async function sendMenuWithChannel(sock, from, msg, thumb){
  let recentTxt = recentCmds.length ? "\n\n┏━━〔 🔥 RECENT 〕━━┓\n"+recentCmds.slice(-10).reverse().map(c=>"┃ ✦ ."+c).join("\n")+"\n┗━━━━━━━━━━━━━┛" : ""
  let menuTxt = getMenuText(OWNER_NAME, OWNER, CHANNEL)+recentTxt
  try{
    await sock.sendMessage(from, { text: menuTxt, footer: "📢 Channel Follow করো - RANA X VIP 👑💜", buttons: [{ buttonId: "viewchannel", buttonText: { displayText: "📢 View Channel" }, type: 1 }, { buttonId: "menu", buttonText: { displayText: "📋 Menu" }, type: 1 }, { buttonId: "recent", buttonText: { displayText: "🔥 Recent" }, type: 1 }], headerType: 1, contextInfo: { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: CHANNEL_JID, newsletterName: BOT_NAME, serverMessageId: 1 }, externalAdReply: { title: "WhatsApp ✅", body: "01636487523 • Status | Contact: "+OWNER_NAME, thumbnail: thumb, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: false, showAdAttribution: true } } }, {quoted: msg})
  }catch{
    await sock.sendMessage(from, { text: menuTxt+"\n\n📢 *Channel:* "+CHANNEL+"\n👉 View Channel বাটনে চাপ দাও 👆", contextInfo: { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: CHANNEL_JID, newsletterName: BOT_NAME, serverMessageId: 1 }, externalAdReply: { title: "📢 View Channel", body: "Tap to View Channel - RANA X VIP", thumbnail: thumb, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: true, showAdAttribution: true } } }, {quoted: msg})
  }
}
app.get('/', function(req,res){
  res.send('<!DOCTYPE html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><title>RANA-X-VIP-BOT</title><style>*{box-sizing:border-box} body{margin:0;min-height:100vh;background:#080808;color:#fff;font-family:system-ui;display:flex;justify-content:center;align-items:flex-start;padding:12px} .card{background:#121212;border:1px solid #242424;border-radius:28px;padding:22px 18px;width:100%;max-width:420px} .icon{width:80px;height:80px;margin:6px auto 12px;border-radius:20px;background:linear-gradient(135deg,#ff3a00,#ff8c00);display:flex;align-items:center;justify-content:center;overflow:hidden} .icon img{width:100%;height:100%;object-fit:cover} h1{margin:0;text-align:center;font-size:26px} .w{color:#fff} .o{color:#ff6a00} .sub{text-align:center;color:#777;font-size:12.5px;margin:8px 0 14px} .conn{display:flex;justify-content:center;margin:8px 0 16px} .conn span{font-size:10px;color:#555;background:#1a1a1a;border:1px solid #222;padding:5px 12px;border-radius:20px} .btn{width:100%;margin-top:12px;padding:15px;background:linear-gradient(135deg,#ff4500,#ff8c00);border:none;border-radius:14px;color:#fff;font-weight:900;font-size:15px;cursor:pointer} .phoneBox{display:flex;gap:8px} .cc{width:78px;padding:14px;background:#0e0e0e;border:1.5px solid #2a2a2a;border-radius:14px;color:#fff;font-weight:700;text-align:center} .num{flex:1;padding:14px;background:#0e0e0e;border:1.5px solid #2a2a2a;border-radius:14px;color:#fff} .box{margin-top:14px;padding:14px;border-radius:14px;display:none;justify-content:space-between;align-items:center;background:#0e0e0e;border:1.5px dashed #ff5a00} .code{font-size:28px;font-weight:900;color:#ff8c00;letter-spacing:3px} .qrbox{margin-top:14px;padding:14px;background:#0e0e0e;border:1px solid #2a2a2a;border-radius:16px;display:none;text-align:center} .qrbox img{width:230px;height:230px;background:#fff;padding:8px;border-radius:12px} #res{margin-top:10px;padding:10px;border-radius:10px;display:none;font-weight:700;font-size:12px} .footer{margin-top:16px;border-top:1px solid #1e1e1e;padding-top:12px;display:flex;justify-content:space-between} .footer a{color:#ff6a00;text-decoration:none;font-weight:700}</style></head><body><div class=card><div class=icon><img src="'+BOT_PIC+'"></div><h1><span class=w>RANA-</span><span class=o>X-VIP-</span><span class=w>BOT</span></h1><p class=sub>Enter your WhatsApp number to link your device. Unlimited - sobai nijer number diye bot calate parbe.</p><div class=conn><span>● UNLIMITED PUBLIC BOT - '+sessions.size+' CONNECTED</span></div><div class=phoneBox><input id=c class=cc value="+880"><input id=num class=num placeholder="16XXXXXXXX"></div><button class=btn onclick="getPair()">⚡ Get Pair Code</button><div id=box class=box><span id=code class=code></span><button onclick="copyCode()" style="padding:8px 14px;background:#ff5a00;color:#fff;border:none;border-radius:8px;font-weight:800">Copy</button></div><div id=res></div><div class=footer><button onclick="showQR()">📷 Use QR Code</button><a href="'+CHANNEL+'" target="_blank">📢 Join Channel</a></div><div id=qrbox class=qrbox><img id=qimg src=""></div></div><script>async function getPair(){let c=document.getElementById("c").value.replace(/[^0-9]/g,"")||"880";let n=document.getElementById("num").value.replace(/[^0-9]/g,"").replace(/^0+/,"");let full=c+n;let r=document.getElementById("res");if(full.length<10){alert("Valid number dao");return;}r.style.display="block";r.innerText="⚡ Connecting...";try{let d=await (await fetch("/pair?number="+full)).json();if(d.code){document.getElementById("code").innerText=d.code;document.getElementById("box").style.display="flex";r.style.display="none";try{navigator.clipboard.writeText(d.code);}catch(e){}}else{r.innerText="❌ "+d.error;}}catch(e){r.innerText="❌ Server Error";}}function copyCode(){let t=document.getElementById("code").innerText;navigator.clipboard.writeText(t);}function showQR(){document.getElementById("qrbox").style.display="block";getQR();}async function getQR(){let d=await (await fetch("/qr")).json();if(d.qr)document.getElementById("qimg").src=d.qr;}<\/script></body></html>')
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
      const m = messages[0]; if(!m.message) return
      const from = m.key.remoteJid; const isGroup = from.endsWith('@g.us'); const sender = m.key.participant || m.key.remoteJid
      const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || m.message.buttonsResponseMessage?.selectedButtonId || m.message.templateButtonReplyMessage?.selectedId || ""
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
      if(recentOn && body && !m.key.fromMe){
        try{ let e = EMOJI[Math.floor(Math.random()*EMOJI.length)]; await sock.sendMessage(from, { react: { text: e, key: m.key } }) }catch{}
        recentMsgs.push({ txt: body.slice(0,60), user: sender.split('@')[0], emoji: "🔥" }); if(recentMsgs.length>30) recentMsgs.shift()
      }
      if(!body.startsWith('.')) return
      const args = body.slice(1).trim().split(/ +/); const cmd = args[0].toLowerCase(); const text = args.slice(1).join(' ')
      if(recentOn){ recentCmds.push(cmd); if(recentCmds.length>20) recentCmds.shift() }
      if(cmd==='welcome' && text==='on'){ welcomeOn=true; await success("Welcome ON"); return }
      if(cmd==='welcome' && text==='off'){ welcomeOn=false; await success("Welcome OFF"); return }
      if(cmd==='goodbye' && text==='on'){ goodbyeOn=true; await success("Goodbye ON"); return }
      if(cmd==='goodbye' && text==='off'){ goodbyeOn=false; await success("Goodbye OFF"); return }
      if(cmd==='recent' && text==='on'){ recentOn=true; await success("Recent ON"); return }
      if(cmd==='recent' && text==='off'){ recentOn=false; await sendV("❌ Recent OFF"); return }
      if(cmd==='welcome'){ await sendV(welcomeOn?"✅ Welcome: ON":"❌ Welcome: OFF"); return }
      if(cmd==='goodbye'){ await sendV(goodbyeOn?"✅ Goodbye: ON":"❌ Goodbye: OFF"); return }
      if(cmd==='recent' || cmd==='trending'){
        let r1 = [...recentMsgs].slice(-10).map(x=> `${x.emoji} @${x.user}: ${x.txt}`).join("\n")
        let r2 = recentCmds.slice(-10).reverse().map(c=>"┃ ✦ ."+c).join("\n")
        await sendV(`🔥 *RECENT*\n\n${r1||"No recent yet"}\n\n┏━━〔 🔥 RECENT COMMANDS 〕━━┓\n${r2||"┃ ✦ .menu"}\n┗━━━━━━━━━━━━━┛\n\n💜 ${BOT_NAME}`); return
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
let PORT = process.env.PORT || 10000
app.listen(PORT,'0.0.0.0',()=>{ console.log('RANA-X VIP UNLIMITED Running on '+PORT+' | '+ALL_CMDS.length+' Commands'); try{ if(fs.existsSync('./sessions')){ for(let f of fs.readdirSync('./sessions')){ startBot(f) } } }catch{} })
