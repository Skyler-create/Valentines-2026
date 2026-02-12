// Version: 2024-02-12-fixed
// ----- Elements -----
const zone = document.getElementById("zone");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const result = document.getElementById("result");
const hint = document.getElementById("hint");

const intro = document.getElementById("intro");
const enterBtn = document.getElementById("enterBtn");
const bgMusic = document.getElementById("bgMusic");

const letterEl = document.getElementById("letter");
const choiceResult = document.getElementById("choiceResult");

const loveSlider = document.getElementById("loveSlider");
const sliderText = document.getElementById("sliderText");

const memoryBtn = document.getElementById("memoryBtn");
const memoryLane = document.getElementById("memoryLane");
const closeMemoryBtn = document.getElementById("closeMemoryBtn");
const memoryImg = document.getElementById("memoryImg");
const memoryVideo = document.getElementById("memoryVideo");
const memoryCaption = document.getElementById("memoryCaption");
const prevMemory = document.getElementById("prevMemory");
const nextMemory = document.getElementById("nextMemory");
const memoryDots = document.getElementById("memoryDots");
const thumbs = document.getElementById("thumbs");

const shareBtn = document.getElementById("shareBtn");
const shareMsg = document.getElementById("shareMsg");

// ----- Confetti -----
const confettiCanvas = document.getElementById("confettiCanvas");

function resizeConfettiCanvas() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  confettiCanvas.width = Math.floor(window.innerWidth * dpr);
  confettiCanvas.height = Math.floor(window.innerHeight * dpr);
  confettiCanvas.style.width = "100vw";
  confettiCanvas.style.height = "100vh";
}
resizeConfettiCanvas();
window.addEventListener("resize", resizeConfettiCanvas);
window.addEventListener("orientationchange", () => setTimeout(resizeConfettiCanvas, 150));

const confettiInstance = confetti.create(confettiCanvas, {
  resize: false,
  useWorker: true
});

