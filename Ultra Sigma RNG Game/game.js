let rolls = 0;
let canRoll = true;
let bestRarity = "None";
let bestRank = 0;

// 🔧 TEST MODE
let TEST_MODE = false; // Set to false for normal testing
let TEST_ROLL = 0.99999995;

let rarityText = document.getElementById("rarityValue");
let flash = document.getElementById("flash");
let bestName = document.getElementById("bestRarityName");
let bestOdds = document.getElementById("bestRarityOdds");

function getRank(name) {
  switch (name) {
    case "Common":
      return 1;
    case "Uncommon":
      return 2;
    case "Rare":
      return 3;
    case "Super Rare":
      return 4;
    case "Mythic":
      return 5;
    case "Legendary":
      return 6;
    case "Divine":
      return 7;
    case "Cosmic":
      return 8;
    case "Breakthrough":
      return 9;
    case "Glitched":
      return 10;
    case "Broken Reality":
      return 11;
    case "NULLbound":
      return 12;
    case "Illusional":
      return 13;
    case "DEVOID":
      return 14;
    default:
      return 0;
  }
}

function getRarityOdds(name) {
  switch (name) {
    case "Common":
      return 1 / 0.55;
    case "Uncommon":
      return 1 / (0.75 - 0.55);
    case "Rare":
      return 1 / (0.88 - 0.75);
    case "Super Rare":
      return 1 / (0.95 - 0.88);
    case "Mythic":
      return 1 / (0.98 - 0.95);
    case "Legendary":
      return 1 / (0.995 - 0.98);
    case "Divine":
      return 777;
    case "Cosmic":
      return 1 / (0.9999 - (0.995 + 1 / 777)); // FIXED RANGE
    case "Breakthrough":
      return 1 / (0.99999 - 0.9999);
    case "Glitched":
      return 1 / (0.999998 - 0.99999);
    case "Broken Reality":
      return 1 / (0.9999998 - 0.999998);
    case "NULLbound":
      return 1 / (0.99999999 - 0.9999998);
    case "Illusional":
      return 1 / (0.999999999 - 0.99999999);
    case "DEVOID":
      return 1 / (1 - 0.999999999);
    default:
      return 1;
  }
}

function formatAura(name) {
  let odds = getRarityOdds(name);
  let wholeOdds = Math.round(odds);

  let formatted = wholeOdds >= 1000000 ? wholeOdds.toLocaleString() : wholeOdds;

  return `${name} (1 in ${formatted})`;
}

