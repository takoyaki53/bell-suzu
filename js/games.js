/*
 * ゲームデータ — ゲームを追加・差し替えるときはここだけ編集します。
 *
 * id          : 半角英数のID(重複不可)
 * title       : ゲーム名
 * genre       : ジャンル(この文字でフィルタボタンが自動生成されます)
 * summary     : カードに出す短い説明
 * description : 詳細に出す説明文
 * thumbnail   : サムネ画像のパス(例 "img/mygame.png")。空なら icon + colors の仮画像
 * icon        : 仮サムネに出す絵文字
 * colors      : 仮サムネのグラデーション色 [上, 下]
 * screenshots : スクリーンショット画像パスの配列(なくてもOK)
 * controls    : 操作方法
 * tags        : 表示タグ
 * play        : 遊び方の配列。複数指定すると詳細にボタンが並びます
 *     { type: "embed",    url: "games/xxx/index.html" }  ブラウザで遊ぶ(iframe埋め込み)
 *     { type: "download", url: "downloads/xxx.zip" }      ダウンロード
 *     { type: "external", url: "https://...", label: "itch.ioで遊ぶ" } 外部サイトへ
 *   url が空のときは「準備中」と表示されます。
 */
window.GAMES = [
  {
    id: "yoru-no-ensoku",
    title: "synergyシティ",
    genre: "ローグライク",
    summary: "町をつくるあなたが、笑顔をつくる。",
    description:
      "あなたはこの町の市長となり、町をつくっていきます。政策を立て、建物を建てる。あなたは、１２日間にどれほどお金を集められるか試してみてください。1プレイ約10分。",
    thumbnail: "js/Gemini_Generated_Image_54frjd54frjd54fr.jpg",
    icon: "🏮",
    colors: ["#2b4a8a", "#0f1b33"],
    screenshots: [],
    controls: "移動:カーソル / 決定：クリック",
    tags: ["ブラウザで遊べる", "ひとり用"],
    play: [{ type: "embed", url: "" }]
  },
//   {
//     id: "suzu-no-puzzle",
//     title: "すずのパズル",
//     genre: "パズル",
//     summary: "音を合わせて鈴をならす、やさしいパズル。",
//     description:
//       "同じ音色の鈴をつなげて鳴らす、のんびり遊べるパズル。全40ステージ。ゆっくり考える時間も、心地よい音色に包まれます。",
//     thumbnail: "",
//     icon: "🔔",
//     colors: ["#b8782f", "#5a2f1a"],
//     screenshots: [],
//     controls: "マウス / タッチでタップ・ドラッグ",
//     tags: ["ブラウザで遊べる", "ダウンロード"],
//     play: [
//       { type: "embed", url: "" },
//       { type: "download", url: "" }
//     ]
//   },
//   {
//     id: "tsuki-no-tegami",
//     title: "月のてがみ",
//     genre: "ノベル",
//     summary: "届かなかった手紙をめぐる、静かな物語。",
//     description:
//       "月夜に届く不思議な手紙を読み解くショートノベル。選択によって結末が変わります。所要時間は約30分。",
//     thumbnail: "",
//     icon: "🌙",
//     colors: ["#5b4a8a", "#1b1740"],
//     screenshots: [],
//     controls: "クリック / タップで進む、選択肢を選ぶ",
//     tags: ["外部サイト", "ダウンロード"],
//     play: [
//       { type: "external", url: "", label: "配布ページへ" },
//       { type: "download", url: "" }
//     ]
//   }
];
