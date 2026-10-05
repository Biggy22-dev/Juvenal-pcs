const PROMO_CODE = "BK32";
let selectedUserPlatform = "";
let awaitingDepositAnswer = false;
const APP_LINKS = {
  "1XBET": "https://1xbet.fr.uptodown.com/android",
  WINWIN: "https://slim.link/24n1drD",
  PARIPESA: "https://paripesa.bet/christtpronosoapp",
};
const REG_LINKS = {
  "1XBET":
    "https://reffpa.com/L?tag=d_4215855m_97c_&site=4215855&ad=97&r=registration",
  WINWIN: "https://slim.link/qxyZnTd",
  PARIPESA: "https://paripesa.bet/christtpronoso",
};
 
const PROCEDURE_IMAGES = {
  "1XBET": "./images/1xbet.png",
  WINWIN: "./images/winwin.png",
  PARIPESA: "./images/paripesa.png"
};
function toggleVoice() {
  const b = document.getElementById("voiceButton"),
    a = document.getElementById("jeffVoice");
  if (a.paused) {
    a.play()
      .then(() => (b.textContent = "Ⅱ"))
      .catch(() => (b.textContent = "▶"))
  } else {
    a.pause();
    b.textContent = "▶";
  }
  a.onended = () => {
    b.textContent = "▶";
    document.getElementById("voiceProgress").style.width = "0%";
    document.getElementById("voiceCurrent").textContent = "0:00";
  };
}
let voiceSpeed = 1;
function changeVoiceSpeed() {
  const a = document.getElementById("jeffVoice"),
    b = document.getElementById("voiceSpeed");
  voiceSpeed = voiceSpeed === 1 ? 1.5 : voiceSpeed === 1.5 ? 2 : 1;
  a.playbackRate = voiceSpeed;
  b.textContent = voiceSpeed + "x";
}
function togglePlatforms() {
  const s = document.getElementById("platformSection"),
    b = document.getElementById("platformReduceBtn");
  s.classList.toggle("collapsed");
  b.textContent = s.classList.contains("collapsed") ? "Afficher" : "Réduire";
}
function formatTime(s) {
  if (!isFinite(s)) return "0:00";
  return Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
}
function seekVoice(e) {
  const a = document.getElementById("jeffVoice"),
    r = e.currentTarget.getBoundingClientRect();
  if (a.duration) a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
}
const voiceAudio = document.getElementById("jeffVoice");
voiceAudio.addEventListener(
  "loadedmetadata",
  () =>
    (document.getElementById("voiceTotal").textContent = formatTime(
      voiceAudio.duration,
    )),
);
voiceAudio.addEventListener("timeupdate", () => {
  document.getElementById("voiceCurrent").textContent = formatTime(
    voiceAudio.currentTime,
  );
  document.getElementById("voiceProgress").style.width =
    (voiceAudio.duration
      ? (voiceAudio.currentTime / voiceAudio.duration) * 100
      : 0) + "%";
});
voiceAudio.addEventListener("error", () => {
  document.getElementById("voiceTotal").textContent = "Audio indisponible";
  document.getElementById("voiceButton").textContent = "▶";
});
function escapeHTML(t) {
  return t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function revealChat() {
  const box = document.getElementById("chatBox"),
    m = document.getElementById("chatMessages");
  if (box) box.classList.remove("chat-hidden");
  if (m) m.classList.remove("chat-collapsed");
}
/*function scrollChat() {
  const m = document.getElementById("chatMessages");
  setTimeout(() => (m.scrollTop = m.scrollHeight), 20);
}
function focusChat() {
  revealChat();
  const box = document.querySelector(".chat-box");
  if (box) box.scrollIntoView({ behavior: "auto", block: "nearest" });
  document.getElementById("chatInput")?.focus();
}
function addMessage(text, type) {
  revealChat();
  const m = document.getElementById("chatMessages"),
    d = document.createElement("div");
  d.className = "message " + type;
  d.innerHTML = type === "bot-message" ? text : escapeHTML(text);
  m.appendChild(d);
  scrollChat();
  return d;
}*/
function scrollChat(el) {
  setTimeout(() => {
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

function focusChat() {
  revealChat();
}

function addMessage(text, type) {
  revealChat();
  const m = document.getElementById("chatMessages"),
    d = document.createElement("div");
  d.className = "message " + type;
  d.innerHTML = type === "bot-message" ? text : escapeHTML(text);
  m.appendChild(d);
  // On scrolle jusqu'à la question de l'utilisateur : la réponse s'affiche juste en dessous
  if (type === "user-message") scrollChat(d);
  return d;
}
function showTyping() {
  const m = document.getElementById("chatMessages"),
    d = document.createElement("div");
  d.className = "message bot-message typing-message";
  d.innerHTML =
    '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  m.appendChild(d);
  scrollChat();
  return d;
}
function botReply(text, action, delay = 0) {
  const msg = addMessage(text, "bot-message");
  if (action) action(msg);
}
function addQuickChoices(items) {
  const m = document.getElementById("chatMessages"),
    w = document.createElement("div");
  w.className = "chat-quick";
  items.forEach((item) => {
    const b = document.createElement("button");
    b.textContent = item.label;
    b.onclick = () => {
      w.remove();
      addMessage(item.label, "user-message");
      item.action();
    };
    w.appendChild(b);
  });
  m.appendChild(w);
  scrollChat();
  return w;
}
function askQuestion(q, action) {
  focusChat();
  addMessage(q, "user-message");
  action();
}
function platformChoices() {
  addQuickChoices([
    { label: "🔵 1XBET", action: () => choosePlatformChat("1XBET") },
    { label: "🟢 WINWIN", action: () => choosePlatformChat("WINWIN") },
    { label: "🔵 PARIPESA", action: () => choosePlatformChat("PARIPESA") },
  ]);
}
function accessIntro(game, only1Win = false) {
  addMessage(
    `Parfait 👌 Tu veux accéder à <strong>${game}</strong>.<br><br><strong>Respecte simplement ces 2 conditions :</strong><br><br>1️⃣ <strong>Inscris-toi</strong> sur le bookmaker partenaire avec le code promo <strong>BK32</strong>.<br><br>2️⃣ <strong>Recharge ton compte avec 1 500 F</strong> puis reviens pour la vérification.<br><br>👇 <strong>Choisis ton bookmaker et je te guide étape par étape.</strong>`,
    "bot-message",
  );
   platformChoices();
}
function startExistingAccountChat() {
  addMessage("👤 J’ai déjà compte", "user-message");
  botReply(
    `Si tu as déjà un compte, <strong>déconnecte-toi de ton ancien compte</strong> puis crée un nouveau compte avec le code promo <strong>BK32</strong>.<br><br>💰 Recharge ensuite <strong>1 500 F</strong>.<br><br>⚠️ Sans ces conditions, tu ne pourras pas accéder au bot.`,
  );
}
function startCantRegisterChat() {
  addMessage("❌ Je n’arrive pas à m’inscrire", "user-message");
  botReply(
    `D’accord, fais ceci 👇<br><br>📱 Utilise <strong>un nouveau numéro de téléphone</strong> ou <strong>une nouvelle adresse e-mail</strong>.<br><br>⚠️ <strong>Important :</strong> le même numéro ou la même adresse e-mail ne peut généralement pas être utilisé pour créer plusieurs comptes sur un même bookmaker. Assure-toi donc que ton numéro ou ton e-mail n’a jamais été utilisé pour créer un compte sur le bookmaker choisi.<br><br>🔑 Ensuite, inscris-toi avec le code promo <strong>BK32</strong> et suis les étapes indiquées.`,
  );
}
function startRegistrationChat() {
  addMessage(
    "C’est simple 👌<br><br><strong>Choisis ton bookmaker partenaire et je te guide étape par étape.</strong><br><br>Tu verras directement l’image de la procédure, les étapes, le lien d’inscription et le lien de téléchargement de l’application.",
    "bot-message",
  );
  platformChoices();
}
function procedureHTML(platform) {
  const img = PROCEDURE_IMAGES[platform],
    title = platform === "WINWIN" ? "WINWIN / WW BET" : platform;
  return `<div class="procedure-intro"><strong>📋 Procédure d’inscription ${title}</strong><br>Voici exactement quoi faire. Suis les étapes dans l’ordre 👇</div><img class="procedure-image" src="${img}" alt="Procédure d'inscription ${title}"><div class="procedure-step">1️⃣ Ouvre le lien d’inscription <strong>${title}</strong>.</div><div class="procedure-step">2️⃣ Remplis tes informations et utilise le code promo <strong>BK32</strong>.</div><div class="procedure-step">3️⃣ Valide ton inscription.</div><div class="procedure-step">4️⃣ Effectue la recharge de <strong>1 500 F</strong> demandée.</div><div class="procedure-actions"><a class="proof-btn" href="${REG_LINKS[platform]}" target="_blank" rel="noopener noreferrer">🔗 S’inscrire</a><a class="download-btn" href="${APP_LINKS[platform]}" target="_blank" rel="noopener noreferrer">📥 Télécharger</a></div><div class="procedure-note">👉 Si tu bloques à une étape, reviens ici et je te guide.</div>`;
}
function choosePlatformChat(platform) {
  selectedUserPlatform = platform;
  addMessage(
    `Parfait 👌 Tu as choisi <strong>${platform}</strong>.<br><br>Je te guide maintenant <strong>étape par étape</strong>. Suis l’image et les indications ci-dessous.`,
    "bot-message",
  );
  addMessage(procedureHTML(platform), "bot-message");
  addQuickChoices([
    { label: "✅ J’ai terminé mon inscription", action: registrationDoneChat },
  ]);
}
/*function oneWinProcedureChat(game) {
  selectedUserPlatform = "1WIN";
  addMessage(
    `<strong>${game}</strong><br><br>Parfait 👌 Pour cette demande, l’inscription se fait uniquement sur <strong>1WIN</strong> avec le code promo <strong>8F9Y</strong>.<br><br>Respecte les 2 conditions puis suis la procédure ci-dessous.`,
    "bot-message",
  );
  addMessage(procedureHTML("1WIN"), "bot-message");
  addQuickChoices([
    { label: "✅ J’ai terminé mon inscription", action: registrationDoneChat },
  ]);
}*/
function startFifaChat() {
  accessIntro("les scores exacts FIFA générés par le bot", false);
}
function startAviatorChat() {
  oneWinProcedureChat("✈️ Aviator");
}
function startLuckyJetChat() {
  oneWinProcedureChat("🚀 Lucky Jet");
}
function startCrashChat() {
  accessIntro("les informations Crash générées par le bot", false);
}
function startMineChat() {
  oneWinProcedureChat("💎 Mine Classic");
}
function appleConditions() {
  accessIntro("Apple of Fortune 🍎", false);
}
function diceConditions() {
  accessIntro("le Jeu des Dés 🎲", false);
}
function startAppleChat() {
  const t = showTyping();
  setTimeout(() => {
    t.remove();
    appleConditions();
  }, 450);
}
function startDiceChat() {
  const t = showTyping();
  setTimeout(() => {
    t.remove();
    diceConditions();
  }, 450);
}
function registrationDoneChat() {
  awaitingDepositAnswer = true;
  addMessage("C’est fait", "user-message");
  botReply(
    `Parfait 👍<br><br>As-tu maintenant effectué la recharge de <strong>1 500 F</strong> ?<br><br>👉 Réponds simplement <strong>oui</strong> ou <strong>non</strong>.`,
    () =>
      addQuickChoices([
        { label: "Oui", action: depositYesChat },
        { label: "Non", action: depositNoChat },
      ]),
  );
}
function depositNoChat() {
  awaitingDepositAnswer = true;
  addMessage("Non", "user-message");
  botReply(
    "D’accord 👍 Effectue d’abord la recharge de <strong>1 500 F</strong>, puis reviens ici pour continuer et écris <strong>J’ai fait</strong> pour qu’on continue la procédure.",
  );
}
function depositYesChat() {
  awaitingDepositAnswer = false;
  addMessage("Oui / J’ai fait", "user-message");
  botReply(
    `Félicitations 🎉 tu es à deux doigts de recevoir ton bot de prédiction…<br><br>📸 Envoie maintenant tes preuves rapidement sur WhatsApp :<br><br>1️⃣ La preuve de ton inscription avec le code promo <strong>BK32</strong>.<br>2️⃣ La preuve de ton dépôt de <strong>1 500 FCFA</strong>.<br><br><strong>📲 ENVOIE TES DEUX PREUVES SUR WHATSAPP</strong><br><br>👉 Envoie tes deux preuves à JUVENAL PCS pour vérification.<br><br>👉 Après l’envoi de tes preuves, rejoins également ma chaîne WhatsApp pour la suite de la procédure.<br><br><strong>📢 REJOINDRE MA CHAÎNE WHATSAPP</strong><br><a class="chat-link" href="https://whatsapp.com/channel/0029VbBBCVf3WHTgZv7xb62r" target="_blank" rel="noopener noreferrer">https://whatsapp.com/channel/0029VbBBCVf3WHTgZv7xb62r</a><br><br><a class="proof-btn" href="https://wa.me/22996408379?text=${encodeURIComponent(`Bonjour JEFF PRO 👋

Je viens de terminer mon inscription sur ${selectedUserPlatform} avec le code promo BK32.
J’ai effectué mon dépôt de 1 500 FCFA.
Je vous envoie les deux preuves : la preuve d’inscription avec le code promo BK32 et la preuve du dépôt de 1 500 FCFA.`)}" target="_blank" rel="noopener noreferrer">📲 ENVOIE TES DEUX PREUVES SUR WHATSAPP</a><div class="chat-note">La vérification est effectuée manuellement à partir des deux preuves envoyées.</div>`,
  );
}
function sendMessage() {
  const input = document.getElementById("chatInput"),
    originalText = input.value.trim();
  if (!originalText) return;
  focusChat();
  addMessage(originalText, "user-message");
  input.value = "";
  const text = originalText
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/[!?.,;:()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (awaitingDepositAnswer) {
    if (
      text === "oui" ||
      text.includes("oui c est fait") ||
      text.includes("oui cest fait") ||
      text.includes("j ai fait") ||
      text.includes("jai fait") ||
      text.includes("c est fait") ||
      text.includes("cest fait")
    ) {
      depositYesChat();
      return;
    }
    if (text === "non" || text.includes("non merci")) {
      depositNoChat();
      return;
    }
  }
  if (
    text.includes("je veux le bot") ||
    text.includes("veux le bot") ||
    text.includes("acceder au bot") ||
    text.includes("acces au bot")
  ) {
    startRegistrationChat();
    return;
  }
  if (
    text.includes("code promo") ||
    text.includes("code bonus") ||
    text.includes("quel est le code") ||
    text === "code"
  ) {
    botReply(
      "🔑 Le code promo utilisé dans les procédures est : <strong>BK32</strong>.",
    );
    return;
  }
  if (
    text.includes("inscription") ||
    text.includes("inscrire") ||
    text.includes("comment s inscrire")
  ) {
    startRegistrationChat();
    return;
  }
  if (text.includes("apple") || text.includes("fortune")) {
    startAppleChat();
    return;
  }
  if (
    text.includes("des") ||
    text.includes("dice") ||
    text.includes("jeu des")
  ) {
    startDiceChat();
    return;
  }
  if (text.includes("aviator")) {
    startAviatorChat();
    return;
  }
  if (text.includes("lucky jet") || text.includes("luckyjet")) {
    startLuckyJetChat();
    return;
  }
  if (text.includes("mine")) {
    startMineChat();
    return;
  }
  if (
    text.includes("fifa") ||
    text.includes("score exact") ||
    text.includes("scores exacts")
  ) {
    startFifaChat();
    return;
  }
  if (text.includes("crash")) {
    startCrashChat();
    return;
  }
  if (text.includes("depot") || text.includes("depos")) {
    botReply(
      "Le parcours demande une recharge de <strong>1 500 F</strong>. Après la recharge, reviens ici avec ta preuve pour la vérification.",
    );
    return;
  }
  if (
    text.includes("bonjour") ||
    text.includes("salut") ||
    text.includes("bonsoir") ||
    text.includes("hello") ||
    text.includes("coucou")
  ) {
    botReply(
      "Bonjour 👋 Je suis Juvenal Prono. Choisis une question ci-dessus ou écris « Je veux le bot » et je te guiderai étape par étape.",
    );
    return;
  }
  botReply(
    "🤖 Je peux te guider pour l’inscription, le code promo <strong>BK32</strong> et les procédures des différents jeux. Écris « Je veux le bot » ou choisis une question ci-dessus.",
  );
}
function handleEnter(e) {
  if (e.key === "Enter") sendMessage();
}
