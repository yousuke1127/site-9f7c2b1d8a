// js/script.js

// ★ sceneObj と MASTER_VIDEO_ID は別ファイルで定義されている前提（あなたの現状のままでOK）
// const MASTER_VIDEO_ID = "...";
// const sceneObj = {...};

let player = null;
let currentSceneKey = "Scene0001";

const startOverlay = document.getElementById("start-overlay");
const pauseButton = document.getElementById("pause-button");
const muteButton = document.getElementById("mute-button");
const pauseIcon = document.getElementById("pause-icon");
const muteIcon = document.getElementById("mute-icon");

const svg = document.querySelector("#svg-overlay svg.svg-map");

const seekbar = document.getElementById("seekbar");
const currentBar = document.getElementById("current");
const circle = document.getElementById("circle");

let uiTimer = null;
let isDraggingSeek = false;

// end判定の誤差吸収（YouTubeは時刻が少し前後することがあります）
const END_EPS = 0.08;

/**
 * YouTube IFrame API が呼ぶ
 */
window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("player", {
    videoId: MASTER_VIDEO_ID,
    playerVars: {
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
      origin: location.origin
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
};

function onPlayerReady() {
  // 最初は停止（overlayから開始）
  renderScene(currentSceneKey);
  setControlsEnabled(true);
}

function onPlayerStateChange(e) {
  if (e.data === YT.PlayerState.PLAYING) {
    startUITimer();
  } else {
    stopUITimer();
  }
}

/**
 * overlayクリックで再生開始
 */
startOverlay.addEventListener("click", () => {
  startOverlay.style.display = "none";
  goToScene(currentSceneKey, true);
});

/**
 * シーンへジャンプ（seek）
 * @param {string} sceneKey
 * @param {boolean} autoPlay
 */
function goToScene(sceneKey, autoPlay) {
  const scene = sceneObj[sceneKey];
  if (!scene) {
    console.warn("Scene not found:", sceneKey);
    return;
  }

  currentSceneKey = sceneKey;

  // SVG領域を描画し直し
  renderScene(sceneKey);

  // seek
  player.seekTo(scene.start, true);

  if (autoPlay) {
    player.playVideo();
  } else {
    player.pauseVideo();
  }
}

/**
 * 現在時刻からどのシーンか推定
 */
function detectSceneByTime(t) {
  for (const key of Object.keys(sceneObj)) {
    const s = sceneObj[key];
    if (t >= s.start && t < s.end) return key;
  }
  return currentSceneKey;
}

/**
 * SVGクリック領域をシーン定義から生成（ボタンは “すぐ” 出す = 常時表示）
 */
function renderScene(sceneKey) {
  const scene = sceneObj[sceneKey];
  if (!scene) return;

  // SVGをクリア
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // ボタン領域を作成
  for (const btn of scene.button) {
    if (btn.type === "rect") {
      const [x, y, w, h] = btn.coordinate;

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.classList.add("area");
      g.dataset.btnId = btn.id;

      const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      r.setAttribute("x", x);
      r.setAttribute("y", y);
      r.setAttribute("width", w);
      r.setAttribute("height", h);
      r.setAttribute("fill", "rgba(255,255,255,0.08)");

      g.appendChild(r);
      svg.appendChild(g);

      g.addEventListener("click", (ev) => {
        ev.preventDefault();
        handleButton(btn);
      });

    } else if (btn.type === "circle") {
      const [cx, cy, radius] = btn.coordinate;

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.classList.add("area");
      g.dataset.btnId = btn.id;

      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", cx);
      c.setAttribute("cy", cy);
      c.setAttribute("r", radius);
      c.setAttribute("fill", "rgba(255,255,255,0.08)");

      g.appendChild(c);
      svg.appendChild(g);

      g.addEventListener("click", (ev) => {
        ev.preventDefault();
        handleButton(btn);
      });
    }
  }
}

/**
 * ボタンが押された時の処理
 */
function handleButton(btn) {
  // 外部リンク
  if (btn.href && btn.href.startsWith("http")) {
    window.open(btn.href, "_blank", "noopener");
    return;
  }

  // to-SceneXXXX 形式ならそのシーンへ
  if (btn.id && btn.id.startsWith("to-Scene")) {
    const target = btn.id.replace("to-", "");
    goToScene(target, true);
    return;
  }
}

/**
 * コントロール
 */
pauseButton.addEventListener("click", () => {
  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo();
    pauseIcon.src = "icons/play.svg";
    pauseIcon.alt = "Play";
  } else {
    player.playVideo();
    pauseIcon.src = "icons/pause.svg";
    pauseIcon.alt = "Pause";
  }
});

muteButton.addEventListener("click", () => {
  if (player.isMuted()) {
    player.unMute();
    muteIcon.src = "icons/unmute.svg";
    muteIcon.alt = "Unmute";
  } else {
    player.mute();
    muteIcon.src = "icons/mute.svg";
    muteIcon.alt = "Mute";
  }
});

/**
 * UI更新 + シーン終端制御
 */
function startUITimer() {
  stopUITimer();
  uiTimer = setInterval(() => {
    if (!player || isDraggingSeek) return;

    const t = player.getCurrentTime();
    const d = player.getDuration() || 0;

    // シーン推定＆描画
    const detected = detectSceneByTime(t);
    if (detected !== currentSceneKey) {
      currentSceneKey = detected;
      renderScene(currentSceneKey);
    }

    // ★ここが今回の「実装」：end で next or stop
    const scene = sceneObj[currentSceneKey];
    if (scene && t >= scene.end - END_EPS) {
      if (scene.next) {
        goToScene(scene.next, true);
      } else {
        player.pauseVideo(); // 選択待ち（演出なし）
      }
      return;
    }

    // 全体シークUI
    if (d > 0) {
      const p = Math.min(1, Math.max(0, t / d));
      updateSeekUI(p);
    }
  }, 100);
}

function stopUITimer() {
  if (uiTimer) clearInterval(uiTimer);
  uiTimer = null;
}

function updateSeekUI(progress01) {
  const w = seekbar.clientWidth;
  const x = w * progress01;
  currentBar.style.width = `${x}px`;
  circle.style.left = `${x - circle.offsetWidth / 2}px`;
}

/**
 * シークバー操作（クリック＆ドラッグ）
 */
seekbar.addEventListener("click", (e) => {
  if (!player) return;
  const rect = seekbar.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const p = Math.min(1, Math.max(0, x / rect.width));
  const d = player.getDuration() || 0;
  if (d > 0) player.seekTo(d * p, true);
});

circle.addEventListener("pointerdown", (e) => {
  isDraggingSeek = true;
  circle.setPointerCapture(e.pointerId);
});

circle.addEventListener("pointermove", (e) => {
  if (!isDraggingSeek || !player) return;
  const rect = seekbar.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const p = Math.min(1, Math.max(0, x / rect.width));
  updateSeekUI(p);
});

circle.addEventListener("pointerup", (e) => {
  if (!player) return;
  isDraggingSeek = false;

  const rect = seekbar.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const p = Math.min(1, Math.max(0, x / rect.width));
  const d = player.getDuration() || 0;
  if (d > 0) player.seekTo(d * p, true);
});

/**
 * 必要に応じてコントロールの有効/無効
 */
function setControlsEnabled(enabled) {
  pauseButton.disabled = !enabled;
  muteButton.disabled = !enabled;
}
