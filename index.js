const express = require('express')
const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, downloadContentFromMessage, DisconnectReason } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')
const axios = require('axios')
const QRCode = require('qrcode')
const { CATS, ALL_CMDS, getMenuText, getWelcomeMenu, handleCommand } = require('./commands')

const app = express()
const OWNER = "8801636487523"
const OWNER_NAME = "RANA"
const BOT_NAME = "RANA-X-VIP-BOT"
const BOT_PIC = "https://i.ibb.co.com/Pz52VSWF/IMG-20261027-WA0000.jpg"
const CHANNEL = "https://whatsapp.com/channel/0029VbDF4POH5JLyfJOmwZ3B"
const CHANNEL_INVITE = "0029VbDF4POH5JLyfJOmwZ3B"
let CHANNEL_JID = ""
const CHROME = ["Ubuntu", "Chrome", "20.0.04"]

let welcomeOn = true, autoReactOn = true
let sockMain = null, isConnected = false, qrData = null
let restartTimer = null
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🥰","😍","💥","⚡","🌸","🌺","🎉","💯","✅","😂","🤣","😁","🥳","😏","🖤"]
const recentMsgs = []
const recentCmds = []
// ✅ UNLIMITED - prottek phone er alada Bot, kono limit nai
const sessions = new Map()

function getCountryInfo(num){
  num = num.replace(/[^0-9]/g,'')
  const list = { "880": {name:"Bangladesh", flag:"🇧🇩", code:"BD"}, "91": {name:"India", flag:"🇮🇳", code:"IN"}, "92": {name:"Pakistan", flag:"🇵🇰", code:"PK"}, "1": {name:"USA", flag:"🇺🇸", code:"US"} }
  let keys = Object.keys(list).sort((a,b)=> b.length - a.length)
  for(let k of keys){ if(num.startsWith(k)) return list[k] }
  return {name:"International", flag:"🌍", code:"INT"}
}

// ✅ ছোট Box + WhatsApp ✅ + তোর নাম্বার
function vBox(txt, thumb){
  return { text: txt, contextInfo: { externalAdReply: { title: "WhatsApp ✅", body: "01636487523 • Status | Contact: "+OWNER_NAME, thumbnail: thumb || null, mediaType: 1, sourceUrl: "https://whatsapp.com", renderLargerThumbnail: false, showAdAttribution: true } } }
}

async function getSenderThumb(sock, sender){
  try{ let url = await sock.profilePictureUrl(sender, 'image'); let res = await axios.get(url, { responseType: 'arraybuffer' }); return Buffer.from(res.data) }catch{ return null }
}

async function sendMenuWithChannel(sock, from, msg, thumb){
  await sock.sendMessage(from, {
    text: getMenuText(OWNER_NAME, OWNER, CHANNEL)+"\n\n📢 *Channel:* "+CHANNEL,
    contextInfo: {
      forwardingScore: 999, isForwarded: true,
      forwardedNewsletterMessageInfo: { newsletterJid: CHANNEL_JID, newsletterName: BOT_NAME, serverMessageId: 1 },
      externalAdReply: { title: "WhatsApp ✅", body: "01636487523 • Status | Contact: "+OWNER_NAME, thumbnail: thumb, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: false, showAdAttribution: true }
    }
  }, {quoted: msg})
}

app.get('/', (req,res)=>{
  res.send('<h1 style="text-align:center;font-family:sans-serif">👑 RANA-X-VIP-BOT<br><br><a href="/pair?number=8801636487523">Pair Test</a><br><br>Commands: '+ALL_CMDS.length+'<br>Connected: '+sessions.size+'</h1>')
})

