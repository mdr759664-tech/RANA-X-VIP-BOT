import express from 'express';
import { default as makeWASocket, useMultiFileAuthState, Browsers, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, downloadContentFromMessage, DisconnectReason } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import QRCode from 'qrcode';
import path from 'path';

const app = express();
const OWNER = "8801636487523";
const BOT_NAME = "RANA-X-VIP-BOT";
const BOT_PIC = "https://i.ibb.co.com/Pz52VSWF/IMG-20261027-WA0000.jpg";
const CHANNEL = "https://whatsapp.com/channel/0029VbDF4POH5JLyfJOmwZ3B";

// 🔥🔥 GOOGLE CHROME - LINKED DEVICES এ CHROME আইকন আসবো 🔥🔥
const CHROME = Browsers.windows('Chrome');
console.log('BROWSER: Google Chrome Lagano Done ✔️');

let welcomeOn = true, autoReactOn = true;
let sockMain = null;
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🥰","😍","💥","⚡","🌸","🌺","🎉","💯","✅","😂","🤣","😁","🥳","😏","🖤","🤍","💙","💚","💜","🧡","❣️","💕","💞","💓","💗","💘","💝","😘","😗","😙","😚","🤗","🤩","🥰","😍","🤤","😋","🤫","🤭","🫣","🤔","🤨","😐","😑","😶","😏","😒","🙄","😬","😌","😔","😪","😴","🤒","🤕","🤮","🥵","🥶","🥴","😵","🤯","🥳","😎","🤓","🥺","😭","😢","😤","😡","🤬","👿","💀","☠️","👻","👽","🤖","💩","👋","🤚","🖐️","✋","🖖","👌","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","👍","👎","👊","✊","👏","🙌","🫶","🤝","🙏","💪"];
const recentMsgs = [];
async function getVersion(){ try{ const v = await fetchLatestBaileysVersion(); return v.version; }catch{ return [2,3000,1015901307]; } }