// extra pink-heavy confetti
function fullScreenConfetti() {
  const end = Date.now() + 1400;

  (function frame() {
    confettiInstance({
      particleCount: 14,
      spread: 90,
      startVelocity: 45,
      ticks: 190,
      origin: { x: Math.random(), y: Math.random() * 0.25 }
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  setTimeout(() => {
    confettiInstance({
      particleCount: 320,
      spread: 140,
      startVelocity: 58,
      ticks: 240,
      origin: { x: 0.5, y: 0.6 }
    });
  }, 200);
}

// ----- Floating hearts -----
const heartsLayer = document.getElementById("hearts");
const heartChars = ["💗", "💖", "💞", "💓", "💘", "💝", "✨"];

function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart";
  h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = (14 + Math.random() * 22) + "px";
  h.style.setProperty("--drift", (Math.random() * 140 - 70) + "px");
  h.style.animationDuration = (3.0 + Math.random() * 2.5) + "s";
  heartsLayer.appendChild(h);
  setTimeout(() => h.remove(), 6500);
}
setInterval(spawnHeart, 420);

// ----- Intro + Music -----
enterBtn.addEventListener("click", async () => {
  intro.style.display = "none";
  try {
    bgMusic.volume = 0.35;
    await bgMusic.play();
  } catch {
    // If autoplay fails, it's okay—user can unmute/play from browser controls if needed.
  }
});

// ----- Typewriter -----
function typeWriter(el, text, speed = 16) {
  el.textContent = "";
  el.setAttribute('dir', 'ltr');
  let i = 0;
  const chars = Array.from(text); // Handle multi-byte characters properly
  const t = setInterval(() => {
    el.textContent = chars.slice(0, ++i).join('');
    if (i >= chars.length) clearInterval(t);
  }, speed);
}

// ----- Yes grows / No runs away -----
let yesScale = 1;
let noScale = 1;

function growYes() {
  yesScale = Math.min(2.35, yesScale + 0.12);
  yesBtn.style.transform = `translateY(-50%) scale(${yesScale})`;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function shrinkNoALittle() {
  noScale = Math.max(0.55, noScale * 0.93);
  noBtn.style.transform = `translateY(-50%) scale(${noScale})`;
}

function moveNo(px, py) {
  const z = zone.getBoundingClientRect();
  const b = noBtn.getBoundingClientRect();

  let dx = (b.left + b.width / 2) - px;
  let dy = (b.top + b.height / 2) - py;
  let mag = Math.hypot(dx, dy) || 1;
  dx /= mag;
  dy /= mag;

  let newLeft = (b.left - z.left) + dx * 160;
  let newTop  = (b.top - z.top) + dy * 160;

  newLeft = clamp(newLeft, 0, z.width - b.width);
  newTop  = clamp(newTop, 0, z.height - b.height);

  noBtn.style.left = newLeft + "px";
  noBtn.style.top = newTop + "px";

  shrinkNoALittle();
  growYes();

  const roasts = [
    "Nice try 😈",
    "Nope 😌",
    "Haha you wish 😭",
    "You're never getting it 💀",
    "Just click yes pls 💗"
  ];
  hint.textContent = roasts[Math.floor(Math.random() * roasts.length)];
}

zone.addEventListener("pointermove", (e) => {
  const b = noBtn.getBoundingClientRect();
  const d = Math.hypot(
    (b.left + b.width / 2) - e.clientX,
    (b.top + b.height / 2) - e.clientY
  );
  if (d < 140) moveNo(e.clientX, e.clientY);
});

noBtn.addEventListener("click", (e) => e.preventDefault());

// ----- Date mission -----
document.querySelectorAll(".chip").forEach((btn) => {
  btn.addEventListener("click", () => {
    choiceResult.textContent = `Locked in: ${btn.dataset.choice} ✅ (you chose… wisely 😌)`;
    fullScreenConfetti();
  });
});

// ----- Slider -----
loveSlider.addEventListener("input", () => {
  const v = Number(loveSlider.value);

  if (v < 95) {
    sliderText.textContent = "Not enough. Try again 😌";
  } else if (v < 100) {
    sliderText.textContent = "So close… don’t be shy 👀";
  } else {
    sliderText.textContent = "Okay fine I’ll accept that 😌💗";
    fullScreenConfetti();
  }
});

// ----- Memory Lane setup (YOU rename images/captions and add videos) -----
// type can be "image" or "video"
const memories = [
  { type: "image", src: "img/1.jpg", caption: "💗" },
  { type: "video", src: "img/1.mp4", caption: "😈" },

  { type: "image", src: "img/2.jpg", caption: "✨" },
  { type: "video", src: "img/2.mp4", caption: "💞" },

  { type: "image", src: "img/3.jpg", caption: "💖" },
  { type: "video", src: "img/3.mp4", caption: "💗" },

  { type: "image", src: "img/4.jpg", caption: "😌" },
  { type: "video", src: "img/4.mp4", caption: "I LOVE YOU" }
];

let memIndex = 0;
let memTimer = null;

function renderDots() {
  memoryDots.innerHTML = "";
  memories.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === memIndex ? " active" : "");
    memoryDots.appendChild(d);
  });
}

function renderThumbs() {
  thumbs.innerHTML = "";
  memories.forEach((m, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "thumb-wrapper" + (i === memIndex ? " active" : "");
    
    if (m.type === "video") {
      // For videos, create a video thumbnail
      const video = document.createElement("video");
      video.className = "thumb";
      video.src = m.src;
      video.muted = true;
      video.preload = "metadata";
      
      // Add play icon overlay
      const playIcon = document.createElement("div");
      playIcon.className = "play-icon";
      playIcon.innerHTML = "▶";
      
      wrapper.appendChild(video);
      wrapper.appendChild(playIcon);
    } else {
      // For images, use img element
      const img = document.createElement("img");
      img.className = "thumb";
      img.src = m.src;
      img.alt = `Memory thumbnail ${i + 1}`;
      wrapper.appendChild(img);
    }
    
    wrapper.addEventListener("click", () => {
      memIndex = i;
      showMemory(memIndex);
      restartAuto();
    });
    thumbs.appendChild(wrapper);
  });
}

function showMemory(i) {
  const m = memories[i];
  
  // Pause any currently playing video
  if (memoryVideo.style.display === "block") {
    memoryVideo.pause();
  }
  
  // Show/hide based on type
  if (m.type === "video") {
    memoryImg.style.display = "none";
    memoryVideo.style.display = "block";
    memoryVideo.querySelector("source").src = m.src;
    memoryVideo.load();
    memoryVideo.play().catch(() => {}); // Auto-play if possible
  } else {
    memoryVideo.style.display = "none";
    memoryImg.style.display = "block";
    memoryImg.src = m.src;
  }
  
  memoryCaption.textContent = m.caption;

  renderDots();
  renderThumbs();
}

function nextMem() {
  memIndex = (memIndex + 1) % memories.length;
  showMemory(memIndex);
}

function prevMem() {
  memIndex = (memIndex - 1 + memories.length) % memories.length;
  showMemory(memIndex);
}

function restartAuto() {
  if (memTimer) clearInterval(memTimer);
  memTimer = setInterval(nextMem, 3500);
}

memoryBtn.addEventListener("click", () => {
  memoryLane.hidden = false;
  showMemory(memIndex);
  restartAuto();
  fullScreenConfetti();
});

closeMemoryBtn.addEventListener("click", () => {
  memoryLane.hidden = true;
  memoryVideo.pause(); // Stop any playing video
  if (memTimer) clearInterval(memTimer);
});

nextMemory.addEventListener("click", () => { nextMem(); restartAuto(); });
prevMemory.addEventListener("click", () => { prevMem(); restartAuto(); });

// ----- Copy link -----
shareBtn.addEventListener("click", async () => {
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
    shareMsg.textContent = "Copied! Now send it to her 😈💗";
  } catch {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = url;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    shareMsg.textContent = "Copied (fallback)! Now send it 😈💗";
  }
});

