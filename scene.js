const MASTER_VIDEO_ID = "Kfz_TlYBj9o";

const sceneObj = {
  Scene0001: {
    name: "導入",
    start: 0,
    end: 12,
    next: "Scene0002",
    button: []
  },

  Scene0002: {
    name: "検診の種類を選ぶ",
    start: 12,
    end: 24,
    next: null, // ★選択待ちで止まる
    button: [
      { start: 0, end: 9999, href: "#", id: "to-Scene0003", type: "rect", coordinate: [187, 117, 447, 653] },
      { start: 0, end: 9999, href: "#", id: "to-Scene0005", type: "rect", coordinate: [737, 116, 447, 653] }
    ]
  },

  Scene0003: {
    name: "インタビュー編",
    start: 24,
    end: 176,
    next: "Scene0004",
    button: []
  },

  Scene0004: {
    name: "選択に戻る",
    start: 176,
    end: 216,
    next: null, // ★止めてボタン待ち
    button: [
      { start: 0, end: 9999, href: "#", id: "to-Scene0002", type: "circle", coordinate: [960, 528, 130] }
    ]
  },

  Scene0005: {
    name: "申し込み編",
    start: 216,
    end: 244,
    next: "Scene0004",
    button: []
  }
};
