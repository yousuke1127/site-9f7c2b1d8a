let player;
let checkEndInterval = null;
let currentVideo = 'Video0001';
let isMuted = false;


const videoMap = {
  Video0001: '0PbHalmeCp4',
  Video0002: 'c6YXBBldY6A',
  Video0003: 'PLngt6snHkM',
  Video0004: 'jwe_rQB-qoE',
  Video0005: 'tsRMZefxqyw',
  Video0006: 'uOrDUkd5nb8',
  Video0007: 'FkCRFpb38xQ',
  Video0008: '1C2Yv6Lky2k',
  Video0009: 'vqo53KDLYpM',
  Video0010: 'f4GgFmCm5QA',
  Video0011: 'f4GgFmCm5QA',
  Video0012: 'f4GgFmCm5QA',
  Video0013: 'f4GgFmCm5QA'
};
// Video0004 は Video0002に戻るボタン

// 自動遷移する先の動画：Source: 'Destination'
const nextVideoMap = {
  Video0001: 'Video0002',
  Video0003: 'Video0004',
  Video0005: 'Video0004',
  Video0006: 'Video0008',
  Video0007: 'Video0006',
  Video0009: 'Video0004',
  Video0010: 'Video0004',
  Video0012: 'Video0004',
  Video0013: 'Video0004'
};

// ボタンを表示し遷移させたい先の動画のリスト
const timeMaps = {
  Video0001: [],
  Video0002: [
    { start: 1, end: 9999, id: 'to-Video0003' },
    { start: 1, end: 9999, id: 'to-Video0005' },
    { start: 1, end: 9999, id: 'to-Video0006' }
  ],
  Video0003: [],
  Video0004: [
    { start: 0.5, end: 9999, id: 'to-Video0002' }
  ],
  Video0005: [],
  Video0006: [
    { start: 0.5, end: 9999, id: 'to-Video0007' }
  ],
  Video0007: [],
  Video0008: [
    { start: 0.5, end: 9999, id: 'to-Video0009' },
    { start: 0.5, end: 9999, id: 'to-Video0010' }
  ],
  Video0009: [],
  Video0010: [],
  Video0011: [
    { start: 0.5, end: 9999, id: 'to-Video0012' },
    { start: 0.5, end: 9999, id: 'to-Video0013' }
  ],
  Video0012: [],
  Video0013: []
};

let timeMap = timeMaps[currentVideo];

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: videoMap['Video0001'],
    playerVars: {
		autoplay: 1,
		controls: 1,         // コントロール表示
		modestbranding: 1,   // YouTubeロゴ最小化
		rel: 0,              // 終了後の関連動画を非表示（現在は同じチャンネル内に限定される）
		showinfo: 0,         // タイトル等非表示（現在は無効）
		fs: 0,               // フルスクリーンボタン非表示
		iv_load_policy: 3,   // アノテーション非表示
		disablekb: 1,        // キーボード操作無効化
		playsinline: 1       // モバイルでもインライン再生
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady() {
	
        console.log(`onPlayerReady`);
	
  document.getElementById('start-overlay').addEventListener('click', () => {
    player.playVideo();
    document.getElementById('start-overlay').style.display = 'none';
	  	  
  });
	
  setInterval(() => {
    const time = player.getCurrentTime();
    document.querySelectorAll('.svg-map .area').forEach(el => el.classList.add('hidden'));
    timeMap.forEach(area => {
      if (time >= area.start && time <= area.end) {
        document.getElementById(area.id).classList.remove('hidden');
      }
    });
  }, 300);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    // 再生開始時に監視を開始
    clearInterval(checkEndInterval);
	player.setPlaybackQuality('hd1080');  // 画質設定の希望を出す
	  
	  /*
	setTimeout(() => {
      const upper_mask = document.querySelector('.upper-overlay-mask');
      const lower_mask = document.querySelector('.lower-overlay-mask');
      if (upper_mask) {
        upper_mask.classList.add('fade-out');
      }
	  if (lower_mask) {
        lower_mask.classList.add('fade-out');
      }
    }, 5000); // 5秒後にフェードアウト
	  */
	  
    checkEndInterval = setInterval(() => {
      const duration = player.getDuration();
      const currentTime = player.getCurrentTime();
      if (duration && currentTime >= duration - 1.5) {
        player.pauseVideo();
        clearInterval(checkEndInterval);
/*		  document.getElementById('custom-controls').style.display = 'none';
*/
		  	if (nextVideoMap[currentVideo]) {
			  switchVideo(nextVideoMap[currentVideo]);
			} else {
			  player.pauseVideo();
			}
      }
    }, 100);
  }

  if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
    // 再生終了時または一時停止時に監視を停止
    clearInterval(checkEndInterval);
	  
	  /*
	  const upper_mask = document.querySelector('.upper-overlay-mask');
      const lower_mask = document.querySelector('.lower-overlay-mask');
        upper_mask.classList.add('init');{
        lower_mask.classList.add('init');
		*/
  }
}


function switchVideo(id) {
  currentVideo = id;
  timeMap = timeMaps[id];
  console.log("currentVideo:", currentVideo);
	/*
  // ボタンを先に非表示にする：
  document.querySelectorAll('.svg-map .area').forEach(el => el.classList.add('hidden'));
	*/
  // フェードアウト
  const fader = document.querySelector('.fade-target');
//　fader.style.transition = 'opacity 0.4s ease';
  fader.style.opacity = '0';
	
  setTimeout(() => {
    player.loadVideoById(videoMap[id]);
	  console.log(player);
	  
    // 表示ボタンの更新
    document.querySelectorAll('.svg-map .area').forEach(el => {
      el.classList.add('hidden');
      // 古いリスナーを解除（簡易な対策として cloneNode で入れ替え）
      const newEl = el.cloneNode(true);
      el.parentNode.replaceChild(newEl, el);
    });
	  
	 // 現在の timeMap に登録されたすべてのボタンにリスナーを追加
	timeMap.forEach(area => {
	  const el = document.getElementById(area.id);
	  if (el) {
		el.addEventListener('click', () => {
		  const nextId = area.id.replace('to-', '');
		  switchVideo(nextId);
		});
	  }
	});
	  
	  
    setTimeout(() => {
		fader.classList.remove('fade-out');
        fader.style.opacity = '1';
    }, 600);
  }, 400);
}


document.getElementById('pause-button').addEventListener('click', (event) => {
  const isPaused = player.getPlayerState() === YT.PlayerState.PAUSED;
const icon = event.currentTarget.querySelector('img'); // 対象の画像を取得
  if (isPaused) {
    player.playVideo();
    icon.src = 'icons/pause.svg';
    icon.alt = 'Pause';
  } else {
    player.pauseVideo();
    icon.src = 'icons/play.svg';
    icon.alt = 'Play';
  }
});

document.getElementById('mute-button').addEventListener('click', (event) => {
  isMuted = !isMuted;
	  const icon = event.currentTarget.querySelector('img'); // 対象の画像を取得
  if (isMuted) {
    player.mute();
    icon.src = 'icons/mute.svg';
    icon.alt = 'Muted';
  } else {
    player.unMute();
    icon.src = 'icons/unmute.svg';
    icon.alt = 'Unmuted';
  }
});