document.querySelector("button").addEventListener("click", function () {
  if (!canRoll) return;
  canRoll = false;

  let bestEffectSyncInterval = null;
  let brokenRealityInterval = null;

  // 🧼 reset effects
  rarityText.className = "";
  document.body.classList.remove("flicker");

  rolls++;
  document.getElementById("rolls").textContent = "Rolls: " + rolls;

  let roll = TEST_MODE ? TEST_ROLL : Math.random();
  let cooldown = 500;
  let isGlitched = false;
  let rolledName = "";
  let activeEffect = null;

  // 🎲 ROLL LOGIC
  if (roll < 0.55) {
    rarityText.textContent = "Common";
    rolledName = "Common";
  } else if (roll < 0.75) {
    rarityText.textContent = "Uncommon";
    rolledName = "Uncommon";
  } else if (roll < 0.88) {
    rarityText.textContent = "Rare";
    rolledName = "Rare";
  } else if (roll < 0.95) {
    rarityText.textContent = "Super Rare";
    rolledName = "SuperRare";
  } else if (roll < 0.98) {
    rarityText.textContent = "Mythic";
    rolledName = "Mythic";
    cooldown = 1500;
  } else if (roll < 0.995) {
    rarityText.textContent = "Legendary";
    rolledName = "Legendary";
    cooldown = 2500;
  } else if (roll < 0.995 + 1 / 777) {
    rarityText.textContent = "Divine";
    rarityText.classList.add("divine");
    rolledName = "Divine";
    cooldown = 6000;
  } else if (roll < 0.9999) {
    rarityText.textContent = "Cosmic";
    rarityText.classList.add("cosmic");
    rolledName = "Cosmic";
    cooldown = 5000;
  } else if (roll < 0.99999) {
    rarityText.textContent = "Breakthrough";
    rarityText.classList.add("breakthrough");
    rolledName = "Breakthrough";
    startFlicker();
    cooldown = 15000;
  } else if (roll < 0.999998) {
    rarityText.textContent = "Glitched";
    rolledName = "Glitched";
    isGlitched = true;
    rarityText.classList.add("broken-text");
    glitchEffect();
    startGlitchSparkles();
    cooldown = 20000;
  } else if (roll < 0.9999998) {
    rarityText.textContent = "Broken Reality";
    rarityText.classList.add("broken-text");
    rolledName = "Broken Reality";
    brokenRealityEffect();
    startBrokenRealityTextEffect();
    cooldown = 25000;
  } else if (roll < 0.99999995) {
    rarityText.textContent = "NULLbound";
    rolledName = "NULLbound";
    activeEffect = "NULLbound";
    nullboundEffect();
    cooldown = 25000;
  } else if (roll < 0.99999999) {
    rarityText.textContent = "Illusional";
    rolledName = "Illusional";
    rarityText.classList.add("illusional");
    illusionalEffect();

    cooldown = 25000;
  } else {
    rarityText.textContent = "DEVOID";
    rolledName = "DEVOID"; // 🔥 ADD THIS
    cooldown = 25000;
  }

  // ✅ ALWAYS sync glitch text
  rarityText.setAttribute("data-text", rarityText.textContent);

  if (isGlitched) {
    rarityText.classList.add("rainbow-text");
  }

  // 🏆 BEST RARITY
  let cleanName = rolledName;
  let rank = getRank(cleanName);

  // 🏆 BEST UPDATE
  if (rank > bestRank) {
    bestRank = rank;
    bestRarity = cleanName;

    bestName.textContent = bestRarity;
    bestOdds.textContent = ` (${formatAura(bestRarity).split("(")[1]})`;

    bestName.className = "";
    bestOdds.className = "";

    rarityText.classList.forEach((cls) => {
      bestName.classList.add(cls);
      bestOdds.classList.add(cls);
    });

    bestName.classList.add("upgrade");
    setTimeout(() => bestName.classList.remove("upgrade"), 500);
  }

  // 💥 ALWAYS HANDLE EFFECT SYNC (NOT tied to bestRank)
  if (cleanName === "Broken Reality" || cleanName === "NULLbound") {
    // stop old sync
    if (bestEffectSyncInterval) {
      clearInterval(bestEffectSyncInterval);
    }

    // start new sync
    bestEffectSyncInterval = setInterval(() => {
      bestName.textContent = rarityText.textContent;
      bestName.style.color = rarityText.style.color;
      bestName.style.textShadow = rarityText.style.textShadow;
      bestName.style.transform = rarityText.style.transform;
    }, 50);

    // auto stop
    setTimeout(() => {
      clearInterval(bestEffectSyncInterval);
      bestEffectSyncInterval = null;

      bestName.textContent = bestRarity;
    }, 6000);
  }

  setTimeout(() => {
    canRoll = true;
  }, cooldown);
});

// 💥 GLITCH EFFECT
function glitchEffect() {
  let wrapper = document.getElementById("gameWrapper");
  if (!wrapper) return;

  let colors = ["red", "blue", "purple", "cyan", "lime", "yellow", "magenta"];

  flash.style.opacity = 1;
  flash.style.zIndex = "2147483647";

  let interval = setInterval(() => {
    flash.style.background = colors[Math.floor(Math.random() * colors.length)];
  }, 90);

  setTimeout(() => {
    clearInterval(interval);
    flash.style.opacity = 0;

    wrapper.classList.add("shake");

    setTimeout(() => {
      wrapper.classList.remove("shake");
    }, 2200);
  }, 2200);
}

// ⚫⚪ BREAKTHROUGH
function startFlicker() {
  let colors = ["black", "white"];
  flash.style.opacity = 1;

  let elapsed = 0;

  function flick() {
    flash.style.background = colors[Math.floor(Math.random() * 2)];
    let delay = 150 + Math.random() * 300;
    elapsed += delay;

    if (elapsed < 1800) {
      setTimeout(flick, delay);
    } else {
      flash.style.opacity = 0;
    }
  }

  flick();
}