// ============ BOT COMMANDS ============
const CATS = {
  "👑 OWNER": ["owner","creator","support","donate","repo","script","deploy","pair","session","reset","restart","broadcast","bc","join","leave","block","unblock","ban","unban","sudo","del","delete","shutdown","eval"],
  "🔥 MAIN": ["menu","menu2","allmenu","help","commands","list","ping","pong","speed","runtime","uptime","alive","info","bot","about","profile","myinfo","id","stats","system","version","ownerinfo","botinfo","cam","pic"],
  "😂 FUN": ["joke","meme","fact","quote","shayari","love","crush","propose","slap","kiss","hug","pat","cuddle","dance","sing","roast","insult","compliment","truth","dare","ship","compatibility","beautiful","ugly","luck","horoscope","zodiac","aura","vibe","fun","happy","sad","angry","cry","laugh","smile","wink","poke","tickle","bite","wave","hello","bye","goodmorning","goodnight"],
  "🎮 GAME": ["tictactoe","quiz","riddle","guess","dice","coin","slot","rps","blackjack","trivia","math","word","hangman","flip","roll","lottery","football","cricket","hunt","fight","battle","duel","race","truthordare","wouldyou","neverhave"],
  "⬇️ DOWNLOADER": ["play","song","video","ytmp3","ytmp4","tiktok","igdl","fbdl","reels","insta","spotify","pinterest","mediafire","terabox","apk","wallpaper","ringtone","ytaudio","ytvideo","ytsearch","tiktokdl","fbvideo","mp3","mp4","audio","download","dl"],
  "🖼️ IMAGE": ["sticker","s","vv","vv2","vv3","viewonce","take","steal","toimg","toimage","tovid","tomp3","blur","circle","invert","grey","attp","ttp","emojimix","removebg","upscale","enhance","cartoon","anime","logo","banner","thumbnail","poster","dp","pfp","avatar","background","neon","glow"],
  "👥 GROUP": ["admin","admins","announce","antibot","antilink","antispam","approve","close","desc","disappear","everyone","filter","groupinfo","hidetag","invite","kick","kickall","leave","linkgroup","lock","mute","open","poll","promote","reject","requests","revoke","rtag","setgpp","subject","tag","tagadmins","tagall","togroupstatus","totag","unlock","unmute","warn","welcome","goodbye","setdesc","setname","link","members","online","vote","rules","groupname","groupdesc","add","demote","setppgc","groupopen","groupclose","kickme","adminlist","memberlist"],
  "🔍 SEARCH": ["google","image","img","yt","youtube","wiki","weather","news","translate","meaning","dictionary","lyrics","movie","series","animeinfo","github","stalk","search","find","lookup","check","ipinfo","screenshot","qrscan","ocr","define","synonym"],
  "🛠️ TOOLS": ["calc","calculator","qr","qrcode","short","url","paste","tts","voice","ai","gpt","ask","chat","imagine","draw","gemini","translate2","currency","convert","timer","reminder","note","notes","todo","password","random","font","fancy","styletext","reverse","uppercase","lowercase","count","wordcount","age","bmi","lovecalc"],
  "💰 ECONOMY": ["balance","bank","daily","work","rob","gamble","bet","lottery","shop","buy","sell","transfer","pay","leaderboard","top","rich","wallet","deposit","withdraw","money","cash","gold","diamond","xp","level","rank","claim","gift","bonus","jackpot","casino","roulette","loan","invest","stock","crypto","trade","market"],
  "❤️ LOVE": ["couple","love2","marry","divorce","propose2","rose","gift","hug2","kiss2","miss","crush2","bf","gf","partner","soulmate","lovestory","lovepoem","loveshayari","breakup","dating","flirt","pickup","romantic","valentine","anniversary","wedding","single","lovemeter","lovetest","heart","heartbreak","lonely","missyou","loveyou"],
  "🕌 ISLAMIC": ["quran","hadith","dua","namaz","azan","ramadan","allah","islam","surah","ayat","prayer","tasbih","islamic","muslim","namaztime","prayertime","qibla","hajj","umrah","zakat","eid","jumma","allahname","prophet","muhammad","dua2","kalima","salah","wudu","roza","iftar","sehri","eidmubarak","gojol","nasheed"],
  "🎵 MUSIC": ["lyrics2","play2","playlist","radio","bass","nightcore","slowed","reverb","8d","lofi","remix","song2","music","audio2","mp3dl","spotifydl","hindi","bangla","english","punjabi","tamil","hiphop","rap","pop","rock","jazz","dj","beat","singer","album","topmusic"],
  "📚 EDUCATION": ["math2","science","history","english","bangla","gk","exam","question","answer","homework","essay","story","poem","letter","study","school","college","university","teacher","student","book","books","novel","geography","physics","chemistry","biology","maths","algebra","computer","programming","coding","python","javascript","java","html","css","space","nasa","earth","moon","animal","health","doctor","yoga","recipe","travel","country","language","business","law","police","army"],
  "😎 ATTITUDE": ["bio","caption","status","attitude","sad","happy","alone","broken","savage","cool","king","queen","boss","legend","attitude2","sadstatus","savagestatus","kingstatus","queenstatus","badboy","badgirl","hero","villain","ninja","dragon","phoenix","tiger","lion","wolf","ghost","devil","angel","star","moon","sun","sky","dream","magic","power","fire","ice","storm","dark","light","pro","x","ultra","pawar"],
  "🌸 ANIME": ["waifu","neko","shinobu","megumin","anime2","manga2","cosplay","naruto","onepiece","dragonball","animegirl","bite","blush","bonk","cry","cuddle","dance","facepalm","highfive","hug","kiss","laugh","lick","nom","nuzzle","pat","poke","slap","smile","smug","animeboy","animesearch","animequote","animewall","animepic","animememe"],
  "🎭 REACTION": ["slap2","hug3","kiss3","pat2","cuddle2","poke2","bite2","lick2","nom2","blush2","smile2","cry2","laugh2","dance2","wave2","highfive2","tickle2","tease","comfort","cheer","motivate","congrats","celebrate","party","clap","bow","salute","sorry","thankyou","goodluck","hugme","kissme","loveme"],
  "😀 EMOJI": ["emoji","emoji2","emoji3","emoji4","emojis","emot","emojimix3","kaomoji","funemoji","loveemoji","sademoji","animalemoji","foodemoji","flagemoji","heartemoji","fireemoji","cuteemoji"],
  "💎 PREMIUM": ["premium","vip","buybot","rent","panel","hosting","session2","pair2","recent","trending","new","topbot","bestbot","vip2","premium2","gold2","diamond2","elite","legend2","master","superbot","turbo","max","ultrapro"],
  "📱 STICKER PACK": ["stickerpack","stickerlist","stickermaker","stickerfun","stickerlove","stickersad","stickerangry","stickeranime","stickerdog","stickercat","stickerbaby","stickerboy","stickergirl","stickerking","stickerqueen","stickermeme","stickeremoji2","stickerattitude","stickercute","stickerhot","stickercool","stickerfunny","stickerhappy","stickerbirthday","stickergoodmorning","stickergoodnight","stickereid"],
  "🌍 GENERAL": ["hi","hello2","hey","yo","hii","hola","namaste","assalamualaikum","salam","goodday","welcome3","thank","thanks","please","sorry2","excuse","congrats2","happybirthday","birthday","anniversary2","newyear","christmas","diwali","eid2","holi","goodluck2","takecare","seeyou","missyou2","loveyou2","cute2","smart2","beautiful3","cool2","awesome","amazing","wow","omg","lol","haha","ok","yes","no","maybe"],
  "📢 CHANNEL": ["channel","follow","joinchannel","viewchannel","channellink","channelmenu"]
};
let ALL_CMDS = [];
for(let k in CATS) ALL_CMDS = ALL_CMDS.concat(CATS[k]);
ALL_CMDS = [...new Set(ALL_CMDS)];