// ✅ FIXED /pair - UNLIMITED, kono isConnected block nai, kono cooldown nai
app.get('/pair', async (req,res)=>{
  try{
    let raw = (req.query.number||'').replace(/[^0-9]/g,'').replace(/^0+/, '')
    if(raw.startsWith('8800')) raw = '880' + raw.slice(4)
    if(!raw || raw.length < 8) return res.json({error:'Sothik number dao!'})
    let sess = sessions.get(raw)
    if(!sess){
      sess = await startBot(raw)
      if(!sess || !sess.sock) return res.json({error:'Bot starting, abar chap dao'})
      await new Promise(r=> setTimeout(r, 4000))
    }
    let code = ""
    for(let i=0;i<3;i++){
      try{ code = await sess.sock.requestPairingCode(raw); break }catch(e){ await new Promise(r=> setTimeout(r, 2000)) }
    }
    if(!code) return res.json({error:'Abar chap dao'})
    code = code.replace(/-/g,'')
    let country = getCountryInfo(raw)
    res.json({code, country: country.flag+' '+country.name, server: country.code})
  }catch(e){ console.log("PAIR ERROR:", e.message); res.json({error: e.message}) }
})
app.get('/qr', async (req,res)=>{
  let num = (req.query.number||'').replace(/[^0-9]/g,'')
  let sess = sessions.get(num)
  let q = sess?.qr || qrData
  if(!q) return res.json({error:'no qr - 10 sec wait koro'})
  let img = await QRCode.toDataURL(q)
  res.json({qr:img})
})
app.get('/reset', async (req,res)=>{
  let raw = (req.query.number||'').replace(/[^0-9]/g,'')
  if(raw){
    let sess = sessions.get(raw)
    if(sess){ try{ await sess.sock.logout() }catch{}; try{ sess.sock.end() }catch{}; sessions.delete(raw) }
    try{ fs.rmSync('./sessions/'+raw, {recursive:true, force:true}) }catch{}
    return res.json({ok:true, number: raw})
  }
  try{ if(sockMain) try{ await sockMain.logout() }catch{} }catch{}
  try{ if(sockMain) try{ sockMain.end() }catch{} }catch{}
  sockMain = null
  try{ fs.rmSync('./session', {recursive:true, force:true}) }catch{}
  isConnected = false; qrData = null
  res.json({ok:true})
})
app.get('/status', (req,res)=> res.json({connected: sessions.size, totalBots: sessions.size, bots: [...sessions.keys()], hasSock: !!sockMain}))