// 💀 BROKEN REALITY
function brokenRealityEffect() {
  let overlay = document.getElementById("realityOverlay");
  if (!overlay) return;

  overlay.style.opacity = 1;

  let count = 0;

  let flashInterval = setInterval(() => {
    overlay.style.background = count % 2 === 0 ? "black" : "white";
    count++;
  }, 220);

  startSparkles(5000);

  setTimeout(() => {
    clearInterval(flashInterval);
    startRealityGlitch();
  }, 2200);

  setTimeout(() => {
    overlay.style.opacity = 0;
    document.body.style.filter = "";
    document.body.style.transform = "";
  }, 5200);
}

function startSparkles(duration = 6000) {
  let container = document.getElementById("sparkleContainer");

  let interval = setInterval(() => {
    let sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");

    sparkle.style.left = Math.random() * 100 + "vw";
    sparkle.style.animationDuration = 2 + Math.random() * 2 + "s";

    container.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 4000);
  }, 80);

  setTimeout(() => clearInterval(interval), duration);
}

function startGlitchSparkles(duration = 6500) {
  let container = document.getElementById("sparkleContainer");

  let colors = ["red", "orange", "yellow", "lime", "cyan", "blue", "magenta"];

  let interval = setInterval(() => {
    let sparkle = document.createElement("div");
    sparkle.classList.add("glitch-sparkle");

    sparkle.style.left = Math.random() * 100 + "vw";
    sparkle.style.animationDuration = 1 + Math.random() * 1.5 + "s";

    let color = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.color = color;
    sparkle.style.background = color;

    container.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 3000);
  }, 45);

  setTimeout(() => clearInterval(interval), duration);
}

function startRealityGlitch() {
  let overlay = document.getElementById("realityOverlay");

  let time = 0;

  let interval = setInterval(() => {
    let modes = [
      "rgba(255,255,255,0.15)",
      "rgba(0,0,0,0.25)",
      "rgba(255,255,255,0.05)",
      "transparent"
    ];

    overlay.style.background = modes[Math.floor(Math.random() * modes.length)];

    document.body.style.transform = `translate(${Math.random() * 10 - 5}px, ${
      Math.random() * 10 - 5
    }px)`;

    document.body.style.filter = `contrast(${1 + Math.random() * 1.5}) blur(${
      Math.random() * 1.5
    }px)`;

    time += 80;

    if (time > 1500) {
      clearInterval(interval);
      document.body.style.transform = "";
      document.body.style.filter = "";
    }
  }, 80);
}

function nullboundEffect() {
  document.body.classList.add("nullbound-mode");

  const button = document.querySelector("button");
  const rollsText = document.getElementById("rolls");
  const bestText = document.getElementById("bestRarity");
  const title = document.getElementById("title");
  const rarist = document.getElementById("rarist");

  // 💥 hide UI (BUT DO NOT modify bestText content)
  [button, rollsText, bestText, title, rarist].forEach((el) => {
    if (el) el.style.opacity = "0";
  });

  document.body.appendChild(rarityText);

  Object.assign(rarityText.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "9999999",
    fontSize: "4rem",
    color: "#bfbfbf",
    letterSpacing: "2px",
    filter: "grayscale(1) contrast(1.6) brightness(0.9)",
    textShadow: "0 0 8px #fff, 0 0 16px #aaa, 0 0 30px #66ffff",
    opacity: "0",
    pointerEvents: "none"
  });

  flash.style.zIndex = "1";
  flash.style.opacity = "1";

  const reality = document.getElementById("realityOverlay");
  if (reality) reality.style.zIndex = "2";

  const sparkles = document.getElementById("sparkleContainer");
  if (sparkles) sparkles.style.zIndex = "3";

  let flick = 0;

  const interval = setInterval(() => {
    const isBlack = flick % 2 === 0;
    document.body.style.background = isBlack ? "black" : "white";
    flash.style.background = isBlack ? "black" : "white";
    flick++;
  }, 120);

  setTimeout(() => {
    rarityText.textContent = "NULLbound";
    rarityText.style.opacity = "1";
  }, 2000);

  setTimeout(() => {
    clearInterval(interval);

    document.body.classList.remove("nullbound-mode");

    // restore UI visibility ONLY (no text restoration!)
    [button, rollsText, bestText, title, rarist].forEach((el) => {
      if (el) el.style.opacity = "1";
    });

    flash.style.opacity = "0";

    // ❌ IMPORTANT FIX:
    // DO NOT overwrite bestText.textContent anymore
    // best system handles itself in main loop

    document.getElementById("rarist").appendChild(rarityText);

    rarityText.className = "nullbound-after";

    Object.assign(rarityText.style, {
      position: "relative",
      top: "",
      left: "",
      transform: "",
      fontSize: "",
      opacity: "1",
      filter: "grayscale(1) contrast(1.3)",
      textShadow: "0 0 2px white, 0 0 8px black, 0 0 12px white"
    });

    document.body.style.background = "";

    // 🔥 start corruption effect AFTER everything
    startNullboundTextFlicker(4500);
  }, 6000);
}