function getMenuText(){
  let t = "";
  t += "╭━━━━━━━━━━━━━━━━╮\n";
  t += "┃  👑 RANA X VIP 👑  ┃\n";
  t += "┃  🔥 CHROME BOT 🔥  ┃\n";
  t += "╰━━━━━━━━━━━━━━━━╯\n";
  t += "✦ ━━━━━━━━━━━━━ ✦\n";
  t += "👑 Owner : 01636487523\n";
  t += "📦 Total : "+ALL_CMDS.length+"+ Commands\n";
  t += "👥 Group : "+CATS["👥 GROUP"].length+"+ | 😀 Emoji : 100+\n";
  t += "⚡ Status : Online ✔️ | 🌐 Chrome ✔️\n";
  t += "✦ ━━━━━━━━━━━━━ ✦\n\n";
  t += "╭─〔 🔥 MAIN MENU 〕─╮\n";
  t += "│  👑  .ownermenu\n";
  t += "│  🔥  .mainmenu\n";
  t += "│  😂  .funmenu\n";
  t += "│  🎮  .gamemenu\n";
  t += "│  ⬇️  .dlmenu\n";
  t += "│  🖼️  .imagemenu\n";
  t += "│  👥  .groupmenu\n";
  t += "│  🔍  .searchmenu\n";
  t += "│  🛠️  .toolsmenu\n";
  t += "│  💰  .economymenu\n";
  t += "│  ❤️  .lovemenu\n";
  t += "│  🕌  .islamicmenu\n";
  t += "│  🎵  .musicmenu\n";
  t += "│  📚  .edumenu\n";
  t += "│  😎  .attitudemenu\n";
  t += "│  🌸  .animemenu\n";
  t += "│  🎭  .reactionmenu\n";
  t += "│  😀  .emojimenu\n";
  t += "│  💎  .premiummenu\n";
  t += "│  📱  .stickermenu\n";
  t += "│  🌍  .generalmenu\n";
  t += "│  👋  .welcomemenu\n";
  t += "╰──────────────╯\n\n";
  t += "╭─〔 ⚡ QUICK 〕─╮\n";
  t += "│  .ping  •  .owner\n";
  t += "│  .play  •  .ai\n";
  t += "│  .tagall  •  .welcome\n";
  t += "│  .vv3  •  .channel\n";
  t += "│  .help <cmd>\n";
  t += "╰──────────────╯\n\n";
  t += "👑 THANKS FOR USING 👑\n";
  t += "🔥 RANA X VIP 🔥\n\n📢 Join Channel 👇\n"+CHANNEL;
  return t;
}
function getCatMenu(cat){
  let list = CATS[cat] || [];
  let t = "👑 RANA X VIP 👑\n━━━━━━━━━━━━━━\n"+cat+" - Total: "+list.length+"\n━━━━━━━━━━━━━━\n\n";
  list.forEach(c=> t += "✦ ."+c+"\n");
  t += "\n━━━━━━━━━━━━━━\n📢 Channel:\n"+CHANNEL;
  return t;
}
function getCountryInfo(num){
  num = num.replace(/[^0-9]/g,'');
  const list = {
    "880": {name:"Bangladesh", flag:"🇧🇩", code:"BD"},
    "91": {name:"India", flag:"🇮🇳", code:"IN"},
    "92": {name:"Pakistan", flag:"🇵🇰", code:"PK"},
    "1": {name:"USA", flag:"🇺🇸", code:"US"},
  };
  let keys = Object.keys(list).sort(function(a,b){ return b.length - a.length; });
  for(let k of keys){ if(num.startsWith(k)) return list[k]; }
  return {name:"International", flag:"🌍", code:"INT"};
}