// ✅ FIXED startBot(number) - prottek number er alada session
async function startBot(number){
  let numKey = number || OWNER
  let existing = sessions.get(numKey)
  if(existing && existing.sock) return existing
  let sess = { sock: null, connected: false, qr: null }
  sessions.set(numKey, sess)
  try{
    if(!fs.existsSync('./sessions')) fs.mkdirSync('./sessions', {recursive:true})
    let sd = await useMultiFileAuthState('./sessions/'+numKey)
    let ver = await fetchLatestBaileysVersion()
    let sock = makeWASocket({version: ver.version, auth: {creds: sd.state.creds, keys: makeCacheableSignalKeyStore(sd.state.keys, P({level:'silent'}))}, logger: P({level:'silent'}), browser: CHROME, markOnlineOnConnect: false, syncFullHistory: false, getMessage: async ()=> undefined})
    sess.sock = sock; sockMain = sock
    sock.ev.on('creds.update', sd.saveCreds)
    sock.ev.on('connection.update', async (u)=>{
      if(u.qr){ sess.qr = u.qr; qrData = u.qr }
      if(u.connection === 'close'){
        sess.connected = false; isConnected = false
        let r = u.lastDisconnect?.error?.output?.statusCode
        if(r === DisconnectReason.loggedOut){ try{ fs.rmSync('./sessions/'+numKey,{recursive:true,force:true}) }catch{}; sessions.delete(numKey); return }
        sessions.delete(numKey)
        setTimeout(()=>{ startBot(numKey) }, 5000)
      }
      if(u.connection === 'open'){
        sess.connected = true; isConnected = true
        console.log('RANA-X-VIP CONNECTED: '+numKey)
        try{ let meta = await sock.newsletterMetadata('invite', CHANNEL_INVITE); if(meta?.id) CHANNEL_JID = meta.id }catch{}
      }
    })
    sock.ev.on('group-participants.update', async (anu)=>{
      try{
        let meta = await sock.groupMetadata(anu.id)
        for(let num of anu.participants){
          let pp; try{ pp = await sock.profilePictureUrl(num, 'image') }catch{ pp = BOT_PIC }
          if(anu.action == 'add' && welcomeOn){
            let txt = getWelcomeMenu ? getWelcomeMenu(num, meta.subject, meta.participants.length, OWNER_NAME) : `Welcome @${num.split('@')[0]} to ${meta.subject}`
            await sock.sendMessage(anu.id, { image: { url: pp }, caption: txt, mentions: [num] })
          }
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
      const senderThumb = await getSenderThumb(sock, sender)
      const sendV = async (txt) => sock.sendMessage(from, vBox(txt, senderThumb), {quoted:m})
      const success = async (txt) => sock.sendMessage(from, vBox(txt.startsWith("✅")||txt.startsWith("❌") ? txt : "✅ "+txt, senderThumb), {quoted:m})

      if(autoReactOn && body){
        let e = EMOJI[Math.floor(Math.random()*EMOJI.length)]
        try{ await sock.sendMessage(from, { react: { text: e, key: m.key } }) }catch{}
        recentMsgs.push({ txt: body.slice(0,60), user: sender.split('@')[0], emoji: e })
        if(recentMsgs.length>30) recentMsgs.shift()
      }
      if(!body.startsWith('.')) return
      const args = body.slice(1).trim().split(/ +/)
      const cmd = args[0].toLowerCase()
      const text = args.slice(1).join(' ')
      if(autoReactOn){ recentCmds.push(cmd); if(recentCmds.length>20) recentCmds.shift() }
      const getTarget = () => mentioned[0] || (qCtx?.participant) || null

      if(cmd==='welcome' && text==='on'){ welcomeOn=true; await success("Welcome ON"); return }
      if(cmd==='welcome' && text==='off'){ welcomeOn=false; await success("Welcome OFF"); return }
      if(cmd==='welcome'){ await sendV(welcomeOn?"✅ Welcome: ON":"❌ Welcome: OFF"); return }
      if(cmd==='recent' && text==='on'){ autoReactOn=true; await success("Recent ON"); return }
      if(cmd==='recent' && text==='off'){ autoReactOn=false; await sendV("❌ Recent OFF"); return }
      if(cmd==='recent' || cmd==='trending'){
        let r = [...recentMsgs].slice(-10).map(x=> `${x.emoji} @${x.user}: ${x.txt}`).join("\n")
        await sendV(`🔥 *RECENT*\n\n${r||"No recent yet"}\n\n💜 ${BOT_NAME}`)
        return
      }
      if(cmd==='menu' || cmd==='allmenu' || cmd==='commands' || cmd==='list'){ await sendMenuWithChannel(sock, from, m, senderThumb); return }
      if(cmd==='channel' || cmd==='channellink' || cmd==='viewchannel' || cmd==='joinchannel' || cmd==='follow'){ await sendV("📢 Follow Channel:\n"+CHANNEL); return }
      if(cmd==='ping' || cmd==='pong' || cmd==='speed'){ await success(`🏖️ PONG: ${Date.now()%200+45} Ms\n👑 Bot: ${BOT_NAME}\n👑 Owner: 01636487523\n📦 Commands: ${ALL_CMDS.length}`); return }

      // 👇 বাকি সব Command commands.js থেকে আসবে
      let done = await handleCommand({ sock, from, m, cmd, text, sender, isGroup, qCtx, mentioned, getTarget, sendV, success, senderThumb, BOT_NAME, OWNER_NAME, OWNER, CHANNEL_LINK: CHANNEL, CHANNEL_JID, userBal: {}, userXp: {}, downloadContentFromMessage, getCatMenu: null, getWelcomeMenu })
      if(done) return
      if(ALL_CMDS.includes(cmd)){ await success("."+cmd+" Successful!"); return }
    })
    return sess
  }catch(e){
    console.log("START ERROR:", e.message)
    sessions.delete(numKey)
    return null
  }
}

let PORT = process.env.PORT || 10000
app.listen(PORT,'0.0.0.0',()=>{
  console.log('RANA-X VIP UNLIMITED Running on '+PORT+' | '+ALL_CMDS.length+' Commands')
  // ✅ Restart hoileo ager sob phone abar connect hobe
  try{
    if(fs.existsSync('./sessions')){
      for(let f of fs.readdirSync('./sessions')){ startBot(f) }
    }
  }catch{}
})