function startNullboundTextFlicker() {
  let colors = ["black", "white"];
  const symbols = ["#", "@", "%", "&", "*", "!", "?", "∅", "§", "¤", "X"];

  nullboundActive = true; // 🔒 LOCK ON

  if (window.nullboundFlickerInterval) {
    clearInterval(window.nullboundFlickerInterval);
  }

  window.nullboundFlickerInterval = setInterval(() => {
    if (!nullboundActive) return; // 🛑 safety stop

    let original = "NULLbound";

    let corrupted = "";
    for (let i = 0; i < original.length; i++) {
      corrupted +=
        Math.random() < 0.3
          ? symbols[Math.floor(Math.random() * symbols.length)]
          : original[i];
    }

    rarityText.textContent = Math.random() < 0.4 ? corrupted : "NULLbound";

    let color = colors[Math.floor(Math.random() * 2)];
    rarityText.style.color = color;

    rarityText.style.textShadow =
      color === "white"
        ? "0 0 6px black, 0 0 12px white"
        : "0 0 6px white, 0 0 12px black";

    rarityText.style.transform = `translate(${(Math.random() - 0.5) * 4}px, ${
      (Math.random() - 0.5) * 4
    }px)`;
  }, 90);
}

function copyVisualState(from, to) {
  const style = window.getComputedStyle(from);

  to.style.textShadow = style.textShadow;
  to.style.color = style.color;
  to.style.filter = style.filter;
  to.style.transform = style.transform;
  to.style.letterSpacing = style.letterSpacing;
}

function startBrokenRealityTextEffect() {
  const symbols = ["#", "%", "&", "@", "*", "!", "?", "⧖", "⟟", "⟁"];
  const colors = ["white", "black", "red", "cyan"];

  // 🔒 safe check even if undefined somehow
  if (typeof brokenRealityInterval !== "undefined" && brokenRealityInterval) {
    clearInterval(brokenRealityInterval);
  }

  let base = "Broken Reality";

  brokenRealityInterval = setInterval(() => {
    let corrupted = "";

    for (let i = 0; i < base.length; i++) {
      corrupted +=
        Math.random() < 0.25
          ? symbols[Math.floor(Math.random() * symbols.length)]
          : base[i];
    }

    rarityText.textContent = Math.random() < 0.35 ? corrupted : base;

    let color = colors[Math.floor(Math.random() * colors.length)];
    rarityText.style.color = color;

    rarityText.style.textShadow =
      color === "white"
        ? "0 0 8px black, 0 0 14px white"
        : "0 0 8px white, 0 0 14px black";

    rarityText.style.transform = `translate(${(Math.random() - 0.5) * 3}px, ${
      (Math.random() - 0.5) * 3
    }px)`;
  }, 110);
}