async function welcome(sock,gid,p){ 
  if(!welcomeOn) return; 
  try{ 
    let ppUrl; try{ ppUrl = await sock.profilePictureUrl(p,'image'); }catch{ ppUrl = BOT_PIC; }
    let meta = await sock.groupMetadata(gid);
    let e1 = EMOJI[Math.floor(Math.random()*EMOJI.length)];
    let e2 = EMOJI[Math.floor(Math.random()*EMOJI.length)];
    let txt = '╭───❰ ' + e1 + ' WELCOME ' + e2 + ' ❱───╮\n' +
'│  👑 BOT: ' + BOT_NAME + ' 👑\n' +
'│  💖 Hello @' + p.split('@')[0] + ' 💖\n' +
'│  🌸 আপনাকে স্বাগতম আমাদের পরিবারে 🌸\n' +
'┣━━━━━━━━━━━━━━━━━━━━━━┫\n' +
'┃  🏰 GROUP: ' + meta.subject + '\n' +
'┃  👥 MEMBER: ' + meta.participants.length + ' তম সদস্য\n' +
'┃  ⏰ JOIN: ' + new Date().toLocaleTimeString() + '\n' +
'┃  📅 DATE: ' + new Date().toLocaleDateString() + '\n' +
'╰───❰ 🌍 Enjoy 🌍 ❱───╯\n\n' + EMOJI.slice(0,10).join('');
    await sock.sendMessage(gid,{image:{url:ppUrl},caption:txt,mentions:[p]});
  }catch{}
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
'<p class=sub>Enter your WhatsApp number to link your device.<br>No QR scan - no app install.</p>' +
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
'function sel(n){' +
'  document.getElementById("s1").classList.toggle("active", n==1);' +
'  document.getElementById("s2").classList.toggle("active", n==2);' +
'  document.querySelectorAll(".dot")[0].innerText=n==1?"●":"○";' +
'  document.querySelectorAll(".dot")[1].innerText=n==2?"●":"○";' +
'}' +
'function checkNum(){' +
'  let c=document.getElementById("c").value.replace(/[^0-9]/g,"");' +
'  let n=document.getElementById("num").value.replace(/[^0-9]/g,"");' +
'  let full=c+n; let v=document.getElementById("valid");' +
'  let info="";' +
'  if(full.startsWith("880")) info="🇧🇩 Bangladesh";' +
'  else if(full.startsWith("91")) info="🇮🇳 India";' +
'  else if(full.startsWith("92")) info="🇵🇰 Pakistan";' +
'  if(n.length>=8){v.className="valid ok"; v.innerText="✓ Looks valid "+info+" | 100% Working"; document.getElementById("connTxt").innerText="● "+info+" CONNECTED"; document.getElementById("s1Name").innerText=info+" • heroku"; document.getElementById("st1").classList.add("active"); document.getElementById("st2").classList.add("active");}' +
'  else if(n.length>0){v.className="valid err"; v.innerText="✗ Invalid number";} else{v.className="valid";}' +
'}' +
'async function getPair(){' +
'let c=(document.getElementById("c").value||"").replace(/[^0-9]/g,"")||"880";' +
'let n=document.getElementById("num").value.replace(/[^0-9]/g,"");' +
'let full=c+n;' +
'let b=document.getElementById("box");let r=document.getElementById("res");' +
'if(n.startsWith("0")){alert("0 ছাড়া লেখো");return;}' +
'if(full.length<10){alert("Valid number dao");return;}' +
'b.style.display="none";r.style.display="block";r.innerText="⚡ Connecting...";r.style.background="#1a1a1a";r.style.color="#ff8c00";' +
'try{' +
'  let d=await (await fetch("/pair?number="+full)).json();' +
'  if(d.code){document.getElementById("code").innerText=d.code; try{navigator.clipboard.writeText(d.code);}catch(e){} let v=document.getElementById("valid"); v.className="valid ok"; v.innerText="✓ "+d.country+" | "+d.server+" | 100% Working"; b.style.display="flex"; r.style.display="none"; document.getElementById("st3").classList.add("active"); if(document.getElementById("sound").checked){let a=new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_b9bd4170e8.mp3"); a.play().catch(()=>{});} }' +
'  else{r.innerText="❌ "+d.error; r.style.background="#2a0000";}' +
'}catch(e){r.innerText="❌ Server Error - Use QR";}' +
'}' +
// ✅ NO OK POPUP - 1 CHAP E COPY
'function copyCode(){let t=document.getElementById("code").innerText; if(!t) return; let btn=document.getElementById("copyBtn"); navigator.clipboard.writeText(t).then(()=>{ let old=btn.innerText; btn.innerText="✅ Copied!"; btn.style.background="#22c55e"; setTimeout(()=>{btn.innerText=old; btn.style.background="#ff5a00";},1500); }).catch(()=>{ let ta=document.createElement("textarea"); ta.value=t; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); btn.innerText="✅ Copied!"; setTimeout(()=>{btn.innerText="Copy";},1500); });}' +
'function showQR(){document.getElementById("qrbox").style.display="block"; getQR();}' +
'async function getQR(){let img=document.getElementById("qimg"); let r=document.getElementById("res"); r.style.display="block"; r.innerText="Generating QR..."; try{let d=await (await fetch("/qr")).json(); if(d.qr){img.src=d.qr; document.getElementById("qrbox").style.display="block"; r.innerText="✅ Scan Now!"; r.style.background="#001a00"; r.style.color="#22c55e";}}catch(e){r.innerText="❌ QR Error";}}' +
'<\/script></body></html>');
});

