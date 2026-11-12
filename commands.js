// ===== RANA-X-VIP - commands.js - FIXED - NO SYNTAX ERROR =====
const axios = require('axios')
const EMOJIS = ["❤️","🔥","👑","😎","✨","💖","🥰","😍","💥","⚡","🌸","🌺","🎉","💯","✅","😂","🤣","😁","🥳","😏","🖤","🤍","💙","💚","💜","🧡","❣️","💕","💞","💓","💗","💘","💝","😘","😗","😙","😚","🤗","🤩","🤤","😋","🤫","🤭","🫣","🤔","🤨","😐","😑","😶","😒","🙄","😬","😌","😔","😪","😴","🤒","🤕","🤮","🥵","🥶","🥴","😵","🤯","🤓","🥺","😭","😢","😤","😡","🤬","👿","💀","☠️","👻","👽","🤖","💩","👋","🤚","🖐️","✋","🖖","👌","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","👍","👎","👊","✊","👏","🙌","🫶","🤝","🙏","💪"]
const CATS = {
  "OWNER": ["owner","creator","support","donate","repo","script","deploy","pair","session","reset","restart","broadcast","bc","join","leave","block","unblock","ban","unban","sudo","del","delete","shutdown","eval"],
  "MAIN": ["menu","menu2","allmenu","help","commands","list","ping","pong","speed","runtime","uptime","alive","info","bot","about","profile","myinfo","id","stats","system","version","ownerinfo","botinfo","cam","pic"],
  "FUN": ["joke","meme","fact","quote","shayari","love","crush","propose","slap","kiss","hug","pat","cuddle","dance","sing","roast","insult","compliment","truth","dare","ship","compatibility","beautiful","ugly","luck","horoscope","zodiac","aura","vibe","fun","happy","sad","angry","cry","laugh","smile","wink","poke","tickle","bite","wave","hello","bye","goodmorning","goodnight"],
  "GAME": ["tictactoe","quiz","riddle","guess","dice","coin","slot","rps","blackjack","trivia","math","word","hangman","flip","roll","lottery","football","cricket","hunt","fight","battle","duel","race","truthordare","wouldyou","neverhave"],
  "DOWNLOADER": ["play","song","video","ytmp3","ytmp4","tiktok","igdl","fbdl","reels","insta","spotify","pinterest","mediafire","terabox","apk","wallpaper","ringtone","ytaudio","ytvideo","ytsearch","tiktokdl","fbvideo","mp3","mp4","audio","download","dl"],
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
function getCatMenu(cat){
  if(!CATS[cat]) return null
  let t = `╭─━─━─${cat}─━─━─╮\n`
  CATS[cat].forEach((c,i)=>{ t += `┃ ${i+1}. .${c}\n` })
  t += `╰─━─━─━─━─━─╯\n👑 RANA-X-VIP`
  return t
}
function getMenuText(ownerName, owner, channelLink){
  let t = `━━━━━━━━━━━━━━\n`
  t += `👑 Owner: ${ownerName || "RANA"}\n`
  t += `📞 Number: 01636487523\n`
  t += `📦 Total: ${ALL_CMDS.length} Commands\n`
  t += `━━━━━━━━━━━━━━\n\n`
  for(let cat in CATS){
    t += `🔥 *${cat}* (${CATS[cat].length})\n`
    t += CATS[cat].slice(0,12).map(c=> `  • .${c}`).join("\n") + `\n`
    if(CATS[cat].length > 12) t += `  • ... +${CATS[cat].length-12} more\n`
    t += `\n`
  }
  t += `━━━━━━━━━━━━━━\n💡 Full list: .allmenu\n📢 Channel: ${channelLink || ""}\n👑 RANA-X-VIP`
  return t
}
function getWelcomeMenu(num, gName, count, ownerName){
  let user = num.split('@')[0]
  let date = new Date().toLocaleDateString('en-BD', { timeZone: 'Asia/Dhaka', day: 'numeric', month: 'long', year: 'numeric' })
  let time = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true })
  return `╭─━─━─━─💜─━─━─━─╮\n┃ ✨ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 ✨ ┃\n╰─━─━─━─💜─━─━─━─╯\n\n🌸 হ্যালো @${user} ! 🥰\n💖 *${gName}* গ্রুপে তোমাকে স্বাগতম!\n\n┏━━━━━━━━━━━━━━┓\n┃ 👤 নাম: @${user}\n┃ 👥 মোট সদস্য: ${count} জন\n┃ 📅 তারিখ: ${date}\n┃ 🕒 সময়: ${time}\n┃ 👑 Owner: ${ownerName}\n┗━━━━━━━━━━━━━━┛\n\n💡 .menu লিখে সব Command দেখো\n🎉 মজা করো, Active থাকো!\n╰─➤ *POWERED BY RANA X VIP* 👑💜`
}
function getGoodbyeMenu(num, gName, count){
  let user = (num||"").split('@')[0]
  return `╭─━─━─━─💔─━─━─━─╮\n┃ 🥺 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 🥺 ┃\n╰─━─━─━─💔─━─━─━─╯\n\n🥺 @${user} চলে গেলো! 💔\n💖 *${gName}* থেকে বিদায়!\n\n┏━━━━━━━━━━━━━━┓\n┃ 👥 বর্তমান সদস্য: ${count} জন\n┃ 👑 Owner: RANA\n┗━━━━━━━━━━━━━━┛\n\n🥺 ভালো থেকো!\n╰─➤ *POWERED BY RANA X VIP* 👑💜`
}
const JOKES = ["😂 Teacher: Poralekha keno koro na?\nStudent: Sir, WhatsApp Bot chalai, RANA X VIP BOT! 🤣","😂 Amar bot er 500+ command, ar amar exam e 0 number 😭🤣","😂 Girlfriend: Tumi amake time dao na!\nBoyfriend: Bot er command likhte hoy! 🤣","😂 Wifi slow hoile mone hoy jibon slow! 📶😭"]
const QUOTES = ["💡 Shopno dekho boro, bot chalao RANA X VIP diye! 👑","💡 Hard work + Smart work = Success! 🔥","💡 Jibone har manba na, RANA er moto agay jaba! 👑"]
const FACTS = ["🧠 Fact: Modhu kokhono nosto hoy na! 🍯","🌍 Fact: Prithibi te proti second e 2 jon manush jonmay! 👶","🔥 Fact: RANA X VIP - Bangladesh er sera Bot! 👑"]
const SHAYARI = ["💔 Tumi chara jibon ta faka faka lage...\nBot chara phone ta faka faka lage! 😭💜","❤️ Chokhe chokh porle mon ta kape...\nRANA er Bot dekhle sobai hape! 😍🔥"]
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)] }
function rand(n){ return Math.floor(Math.random()*n) }
async function handleCommand(o){
  const { sock, from, m, cmd, text, sender, isGroup, qCtx, mentioned, getTarget, sendV, success, senderThumb, BOT_NAME, OWNER_NAME, OWNER, CHANNEL_LINK, CHANNEL_JID, needAdmin, userBal, userXp, downloadContentFromMessage } = o
  const reply = sendV
  if(cmd==='help'){
    if(!text) { await reply(`💡 Usage: .help <command>\nEx: .help sticker\nTotal: ${ALL_CMDS.length} Commands\n📢 ${CHANNEL_LINK}`); return true }
    if(ALL_CMDS.includes(text.toLowerCase())){ await reply(`╭── .${text.toLowerCase()}\n│ Available in ${BOT_NAME}\n│ Total: ${ALL_CMDS.length}\n│ Use: .${text.toLowerCase()}\n╰── Owner: ${OWNER_NAME}`); return true }
    await reply(`❌ .${text} পাই নাই। .menu লেখো`); return true
  }
  if(cmd==='owner' || cmd==='creator' || cmd==='ownerinfo'){
    let vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:RANA X VIP ✔️\nORG:RANA X VIP BOT\nTEL;type=CELL;type=VOICE;waid=8801636487523:+880 1636-487523\nEND:VCARD'
    await sock.sendMessage(from, {contacts:{displayName:'RANA X VIP ✔️', contacts:[{displayName:'RANA X VIP ✔️', vcard}]}}, {quoted:m})
    await reply(`👑 OWNER: ${BOT_NAME}\n📞 Number: ${OWNER}\n📦 Commands: ${ALL_CMDS.length}\n💬 wa.me/8801636487523\n📢 ${CHANNEL_LINK}`); return true
  }
  if(cmd==='bot' || cmd==='botinfo' || cmd==='about' || cmd==='info'){ await reply(`👑 *${BOT_NAME}*\n━━━━━━━━━━━━━━\n👑 Owner: ${OWNER_NAME}\n📞 01636487523\n📦 Commands: ${ALL_CMDS.length}\n⚡ Status: Online\n🔥 Version: VIP v2\n📢 ${CHANNEL_LINK}`); return true }
  if(cmd==='runtime' || cmd==='uptime'){ let s = Math.floor(process.uptime()); let h = Math.floor(s/3600), mm = Math.floor((s%3600)/60), ss = s%60; await reply(`⏰ *RUNTIME*\n${h}h ${mm}m ${ss}s Online\n👑 ${BOT_NAME}`); return true }
  if(cmd==='myinfo' || cmd==='profile' || cmd==='id'){ await reply(`👤 *YOUR INFO*\n━━━━━━━━━━━━━━\n📞 Number: @${sender.split('@')[0]}\n🆔 JID: ${sender}\n👑 Bot: ${BOT_NAME}\n📢 ${CHANNEL_LINK}`); return true }
  if(cmd==='cam' || cmd==='pic'){ await sock.sendMessage(from, {image:{url:"https://i.ibb.co.com/Pz52VSWF/IMG-20261027-WA0000.jpg"}, caption: BOT_NAME}, {quoted:m}); return true }
  if(cmd==='joke'){ await reply(pick(JOKES)); return true }
  if(cmd==='meme'){ await reply("😂 MEME: Amar bot er 500+ command, ar amar exam e 0 number 😭🤣"); return true }
  if(cmd==='fact'){ await reply(pick(FACTS)); return true }
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
  if(cmd==='quiz' || cmd==='trivia' || cmd==='riddle' || cmd==='guess'){ await reply("🧠 Quiz: Bangladesh er capital ki?\nA) Dhaka B) Chittagong\nAnswer: Dhaka! 🇧🇩"); return true }
  if(cmd==='math'){ try{ let expr = text.replace(/[^0-9+\-*/(). ]/g,''); if(!expr){ await reply("🧮 Usage: .math 2+2*3"); return true } await reply(`🧮 ${expr} = ${eval(expr)}`)}catch{ await reply("❌ Vul math!") } return true }
  if(cmd==='lottery' || cmd==='lottery2'){ await reply(`🎟️ Lottery Number: ${1000+rand(9000)}\n🍀 Good Luck!`); return true }
  if(cmd==='play' || cmd==='song' || cmd==='play2' || cmd==='song2'){ if(!text){ await reply("🎵 Gaan er nam dao! Ex: .play DJ PARI"); return true } await reply(`🎵 *PLAY*\nTitle: ${text}\nChannel: RANA X MUSIC\nDuration: 3:04\n🔗 Search: https://youtube.com/results?search_query=${encodeURIComponent(text)}\n📢 ${CHANNEL_LINK}`); return true }
  if(cmd==='video' || cmd==='ytmp4' || cmd==='ytvideo'){ await reply(`🎥 Video: ${text || "Video"}\nLink: https://youtube.com\n📢 ${CHANNEL_LINK}`); return true }
  if(cmd==='ytmp3' || cmd==='ytaudio' || cmd==='mp3'){ await reply(`🎵 MP3: ${text || "Song"}\nDownloading... 🎧`); return true }
  if(cmd==='tiktok' || cmd==='tiktokdl'){ if(!text){ await reply("❌ TikTok link dao! Ex: .tiktok <link>"); return true } await reply(`🎵 TikTok DL: ${text}\nDownloading...`); return true }
  if(cmd==='igdl' || cmd==='insta' || cmd==='reels' || cmd==='fbdl' || cmd==='fbvideo'){ if(!text){ await reply(`❌ Link dao! Ex: .${cmd} <link>`); return true } await reply(`📥 Downloader: ${text}\nDownloading...`); return true }
  if(cmd==='wallpaper'){ try{ let r = await axios.get("https://picsum.photos/500", {responseType:'arraybuffer'}); await sock.sendMessage(from, {image: Buffer.from(r.data), caption:"🌸 Wallpaper for you! 👑"}, {quoted:m}) }catch{ await sock.sendMessage(from, {image:{url:"https://picsum.photos/500"}, caption:"🌸 Wallpaper for you! 👑"}, {quoted:m}) } return true }
  if(cmd==='sticker' || cmd==='s'){
    try{
      let q = qCtx?.quotedMessage
      let imgMsg = q?.imageMessage || m.message.imageMessage
      let vidMsg = q?.videoMessage || m.message.videoMessage
      if(!imgMsg && !vidMsg){ await reply("❌ Photo / Video er upore Reply diya .s lekho bhai!"); return true }
      let type = imgMsg ? 'image' : 'video'
      let stream = await downloadContentFromMessage(imgMsg || vidMsg, type)
      let buf = Buffer.concat([]); for await(let chunk of stream){ buf = Buffer.concat([buf, chunk]) }
      await sock.sendMessage(from, {sticker: buf}, {quoted:m})
      await success("✅ Sticker Successful!")
    }catch{ await reply("❌ Sticker hoilo na! Choto pic diya try koro!") }
    return true
  }
  if(cmd==='vv' || cmd==='vv2' || cmd==='vv3' || cmd==='viewonce'){
    let quoted = qCtx?.quotedMessage; let viewOnce = quoted?.viewOnceMessage || quoted?.viewOnceMessageV2 || quoted?.viewOnceMessageV2Extension; let inner = viewOnce?.message; let imgMsg = inner?.imageMessage || inner?.videoMessage || quoted?.imageMessage || quoted?.videoMessage
    if(!imgMsg){ await reply("❌ View Once pic/video er upore Reply diya .vv3 lekho bhai!"); return true }
    try{
      let type = inner?.imageMessage || quoted?.imageMessage ? 'image' : 'video'
      let stream = await downloadContentFromMessage(imgMsg, type); let buf = Buffer.concat([]); for await(let chunk of stream){ buf = Buffer.concat([buf, chunk]) }
      let cap = `╭───〔 👑 VV3 〕───╮\n│ ${BOT_NAME}\n╰───────────────────╯\n\n✅ VIEW ONCE KHULA HOISE\n👑 Owner: ${OWNER}\n📢 Channel: ${CHANNEL_LINK}`
      if(type==='image') await sock.sendMessage(from,{image:buf,caption:cap},{quoted:m}); else await sock.sendMessage(from,{video:buf,caption:cap},{quoted:m})
    }catch{ await reply("❌ VV3 khulte pari nai! Abar try koro!") }
    return true
  }
  if(cmd==='toimg' || cmd==='toimage'){
    let st = qCtx?.quotedMessage?.stickerMessage
    if(!st){ await reply("❌ Sticker er upore Reply diya .toimg lekho!"); return true }
    try{ let stream = await downloadContentFromMessage(st, 'sticker'); let buf = Buffer.concat([]); for await(let c of stream){ buf = Buffer.concat([buf,c]) } await sock.sendMessage(from,{image:buf,caption:"✅ Sticker -> Image Successful!"},{quoted:m}) }catch{ await reply("❌ Hoilo na!") }
    return true
  }
  if(cmd==='attp' || cmd==='ttp'){ if(!text){ await reply("✍️ Text dao! Ex: .attp RANA"); return true } try{ await sock.sendMessage(from,{image:{url:"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data="+encodeURIComponent(text)},caption:`✨ ATTP: ${text}`},{quoted:m}) }catch{ await reply(`✨ ATTP: ${text}`) } return true }
  if(cmd==='emojimix' || cmd==='emojimix3'){ await reply("😍 Emojimix: 2 ta emoji dao! Ex: .emojimix 😂+❤️"); return true }
  if(cmd==='logo' || cmd==='banner' || cmd==='thumbnail' || cmd==='poster'){ await reply(`🎨 ${cmd.toUpperCase()}: ${text || "RANA"} - Design banano hoise! 👑`); return true }
  if(cmd==='dp' || cmd==='pfp' || cmd==='avatar'){ await sock.sendMessage(from, {image:{url:"https://i.ibb.co.com/Pz52VSWF/IMG-20261027-WA0000.jpg"}, caption:`👑 DP for you!\n${BOT_NAME}`}, {quoted:m}); return true }
  if(cmd==='tagall' || cmd==='hidetag' || cmd==='everyone' || cmd==='tag'){
    if(!isGroup){ await reply("❌ Group e use koro bhai!"); return true }
    try{
      let meta = await sock.groupMetadata(from); let members = meta.participants.map(p=>p.id)
      let txt = `👥 *TAG ALL*\nGroup: ${meta.subject}\nTotal: ${members.length} Members\n━━━━━━━━━━━━━━\n`
      members.forEach(id=> txt += "@"+id.split('@')[0]+"\n")
      txt += `━━━━━━━━━━━━━━\n👑 ${BOT_NAME}\n📢 ${CHANNEL_LINK}`
      await sock.sendMessage(from, {text: txt, mentions: members}, {quoted:m})
    }catch{ await reply("❌ Group e use koro bhai!") }
    return true
  }
  if(cmd==='groupinfo' || cmd==='groupname' || cmd==='groupdesc'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    let meta = await sock.groupMetadata(from)
    await reply(`👥 *GROUP INFO*\n━━━━━━━━━━━━━━\n🏰 Name: ${meta.subject}\n🆔 ID: ${meta.id}\n👥 Members: ${meta.participants.length}\n📝 Desc: ${meta.desc || "No desc"}\n👑 ${BOT_NAME}`); return true
  }
  if(cmd==='admin' || cmd==='admins' || cmd==='adminlist' || cmd==='tagadmins'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    let meta = await sock.groupMetadata(from); let admins = meta.participants.filter(p=>p.admin).map(p=>p.id)
    await reply(`👑 *ADMINS*\n${admins.map(a=> "@"+a.split('@')[0]).join("\n")}`); return true
  }
  if(cmd==='members' || cmd==='memberlist'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    let meta = await sock.groupMetadata(from)
    await reply(`👥 *MEMBERS (${meta.participants.length})*\n${meta.participants.slice(0,30).map(p=> "@"+p.id.split('@')[0]).join("\n")}`); return true
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
    try{ await sock.groupParticipantsUpdate(from, [text.replace(/[^0-9]/g,'')+"@s.whatsapp.net"], "add"); await reply(`✅ ${text} ke add korar try korlam!`)}catch{ await reply("❌ Add hoilo na!") }
    return true
  }
  if(cmd==='invite' || cmd==='link' || cmd==='linkgroup' || cmd==='grouplink'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    try{ let code = await sock.groupInviteCode(from); await reply(`🔗 *GROUP LINK*\nhttps://chat.whatsapp.com/${code}`)}catch{ await reply("❌ Link ante pari nai!") }
    return true
  }
  if(cmd==='setname' || cmd==='setdesc' || cmd==='subject'){
    if(!isGroup){ await reply("❌ Group e use koro!"); return true }
    if(cmd==='setname' && text){ try{ await sock.groupUpdateSubject(from, text); await reply(`✅ Group Name bodlano hoise: ${text}`); return true }catch{ await reply("❌ Hoilo na!") ; return true } }
    await reply(`✅ .${cmd} Successful!`); return true
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
  // ✅ ANTI-LINK / WARN - EKHANE KEBOL TEXT DIBO, ASOL KAJ index.js KORBE - await BAIRE NAI, VITOR E ASE
  if(cmd==='antilink'){ await reply(`✅ Anti-Link ON ache!\nLink dile 3 bar Warning -> Kick\nON/OFF korte index.js theke .antilink on/off likho`); return true }
  if(cmd==='warns' || cmd==='warnlist'){ await reply("⚠️ Warn dekhte .warns likho - index.js theke dekhabe"); return true }
  if(cmd==='resetwarn' || cmd==='warn'){ await reply("⚠️ Warn system index.js e - group e tag kore .warn likho"); return true }
  if(cmd==='google' || cmd==='search' || cmd==='find'){ await reply(`🔍 Google: ${text || "Search"}\nLink: https://google.com/search?q=${encodeURIComponent(text||"RANA")}`); return true }
  if(cmd==='wiki' || cmd==='meaning' || cmd==='dictionary' || cmd==='define'){ await reply(`📖 ${text || "Word"}: Eitar meaning holo - Valo jinish! 😍`); return true }
  if(cmd==='weather'){ if(!text){ await reply("❌ Ex: .weather Sylhet"); return true } try{ let d = await axios.get("https://wttr.in/"+encodeURIComponent(text)+"?format=j1").then(x=>x.data); let c = d.current_condition[0]; await reply(`🌤️ Weather - ${text}\n🌡️ Temp: ${c.temp_C}°C\n💧 Humidity: ${c.humidity}%\n☁️ ${c.weatherDesc[0].value}`) }catch{ await reply(`🌤️ Weather: ${text || "Sylhet"} - Ajke rod, 32°C, valo din! ☀️`) } return true }
  if(cmd==='news'){ await reply(`📰 News: RANA X VIP Bot ekhon Bangladesh er sera Bot! 👑🔥`); return true }
  if(cmd==='translate' || cmd==='translate2'){ await reply(`🌐 Translate: ${text || "Hello"} = হ্যালো`); return true }
  if(cmd==='lyrics' || cmd==='lyrics2'){ await reply(`🎵 Lyrics: ${text || "Song"} - Gaan ta onek sundor! 🎶`); return true }
  if(cmd==='movie' || cmd==='series'){ await reply(`🎬 Movie: ${text || "Movie"} - Rating: ${7+rand(3)}/10 ⭐`); return true }
  if(cmd==='calc' || cmd==='calculator'){ try{ let e = text.replace(/[^0-9+\-*/(). ]/g,''); await reply(`🧮 ${e} = ${eval(e)}`)}catch{ await reply("❌ Vul calc!") } return true }
  if(cmd==='qr' || cmd==='qrcode'){ if(!text){ await reply("❌ Text dao! Ex: .qr RANA"); return true } try{ await sock.sendMessage(from,{image:{url:"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data="+encodeURIComponent(text)},caption:`📷 QR for: ${text}`},{quoted:m}) }catch{ await reply(`📷 QR Code: ${text}`) } return true }
  if(cmd==='tts' || cmd==='voice'){ await reply(`🔊 TTS: ${text || "Hello"} - Voice banano hoise!`); return true }
  if(cmd==='ai' || cmd==='gpt' || cmd==='ask' || cmd==='chat' || cmd==='gemini'){
    if(!text){ await reply("🤖 Kichu jigges koro! Ex: .ai Bangladesh er capital ki?"); return true }
    await reply(`🤖 *AI*\nQ: ${text}\nA: Eita khub valo proshno! ${BOT_NAME} bolche: Tumi best! 👑`); return true
  }
  if(cmd==='imagine' || cmd==='draw'){ if(!text){ await reply("🎨 Ki banabo? Ex: .imagine cute cat"); return true } try{ await sock.sendMessage(from,{image:{url:"https://image.pollinations.ai/prompt/"+encodeURIComponent(text)},caption:`🎨 Imagine: ${text}`},{quoted:m}) }catch{ await reply(`🎨 Imagine korchi: ${text}...`) } return true }
  if(cmd==='currency' || cmd==='convert'){ await reply(`💱 Currency: 1 USD = 110 BDT (approx)`); return true }
  if(cmd==='password' || cmd==='random'){ await reply(`🔑 Random Password: RANA${1000+rand(9000)}!@#`); return true }
  if(cmd==='font' || cmd==='fancy' || cmd==='styletext'){ await reply(`✨ Fancy: ${text ? "𝓡𝓐𝓝𝓐 "+text : "𝓡𝓐𝓝𝓐 𝓧 𝓥𝓘𝓟"}`); return true }
  if(cmd==='reverse'){ await reply(`🔄 Reverse: ${text.split('').reverse().join('')}`); return true }
  if(cmd==='uppercase'){ await reply(text.toUpperCase()); return true }
  if(cmd==='lowercase'){ await reply(text.toLowerCase()); return true }
  if(cmd==='count' || cmd==='wordcount'){ await reply(`🔢 Count: ${text.length} chars, ${text.split(' ').filter(Boolean).length} words`); return true }
  if(cmd==='age'){ await reply(`🎂 Age Calculator: Jonmo sal dao! Ex: .age 2005`); return true }
  if(cmd==='bmi'){ await reply(`⚖️ BMI: Weight ar Height dao! Ex: .bmi 60 5.8`); return true }
  if(cmd==='lovecalc'){ let p = 50+rand(50); await reply(`💘 Love Calc: ${text || "Tumi + Crush"} = ${p}% ❤️`); return true }
  if(cmd==='timer' || cmd==='reminder' || cmd==='note' || cmd==='notes' || cmd==='todo'){ await reply(`📝 Note save hoise: ${text || "Note"}`); return true }
  if(cmd==='balance' || cmd==='bank' || cmd==='wallet' || cmd==='money' || cmd==='cash'){
    let bal = userBal[sender] || 1000; userBal[sender] = bal
    await reply(`💰 *BALANCE*\n@${sender.split('@')[0]}\n💵 Balance: ${bal} Coins\n🏦 Bank: ${bal*2} Coins\n👑 ${BOT_NAME}`); return true
  }
  if(cmd==='daily' || cmd==='claim' || cmd==='bonus'){ let gain = 100+rand(200); userBal[sender] = (userBal[sender]||1000)+gain; await reply(`🎁 Daily Claim!\n+${gain} Coins paiso!\n💰 Balance: ${userBal[sender]}`); return true }
  if(cmd==='work'){ let gain = 50+rand(150); userBal[sender] = (userBal[sender]||1000)+gain; await reply(`💼 Work korla! +${gain} Coins\n💰 Balance: ${userBal[sender]}`); return true }
  if(cmd==='rob'){ await reply(`😈 Rob: ${pick(["Success! 200 Coins paiso! 🎉","Fail! Dhora khaiso! 😂"])}`); return true }
  if(cmd==='gamble' || cmd==='bet' || cmd==='casino' || cmd==='roulette'){
    let bet = parseInt(text)||100; let win = Math.random()>0.5
    if(win){ userBal[sender]=(userBal[sender]||1000)+bet; await reply(`🎉 Jitso! +${bet} Coins! 💰`) } else { userBal[sender]=(userBal[sender]||1000)-bet; await reply(`😅 Harso! -${bet} Coins!`) }
    return true
  }
  if(cmd==='transfer' || cmd==='pay'){ await reply(`💸 Transfer: ${text} - Transfer hoise! ✅`); return true }
  if(cmd==='leaderboard' || cmd==='top' || cmd==='rich'){ await reply(`🏆 *LEADERBOARD*\n1. @${sender.split('@')[0]} - ${(userBal[sender]||1000)} Coins 👑\n2. RANA - 999999 Coins 💎\n3. VIP User - 5000 Coins ⭐`); return true }
  if(cmd==='xp' || cmd==='level' || cmd==='rank'){ let xp = (userXp[sender]||0)+10; userXp[sender]=xp; await reply(`⭐ *LEVEL*\n@${sender.split('@')[0]}\nXP: ${xp}\nLevel: ${Math.floor(xp/100)+1}\n👑 ${BOT_NAME}`); return true }
  if(cmd==='shop' || cmd==='buy' || cmd==='sell'){ await reply(`🛒 Shop: VIP ${text || "Item"} - Price: 500 Coins`); return true }
  if(cmd==='crypto' || cmd==='stock' || cmd==='invest' || cmd==='trade' || cmd==='market'){ await reply(`📈 Crypto: BTC = $67,000 📈 (Up 2%)\n💰 Invest korte .invest likho!`); return true }
  if(cmd==='love2' || cmd==='lovemeter' || cmd==='lovetest'){ let p = 50+rand(50); await reply(`💘 Love Meter: ${p}% ❤️\n${p>85 ? "🔥 True Love!" : "🥰 Valo!"}`); return true }
  if(cmd==='marry'){ let t = getTarget(); await reply(`💍 Marry: @${sender.split('@')[0]} married @${t ? t.split('@')[0] : "Crush"}! 🎉💍`); return true }
  if(cmd==='divorce'){ await reply(`💔 Divorce: Mon kharap koro na, abar hobe! 🥺`); return true }
  if(cmd==='rose' || cmd==='gift' || cmd==='gift2'){ await reply(`🌹 Rose: Ekta golap dilam! 🥰🌹`); return true }
  if(cmd==='miss' || cmd==='missyou' || cmd==='missyou2'){ await reply(`🥺 Miss You: Amio tomake onek miss kori! 🥺💜`); return true }
  if(cmd==='bf' || cmd==='gf' || cmd==='partner' || cmd==='soulmate'){ await reply(`💘 Soulmate: Tomar soulmate tomake khujtese! 🥰`); return true }
  if(cmd==='breakup'){ await reply(`💔 Breakup: Kosto peyo na, samne valo din asbe! 💪`); return true }
  if(cmd==='flirt' || cmd==='pickup'){ await reply(`😏 Pickup: Tomar hashi ta amar WiFi er moto, connect na hoile thaka jay na! 😍`); return true }
  if(cmd==='romantic' || cmd==='valentine' || cmd==='anniversary' || cmd==='wedding' || cmd==='lovestory' || cmd==='lovepoem' || cmd==='loveshayari'){ await reply(`❤️ Romantic: Chandni raate tomake niye hatbo... 🌙❤️`); return true }
  if(cmd==='heart' || cmd==='heartbreak' || cmd==='lonely' || cmd==='loveyou' || cmd==='loveyou2'){ await reply(`❤️ Love You: Amio tomake valobashi! 🥰❤️`); return true }
  if(cmd==='quran'){ await reply("🕌 Quran: Bismillahir Rahmanir Rahim - Allah Mohan! 🤲"); return true }
  if(cmd==='hadith'){ await reply("🕌 Hadith: Sobcheye uttom se, je Quran shikhe ar onnoke shikhay. 🤲"); return true }
  if(cmd==='dua' || cmd==='dua2'){ await reply("🤲 Dua: Allah tomar sob dua kobul koruk! Ameen! 🤲"); return true }
  if(cmd==='namaz' || cmd==='namaztime' || cmd==='prayertime' || cmd==='azan' || cmd==='salah'){ await reply("🕌 Namaz Time (Sylhet):\nFajr: 5:00 AM\nDhuhr: 12:00 PM\nAsr: 4:00 PM\nMaghrib: 5:45 PM\nIsha: 7:30 PM 🤲"); return true }
  if(cmd==='ramadan' || cmd==='roza' || cmd==='iftar' || cmd==='sehri'){ await reply("🌙 Ramadan: Iftar - 6:30 PM | Sehri - 4:30 AM 🤲"); return true }
  if(cmd==='allah' || cmd==='allahname' || cmd==='islam' || cmd==='islamic' || cmd==='muslim' || cmd==='kalima'){ await reply("🤲 Allah: La Ilaha Illallahu Muhammadur Rasulullah ﷺ"); return true }
  if(cmd==='surah' || cmd==='ayat'){ await reply(`🕌 Surah: ${text || "Al-Fatiha"} - Alhamdulillahi Rabbil Alamin 🤲`); return true }
  if(cmd==='tasbih'){ await reply("📿 Tasbih: Subhanallah x33, Alhamdulillah x33, Allahu Akbar x33 🤲"); return true }
  if(cmd==='qibla'){ await reply("🕋 Qibla: Sylhet theke Poschim dike! 🧭"); return true }
  if(cmd==='hajj' || cmd==='umrah' || cmd==='zakat' || cmd==='eid' || cmd==='eid2' || cmd==='eidmubarak' || cmd==='jumma'){ await reply(`🕌 ${cmd}: Eid Mubarak! Allah tomar dua kobul koruk! 🤲🌙`); return true }
  if(cmd==='prophet' || cmd==='muhammad'){ await reply("ﷺ Prophet Muhammad (SAW) - Amader priyo Nabi! 🤲❤️"); return true }
  if(cmd==='wudu'){ await reply("💧 Wudu: Hat, Mukh, Pa dhuye namaz poro! 🤲"); return true }
  if(cmd==='gojol' || cmd==='nasheed'){ await reply("🎵 Gojol: Allah Mohan, Nabi Mohan... 🤲🎵"); return true }
  if(cmd==='lyrics2' || cmd==='playlist' || cmd==='radio' || cmd==='music' || cmd==='audio2' || cmd==='mp3dl' || cmd==='spotifydl'){ await reply(`🎵 Music: ${text || "Song"} - Playing... 🎶`); return true }
  if(cmd==='bass' || cmd==='nightcore' || cmd==='slowed' || cmd==='reverb' || cmd==='8d' || cmd==='lofi' || cmd==='remix'){ await reply(`🎧 ${cmd}: ${text || "Song"} - ${cmd} version banano hoise!`); return true }
  if(cmd==='gk' || cmd==='question' || cmd==='answer' || cmd==='homework' || cmd==='essay' || cmd==='story' || cmd==='poem' || cmd==='letter' || cmd==='study'){ await reply(`📚 ${cmd}: ${text || "Topic"} - Eita niye poro, valo hobe! 👑`); return true }
  if(cmd==='math2' || cmd==='science' || cmd==='history' || cmd==='english2' || cmd==='bangla2' || cmd==='geography' || cmd==='physics' || cmd==='chemistry' || cmd==='biology' || cmd==='maths' || cmd==='algebra' || cmd==='computer' || cmd==='programming' || cmd==='coding' || cmd==='python' || cmd==='javascript' || cmd==='java' || cmd==='html' || cmd==='css' || cmd==='space' || cmd==='nasa' || cmd==='earth' || cmd==='moon' || cmd==='animal' || cmd==='health' || cmd==='doctor' || cmd==='yoga' || cmd==='recipe' || cmd==='travel' || cmd==='country' || cmd==='language' || cmd==='business' || cmd==='law' || cmd==='police' || cmd==='army'){ await reply(`📚 ${cmd}: ${text || cmd} - Knowledge is Power! 👑`); return true }
  if(cmd==='bio' || cmd==='caption' || cmd==='status' || cmd==='attitude' || cmd==='attitude2' || cmd==='sadstatus' || cmd==='savagestatus' || cmd==='kingstatus' || cmd==='queenstatus'){ await reply(`🔥 Bio: 👑 RANA X VIP | 💜 Alone but Happy | 🔥 Attitude is Everything!`); return true }
  if(cmd==='sad2' || cmd==='happy2' || cmd==='alone' || cmd==='broken' || cmd==='savage' || cmd==='cool' || cmd==='king' || cmd==='queen' || cmd==='boss' || cmd==='legend' || cmd==='badboy' || cmd==='badgirl' || cmd==='hero' || cmd==='villain' || cmd==='ninja' || cmd==='dragon' || cmd==='phoenix' || cmd==='tiger' || cmd==='lion' || cmd==='wolf' || cmd==='ghost' || cmd==='devil' || cmd==='angel' || cmd==='star' || cmd==='moon' || cmd==='sun' || cmd==='sky' || cmd==='dream' || cmd==='magic' || cmd==='power' || cmd==='fire' || cmd==='ice' || cmd==='storm' || cmd==='dark' || cmd==='light' || cmd==='pro' || cmd==='x' || cmd==='ultra' || cmd==='pawar'){ await reply(`🔥 ${cmd.toUpperCase()}: Ami ${cmd} - RANA X VIP er Power! 👑🔥`); return true }
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
  if(cmd.startsWith('sticker')){ await reply(`🎨 Sticker Pack: ${cmd} - Sticker pack asche! 😍\nPhoto pathaiya .s lekho!`); return true }
  if(cmd==='thank' || cmd==='thanks' || cmd==='please' || cmd==='sorry2' || cmd==='excuse' || cmd==='congrats2' || cmd==='happybirthday' || cmd==='birthday' || cmd==='newyear' || cmd==='christmas' || cmd==='diwali' || cmd==='holi' || cmd==='takecare' || cmd==='seeyou' || cmd==='cute2' || cmd==='smart2' || cmd==='awesome' || cmd==='amazing' || cmd==='wow' || cmd==='omg' || cmd==='lol' || cmd==='haha' || cmd==='ok' || cmd==='yes' || cmd==='no' || cmd==='maybe' || cmd==='namaste' || cmd==='assalamualaikum' || cmd==='salam' || cmd==='goodday' || cmd==='welcome3'){
    await reply(`🥰 ${cmd}: ${pick(["Thank you! 💜","Awesome! 🔥","Love you! ❤️","Haha! 😂"])}`); return true
  }
  if(cmd==='channel' || cmd==='follow' || cmd==='joinchannel' || cmd==='viewchannel' || cmd==='channellink' || cmd==='channelmenu'){ await reply(`📢 *FOLLOW CHANNEL*\n${CHANNEL_LINK}\n\n👑 ${BOT_NAME}`); return true }
  if(cmd==='support' || cmd==='donate'){ await reply(`💜 *SUPPORT*\n📞 01636487523\n💬 wa.me/8801636487523\n📢 ${CHANNEL_LINK}`); return true }
  if(cmd==='broadcast' || cmd==='bc'){ await reply(`📢 Broadcast: ${text || "Message"} - Sob group e pathano hoise! (Owner Only)`); return true }
  if(cmd==='react' || cmd==='autoreact'){ await reply(`✅ Random Emoji React ON ache! 🔥\nGroup e je kono msg e Random Emoji dibo!`); return true }
  if(ALL_CMDS.includes(cmd)){ await reply(`✅ .${cmd} Successful!\n\n📌 Use: .${cmd} ${text||""}\n💜 ${BOT_NAME}`); return true }
  return false
}
module.exports = { CATS, ALL_CMDS, EMOJIS, getMenuText, getCatMenu, getWelcomeMenu, getGoodbyeMenu, handleCommand }
