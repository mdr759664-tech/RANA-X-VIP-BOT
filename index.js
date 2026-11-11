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

let welcomeOn = true, goodbyeOn = true, autoReactOn = true, recentOn = true
let sockMain = null, isConnected = false, qrData = null
let restartTimer = null, lastPairTime = 0, isStarting = false
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🥰","😍","💥","⚡","🌸","🌺","🎉","💯","✅","😂","🤣","😁","🥳","😏","🖤","🤍","💙","💚","💜"]
const recentMsgs = [], recentCmds = []
let userBal = {}, userXp = {}

// ===== 💾 DB - Warning Save থাকবে, Restart দিলেও মুছবে না =====
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
function vBox(txt, thumb){
  return { text: txt, contextInfo: { externalAdReply: { title: "WhatsApp ✅", body: "01636487523 • Status | Contact: RANA", thumbnail: thumb || null, mediaType: 1, sourceUrl: "https://whatsapp.com", renderLargerThumbnail: false, showAdAttribution: true } } }
}
async function getSenderThumb(sock, sender){
  try{ let url = await sock.profilePictureUrl(sender, 'image'); let res = await axios.get(url, { responseType: 'arraybuffer' }); return Buffer.from(res.data) }catch{ return null }
}
// ===== 🔥 সুন্দর Menu - আগেরটার চেয়ে সুন্দর =====
async function sendMenuWithChannel(sock, from, msg, thumb){
  let menuTxt = ""
  try{ menuTxt = getMenuText(OWNER_NAME, OWNER, CHANNEL) }catch{ menuTxt = `👑 ${BOT_NAME} 👑\nTotal: ${ALL_CMDS.length} Commands\nOwner: 01636487523` }
  let pretty = `╭─━─━─━─💜─━─━─━─╮\n┃ 👑 𝗥𝗔𝗡𝗔-𝗫-𝗩𝗜𝗣 👑 ┃\n╰─━─━─━─💜─━─━─━─╯\n\n${menuTxt}\n\n┏━━━━━━━━━━━━━━┓\n┃ 👑 Owner: ${OWNER_NAME}\n┃ 📞 01636487523\n┃ 📦 ${ALL_CMDS.length}+ Commands\n┃ 🔥 Status: Online\n┗━━━━━━━━━━━━━━┛\n\n📢 *Channel:* ${CHANNEL}\n╰─➤ *POWERED BY RANA X VIP* 👑💜`
  await sock.sendMessage(from, {
    text: pretty,
    contextInfo: {
      forwardingScore: 999, isForwarded: true,
      forwardedNewsletterMessageInfo: { newsletterJid: CHANNEL_JID, newsletterName: BOT_NAME, serverMessageId: 1 },
      externalAdReply: { title: "WhatsApp ✅", body: "01636487523 • Status | Contact: RANA", thumbnail: thumb, mediaType: 1, sourceUrl: CHANNEL, renderLargerThumbnail: false, showAdAttribution: true }
    }
  }, {quoted: msg})
}
// ===== ⚠️ 1-2-3 WARNING SYSTEM =====
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

app.get('/', (req,res)=> res.send('<h1 style="text-align:center;font-family:sans-serif">👑 RANA-X-VIP-BOT<br><br>Commands: '+ALL_CMDS.length+'</h1>'))
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
          let pp; try{ pp = await sock.profilePictureUrl(num, 'image') }catch{ pp = BOT_PIC }
          if(anu.action == 'add' && welcomeOn){
            let t = getWelcomeMenu ? getWelcomeMenu(num, gName, memberCount, OWNER_NAME) : `╭─━─💜─━─╮\n┃ ✨ WELCOME ✨ ┃\n╰─━─💜─━─╯\n\n🌸 হ্যালো @${userName} !\n💖 *${gName}* এ স্বাগতম!\n👥 মোট: ${memberCount} জন\n📅 ${date} | 🕒 ${time}\n👑 Owner: ${OWNER_NAME}\n\n💡 .menu লিখে সব দেখো`
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
      const senderThumb = await getSenderThumb(sock, sender)
      const sendV = async (txt) => sock.sendMessage(from, vBox(txt, senderThumb), {quoted:m})
      const success = async (txt) => sock.sendMessage(from, vBox(txt.startsWith("✅")||txt.startsWith("❌") ? txt : "✅ "+txt, senderThumb), {quoted:m})
      const getTarget = () => mentioned[0] || (qCtx?.participant) || null
      const needAdmin = async ()=>{ if(!isGroup){ await sendV("❌ Group e use koro bhai!"); return false } let a = await isAdminCheck(sock, from, sender); if(!a && !isOwnerNum(sender)){ await sendV("❌ শুধু Group Admin ব্যবহার করতে পারবে!"); return false } return true }

      if(recentOn && body){
        try{ let e = EMOJI[Math.floor(Math.random()*EMOJI.length)]; await sock.sendMessage(from, { react: { text: e, key: m.key } }) }catch{}
        recentMsgs.push({ txt: body.slice(0,60), user: sender.split('@')[0], emoji: "🔥" })
        if(recentMsgs.length>30) recentMsgs.shift()
      }

      // ===== 🛡️ LINK / BAD WORD / SPAM - Command ছাড়া মেসেজেও ধরবে =====
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

      // ===== 🛡️ Antilink / Warn Commands =====
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

      if(cmd==='welcome' && text==='on'){ welcomeOn=true; await success("Welcome ON"); return }
      if(cmd==='welcome' && text==='off'){ welcomeOn=false; await success("Welcome OFF"); return }
      if(cmd==='goodbye' && text==='on'){ goodbyeOn=true; await success("Goodbye ON"); return }
      if(cmd==='goodbye' && text==='off'){ goodbyeOn=false; await success("Goodbye OFF"); return }
      if(cmd==='recent' && text==='on'){ recentOn=true; await success("Recent ON"); return }
      if(cmd==='recent' && text==='off'){ recentOn=false; await sendV("❌ Recent OFF"); return }
      if(cmd==='welcome'){ await sendV(welcomeOn?"✅ Welcome: ON":"❌ Welcome: OFF"); return }
      if(cmd==='goodbye'){ await sendV(goodbyeOn?"✅ Goodbye: ON":"❌ Goodbye: OFF"); return }
      if(cmd==='recent' || cmd==='trending'){
        let r = [...recentMsgs].slice(-10).map(x=> `${x.emoji} @${x.user}: ${x.txt}`).join("\n")
        await sendV(`🔥 *RECENT*\n\n${r||"No recent yet"}\n\n💜 ${BOT_NAME}`)
        return
      }
      if(cmd==='menu' || cmd==='allmenu' || cmd==='commands' || cmd==='list'){ await sendMenuWithChannel(sock, from, m, senderThumb); return }
      if(cmd==='channel' || cmd==='channellink' || cmd==='viewchannel' || cmd==='joinchannel' || cmd==='follow'){ await sendV("📢 Follow Channel:\n"+CHANNEL); return }
      if(cmd==='ping' || cmd==='pong' || cmd==='speed'){ await success(`🏖️ PONG: ${Date.now()%200+45} Ms\n👑 Bot: ${BOT_NAME}\n👑 Owner: 01636487523\n📦 Commands: ${ALL_CMDS.length}\n⚡ Status: Online`); return }

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
app.listen(PORT,'0.0.0.0',()=>{ startBot(); console.log('RANA-X VIP Running on '+PORT+' | '+ALL_CMDS.length+' Commands') })