// ----- YES click: show result + romance shift + final scene -----
yesBtn.addEventListener("click", () => {
  zone.style.display = "none";
  hint.style.display = "none";
  result.style.display = "block";

  setTimeout(() => {
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);

  resizeConfettiCanvas();
  fullScreenConfetti();

  const fullLetter = `My Sweet Little Cassie

You're my favorite distraction.
My favorite notification to stay up late for.
My favorite voice to fall asleep to.

And yes... I would choose you a million times over my bathroom.

7,588 miles apart,
but still the safest place I know and the only person I want to love.

You actually mean so much to me.
Like in a calm, safe, I-need-you-in-my-life kind of way.

I love how you make everything feel warmer,
especially when I'm holding you close and you're melting into me
and nothing else in the world matters.

I'm really lucky I get to call you mine. 💗`;

  typeWriter(letterEl, fullLetter, 18);

  setTimeout(() => {
    letterEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 1000);

  setTimeout(() => {
    const finalScreen = document.createElement("div");
    finalScreen.style.position = "fixed";
    finalScreen.style.inset = "0";
    finalScreen.style.background =
      "linear-gradient(180deg, rgba(0,0,0,.88), rgba(40,0,25,.95))";
    finalScreen.style.color = "white";
    finalScreen.style.display = "flex";
    finalScreen.style.justifyContent = "center";
    finalScreen.style.alignItems = "center";
    finalScreen.style.textAlign = "center";
    finalScreen.style.fontSize = "30px";
    finalScreen.style.zIndex = "10000";
    finalScreen.style.padding = "22px";
    finalScreen.innerHTML = `
      <div style="max-width:720px;">
        <div style="font-weight:950; font-size:34px; margin-bottom:10px;">I love you. 💗</div>
        <div style="opacity:.95; line-height:1.5;">
          More than you know.<br/>
          And I’m choosing you — today and always.
        </div>
        <div style="margin-top:16px; font-size:14px; opacity:.8;">
          (tap anywhere to go back 😈)
        </div>
      </div>
    `;
    document.body.appendChild(finalScreen);
    finalScreen.addEventListener("click", () => finalScreen.remove());
  }, 14000);
}); // ✅ CLOSES the yesBtn listener

// ✅ Easter egg belongs OUTSIDE
let tapCount = 0;
document.addEventListener("click", () => {
  tapCount++;
  if (tapCount === 5) {
    alert("You found the secret 😈\nThat means I owe you a kiss 💗");
  }
});
