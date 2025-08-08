let player;
let checkEndInterval = null;
let currentVideo = 'Video0001';
let isMuted = false;


const videoMap = {
  Video0001: '070tnAsX34g',
  Video0002: 'yFA2DvGGGvw',
  Video0003: 'iwCw9k2WmCY',
  Video0004: 'UhsStqNDi2o',
  Video0005: 'WiR0Fd_DP7g',
  Video0006: 'YfZGP4W_A-Q', 
  Video0007: 'kTa5rJsHUUE', // 15������ 
  Video0008: 'CRa8WUODCfc',
  Video0009: 'fnUBD8QWH1g',
  Video0010: 'WZwVeKzwMY0', 
  Video0011: 'R98lhUYhyP0', 
  Video0012: 'M-HRDil8fLE', 
  Video0013: '-fSI0M9Gfv8', 
  Video0014: 'YfZGP4W_A-Q', // 6������
  Video0015: 'kTa5rJsHUUE' // 7������
};
// Video0004 �� Video0002�ɖ߂�{�^��

// �����J�ڂ����̓���FSource: 'Destination'
const nextVideoMap = {
  Video0001: 'Video0002',
  Video0003: 'Video0004',
  Video0005: 'Video0004',
  Video0006: 'Video0010',
  Video0007: 'Video0006',
  Video0009: 'Video0004',
  Video0010: 'Video0011',
  Video0012: 'Video0004',
  Video0013: 'Video0004',
  Video0014: 'Video0009',
  Video0015: 'Video0014'
};

// �{�^����\�����J�ڂ���������̓���̃��X�g
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
    { start: 0.5, end: 9999, id: 'to-Video0007' }
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
    { start: 0.5, end: 9999, id: 'to-Video0015' }
  ],
  Video0015: []
};

let timeMap = timeMaps[currentVideo];

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: videoMap['Video0001'],
    playerVars: {
		autoplay: 1,
		controls: 1,         // �R���g���[���\��
		modestbranding: 1,   // YouTube���S�ŏ���
		rel: 0,              // �I����̊֘A������\���i���݂͓����`�����l�����Ɍ��肳���j
		showinfo: 0,         // �^�C�g������\���i���݂͖����j
		fs: 0,               // �t���X�N���[���{�^����\��
		iv_load_policy: 3,   // �A�m�e�[�V������\��
		disablekb: 1,        // �L�[�{�[�h���얳����
		playsinline: 1       // ���o�C���ł��C�����C���Đ�
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
    // �Đ��J�n���ɊĎ����J�n
    clearInterval(checkEndInterval);
	player.setPlaybackQuality('hd1080');  // �掿�ݒ�̊�]���o��
	  
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
    }, 5000); // 5�b��Ƀt�F�[�h�A�E�g
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
    // �Đ��I�����܂��͈ꎞ��~���ɊĎ����~
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
  // �{�^�����ɔ�\���ɂ���F
  document.querySelectorAll('.svg-map .area').forEach(el => el.classList.add('hidden'));
	*/
  // �t�F�[�h�A�E�g
  const fader = document.querySelector('.fade-target');
//�@fader.style.transition = 'opacity 0.4s ease';
  fader.style.opacity = '0';
	
  setTimeout(() => {
    player.loadVideoById(videoMap[id]);
	  console.log(player);
	  
    // �\���{�^���̍X�V
    document.querySelectorAll('.svg-map .area').forEach(el => {
      el.classList.add('hidden');
      // �Â����X�i�[�������i�ȈՂȑ΍�Ƃ��� cloneNode �œ���ւ��j
      const newEl = el.cloneNode(true);
      el.parentNode.replaceChild(newEl, el);
    });
	  
	 // ���݂� timeMap �ɓo�^���ꂽ���ׂẴ{�^���Ƀ��X�i�[��ǉ�
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
const icon = event.currentTarget.querySelector('img'); // �Ώۂ̉摜���擾
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
	  const icon = event.currentTarget.querySelector('img'); // �Ώۂ̉摜���擾
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

