// ===== RANA-X-VIP-BOT - FULL index.js - FINAL - PRIVATE=CLOSEUP + WELCOME=DP+DESIGN =====
const express = require('express')
const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, downloadContentFromMessage, DisconnectReason } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')
const axios = require('axios')
const QRCode = require('qrcode')
const { CATS, ALL_CMDS, getMenuText, getWelcomeMenu, getGoodbyeMenu, getCatMenu, handleCommand } = require('./commands')
const app = express()
const OWNER = "8801636487523"
const OWNER_NAME = "🇷┳◇┳𝗝♥︎‿♥︎𝗥𝗔𝗡𝗔ᯤ̸"
const BOT_NAME = "RANA-X-VIP-BOT"
const BOT_PIC = "https://i.ibb.co.com/Pz52VSWF/IMG-20261027-WA0000.jpg"
const CHANNEL = "https://whatsapp.com/channel/0029VbDF4POH5JLyfJOmwZ3B"
const CHANNEL_INVITE = "0029VbDF4POH5JLyfJOmwZ3B"
let CHANNEL_JID = ""
const CHROME = ["Ubuntu", "Chrome", "20.0.04"]
if(!globalThis.BOT_STATE) globalThis.BOT_STATE = { welcomeOn: true, goodbyeOn: true, recentOn: true, autoReactOn: true, antilinkOn: true }
globalThis.BOT_STATE.recentOn = true
globalThis.BOT_STATE.autoReactOn = true
if(!globalThis.WARNS) globalThis.WARNS = {}
if(!globalThis.BOT_MODE) globalThis.BOT_MODE = "public"
let welcomeOn = true, goodbyeOn = true, recentOn = true, autoReactOn = true
let antilinkOn = true
let warnCount = globalThis.WARNS
let sockMain = null, isConnected = false, qrData = null
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🥰","😍","💥","⚡","🌸","🌺","🎉","💯","✅","😂","🤣","😁","🥳","😏","🖤","🤍","💙","💚","💜","🧡","❣️","💕","💞","💓","💗","💘","😘","😗","🤗","🤩","😋","🤫","🤭","🫣","🤔","😌","🥺","😭","😤","👋","🤚","👌","✌️","🤞","🫰","🤟","👍","👎","👊","👏","🙌","🫶","🤝","🙏","💪","😃","😄","😆","😉","😜","🤪","😇","🥰","😻","🙈","🙉","🙊","🐶","🐱","🦁","🐯","🦊","🐼","🌹","🌻","🍓","🍒","🍕","🍔","⚽","🎮","🎲","🎸","🎧","🚀","💎","👑","🦋","🌈","☀️","🌙","⭐","🔥","💥","🎊","🎁"]
const recentMsgs = [], recentCmds = []
const sessions = new Map()
let userBal = {}, userXp = {}
const groupMetaCache = new Map()
const dpCache = new Map()
let usedPrivateIds = new Set()
const PRIVATE_POOL = ["turkish drama couple kiss closeup","romantic couple kiss closeup slow motion","couple kiss closeup lip status","turkish series romantic kiss scene","boyfriend girlfriend kiss closeup romantic","romantic kiss neck closeup couple","couple kiss hug romantic closeup status","deep romantic kiss closeup love","turkish drama kiss scene romantic couple","romantic couple kiss cheek neck closeup","kiss romantic couple closeup reels","husband wife romantic kiss closeup","romantic kiss love story closeup status","couple kiss forehead neck romantic","turkish couple kiss romantic scene slow","romantic kiss closeup whatsapp status","couple romantic kiss lip to lip closeup","kiss scene hindi serial romantic closeup","romantic couple kiss holding face closeup","love couple kiss closeup 30 seconds","romantic couple kiss holding chin closeup","turkish drama couple kiss slow motion status"]
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
let BOT_PIC_BUF = null
async function getBotPicBuffer(){ if(BOT_PIC_BUF) return BOT_PIC_BUF; try{ let r = await axios.get(BOT_PIC, { responseType: 'arraybuffer', timeout: 8000 }); BOT_PIC_BUF = Buffer.from(r.data); return BOT_PIC_BUF }catch{ return null } }
async function getBotThumb(){ return await getBotPicBuffer() }
async function getSenderThumb(sock, sender){ return await getBotPicBuffer() }
async function getSenderThumbNow(sock, sender){
  try{ let url = await sock.profilePictureUrl(sender, 'image'); let res = await axios.get(url, { responseType: 'arraybuffer', timeout: 5000 }); let buf = Buffer.from(res.data); dpCache.set(sender, buf); return buf }catch{ let b = await getBotPicBuffer(); dpCache.set(sender, b); return b }
}
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
async function getYTSearch(query){
  let items = []
  try{
    let r = await axios.post("https://www.youtube.com/youtubei/v1/search?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8", { context: { client: { clientName: "WEB", clientVersion: "2.20240111.09.00" } }, query: query }, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0', 'Content-Type': 'application/json' } })
    let contents = r.data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || []
    for(let sec of contents){
      let list = sec?.itemSectionRenderer?.contents || []
      for(let it of list){
        let vr = it?.videoRenderer
        if(vr && vr.videoId){
          let lenTxt = vr.lengthText?.simpleText || "0:30"
          let p = lenTxt.split(":").map(Number)
          let dur = p.length==3 ? p[0]*3600+p[1]*60+p[2] : p.length==2 ? p[0]*60+p[1] : 30
          items.push({ title: vr.title?.runs?.[0]?.text || query, videoId: vr.videoId, duration: dur })
        }
      }
    }
  }catch(e){ console.log("Search Fail:", e.message) }
  if(!items.length){
    try{ let r2 = await axios.get("https://pipedapi.kavin.rocks/search?q="+encodeURIComponent(query)+"&filter=videos", {timeout: 8000}); if(r2.data?.items?.length) items = r2.data.items.map(x=>({ title: x.title, videoId: (x.url||"").split("watch?v=")[1]||x.id, duration: x.duration })) }catch{}
  }
  return items
}
async function getYTStream(vid){
  try{
    let pr = await axios.post("https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8", { context: { client: { clientName: "ANDROID", clientVersion: "19.09.37", androidSdkVersion: 30 } }, videoId: vid }, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0', 'Content-Type': 'application/json' } })
    let fmts = pr.data?.streamingData?.formats || []
    let adp = pr.data?.streamingData?.adaptiveFormats || []
    let vUrl = (fmts.find(x=>x.itag==18) || fmts.find(x=>x.mimeType?.includes("mp4")) || fmts[0])?.url || ""
    let aList = adp.filter(x=>x.mimeType?.includes("audio")); aList.sort((a,b)=>(b.bitrate||0)-(a.bitrate||0))
    let aUrl = aList[0]?.url || ""
    return { vUrl, aUrl }
  }catch(e){ return { vUrl:"", aUrl:"" } }
}
async function sendVideoByQuery(sock, from, m, query, title, emoji, botThumb, wantShort=false){
  const sendV = async (txt) => sock.sendMessage(from, vBox(txt, botThumb), {quoted:m})
  await sendV("🎬 খুঁজতেছি... *"+query+"* 🔥")
  try{
    let itemsAll = await getYTSearch(query)
    if(!itemsAll.length){ await sendV(`❌ পাইলাম না! আবার লেখ:\n.private`); return }
    let v = itemsAll[0]
    if(wantShort){
      let shorts = itemsAll.filter(x => (x.duration||999) >= 15 && (x.duration||0) <= 45)
      if(!shorts.length) shorts = itemsAll.filter(x => (x.duration||999) <= 65 && (x.duration||0) >= 10)
      if(!shorts.length) shorts = itemsAll
      let fresh = shorts.filter(x=>!usedPrivateIds.has(x.videoId))
      let pool = fresh.length ? fresh : shorts
      if(usedPrivateIds.size > 30) usedPrivateIds.clear()
      pool.sort((a,b)=> Math.abs(30-(a.duration||30)) - Math.abs(30-(b.duration||30)))
      let top = pool.slice(0, Math.min(8, pool.length))
      v = top[Math.floor(Math.random()*top.length)]
      if(v?.videoId) usedPrivateIds.add(v.videoId)
    } else {
      let fulls = itemsAll.filter(x => (x.duration||0) > 60)
      if(fulls.length) v = fulls[Math.floor(Math.random()*fulls.length)]
    }
    let { vUrl } = await getYTStream(v.videoId)
    if(!vUrl){ try{ let st = await axios.get("https://pipedapi.kavin.rocks/streams/"+v.videoId, {timeout: 12000}); vUrl = (st.data?.videoStreams?.find(x=>x.quality==="360p") || st.data?.videoStreams?.[0])?.url || "" }catch{} }
    if(!vUrl){ await sendV(`❤️ *${title}*\n\n🎬 *${v.title}*\n👉 https://www.youtube.com/watch?v=${v.videoId}`); return }
    let vb = null
    try{ vb = await axios.get(vUrl, { responseType: 'arraybuffer', timeout: 90000, headers: { 'User-Agent': 'Mozilla/5.0' }, maxContentLength: 25*1024*1024 }) }catch{}
    if(vb && vb.data.byteLength > 50000 && vb.data.byteLength < 25*1024*1024){
      await sock.sendMessage(from, { video: Buffer.from(vb.data), caption: `${emoji} *${title}*\n🎬 *${v.title}*\n👤 *Requested By:* ${OWNER_NAME} 👑\n\n👑 *${BOT_NAME}* 🔥`, mimetype: 'video/mp4' }, {quoted: m})
    } else {
      await sock.sendMessage(from, { video: { url: vUrl }, caption: `${emoji} *${title}*\n🎬 *${v.title}*\n\n👑 *${BOT_NAME}* 🔥`, mimetype: 'video/mp4' }, {quoted: m})
    }
  }catch(e){ console.log("Video Err:", e.message); await sendV(`❌ ভিডিও আনতে পারলাম না! আবার লেখ:\n.private`) }
}
async function sendAudioByQuery(sock, from, m, query, botThumb){
  const sendV = async (txt) => sock.sendMessage(from, vBox(txt, botThumb), {quoted:m})
  await sendV("🎵 খুঁজতেছি... *"+query+"* (Audio) ▶️")
  try{
    let items = await getYTSearch(query+" song")
    if(!items.length){ await sendV("❌ গান পাইলাম না! 😢"); return }
    let v = items.filter(x=>(x.duration||0)>60)[0] || items[0]
    let { aUrl, vUrl } = await getYTStream(v.videoId)
    let useUrl = aUrl || vUrl
    if(!useUrl){ await sendV("❌ Audio পাইলাম না! 😢"); return }
    let aud = null
    try{ aud = await axios.get(useUrl, { responseType: 'arraybuffer', timeout: 120000, headers: { 'User-Agent': 'Mozilla/5.0' }, maxContentLength: 20*1024*1024 }) }catch{}
    if(!aud || aud.data.byteLength < 100000){ await sendV("❌ Audio ছোট আসছে, আবার লেখ:\n.audio "+query); return }
    await sock.sendMessage(from, { audio: Buffer.from(aud.data), mimetype: 'audio/mp4', fileName: v.title+".mp3", ptt: false, contextInfo: { externalAdReply: { title: v.title, body: "👑 "+BOT_NAME+" - ▶️ চাপ দিলেই বাজবো | 👤 "+OWNER_NAME, thumbnail: botThumb, mediaType: 1, sourceUrl: CHANNEL } } }, {quoted: m})
  }catch(e){ await sendV("❌ Audio আনতে পারলাম না! আবার লেখ:\n.audio "+query) }
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
          // ✅ WELCOME - স্ক্রিনশটের মত - উপরে DP + নিচে ডিজাইন - ভিতরে বসানো
          if(anu.action == 'add' && globalThis.BOT_STATE.welcomeOn){
            let txt = `🌈👉🏻 @${num.split('@')[0]} 💞\n`
            txt += `╭🌈 পরিবারের বুতে স্বাগতম 🌈◯\n`
            txt += `❀╭\n`
            txt += `│ 🫥 তোমাকে আমাদের পরিবারের\n`
            txt += `│ অংশ হতে দেখে ভালো লাগছে!\n`
            txt += `│ ❝ কিছু মানুষ চুপচাপ আসে, কিন্তু\n`
            txt += `│ গভীরভাবে আলো ছড়ায় ❞\n`
            txt += `│ আমরা বিশ্বাস করি তুমিও তেমনই\n`
            txt += `│ একজন 🌸\n`
            txt += `│ তোমার সময়টা হোক ভালো মানুষ,\n`
            txt += `│ ভালো heppy আর সুন্দর স্মৃতিতে ভরা\n`
            txt += `│ 🥹\n`
            txt += `│ এই পরিবার তোমাকে পেয়ে আনন্দিত\n`
            txt += `│ 💫\n`
            txt += `│ 👥 সদস্য: ${meta.participants.length} 👊🎀\n`
            txt += `│ 📅 ${date} | 🕒 ${time}\n`
            txt += `│ 🏠 গ্রুপ: ${meta.subject}\n`
            txt += `╰───🌈╯\n`
            txt += `\n💜 *.menu* লিখো সব Command দেখতে\n╰─➤ *${BOT_NAME}* 👑💜`
            await sock.sendMessage(anu.id, { image: userDp, caption: txt, mentions: [num] })
          }
          if(anu.action == 'remove' && globalThis.BOT_STATE.goodbyeOn){
            let txt2 = `💔 @${num.split('@')[0]} চলে গেলো... 🥺\n`
            txt2 += `╭🌈 পরিবার তোমাকে মিস করবো 🌈◯\n`
            txt2 += `❀╭\n`
            txt2 += `│ তুমি ছিলে আমাদের পরিবারের\n`
            txt2 += `│ একজন ভালো মানুষ 💜\n`
            txt2 += `│ 👥 সদস্য: ${meta.participants.length} জন\n`
            txt2 += `╰───🌈╯\n`
            txt2 += `\n╰─➤ *${BOT_NAME}* 👑`
            await sock.sendMessage(anu.id, { image: userDp, caption: txt2, mentions: [num] })
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
      if(btnId === "viewchannel"){ await sock.sendMessage(from, { text: "📢 *RANA X VIP CHANNEL*\n\n👉 নিচের লিংকে চাপ দাও:\n"+CHANNEL+"\n\n💜 Follow করো!", contextInfo: { externalAdReply: { title: "📢 View Channel", body: "RANA X VIP Channel", thumbnail: botThumb, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: true, showAdAttribution: true } } }, {quoted: m}); return }
      if(btnId === "menu"){ if(globalThis.BOT_MODE==="private" && sender.replace(/[^0-9]/g,'')!==OWNER){ await sendV("🔒 *BOT PRIVATE*\nKhali Owner chalai te parbo!"); return } await sendMenuWithChannel(sock, from, m, botThumb); return }
      if(btnId === "recent"){ let last = [...recentMsgs].slice(-20); let r1 = last.map(x=> `${x.emoji} @${x.user}: ${x.txt}`).join("\n"); let mentions = last.map(x=> x.jid).filter(Boolean); await sock.sendMessage(from, { text: `🔥 *RECENT*\n\n${r1||"No recent yet"}\n\n💜 ${BOT_NAME}`, mentions }, {quoted: m}); return }
      let myEmoji = EMOJI[Math.floor(Math.random()*EMOJI.length)]
      if(hasAnyMsg && !m.key.fromMe){
        try{ sock.sendMessage(from, { react: { text: myEmoji, key: m.key } }).catch(()=>{}); let showTxt = (body || "").toString().slice(0,60) || (m.message.imageMessage ? "📷 Photo" : m.message.videoMessage ? "🎥 Video" : m.message.stickerMessage ? "🎨 Sticker" : m.message.audioMessage ? "🎵 Audio" : "📩 Message"); recentMsgs.push({ txt: showTxt, user: sender.split('@')[0], jid: sender, emoji: myEmoji, from: from }); if(recentMsgs.length>100) recentMsgs.shift() }catch(e){ console.log("React Err:", e.message) }
      }
      if(isGroup && globalThis.BOT_STATE.antilinkOn && body && !m.key.fromMe){
        let hasLink = /https?:\/\/|www\.|chat\.whatsapp\.com|t\.me|telegram\.me|instagram\.com|facebook\.com|youtube\.com|youtu\.be|tiktok\.com/i.test(body)
        if(hasLink && !body.startsWith('.')){
          try{
            let meta = await getGroupMetaCached(sock, from)
            let senderInfo = meta?.participants.find(p=>p.id===sender)
            let isAdmin = senderInfo?.admin
            let isBotAdmin = meta?.participants.find(p=>p.id===sock.user.id)?.admin
            if(!isAdmin){
              try{ await sock.sendMessage(from, {delete:{remoteJid:from, fromMe:false, id:m.key.id, participant:sender}}) }catch{}
              warnCount[sender] = (warnCount[sender]||0) + 1
              let w = warnCount[sender]
              if(w >= 3){ warnCount[sender] = 0; await sock.sendMessage(from, {text:`🚫 *ANTI-LINK - KICKED!*\n\n@${sender.split('@')[0]} 3 বার Link দিছে!\n\n👑 RANA-X-VIP-BOT`, mentions:[sender]}); if(isBotAdmin){ try{ await sock.groupParticipantsUpdate(from, [sender], "remove") }catch{ await sock.sendMessage(from, {text:`❌ Kick করতে পারি নাই! বটকে Admin দাও!`}) } } else{ await sock.sendMessage(from, {text:`❌ বট Admin না, Kick করতে পারলাম না! বটকে Admin দাও!`}) } }
              else { await sock.sendMessage(from, {text:`⚠️ *ANTI-LINK WARNING ${w}/3*\n\n@${sender.split('@')[0]} Link দিছো!\n\n❌ Group এ Link দেওয়া নিষেধ!\n⚠️ Warning: ${w}/3\n\n👑 RANA-X-VIP-BOT\n📢 Channel: ${CHANNEL}`, mentions:[sender]}) }
              return
            }
          }catch(e){ console.log("Antilink Err:", e.message) }
        }
      }
      if(!body || !body.startsWith('.')) return
      const args = body.slice(1).trim().split(/ +/); const cmd = args[0].toLowerCase(); const text = args.slice(1).join(' ')
      recentCmds.push(cmd); if(recentCmds.length>20) recentCmds.shift()
      if(cmd==='private' || cmd==='priv' || cmd==='pvt' || cmd==='privatemode'){
        let q = ""
        if(text){
          let t = text.replace(/balobasi/gi,"Bhalobashi").replace(/valobashi/gi,"Valobashi").replace(/tomare/gi,"Tomare").replace(/tomake/gi,"Tomake")
          q = t + " kiss closeup romantic"
        } else {
          q = PRIVATE_POOL[Math.floor(Math.random()*PRIVATE_POOL.length)]
        }
        await sendVideoByQuery(sock, from, m, q, "PRIVATE ❤️ ROMANTIC", "❤️", botThumb, true)
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
      if(cmd==='welcome' && text==='on'){ globalThis.BOT_STATE.welcomeOn=true; welcomeOn=true; await success("Welcome ON"); return }
      if(cmd==='welcome' && text==='off'){ globalThis.BOT_STATE.welcomeOn=false; welcomeOn=false; await success("Welcome OFF"); return }
      if(cmd==='goodbye' && text==='on'){ globalThis.BOT_STATE.goodbyeOn=true; goodbyeOn=true; await success("Goodbye ON"); return }
      if(cmd==='goodbye' && text==='off'){ globalThis.BOT_STATE.goodbyeOn=false; goodbyeOn=false; await success("Goodbye OFF"); return }
      if(cmd==='recent' && text==='on'){ globalThis.BOT_STATE.recentOn=true; globalThis.BOT_STATE.autoReactOn=true; recentOn=true; autoReactOn=true; await success("✅ Recent ON + Random Emoji React ON 🔥 - Sob Somoy Chalu Thakbo"); return }
      if(cmd==='recent' && text==='off'){ await sendV("🔥 *RECENT ALWAYS ON* 🔥\nBondho kora jabe na! Sob somoy Emoji + Recent cholbo!\n👑 RANA BAPPY"); return }
      if(cmd==='react' && text==='on'){ globalThis.BOT_STATE.autoReactOn=true; autoReactOn=true; await success("✅ Random Emoji React ON 🔥"); return }
      if(cmd==='react' && text==='off'){ await sendV("🔥 *REACT ALWAYS ON* 🔥\nBondho kora jabe na!\n👑 RANA BAPPY"); return }
      if(cmd==='react'){ await sendV("✅ React: ON 🔥 - Sob Msg e Emoji ditase\n✅ Recent: ON 🔥"); return }
      if(cmd==='welcome'){ await sendV(globalThis.BOT_STATE.welcomeOn?"✅ Welcome: ON":"❌ Welcome: OFF"); return }
      if(cmd==='goodbye'){ await sendV(globalThis.BOT_STATE.goodbyeOn?"✅ Goodbye: ON":"❌ Goodbye: OFF"); return }
      if(cmd==='antilink' && text==='on'){ globalThis.BOT_STATE.antilinkOn=true; antilinkOn=true; await success("✅ Anti-Link ON - Link দিলে 3 বার Warning -> Kick"); return }
      if(cmd==='antilink' && text==='off'){ globalThis.BOT_STATE.antilinkOn=false; antilinkOn=false; await success("❌ Anti-Link OFF"); return }
      if(cmd==='antilink'){ await sendV(globalThis.BOT_STATE.antilinkOn?"✅ Anti-Link: ON\nLink দিলে 3 বার Warning -> Kick":"❌ Anti-Link: OFF"); return }
      if(cmd==='warns' || cmd==='warnlist'){ let list = Object.entries(warnCount).filter(([k,v])=>v>0); if(!list.length){ await sendV("✅ কারো Warn নাই! সবাই ভালো! 💜"); return } await sendV("⚠️ *WARN LIST*\n"+list.map(([id,c])=>`@${id.split('@')[0]} - ${c}/3`).join("\n")); return }
      if(cmd==='resetwarn' || cmd==='resetwarns'){ let t = getTarget(); if(!t){ await sendV("❌ কাকে Reset করবো? Tag করো! Ex: .resetwarn @user"); return } warnCount[t]=0; await success(`✅ @${t.split('@')[0]} এর Warn Reset হইছে!`); return }
      if(cmd==='warn'){ let t = getTarget(); if(!t){ await sendV("❌ কাকে Warn দিবা? Tag করো!"); return } warnCount[t]=(warnCount[t]||0)+1; if(warnCount[t]>=3){ warnCount[t]=0; await sock.sendMessage(from,{text:`🚫 @${t.split('@')[0]} 3 বার Warn খাইছে - KICK!`, mentions:[t]}); try{ await sock.groupParticipantsUpdate(from,[t],"remove") }catch{} } else{ await success(`⚠️ @${t.split('@')[0]} কে Warn দেওয়া হইছে! ${warnCount[t]}/3`) } return }
      if(cmd==='del' || cmd==='delete'){ let q = qCtx; if(!q?.stanzaId){ await sendV("❌ যেই মেসেজ ডিলিট করবা, ঐটাতে Reply দিয়া লেখ:\n.del"); return } try{ await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: q.stanzaId, participant: q.participant } }); await sendV("✅ ডিলিট হইছে!") }catch(e){ try{ await sock.sendMessage(from, { delete: q.stanzaId }); await sendV("✅ ডিলিট হইছে!") }catch{ await sendV("❌ ডিলিট করতে পারলাম না! বটকে Admin দাও, আর মেসেজটা ১ দিনের ভিতরে হইতে হইবো!") } } return }
      if(cmd==='recent' || cmd==='trending'){ let last = [...recentMsgs].slice(-20).reverse(); let r1 = last.map(x=> `${x.emoji} @${x.user}: ${x.txt}`).join("\n"); let mentions = last.map(x=> x.jid).filter(Boolean); let r2 = recentCmds.slice(-10).reverse().map(c=>"┃ ✦ ."+c).join("\n"); await sock.sendMessage(from, { text: `🔥 *RECENT - Sob Msg e Emoji* 🔥\n\n${r1||"No recent yet - এখন মেসেজ করো, Emoji আসবো!"}\n\n┏━━〔 🔥 RECENT COMMANDS 〕━━┓\n${r2||"┃ ✦ .menu"}\n┗━━━━━━━━━━━━━┛\n\n💜 ${BOT_NAME} | 👑 ${OWNER_NAME}\n👆 উপরে নামে চাপ দিলেই তার ID / Profile খুলবো`, mentions }, {quoted: m}); return }
      if(cmd==='menu' || cmd==='allmenu' || cmd==='commands' || cmd==='list'){ await sendMenuWithChannel(sock, from, m, botThumb); return }
      if(cmd==='channel' || cmd==='channellink' || cmd==='viewchannel' || cmd==='joinchannel' || cmd==='follow'){ await sock.sendMessage(from, { text: "📢 *Follow Channel:*", footer: "RANA X VIP 👑💜", buttons: [{ buttonId: "viewchannel", buttonText: { displayText: "📢 View Channel" }, type: 1 }], headerType: 1, contextInfo: { externalAdReply: { title: "📢 View Channel", body: "Tap to View Channel", thumbnail: botThumb, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: true, showAdAttribution: true } } }, {quoted: m}); return }
      if(cmd==='ping' || cmd==='pong' || cmd==='speed'){ let pic = await getBotPicBuffer(); let txt = `🏖️ PONG: ${Date.now()%200+45} Ms\n👑 Bot: ${BOT_NAME}\n👑 Owner: ${OWNER_NAME}\n📞 Owner: 01636487523\n📦 Commands: ${ALL_CMDS.length} 🔥`; if(pic) await sock.sendMessage(from, { image: pic, caption: txt }, {quoted: m}); else await success(txt); return }
      if(cmd==='status' || cmd==='bot' || cmd==='alive'){ let pic = await getBotPicBuffer(); let txt = `╭─━─━─👑─━─━─╮\n┃ 🤖 *${BOT_NAME}* ┃\n╰─━─━─👑─━─━─╯\n\n✅ *Status:* Online 🟢\n👑 *Owner:* ${OWNER_NAME}\n📞 *Owner:* ${OWNER}\n📦 *Commands:* ${ALL_CMDS.length}+\n👥 *Connected Bots:* ${sessions.size}\n🔥 *Mode:* ${globalThis.BOT_MODE.toUpperCase()} | *Recent:* ON 🔥 | *React:* ON 🔥 | *Welcome:* ${globalThis.BOT_STATE.welcomeOn?"ON":"OFF"} | *Antilink:* ${globalThis.BOT_STATE.antilinkOn?"ON":"OFF"}\n\n💜 *RANA-X-VIP-BOT* 👑 ${OWNER_NAME}`; if(pic) await sock.sendMessage(from, { image: pic, caption: txt }, {quoted: m}); else await sendV(txt); return }
      if(cmd==='owner' || cmd==='creator' || cmd==='rana'){ let pic = await getBotPicBuffer(); let txt = `👑 *OWNER INFO* 👑\n\n👤 *Name:* ${OWNER_NAME} 🔥\n📞 *Number:* ${OWNER}\n📢 *Channel:* ${CHANNEL}\n\n💜 ${BOT_NAME}`; if(pic) await sock.sendMessage(from, { image: pic, caption: txt }, {quoted: m}); else await sendV(txt); return }
      if(cmd==='song' || cmd==='play' || cmd==='gan' || cmd==='music' || cmd==='gaan' || cmd==='gana' || cmd==='video' || cmd==='vsong' || cmd==='vgan' || cmd==='vgana'){
        if(!text){ await sendV("❌ গানের নাম দে ভাই! 🎬\nEx: .song Ami Tomare Balobasi\nEx: .song Tum Hi Ho"); return }
        let base = text.replace(/balobasi/gi,"Bhalobashi").replace(/valobashi/gi,"Valobashi").replace(/tomare/gi,"Tomare").replace(/tomake/gi,"Tomake").replace(/harieci/gi,"Hariyechi").replace(/piyare/gi,"Piyare").replace(/koster/gi,"Kosto")
        await sendVideoByQuery(sock, from, m, base+" song", "SONG VIDEO 🎬", "🎬", botThumb, false); return
      }
      if(['romantic','romanticvideo','love','lovevideo','lovestory'].includes(cmd)){ let q = (text || "").replace(/balobasi/gi,"Bhalobashi").replace(/valobashi/gi,"Valobashi").replace(/tomare/gi,"Tomare"); await sendVideoByQuery(sock, from, m, q || "romantic bangla song", "ROMANTIC ❤️", "❤️", botThumb, false); return }
      if(['short','shortvideo','shorts','reel','reels'].includes(cmd)){ let q = text || "bangla short video funny"; await sendVideoByQuery(sock, from, m, q, "SHORT VIDEO 🎬", "🎬", botThumb, true); return }
      if(['dj','djbangla','djsong','djvideo','funny','funnyvideo','comedy','fany'].includes(cmd)){
        let query = text; if(['dj','djbangla','djsong','djvideo'].includes(cmd)) query = text || "dj bangla song"; if(['funny','funnyvideo','comedy','fany'].includes(cmd)) query = text || "funny bangla video"; query = query.replace(/balobasi/gi, "Bhalobashi"); let title = (['dj','djbangla','djsong','djvideo'].includes(cmd) ? "DJ BANGLA 🎧" : "FUNNY 😂"); let emoji = (['dj','djbangla','djsong','djvideo'].includes(cmd) ? "🎧" : "😂"); await sendVideoByQuery(sock, from, m, query, title, emoji, botThumb, false); return
      }
      if(cmd==='audio' || cmd==='mp3' || cmd==='toaudio' || cmd==='songaudio'){
        let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage; let vidMsg = m.message.videoMessage || q?.videoMessage
        if(vidMsg && !text){ await sendV("🎵 ভিডিও থেকে অডিও বানাইতেছি... 🔥"); try{ let stream = await downloadContentFromMessage(vidMsg, 'video'); let buf = Buffer.concat([]); for await(let c of stream) buf = Buffer.concat([buf, c]); await sock.sendMessage(from, { audio: buf, mimetype: 'audio/mp4', fileName: "RANA-Audio.mp3", ptt: false }, {quoted: m}) }catch{ await sendV("❌ অডিও বানাইতে পারলাম না! 😢") } return }
        if(!text){ await sendV("❌ গানের নাম দে! 🎵\nEx: .audio Ami Tomare Balobasi\nEx: .audio Tum Hi Ho"); return }
        let base2 = text.replace(/balobasi/gi,"Bhalobashi").replace(/valobashi/gi,"Valobashi").replace(/tomare/gi,"Tomare"); await sendAudioByQuery(sock, from, m, base2, botThumb); return
      }
      if(cmd==='sticker' || cmd==='s' || cmd==='stiker'){ let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage; let imgMsg = m.message.imageMessage || m.message.videoMessage || q?.imageMessage || q?.videoMessage; if(!imgMsg){ await sendV("❌ ছবি / ভিডিও দিয়া .sticker লেখ! 🎨"); return } try{ let stream = await downloadContentFromMessage(imgMsg, imgMsg.imageMessage ? 'image' : 'video'); let buf = Buffer.concat([]); for await(let c of stream) buf = Buffer.concat([buf, c]); await sock.sendMessage(from, { sticker: buf }, {quoted: m}) }catch(e){ await sendV("❌ Sticker বানাইতে পারলাম না! 😢") } return }
      if(cmd==='toimg' || cmd==='toimage'){ let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage; let st = q?.stickerMessage; if(!st){ await sendV("❌ Sticker এ Reply দিয়া .toimg লেখ 🖼️"); return } try{ let stream = await downloadContentFromMessage(st, 'sticker'); let buf = Buffer.concat([]); for await(let c of stream) buf = Buffer.concat([buf, c]); await sock.sendMessage(from, { image: buf, caption: "✅ Sticker -> Image 🖼️\n👑 "+BOT_NAME+" | 👤 "+OWNER_NAME }, {quoted: m}) }catch(e){ await sendV("❌ Image বানাইতে পারলাম না! 😢") } return }
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
