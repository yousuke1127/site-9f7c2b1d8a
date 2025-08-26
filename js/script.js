let player;
let checkEndInterval = null;
let currentVideo = 'Video0001';
let isMuted = false;


const videoMap = {
  Video0001: '070tnAsX34g',//           最初の動画
  Video0002: 'yFA2DvGGGvw',//           最初の選択画面
  Video0003: 'sZ28OtOBuf4',//           インタビュー編
  Video0004: 'eCIupzGnVkE',//           2に戻るボタン
  Video0005: 'WiR0Fd_DP7g',//           申し込み編
  Video0006: 'SpPNOpGFDF4',//           乳がん検診
  Video0007: 'mo2_E4-IFPE',// 15も同じ   施設紹介 
  Video0008: 'jRHqC4XMFaY',//           検診編
  Video0009: 'q2bLgkCU1zg',
  Video0010: 'RhtPeXPSwto', 
  Video0011: 'fCrDjsXBHq8', 
  Video0012: 'aw5EOLa4Nzo', 
  Video0013: 'HXdum60yiHI', 
  Video0014: 'SpPNOpGFDF4', // 6も同じ   子宮頸がん検診
  Video0015: 'mo2_E4-IFPE', // 7も同じ
  Video0016: 'YRvK8EedQH4'  //           2と8への選択肢の動画
};
// Video0004 は Video0002に戻るボタン
// const ExternalURL = 'https://www.city.kuji.lg.jp/soshiki/hokensuishin/1/4/5/1272.html';


// 自動遷移する先の動画：Source: 'Destination'
const nextVideoMap = {
  Video0001: 'Video0002',
  Video0003: 'Video0004',
  Video0005: 'Video0004',
  Video0006: 'Video0010',
  Video0007: 'Video0006',
  Video0009: 'Video0016',
  Video0010: 'Video0011',
  Video0012: 'Video0016',
  Video0013: 'Video0016',
  Video0014: 'Video0009',
  Video0015: 'Video0014'
};

// ボタンを表示し遷移させたい先の動画のリスト
const timeMaps = {
  Video0001: [],
  Video0002: [
    { start: 1, end: 9999, id: 'to-Video0003' },
    { start: 1, end: 9999, id: 'to-Video0005' },
    { start: 1, end: 9999, id: 'to-Video0008' }
  ],
  Video0003: [],
  Video0004: [
    { start: 0.5, end: 9999, id: 'to-Video0002' }
  ],
  Video0005: [],
  Video0006: [
    { start: 3.0, end: 9999, id: 'to-ExternalURL' },
    { start: 3.0, end: 9999, id: 'to-Video0007' }
  ],
  Video0007: [],
  Video0008: [
    { start: 0.5, end: 9999, id: 'to-Video0014' },
    { start: 0.5, end: 9999, id: 'to-Video0006' }  
  ],
  Video0009: [],
  Video0010: [],
  Video0011: [
    { start: 0.5, end: 9999, id: 'to-Video0012' },
    { start: 0.5, end: 9999, id: 'to-Video0013' }
  ],
  Video0012: [],
  Video0013: [],
  Video0014: [
    { start: 3.0, end: 9999, id: 'to-ExternalURL' },
    { start: 3.0, end: 9999, id: 'to-Video0015' }
  ],
  Video0015: [],
  Video0016: [
    { start: 0.5, end: 9999, id: 'to-Video0002v2' },
    { start: 0.5, end: 9999, id: 'to-Video0008v2' }
  ],
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
    // timeMap = timeMaps[currentVideo];
    if(timeMap === undefined) {
      console.log(currentVideo)
    }
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

  if(id === 'ExternalURL') return;
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
      if (el && area.id !== 'to-ExternalURL') {
        el.addEventListener('click', () => {
          const nextId = area.id.match(/Video\d{4}/);
          // if (nextId === 'ExternalURL') {
          //   //同じwindowで開く
          //   // window.location.href = ExternalURL;
          //   //別windowで開く
          //   window.open(ExternalURL, '_blank');
          // } else {
            switchVideo(nextId);
          // }
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

// window.addEventListener("visibilitychange", event => {
//   if (document.visibilityState === "visible") {x
//     const iframe = document.getElementById("player");
//     if (iframe) {
//       console.log("iframe found");
//       const temp = iframe.src;
//       iframe.src = "";
//       iframe.src = temp;

//     }
//   }
// });