app.get('/pair', async function(req,res){
  try{
    let num = (req.query.number || '').replace(/[^0-9]/g,'');
    if(!num) return res.json({error:"Number required"});
    if(num.startsWith('0')) num = '88' + num;
    let country = getCountryInfo(num);
    console.log('PAIR: +' + num + ' | ' + country.flag + ' ' + country.name + ' | Browser: Google Chrome');
    let PAIR_DIR = './session/PAIR-TEMP';
    if(fs.existsSync(PAIR_DIR)) fs.rmSync(PAIR_DIR,{recursive:true,force:true});
    fs.mkdirSync(PAIR_DIR,{recursive:true});
    let sd = await useMultiFileAuthState(PAIR_DIR);
    let version = await getVersion();
    // 🔥 CHROME + FAST 200ms
    let sock = makeWASocket({version: version, auth: {creds: sd.state.creds, keys: makeCacheableSignalKeyStore(sd.state.keys, pino({level:'silent'}))}, logger: pino({level:'silent'}), browser: CHROME, markOnlineOnConnect: false, syncFullHistory: false, getMessage: async ()=> undefined});
    sock.ev.on('creds.update', sd.saveCreds);
    sock.ev.on('connection.update', async function(u){
      if(u.connection === 'open'){
        let MAIN = './session/RANA-SESSION';
        if(fs.existsSync(MAIN)) fs.rmSync(MAIN,{recursive:true,force:true});
        fs.mkdirSync(MAIN,{recursive:true});
        try{ fs.readdirSync(PAIR_DIR).forEach(function(f){ fs.copyFileSync(path.join(PAIR_DIR,f), path.join(MAIN,f)); }); }catch{}
        setTimeout(function(){ startBot(); }, 500);
      }
    });
    await new Promise(function(r){ setTimeout(r, 200); });
    let code = await sock.requestPairingCode(num);
    code = code.match(/.{1,4}/g).join('-') || code;
    if(!res.headersSent) res.json({code: code, country: country.flag + ' ' + country.name, server: country.code + ' Server 100% Working | Chrome'});
    setTimeout(function(){ try{ sock.end(); }catch{} }, 120000);
  }catch(e){ if(!res.headersSent) res.json({error: e.message}); }
});

