let player;
let checkEndInterval = null;
let currentVideo = 'Video0001';
let isMuted = false;

const buttonMap = {
  Video0001: [],
  Video0002: [
    { start: 1, end: 9999, id: 'to-Video0003' },
    { start: 1, end: 9999, id: 'to-Video0005' },
    { start: 1, end: 9999, id: 'to-Video0008' }
  ],
  Video0003: [],
  Video0004: [
    { start: 27.5, end: 9999, id: 'to-Video0002' }
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
    { start: 27.5, end: 9999, id: 'to-Video0002v2' },
    { start: 27.5, end: 9999, id: 'to-Video0008v2' }
  ]
};




let timeMap = buttonMap[currentVideo];

const button_svg = document.querySelector('.svg-map');
const breadcrumb = document.querySelector('#breadcrumb');


function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: videoObj[currentVideo].videoId,
    playerVars: {
      autoplay: 1,
      controls: 0,         // コントロール表示
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
    // document.querySelectorAll('.svg-map .area').forEach(el => el.classList.add('hidden'));

    videoObj[currentVideo].button.forEach(area => {
      if (time >= area.start && time <= area.end) {
        document.getElementById(area.id).classList.remove('hidden');
      }
    });
    // シークバーの更新
    const current = document.querySelector('#current');
    const currentCircle = document.querySelector('#circle');
    const duration = player.getDuration();
    const currentTime = player.getCurrentTime();
    if (duration && current) {
      const timeRatio = (currentTime / (duration - 1.5)) * 100;
      current.style.width = timeRatio + '%';
      currentCircle.style.left = timeRatio + '%';
    }
  }, 100);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    // 再生開始時に監視を開始
    clearInterval(checkEndInterval);
    player.setPlaybackQuality('hd1080');  // 画質設定の希望を出す

    gtag('event', 'VideoPlay', {
      video_id: currentVideo  
    });

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
		  	if (videoObj[currentVideo].next !== null) {
			    switchVideo(videoObj[currentVideo].next);
        } else {
          player.pauseVideo();
        }
      }
    }, 100);

    //button_svgを元にボタンを生成
    button_svg.innerHTML = '';
    videoObj[currentVideo].button.forEach(data => {
      // <a href="#" class="area hidden" id="Video0003">
      //   <path d="M187,117 L634,117 L634,770 L187,770 Z" stroke="none" />
      // </a>
      // data.coordinateは[x,y,w,h]
      const a = document.createElementNS('http://www.w3.org/2000/svg', 'a');
      a.setAttribute('href', data.href);
      a.setAttribute('target', '_blank');
      a.classList.add('area', 'hidden');
      a.id = data.id;

      if (data.type === 'circle') {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', data.coordinate[0]);
        circle.setAttribute('cy', data.coordinate[1]);
        circle.setAttribute('r', data.coordinate[2]);
        a.appendChild(circle);
      } else if (data.type === 'rect') {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const coods = [
          'M', data.coordinate[0], ',', data.coordinate[1],
          ' L', data.coordinate[0] + data.coordinate[2], ',', data.coordinate[1],
          ' L', data.coordinate[0] + data.coordinate[2], ',', data.coordinate[1] + data.coordinate[3],
          ' L', data.coordinate[0], ',', data.coordinate[1] + data.coordinate[3]
        ];
        path.setAttribute('d', `${coods.join('')} Z`);
        path.setAttribute('stroke', 'none');
        a.appendChild(path);
      }

      button_svg.appendChild(a);
    });
    console.log(button_svg.innerHTML);

    //イベントリスナー追加
    button_svg.querySelectorAll('.area').forEach(area => {
      if (area.id === "to-ExternalURL") return;
      area.addEventListener('click', (event) => {
        event.preventDefault();
        const nextId = area.id.match(/Video\d{4}/);
        if (nextId) {
          switchVideo(nextId[0]);
        }
      });
    });

    //breadcrumbに親要素を順番にたどっていって<ul>内に追加していく
    breadcrumb.innerHTML = '';
    let currentParent = currentVideo;
    while (currentParent) {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = videoObj[currentParent].name;
      const videoId = currentParent;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        switchVideo(videoId);
      });
      listItem.appendChild(link);
      breadcrumb.insertBefore(listItem, breadcrumb.firstChild);
      currentParent = videoObj[currentParent].parent ? videoObj[currentParent].parent : null;
    }
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
  // timeMap = buttonMap[currentVideo];
  console.log("currentVideo:", currentVideo);

  // if(id === 'ExternalURL') return;
	/*
  // ボタンを先に非表示にする：
  document.querySelectorAll('.svg-map .area').forEach(el => el.classList.add('hidden'));
	*/
  // フェードアウト
  const fader = document.querySelector('.fade-target');
  //　fader.style.transition = 'opacity 0.4s ease';
  fader.style.opacity = '0';
	
  setTimeout(() => {
    player.loadVideoById(videoObj[id].videoId);
	  console.log(player);
	  
    // 表示ボタンの更新
    // document.querySelectorAll('.svg-map .area').forEach(el => {
    //   el.classList.add('hidden');
    //   // 古いリスナーを解除（簡易な対策として cloneNode で入れ替え）
    //   const newEl = el.cloneNode(true);
    //   el.parentNode.replaceChild(newEl, el);
    // });
	  
    // 現在の timeMap に登録されたすべてのボタンにリスナーを追加
    // timeMap.forEach(area => {
    //   const el = document.getElementById(area.id);
    //   if (el && area.id !== 'to-ExternalURL') {
    //     el.addEventListener('click', () => {
    //       const nextId = area.id.match(/Video\d{4}/);
    //       switchVideo(nextId);
    //     });
    //   }
    // });
	  
	  
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

// const menuBarWrapper = document.getElementById('menu-bar-wrapper');
// const menuArrow = document.getElementById('menu-arrow');
// let menuVisible = true;
// menuArrow.addEventListener('click', () => {
//   menuVisible = !menuVisible;
//   if(menuVisible) {
//     menuBarWrapper.classList.remove('hide');
//     menuArrow.classList.remove('down'); // 上向き
//   } else {
//     menuBarWrapper.classList.add('hide');
//     menuArrow.classList.add('down'); // 下向き
//   }
// });

document.getElementById('seekbar').addEventListener('click', (event) => {
  //クリックされた位置を検知して動画の時間を変更する
  const seekbar = document.getElementById('seekbar');
  const rect = seekbar.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const width = rect.width;
  const duration = player.getDuration();
  const newTime = (x / width) * (duration - 1.5);
  player.seekTo(newTime);
});

let offsetX = 0, isDragging = false;

// document.querySelector('#circle').addEventListener('mousedown', (e) => {
//   isDragging = true;
//   // offsetX = e.clientX - circle.offsetLeft;
//   console.log(offsetX);
// });

// document.addEventListener('mousemove', (e) => {
//   const seekbar = document.getElementById('seekbar');
//   if (isDragging) {
//     const duration = player.getDuration();
//     const width = seekbar.offsetWidth;
//     //シークバーのすべての画面に対する左端からの距離
//     const left = seekbar.getBoundingClientRect().left;
//     const X = e.clientX - left;
//     const newTime = (X / width) * (duration - 1.5);
//     player.seekTo(newTime);
//   }
// });

// document.addEventListener('mouseup', () => {
//   isDragging = false;
// });