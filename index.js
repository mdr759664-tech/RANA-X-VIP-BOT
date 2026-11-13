// ===== RANA-X-VIP-BOT - FULL index.js - FINAL - 6 SERVER FALLBACK + DIRECT PLAY IN GROUP =====
const express = require('express')
const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, downloadContentFromMessage, DisconnectReason } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')
const axios = require('axios')
const QRCode = require('qrcode')
const { CATS, ALL_CMDS, getMenuText, getWelcomeMenu, getGoodbyeMenu, getCatMenu, handleCommand, checkAntilink } = require('./commands')
const app = express()
const OWNER = "8801636487523"
const OWNER_NAME = "✷𐏓꯭⸙Ξ⤹𝐑𝐀𝐍𝐀𐏓𝐁𝐀𝐏𝐏𝐘⟭꯭⎯۞"
const BOT_NAME = "RANA-X-VIP-BOT"
const BOT_PIC = "https://i.ibb.co.com/Pz52VSWF/IMG-20261027-WA0000.jpg"
const CHANNEL = "https://whatsapp.com/channel/0029VbDF4POH5JLyfJOmwZ3B"
const CHANNEL_INVITE = "0029VbDF4POH5JLyfJOmwZ3B"
let CHANNEL_JID = ""
const CHROME = ["Ubuntu", "Chrome", "20.0.04"]
if(!globalThis.BOT_STATE) globalThis.BOT_STATE = { welcomeOn: true, goodbyeOn: true, recentOn: true, autoReactOn: true, antilinkOn: true }
if(!globalThis.WARNS) globalThis.WARNS = {}
if(!globalThis.ANTILINK_WARN) globalThis.ANTILINK_WARN = {}
if(!globalThis.BOT_MODE) globalThis.BOT_MODE = "public"
let sockMain = null, isConnected = false, qrData = null
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🥰","😍","💥","⚡","🌸","🌺","🎉","💯","✅","😂","🤣","😁","🥳","😏","🖤","🤍","💙","💚","💜","🧡","❣️","💕","💞","💓","💗","💘","😘","😗","🤗","🤩","😋","🤫","🤭","🫣","🤔","😌","🥺","😭","😤","👋","🤚","👌","✌️","🤞","🫰","🤟","👍","👎","👊","👏","🙌","🫶","🤝","🙏","💪","😃","😄","😆","😉","😜","🤪","😇","🥰","😻","🙈","🙉","🙊","🐶","🐱","🦁","🐯","🦊","🐼","🌹","🌻","🍓","🍒","🍕","🍔","⚽","🎮","🎲","🎸","🎧","🚀","💎","👑","🦋","🌈","☀️","🌙","⭐","🔥","💥","🎊","🎁"]
const recentMsgs = [], recentCmds = []
const sessions = new Map()
let userBal = {}, userXp = {}
const groupMetaCache = new Map()
const dpCache = new Map()
let usedPrivateIds = new Set()
const PRIVATE_POOL = ["couple kiss closeup hand on chin","couple kiss closeup holding face","turkish couple kiss closeup holding chin","kiss closeup hand on cheek romantic","boy holding girl face kiss closeup","couple kiss closeup hand on jaw romantic","romantic kiss closeup hand holding face"]
const PRIVATE_FALLBACK = []
// ✅ 6টা সার্ভার - একটা ফেল হইলে পরেরটা - কিন্তু পাঠাইবো খালি 1টা
const PIPED_LIST = ["https://pipedapi.kavin.rocks","https://pipedapi-libre.kavin.rocks","https://pipedapi.adminforge.de","https://pipedapi.reallyaweso.me","https://pipedapi.leptons.xyz","https://pipedapi.drgns.space"]
async function getFastVideo(query, needKiss=false){
  // সার্ভার একটা একটা কইরা ট্রাই - প্রথম যেটা পাইবো ওইটাই return - 5টা একসাথে না
  for(let BASE of PIPED_LIST){
    let tries = [query, query+" video", query+" song", query+" official"]
    for(let q of tries){
      try{
        let r = await axios.get(BASE+"/search?q="+encodeURIComponent(q)+"&filter=videos", {timeout: 5000})
        let list = r.data?.items || []
        if(needKiss) list = list.filter(x => (x.title||"").toLowerCase().includes("kiss"))
        if(!list.length) continue
        let shuffled = [...list].sort(()=> Math.random()-0.5)
        for(let v of shuffled.slice(0, 5)){
          let vid = (v.url||"").split("watch?v=")[1] || v.id
          if(!vid) continue
          if(usedPrivateIds.has(vid) && needKiss) continue
          try{
            let st = await axios.get(BASE+"/streams/"+vid, {timeout: 6000})
            let vu = (st.data?.videoStreams?.find(x=>x.quality==="360p") || st.data?.videoStreams?.find(x=>x.mimeType?.includes("mp4")) || st.data?.videoStreams?.[0])?.url || ""
            let au = (st.data?.audioStreams?.[0])?.url || ""
            if(vu || au){
              if(needKiss){ usedPrivateIds.add(vid); if(usedPrivateIds.size>40) usedPrivateIds.clear() }
              return { vUrl: vu, aUrl: au, title: v.title, videoId: vid, base: BASE }
            }
          }catch{}
        }
      }catch{}
    }
  }
  return { vUrl:"", aUrl:"", title:"", videoId:"" }
}
async function getYTSearch(q){ let r = await getFastVideo(q); return r.videoId ? [{title:r.title, videoId:r.videoId, duration:30}] : [] }
async function getYTStream(vid){
  for(let BASE of PIPED_LIST){
    try{
      let st = await axios.get(BASE+"/streams/"+vid, {timeout: 6000})
      let vu = (st.data?.videoStreams?.find(x=>x.quality==="360p") || st.data?.videoStreams?.[0])?.url || ""
      let au = (st.data?.audioStreams?.[0])?.url || ""
      if(vu || au) return { vUrl: vu, aUrl: au }
    }catch{}
  }
  return { vUrl:"", aUrl:"" }
}
async function getPrivateVideo100(query){ let f = await getFastVideo(query, true); if(f.vUrl) return { url: f.vUrl, title: f.title }; let f2 = await getFastVideo(query, false); if(f2.vUrl) return { url: f2.vUrl, title: f2.title }; return null }
// ✅ DIRECT PLAY - Group এ ডাইরেক্ট বাজবো - URL ফেল হইলে Buffer দিয়া ট্রাই
async function sendDirectVideo(sock, from, m, url){
  try{ await sock.sendMessage(from, { video: { url }, mimetype: 'video/mp4', gifPlayback: false, viewOnce: false }, {quoted: m}); return true }catch{
    try{ let r = await axios.get(url, {responseType:'arraybuffer', timeout:15000}); if(r.data?.length>10000){ await sock.sendMessage(from, { video: Buffer.from(r.data), mimetype:'video/mp4', gifPlayback:false, viewOnce:false }, {quoted:m}); return true } }catch{}
  }
  return false
}
async function sendDirectAudio(sock, from, m, url, title){
  try{ await sock.sendMessage(from, { audio: { url }, mimetype:'audio/mp4', fileName:(title||"song")+".mp3", ptt:false }, {quoted:m}); return true }catch{
    try{ let r = await axios.get(url, {responseType:'arraybuffer', timeout:15000}); if(r.data?.length>10000){ await sock.sendMessage(from, { audio: Buffer.from(r.data), mimetype:'audio/mp4', fileName:(title||"song")+".mp3", ptt:false }, {quoted:m}); return true } }catch{}
  }
  return false
}
async function getGroupMetaCached(sock, gid){
  let c = groupMetaCache.get(gid)
  if(c && Date.now() - c.time < 30000) return c.data
  try{ let m = await sock.groupMetadata(gid); let obj = {}; obj.data = m; obj.time = Date.now(); groupMetaCache.set(gid, obj); return m }catch(e){ if(c) return c.data; return null }
}
function getCountryInfo(num){
  num = num.replace(/[^0-9]/g,'')
  const list = {"880":{name:"Bangladesh",flag:"🇧🇩",code:"BD"},"91":{name:"India",flag:"🇮🇳",code:"IN"},"92":{name:"Pakistan",flag:"🇵🇰",code:"PK"},"1":{name:"USA",flag:"🇺🇸",code:"US"}}
  let keys = Object.keys(list).sort((a,b)=>b.length-a.length)
  for(let k of keys){ if(num.startsWith(k)) return list[k] }
  return {name:"International",flag:"🌍",code:"INT"}
}
function cleanBase(t){ return (t||"").replace(/^\.?(play|song|video|audio|mp3|ong|gan|gana)\s+/gi,"").replace(/balobasi/gi,"Bhalobashi").replace(/valobashi/gi,"Valobashi").replace(/tomare/gi,"Tomare").replace(/tomake/gi,"Tomake").replace(/harieci/gi,"Hariyechi").replace(/piyare/gi,"Piyare").replace(/koster/gi,"Kosto").replace(/\bcay\b/gi,"Chai").trim() }
function fixCmd(c){
  if(['praivete','praivate','privet','privat','prvt','pribet','privatee','praivet'].includes(c)) return 'private'
  if(['ong','sng','son','songs','playy'].includes(c)) return 'song'
  if(['audo','adio','audoi'].includes(c)) return 'audio'
  if(['recen','recentt','tranding'].includes(c)) return 'recent'
  if(['men','menuu','manu'].includes(c)) return 'menu'
  if(['pingg','pongg'].includes(c)) return 'ping'
  return c
}
let BOT_PIC_BUF = null
async function getBotPicBuffer(){ if(BOT_PIC_BUF) return BOT_PIC_BUF; try{ let r = await axios.get(BOT_PIC, { responseType: 'arraybuffer', timeout: 8000 }); BOT_PIC_BUF = Buffer.from(r.data); return BOT_PIC_BUF }catch{ return null } }
async function getBotThumb(){ return await getBotPicBuffer() }
async function getSenderThumb(sock, sender){ return await getBotPicBuffer() }
async function getSenderThumbNow(sock, sender){
  try{ let url = await sock.profilePictureUrl(sender, 'image'); let res = await axios.get(url, { responseType: 'arraybuffer', timeout: 5000 }); let buf = Buffer.from(res.data); dpCache.set(sender, buf); return buf }catch{ let b = await getBotPicBuffer(); dpCache.set(sender, b); return b }
}
function vBox(txt, thumb){ return { text: txt, contextInfo: { externalAdReply: { title: BOT_NAME, body: "👑 "+OWNER_NAME+" | 01636487523", thumbnail: BOT_PIC_BUF || null, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: false, showAdAttribution: true } } } }
async function downloadVideoBufferFast(vidMsg){
  try{ let stream = await downloadContentFromMessage(vidMsg, 'video'); let chunks = []; for await(let c of stream) chunks.push(c); return Buffer.concat(chunks) }catch(e){ return null }
}
async function sendMenuWithChannel(sock, from, msg, thumb){
  let recentTxt = recentCmds.length ? "\n\n┏━━〔 🔥 RECENT 〕━━┓\n"+recentCmds.slice(-10).reverse().map(c=>"┃ ✦ ."+c).join("\n")+"\n┗━━━━━━━━━━━━━┛" : ""
  let menuTxt = getMenuText(OWNER_NAME, OWNER, CHANNEL)+recentTxt
  let picBuf = await getBotPicBuffer()
  try{
    if(picBuf){
      await sock.sendMessage(from, { image: picBuf, caption: menuTxt + "\n\n📢 *Channel:* "+CHANNEL, footer: "📢 View Channel বাটনে চাপ দাও 👇", buttons: [{ buttonId: "viewchannel", buttonText: { displayText: "📢 View Channel" }, type: 1 }, { buttonId: "menu", buttonText: { displayText: "📋 Menu" }, type: 1 }, { buttonId: "recent", buttonText: { displayText: "🔥 Recent" }, type: 1 }], headerType: 4, contextInfo: { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: CHANNEL_JID, newsletterName: BOT_NAME, serverMessageId: 1 }, externalAdReply: { title: BOT_NAME, body: "👑 "+OWNER_NAME+" | 01636487523", thumbnail: picBuf, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: false, showAdAttribution: true } } }, {quoted: msg})
      return
    }
  }catch{}
  await sock.sendMessage(from, { text: menuTxt+"\n\n📢 *Channel:* "+CHANNEL, contextInfo: { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: CHANNEL_JID, newsletterName: BOT_NAME, serverMessageId: 1 }, externalAdReply: { title: BOT_NAME, body: "👑 "+OWNER_NAME, thumbnail: picBuf, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: true, showAdAttribution: true } } }, {quoted: msg})
}
async function sendVideoByQuery(sock, from, m, query, title, emoji, botThumb, wantShort=false){
  try{
    let f = await getFastVideo(query + (wantShort ? " short" : " video"))
    if(!f.vUrl) f = await getFastVideo(query)
    if(!f.vUrl) return
    await sendDirectVideo(sock, from, m, f.vUrl)
  }catch{}
}
async function sendAudioByQuery(sock, from, m, query, botThumb){
  try{
    let f = await getFastVideo(query+" song")
    if(!f.aUrl && !f.vUrl) return
    await sendDirectAudio(sock, from, m, f.aUrl || f.vUrl, f.title)
  }catch{}
}
app.get('/ping', (req,res)=>{ res.set('Cache-Control','no-store'); res.json({ok:true, time: Date.now(), connected: sessions.size, mode: globalThis.BOT_MODE}) })
app.get('/health', (req,res)=>{ res.json({ok:true}) })
app.get('/', function(req,res){
  res.send(`<!DOCTYPE html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><title>RANA-X-VIP-BOT</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;background:#080808;color:#fff;font-family:system-ui;display:flex;justify-content:center;padding:12px}.card{background:#121212;border:1px solid #242424;border-radius:28px;padding:22px 18px;width:100%;max-width:420px}.icon{width:80px;height:80px;margin:6px auto 12px;border-radius:20px;overflow:hidden}.icon img{width:100%;height:100%;object-fit:cover}h1{text-align:center;font-size:26px;margin:4px 0}.o{color:#ff6a00}.sub{text-align:center;color:#777;font-size:13px;margin:8px 0 14px}.status{text-align:center}.pill{display:inline-block;background:#1e1e1e;color:#666;font-size:11px;padding:6px 14px;border-radius:20px;letter-spacing:1px}.label{font-size:11px;color:#666;letter-spacing:1.5px;display:flex;justify-content:space-between;margin:16px 0 8px}.label b{color:#ff6a00;font-weight:400;cursor:pointer}.server{border:1.5px solid #2a2a2a;border-radius:16px;padding:14px;display:flex;align-items:center;gap:12px;margin-bottom:10px;cursor:pointer}.server.active{border-color:#ff5a00;background:#1a0f08}.dot{width:28px;height:28px;border-radius:50%;border:2px solid #333;display:flex;align-items:center;justify-content:center;flex-shrink:0}.server.active .dot{border-color:#ff5a00}.server.active .dot:after{content:'';width:12px;height:12px;background:#ff5a00;border-radius:50%;display:block}.sname{font-weight:800;font-size:16px}.ssub{font-size:12px;color:#666}.scount{margin-left:auto;color:#555;font-size:13px}.steps{display:flex;align-items:center;justify-content:center;gap:12px;margin:18px 0}.step{width:38px;height:38px;border-radius:50%;background:#1e1e1e;color:#666;display:flex;align-items:center;justify-content:center;font-weight:800}.step.active{background:linear-gradient(135deg,#ff4500,#ff8c00);color:#fff}.line{width:40px;height:2px;background:#2a2a2a}.stitle{font-size:11px;color:#888;letter-spacing:1.5px}.ssub2{font-size:12px;color:#555;margin:2px 0 10px}.phoneBox{display:flex;gap:8px}.cc{width:78px;padding:14px;background:#0e0e0e;border:1.5px solid #2a2a2a;border-radius:14px;color:#fff}.num{flex:1;padding:14px;background:#0e0e0e;border:1.5px solid #2a2a2a;border-radius:14px;color:#fff}.check{display:flex;gap:18px;margin:14px 0;flex-wrap:wrap}.check label{font-size:13px;color:#888;display:flex;gap:8px;align-items:center}.check input{accent-color:#ff5a00;width:18px;height:18px}.btn{width:100%;margin-top:6px;padding:15px;background:linear-gradient(135deg,#ff4500,#ff8c00);border:none;border-radius:14px;color:#fff;font-weight:900;font-size:15px}.box{margin-top:14px;padding:14px;border-radius:14px;display:none;justify-content:space-between;background:#0e0e0e;border:1.5px dashed #ff5a00}.code{font-size:28px;font-weight:900;color:#ff8c00}.qrbox{margin-top:14px;padding:14px;background:#0e0e0e;border-radius:16px;display:none;text-align:center}.qrbox img{width:230px;height:230px;background:#fff;padding:8px;border-radius:12px}.foot{margin-top:14px;display:flex;justify-content:space-between}.foot a,.foot button{background:none;border:none;color:#ff6a00;font-size:13px}</style></head><body><div class=card><div class=icon><img src="${BOT_PIC}"></div><h1>RANA-<span class=o>X-VIP-</span>BOT</h1><p class=sub>Enter your WhatsApp number to link your device.</p><div class=status><span class=pill>● CONNECTING...</span></div><div class=label><span>SELECT SERVER</span><b onclick="location.reload()">↻ refresh</b></div><div class="server active" onclick="selServer(this,'heroku')"><div class=dot></div><div><div class=sname>heroku</div><div class=ssub>Fast • Recommended</div></div><div class=scount>-/100</div></div><div class="server" onclick="selServer(this,'railway')"><div class=dot></div><div><div class=sname>railway</div><div class=ssub>Backup Server</div></div><div class=scount>-/100</div></div><div class=steps><div class="step active">1</div><div class=line></div><div class=step>2</div><div class=line></div><div class=step>3</div></div><div class=stitle>STEP 1 - YOUR NUMBER</div><div class=ssub2>WhatsApp number, with country code</div><div class=phoneBox><input id=c class=cc value="+880"><input id=num class=num placeholder="16XXXXXXXX"></div><div class=check><label><input type=checkbox checked> Enable sound</label><label><input type=checkbox> Video on</label></div><label style="font-size:13px;color:#888;display:flex;gap:8px;align-items:center"><input type=checkbox checked style="accent-color:#ff5a00;width:18px;height:18px"> Remember this number on this device</label><button class=btn onclick="getPair()">⚡ Get Pair Code</button><div id=box class=box><span id=code class=code></span><button onclick="copyCode()" style="padding:8px 14px;background:#ff5a00;color:#fff;border:none;border-radius:8px">Copy</button></div><div id=res style="margin-top:10px;text-align:center"></div><div style="margin-top:12px;padding:12px;border-radius:14px;background:#0e1a2a;text-align:center"><b>✈️ TELEGRAM থেকে Pair Code নাও</b><br><small>Telegram এ <b>@RanaXVIPBot</b> কে <b>/pair 88016XXXXXXXX</b> লিখো</small></div><div class=foot><button onclick="showQR()">📷 Use QR Code</button><a href="${CHANNEL}" target="_blank">📢 Join Channel</a></div><div id=qrbox class=qrbox><img id=qimg src=""></div></div><script>let server='heroku';function selServer(el,s){server=s;document.querySelectorAll('.server').forEach(x=>x.classList.remove('active'));el.classList.add('active');}async function getPair(){let c=(document.getElementById("c").value||"").replace(/[^0-9]/g,"")||"880";let n=document.getElementById("num").value.replace(/[^0-9]/g,"").replace(/^0+/,"");let full=c+n;if(full.length<10){alert("Valid number dao");return;}let r=document.getElementById("res");r.innerText="⚡ Connecting...";try{let d=await (await fetch("/pair?number="+full)).json();if(d.code){document.getElementById("code").innerText=d.code;document.getElementById("box").style.display="flex";r.innerText="";}else{r.innerText="❌ "+d.error;}}catch(e){r.innerText="❌ Server Error";}}function copyCode(){let t=document.getElementById("code").innerText;navigator.clipboard.writeText(t);}function showQR(){document.getElementById("qrbox").style.display="block";getQR();}async function getQR(){let d=await (await fetch("/qr")).json();if(d.qr)document.getElementById("qimg").src=d.qr;}</script></body></html>`)
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
app.get('/status', (req,res)=> res.json({connected: sessions.size, totalBots: sessions.size, bots: [...sessions.keys()], mode: globalThis.BOT_MODE}))
async function startBot(number){
  let numKey = number || OWNER
  let existing = sessions.get(numKey); if(existing && existing.sock) return existing
  let sess = { sock: null, connected: false, qr: null, retry: 0, _retryAt: 0 }; sessions.set(numKey, sess)
  try{
    if(!fs.existsSync('./sessions')) fs.mkdirSync('./sessions', {recursive:true})
    let sd = await useMultiFileAuthState('./sessions/'+numKey)
    let ver = await fetchLatestBaileysVersion()
    let sock = makeWASocket({version: ver.version, auth: {creds: sd.state.creds, keys: makeCacheableSignalKeyStore(sd.state.keys, P({level:'silent'}))}, logger: P({level:'silent'}), browser: CHROME, markOnlineOnConnect: true, syncFullHistory: false, generateHighQualityLinkPreview: false, retryRequestOnTimeout: true, maxMsgRetryCount: 2, keepAliveIntervalMs: 25000, connectTimeoutMs: 60000, defaultQueryTimeoutMs: 60000, getMessage: async ()=> undefined})
    sess.sock = sock; sockMain = sock
    sock.ev.on('creds.update', sd.saveCreds)
    sock.ev.on('connection.update', async (u)=>{
      if(u.qr){ sess.qr = u.qr; qrData = u.qr }
      if(u.connection === 'close'){
        sess.connected=false; sess._retryAt = 0
        let r=u.lastDisconnect?.error?.output?.statusCode
        console.log('DISCONNECT '+numKey+' code='+r)
        if(r===DisconnectReason.loggedOut || r===401){ try{ fs.rmSync('./sessions/'+numKey,{recursive:true,force:true}) }catch{}; sessions.delete(numKey); return }
        sess.retry = (sess.retry||0)+1
        let delay = Math.min(5000 * sess.retry, 30000)
        setTimeout(()=>{ if(!sessions.get(numKey)?.connected){ sessions.delete(numKey); startBot(numKey) } }, delay)
      }
      if(u.connection === 'open'){ sess.connected=true; sess.retry=0; sess._retryAt=0; isConnected=true; console.log('RANA-X-VIP CONNECTED: '+numKey+' MODE='+globalThis.BOT_MODE.toUpperCase()); try{ let meta = await sock.newsletterMetadata('invite', CHANNEL_INVITE); if(meta?.id) CHANNEL_JID = meta.id }catch{} }
    })
    sock.ev.on('group-participants.update', async (anu)=>{
      try{
        groupMetaCache.delete(anu.id)
        let meta = await getGroupMetaCached(sock, anu.id)
        if(!meta) return
        let date = new Date().toLocaleDateString('en-BD', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'long', year: 'numeric' })
        let time = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true })
        for(let num of anu.participants){
          let userDp = await getSenderThumbNow(sock, num)
          if(anu.action == 'add' && globalThis.BOT_STATE.welcomeOn){
            if(!userDp) userDp = await getBotPicBuffer()
            let memberCount = meta.participants.length
            if(!memberCount){ try{ let fresh = await sock.groupMetadata(anu.id); memberCount = fresh.participants.length }catch{} }
            let txt = `🌈👉🏻 @${num.split('@')[0]} 💞\n╭🌈 পরিবারের বুতে স্বাগতম 🌈◯\n❀╭\n│ 🫥 তোমাকে আমাদের পরিবারের\n│ অংশ হতে দেখে ভালো লাগছে!\n│ ❝ কিছু মানুষ চুপচাপ আসে, কিন্তু\n│ গভীরভাবে আলো ছড়ায় ❞\n│ আমরা বিশ্বাস করি তুমিও তেমনই\n│ একজন 🌸\n│ তোমার সময়টা হোক ভালো মানুষ,\n│ ভালো energy আর সুন্দর স্মৃতিতে ভরা\n│ 🥹\n│ এই পরিবার তোমাকে পেয়ে আনন্দিত\n│ 💫\n│ 👥 সদস্য: ${memberCount} 👊🎀\n│ 📅 ${date} | 🕒 ${time}\n│ 🏠 গ্রুপ: ${meta.subject}\n╰───🌈╯\n\n💜 *.menu* লিখো সব Command দেখতে\n╰─➤ *${BOT_NAME}* 👑💜`
            await sock.sendMessage(anu.id, { image: userDp, caption: txt, mentions: [num] })
          }
          if(anu.action == 'remove' && globalThis.BOT_STATE.goodbyeOn){
            let userDp2 = await getSenderThumbNow(sock, num)
            if(!userDp2) userDp2 = await getBotPicBuffer()
            let memberCount2 = meta.participants.length
            let txt2 = `💔 @${num.split('@')[0]} চলে গেলো... 🥺\n╭🌈 পরিবার তোমাকে মিস করবো 🌈◯\n❀╭\n│ তুমি ছিলে আমাদের পরিবারের\n│ একজন ভালো মানুষ 💜\n│ 👥 সদস্য: ${memberCount2} জন\n╰───🌈╯\n\n╰─➤ *${BOT_NAME}* 👑`
            await sock.sendMessage(anu.id, { image: userDp2, caption: txt2, mentions: [num] })
          }
          if(anu.action == 'promote'){ await sock.sendMessage(anu.id, { image: userDp, caption: `🎉 অভিনন্দন @${num.split('@')[0]}! তুমি এখন Admin! 👑\n\n🖤 ${BOT_NAME}`, mentions: [num] }) }
          if(anu.action == 'demote'){ await sock.sendMessage(anu.id, { text: `😢 @${num.split('@')[0]} কে Admin থেকে সরানো হইছে।\n\n🖤 ${BOT_NAME}`, mentions: [num] }) }
        }
      }catch(e){ console.log('Welcome Err:'+e.message) }
    })
    sock.ev.on('messages.upsert', ({messages})=>{ for(const m of messages){ handleOneMessage(sock, m).catch(e=> console.log('Msg Err:'+e.message)) } })
    return sess
  }catch(e){ console.log("START ERROR:", e.message); sessions.delete(numKey); return null }
}
async function handleOneMessage(sock, m){
      try{
      if(!m.message || !m.key) return
      const from = m.key.remoteJid; const isGroup = from.endsWith('@g.us'); const sender = m.key.participant || m.key.remoteJid
      const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || m.message.buttonsResponseMessage?.selectedButtonId || m.message.templateButtonReplyMessage?.selectedId || ""
      const hasAnyMsg = !!m.message
      const qCtx = m.message.extendedTextMessage?.contextInfo; const mentioned = qCtx?.mentionedJid || []
      const botThumb = await getBotPicBuffer()
      const sendV = async (txt) => sock.sendMessage(from, vBox(txt, botThumb), {quoted:m})
      const success = async (txt) => sock.sendMessage(from, vBox(txt.startsWith("✅")||txt.startsWith("❌") ? txt : "✅ "+txt, botThumb), {quoted:m})
      const getTarget = () => mentioned[0] || (qCtx?.participant) || null
      const needAdmin = async ()=>{ if(!isGroup){ await sendV("❌ Group e use koro!"); return false } return true }
      let btnId = m.message?.buttonsResponseMessage?.selectedButtonId || m.message?.templateButtonReplyMessage?.selectedId || ""
      if(btnId === "viewchannel"){ await sock.sendMessage(from, { text: "📢 *RANA X VIP CHANNEL*\n\n👉 নিচের লিংকে চাপ দাও:\n"+CHANNEL+"\n\n💜 Follow করো!", contextInfo: { externalAdReply: { title: BOT_NAME, body: "👑 "+OWNER_NAME, thumbnail: botThumb, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: true, showAdAttribution: true } } }, {quoted: m}); return }
      if(btnId === "menu"){ if(globalThis.BOT_MODE==="private" && sender.replace(/[^0-9]/g,'')!==OWNER){ await sendV("🔒 *BOT PRIVATE*\nKhali Owner chalai te parbo!"); return } await sendMenuWithChannel(sock, from, m, botThumb); return }
      if(btnId === "recent"){ let last = [...recentMsgs].slice(-20); let r1 = last.map(x=> `${x.emoji} @${x.user}: ${x.txt}`).join("\n"); let mentions = last.map(x=> x.jid).filter(Boolean); await sock.sendMessage(from, { text: `🔥 *RECENT*\n\n${r1||"No recent yet"}\n\n💜 ${BOT_NAME}`, mentions }, {quoted: m}); return }
      if(isGroup && body && !body.startsWith('.')){
        let blocked = await checkAntilink({ sock, from, m, sender, isGroup, msgText: body, OWNER, CHANNEL_LINK: CHANNEL })
        if(blocked) return
      }
      let myEmoji = EMOJI[Math.floor(Math.random()*EMOJI.length)]
      if(hasAnyMsg && !m.key.fromMe && globalThis.BOT_STATE.autoReactOn && globalThis.BOT_STATE.recentOn){
        try{ sock.sendMessage(from, { react: { text: myEmoji, key: m.key } }).catch(()=>{}); let showTxt = (body || "").toString().slice(0,60) || (m.message.imageMessage ? "📷 Photo" : m.message.videoMessage ? "🎥 Video" : m.message.stickerMessage ? "🎨 Sticker" : m.message.audioMessage ? "🎵 Audio" : "📩 Message"); recentMsgs.push({ txt: showTxt, user: sender.split('@')[0], jid: sender, emoji: myEmoji, from: from }); if(recentMsgs.length>100) recentMsgs.shift() }catch(e){ console.log("React Err:", e.message) }
      }
      if(!body || !body.startsWith('.')) return
      const args = body.slice(1).trim().split(/ +/); let cmd = fixCmd(args[0].toLowerCase()); const text = args.slice(1).join(' ')
      recentCmds.push(cmd); if(recentCmds.length>20) recentCmds.shift()
      // ✅ PRIVATE - 6 Server ঘুরাইয়া - 1টাই আইবো
      if(cmd==='private' || cmd==='priv' || cmd==='pvt' || cmd==='privatemode'){
        let pools = [...PRIVATE_POOL].sort(()=> Math.random()-0.5)
        let ok = false
        for(let q of pools){
          if(ok) break
          let f = await getFastVideo(q, true)
          if(f.vUrl){ ok = await sendDirectVideo(sock, from, m, f.vUrl) }
        }
        if(!ok){ let f2 = await getFastVideo(PRIVATE_POOL[Math.floor(Math.random()*PRIVATE_POOL.length)], false); if(f2.vUrl) await sendDirectVideo(sock, from, m, f2.vUrl) }
        return
      }
      if(cmd==='public' || cmd==='mode' || cmd==='botmode'){
        if(sender.replace(/[^0-9]/g,'') !== OWNER){ await sendV("❌ এই Command খালি Owner চালাইতে পারবো!\n👑 Owner: "+OWNER); return }
        if(cmd==='public'){ globalThis.BOT_MODE = "public"; await sendV("✅ Bot এখন *PUBLIC* 🔥\nএখন যে কেউ .menu .song .video চালাইতে পারবো!"); return }
        if(text.toLowerCase().trim()==='private'){ globalThis.BOT_MODE = "private"; await sendV("🔒 Bot এখন *PRIVATE* 🔒\nএখন খালি তুমি (Owner) চালাইতে পারবা!"); return }
        if(text.toLowerCase().trim()==='public'){ globalThis.BOT_MODE = "public"; await sendV("✅ Bot এখন *PUBLIC* 🔥"); return }
        await sendV(globalThis.BOT_MODE==="private" ? "🔒 Bot এখন *PRIVATE*\nPublic করতে: .mode public" : "✅ Bot এখন *PUBLIC*\nPrivate করতে: .mode private"); return
      }
      if(globalThis.BOT_MODE === "private" && sender.replace(/[^0-9]/g,'') !== OWNER){ await sendV("🔒 *BOT PRIVATE*\n\nএই Bot এখন Private!\nখালি Owner চালাইতে পারবো!\n\n👑 Owner: "+OWNER+"\n💡 Owner কে বলো .mode public করতে!"); return }
      if(cmd==='recent' || cmd==='trending'){ let last = [...recentMsgs].slice(-20).reverse(); let r1 = last.map(x=> `${x.emoji} @${x.user}: ${x.txt}`).join("\n"); let mentions = last.map(x=> x.jid).filter(Boolean); let r2 = recentCmds.slice(-10).reverse().map(c=>"┃ ✦ ."+c).join("\n"); await sock.sendMessage(from, { text: `🔥 *RECENT - Sob Msg e Emoji* 🔥\n\n${r1||"No recent yet - এখন মেসেজ করো, Emoji আসবো!"}\n\n┏━━〔 🔥 RECENT COMMANDS 〕━━┓\n${r2||"┃ ✦ .menu"}\n┗━━━━━━━━━━━━━┛\n\n💜 ${BOT_NAME} | 👑 ${OWNER_NAME}\n👆 উপরে নামে চাপ দিলেই তার ID / Profile খুলবো`, mentions }, {quoted: m}); return }
      if(cmd==='menu' || cmd==='allmenu' || cmd==='commands' || cmd==='list'){ await sendMenuWithChannel(sock, from, m, botThumb); return }
      if(cmd==='channel' || cmd==='channellink' || cmd==='viewchannel' || cmd==='joinchannel' || cmd==='follow'){ await sock.sendMessage(from, { text: "📢 *Follow Channel:*", footer: "RANA X VIP 👑💜", buttons: [{ buttonId: "viewchannel", buttonText: { displayText: "📢 View Channel" }, type: 1 }], headerType: 1, contextInfo: { externalAdReply: { title: BOT_NAME, body: "Tap to View Channel", thumbnail: botThumb, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: true, showAdAttribution: true } } }, {quoted: m}); return }
      // ✅ PING - Screenshot Card Design
      if(cmd==='ping' || cmd==='pong' || cmd==='speed'){
        let start = Date.now()
        let pic = await getBotPicBuffer()
        let ms = Date.now() - start + 308
        let mem = process.memoryUsage()
        let ramUsed = (mem.heapUsed/1024/1024).toFixed(2)
        let txt = `🔵 Pong!\nResponse Speed: ${(ms/1000).toFixed(4)} seconds\n\n🤖 BOT_FATHER..!? Server Info\nRAM Usage: ${ramUsed} GB / 31.30 GB\nCPU Cores: ${require('os').cpus().length}\nCPU Speed: ${(require('os').cpus()[0]?.speed||3699).toFixed(2)} MHz`
        await sock.sendMessage(from, { text: txt, contextInfo: { externalAdReply: { title: `🍉 Pong: ${ms} Ms`, body: `+880 1636487523 • Status\n👤 Contact: ${OWNER_NAME}`, thumbnail: pic, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: false, showAdAttribution: true } } }, {quoted: m})
        return
      }
      if(cmd==='status' || cmd==='bot' || cmd==='alive'){ let pic = await getBotPicBuffer(); let txt = `╭─━─━─👑─━─━─╮\n┃ 🤖 *${BOT_NAME}* ┃\n╰─━─━─👑─━─━─╯\n\n✅ *Status:* Online 🟢\n👑 *Owner:* ${OWNER_NAME}\n📞 *Owner:* ${OWNER}\n📦 *Commands:* ${ALL_CMDS.length}+\n👥 *Connected Bots:* ${sessions.size}\n🔥 *Mode:* ${globalThis.BOT_MODE.toUpperCase()} | *Recent:* ${globalThis.BOT_STATE.recentOn?"ON 🔥":"OFF ❌"} | *React:* ${globalThis.BOT_STATE.autoReactOn?"ON 🔥":"OFF ❌"} | *Welcome:* ${globalThis.BOT_STATE.welcomeOn?"ON":"OFF"} | *Antilink:* ${globalThis.BOT_STATE.antilinkOn?"ON":"OFF"}\n\n💜 *RANA-X-VIP-BOT* 👑 ${OWNER_NAME}`; if(pic) await sock.sendMessage(from, { image: pic, caption: txt }, {quoted: m}); else await sendV(txt); return }
      if(cmd==='owner' || cmd==='creator' || cmd==='rana'){ let pic = await getBotPicBuffer(); let txt = `👑 *OWNER INFO* 👑\n\n👤 *Name:* ${OWNER_NAME} 🔥\n📞 *Number:* ${OWNER}\n📢 *Channel:* ${CHANNEL}\n\n💜 ${BOT_NAME}`; if(pic) await sock.sendMessage(from, { image: pic, caption: txt }, {quoted: m}); else await sendV(txt); return }
      // ✅ SONG / VIDEO - Group এ Direct Bajbo - 6 Server - 1টাই আইবো
      if(cmd==='song' || cmd==='play' || cmd==='gan' || cmd==='music' || cmd==='gaan' || cmd==='gana' || cmd==='video' || cmd==='vsong' || cmd==='vgan' || cmd==='vgana' || cmd==='ong'){
        let base = cleanBase(text)
        if(!base){ await sendV("❌ গানের নাম দে ভাই! 🎬\nEx: .song Ami Tomare Chai"); return }
        let f = await getFastVideo(base+" song")
        if(!f.vUrl && !f.aUrl){ f = await getFastVideo(base) }
        if(!f.vUrl && !f.aUrl) return
        // ✅ খালি 1টা ভিডিও - তারপর 1টা অডিও - 5টা একসাথে না
        if(f.vUrl) await sendDirectVideo(sock, from, m, f.vUrl)
        if(f.aUrl) await sendDirectAudio(sock, from, m, f.aUrl, f.title)
        return
      }
      if(['romantic','romanticvideo','love','lovevideo','lovestory'].includes(cmd)){ let q = cleanBase(text) || "romantic bangla song"; await sendVideoByQuery(sock, from, m, q, "ROMANTIC ❤️", "❤️", botThumb, false); return }
      if(['short','shortvideo','shorts','reel','reels'].includes(cmd)){ let q = cleanBase(text) || "bangla short video funny"; await sendVideoByQuery(sock, from, m, q, "SHORT VIDEO 🎬", "🎬", botThumb, true); return }
      if(['dj','djbangla','djsong','djvideo','funny','funnyvideo','comedy','fany'].includes(cmd)){
        let query = cleanBase(text); if(['dj','djbangla','djsong','djvideo'].includes(cmd)) query = query || "dj bangla song"; if(['funny','funnyvideo','comedy','fany'].includes(cmd)) query = query || "funny bangla video"; await sendVideoByQuery(sock, from, m, query, "VIDEO 🎬", "🎬", botThumb, false); return
      }
      if(cmd==='audio' || cmd==='mp3' || cmd==='toaudio' || cmd==='songaudio'){
        if(text){
          let base2 = cleanBase(text)
          await sendAudioByQuery(sock, from, m, base2, botThumb)
          return
        }
        let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        let quotedVideo = q?.videoMessage || q?.documentMessage
        let directVideo = m.message.videoMessage
        let targetVideo = directVideo || quotedVideo
        if(targetVideo){
          let buf = await downloadVideoBufferFast(targetVideo)
          if(!buf || buf.length < 10000) return
          await sock.sendMessage(from, { audio: buf, mimetype: 'audio/mp4', fileName: "RANA-Audio.mp3", ptt: false }, {quoted: m})
          return
        }
        await sendV("❌ ভিডিও দিয়া .audio লেখ! 🎵\n\n✅ *3 ভাবে:*\n1. ভিডিও + Caption .audio\n2. Reply দিয়া .audio\n3. .audio Ami Tomare Chai")
        return
      }
      if(cmd==='sticker' || cmd==='s' || cmd==='stiker'){ let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage; let imgMsg = m.message.imageMessage || m.message.videoMessage || q?.imageMessage || q?.videoMessage; if(!imgMsg){ await sendV("❌ ছবি / ভিডিও দিয়া .sticker লেখ! 🎨"); return } try{ let stream = await downloadContentFromMessage(imgMsg, imgMsg.imageMessage ? 'image' : 'video'); let chunks = []; for await(let c of stream) chunks.push(c); let buf = Buffer.concat(chunks); await sock.sendMessage(from, { sticker: buf }, {quoted: m}) }catch(e){ await sendV("❌ Sticker বানাইতে পারলাম না! 😢") } return }
      if(cmd==='toimg' || cmd==='toimage'){ let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage; let st = q?.stickerMessage; if(!st){ await sendV("❌ Sticker এ Reply দিয়া .toimg লেখ 🖼️"); return } try{ let stream = await downloadContentFromMessage(st, 'sticker'); let chunks = []; for await(let c of stream) chunks.push(c); let buf = Buffer.concat(chunks); await sock.sendMessage(from, { image: buf, caption: "✅ Sticker -> Image 🖼️\n👑 "+BOT_NAME+" | 👤 "+OWNER_NAME }, {quoted: m}) }catch(e){ await sendV("❌ Image বানাইতে পারলাম না! 😢") } return }
      if(cmd==='tagall' || cmd==='tag' || cmd==='all'){ if(!isGroup){ await sendV("❌ Group এ use করো! 📢"); return } try{ let meta = await getGroupMetaCached(sock, from); let mem = meta.participants.map(p=>p.id); let txt = `📢 *TAG ALL - ${meta.subject}* 📢\n\n${mem.map((id,i)=>`${i+1}. @${id.split('@')[0]}`).join("\n")}\n\n${text || "সবাই আসো! 🔥"}\n\n👑 ${BOT_NAME} | 👤 ${OWNER_NAME}`; await sock.sendMessage(from, { text: txt, mentions: mem }, {quoted: m}) }catch(e){ await sendV("❌ TagAll হইলো না! 😢") } return }
      if(cmd==='kick'){ let t = getTarget(); if(!t){ await sendV("❌ কাকে Kick করবো? Tag করো! 🚫"); return } try{ await sock.groupParticipantsUpdate(from, [t], "remove"); await success(`🚫 @${t.split('@')[0]} Kicked! 🔥`) }catch{ await sendV("❌ Kick করতে পারলাম না! বটকে Admin দাও! 😢") } return }
      if(cmd==='promote' || cmd==='admin'){ let t = getTarget(); if(!t){ await sendV("❌ কাকে Admin করবো? Tag করো! 👑"); return } try{ await sock.groupParticipantsUpdate(from, [t], "promote"); await success(`👑 @${t.split('@')[0]} এখন Admin! 🔥`) }catch{ await sendV("❌ Promote হইলো না! 😢") } return }
      if(cmd==='demote'){ let t = getTarget(); if(!t){ await sendV("❌ কাকে Demote করবো? 😢"); return } try{ await sock.groupParticipantsUpdate(from, [t], "demote"); await success(`😢 @${t.split('@')[0]} Admin থেকে সরানো হইছে`) }catch{ await sendV("❌ Demote হইলো না! 😢") } return }
      if(cmd==='groupinfo' || cmd==='ginfo'){ if(!isGroup){ await sendV("❌ Group এ use করো! 📋"); return } let meta = await getGroupMetaCached(sock, from); await sendV(`📋 *GROUP INFO* 📋\n\n📛 *Name:* ${meta.subject}\n👥 *Members:* ${meta.participants.length}\n📝 *Desc:* ${meta.desc || "No Desc"}\n\n👑 ${OWNER_NAME}`); return }
      if(cmd==='id' || cmd==='myid' || cmd==='jid'){ await sendV(`🆔 *Your ID:* 🆔\n${sender}\n📱 *Number:* ${sender.split('@')[0]}\n👥 *Group ID:*\n${from}\n\n👑 ${OWNER_NAME}`); return }
      if(cmd==='time' || cmd==='date'){ let d = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', dateStyle: 'full', timeStyle: 'medium' }); await sendV(`🕒 *TIME* 🕒\n${d}\n\n👑 ${BOT_NAME} | 👤 ${OWNER_NAME}`); return }
      if(cmd==='joke'){ let jokes = ["😂 শিক্ষক: পড়া পারো না কেন?\nছাত্র: স্যার, মাথায় ঢুকে না!\nশিক্ষক: মাথায় কি ঢুকে?\nছাত্র: গান ঢুকে! 🎵","😂 বউ: তুমি আমারে ভালোবাসো?\nজামাই: হ, ফেসবুকে Like দিছি তো! 👍"]; await sendV(`😂 *JOKE* 😂\n\n${jokes[Math.floor(Math.random()*jokes.length)]}\n\n👑 ${OWNER_NAME}`); return }
      if(cmd==='quote' || cmd==='shayari'){ let qs = ["💜 সফলতা একদিনে আসে না, প্রতিদিনের চেষ্টায় আসে! 🔥", "🔥 হার মানা মানে শেষ না, আবার উঠে দাঁড়ানোই আসল জয়! 💜"]; await sendV(`💜 *QUOTE* 💜\n\n${qs[Math.floor(Math.random()*qs.length)]}\n\n👑 ${OWNER_NAME}`); return }
      if(cmd==='ai' || cmd==='gpt' || cmd==='ask'){ if(!text){ await sendV("❌ কিছু জিজ্ঞেস কর! 🤖\nEx: .ai Bangladesh কি?"); return } await sendV("🤖 AI ভাবতেছে... *"+text+"* 🤔"); try{ let r = await axios.get("https://api.zenzxz.my.id/api/ai/gpt4?text="+encodeURIComponent(text)); await sendV(`🤖 *AI ANSWER* 🤖\n\n${r.data?.result || r.data?.answer || "উত্তর পাইলাম না! 😢"}\n\n👑 ${OWNER_NAME}`) }catch{ await sendV("🤖 আমি RANA-X-VIP-BOT! তুমি বলছো: "+text+" 👑 "+OWNER_NAME) } return }
      let done = await handleCommand({ sock, from, m, cmd, text, sender, isGroup, qCtx, mentioned, getTarget, sendV, success, senderThumb: botThumb, BOT_NAME, OWNER_NAME, OWNER, CHANNEL_LINK: CHANNEL, CHANNEL_JID, needAdmin, userBal, userXp, downloadContentFromMessage, getCatMenu, getWelcomeMenu, state: globalThis.BOT_STATE })
      if(done) return
      if(ALL_CMDS.includes(cmd)){ await sendV(`❌ .${cmd} এখনো এই Bot এ চালু হয় নাই ভাই! 😢\n💡 .menu লিখে চালু Command গুলা দেখো\n👑 Owner: ${OWNER_NAME}`); return }
      }catch(e){ console.log('handleOneMessage Crash:'+e.message) }
}
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ""
let tgBot = null
if(TELEGRAM_TOKEN){
  try{
    const TelegramBot = require('node-telegram-bot-api')
    tgBot = new TelegramBot(TELEGRAM_TOKEN, {polling: true})
    tgBot.onText(/\/start/, (msg)=>{ tgBot.sendMessage(msg.chat.id, `👑 *RANA-X-VIP-BOT* 👑\n\nPublic Pair Bot - সবাই নিতে পারবে!\n\n📱 Pair নিতে লেখো:\n\`/pair 88016XXXXXXXX\`\n\n✈️ Telegram থেকে Pair Code নাও, WhatsApp এ গিয়া Link করো!`, {parse_mode:'Markdown'}) })
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
setInterval(()=>{ try{ for(let [num, sess] of sessions){ if(sess && sess.sock && sess.connected){ sess.sock.sendPresenceUpdate('available').catch(()=>{}); sess._retryAt = 0 } else if(sess && !sess.connected){ if(!sess._retryAt) sess._retryAt = Date.now() + 120000; if(Date.now() > sess._retryAt){ console.log('Safe Reconnect: '+num); sessions.delete(num); startBot(num) } } } }catch{} }, 60000)
setInterval(()=>{ try{ let url = process.env.RENDER_EXTERNAL_URL || process.env.PUBLIC_URL || ''; if(url) axios.get(url + '/ping', { timeout: 8000 }).catch(()=>{}) }catch{} }, 240000)
let PORT = process.env.PORT || 10000
app.listen(PORT,'0.0.0.0',()=>{ console.log('RANA-X VIP UNLIMITED Running on '+PORT+' | '+ALL_CMDS.length+' Commands'); try{ if(fs.existsSync('./sessions')){ for(let f of fs.readdirSync('./sessions')){ startBot(f) } } }catch{} })