function illusionalEffect() {
  const container = document.body;

  const ui = document.getElementById("gameWrapper");
  ui.style.visibility = "hidden";

  const text = document.getElementById("illusionalText");

  const startTime = performance.now();
  let running = true;

  // =========================
  // 💠 SHORTER CUTSCENE
  // =========================
  const CUTSCENE_END = 8000;

  const PHASE1_START = 300;
  const DIAMOND_START = 4200;

  // 💥 text appears VERY late now
  const TEXT_START = 6900;
  const TEXT_HOLD = 500;

  let phase1Started = false;
  let phase1Done = false;

  let diamondMode = false;
  let textStarted = false;

  let scale = 0.2;
  let fade = 1;

  function spawnSquare(color) {
    const square = document.createElement("div");
    square.classList.add("illusional-square");

    square.style.background = color;
    square.style.zIndex = "999999";
    square.style.opacity = "1";
    square.style.transform = "translate(-50%, -50%)";

    container.appendChild(square);

    let size = 0;
    const growSpeed = 150;

    const interval = setInterval(() => {
      size += growSpeed;

      square.style.width = size + "px";
      square.style.height = size + "px";

      if (diamondMode) {
        square.style.transform = "translate(-50%, -50%) rotate(45deg)";
      } else {
        square.style.transform = "translate(-50%, -50%)";
      }

      if (size > window.innerWidth * 2) {
        clearInterval(interval);
        square.remove();
      }
    }, 24);
  }

  const loop = setInterval(() => {
    if (!running) return;

    spawnSquare("#7fd7ff");

    setTimeout(() => {
      spawnSquare("white");
    }, 400);
  }, 650);

  const loopText = setInterval(() => {
    const elapsed = performance.now() - startTime;

    // =========================
    // 💠 PHASE 1
    // =========================
    if (!phase1Started && elapsed > PHASE1_START) {
      phase1Started = true;
      text.textContent = "YOUR MIND FADES";
      text.style.opacity = "1";
      scale = 0.2;
      fade = 1;
    }

    if (phase1Started && !phase1Done) {
      scale += 0.03;
      if (scale > 2.1) scale = 2.1;

      text.style.transform = `translate(-50%, -50%) scale(${scale})`;

      if (elapsed > PHASE1_START + 700) {
        fade -= 0.07;
        text.style.opacity = fade;
      }

      if (fade <= 0.2) {
        phase1Done = true;
        text.textContent = "";
        text.style.opacity = "0";
      }

      return;
    }

    // =========================
    // 💎 DIAMOND MODE
    // =========================
    if (elapsed > DIAMOND_START) {
      diamondMode = true;
    }

    if (!phase1Done || elapsed < TEXT_START) return;

    // =========================
    // 💠 FINAL TEXT (VERY LATE ENTRY)
    // =========================
    if (!textStarted) {
      textStarted = true;
      text.textContent = "ILLUSIONAL";
      text.style.opacity = "1";

      scale = 0.2;
      fade = 1;
    }

    scale += 0.15;
    if (scale > 3.4) scale = 3.4;

    const driftX = (scale - 0.2) * 13;
    const driftY = (scale - 0.2) * 5;

    text.style.transform = `translate(-50%, -50%) translate(${driftX}px, ${driftY}px) scale(${scale})`;

    if (elapsed > TEXT_START + TEXT_HOLD) {
      fade -= 0.03;
      text.style.opacity = fade;
    }
  }, 16);

  // =========================
  // 💥 SHORTER END SHAKE (~2.7s)
  // =========================
  const endCheck = setInterval(() => {
    const elapsed = performance.now() - startTime;

    if (elapsed >= CUTSCENE_END) {
      running = false;

      clearInterval(loop);
      clearInterval(loopText);
      clearInterval(endCheck);

      ui.style.visibility = "visible";

      let startShake = performance.now();

      const shakeBurst = setInterval(() => {
        const t = performance.now() - startShake;

        let intensity = t < 600 ? 18 : t < 1700 ? 26 : t < 2400 ? 10 : 4;

        const x = (Math.random() - 0.5) * intensity;
        const y = (Math.random() - 0.5) * intensity;

        document.body.style.transform = `translate(${x}px, ${y}px)`;

        // ~2.7 seconds total
        if (t > 2700) {
          clearInterval(shakeBurst);
          document.body.style.transform = "";
        }
      }, 40);

      if (text) {
        text.style.opacity = "0";
        text.textContent = "ILLUSIONAL";
      }
    }
  }, 50);
}