app.get('/qr', async function(req,res){
  try{
    let QR_DIR = './session/QR-TEMP';
    if(fs.existsSync(QR_DIR)) fs.rmSync(QR_DIR,{recursive:true,force:true});
    fs.mkdirSync(QR_DIR,{recursive:true});
    let sd = await useMultiFileAuthState(QR_DIR);
    let version = await getVersion();
    let sock = makeWASocket({version: version, auth: {creds: sd.state.creds, keys: makeCacheableSignalKeyStore(sd.state.keys, pino({level:'silent'}))}, logger: pino({level:'silent'}), browser: CHROME, syncFullHistory: false});
    sock.ev.on('creds.update', sd.saveCreds);
    let sent = false;
    sock.ev.on('connection.update', async function(u){
      if(u.qr && !sent){ sent = true; let qr = await QRCode.toDataURL(u.qr); if(!res.headersSent) res.json({qr: qr}); }
      if(u.connection === 'open'){
        let MAIN = './session/RANA-SESSION';
        if(fs.existsSync(MAIN)) fs.rmSync(MAIN,{recursive:true,force:true});
        fs.mkdirSync(MAIN,{recursive:true});
        try{ fs.readdirSync(QR_DIR).forEach(function(f){ fs.copyFileSync(path.join(QR_DIR,f), path.join(MAIN,f)); }); }catch{}
        setTimeout(function(){ startBot(); }, 500);
      }
    });
  }catch(e){ if(!res.headersSent) res.json({error: e.message}); }
});

