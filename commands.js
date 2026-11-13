// ===== RANA-X-VIP - commands.js - FULL - PRIVATE CUT - Private Sudhu index.js e =====
const axios = require('axios')
const EMOJIS = ["❤️","🔥","👑","😎","✨","💖","🥰","😍","💥","⚡","🌸","🌺","🎉","💯","✅","😂","🤣","😁","🥳","😏","🖤","🤍","💙","💚","💜","🧡","❣️","💕","💞","💓","💗","💘","💝","😘","😗","😙","😚","🤗","🤩","🤤","😋","🤫","🤭","🫣","🤔","🤨","😐","😑","😶","😒","🙄","😬","😌","😔","😪","😴","🤒","🤕","🤮","🥵","🥶","🥴","😵","🤯","🤓","🥺","😭","😢","😤","😡","🤬","👿","💀","☠️","👻","👽","🤖","💩","👋","🤚","🖐️","✋","🖖","👌","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","👍","👎","👊","✊","👏","🙌","🫶","🤝","🙏","💪"]
const OWNER_NAME_FIX = "✷𐏓꯭⸙Ξ⤹𝐑𝐀𝐍𝐀𐏓𝐁𝐀𝐏𝐏𝐘⟭꯭⎯۞"
const CATS = {
  "OWNER": ["owner","creator","public","mode","botmode","support","donate","repo","script","deploy","pair","session","reset","restart","broadcast","bc","join","leave","block","unblock","ban","unban","sudo","del","delete","shutdown","eval"],
  "MAIN": ["menu","menu2","allmenu","help","commands","list","ping","pong","speed","runtime","uptime","alive","info","bot","about","profile","myinfo","id","stats","system","version","ownerinfo","botinfo","cam","pic"],
  "FUN": ["joke","meme","fact","quote","shayari","love","crush","propose","slap","kiss","hug","pat","cuddle","dance","sing","roast","insult","compliment","truth","dare","ship","compatibility","beautiful","ugly","luck","horoscope","zodiac","aura","vibe","fun","happy","sad","angry","cry","laugh","smile","wink","poke","tickle","bite","wave","hello","bye","goodmorning","goodnight"],
  "GAME": ["tictactoe","quiz","riddle","guess","dice","coin","slot","rps","blackjack","trivia","math","word","hangman","flip","roll","lottery","football","cricket","hunt","fight","battle","duel","race","truthordare","wouldyou","neverhave"],
  "DOWNLOADER": ["play","song","video","romantic","dj","funny","romanticvideo","djbangla","funnyvideo","ytmp3","ytmp4","tiktok","igdl","fbdl","reels","insta","spotify","pinterest","mediafire","terabox","apk","wallpaper","ringtone","ytaudio","ytvideo","ytsearch","tiktokdl","fbvideo","mp3","mp4","audio","download","dl"],
  "IMAGE": ["sticker","s","vv","vv2","vv3","viewonce","take","steal","toimg","toimage","tovid","tomp3","blur","circle","invert","grey","attp","ttp","emojimix","removebg","upscale","enhance","cartoon","anime","logo","banner","thumbnail","poster","dp","pfp","avatar","background","neon","glow"],
  "GROUP": ["admin","admins","announce","antibot","antilink","antispam","approve","close","desc","disappear","everyone","filter","groupinfo","hidetag","invite","kick","kickall","leave","linkgroup","lock","mute","open","poll","promote","reject","requests","revoke","rtag","setgpp","subject","tag","tagadmins","tagall","togroupstatus","totag","unlock","unmute","warn","welcome","goodbye","setdesc","setname","link","members","online","vote","rules","groupname","groupdesc","add","demote","setppgc","groupopen","groupclose","kickme","adminlist","memberlist","warns","resetwarn","antibadword","antibad","recent","react","autoreact"],
  "SEARCH": ["google","image","img","yt","youtube","wiki","weather","news","translate","meaning","dictionary","lyrics","movie","series","animeinfo","github","stalk","search","find","lookup","check","ipinfo","screenshot","qrscan","ocr","define","synonym"],
  "TOOLS": ["calc","calculator","qr","qrcode","short","url","paste","tts","voice","ai","gpt","ask","chat","imagine","draw","gemini","translate2","currency","convert","timer","reminder","note","notes","todo","password","random","font","fancy","styletext","reverse","uppercase","lowercase","count","wordcount","age","bmi","lovecalc"],
  "ECONOMY": ["balance","bank","daily","work","rob","gamble","bet","lottery2","shop","buy","sell","transfer","pay","leaderboard","top","rich","wallet","deposit","withdraw","money","cash","gold","diamond","xp","level","rank","claim","gift","bonus","jackpot","casino","roulette","loan","invest","stock","crypto","trade","market"],
  "LOVE": ["couple","love2","marry","divorce","propose2","rose","gift2","hug2","kiss2","miss","crush2","bf","gf","partner","soulmate","lovestory","lovepoem","loveshayari","breakup","dating","flirt","pickup","romantic","valentine","anniversary","wedding","single","lovemeter","lovetest","heart","heartbreak","lonely","missyou","loveyou"],
  "ISLAMIC": ["quran","hadith","dua","namaz","azan","ramadan","allah","islam","surah","ayat","prayer","tasbih","islamic","muslim","namaztime","prayertime","qibla","hajj","umrah","zakat","eid","jumma","allahname","prophet","muhammad","dua2","kalima","salah","wudu","roza","iftar","sehri","eidmubarak","gojol","nasheed"],
  "MUSIC": ["lyrics2","play2","playlist","radio","bass","nightcore","slowed","reverb","8d","lofi","remix","song2","music","audio2","mp3dl","spotifydl","hindi","bangla","english","punjabi","tamil","hiphop","rap","pop","rock","jazz","dj","beat","singer","album","topmusic"],
  "EDUCATION": ["math2","science","history","english2","bangla2","gk","exam","question","answer","homework","essay","story","poem","letter","study","school","college","university","teacher","student","book","books","novel","geography","physics","chemistry","biology","maths","algebra","computer","programming","coding","python","javascript","java","html","css","space","nasa","earth","moon","animal","health","doctor","yoga","recipe","travel","country","language","business","law","police","army"],
  "ATTITUDE": ["bio","caption","status","attitude","sad2","happy2","alone","broken","savage","cool","king","queen","boss","legend","attitude2","sadstatus","savagestatus","kingstatus","queenstatus","badboy","badgirl","hero","villain","ninja","dragon","phoenix","tiger","lion","wolf","ghost","devil","angel","star","moon","sun","sky","dream","magic","power","fire","ice","storm","dark","light","pro","x","ultra","pawar"],
  "ANIME": ["waifu","neko","shinobu","megumin","anime2","manga2","cosplay","naruto","onepiece","dragonball","animegirl","bite2","blush","bonk","cry2","cuddle2","dance2","facepalm","highfive","hug3","kiss3","laugh2","lick","nom","nuzzle","pat2","poke2","slap2","smile2","smug","animeboy","animesearch","animequote","animewall","animepic","animememe"],
  "REACTION": ["slap3","hug4","kiss4","pat3","cuddle3","poke3","bite3","lick2","nom2","blush2","smile3","cry3","laugh3","dance3","wave2","highfive2","tickle2","tease","comfort","cheer","motivate","congrats","celebrate","party","clap","bow","salute","sorry","thankyou","goodluck","hugme","kissme","loveme"],
  "EMOJI": ["emoji","emoji2","emoji3","emoji4","emojis","emot","emojimix3","kaomoji","funemoji","loveemoji","sademoji","animalemoji","foodemoji","flagemoji","heartemoji","fireemoji","cuteemoji"],
  "PREMIUM": ["premium","vip","buybot","rent","panel","hosting","session2","pair2","trending","new","topbot","bestbot","vip2","premium2","gold2","diamond2","elite","legend2","master","superbot","turbo","max","ultrapro"],
  "STICKER PACK": ["stickerpack","stickerlist","stickermaker","stickerfun","stickerlove","stickersad","stickerangry","stickeranime","stickerdog","stickercat","stickerbaby","stickerboy","stickergirl","stickerking","stickerqueen","stickermeme","stickeremoji2","stickerattitude","stickercute","stickerhot","stickercool","stickerfunny","stickerhappy","stickerbirthday","stickergoodmorning","stickergoodnight","stickereid"],
  "GENERAL": ["hi","hello2","hey","yo","hii","hola","namaste","assalamualaikum","salam","goodday","welcome3","thank","thanks","please","sorry2","excuse","congrats2","happybirthday","birthday","anniversary2","newyear","christmas","diwali","eid2","holi","goodluck2","takecare","seeyou","missyou2","loveyou2","cute2","smart2","beautiful3","cool2","awesome","amazing","wow","omg","lol","haha","ok","yes","no","maybe"],
  "CHANNEL": ["channel","follow","joinchannel","viewchannel","channellink","channelmenu"]
}
let ALL_CMDS = []
for(let k in CATS) ALL_CMDS = ALL_CMDS.concat(CATS[k])
ALL_CMDS = [...new Set(ALL_CMDS)]
function getCatMenu(cat){ if(!CATS[cat]) return null; let t = `╭─━─━─${cat}─━─━─╮\n`; CATS[cat].forEach((c,i)=>{ t += `┃ ${i+1}. .${c}\n` }); t += `╰─━─━─━─━─━─╯\n👑 RANA-X-VIP`; return t }
function getMenuText(ownerName, owner, channelLink){ let t = `━━━━━━━━━━━━━━\n👑 Owner: ${ownerName || OWNER_NAME_FIX}\n📞 Number: 01636487523\n📦 Total: ${ALL_CMDS.length} Commands\n━━━━━━━━━━━━━━\n\n`; for(let cat in CATS){ t += `🔥 *${cat}* (${CATS[cat].length})\n`; t += CATS[cat].slice(0,12).map(c=> `  • .${c}`).join("\n") + `\n`; if(CATS[cat].length > 12) t += `  • ... +${CATS[cat].length-12} more\n`; t += `\n` } t += `━━━━━━━━━━━━━━\n💡 Full list: .allmenu\n📢 Channel: ${channelLink || ""}\n👑 RANA-X-VIP`; return t }
function getWelcomeMenu(num, gName, count, ownerName){ let user = num.split('@')[0]; let date = new Date().toLocaleDateString('en-BD', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'long', year: 'numeric' }); let time = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true }); return `╭─━─━─━─💜─━─━─━─╮\n┃ ✨ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 ✨ ┃\n╰─━─━─━─💜─━─━─━─╯\n\n🌸 হ্যালো @${user} ! 🥰\n💖 *${gName}* গ্রুপে তোমাকে স্বাগতম!\n\n┏━━━━━━━━━━━━━━┓\n┃ 👤 নাম: @${user}\n┃ 👥 মোট সদস্য: ${count} জন\n┃ 📅 তারিখ: ${date}\n┃ 🕒 সময়: ${time}\n┃ 👑 Owner: ${ownerName || OWNER_NAME_FIX}\n┗━━━━━━━━━━━━━━┛\n\n💡 .menu লিখে সব Command দেখো\n🎉 মজা করো, Active থাকো!\n╰─➤ *POWERED BY RANA X VIP* 👑💜` }
function getGoodbyeMenu(num, gName, count){ let user = (num||"").split('@')[0]; return `╭─━─━─━─💔─━─━─━─╮\n┃ 🥺 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 🥺 ┃\n╰─━─━─━─💔─━─━─━─╯\n\n🥺 @${user} চলে গেলো! 💔\n💖 *${gName}* থেকে বিদায়!\n\n┏━━━━━━━━━━━━━━┓\n┃ 👥 বর্তমান সদস্য: ${count} জন\n┃ 👑 Owner: ${OWNER_NAME_FIX}\n┗━━━━━━━━━━━━━━┛\n\n🥺 ভালো থেকো!\n╰─➤ *POWERED BY RANA X VIP* 👑💜` }
const JOKES = ["😂 Teacher: Poralekha keno koro na?\nStudent: Sir, WhatsApp Bot chalai, RANA X VIP BOT! 🤣","😂 Amar bot er 500+ command, ar amar exam e 0 number 😭🤣","😂 Girlfriend: Tumi amake time dao na!\nBoyfriend: Bot er command likhte hoy! 🤣","😂 Wifi slow hoile mone hoy jibon slow! 📶😭"]
const QUOTES = ["💡 Shopno dekho boro, bot chalao RANA X VIP diye! 👑","💡 Hard work + Smart work = Success! 🔥","💡 Jibone har manba na, RANA er moto agay jaba! 👑"]
const FACTS = ["🧠 Fact: Modhu kokhono nosto hoy na! 🍯","🌍 Fact: Prithibi te proti second e 2 jon manush jonmay! 👶","🔥 Fact: RANA X VIP - Bangladesh er sera Bot! 👑"]
const SHAYARI = ["💔 Tumi chara jibon ta faka faka lage...\nBot chara phone ta faka faka lage! 😭💜","❤️ Chokhe chokh porle mon ta kape...\nRANA er Bot dekhle sobai hape! 😍🔥"]
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)] }
function rand(n){ return Math.floor(Math.random()*n) }
async function getWiki(q){ try{ let r = await axios.get("https://en.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(q), {timeout:10000}); if(r.data?.extract) return r.data.extract.slice(0,800) }catch{} return null }
async function getPipedVideo(query){ let servers = ["https://piped.video","https://pipedapi.kavin.rocks","https://pipedapi-libre.kavin.rocks","https://pipedapi.adminforge.de","https://pipedapi.leptons.xyz"]; for(let sv of servers){ try{ let r = await axios.get(sv+"/search?q="+encodeURIComponent(query)+"&filter=videos", {timeout:12000}); let items = r.data?.items||[]; if(items[0]) return {v:items[0], sv} }catch{} } return null }
async function getPipedAudio(v, sv){ let vid = (v.url||"").split("watch?v=")[1]||v.id; let st = await axios.get(sv+"/streams/"+vid, {timeout:20000}); let audios = [...(st.data?.audioStreams||[]), ...(st.data?.adaptiveFormats?.filter(x=>x.mimeType?.includes("audio"))||[])]; audios.sort((a,b)=>(b.bitrate||0)-(a.bitrate||0)); return {audios, vids: st.data?.videoStreams||[], vid} }
async function sendPipedAudio(o, query, v, sv){ let {audios} = await getPipedAudio(v, sv); if(!audios[0]?.url) return false; let aud = await axios.get(audios[0].url, {responseType:'arraybuffer', timeout:90000, headers:{'User-Agent':'Mozilla/5.0'}}); if(aud.data.byteLength < 500000) return false; await o.sock.sendMessage(o.from, {audio: Buffer.from(aud.data), mimetype:'audio/mp4', fileName:(v.title||query)+".mp3", contextInfo:{externalAdReply:{title:v.title||query, body:"👑 RANA-X-VIP-BOT - FULL SONG", thumbnail:o.senderThumb, mediaType:1, sourceUrl:o.CHANNEL_LINK}}}, {quoted:o.m}); return true }
// ❌ PRIVATE CUT - Private ekhon sudhu index.js e - ekhane ar nai
async function checkAntilink(o){
  const { sock, from, m, sender, isGroup, msgText, OWNER, CHANNEL_LINK } = o
  if(!isGroup) return false
  if(!globalThis.BOT_STATE?.antilinkOn) return false
  if(m.key.fromMe) return false
  let body = msgText || ""
  if(!body) return false
  if(body.startsWith('.') || body.startsWith('!')) return false
  let isLink = /https?:\/\/|chat\.whatsapp\.com|wa\.me\/|www\.|t\.me\/|instagram\.com|facebook\.com|youtube\.com|youtu\.be|tiktok\.com/i.test(body)
  if(!isLink) return false
  if(CHANNEL_LINK && body.includes(CHANNEL_LINK)) return false
  if(body.includes("whatsapp.com/channel")) return false
  try{
    let meta = await sock.groupMetadata(from)
    let me = meta.participants.find(p=>p.id===sender)
    if(me?.admin) return false
    if(sender.replace(/[^0-9]/g,'') === String(OWNER).replace(/[^0-9]/g,'')) return false
  }catch{}
  if(!globalThis.ANTILINK_WARN) globalThis.ANTILINK_WARN = {}
  let key = from + "_" + sender
  globalThis.ANTILINK_WARN[key] = (globalThis.ANTILINK_WARN[key] || 0) + 1
  let count = globalThis.ANTILINK_WARN[key]
  try{ await sock.sendMessage(from, {delete:{remoteJid:from, fromMe:false, id:m.key.id, participant:sender}}) }catch{}
  if(count >= 3){
    globalThis.ANTILINK_WARN[key] = 0
    await sock.sendMessage(from, {text: `🚫 @${sender.split('@')[0]} - antilink violation (Link) Warning 3/3.\n3 বার Link দিছে - KICK করা হইলো! 💥`, mentions:[sender]})
    try{ await sock.groupParticipantsUpdate(from, [sender], "remove") }catch{ await sock.sendMessage(from, {text: "❌ Kick করতে পারলাম না! বটকে Admin দাও!"}) }
  } else {
    await sock.sendMessage(from, {text: `⚠️ @${sender.split('@')[0]} - antilink violation (Link) Warning ${count}/3.\nLink দেওয়া নিষেধ! আবার দিলে KICK! ❌`, mentions:[sender]})
  }
  return true
}
async function handleCommand(o){
  const { sock, from, m, cmd, text, sender, isGroup, qCtx, mentioned, getTarget, sendV, success, senderThumb, BOT_NAME, OWNER_NAME, OWNER, CHANNEL_LINK, CHANNEL_JID, needAdmin, userBal, userXp, downloadContentFromMessage } = o
  const reply = sendV
  let st = o.state || globalThis.BOT_STATE || { recentOn: true, autoReactOn: true, welcomeOn: true, goodbyeOn: true, antilinkOn: true }
  if(!globalThis.BOT_STATE) globalThis.BOT_STATE = st
  if(!globalThis.BOT_MODE) globalThis.BOT_MODE = "public"
  // ❌ PRIVATE CUT - ekhane private ar nai - index.js e cholbo
  // ✅ MODE - private ekhane nai - .mode private diya Mode bodlaiba
  if(['public','mode','botmode'].includes(cmd)){
    if(sender.replace(/[^0-9]/g,'') !== OWNER){ await reply("❌ এই Command খালি Owner চালাইতে পারবো!"); return true }
    if(cmd==='public'){ globalThis.BOT_MODE="public"; await reply("✅ Bot এখন *PUBLIC* 🔥\nএখন যে কেউ .menu .song .video চালাইতে পারবো!"); return true }
    if(text.toLowerCase().trim()==='private'){ globalThis.BOT_MODE="private"; await reply("🔒 Bot এখন *PRIVATE* 🔒\nএখন খালি তুমি চালাইতে পারবা!"); return true }
    if(text.toLowerCase().trim()==='public'){ globalThis.BOT_MODE="public"; await reply("✅ Bot এখন *PUBLIC* 🔥"); return true }
    await reply(globalThis.BOT_MODE==="private" ? "🔒 Bot এখন *PRIVATE*\nPublic করতে: .mode public" : "✅ Bot এখন *PUBLIC*\nPrivate করতে: .mode private"); return true
  }
  if(cmd==='recent' && text==='on'){ st.recentOn=true; st.autoReactOn=true; globalThis.BOT_STATE.recentOn=true; globalThis.BOT_STATE.autoReactOn=true; await reply("✅ Recent ON + Emoji React ON 🔥\nএখন সব মেসেজে Emoji মারবো!"); return true }
  if(cmd==='recent' && text==='off'){ st.recentOn=false; st.autoReactOn=false; globalThis.BOT_STATE.recentOn=false; globalThis.BOT_STATE.autoReactOn=false; await reply("❌ Recent OFF + Emoji React OFF\nএখন আর Emoji মারবো না!"); return true }
  if(cmd==='recent' || cmd==='trending'){ await reply(st.recentOn ? "✅ Recent: ON 🔥 + Emoji React: ON\nOFF করতে: .recent off" : "❌ Recent: OFF + Emoji React: OFF\nON করতে: .recent on"); return true }
  if(cmd==='react' && text==='on'){ st.autoReactOn=true; globalThis.BOT_STATE.autoReactOn=true; await reply("✅ Random Emoji React ON 🔥"); return true }
  if(cmd==='react' && text==='off'){ st.autoReactOn=false; globalThis.BOT_STATE.autoReactOn=false; await reply("❌ Random Emoji React OFF\nএখন আর Emoji মারবো না!"); return true }
  if(cmd==='react' || cmd==='autoreact'){ await reply(st.autoReactOn ? "✅ React: ON 🔥\nOFF করতে: .react off" : "❌ React: OFF\nON করতে: .react on"); return true }
  if(cmd==='welcome' && text==='on'){ st.welcomeOn=true; globalThis.BOT_STATE.welcomeOn=true; await reply("✅ Welcome ON"); return true }
  if(cmd==='welcome' && text==='off'){ st.welcomeOn=false; globalThis.BOT_STATE.welcomeOn=false; await reply("❌ Welcome OFF"); return true }
  if(cmd==='welcome'){ await reply(st.welcomeOn ? "✅ Welcome: ON" : "❌ Welcome: OFF"); return true }
  if(cmd==='goodbye' && text==='on'){ st.goodbyeOn=true; globalThis.BOT_STATE.goodbyeOn=true; await reply("✅ Goodbye ON"); return true }
  if(cmd==='goodbye' && text==='off'){ st.goodbyeOn=false; globalThis.BOT_STATE.goodbyeOn=false; await reply("❌ Goodbye OFF"); return true }
  if(cmd==='goodbye'){ await reply(st.goodbyeOn ? "✅ Goodbye: ON" : "❌ Goodbye: OFF"); return true }
  if(cmd==='antilink' && text==='on'){ st.antilinkOn=true; globalThis.BOT_STATE.antilinkOn=true; await reply("✅ Anti-Link ON 🔥\nLink দিলে: 1/3 -> 2/3 -> 3/3 = KICK!"); return true }
  if(cmd==='antilink' && text==='off'){ st.antilinkOn=false; globalThis.BOT_STATE.antilinkOn=false; await reply("❌ Anti-Link OFF\nএখন Link দিলে কিছু হইবো না!"); return true }
  if(cmd==='antilink'){ await reply(st.antilinkOn ? "✅ Anti-Link: ON 🔥\nLink দিলে 3 বার Warning -> KICK\nOFF করতে: .antilink off" : "❌ Anti-Link: OFF\nON করতে: .antilink on"); return true }
  if(cmd==='del' || cmd==='delete'){
    let q = qCtx; if(!q?.stanzaId){ await reply("❌ যেই মেসেজ ডিলিট করবা, ঐটাতে Reply দিয়া লেখ:\n.del"); return true }
    try{ await sock.sendMessage(from, {delete:{remoteJid:from, fromMe:false, id:q.stanzaId, participant:q.participant}}); await reply("✅ ডিলিট হইছে!") }catch{ await reply("❌ ডিলিট করতে পারলাম না! বটকে Admin দাও!") }
    return true
  }
  if(cmd==='warn'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    let t = getTarget(); if(!t){ await reply("❌ কাকে Warn করবো? Tag করো!"); return true }
    if(!globalThis.WARNS) globalThis.WARNS = {}; globalThis.WARNS[t]=(globalThis.WARNS[t]||0)+1
    if(globalThis.WARNS[t]>=3){ globalThis.WARNS[t]=0; await sock.sendMessage(from,{text:`🚫 @${t.split('@')[0]} 3 বার Warn খাইছে - KICK!`, mentions:[t]}); try{ await sock.groupParticipantsUpdate(from,[t],"remove") }catch{ await reply("❌ Kick করতে পারলাম না! বটকে Admin দাও!") } }
    else await reply(`⚠️ @${t.split('@')[0]} Warning ${globalThis.WARNS[t]}/3`)
    return true
  }
  if(cmd==='warns' || cmd==='warnlist'){
    let list = Object.entries(globalThis.WARNS||{}).filter(([k,v])=>v>0)
    if(!list.length){ await reply("✅ কারো Warn নাই!"); return true }
    await reply("⚠️ *WARN LIST*\n"+list.map(([id,c])=>`@${id.split('@')[0]} - ${c}/3`).join("\n")); return true
  }
  if(cmd==='resetwarn' || cmd==='resetwarns'){ let t = getTarget(); if(!t){ await reply("❌ কাকে Reset করবো? Tag করো!"); return true } globalThis.WARNS[t]=0; await reply(`✅ @${t.split('@')[0]} এর Warn Reset হইছে!`); return true }
  if(cmd==='help'){
    if(!text){ await reply(`💡 Usage: .help <command>\nEx: .help sticker\nTotal: ${ALL_CMDS.length} Commands\n📢 ${CHANNEL_LINK}`); return true }
    if(ALL_CMDS.includes(text.toLowerCase())){ await reply(`╭── .${text.toLowerCase()}\n│ Available in ${BOT_NAME}\n│ Total: ${ALL_CMDS.length}\n│ Use: .${text.toLowerCase()}\n╰── Owner: ${OWNER_NAME || OWNER_NAME_FIX}`); return true }
    await reply(`❌ .${text} পাই নাই। .menu লেখো`); return true
  }
  if(cmd==='owner' || cmd==='creator' || cmd==='ownerinfo'){
    let vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:'+OWNER_NAME_FIX+'\nORG:'+OWNER_NAME_FIX+'\nTEL;type=CELL;type=VOICE;waid=8801636487523:+880 1636-487523\nEND:VCARD'
    await sock.sendMessage(from, {contacts:{displayName:OWNER_NAME_FIX, contacts:[{displayName:OWNER_NAME_FIX, vcard}]}}, {quoted:m})
    await reply(`👑 OWNER: ${OWNER_NAME || OWNER_NAME_FIX}\n📞 Number: ${OWNER}\n📦 Commands: ${ALL_CMDS.length}\n💬 wa.me/8801636487523\n📢 ${CHANNEL_LINK}`); return true
  }
  if(cmd==='bot' || cmd==='botinfo' || cmd==='about' || cmd==='info'){ await reply(`👑 *${BOT_NAME}*\n━━━━━━━━━━━━━━\n👑 Owner: ${OWNER_NAME || OWNER_NAME_FIX}\n📞 01636487523\n📦 Commands: ${ALL_CMDS.length}\n⚡ Status: Online\n🔥 Version: VIP v2\n🔥 Mode: ${globalThis.BOT_MODE.toUpperCase()}\n📢 ${CHANNEL_LINK}`); return true }
  if(cmd==='runtime' || cmd==='uptime'){ let s = Math.floor(process.uptime()); let h = Math.floor(s/3600), mm = Math.floor((s%3600)/60), ss = s%60; await reply(`⏰ *RUNTIME*\n${h}h ${mm}m ${ss}s Online\n👑 ${BOT_NAME}`); return true }
  if(cmd==='myinfo' || cmd==='profile' || cmd==='id'){ await reply(`👤 *YOUR INFO*\n━━━━━━━━━━━━━━\n📞 Number: @${sender.split('@')[0]}\n🆔 JID: ${sender}\n👑 Bot: ${BOT_NAME}\n📢 ${CHANNEL_LINK}`); return true }
  if(cmd==='cam' || cmd==='pic'){ await sock.sendMessage(from, {image:{url:"https://i.ibb.co.com/Pz52VSWF/IMG-20261027-WA0000.jpg"}, caption: BOT_NAME}, {quoted:m}); return true }
  if(cmd==='joke'){ await reply(pick(JOKES)); return true }
  if(cmd==='meme'){ try{ let r = await axios.get("https://meme-api.com/gimme", {timeout:10000}); await sock.sendMessage(from, {image:{url:r.data.url}, caption:`😂 *${r.data.title}*\n👑 ${BOT_NAME}`}, {quoted:m}) }catch{ await reply("😂 MEME: Amar bot er 500+ command, ar amar exam e 0 number 😭🤣") } return true }
  if(cmd==='fact'){ try{ let r = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random", {timeout:10000}); await reply(`🧠 Fact: ${r.data.text}`) }catch{ await reply(pick(FACTS)) } return true }
  if(cmd==='quote'){ await reply(pick(QUOTES)); return true }
  if(cmd==='shayari'){ await reply(pick(SHAYARI)); return true }
  if(cmd==='love' || cmd==='crush'){ await reply("💘 Crush: Tomar crush tomakeo valobashe! 99% sure! 🥰"); return true }
  if(cmd==='couple'){ await reply("❤️ Couple: Tumi ar tomar crush - Best Juti! 🥰"); return true }
  if(cmd==='propose'){ await reply("💍 Propose: Ami tomake onek valobashi! Tumi ki amar hoba? 🥺❤️"); return true }
  if(cmd==='slap' || cmd==='slap2' || cmd==='slap3'){ let t = getTarget(); if(!t){ await reply("❌ Kake slap korbo? Tag koro!"); return true } await reply(`👋 @${sender.split('@')[0]} slapped @${t.split('@')[0]} ! 😂👋`); return true }
  if(cmd==='kiss' || cmd==='kiss2' || cmd==='kiss3' || cmd==='kiss4'){ await reply("😘 Kiss: Sweet kiss! 💋❤️"); return true }
  if(cmd==='hug' || cmd==='hug2' || cmd==='hug3' || cmd==='hug4'){ await reply("🤗 Hug: Boro hug dilam! 🤗💖"); return true }
  if(cmd==='pat' || cmd==='pat2' || cmd==='pat3'){ await reply("🥰 Pat: Mathay hat bulay dilam! 🥰"); return true }
  if(cmd==='roast' || cmd==='insult'){ await reply("🔥 Roast: Tomar mathay buddhi kom, kintu Bot chalano te sera! 😂🔥"); return true }
  if(cmd==='compliment'){ await reply("🌸 Compliment: Tumi ajke onek sundor lagteso! 😍🌸"); return true }
  if(cmd==='truth'){ await reply("🤔 Truth: Jibone kauke valobashcho? Sotti bolo! 😏"); return true }
  if(cmd==='dare'){ await reply("😈 Dare: Group e 3 bar 'Ami RANA er fan' likho! 😂"); return true }
  if(cmd==='ship' || cmd==='compatibility'){ let t = getTarget(); let p = t ? 50+rand(50) : 70+rand(30); await reply(`💘 *SHIP*\n@${sender.split('@')[0]} ❤️ @${t ? t.split('@')[0] : "Crush"}\n💖 Compatibility: ${p}%\n${p>85 ? "🔥 Perfect Juti!" : p>60 ? "🥰 Valo manabe!" : "😅 Try koro!"}`); return true }
  if(cmd==='luck' || cmd==='horoscope' || cmd==='zodiac' || cmd==='aura' || cmd==='vibe'){ await reply(`🔮 *LUCK*\nAjke tomar luck: ${50+rand(50)}%\n🍀 Lucky Color: ${pick(["Lal","Nil","Sobuj","Golapi","Kalo"])}\n👑 ${BOT_NAME}`); return true }
  if(cmd==='beautiful' || cmd==='beautiful3'){ await reply(`😍 Beautiful: Tumi ${70+rand(30)}% sundor! 🥰🌸`); return true }
  if(cmd==='hello' || cmd==='hi' || cmd==='hey' || cmd==='hii' || cmd==='hola' || cmd==='yo'){ await reply(`👋 Hello @${sender.split('@')[0]}! Kemon acho? 🥰\n💡 .menu likho!`); return true }
  if(cmd==='bye'){ await reply(`👋 Bye @${sender.split('@')[0]}! Abar asba! 🥺💜`); return true }
  if(cmd==='goodmorning'){ await reply("🌅 Good Morning! Ajker din ta valo katuk! 🥰☀️"); return true }
  if(cmd==='goodnight'){ await reply("🌙 Good Night! Sundor ghum hok! 😴💜"); return true }
  if(cmd==='dice' || cmd==='roll'){ await reply(`🎲 Dice: ${1+rand(6)}\n👑 ${BOT_NAME}`); return true }
  if(cmd==='coin' || cmd==='flip'){ await reply(`🪙 Coin: ${pick(["Head","Tail"])}!`); return true }
  if(cmd==='slot'){ let s = ["🍒","🔥","💎","👑","⭐","🍓"]; let a = pick(s), b = pick(s), c = pick(s); await reply(`🎰 SLOT\n${a} | ${b} | ${c}\n${a===b && b===c ? "🎉 JACKPOT! Tumi jitso!" : "😅 Abar try koro!"}`); return true }
  if(cmd==='rps'){ let u = text.toLowerCase(); let bot = pick(["rock","paper","scissor"]); if(!["rock","paper","scissor"].includes(u)){ await reply("✊✋✌️ Usage: .rps rock/paper/scissor"); return true } let win = (u==="rock"&&bot==="scissor")||(u==="paper"&&bot==="rock")||(u==="scissor"&&bot==="paper"); await reply(`✊✋✌️ Tumi: ${u} | Bot: ${bot}\n${u===bot ? "🤝 Draw!" : win ? "🎉 Tumi jitso!" : "😅 Bot jitlo!"}`); return true }
  if(cmd==='quiz' || cmd==='trivia' || cmd==='riddle' || cmd==='guess'){ try{ let r = await axios.get("https://opentdb.com/api.php?amount=1&type=multiple", {timeout:10000}); let q = r.data.results[0]; await reply(`🧠 Quiz: ${q.question}\nA) ${q.incorrect_answers[0]} B) ${q.incorrect_answers[1]} C) ${q.correct_answer}\nAnswer: ${q.correct_answer}`) }catch{ await reply("🧠 Quiz: Bangladesh er capital ki?\nA) Dhaka B) Chittagong\nAnswer: Dhaka! 🇧🇩") } return true }
  if(cmd==='math'){ try{ let expr = text.replace(/[^0-9+\-*/(). ]/g,''); if(!expr){ await reply("🧮 Usage: .math 2+2*3"); return true } await reply(`🧮 ${expr} = ${eval(expr)}`)}catch{ await reply("❌ Vul math!") } return true }
  if(cmd==='lottery' || cmd==='lottery2'){ await reply(`🎟️ Lottery Number: ${1000+rand(9000)}\n🍀 Good Luck!`); return true }
  if(['song','play','gan','music','gaan','gana','play2','song2','playlist','radio'].includes(cmd)){
    if(!text){ await reply("❌ গানের নাম দে ভাই!\nEx: .song Ami Tomake Valobashi"); return true }
    await reply("🔍 খুঁজতেছি... *"+text+"*")
    try{
      let got = await getPipedVideo(text); if(!got){ await reply("❌ গান পাইলাম না!"); return true }
      let ok = await sendPipedAudio(o, text, got.v, got.sv)
      if(ok){ await sock.sendMessage(from, {image: senderThumb, caption:`🎵 *${got.v.title||text}*\n👤 ${got.v.uploaderName||""}\n\n👑 *RANA-X-VIP-BOT*\n▶️ উপরের Audio তে চাপ দিলেই ফুল গান বাজবো!`}, {quoted:m}); return true }
    }catch(e){ console.log("Song fail:", e.message) }
    await reply("❌ ফুল গান পাইলাম না! ২ মিনিট পরে আবার লেখ:\n.song "+text); return true
  }
  if(['romantic','romanticvideo','lovevideo','dj','djbangla','djsong','djvideo','funny','funnyvideo','comedy','fany'].includes(cmd)){
    let query = text
    if(['romantic','romanticvideo','lovevideo'].includes(cmd)) query = text || "romantic bangla song"
    if(['dj','djbangla','djsong','djvideo'].includes(cmd)) query = text || "dj bangla song"
    if(['funny','funnyvideo','comedy','fany'].includes(cmd)) query = text || "funny bangla video"
    await reply("🎬 খুঁজতেছি... *"+query+"*")
    try{
      let got = await getPipedVideo(query); if(!got){ await reply("❌ ভিডিও পাইলাম না!"); return true }
      let {audios, vids} = await getPipedAudio(got.v, got.sv)
      let vv = vids.find(x=>x.quality==="720p") || vids.find(x=>x.quality==="360p") || vids[0]
      let emoji = ['romantic','romanticvideo','lovevideo'].includes(cmd) ? "❤️" : (['dj','djbangla','djsong','djvideo'].includes(cmd) ? "🎧" : "😂")
      let title = ['romantic','romanticvideo','lovevideo'].includes(cmd) ? "ROMANTIC" : (['dj','djbangla','djsong','djvideo'].includes(cmd) ? "DJ BANGLA" : "FUNNY")
      if(vv?.url) await sock.sendMessage(from, {video:{url:vv.url}, caption:`${emoji} *${title}*\n🎬 *${got.v.title}*\n👤 ${got.v.uploaderName||""}\n\n👑 *RANA-X-VIP-BOT*`, mimetype:'video/mp4'}, {quoted:m})
      if(audios[0]?.url){ let aud = await axios.get(audios[0].url, {responseType:'arraybuffer', timeout:90000, headers:{'User-Agent':'Mozilla/5.0'}}); if(aud.data.byteLength>500000) await sock.sendMessage(from, {audio:Buffer.from(aud.data), mimetype:'audio/mp4', fileName:(got.v.title||query)+".mp3", contextInfo:{externalAdReply:{title:got.v.title||query, body:"👑 RANA-X-VIP-BOT - "+title, thumbnail:senderThumb, mediaType:1, sourceUrl:CHANNEL_LINK}}}, {quoted:m}) }
      return true
    }catch{ await reply("❌ ভিডিও আনতে পারলাম না!"); return true }
  }
  if(['video','vsong','vgan','vgana','ytmp4','ytvideo'].includes(cmd)){
    if(!text){ await reply("❌ ভিডিও গানের নাম দে!\nEx: .video Ami Tomake Valobashi"); return true }
    await reply("🎬 ভিডিও খুঁজতেছি... *"+text+"*")
    try{
      let got = await getPipedVideo(text); if(!got){ await reply("❌ ভিডিও পাইলাম না!"); return true }
      let {audios, vids} = await getPipedAudio(got.v, got.sv)
      let vv = vids.find(x=>x.quality==="720p") || vids.find(x=>x.quality==="360p") || vids[0]
      if(vv?.url) await sock.sendMessage(from, {video:{url:vv.url}, caption:`🎬 *${got.v.title}*\n👤 ${got.v.uploaderName||""}\n\n👑 *RANA-X-VIP-BOT*`, mimetype:'video/mp4'}, {quoted:m})
      if(audios[0]?.url){ let aud = await axios.get(audios[0].url, {responseType:'arraybuffer', timeout:90000, headers:{'User-Agent':'Mozilla/5.0'}}); await sock.sendMessage(from, {audio:Buffer.from(aud.data), mimetype:'audio/mp4', fileName:(got.v.title||text)+".mp3", contextInfo:{externalAdReply:{title:got.v.title||text, body:"👑 RANA-X-VIP-BOT - Audio", thumbnail:senderThumb, mediaType:1, sourceUrl:CHANNEL_LINK}}}, {quoted:m}) }
      return true
    }catch{ await reply("❌ ভিডিও আনতে পারলাম না!"); return true }
  }
  if(['audio','mp3','toaudio','songaudio','ytaudio','mp3dl','audio2','tomp3','ytmp3'].includes(cmd)){
    let qMsg = qCtx?.quotedMessage || m.message?.extendedTextMessage?.contextInfo?.quotedMessage || null
    let inner = qMsg?.viewOnceMessage?.message || qMsg?.viewOnceMessageV2?.message || qMsg?.viewOnceMessageV2Extension?.message || null
    let vidMsg = m.message.videoMessage || qMsg?.videoMessage || inner?.videoMessage || null
    if(vidMsg){
      await reply("🎵 ভিডিও থেকে অডিও বানাইতেছি... 🔥")
      try{
        let stream = await downloadContentFromMessage(vidMsg, 'video')
        let buf = Buffer.concat([]); for await(let c of stream) buf = Buffer.concat([buf, c])
        if(buf.length < 10000){ await reply("❌ ভিডিও খালি আসছে! আবার দিয়া .audio লেখো"); return true }
        await sock.sendMessage(from, { audio: buf, mimetype: 'audio/mp4', fileName: "RANA-Audio.mp3", ptt: false, contextInfo: { externalAdReply: { title: "RANA-X-VIP Audio ▶️", body: "👑 চাপ দিলেই বাজবো | "+OWNER_NAME, thumbnail: senderThumb, mediaType: 1, sourceUrl: CHANNEL_LINK } } }, {quoted: m})
        await reply("✅ হইছে! ভিডিও এখন অডিও হইয়া গেছে! ▶️ চাপ দিলেই বাজবো!")
      }catch(e){ console.log("Audio Convert Err:", e.message); await reply("❌ অডিও বানাইতে পারলাম না! ভিডিওটা আবার পাঠাইয়া Reply দিয়া .audio লেখো") }
      return true
    }
    if(text){
      await reply("🔍 খুঁজতেছি... *"+text+"* (Audio)")
      try{ let got = await getPipedVideo(text); if(got){ let ok = await sendPipedAudio(o, text, got.v, got.sv); if(ok) return true } }catch{}
      await reply("❌ গান পাইলাম না!"); return true
    }
    await reply("❌ যেই ভিডিওরে অডিও বানাইবা, ঐ ভিডিওতে Reply দিয়া লেখ:\n.audio\n\nঅথবা গানের নাম দিয়া লেখ:\n.audio Ami Tomake Valobashi"); return true
  }
  if(cmd==='tiktok' || cmd==='tiktokdl'){
    if(!text){ await reply("❌ TikTok link dao! Ex: .tiktok <link>"); return true }
    await reply("🎵 TikTok ডাউনলোড করতেছি...")
    try{
      let r = await axios.get("https://www.tikwm.com/api/?url="+encodeURIComponent(text), {timeout:20000})
      let d = r.data?.data; let url = d?.play || d?.wmplay
      if(url){ await sock.sendMessage(from, {video:{url}, caption:`🎵 *TikTok*\n👤 @${d.author?.unique_id||""}\n👑 *RANA-X-VIP-BOT*`}, {quoted:m}); return true }
    }catch{}
    await reply("❌ TikTok ভিডিও আনতে পারলাম না! লিংক ঠিক আছে কিনা দেখো!"); return true
  }
  if(cmd==='igdl' || cmd==='insta' || cmd==='reels' || cmd==='fbdl' || cmd==='fbvideo'){
    if(!text){ await reply(`❌ Link dao! Ex: .${cmd} <link>`); return true }
    await reply("📥 চেষ্টা করতেছি...")
    try{
      let r = await axios.get("https://www.tikwm.com/api/?url="+encodeURIComponent(text), {timeout:20000})
      let url = r.data?.data?.play
      if(url){ await sock.sendMessage(from, {video:{url}, caption:`📥 *${cmd.toUpperCase()}*\n👑 *RANA-X-VIP-BOT*`}, {quoted:m}); return true }
    }catch{}
    await reply(`❌ ${cmd} আনতে পারলাম না! এই লিংক Private হইতে পারে, Public লিংক দাও!`); return true
  }
  if(cmd==='ytsearch' || cmd==='yt' || cmd==='youtube'){
    if(!text){ await reply("❌ কি খুঁজবো? Ex: .ytsearch Ami Tomake Valobashi"); return true }
    let got = await getPipedVideo(text); if(!got){ await reply("❌ পাইলাম না!"); return true }
    await reply(`🔍 *YouTube Search*\n🎵 ${got.v.title}\n👤 ${got.v.uploaderName||""}\n🔗 https://youtube.com/watch?v=${(got.v.url||"").split("watch?v=")[1]||got.v.id}\n\nগান শুনতে: .song ${text}`); return true
  }
  if(cmd==='wallpaper'){ try{ let r = await axios.get("https://picsum.photos/500", {responseType:'arraybuffer'}); await sock.sendMessage(from, {image: Buffer.from(r.data), caption:"🌸 Wallpaper for you! 👑"}, {quoted:m}) }catch{ await sock.sendMessage(from, {image:{url:"https://picsum.photos/500"}, caption:"🌸 Wallpaper for you! 👑"}, {quoted:m}) } return true }
  if(cmd==='sticker' || cmd==='s'){
    try{
      let q = qCtx?.quotedMessage; let imgMsg = q?.imageMessage || m.message.imageMessage; let vidMsg = q?.videoMessage || m.message.videoMessage
      if(!imgMsg && !vidMsg){ await reply("❌ Photo / Video er upore Reply diya .s lekho bhai!"); return true }
      let type = imgMsg ? 'image' : 'video'; let stream = await downloadContentFromMessage(imgMsg || vidMsg, type); let buf = Buffer.concat([]); for await(let chunk of stream){ buf = Buffer.concat([buf, chunk]) }
      await sock.sendMessage(from, {sticker: buf}, {quoted:m}); await success("✅ Sticker Successful!")
    }catch{ await reply("❌ Sticker hoilo na! Choto pic diya try koro!") }
    return true
  }
  if(cmd==='vv' || cmd==='vv2' || cmd==='vv3' || cmd==='viewonce'){
    let quoted = qCtx?.quotedMessage; let viewOnce = quoted?.viewOnceMessage || quoted?.viewOnceMessageV2 || quoted?.viewOnceMessageV2Extension; let inner = viewOnce?.message; let imgMsg = inner?.imageMessage || inner?.videoMessage || quoted?.imageMessage || quoted?.videoMessage
    if(!imgMsg){ await reply("❌ View Once pic/video er upore Reply diya .vv3 lekho bhai!"); return true }
    try{ let type = inner?.imageMessage || quoted?.imageMessage ? 'image' : 'video'; let stream = await downloadContentFromMessage(imgMsg, type); let buf = Buffer.concat([]); for await(let chunk of stream){ buf = Buffer.concat([buf, chunk]) }; let cap = `╭───〔 👑 VV3 〕───╮\n│ ${BOT_NAME}\n╰───────────────────╯\n\n✅ VIEW ONCE KHULA HOISE\n👑 Owner: ${OWNER || "8801636487523"}\n📢 Channel: ${CHANNEL_LINK}`; if(type==='image') await sock.sendMessage(from,{image:buf,caption:cap},{quoted:m}); else await sock.sendMessage(from,{video:buf,caption:cap},{quoted:m}) }catch{ await reply("❌ VV3 khulte pari nai! Abar try koro!") }
    return true
  }
  if(cmd==='toimg' || cmd==='toimage'){ let st = qCtx?.quotedMessage?.stickerMessage; if(!st){ await reply("❌ Sticker er upore Reply diya .toimg lekho!"); return true } try{ let stream = await downloadContentFromMessage(st, 'sticker'); let buf = Buffer.concat([]); for await(let c of stream){ buf = Buffer.concat([buf,c]) } await sock.sendMessage(from,{image:buf,caption:"✅ Sticker -> Image Successful!"},{quoted:m}) }catch{ await reply("❌ Hoilo na!") } return true }
  if(cmd==='tovid'){ let st = qCtx?.quotedMessage?.stickerMessage; if(!st){ await reply("❌ Sticker e Reply diya .tovid lekho!"); return true } try{ let stream = await downloadContentFromMessage(st, 'sticker'); let buf = Buffer.concat([]); for await(let c of stream) buf = Buffer.concat([buf,c]); await sock.sendMessage(from,{video:buf,caption:"✅ Sticker -> Video", mimetype:'video/mp4'},{quoted:m}) }catch{ await reply("❌ Hoilo na!") } return true }
  if(cmd==='attp' || cmd==='ttp'){ if(!text){ await reply("✍️ Text dao! Ex: .attp RANA"); return true } try{ await sock.sendMessage(from,{sticker:{url:"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data="+encodeURIComponent(text)}},{quoted:m}) }catch{ await reply(`✨ ATTP: ${text}`) } return true }
  if(cmd==='emojimix' || cmd==='emojimix3'){
    if(!text || !text.includes('+')){ await reply("😍 Emojimix: 2 ta emoji dao! Ex: .emojimix 😂+❤️"); return true }
    try{ let [e1,e2] = text.split('+'); let r = await axios.get(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYFwtZTgpeA6O6FhX4r8r4Q&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v6&q=${encodeURIComponent(e1.trim()+"_"+e2.trim())}`, {timeout:10000}); let url = r.data?.results?.[0]?.media_formats?.png_transparent?.url; if(url){ await sock.sendMessage(from,{sticker:{url}},{quoted:m}); return true } }catch{}
    await reply("❌ Emojimix পাইলাম না! অন্য emoji দিয়া try করো! Ex: .emojimix 😂+❤️"); return true
  }
  if(cmd==='logo' || cmd==='banner' || cmd==='thumbnail' || cmd==='poster'){ if(!text){ await reply(`🎨 Text dao! Ex: .${cmd} RANA`); return true } try{ await sock.sendMessage(from,{image:{url:"https://image.pollinations.ai/prompt/"+encodeURIComponent(cmd+" logo design, "+text+", professional, colorful")},caption:`🎨 ${cmd.toUpperCase()}: ${text}\n👑 ${BOT_NAME}`},{quoted:m}) }catch{ await reply("❌ Logo বানাইতে পারলাম না!") } return true }
  if(cmd==='dp' || cmd==='pfp' || cmd==='avatar'){ await sock.sendMessage(from, {image:{url:"https://i.ibb.co.com/Pz52VSWF/IMG-20261027-WA0000.jpg"}, caption:`👑 DP for you!\n${BOT_NAME}`}, {quoted:m}); return true }
  if(cmd==='tagall' || cmd==='hidetag' || cmd==='everyone' || cmd==='tag'){
    if(!isGroup){ await reply("❌ Group e use koro bhai!"); return true }
    try{ let meta = await sock.groupMetadata(from); let members = meta.participants.map(p=>p.id); let txt = `👥 *TAG ALL*\nGroup: ${meta.subject}\nTotal: ${members.length} Members\n━━━━━━━━━━━━━━\n`; members.forEach(id=> txt += "@"+id.split('@')[0]+"\n"); txt += `━━━━━━━━━━━━━━\n👑 ${BOT_NAME}\n📢 ${CHANNEL_LINK}`; await sock.sendMessage(from, {text: txt, mentions: members}, {quoted:m}) }catch{ await reply("❌ Group e use koro bhai!") }
    return true
  }
  if(cmd==='groupinfo' || cmd==='groupname' || cmd==='groupdesc'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    let meta = await sock.groupMetadata(from); await reply(`👥 *GROUP INFO*\n━━━━━━━━━━━━━━\n🏰 Name: ${meta.subject}\n🆔 ID: ${meta.id}\n👥 Members: ${meta.participants.length}\n📝 Desc: ${meta.desc || "No desc"}\n👑 ${BOT_NAME}`); return true
  }
  if(cmd==='admin' || cmd==='admins' || cmd==='adminlist' || cmd==='tagadmins'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    let meta = await sock.groupMetadata(from); let admins = meta.participants.filter(p=>p.admin).map(p=>p.id); await reply(`👑 *ADMINS*\n${admins.map(a=> "@"+a.split('@')[0]).join("\n")}`); return true
  }
  if(cmd==='members' || cmd==='memberlist'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    let meta = await sock.groupMetadata(from); await reply(`👥 *MEMBERS (${meta.participants.length})*\n${meta.participants.slice(0,30).map(p=> "@"+p.id.split('@')[0]).join("\n")}`); return true
  }
  if(cmd==='kick'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    let t = getTarget(); if(!t){ await reply("❌ Kake kick korbo? Tag koro!"); return true }
    try{ await sock.groupParticipantsUpdate(from, [t], "remove"); await reply(`🚫 @${t.split('@')[0]} kicked!`)}catch{ await reply("❌ Kick korte pari nai! Bot ke Admin dao!") }
    return true
  }
  if(cmd==='promote'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    let t = getTarget(); if(!t){ await reply("❌ Kake promote korbo?"); return true }
    try{ await sock.groupParticipantsUpdate(from, [t], "promote"); await reply(`🎉 @${t.split('@')[0]} ekhon Admin! 👑`)}catch{ await reply("❌ Promote hoilo na!") }
    return true
  }
  if(cmd==='demote'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    let t = getTarget(); if(!t){ await reply("❌ Kake demote korbo?"); return true }
    try{ await sock.groupParticipantsUpdate(from, [t], "demote"); await reply(`😢 @${t.split('@')[0]} ke Admin theke sorano hoise.`)}catch{ await reply("❌ Demote hoilo na!") }
    return true
  }
  if(cmd==='add'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    if(!text){ await reply("❌ Number dao! Ex: .add 88016XXXXXXXX"); return true }
    try{ await sock.groupParticipantsUpdate(from, [text.replace(/[^0-9]/g,'')+"@s.whatsapp.net"], "add"); await reply(`✅ ${text} ke add korar try korlam!`)}catch{ await reply("❌ Add hoilo na! Number ta WhatsApp e ache kina dekho!") }
    return true
  }
  if(cmd==='invite' || cmd==='link' || cmd==='linkgroup' || cmd==='grouplink'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    try{ let code = await sock.groupInviteCode(from); await reply(`🔗 *GROUP LINK*\nhttps://chat.whatsapp.com/${code}`)}catch{ await reply("❌ Link ante pari nai!") }
    return true
  }
  if(cmd==='setname' || cmd==='subject'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    if(!text){ await reply("❌ Notun nam dao! Ex: .setname RANA GROUP"); return true }
    try{ await sock.groupUpdateSubject(from, text); await reply(`✅ Group Name bodlano hoise: ${text}`) }catch{ await reply("❌ Hoilo na! Bot ke Admin dao!") }
    return true
  }
  if(cmd==='setdesc' || cmd==='desc'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    if(!text){ await reply("❌ Notun desc dao!"); return true }
    try{ await sock.groupUpdateDescription(from, text); await reply(`✅ Group Desc bodlano hoise!`) }catch{ await reply("❌ Hoilo na! Bot ke Admin dao!") }
    return true
  }
  if(cmd==='open' || cmd==='groupopen' || cmd==='unlock'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    try{ await sock.groupSettingUpdate(from, 'not_announcement'); await reply("✅ Group Open! Sobai likhte parbe!")}catch{ await reply("❌ Hoilo na!") }
    return true
  }
  if(cmd==='close' || cmd==='groupclose' || cmd==='lock' || cmd==='mute'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    try{ await sock.groupSettingUpdate(from, 'announcement'); await reply("🔒 Group Close! Khali Admin likhte parbe!")}catch{ await reply("❌ Hoilo na!") }
    return true
  }
  if(cmd==='leave'){ await reply("👋 Bot group theke chole jacche... Bye! 🥺"); return true }
  if(cmd==='rules'){ await reply(`📜 *GROUP RULES*\n1. Link diba na ❌\n2. Galagali korba na ❌\n3. Spam korba na ❌\n4. Active thakba ✅\n👑 ${BOT_NAME}`); return true }
  if(cmd==='online'){ await reply("🟢 Online members dekhte WhatsApp er Online list dekho!"); return true }
  if(cmd==='google' || cmd==='search' || cmd==='find'){ if(!text){ await reply("❌ Ki khujbo? Ex: .google RANA"); return true } let w = await getWiki(text); await reply(w ? `🔍 *Google / Wiki - ${text}*\n\n${w}\n\n🔗 https://google.com/search?q=${encodeURIComponent(text)}` : `🔍 Google: ${text}\nLink: https://google.com/search?q=${encodeURIComponent(text)}`); return true }
  if(cmd==='wiki' || cmd==='meaning' || cmd==='dictionary' || cmd==='define' || cmd==='synonym'){ if(!text){ await reply("❌ Word dao! Ex: .wiki Love"); return true } let w = await getWiki(text); await reply(w ? `📖 *${text}*\n\n${w}` : `📖 ${text} - Wiki te pailam na!`); return true }
  if(cmd==='weather'){ if(!text){ await reply("❌ Ex: .weather Sylhet"); return true } try{ let d = await axios.get("https://wttr.in/"+encodeURIComponent(text)+"?format=j1").then(x=>x.data); let c = d.current_condition[0]; await reply(`🌤️ Weather - ${text}\n🌡️ Temp: ${c.temp_C}°C\n💧 Humidity: ${c.humidity}%\n☁️ ${c.weatherDesc[0].value}`) }catch{ await reply(`🌤️ Weather: ${text} - Ante parlam na!`) } return true }
  if(cmd==='news'){ await reply(`📰 News: RANA X VIP Bot ekhon Bangladesh er sera Bot! 👑🔥`); return true }
  if(cmd==='translate' || cmd==='translate2'){
    if(!text){ await reply("❌ Text dao! Ex: .translate Hello"); return true }
    try{ let r = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|bn`, {timeout:10000}); await reply(`🌐 Translate:\nEN: ${text}\nBN: ${r.data?.responseData?.translatedText || "Ante parlam na!"}`) }catch{ await reply(`🌐 Translate: ${text} = হ্যালো`) }
    return true
  }
  if(cmd==='lyrics' || cmd==='lyrics2'){
    if(!text){ await reply("❌ Ganer nam dao! Ex: .lyrics Ami Tomake Valobashi"); return true }
    try{ let r = await axios.get(`https://lrclib.net/api/search?track_name=${encodeURIComponent(text)}`, {timeout:10000}); let s = r.data?.[0]; if(s?.plainLyrics){ await reply(`🎵 *Lyrics - ${s.trackName}*\n👤 ${s.artistName}\n\n${s.plainLyrics.slice(0,2000)}`); return true } }catch{}
    await reply(`❌ Lyrics pailam na! .song ${text} likhe gan suno!`); return true
  }
  if(cmd==='movie' || cmd==='series'){
    if(!text){ await reply("❌ Movie nam dao! Ex: .movie Titanic"); return true }
    let w = await getWiki(text); await reply(w ? `🎬 *Movie - ${text}*\n\n${w.slice(0,800)}` : `❌ Movie pailam na!`); return true
  }
  if(cmd==='calc' || cmd==='calculator'){ try{ let e = text.replace(/[^0-9+\-*/(). ]/g,''); if(!e){ await reply("❌ Ex: .calc 2+2*3"); return true } await reply(`🧮 ${e} = ${eval(e)}`)}catch{ await reply("❌ Vul calc!") } return true }
  if(cmd==='qr' || cmd==='qrcode'){ if(!text){ await reply("❌ Text dao! Ex: .qr RANA"); return true } try{ await sock.sendMessage(from,{image:{url:"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data="+encodeURIComponent(text)},caption:`📷 QR for: ${text}`},{quoted:m}) }catch{ await reply(`📷 QR Code: ${text}`) } return true }
  if(cmd==='tts' || cmd==='voice'){ if(!text){ await reply("❌ Text dao! Ex: .tts Hello"); return true } try{ await sock.sendMessage(from,{audio:{url:`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`}, mimetype:'audio/mp4', fileName:"tts.mp3"},{quoted:m}) }catch{ await reply(`🔊 TTS: ${text}`) } return true }
  if(cmd==='ai' || cmd==='gpt' || cmd==='ask' || cmd==='chat' || cmd==='gemini'){
    if(!text){ await reply("🤖 Kichu jigges koro! Ex: .ai Bangladesh er capital ki?"); return true }
    await reply("🤖 AI ভাবতেছে...")
    try{ let r = await axios.get("https://text.pollinations.ai/"+encodeURIComponent(text), {timeout:30000}); await reply(`🤖 *AI*\nQ: ${text}\nA: ${String(r.data).slice(0,1500)}`) }catch{ let w = await getWiki(text); await reply(w ? `🤖 *AI / Wiki*\nQ: ${text}\nA: ${w.slice(0,1000)}` : `🤖 Ami RANA-X-VIP-BOT! Tumi bolcho: ${text}`) }
    return true
  }
  if(cmd==='imagine' || cmd==='draw'){ if(!text){ await reply("🎨 Ki banabo? Ex: .imagine cute cat"); return true } try{ await sock.sendMessage(from,{image:{url:"https://image.pollinations.ai/prompt/"+encodeURIComponent(text)},caption:`🎨 Imagine: ${text}`},{quoted:m}) }catch{ await reply(`🎨 Imagine korchi: ${text}...`) } return true }
  if(cmd==='currency' || cmd==='convert'){ try{ let r = await axios.get("https://open.er-api.com/v6/latest/USD", {timeout:10000}); await reply(`💱 *Currency - USD*\n1 USD = ${r.data?.rates?.BDT?.toFixed(2)} BDT\n1 USD = ${r.data?.rates?.INR?.toFixed(2)} INR`) }catch{ await reply(`💱 Currency: 1 USD = 110 BDT (approx)`) } return true }
  if(cmd==='password' || cmd==='random'){ await reply(`🔑 Random Password: RANA${1000+rand(9000)}!@#`); return true }
  if(cmd==='font' || cmd==='fancy' || cmd==='styletext'){ if(!text){ await reply("❌ Text dao! Ex: .font RANA"); return true } let map = {'a':'𝓪','b':'𝓫','c':'𝓬','d':'𝓭','e':'𝓮','f':'𝓯','g':'𝓰','h':'𝓱','i':'𝓲','j':'𝓳','k':'𝓴','l':'𝓵','m':'𝓶','n':'𝓷','o':'𝓸','p':'𝓹','q':'𝓺','r':'𝓻','s':'𝓼','t':'𝓽','u':'𝓾','v':'𝓿','w':'𝔀','x':'𝔁','y':'𝔂','z':'𝔃','A':'𝓐','B':'𝓑','C':'𝓒','D':'𝓓','E':'𝓔','F':'𝓕','G':'𝓖','H':'𝓗','I':'𝓘','J':'𝓙','K':'𝓚','L':'𝓛','M':'𝓜','N':'𝓝','O':'𝓞','P':'𝓟','Q':'𝓠','R':'𝓡','S':'𝓢','T':'𝓣','U':'𝓤','V':'𝓥','W':'𝓦','X':'𝓧','Y':'𝓨','Z':'𝓩'}; let out = text.split('').map(c=>map[c]||c).join(''); await reply(`✨ Fancy: ${out}`); return true }
  if(cmd==='reverse'){ if(!text){ await reply("❌ Text dao!"); return true } await reply(`🔄 Reverse: ${text.split('').reverse().join('')}`); return true }
  if(cmd==='uppercase'){ if(!text){ await reply("❌ Text dao!"); return true } await reply(text.toUpperCase()); return true }
  if(cmd==='lowercase'){ if(!text){ await reply("❌ Text dao!"); return true } await reply(text.toLowerCase()); return true }
  if(cmd==='count' || cmd==='wordcount'){ if(!text){ await reply("❌ Text dao!"); return true } await reply(`🔢 Count: ${text.length} chars, ${text.split(' ').filter(Boolean).length} words`); return true }
  if(cmd==='age'){ if(!text){ await reply("🎂 Jonmo sal dao! Ex: .age 2005"); return true } let y = parseInt(text); if(!y || y<1900 || y>2026){ await reply("❌ Sothik sal dao! Ex: .age 2005"); return true } await reply(`🎂 Age: ${2026-y} bosor (2026 hisabe)`); return true }
  if(cmd==='bmi'){ let p = text.split(/ +/); if(p.length<2){ await reply("⚖️ Ex: .bmi 60 5.8 (weight kg, height feet)"); return true } let w = parseFloat(p[0]), hFt = parseFloat(p[1]); let hM = hFt*0.3048; let bmi = (w/(hM*hM)).toFixed(1); await reply(`⚖️ BMI: ${bmi}\n${bmi<18.5?"Roga":bmi<25?"Normal":bmi<30?"Mota":"Beshi Mota"}`); return true }
  if(cmd==='lovecalc'){ let p = 50+rand(50); await reply(`💘 Love Calc: ${text || "Tumi + Crush"} = ${p}% ❤️`); return true }
  if(cmd==='timer' || cmd==='reminder' || cmd==='note' || cmd==='notes' || cmd==='todo'){ if(!text){ await reply("❌ Ki note korbo? Ex: .note Pora ses korbo"); return true } await reply(`📝 Note save hoise: ${text}`); return true }
  if(cmd==='balance' || cmd==='bank' || cmd==='wallet' || cmd==='money' || cmd==='cash'){ let bal = userBal[sender] || 1000; userBal[sender] = bal; await reply(`💰 *BALANCE*\n@${sender.split('@')[0]}\n💵 Balance: ${bal} Coins\n🏦 Bank: ${bal*2} Coins\n👑 ${BOT_NAME}`); return true }
  if(cmd==='daily' || cmd==='claim' || cmd==='bonus'){ let gain = 100+rand(200); userBal[sender] = (userBal[sender]||1000)+gain; await reply(`🎁 Daily Claim!\n+${gain} Coins paiso!\n💰 Balance: ${userBal[sender]}`); return true }
  if(cmd==='work'){ let gain = 50+rand(150); userBal[sender] = (userBal[sender]||1000)+gain; await reply(`💼 Work korla! +${gain} Coins\n💰 Balance: ${userBal[sender]}`); return true }
  if(cmd==='rob'){ let t = getTarget(); if(t){ await reply(`😈 @${sender.split('@')[0]} rob korlo @${t.split('@')[0]} ke! ${pick(["Success! 200 Coins paiso! 🎉","Fail! Dhora khaiso! 😂"])}`)} else await reply(`😈 Rob: ${pick(["Success! 200 Coins paiso! 🎉","Fail! Dhora khaiso! 😂"])}`); return true }
  if(cmd==='gamble' || cmd==='bet' || cmd==='casino' || cmd==='roulette'){ let bet = parseInt(text)||100; let win = Math.random()>0.5; if(win){ userBal[sender]=(userBal[sender]||1000)+bet; await reply(`🎉 Jitso! +${bet} Coins! 💰`) } else { userBal[sender]=(userBal[sender]||1000)-bet; await reply(`😅 Harso! -${bet} Coins!`) } return true }
  if(cmd==='transfer' || cmd==='pay'){ let t = getTarget(); let amt = parseInt(text.replace(/[^0-9]/g,''))||0; if(!t || !amt){ await reply("❌ Ex: .pay @user 100"); return true } if((userBal[sender]||1000)<amt){ await reply("❌ Tomar Balance kom!"); return true } userBal[sender]-=amt; userBal[t]=(userBal[t]||1000)+amt; await reply(`💸 Transfer: @${sender.split('@')[0]} -> @${t.split('@')[0]} : ${amt} Coins ✅\nTomar Balance: ${userBal[sender]}`); return true }
  if(cmd==='leaderboard' || cmd==='top' || cmd==='rich'){ let arr = Object.entries(userBal).sort((a,b)=>b[1]-a[1]).slice(0,5); await reply(`🏆 *LEADERBOARD*\n${arr.length?arr.map(([id,b],i)=>`${i+1}. @${id.split('@')[0]} - ${b} Coins`).join("\n"):`1. @${sender.split('@')[0]} - ${(userBal[sender]||1000)} Coins 👑`}`); return true }
  if(cmd==='xp' || cmd==='level' || cmd==='rank'){ let xp = (userXp[sender]||0)+10; userXp[sender]=xp; await reply(`⭐ *LEVEL*\n@${sender.split('@')[0]}\nXP: ${xp}\nLevel: ${Math.floor(xp/100)+1}\n👑 ${BOT_NAME}`); return true }
  if(cmd==='shop' || cmd==='buy' || cmd==='sell'){ if(cmd==='buy'){ let amt = parseInt(text.replace(/[^0-9]/g,''))||500; if((userBal[sender]||1000)<amt){ await reply("❌ Balance kom!"); return true } userBal[sender]-=amt; await reply(`🛒 Buy hoise! -${amt} Coins\nBalance: ${userBal[sender]}`); return true } await reply(`🛒 Shop: VIP Item - Price: 500 Coins\nBuy korte: .buy 500`); return true }
  if(cmd==='crypto' || cmd==='stock' || cmd==='invest' || cmd==='trade' || cmd==='market'){
    try{ let r = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true", {timeout:10000}); await reply(`📈 *Crypto - ASOL Price*\n🟠 BTC: $${r.data.bitcoin.usd} (${r.data.bitcoin.usd_24h_change.toFixed(2)}%)\n🔵 ETH: $${r.data.ethereum.usd} (${r.data.ethereum.usd_24h_change.toFixed(2)}%)`) }catch{ await reply(`📈 Crypto ante parlam na! Abar try koro!`) }
    return true
  }
  if(cmd==='love2' || cmd==='lovemeter' || cmd==='lovetest'){ let p = 50+rand(50); await reply(`💘 Love Meter: ${p}% ❤️\n${p>85 ? "🔥 True Love!" : "🥰 Valo!"}`); return true }
  if(cmd==='marry'){ let t = getTarget(); await reply(`💍 Marry: @${sender.split('@')[0]} married @${t ? t.split('@')[0] : "Crush"}! 🎉💍`); return true }
  if(cmd==='divorce'){ await reply(`💔 Divorce: Mon kharap koro na, abar hobe! 🥺`); return true }
  if(cmd==='rose' || cmd==='gift' || cmd==='gift2'){ await reply(`🌹 Rose: Ekta golap dilam! 🥰🌹`); return true }
  if(cmd==='miss' || cmd==='missyou' || cmd==='missyou2'){ await reply(`🥺 Miss You: Amio tomake onek miss kori! 🥺💜`); return true }
  if(cmd==='bf' || cmd==='gf' || cmd==='partner' || cmd==='soulmate'){ await reply(`💘 Soulmate: Tomar soulmate tomake khujtese! 🥰`); return true }
  if(cmd==='breakup'){ await reply(`💔 Breakup: Kosto peyo na, samne valo din asbe! 💪`); return true }
  if(cmd==='flirt' || cmd==='pickup'){ await reply(`😏 Pickup: Tomar hashi ta amar WiFi er moto, connect na hoile thaka jay na! 😍`); return true }
  if(cmd==='valentine' || cmd==='anniversary' || cmd==='wedding' || cmd==='lovestory' || cmd==='lovepoem' || cmd==='loveshayari'){ await reply(`❤️ Romantic: Chandni raate tomake niye hatbo... 🌙❤️`); return true }
  if(cmd==='heart' || cmd==='heartbreak' || cmd==='lonely' || cmd==='loveyou' || cmd==='loveyou2'){ await reply(`❤️ Love You: Amio tomake valobashi! 🥰❤️`); return true }
  if(cmd==='quran'){ if(text){ let w = await getWiki("Quran "+text); await reply(w ? `🕌 Quran - ${text}\n\n${w.slice(0,800)}` : `🕌 Quran: Bismillahir Rahmanir Rahim - Allah Mohan! 🤲`) } else await reply("🕌 Quran: Bismillahir Rahmanir Rahim - Allah Mohan! 🤲"); return true }
  if(cmd==='hadith'){ await reply("🕌 Hadith: Sobcheye uttom se, je Quran shikhe ar onnoke shikhay. 🤲"); return true }
  if(cmd==='dua' || cmd==='dua2'){ await reply("🤲 Dua: Allah tomar sob dua kobul koruk! Ameen! 🤲"); return true }
  if(cmd==='namaz' || cmd==='namaztime' || cmd==='prayertime' || cmd==='azan' || cmd==='salah'){ try{ let r = await axios.get("https://api.aladhan.com/v1/timingsByCity?city=Sylhet&country=Bangladesh&method=1", {timeout:10000}); let t = r.data.data.timings; await reply(`🕌 *Namaz Time - Sylhet (ASOL)*\nFajr: ${t.Fajr}\nDhuhr: ${t.Dhuhr}\nAsr: ${t.Asr}\nMaghrib: ${t.Maghrib}\nIsha: ${t.Isha} 🤲`) }catch{ await reply("🕌 Namaz Time (Sylhet):\nFajr: 5:00 AM\nDhuhr: 12:00 PM\nAsr: 4:00 PM\nMaghrib: 5:45 PM\nIsha: 7:30 PM 🤲") } return true }
  if(cmd==='ramadan' || cmd==='roza' || cmd==='iftar' || cmd==='sehri'){ try{ let r = await axios.get("https://api.aladhan.com/v1/timingsByCity?city=Sylhet&country=Bangladesh&method=1", {timeout:10000}); let t = r.data.data.timings; await reply(`🌙 *Ramadan - Sylhet*\nSehri: ${t.Imsak}\nIftar: ${t.Maghrib} 🤲`) }catch{ await reply("🌙 Ramadan: Iftar - 6:30 PM | Sehri - 4:30 AM 🤲") } return true }
  if(cmd==='allah' || cmd==='allahname' || cmd==='islam' || cmd==='islamic' || cmd==='muslim' || cmd==='kalima'){ await reply("🤲 Allah: La Ilaha Illallahu Muhammadur Rasulullah ﷺ"); return true }
  if(cmd==='surah' || cmd==='ayat'){ if(!text){ await reply("❌ Surah nam dao! Ex: .surah Al-Fatiha"); return true } let w = await getWiki("Surah "+text); await reply(w ? `🕌 *Surah - ${text}*\n\n${w.slice(0,800)}` : `🕌 Surah: ${text} - Alhamdulillahi Rabbil Alamin 🤲`); return true }
  if(cmd==='tasbih'){ await reply("📿 Tasbih: Subhanallah x33, Alhamdulillah x33, Allahu Akbar x33 🤲"); return true }
  if(cmd==='qibla'){ try{ let r = await axios.get("https://api.aladhan.com/v1/qibla/24.9/91.9", {timeout:10000}); await reply(`🕋 Qibla: Sylhet theke ${r.data.data.direction.toFixed(1)}° dike! 🧭`) }catch{ await reply("🕋 Qibla: Sylhet theke Poschim dike! 🧭") } return true }
  if(cmd==='hajj' || cmd==='umrah' || cmd==='zakat' || cmd==='eid' || cmd==='eid2' || cmd==='eidmubarak' || cmd==='jumma'){ let w = await getWiki(cmd); await reply(w ? `🕌 *${cmd.toUpperCase()}*\n\n${w.slice(0,800)}` : `🕌 ${cmd}: Eid Mubarak! Allah tomar dua kobul koruk! 🤲🌙`); return true }
  if(cmd==='prophet' || cmd==='muhammad'){ let w = await getWiki("Muhammad"); await reply(w ? `ﷺ *Prophet Muhammad (SAW)*\n\n${w.slice(0,800)}` : "ﷺ Prophet Muhammad (SAW) - Amader priyo Nabi! 🤲❤️"); return true }
  if(cmd==='wudu'){ await reply("💧 Wudu: Hat, Mukh, Pa dhuye namaz poro! 🤲"); return true }
  if(cmd==='gojol' || cmd==='nasheed'){ if(!text){ await reply("🎵 Gojol: Allah Mohan, Nabi Mohan... 🤲🎵\nGojol sunte: .song gojol"); return true } let got = await getPipedVideo(text+" gojol"); if(got){ let ok = await sendPipedAudio(o, text, got.v, got.sv); if(ok) return true } await reply("❌ Gojol pailam na!"); return true }
  if(cmd==='bass' || cmd==='nightcore' || cmd==='slowed' || cmd==='reverb' || cmd==='8d' || cmd==='lofi' || cmd==='remix'){ if(!text){ await reply(`❌ Ganer nam dao! Ex: .${cmd} Ami Tomake Valobashi`); return true } await reply(`🎧 ${cmd} version khujtese...`); let got = await getPipedVideo(text+" "+cmd); if(got){ let ok = await sendPipedAudio(o, text, got.v, got.sv); if(ok) return true } await reply(`❌ ${cmd} version pailam na! .song ${text} likhe normal gan suno!`); return true }
  if(cmd==='gk' || cmd==='question' || cmd==='answer' || cmd==='homework' || cmd==='essay' || cmd==='story' || cmd==='poem' || cmd==='letter' || cmd==='study'){ if(!text){ await reply(`❌ Topic dao! Ex: .${cmd} Bangladesh`); return true } let w = await getWiki(text); await reply(w ? `📚 *${cmd} - ${text}*\n\n${w.slice(0,1200)}` : `❌ ${text} niye pailam na!`); return true }
  if(cmd==='math2' || cmd==='science' || cmd==='history' || cmd==='english2' || cmd==='bangla2' || cmd==='geography' || cmd==='physics' || cmd==='chemistry' || cmd==='biology' || cmd==='maths' || cmd==='algebra' || cmd==='computer' || cmd==='programming' || cmd==='coding' || cmd==='python' || cmd==='javascript' || cmd==='java' || cmd==='html' || cmd==='css' || cmd==='space' || cmd==='nasa' || cmd==='earth' || cmd==='moon' || cmd==='animal' || cmd==='health' || cmd==='doctor' || cmd==='yoga' || cmd==='recipe' || cmd==='travel' || cmd==='country' || cmd==='language' || cmd==='business' || cmd==='law' || cmd==='police' || cmd==='army'){ let q = text || cmd; let w = await getWiki(q); await reply(w ? `📚 *${cmd} - ${q}*\n\n${w.slice(0,1200)}` : `❌ ${q} niye pailam na!`); return true }
  if(cmd==='bio' || cmd==='caption' || cmd==='status' || cmd==='attitude' || cmd==='attitude2' || cmd==='sadstatus' || cmd==='savagestatus' || cmd==='kingstatus' || cmd==='queenstatus'){ let bios = [`🔥 ${text||"RANA"} | 👑 Alone but Happy | 💜 Attitude is Everything!`, `💔 ${text||"Broken"} | 😔 Mon kharap, tao hashi mukhe thaki!`, `👑 King 👑 | 🔥 ${text||"RANA X VIP"} | 💪 Har manbo na!`]; await reply(pick(bios)); return true }
  if(cmd==='sad2' || cmd==='happy2' || cmd==='alone' || cmd==='broken' || cmd==='savage' || cmd==='cool' || cmd==='king' || cmd==='queen' || cmd==='boss' || cmd==='legend' || cmd==='badboy' || cmd==='badgirl' || cmd==='hero' || cmd==='villain' || cmd==='ninja' || cmd==='dragon' || cmd==='phoenix' || cmd==='tiger' || cmd==='lion' || cmd==='wolf' || cmd==='ghost' || cmd==='devil' || cmd==='angel' || cmd==='star' || cmd==='moon' || cmd==='sun' || cmd==='sky' || cmd==='dream' || cmd==='magic' || cmd==='power' || cmd==='fire' || cmd==='ice' || cmd==='storm' || cmd==='dark' || cmd==='light' || cmd==='pro' || cmd==='x' || cmd==='ultra' || cmd==='pawar'){ await reply(`🔥 ${cmd.toUpperCase()}: Ami ${cmd} - ${text||"RANA X VIP"} er Power! 👑🔥`); return true }
  if(cmd==='waifu' || cmd==='neko' || cmd==='shinobu' || cmd==='megumin' || cmd==='anime2' || cmd==='manga2' || cmd==='cosplay' || cmd==='naruto' || cmd==='onepiece' || cmd==='dragonball' || cmd==='animegirl' || cmd==='animeboy' || cmd==='animesearch' || cmd==='animequote' || cmd==='animewall' || cmd==='animepic' || cmd==='animememe'){
    try{ let cat = cmd==='neko' ? 'neko' : 'waifu'; let r = await axios.get("https://api.waifu.pics/sfw/"+cat).then(x=>x.data.url); await sock.sendMessage(from,{image:{url:r},caption:`🎌 ${cmd.toUpperCase()} - Sugoi! 😍🎌`},{quoted:m}) }catch{ await reply(`🎌 Anime: ${cmd} - Sugoi! 😍🎌`) }
    return true
  }
  if(cmd==='blush' || cmd==='blush2' || cmd==='bonk' || cmd==='cry2' || cmd==='cuddle2' || cmd==='dance2' || cmd==='facepalm' || cmd==='highfive' || cmd==='highfive2' || cmd==='lick' || cmd==='lick2' || cmd==='nom' || cmd==='nom2' || cmd==='nuzzle' || cmd==='smug' || cmd==='tease' || cmd==='comfort' || cmd==='cheer' || cmd==='motivate' || cmd==='congrats' || cmd==='celebrate' || cmd==='party' || cmd==='clap' || cmd==='bow' || cmd==='salute' || cmd==='sorry' || cmd==='thankyou' || cmd==='goodluck' || cmd==='hugme' || cmd==='kissme' || cmd==='loveme' || cmd==='smile2' || cmd==='smile3' || cmd==='cry3' || cmd==='laugh2' || cmd==='laugh3' || cmd==='dance3' || cmd==='wave2' || cmd==='tickle2' || cmd==='bite2' || cmd==='bite3' || cmd==='poke2' || cmd==='poke3'){
    try{ let map = {blush:"blush",blush2:"blush",bonk:"bonk",cry2:"cry",cuddle2:"cuddle",dance2:"dance",facepalm:"facepalm",highfive:"highfive",highfive2:"highfive",lick:"lick",lick2:"lick",nom:"nom",nom2:"nom",nuzzle:"nuzzle",smug:"smug",smile2:"smile",smile3:"smile",cry3:"cry",laugh2:"laugh",laugh3:"laugh",dance3:"dance",wave2:"wave",tickle2:"tickle",bite2:"bite",bite3:"bite",poke2:"poke",poke3:"poke"}; let api = map[cmd]; if(api){ let r = await axios.get("https://api.waifu.pics/sfw/"+api).then(x=>x.data.url); await sock.sendMessage(from,{image:{url:r},caption:`🥰 ${cmd.toUpperCase()}! 😍`},{quoted:m}); return true } }catch{}
    await reply(`🥰 ${cmd}: Cute reaction! 😍`); return true
  }
  if(cmd==='emoji' || cmd==='emoji2' || cmd==='emoji3' || cmd==='emoji4' || cmd==='emojis' || cmd==='emot' || cmd==='kaomoji' || cmd==='funemoji' || cmd==='loveemoji' || cmd==='sademoji' || cmd==='animalemoji' || cmd==='foodemoji' || cmd==='flagemoji' || cmd==='heartemoji' || cmd==='fireemoji' || cmd==='cuteemoji'){
    await reply(`😍 Emoji Pack:\n${EMOJIS.slice(0,60).join(' ')}\n👑 ${BOT_NAME}`); return true
  }
  if(cmd==='premium' || cmd==='vip' || cmd==='buybot' || cmd==='rent' || cmd==='panel' || cmd==='hosting' || cmd==='premium2' || cmd==='vip2' || cmd==='gold2' || cmd==='diamond2' || cmd==='elite' || cmd==='legend2' || cmd==='master' || cmd==='superbot' || cmd==='turbo' || cmd==='max' || cmd==='ultrapro' || cmd==='topbot' || cmd==='bestbot' || cmd==='new'){
    await reply(`💎 *PREMIUM / VIP*\n━━━━━━━━━━━━━━\n👑 Bot kinte / Rent nite:\n📞 01636487523\n💬 wa.me/8801636487523\n💰 Price: Inbox koro!\n📢 ${CHANNEL_LINK}`); return true
  }
  if(cmd.startsWith('sticker')){
    if(cmd==='stickerpack' || cmd==='stickerlist'){ await reply(`🎨 Sticker Pack banate photo pathaiya .s lekho!\nPhoto -> Sticker hoiya jaibo!`); return true }
    let q = qCtx?.quotedMessage; let imgMsg = q?.imageMessage || m.message.imageMessage; if(!imgMsg){ await reply(`🎨 ${cmd}: Photo diya .s lekho, sticker banaiya dimu!`); return true }
    try{ let stream = await downloadContentFromMessage(imgMsg, 'image'); let buf = Buffer.concat([]); for await(let c of stream) buf = Buffer.concat([buf,c]); await sock.sendMessage(from,{sticker:buf},{quoted:m}) }catch{ await reply("❌ Sticker hoilo na!") }
    return true
  }
  if(cmd==='thank' || cmd==='thanks' || cmd==='please' || cmd==='sorry2' || cmd==='excuse' || cmd==='congrats2' || cmd==='happybirthday' || cmd==='birthday' || cmd==='newyear' || cmd==='christmas' || cmd==='diwali' || cmd==='holi' || cmd==='takecare' || cmd==='seeyou' || cmd==='cute2' || cmd==='smart2' || cmd==='awesome' || cmd==='amazing' || cmd==='wow' || cmd==='omg' || cmd==='lol' || cmd==='haha' || cmd==='ok' || cmd==='yes' || cmd==='no' || cmd==='maybe' || cmd==='namaste' || cmd==='assalamualaikum' || cmd==='salam' || cmd==='goodday' || cmd==='welcome3'){
    await reply(`🥰 ${cmd}: ${pick(["Thank you! 💜","Awesome! 🔥","Love you! ❤️","Haha! 😂"])}`); return true
  }
  if(cmd==='channel' || cmd==='follow' || cmd==='joinchannel' || cmd==='viewchannel' || cmd==='channellink' || cmd==='channelmenu'){ await reply(`📢 *FOLLOW CHANNEL*\n${CHANNEL_LINK}\n\n👑 ${BOT_NAME}`); return true }
  if(cmd==='support' || cmd==='donate'){ await reply(`💜 *SUPPORT*\n📞 01636487523\n💬 wa.me/8801636487523\n📢 ${CHANNEL_LINK}`); return true }
  if(cmd==='broadcast' || cmd==='bc'){
    if(sender.replace(/[^0-9]/g,'') !== OWNER){ await reply("❌ Broadcast khali Owner parbo!"); return true }
    if(!text){ await reply("❌ Ki broadcast korbo? Ex: .bc Hello sobai"); return true }
    await reply(`📢 Broadcast ready: ${text}\n(index.js theke sob group e jabe - Owner Only)`); return true
  }
  return false
}
module.exports = { CATS, ALL_CMDS, EMOJIS, getMenuText, getCatMenu, getWelcomeMenu, getGoodbyeMenu, handleCommand, checkAntilink }
