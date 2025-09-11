const videoObj = {
  Video0001: {
    name: '導入',
    videoId: '070tnAsX34g',
    parent: null,
    next: 'Video0002',
    button: [
    ]
  },

  Video0002: {
    name: '検診の種類を選ぶ',
    videoId: 'yFA2DvGGGvw',
    parent: 'Video0001',
    next: null,
    button: [
        {start: 1, end: 9999, href: '#', id: 'to-Video0003', type: 'rect', coordinate: [187, 117, 447, 653]},
        {start: 1, end: 9999, href: '#', id: 'to-Video0005', type: 'rect', coordinate: [737, 116, 447, 653]},
        {start: 1, end: 9999, href: '#', id: 'to-Video0008', type: 'rect', coordinate: [1284, 117, 447, 653]},
    ]
  },

  Video0003: {
    name: 'インタビュー編',
    videoId: 'jR65tj8-LNM',
    parent: 'Video0002',
    next: 'Video0004',
    button: [
    ]
  },

  Video0004: {
    name: '選択に戻る',
    videoId: 'eCIupzGnVkE',
    parent: null,
    next: null,
    button: [
        {start: 28, end: 9999, href: '#', id: 'to-Video0002', type: 'circle', coordinate: [960, 528, 130]},
    ]
  },

  Video0005: {
    name: '申し込み編',
    videoId: 'BdSHfVvHT7M',
    parent: 'Video0002',
    next: 'Video0004',
    button: [
    ]
  },

  Video0006: {
    name: '持参するもの',
    videoId: 'SpPNOpGFDF4',
    parent: 'Video0008',
    next: 'Video0010',
    button: [
        {start: 3, end: 9999, href: 'https://www.city.kuji.lg.jp/soshiki/hokensuishin/1/4/5/1272.html', id: 'to-ExternalURL', type: 'rect', coordinate: [120, 200, 520, 340]},
        {start: 3, end: 9999, href: '#', id: 'to-Video0007', type: 'rect', coordinate: [1345, 605, 474, 354]},
    ]
  },

  Video0007: {
    name: '施設紹介',
    videoId: 'mo2_E4-IFPE',
    parent: 'Video0006',
    next: 'Video0006',
    button: [
    ]
  },

  Video0008: {
    name: '検診編',
    videoId: 'jRHqC4XMFaY',
    parent: 'Video0002',
    next: null,
    button: [
        {start: 0, end: 9999, href: '#', id: 'to-Video0014', type: 'rect', coordinate: [353, 116, 447, 644]},
        {start: 0, end: 9999, href: '#', id: 'to-Video0006', type: 'rect', coordinate: [1094, 116, 445, 644]},
    ]
  },

  Video0009: {
    name: '子宮頸がん検診',
    videoId: 'feI9_igsJ-I',
    parent: 'Video0014',
    next: 'Video0016',
    button: [
    ]
  },

  Video0010: {
    name: '乳がん検診問診票',
    videoId: 'RhtPeXPSwto',
    parent: 'Video0006',
    next: 'Video0011',
    button: [
    ]
  },

  Video0011: {
    name: '乳がん検診選択画面',
    videoId: 'fCrDjsXBHq8',
    parent: 'Video0010',
    next: null,
    button: [
        {start: 0, end: 9999, href: '#', id: 'to-Video0012', type: 'rect', coordinate: [353, 116, 447, 644]},
        {start: 0, end: 9999, href: '#', id: 'to-Video0013', type: 'rect', coordinate: [1094, 116, 445, 644]},
    ]
  },

  Video0012: {
    name: 'マンモグラフィ検査',
    videoId: 'aw5EOLa4Nzo',
    parent: 'Video0011',
    next: 'Video0016',
    button: [
    ]
  },

  Video0013: {
    name: '超音波検査',
    videoId: 'HXdum60yiHI',
    parent: 'Video0011',
    next: 'Video0016',
    button: [
    ]
  },

  Video0014: {
    name: '持参するもの',
    videoId: 'SpPNOpGFDF4',
    parent: 'Video0008',
    next: 'Video0009',
    button: [
        {start: 3, end: 9999, href: 'https://www.city.kuji.lg.jp/soshiki/hokensuishin/1/4/5/1272.html', id: 'to-ExternalURL', type: 'rect', coordinate: [120, 200, 520, 340]},
        {start: 3, end: 9999, href: '#', id: 'to-Video0015', type: 'rect', coordinate: [1345, 605, 474, 354]},
    ]
  },

  Video0015: {
    name: '施設紹介',
    videoId: 'mo2_E4-IFPE',
    parent: 'Video0014',
    next: 'Video0014',
    button: [
    ]
  },

  Video0016: {
    name: '2と8への選択肢の動画',
    videoId: 'YRvK8EedQH4',
    parent: null,
    next: null,
    button: [
        {start: 28, end: 9999, href: '#', id: 'to-Video0002', type: 'rect', coordinate: [250, 450, 670, 200]},
        {start: 28, end: 9999, href: '#', id: 'to-Video0008', type: 'rect', coordinate: [1180, 450, 400, 400]},
    ]
  },

}