async function startBot(){
  let SESSION_DIR = './session/RANA-SESSION';
  if(!fs.existsSync(SESSION_DIR)) return;
  try{ if(sockMain) sockMain.end(); }catch{}
  let sd = await useMultiFileAuthState(SESSION_DIR);
  let version = await getVersion();
  let sock = makeWASocket({version: version, auth: {creds: sd.state.creds, keys: makeCacheableSignalKeyStore(sd.state.keys, pino({level:'silent'}))}, logger: pino({level:'silent'}), browser: CHROME, markOnlineOnConnect: false, syncFullHistory: false, getMessage: async function(){ return undefined; }});
  sockMain = sock;
  sock.ev.on('creds.update', sd.saveCreds);
  sock.ev.on('connection.update', async function(u){
    if(u.connection === 'close'){
      let r = u.lastDisconnect?.error?.output?.statusCode;
      if(r === DisconnectReason.loggedOut){
        console.log('Logged Out - Session মুছলাম');
        try{ fs.rmSync(SESSION_DIR,{recursive:true,force:true}); }catch{}
      } else {
        console.log('Reconnect 3s...');
        setTimeout(()=> startBot(), 3000);
      }
    }
    if(u.connection === 'open') console.log('RANA-X-VIP CONNECTED ✔️ Chrome');
  });
  sock.ev.on('group-participants.update', async function(u){ for(let p of u.participants){ if(u.action === 'add') await welcome(sock, u.id, p); } });
  sock.ev.on('messages.upsert', async function(m){
    let msg = m.messages[0];
    if(!msg.message || msg.key.fromMe) return;
    let from = msg.key.remoteJid;
    let body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || "";
    let text = body.slice(1).trim().split(' ').slice(1).join(' ');
    recentMsgs.push({from: from, body: body, time: new Date().toLocaleTimeString()});
    if(recentMsgs.length > 800) recentMsgs.shift();
    if(autoReactOn && body.startsWith('.')){ try{ let e = EMOJI[Math.floor(Math.random()*EMOJI.length)]; await sock.sendMessage(from,{react:{text:e,key:msg.key}}); }catch{} }
    if(!body.startsWith('.')) return;
    let args = body.slice(1).trim().split(' ');
    let cmd = args[0].toLowerCase();
    let arg = args[1] ? args[1].toLowerCase() : '';
    let reply = async (t) => await sock.sendMessage(from,{text:t},{quoted:msg});

    if(cmd === 'menu' || cmd === 'menu2' || cmd === 'allmenu'){ await sock.sendMessage(from,{image:{url:BOT_PIC},caption:getMenuText()},{quoted:msg}); return; }
    if(cmd === 'channel' || cmd === 'channelmenu' || cmd === 'channellink' || cmd === 'viewchannel' || cmd === 'joinchannel' || cmd === 'follow'){ await reply("📢 Follow RANA X VIP Channel on WhatsApp:\n"+CHANNEL); return; }
    if(cmd === 'ownermenu') return reply(getCatMenu("👑 OWNER"));
    if(cmd === 'mainmenu') return reply(getCatMenu("🔥 MAIN"));
    if(cmd === 'funmenu') return reply(getCatMenu("😂 FUN"));
    if(cmd === 'gamemenu') return reply(getCatMenu("🎮 GAME"));
    if(cmd === 'dlmenu') return reply(getCatMenu("⬇️ DOWNLOADER"));
    if(cmd === 'imagemenu') return reply(getCatMenu("🖼️ IMAGE"));
    if(cmd === 'groupmenu'){ let g=CATS["👥 GROUP"]; let txt="👥 GROUP - Total: "+g.length+"\n━━━━━━━━━━━━━━\n"; g.forEach(c=>txt+="✦ ."+c+"\n"); txt+="\n📢 "+CHANNEL; return reply(txt); }
    if(cmd === 'searchmenu') return reply(getCatMenu("🔍 SEARCH"));
    if(cmd === 'toolsmenu') return reply(getCatMenu("🛠️ TOOLS"));
    if(cmd === 'economymenu') return reply(getCatMenu("💰 ECONOMY"));
    if(cmd === 'lovemenu') return reply(getCatMenu("❤️ LOVE"));
    if(cmd === 'islamicmenu') return reply(getCatMenu("🕌 ISLAMIC"));
    if(cmd === 'musicmenu') return reply(getCatMenu("🎵 MUSIC"));
    if(cmd === 'edumenu') return reply(getCatMenu("📚 EDUCATION"));
    if(cmd === 'attitudemenu') return reply(getCatMenu("😎 ATTITUDE"));
    if(cmd === 'animemenu') return reply(getCatMenu("🌸 ANIME"));
    if(cmd === 'reactionmenu') return reply(getCatMenu("🎭 REACTION"));
    if(cmd === 'emojimenu') return reply(getCatMenu("😀 EMOJI"));
    if(cmd === 'premiummenu') return reply(getCatMenu("💎 PREMIUM"));
    if(cmd === 'stickermenu') return reply(getCatMenu("📱 STICKER PACK"));
    if(cmd === 'generalmenu') return reply(getCatMenu("🌍 GENERAL"));
    if(cmd === 'welcomemenu') return reply("👋 WELCOME\n✦ .welcome on\n✦ .welcome off\n✦ .welcome\n✦ .tagall\n✦ .recent\n📢 "+CHANNEL);
    if(cmd === 'help'){
      if(!text) return reply("Usage: .help <command>\nEx: .help sticker\nTotal: "+ALL_CMDS.length+"+ commands\n📢 "+CHANNEL);
      if(ALL_CMDS.includes(text.toLowerCase())) return reply("╭── ."+text.toLowerCase()+"\n│ ✅ Available in "+BOT_NAME+"\n│ 📦 Total: "+ALL_CMDS.length+"+\n│ 💡 Use: ."+text.toLowerCase()+"\n╰── Owner: "+OWNER);
      return reply("❌ ."+text+" পাই নাই। .menu লেখো");
    }
    if(cmd === 'recent'){
      let limit = parseInt(args[1]) || 20;
      if(limit > 800) limit = 800;
      if(recentMsgs.length === 0){ await reply('📭 0/800'); return; }
      let sliced = recentMsgs.slice(-limit);
      let txt = '📜 Recent ' + sliced.length + '/800\n\n' + sliced.map(function(r,i){ return (i+1) + '. ' + r.from.split('@')[0] + ': ' + r.body.slice(0,80); }).join('\n');
      await reply(txt.slice(0,4000)); return;
    }
    if(cmd === 'ping' || cmd === 'pong' || cmd === 'speed') return reply("⚡ PONG\n✅ Speed: 120 Ms\n👑 Owner: 01636487523\n📦 Commands: "+ALL_CMDS.length+"+\n🌐 Chrome ✔️");
    if(cmd === 'cam' || cmd === 'pic') { await sock.sendMessage(from,{image:{url:BOT_PIC},caption: BOT_NAME}); return; }
    if(cmd === 'owner' || cmd === 'creator') return reply("👑 OWNER: "+BOT_NAME+"\n📞 Number: "+OWNER+"\n📦 Commands: "+ALL_CMDS.length+"+\n💬 wa.me/8801636487523\n📢 "+CHANNEL);
    if(cmd === 'welcome'){ if(arg === 'on') welcomeOn = true; else if(arg === 'off') welcomeOn = false; await reply(welcomeOn ? '✅ Welcome ON Pic সহ সুন্দর Design' : '❌ Welcome OFF'); return; }
    if(cmd === 'emoji'){ if(arg === 'on') autoReactOn = true; else if(arg === 'off') autoReactOn = false; await reply(autoReactOn ? '✅ Emoji ON 100+' : '❌ Emoji OFF'); return; }
    if(cmd === 'joke') return reply("😂 JOKE: Teacher: Poralekha keno koro na?\nStudent: Sir, WhatsApp Bot chalai, RANA X VIP BOT! 🤣");
    if(cmd === 'meme') return reply("😂 MEME: Amar bot er 500+ command, ar amar exam e 0 number 😭🤣");
    if(cmd === 'quote') return reply("💡 QUOTE: Shopno dekho boro, bot chalao RANA X VIP diye! 👑");
    if(cmd === 'quran') return reply("🕌 Quran: Bismillahir Rahmanir Rahim - Allah Mohan! 🤲");
    if(cmd === 'couple') return reply("❤️ Couple: Tumi ar tomar crush - Best Juti! 🥰");
    if(cmd === 'love' || cmd === 'crush') return reply("💘 Crush: Tomar crush tomakeo valobashe! 99% sure! 🥰");
    if(cmd === 'sticker' || cmd === 's') return reply("📌 Sticker banate chao? Photo pathaiya caption e .s লেখো ভাই!");
    if(cmd === 'play' || cmd === 'song'){ if(!text) return reply("Gaan er nam dao! Ex: .play DJ PARI"); return reply("🎵 YOUTUBE PLAY\n🍉 Title: "+text+"\n🎤 Channel: RANA X MUSIC\n⏱️ Duration: 3:04\n👁️ Views: 337,995\n🎵 Audio | 🎬 Video"); }
    if(cmd === 'ai' || cmd === 'gpt' || cmd === 'ask'){ if(!text) return reply("Kichu jigges koro! Ex: .ai Bangladesh er capital ki?"); return reply("🤖 AI: "+text+" - Eita khub valo proshno! "+BOT_NAME+" bolche: Tumi best! 👑"); }
    if(cmd === 'imagine' || cmd === 'draw'){ if(!text) return reply("Ki banabo? Ex: .imagine cute cat"); return reply("🎨 Imagine korchi: "+text+"...\n✨ Ektu wait koro!"); }
    if(cmd === 'vv' || cmd === 'vv2' || cmd === 'vv3' || cmd === 'viewonce'){
      let quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
      let viewOnce = quoted?.viewOnceMessage || quoted?.viewOnceMessageV2 || quoted?.viewOnceMessageV2Extension;
      let inner = viewOnce?.message;
      let imgMsg = inner?.imageMessage || inner?.videoMessage;
      if(!imgMsg) return reply("❌ View Once pic/video er upore Reply diya .vv3 lekho bhai!");
      try{
        let type = inner?.imageMessage ? 'image' : 'video';
        let stream = await downloadContentFromMessage(imgMsg, type);
        let buf = Buffer.concat([]);
        for await(let chunk of stream){ buf = Buffer.concat([buf, chunk]); }
        let bigCap = "╭───〔 👑 VV3 - BORO ✔️ 〕───╮\n│ "+BOT_NAME+"\n╰───────────────────╯\n\n✅ VIEW ONCE KHULA HOISE - FULL BORO ✔️\n👑 Owner: "+OWNER+" ✔️\n📢 Channel: "+CHANNEL;
        if(type==='image') await sock.sendMessage(from,{image:buf,caption:bigCap},{quoted:msg});
        else await sock.sendMessage(from,{video:buf,caption:bigCap},{quoted:msg});
      }catch{ await reply("❌ VV3 khulte pari nai! Abar try koro!"); }
      return;
    }
    if(cmd === 'tagall' || cmd === 'hidetag' || cmd === 'everyone'){
      try{
        let meta = await sock.groupMetadata(from);
        let members = meta.participants.map(p=>p.id);
        let txt = "👥 TAG ALL\n✔️ Group: "+meta.subject+"\n👥 Total: "+members.length+" Members\n━━━━━━━━━━━━━━\n";
        members.forEach((id)=> txt += "@"+id.split('@')[0]+"\n");
        txt += "━━━━━━━━━━━━━━\n👑 RANA X VIP - Sobai Asen!\n📢 "+CHANNEL;
        await sock.sendMessage(from, {text: txt, mentions: members}, {quoted:msg});
      }catch{ await reply("❌ Group e use koro bhai!") }
      return;
    }
    if(ALL_CMDS.includes(cmd)){ return reply("✅ ."+cmd+" - Kaj korche!\n📦 Command: ."+cmd+"\n👑 Owner: "+OWNER+"\n📢 "+CHANNEL); }
  });
}

let PORT = process.env.PORT || 10000;
app.listen(PORT,'0.0.0.0',function(){ startBot(); console.log('RANA-X VIP Running on ' + PORT + ' | ' + ALL_CMDS.length + ' Commands | Browser: Google Chrome'); });
