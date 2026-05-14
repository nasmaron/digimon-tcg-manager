import { useState, useEffect, useRef } from "react";
const _pixelFontLink = document.createElement("link");
_pixelFontLink.rel = "stylesheet";
_pixelFontLink.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
document.head.appendChild(_pixelFontLink);
// iOSのinputズームを防ぐ
const _vp = document.querySelector("meta[name=viewport]");
if (_vp) _vp.content = "width=device-width, initial-scale=1, maximum-scale=1";
else { const m=document.createElement("meta"); m.name="viewport"; m.content="width=device-width, initial-scale=1, maximum-scale=1"; document.head.appendChild(m); }

// ── i18n ──────────────────────────────────────────────
const LANG_KEY = "digimon_lang";

const TRANSLATIONS = {
  ja: {
    // tabs
    tabMatches: "対戦記録", tabDecks: "デッキ管理", tabStats: "統計", tabSettings: "設定",
    // header
    memoryGauge: "メモリーゲージ",
    // match entry
    recordMatch: "対戦を記録", editMatch: "対戦を編集",
    seriesLabel: (n) => `連続記録 ${n}`,
    save: "保存", saveAndNext: "続けて記録", cancel: "キャンセル", delete: "削除",
    carryOver: "前回の入力を引き継ぐ",
    // form field labels
    fDate: "日付", fMatchType: "対戦種類", fDeck: "使用デッキ", fOpponent: "相手デッキ",
    fOpponentPerson: "対戦相手", fTurn: "先攻後攻", fResult: "勝敗",
    fEndTurn: "終了ターン", fLucky: "運", fNotes: "メモ",
    fDeckUrl: "デッキURL", fDeckImage: "デッキ画像", fImage: "対戦画像",
    // turn / result options
    first: "⚡ 先攻", second: "🌙 後攻",
    win: "🏆 勝", lose: "💀 敗", draw: "🤝 分",
    winShort: "勝", loseShort: "敗", drawShort: "分",
    firstShort: "先", secondShort: "後",
    lucky: "🍀 運あり", unlucky: "💀 不運あり",
    turn: "ターン", clearTurn: "クリア",
    // deck picker
    fromList: "リストから", directInput: "直接入力",
    selectPlaceholder: "選択してください",
    selectLabel: "選択",
    deckNamePlaceholder: "デッキ名",
    // match type picker
    addNew: "＋ 追加", addPlaceholder: "新しい種類を入力",
    // image
    tapAddDeckImage: "タップしてデッキ画像を追加",
    tapAddBattleImage: "タップして対戦画像を追加",
    savedDeckImage: "✓ デッキに保存済みの画像",
    removeImage: "削除",
    // match list
    addRecord: "＋ 記録を追加",
    filter: "絞り込み",
    resetFilter: "リセット",
    showNotes: "メモ", bulkSelect: "一括",
    cancelBulk: "キャンセル", bulkDelete: "削除",
    noRecords: "記録がありません",
    noRecordsHint: "「記録を追加」から対戦を記録しましょう",
    loadMore: (n) => `さらに読み込む（残り${n}件）`,
    // filter bar
    period: "期間（プリセット）", periodCustom: "期間（個別指定）",
    periodAll: "全期間", allItems: "すべて", periodToday: "今日", periodWeek: "今週",
    periodMonth: "今月", periodYear: "今年",
    myDeckFilter: "使用デッキ", oppDeckFilter: "相手デッキ",
    oppPersonFilter: "対戦相手", matchTypeFilter: "対戦種類（複数選択可）",
    turnFilter: "先攻・後攻", resultFilter: "勝敗", flagFilter: "フラグ",
    noData: "データなし", notSet: "未設定",
    noDecksRegistered: "登録がありません",
    noOpponents: "登録がありません",
    // deck tab
    myDecks: "自分のデッキ", oppDecks: "相手デッキ",
    addDeck: "＋ デッキを追加",
    addOpp: "＋ 相手デッキを追加", cancelAddOpp: "✕ キャンセル",
    activeOnly: "使用中のみ",
    merge: "まとめる",
    statsToggle: "成績",
    sortRecent: "最近使用順", sortNewest: "登録新しい順",
    sortName: "名前順", sortWinRate: "勝率順",
    sortMost: "対戦数順", sortRecentBattle: "最近対戦順",
    searchPlaceholder: "検索",
    noDeckRegistered: "デッキが登録されていません",
    noOppRegistered: "相手デッキが登録されていません",
    deckCount: (n) => `${n}件`,
    winLabel: "勝", loseLabel: "敗", battleCount: (n) => `${n}戦`,
    battleStats: (t, w, l) => `${t}戦 ${w}勝 ${l}敗`,
    activeSwitch: "使用中",
    imageLimit: "保存上限",
    unlimited: "無制限",
    deckImageCount: (n) => `デッキ画像（${n}枚）`,
    deckNameLabel: "デッキ名", colorLabel: "カラー",
    parentDeckLabel: "親デッキ（派生元）", noneOption: "なし",
    deckUrlLabel: "デッキURL", memoLabel: "メモ",
    recordLabel: "成績",
    saveButton: "保存", deleteButton: "デッキを削除",
    setAsCurrent: "メイン", deleteImage: "削除",
    // merge modals
    mergeOpponents: "デッキ名をまとめる",
    mergeOppHint: "2つ以上選んで統一名を入力",
    mergeNamePlaceholder: "統一後の名前",
    mergeDecks: "デッキを統合", mergeBase: "ベースデッキを選択",
    mergeBaseHint: "画像・設定の基準にするデッキを選択",
    mergeNameStep: "統合後の名前を入力",
    mergeBaseLabel: (name) => `ベース：${name}`,
    mergeNamePlaceholder2: "統合後のデッキ名",
    back: "戻る", next: "次へ", execute: "統合する",
    savedImages: (n) => `画像${n}枚保存中`,
    // add forms
    deckNameRequired: "デッキ名 *",
    oppNameRequired: "デッキ名 *",
    addButton: "追加",
    // stats
    statOverall: "総合戦績", statWinTrend: "勝率推移",
    statTurns: "先攻・後攻別勝率", statDeckBar: "デッキ別成績",
    statDeckPie: "使用デッキ分布", statOppBar: "相手デッキ別成績",
    statOppPie: "対戦相手デッキ分布",
    showStat: "表示", hideStat: "非表示",
    noStatData: "データがありません",
    battles: "対戦", winRate: "勝率", winRateLabel: "勝率推移",
    firstWR: "先攻勝率", secondWR: "後攻勝率",
    // match detail
    editButton: "編集",
    dateLabel: "日付", matchTypeLabel: "対戦種類",
    myDeckLabel: "使用デッキ", oppPersonLabel: "対戦相手",
    endTurnLabel: "終了ターン", deckUrlLabel2: "デッキURL",
    notesLabel: "メモ", deckImageLabel: "デッキ画像", battleImageLabel: "対戦画像",
    // settings
    themeColor: "テーマカラー",
    formFields: "記録フォームの表示項目",
    formFieldsHint: "オフにした項目は記録入力画面から非表示になります",
    statSettings: "統計画面の表示設定（強力）",
    statSettingsWarn: "⚠️ チェックを外すと統計セクションが完全に非表示になります",
    oppManagement: "対戦相手の管理",
    matchTypeManagement: "対戦種類の管理", mergeMatchTypes: "対戦種類をまとめる", mergeMatchTypesHint: "2つ以上選んで統一名を入力",
    csvImport: "CSVインポート",
    csvImportHint: "他の対戦記録アプリのCSVを読み込めます",
    selectCSV: "CSVファイルを選択",
    importSuccess: "✓ インポート完了",
    importCount: (n, s, a) => `取込件数: ${n}件 / スキップ: ${s}件 / 自動作成デッキ: ${a}件`,
    importReset: "別のファイルを読み込む",
    backup: "データのバックアップ・復元",
    backupHint: "機種変更などの際に全データを書き出せます",
    downloadBackup: "バックアップをダウンロード（画像込み）",
    restoreBackup: "バックアップから復元",
    deckImageMgmt: "デッキ画像データ管理",
    deckImageMgmtHint: (n) => `全${n}枚の画像を保存中。不要な画像を削除して容量を節約できます。`,
    deleteUnused: "どの戦績にも紐づいていない不要画像を一括削除",
    noImages: "画像なし",
    dangerZone: "🗑️ 危険ゾーン",
    dangerZoneHint: "この操作は取り消せません。",
    deleteAllImages: "🗑️ 画像データをすべて削除",
    deleteAll: "🗑️ すべてのデータを削除",
    // delete confirms
    deleteMatchTitle: "対戦を削除しますか？",
    deleteMatchHint: "この対戦記録は完全に削除されます。",
    deleteDeckTitle: "デッキを削除",
    deleteDeckHint: "このデッキと関連するデータが削除されます。この操作は取り消せません。",
    deleteOppTitle: "相手デッキを削除",
    deleteOppHint: "この相手デッキを削除します。関連する対戦記録のデッキ名は残ります。",
    deleteImagesTitle: "🗑️ 画像データのみ削除",
    deleteAllTitle: "🗑️ すべてのデータを削除",
    deleteAllConfirm: "対戦記録・デッキ・設定をすべて削除します。この操作は取り消せません。",
    deleteImagesConfirm: "すべての画像データを削除します。この操作は取り消せません。",
    confirmDelete: "削除する",
    confirmCancel: "キャンセル",
    // loading
    loading: "データを読み込んでいます...",
    // landscape warning
    landscapeMsg: "画面を縦に向けてください",
    // toast
    saved: "記録しました",
    // similar pairs
    similarFound: (n) => `${n}件の類似デッキ名が見つかりました`,
    // backup size
    localStorageSize: "localStorage使用量",
    imageCount: "画像枚数",
    // OppCard
    saveEdit: "保存",
    // image confirm
    deleteImageConfirm: (n) => `この画像を削除しますか？\n${n}件の戦績の画像表示に影響します。`,
    // language settings
    languageLabel: "言語 / Language",
  },
  en: {
    tabMatches: "Matches", tabDecks: "Decks", tabStats: "Stats", tabSettings: "Settings",
    memoryGauge: "Memory Gauge",
    recordMatch: "Record Match", editMatch: "Edit Match",
    seriesLabel: (n) => `Streak: ${n}`,
    save: "Save", saveAndNext: "Save & Next", cancel: "Cancel", delete: "Delete",
    carryOver: "Carry over previous entry",
    fDate: "Date", fMatchType: "Match Type", fDeck: "My Deck", fOpponent: "Opponent Deck",
    fOpponentPerson: "Opponent Player", fTurn: "Turn Order", fResult: "Result",
    fEndTurn: "End Turn", fLucky: "Luck", fNotes: "Notes",
    fDeckUrl: "Deck URL", fDeckImage: "Deck Image", fImage: "Battle Image",
    first: "⚡ Going 1st", second: "🌙 Going 2nd",
    win: "🏆 Win", lose: "💀 Lose", draw: "🤝 Draw",
    winShort: "W", loseShort: "L", drawShort: "D",
    firstShort: "1st", secondShort: "2nd",
    lucky: "🍀 Lucky", unlucky: "💀 Unlucky",
    turn: "Turn", clearTurn: "Clear",
    fromList: "From List", directInput: "Type",
    selectPlaceholder: "Select...",
    selectLabel: "Select",
    deckNamePlaceholder: "Deck name",
    addNew: "+ Add", addPlaceholder: "Enter new type...",
    tapAddDeckImage: "Tap to add deck image",
    tapAddBattleImage: "Tap to add battle image",
    savedDeckImage: "✓ Saved to deck",
    removeImage: "Remove",
    addRecord: "+ Add Match",
    filter: "Filter",
    resetFilter: "Reset",
    showNotes: "Notes", bulkSelect: "Select",
    cancelBulk: "Cancel", bulkDelete: "Delete",
    noRecords: "No records yet",
    noRecordsHint: "Tap \"Add Match\" to log your first battle",
    loadMore: (n) => `Load more (${n} remaining)`,
    period: "Period (Preset)", periodCustom: "Period (Custom)",
    periodAll: "All", allItems: "All", periodToday: "Today", periodWeek: "This Week",
    periodMonth: "This Month", periodYear: "This Year",
    myDeckFilter: "My Deck", oppDeckFilter: "Opponent Deck",
    oppPersonFilter: "Opponent Player", matchTypeFilter: "Match Type (multi)",
    turnFilter: "Turn Order", resultFilter: "Result", flagFilter: "Flags",
    noData: "No data", notSet: "Not set",
    noDecksRegistered: "No decks registered",
    noOpponents: "No opponents registered",
    myDecks: "My Decks", oppDecks: "Opponent Decks",
    addDeck: "+ Add Deck",
    addOpp: "+ Add Opponent", cancelAddOpp: "✕ Cancel",
    activeOnly: "Active only",
    merge: "Merge",
    statsToggle: "Stats",
    sortRecent: "Recently used", sortNewest: "Newest",
    sortName: "Name", sortWinRate: "Win rate",
    sortMost: "Most battles", sortRecentBattle: "Recent battle",
    searchPlaceholder: "Search",
    noDeckRegistered: "No decks registered yet",
    noOppRegistered: "No opponent decks registered yet",
    deckCount: (n) => `${n} decks`,
    winLabel: "W", loseLabel: "L", battleCount: (n) => `${n} battles`,
    battleStats: (t, w, l) => `${t}G ${w}W ${l}L`,
    activeSwitch: "Active",
    imageLimit: "Image limit",
    unlimited: "Unlimited",
    deckImageCount: (n) => `Deck images (${n})`,
    deckNameLabel: "Deck Name", colorLabel: "Color",
    parentDeckLabel: "Parent Deck", noneOption: "None",
    deckUrlLabel: "Deck URL", memoLabel: "Notes",
    recordLabel: "Record",
    saveButton: "Save", deleteButton: "Delete Deck",
    setAsCurrent: "Set Main", deleteImage: "Delete",
    mergeOpponents: "Merge Deck Names",
    mergeOppHint: "Select 2+ names and enter a unified name",
    mergeNamePlaceholder: "Unified name",
    mergeDecks: "Merge Decks", mergeBase: "Select Base Deck",
    mergeBaseHint: "Choose which deck to use as the base",
    mergeNameStep: "Enter merged deck name",
    mergeBaseLabel: (name) => `Base: ${name}`,
    mergeNamePlaceholder2: "Merged deck name",
    back: "Back", next: "Next", execute: "Merge",
    savedImages: (n) => `${n} image(s) saved`,
    deckNameRequired: "Deck name *",
    oppNameRequired: "Deck name *",
    addButton: "Add",
    statOverall: "Overall Record", statWinTrend: "Win Rate Trend",
    statTurns: "Win Rate by Turn Order", statDeckBar: "Deck Performance",
    statDeckPie: "Deck Distribution", statOppBar: "Opponent Performance",
    statOppPie: "Opponent Distribution",
    showStat: "Show", hideStat: "Hide",
    noStatData: "No data",
    battles: "Battles", winRate: "Win Rate", winRateLabel: "Win Rate Trend",
    firstWR: "1st Win Rate", secondWR: "2nd Win Rate",
    editButton: "Edit",
    dateLabel: "Date", matchTypeLabel: "Match Type",
    myDeckLabel: "My Deck", oppPersonLabel: "Opponent",
    endTurnLabel: "End Turn", deckUrlLabel2: "Deck URL",
    notesLabel: "Notes", deckImageLabel: "Deck Image", battleImageLabel: "Battle Image",
    themeColor: "Theme Color",
    formFields: "Form Fields",
    formFieldsHint: "Hidden fields won't appear in the record form",
    statSettings: "Stats Display Settings",
    statSettingsWarn: "⚠️ Hiding a section removes it completely from stats",
    oppManagement: "Opponent Management",
    matchTypeManagement: "Match Type Management", mergeMatchTypes: "Merge Match Types", mergeMatchTypesHint: "Select 2+ and enter a unified name",
    csvImport: "CSV Import",
    csvImportHint: "Import match data from other apps via CSV",
    selectCSV: "Select CSV file",
    importSuccess: "✓ Import Complete",
    importCount: (n, s, a) => `Imported: ${n} / Skipped: ${s} / Auto-created decks: ${a}`,
    importReset: "Import another file",
    backup: "Backup & Restore",
    backupHint: "Export all your data for safekeeping",
    downloadBackup: "Download Backup (with images)",
    restoreBackup: "Restore from Backup",
    deckImageMgmt: "Deck Image Management",
    deckImageMgmtHint: (n) => `${n} image(s) stored. Delete unused images to save space.`,
    deleteUnused: "Delete all images not linked to any match",
    noImages: "No images",
    dangerZone: "🗑️ Danger Zone",
    dangerZoneHint: "These actions cannot be undone.",
    deleteAllImages: "🗑️ Delete All Image Data",
    deleteAll: "🗑️ Delete All Data",
    deleteMatchTitle: "Delete this match?",
    deleteMatchHint: "This match record will be permanently deleted.",
    deleteDeckTitle: "Delete Deck",
    deleteDeckHint: "This deck and related data will be deleted. This cannot be undone.",
    deleteOppTitle: "Delete Opponent Deck",
    deleteOppHint: "This opponent will be removed. Match records referencing them will remain.",
    deleteImagesTitle: "🗑️ Delete Image Data Only",
    deleteAllTitle: "🗑️ Delete All Data",
    deleteAllConfirm: "All matches, decks, and settings will be deleted. This cannot be undone.",
    deleteImagesConfirm: "All image data will be deleted. This cannot be undone.",
    confirmDelete: "Delete", confirmCancel: "Cancel",
    loading: "Loading data...",
    landscapeMsg: "Please rotate your device to portrait",
    saved: "Saved!",
    similarFound: (n) => `${n} similar deck names found`,
    localStorageSize: "localStorage usage",
    imageCount: "Image count",
    saveEdit: "Save",
    deleteImageConfirm: (n) => `Delete this image?\nThis will affect ${n} match record(s).`,
    languageLabel: "言語 / Language",
  },
  ko: {
    tabMatches: "대전 기록", tabDecks: "덱 관리", tabStats: "통계", tabSettings: "설정",
    memoryGauge: "메모리 게이지",
    recordMatch: "대전 기록하기", editMatch: "대전 편집",
    seriesLabel: (n) => `연속 기록 ${n}`,
    save: "저장", saveAndNext: "저장 후 계속", cancel: "취소", delete: "삭제",
    carryOver: "이전 입력 내용 가져오기",
    fDate: "날짜", fMatchType: "대전 종류", fDeck: "사용 덱", fOpponent: "상대 덱",
    fOpponentPerson: "상대방", fTurn: "선/후공", fResult: "승패",
    fEndTurn: "종료 턴", fLucky: "운", fNotes: "메모",
    fDeckUrl: "덱 URL", fDeckImage: "덱 이미지", fImage: "대전 이미지",
    first: "⚡ 선공", second: "🌙 후공",
    win: "🏆 승", lose: "💀 패", draw: "🤝 무",
    winShort: "승", loseShort: "패", drawShort: "무",
    firstShort: "선", secondShort: "후",
    lucky: "🍀 운 좋음", unlucky: "💀 운 나쁨",
    turn: "턴", clearTurn: "초기화",
    fromList: "목록에서", directInput: "직접 입력",
    selectPlaceholder: "선택하세요",
    selectLabel: "선택",
    deckNamePlaceholder: "덱 이름",
    addNew: "+ 추가", addPlaceholder: "새 종류 입력...",
    tapAddDeckImage: "탭하여 덱 이미지 추가",
    tapAddBattleImage: "탭하여 대전 이미지 추가",
    savedDeckImage: "✓ 덱에 저장된 이미지",
    removeImage: "삭제",
    addRecord: "+ 기록 추가",
    filter: "필터",
    resetFilter: "초기화",
    showNotes: "메모", bulkSelect: "선택",
    cancelBulk: "취소", bulkDelete: "삭제",
    noRecords: "기록이 없습니다",
    noRecordsHint: "\"기록 추가\"를 눌러 대전을 기록하세요",
    loadMore: (n) => `더 보기 (${n}건 남음)`,
    period: "기간 (프리셋)", periodCustom: "기간 (직접 지정)",
    periodAll: "전체", allItems: "전체", periodToday: "오늘", periodWeek: "이번 주",
    periodMonth: "이번 달", periodYear: "올해",
    myDeckFilter: "사용 덱", oppDeckFilter: "상대 덱",
    oppPersonFilter: "상대방", matchTypeFilter: "대전 종류 (복수 선택)",
    turnFilter: "선/후공", resultFilter: "승패", flagFilter: "플래그",
    noData: "데이터 없음", notSet: "미설정",
    noDecksRegistered: "등록된 덱이 없습니다",
    noOpponents: "등록된 상대가 없습니다",
    myDecks: "내 덱", oppDecks: "상대 덱",
    addDeck: "+ 덱 추가",
    addOpp: "+ 상대 덱 추가", cancelAddOpp: "✕ 취소",
    activeOnly: "사용 중만",
    merge: "합치기",
    statsToggle: "전적",
    sortRecent: "최근 사용순", sortNewest: "최신 등록순",
    sortName: "이름순", sortWinRate: "승률순",
    sortMost: "대전 수순", sortRecentBattle: "최근 대전순",
    searchPlaceholder: "검색",
    noDeckRegistered: "등록된 덱이 없습니다",
    noOppRegistered: "등록된 상대 덱이 없습니다",
    deckCount: (n) => `${n}건`,
    winLabel: "승", loseLabel: "패", battleCount: (n) => `${n}전`,
    battleStats: (t, w, l) => `${t}전 ${w}승 ${l}패`,
    activeSwitch: "사용 중",
    imageLimit: "저장 한도",
    unlimited: "무제한",
    deckImageCount: (n) => `덱 이미지 (${n}장)`,
    deckNameLabel: "덱 이름", colorLabel: "컬러",
    parentDeckLabel: "부모 덱 (파생 원본)", noneOption: "없음",
    deckUrlLabel: "덱 URL", memoLabel: "메모",
    recordLabel: "전적",
    saveButton: "저장", deleteButton: "덱 삭제",
    setAsCurrent: "메인", deleteImage: "삭제",
    mergeOpponents: "덱 이름 합치기",
    mergeOppHint: "2개 이상 선택 후 통합 이름 입력",
    mergeNamePlaceholder: "통합 후 이름",
    mergeDecks: "덱 통합", mergeBase: "기준 덱 선택",
    mergeBaseHint: "이미지·설정의 기준이 될 덱을 선택하세요",
    mergeNameStep: "통합 후 이름 입력",
    mergeBaseLabel: (name) => `기준: ${name}`,
    mergeNamePlaceholder2: "통합 후 덱 이름",
    back: "뒤로", next: "다음", execute: "통합",
    savedImages: (n) => `이미지 ${n}장 저장 중`,
    deckNameRequired: "덱 이름 *",
    oppNameRequired: "덱 이름 *",
    addButton: "추가",
    statOverall: "종합 전적", statWinTrend: "승률 추이",
    statTurns: "선/후공별 승률", statDeckBar: "덱별 전적",
    statDeckPie: "사용 덱 분포", statOppBar: "상대 덱별 전적",
    statOppPie: "상대 덱 분포",
    showStat: "표시", hideStat: "숨기기",
    noStatData: "데이터가 없습니다",
    battles: "대전", winRate: "승률", winRateLabel: "승률 추이",
    firstWR: "선공 승률", secondWR: "후공 승률",
    editButton: "편집",
    dateLabel: "날짜", matchTypeLabel: "대전 종류",
    myDeckLabel: "사용 덱", oppPersonLabel: "상대방",
    endTurnLabel: "종료 턴", deckUrlLabel2: "덱 URL",
    notesLabel: "메모", deckImageLabel: "덱 이미지", battleImageLabel: "대전 이미지",
    themeColor: "테마 컬러",
    formFields: "기록 폼 표시 항목",
    formFieldsHint: "끈 항목은 기록 입력 화면에서 숨겨집니다",
    statSettings: "통계 화면 표시 설정",
    statSettingsWarn: "⚠️ 체크 해제 시 통계 섹션이 완전히 숨겨집니다",
    oppManagement: "상대방 관리",
    matchTypeManagement: "대전 종류 관리", mergeMatchTypes: "대전 종류 합치기", mergeMatchTypesHint: "2개 이상 선택 후 통합 이름 입력",
    csvImport: "CSV 가져오기",
    csvImportHint: "다른 앱의 CSV 파일을 가져올 수 있습니다",
    selectCSV: "CSV 파일 선택",
    importSuccess: "✓ 가져오기 완료",
    importCount: (n, s, a) => `가져옴: ${n}건 / 건너뜀: ${s}건 / 자동 생성 덱: ${a}개`,
    importReset: "다른 파일 가져오기",
    backup: "백업 및 복원",
    backupHint: "기기 변경 시 전체 데이터를 내보낼 수 있습니다",
    downloadBackup: "백업 다운로드 (이미지 포함)",
    restoreBackup: "백업에서 복원",
    deckImageMgmt: "덱 이미지 데이터 관리",
    deckImageMgmtHint: (n) => `총 ${n}장의 이미지를 저장 중. 불필요한 이미지를 삭제하여 용량을 절약하세요.`,
    deleteUnused: "어느 전적에도 연결되지 않은 불필요한 이미지 일괄 삭제",
    noImages: "이미지 없음",
    dangerZone: "🗑️ 위험 구역",
    dangerZoneHint: "이 작업은 취소할 수 없습니다.",
    deleteAllImages: "🗑️ 이미지 데이터 모두 삭제",
    deleteAll: "🗑️ 모든 데이터 삭제",
    deleteMatchTitle: "대전을 삭제하시겠습니까?",
    deleteMatchHint: "이 대전 기록은 완전히 삭제됩니다.",
    deleteDeckTitle: "덱 삭제",
    deleteDeckHint: "이 덱과 관련 데이터가 삭제됩니다. 이 작업은 취소할 수 없습니다.",
    deleteOppTitle: "상대 덱 삭제",
    deleteOppHint: "이 상대 덱을 삭제합니다. 관련 대전 기록의 덱 이름은 남습니다.",
    deleteImagesTitle: "🗑️ 이미지 데이터만 삭제",
    deleteAllTitle: "🗑️ 모든 데이터 삭제",
    deleteAllConfirm: "대전 기록·덱·설정을 모두 삭제합니다. 이 작업은 취소할 수 없습니다.",
    deleteImagesConfirm: "모든 이미지 데이터를 삭제합니다. 이 작업은 취소할 수 없습니다.",
    confirmDelete: "삭제", confirmCancel: "취소",
    loading: "데이터를 불러오는 중...",
    landscapeMsg: "세로 방향으로 사용해 주세요",
    saved: "저장되었습니다",
    similarFound: (n) => `${n}개의 유사한 덱 이름을 찾았습니다`,
    localStorageSize: "localStorage 사용량",
    imageCount: "이미지 수",
    saveEdit: "저장",
    deleteImageConfirm: (n) => `이 이미지를 삭제하시겠습니까?\n${n}건의 전적 이미지 표시에 영향을 줍니다.`,
    languageLabel: "言語 / Language",
  },
  zh: {
    tabMatches: "对战记录", tabDecks: "卡组管理", tabStats: "统计", tabSettings: "设置",
    memoryGauge: "内存仪表",
    recordMatch: "记录对战", editMatch: "编辑对战",
    seriesLabel: (n) => `连续记录 ${n}`,
    save: "保存", saveAndNext: "保存并继续", cancel: "取消", delete: "删除",
    carryOver: "沿用上次输入内容",
    fDate: "日期", fMatchType: "对战类型", fDeck: "使用卡组", fOpponent: "对手卡组",
    fOpponentPerson: "对手玩家", fTurn: "先后手", fResult: "胜负",
    fEndTurn: "结束回合", fLucky: "运气", fNotes: "备注",
    fDeckUrl: "卡组URL", fDeckImage: "卡组图片", fImage: "对战图片",
    first: "⚡ 先手", second: "🌙 后手",
    win: "🏆 胜", lose: "💀 败", draw: "🤝 平",
    winShort: "胜", loseShort: "败", drawShort: "平",
    firstShort: "先", secondShort: "后",
    lucky: "🍀 运气好", unlucky: "💀 运气差",
    turn: "回合", clearTurn: "清除",
    fromList: "从列表选择", directInput: "直接输入",
    selectPlaceholder: "请选择",
    selectLabel: "选择",
    deckNamePlaceholder: "卡组名称",
    addNew: "+ 添加", addPlaceholder: "输入新类型...",
    tapAddDeckImage: "点击添加卡组图片",
    tapAddBattleImage: "点击添加对战图片",
    savedDeckImage: "✓ 已保存到卡组",
    removeImage: "删除",
    addRecord: "+ 添加记录",
    filter: "筛选",
    resetFilter: "重置",
    showNotes: "备注", bulkSelect: "批量",
    cancelBulk: "取消", bulkDelete: "删除",
    noRecords: "暂无记录",
    noRecordsHint: "点击\"添加记录\"开始记录对战",
    loadMore: (n) => `加载更多（剩余${n}条）`,
    period: "时间段（预设）", periodCustom: "时间段（自定义）",
    periodAll: "全部", allItems: "全部", periodToday: "今天", periodWeek: "本周",
    periodMonth: "本月", periodYear: "今年",
    myDeckFilter: "使用卡组", oppDeckFilter: "对手卡组",
    oppPersonFilter: "对手玩家", matchTypeFilter: "对战类型（可多选）",
    turnFilter: "先后手", resultFilter: "胜负", flagFilter: "标记",
    noData: "无数据", notSet: "未设置",
    noDecksRegistered: "暂无卡组",
    noOpponents: "暂无对手",
    myDecks: "我的卡组", oppDecks: "对手卡组",
    addDeck: "+ 添加卡组",
    addOpp: "+ 添加对手卡组", cancelAddOpp: "✕ 取消",
    activeOnly: "仅使用中",
    merge: "合并",
    statsToggle: "战绩",
    sortRecent: "最近使用", sortNewest: "最新添加",
    sortName: "名称", sortWinRate: "胜率",
    sortMost: "对战次数", sortRecentBattle: "最近对战",
    searchPlaceholder: "搜索",
    noDeckRegistered: "暂无卡组",
    noOppRegistered: "暂无对手卡组",
    deckCount: (n) => `${n}个`,
    winLabel: "胜", loseLabel: "败", battleCount: (n) => `${n}场`,
    battleStats: (t, w, l) => `${t}场 ${w}胜 ${l}败`,
    activeSwitch: "使用中",
    imageLimit: "保存上限",
    unlimited: "无限制",
    deckImageCount: (n) => `卡组图片（${n}张）`,
    deckNameLabel: "卡组名称", colorLabel: "颜色",
    parentDeckLabel: "父卡组（派生源）", noneOption: "无",
    deckUrlLabel: "卡组URL", memoLabel: "备注",
    recordLabel: "战绩",
    saveButton: "保存", deleteButton: "删除卡组",
    setAsCurrent: "设为主图", deleteImage: "删除",
    mergeOpponents: "合并卡组名称",
    mergeOppHint: "选择2个以上并输入统一名称",
    mergeNamePlaceholder: "统一后的名称",
    mergeDecks: "合并卡组", mergeBase: "选择基准卡组",
    mergeBaseHint: "选择作为图片和设置基准的卡组",
    mergeNameStep: "输入合并后的名称",
    mergeBaseLabel: (name) => `基准：${name}`,
    mergeNamePlaceholder2: "合并后的卡组名称",
    back: "返回", next: "下一步", execute: "合并",
    savedImages: (n) => `已保存${n}张图片`,
    deckNameRequired: "卡组名称 *",
    oppNameRequired: "卡组名称 *",
    addButton: "添加",
    statOverall: "总体战绩", statWinTrend: "胜率趋势",
    statTurns: "先后手胜率", statDeckBar: "卡组战绩",
    statDeckPie: "卡组分布", statOppBar: "对手卡组战绩",
    statOppPie: "对手卡组分布",
    showStat: "显示", hideStat: "隐藏",
    noStatData: "暂无数据",
    battles: "对战", winRate: "胜率", winRateLabel: "胜率趋势",
    firstWR: "先手胜率", secondWR: "后手胜率",
    editButton: "编辑",
    dateLabel: "日期", matchTypeLabel: "对战类型",
    myDeckLabel: "使用卡组", oppPersonLabel: "对手玩家",
    endTurnLabel: "结束回合", deckUrlLabel2: "卡组URL",
    notesLabel: "备注", deckImageLabel: "卡组图片", battleImageLabel: "对战图片",
    themeColor: "主题颜色",
    formFields: "记录表单显示项目",
    formFieldsHint: "关闭的项目将在记录输入界面中隐藏",
    statSettings: "统计界面显示设置",
    statSettingsWarn: "⚠️ 取消勾选后该统计区块将完全隐藏",
    oppManagement: "对手管理",
    matchTypeManagement: "对战类型管理", mergeMatchTypes: "合并对战类型", mergeMatchTypesHint: "选择2个以上并输入统一名称",
    csvImport: "CSV导入",
    csvImportHint: "可以导入其他应用的CSV文件",
    selectCSV: "选择CSV文件",
    importSuccess: "✓ 导入完成",
    importCount: (n, s, a) => `导入：${n}条 / 跳过：${s}条 / 自动创建卡组：${a}个`,
    importReset: "导入其他文件",
    backup: "数据备份与恢复",
    backupHint: "更换设备时可以导出全部数据",
    downloadBackup: "下载备份（含图片）",
    restoreBackup: "从备份恢复",
    deckImageMgmt: "卡组图片数据管理",
    deckImageMgmtHint: (n) => `共保存了${n}张图片。删除不需要的图片以节省空间。`,
    deleteUnused: "批量删除未关联任何战绩的图片",
    noImages: "无图片",
    dangerZone: "🗑️ 危险区域",
    dangerZoneHint: "此操作无法撤销。",
    deleteAllImages: "🗑️ 删除所有图片数据",
    deleteAll: "🗑️ 删除所有数据",
    deleteMatchTitle: "删除此对战记录？",
    deleteMatchHint: "此对战记录将被永久删除。",
    deleteDeckTitle: "删除卡组",
    deleteDeckHint: "此卡组及相关数据将被删除。此操作无法撤销。",
    deleteOppTitle: "删除对手卡组",
    deleteOppHint: "此对手卡组将被删除。相关对战记录中的卡组名称将保留。",
    deleteImagesTitle: "🗑️ 仅删除图片数据",
    deleteAllTitle: "🗑️ 删除所有数据",
    deleteAllConfirm: "对战记录、卡组、设置将全部删除。此操作无法撤销。",
    deleteImagesConfirm: "所有图片数据将被删除。此操作无法撤销。",
    confirmDelete: "删除", confirmCancel: "取消",
    loading: "正在加载数据...",
    landscapeMsg: "请将设备竖向使用",
    saved: "已保存",
    similarFound: (n) => `找到${n}个相似的卡组名称`,
    localStorageSize: "localStorage使用量",
    imageCount: "图片数量",
    saveEdit: "保存",
    deleteImageConfirm: (n) => `删除此图片？\n将影响${n}条战绩的图片显示。`,
    languageLabel: "言語 / Language",
  },
  es: {
    tabMatches: "Partidas", tabDecks: "Mazos", tabStats: "Stats", tabSettings: "Ajustes",
    memoryGauge: "Indicador de Memoria",
    recordMatch: "Registrar Partida", editMatch: "Editar Partida",
    seriesLabel: (n) => `Racha: ${n}`,
    save: "Guardar", saveAndNext: "Guardar y continuar", cancel: "Cancelar", delete: "Eliminar",
    carryOver: "Mantener entradas anteriores",
    fDate: "Fecha", fMatchType: "Tipo de partida", fDeck: "Mi mazo", fOpponent: "Mazo rival",
    fOpponentPerson: "Jugador rival", fTurn: "Turno", fResult: "Resultado",
    fEndTurn: "Turno final", fLucky: "Suerte", fNotes: "Notas",
    fDeckUrl: "URL del mazo", fDeckImage: "Imagen del mazo", fImage: "Imagen de partida",
    first: "⚡ Primero", second: "🌙 Segundo",
    win: "🏆 Victoria", lose: "💀 Derrota", draw: "🤝 Empate",
    winShort: "V", loseShort: "D", drawShort: "E",
    firstShort: "1º", secondShort: "2º",
    lucky: "🍀 Con suerte", unlucky: "💀 Sin suerte",
    turn: "Turno", clearTurn: "Limpiar",
    fromList: "De la lista", directInput: "Escribir",
    selectPlaceholder: "Seleccionar...",
    selectLabel: "Seleccionar",
    deckNamePlaceholder: "Nombre del mazo",
    addNew: "+ Añadir", addPlaceholder: "Escribir nuevo tipo...",
    tapAddDeckImage: "Toca para añadir imagen del mazo",
    tapAddBattleImage: "Toca para añadir imagen de partida",
    savedDeckImage: "✓ Guardado en el mazo",
    removeImage: "Eliminar",
    addRecord: "+ Añadir partida",
    filter: "Filtrar",
    resetFilter: "Reiniciar",
    showNotes: "Notas", bulkSelect: "Selección",
    cancelBulk: "Cancelar", bulkDelete: "Eliminar",
    noRecords: "Sin registros",
    noRecordsHint: "Pulsa \"Añadir partida\" para empezar",
    loadMore: (n) => `Cargar más (${n} restantes)`,
    period: "Período (preestablecido)", periodCustom: "Período (personalizado)",
    periodAll: "Todo", allItems: "Todo", periodToday: "Hoy", periodWeek: "Esta semana",
    periodMonth: "Este mes", periodYear: "Este año",
    myDeckFilter: "Mi mazo", oppDeckFilter: "Mazo rival",
    oppPersonFilter: "Jugador rival", matchTypeFilter: "Tipo de partida (múltiple)",
    turnFilter: "Turno", resultFilter: "Resultado", flagFilter: "Marcadores",
    noData: "Sin datos", notSet: "No definido",
    noDecksRegistered: "No hay mazos registrados",
    noOpponents: "No hay rivales registrados",
    myDecks: "Mis mazos", oppDecks: "Mazos rivales",
    addDeck: "+ Añadir mazo",
    addOpp: "+ Añadir mazo rival", cancelAddOpp: "✕ Cancelar",
    activeOnly: "Solo activos",
    merge: "Fusionar",
    statsToggle: "Estadísticas",
    sortRecent: "Uso reciente", sortNewest: "Más nuevos",
    sortName: "Nombre", sortWinRate: "Winrate",
    sortMost: "Más partidas", sortRecentBattle: "Última partida",
    searchPlaceholder: "Buscar",
    noDeckRegistered: "No hay mazos registrados",
    noOppRegistered: "No hay mazos rivales registrados",
    deckCount: (n) => `${n} mazos`,
    winLabel: "V", loseLabel: "D", battleCount: (n) => `${n} partidas`,
    battleStats: (t, w, l) => `${t}P ${w}V ${l}D`,
    activeSwitch: "Activo",
    imageLimit: "Límite de imágenes",
    unlimited: "Sin límite",
    deckImageCount: (n) => `Imágenes del mazo (${n})`,
    deckNameLabel: "Nombre del mazo", colorLabel: "Color",
    parentDeckLabel: "Mazo base (derivado de)", noneOption: "Ninguno",
    deckUrlLabel: "URL del mazo", memoLabel: "Notas",
    recordLabel: "Registro",
    saveButton: "Guardar", deleteButton: "Eliminar mazo",
    setAsCurrent: "Principal", deleteImage: "Eliminar",
    mergeOpponents: "Fusionar nombres de mazo",
    mergeOppHint: "Selecciona 2 o más e introduce el nombre unificado",
    mergeNamePlaceholder: "Nombre unificado",
    mergeDecks: "Fusionar mazos", mergeBase: "Seleccionar mazo base",
    mergeBaseHint: "Elige el mazo que servirá de base para imágenes y ajustes",
    mergeNameStep: "Introduce el nombre fusionado",
    mergeBaseLabel: (name) => `Base: ${name}`,
    mergeNamePlaceholder2: "Nombre del mazo fusionado",
    back: "Atrás", next: "Siguiente", execute: "Fusionar",
    savedImages: (n) => `${n} imagen(es) guardada(s)`,
    deckNameRequired: "Nombre del mazo *",
    oppNameRequired: "Nombre del mazo *",
    addButton: "Añadir",
    statOverall: "Registro general", statWinTrend: "Tendencia de winrate",
    statTurns: "Winrate por turno", statDeckBar: "Rendimiento por mazo",
    statDeckPie: "Distribución de mazos", statOppBar: "Rendimiento vs rivales",
    statOppPie: "Distribución de rivales",
    showStat: "Mostrar", hideStat: "Ocultar",
    noStatData: "Sin datos",
    battles: "Partidas", winRate: "Winrate", winRateLabel: "Tendencia de winrate",
    firstWR: "Winrate 1º", secondWR: "Winrate 2º",
    editButton: "Editar",
    dateLabel: "Fecha", matchTypeLabel: "Tipo de partida",
    myDeckLabel: "Mi mazo", oppPersonLabel: "Jugador rival",
    endTurnLabel: "Turno final", deckUrlLabel2: "URL del mazo",
    notesLabel: "Notas", deckImageLabel: "Imagen del mazo", battleImageLabel: "Imagen de partida",
    themeColor: "Color del tema",
    formFields: "Campos del formulario",
    formFieldsHint: "Los campos desactivados se ocultarán en el formulario",
    statSettings: "Configuración de estadísticas",
    statSettingsWarn: "⚠️ Desactivar ocultará completamente esa sección",
    oppManagement: "Gestión de rivales",
    matchTypeManagement: "Gestión de tipos de partida", mergeMatchTypes: "Fusionar tipos de partida", mergeMatchTypesHint: "Selecciona 2+ e introduce el nombre unificado",
    csvImport: "Importar CSV",
    csvImportHint: "Importa datos de otras apps en formato CSV",
    selectCSV: "Seleccionar archivo CSV",
    importSuccess: "✓ Importación completada",
    importCount: (n, s, a) => `Importados: ${n} / Omitidos: ${s} / Mazos creados: ${a}`,
    importReset: "Importar otro archivo",
    backup: "Copia de seguridad y restauración",
    backupHint: "Exporta todos tus datos para guardarlos",
    downloadBackup: "Descargar copia de seguridad (con imágenes)",
    restoreBackup: "Restaurar desde copia de seguridad",
    deckImageMgmt: "Gestión de imágenes de mazo",
    deckImageMgmtHint: (n) => `${n} imagen(es) almacenada(s). Elimina las no usadas para ahorrar espacio.`,
    deleteUnused: "Eliminar imágenes no vinculadas a ninguna partida",
    noImages: "Sin imágenes",
    dangerZone: "🗑️ Zona de peligro",
    dangerZoneHint: "Estas acciones no se pueden deshacer.",
    deleteAllImages: "🗑️ Eliminar todos los datos de imagen",
    deleteAll: "🗑️ Eliminar todos los datos",
    deleteMatchTitle: "¿Eliminar esta partida?",
    deleteMatchHint: "Este registro de partida se eliminará permanentemente.",
    deleteDeckTitle: "Eliminar mazo",
    deleteDeckHint: "Este mazo y sus datos relacionados serán eliminados. No se puede deshacer.",
    deleteOppTitle: "Eliminar mazo rival",
    deleteOppHint: "Este rival será eliminado. Los registros de partida relacionados permanecerán.",
    deleteImagesTitle: "🗑️ Eliminar solo datos de imagen",
    deleteAllTitle: "🗑️ Eliminar todos los datos",
    deleteAllConfirm: "Todas las partidas, mazos y ajustes serán eliminados. No se puede deshacer.",
    deleteImagesConfirm: "Todos los datos de imagen serán eliminados. No se puede deshacer.",
    confirmDelete: "Eliminar", confirmCancel: "Cancelar",
    loading: "Cargando datos...",
    landscapeMsg: "Por favor, usa el dispositivo en modo vertical",
    saved: "¡Guardado!",
    similarFound: (n) => `Se encontraron ${n} nombres de mazo similares`,
    localStorageSize: "Uso de localStorage",
    imageCount: "Número de imágenes",
    saveEdit: "Guardar",
    deleteImageConfirm: (n) => `¿Eliminar esta imagen?\nAfectará a ${n} registro(s) de partida.`,
    languageLabel: "言語 / Language",
  }
};

// ── Themes / Colors ────────────────────────────────────
const THEMES = {
  red:    { label:"赤", labelEn:"Red",    labelKo:"빨강", labelZh:"红", labelEs:"Rojo",    bg:"#0f0a0a", card:"#1c1010", border:"#3d1a1a", accent:"#ff4d6d", accentDim:"#992940", surface:"#160c0c", text:"#f8e8e8", muted:"#886677", win:"#ff4d6d", lose:"#4488ff", draw:"#aaaaaa", first:"#ff9944", second:"#44aaff" },
  blue:   { label:"青", labelEn:"Blue",   labelKo:"파랑", labelZh:"蓝", labelEs:"Azul",    bg:"#0a0e1a", card:"#111827", border:"#1e2d4a", accent:"#00d4ff", accentDim:"#007a99", surface:"#0d1520", text:"#e8f4f8", muted:"#6688aa", win:"#00e676", lose:"#ff4d6d", draw:"#aaaaaa", first:"#ff9944", second:"#44aaff" },
  yellow: { label:"黄", labelEn:"Yellow", labelKo:"노랑", labelZh:"黄", labelEs:"Amarillo", bg:"#0f0e08", card:"#1c1a0e", border:"#3d3510", accent:"#facc15", accentDim:"#997a00", surface:"#161408", text:"#f8f4e8", muted:"#887755", win:"#facc15", lose:"#ff4d6d", draw:"#aaaaaa", first:"#ff9944", second:"#44aaff" },
  green:  { label:"緑", labelEn:"Green",  labelKo:"초록", labelZh:"绿", labelEs:"Verde",   bg:"#080f0a", card:"#0f1c12", border:"#1a3d20", accent:"#00e676", accentDim:"#008844", surface:"#0a1610", text:"#e8f8ec", muted:"#558866", win:"#00e676", lose:"#ff4d6d", draw:"#aaaaaa", first:"#ff9944", second:"#44aaff" },
  black:  { label:"黒", labelEn:"Black",  labelKo:"검정", labelZh:"黑", labelEs:"Negro",   bg:"#080808", card:"#111111", border:"#2a2a2a", accent:"#aaaaaa", accentDim:"#555555", surface:"#0e0e0e", text:"#eeeeee", muted:"#666666", win:"#00e676", lose:"#ff4d6d", draw:"#aaaaaa", first:"#ff9944", second:"#44aaff" },
  purple: { label:"紫", labelEn:"Purple", labelKo:"보라", labelZh:"紫", labelEs:"Morado",  bg:"#0d0a18", card:"#160f2a", border:"#2e1a5a", accent:"#a78bfa", accentDim:"#5533aa", surface:"#110d20", text:"#f0eaff", muted:"#7755aa", win:"#00e676", lose:"#ff4d6d", draw:"#aaaaaa", first:"#ff9944", second:"#44aaff" },
  white:  { label:"白", labelEn:"White",  labelKo:"흰색", labelZh:"白", labelEs:"Blanco",  bg:"#f0f4f8", card:"#ffffff", border:"#d1dce8", accent:"#0077cc", accentDim:"#004488", surface:"#e8edf2", text:"#1a2233", muted:"#8899aa", win:"#00aa44", lose:"#ee3333", draw:"#888888", first:"#ff7700", second:"#0077cc" },
};
function getTheme(id) { return THEMES[id] || THEMES.blue; }
const globalC = {...THEMES.blue};
const C = globalC;

const DECK_COLORS = [
  { id:"red",     label:"赤", labelEn:"Red",     labelKo:"빨강", labelZh:"红", labelEs:"Rojo",    hex:"#ef4444" },
  { id:"blue",    label:"青", labelEn:"Blue",    labelKo:"파랑", labelZh:"蓝", labelEs:"Azul",    hex:"#3b82f6" },
  { id:"green",   label:"緑", labelEn:"Green",   labelKo:"초록", labelZh:"绿", labelEs:"Verde",   hex:"#22c55e" },
  { id:"yellow",  label:"黄", labelEn:"Yellow",  labelKo:"노랑", labelZh:"黄", labelEs:"Amarillo",hex:"#eab308" },
  { id:"purple",  label:"紫", labelEn:"Purple",  labelKo:"보라", labelZh:"紫", labelEs:"Morado",  hex:"#a855f7" },
  { id:"black",   label:"黒", labelEn:"Black",   labelKo:"검정", labelZh:"黑", labelEs:"Negro",   hex:"#6b7280" },
  { id:"white",   label:"白", labelEn:"White",   labelKo:"흰색", labelZh:"白", labelEs:"Blanco",  hex:"#e5e7eb" },
  { id:"rainbow", label:"虹", labelEn:"Rainbow", labelKo:"무지개",labelZh:"彩", labelEs:"Arcoíris",hex:null },
];

// ── Storage ────────────────────────────────────────────
const STORAGE_KEY = "digimon_tcg_v2";
const IDB_NAME = "digimon_tcg_images";
const IDB_STORE = "images";
const IDB_VERSION = 1;

const DEFAULT_MATCH_TYPES_JA = ["テイマーバトル","エボリューションカップ","アルティメットカップ","超テイマーバトル","フレンドリーバトル","店舗予選","フリー"];
const DEFAULT_MATCH_TYPES_EN = ["Tamer Battle","Evolution Cup","Ultimate Cup","Super Tamer Battle","Friendly Battle","Store Qualifier","Casual"];

const DEFAULT_MATCH_TYPES_KO = ["테이머 배틀","에볼루션 컵","얼티밋 컵","슈퍼 테이머 배틀","프렌들리 배틀","스토어 예선","프리 배틀"];
const DEFAULT_MATCH_TYPES_ZH = ["训练师对战","进化杯","究极杯","超级训练师对战","友谊赛","门店预选赛","自由对战"];
const DEFAULT_MATCH_TYPES_ES = ["Batalla de Entrenador","Copa Evolución","Copa Ultimate","Super Batalla de Entrenador","Partida Amistosa","Clasificatoria de Tienda","Casual"];

// 表示用変換マップ（データは日本語保存、表示時のみ変換）
const MATCH_TYPE_MAP = {};
DEFAULT_MATCH_TYPES_JA.forEach((ja, i) => {
  MATCH_TYPE_MAP[ja] = { en: DEFAULT_MATCH_TYPES_EN[i], ko: DEFAULT_MATCH_TYPES_KO[i], zh: DEFAULT_MATCH_TYPES_ZH[i], es: DEFAULT_MATCH_TYPES_ES[i] };
});
function displayMatchType(type, lang) {
  if (!type) return type;
  if (lang !== "ja" && MATCH_TYPE_MAP[type]?.[lang]) return MATCH_TYPE_MAP[type][lang];
  return type;
}

// 言語に合わせたラベルを取得
function getThemeLabel(theme, lang) {
  if (lang === "en") return theme.labelEn;
  if (lang === "ko") return theme.labelKo;
  if (lang === "zh") return theme.labelZh;
  if (lang === "es") return theme.labelEs;
  return theme.label;
}
function getDeckColorLabel(color, lang) {
  if (lang === "en") return color.labelEn;
  if (lang === "ko") return color.labelKo;
  if (lang === "zh") return color.labelZh;
  if (lang === "es") return color.labelEs;
  return color.label;
}

const FORM_FIELDS_KEYS = [
  { key:"date" }, { key:"matchType" }, { key:"deck" },
  { key:"opponent", required:true }, { key:"opponentPerson" },
  { key:"turn" }, { key:"result", required:true }, { key:"endTurn" },
  { key:"lucky" }, { key:"notes" }, { key:"deckUrl" },
  { key:"deckImage" }, { key:"image" },
];

// Map field key → translation key
const FIELD_LABEL_MAP = {
  date:"fDate", matchType:"fMatchType", deck:"fDeck", opponent:"fOpponent",
  opponentPerson:"fOpponentPerson", turn:"fTurn", result:"fResult",
  endTurn:"fEndTurn", lucky:"fLucky", notes:"fNotes",
  deckUrl:"fDeckUrl", deckImage:"fDeckImage", image:"fImage",
};

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = e => e.target.result.createObjectStore(IDB_STORE, {keyPath:"id"});
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbPut(item) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function idbGet(id) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}
async function idbDelete(id) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function idbGetAll() {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
async function idbClear() {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      decks: d.decks || [], matches: d.matches || [], opponentNames: d.opponentNames || [],
      matchTypes: d.matchTypes || [...DEFAULT_MATCH_TYPES_JA],
      prefs: d.prefs || {}, theme: d.theme || "blue",
      formFields: d.formFields || {}, opponents: d.opponents || [],
      deckImages: d.deckImages || [],
      uiPrefs: d.uiPrefs || {},
    };
  } catch { return { decks:[], matches:[], opponentNames:[], matchTypes:[...DEFAULT_MATCH_TYPES_JA], prefs:{}, theme:"blue", formFields:{}, opponents:[], deckImages:[], uiPrefs:{} }; }
}
function save(d) {
  try {
    const {deckImages, ...rest} = d;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch(e) { console.warn("localStorage save failed:", e); }
}
function serializeData(st, includeImages=false) {
  if (includeImages) return JSON.stringify({...st});
  const stripped = {
    ...st,
    decks: (st.decks||[]).map(d => { const r={...d}; delete r.image; return r; }),
    matches: (st.matches||[]).map(m => { const r={...m}; delete r.image; delete r.deckImage; return r; }),
    deckImages: [],
  };
  return JSON.stringify(stripped);
}
function parseData(text) {
  try { const d = JSON.parse(text); if (d && d.matches && d.decks) return d; } catch {}
  return null;
}

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

function addDeckImage(deckImages, decks, deckId, imageData) {
  const deck = decks.find(d => d.id === deckId);
  const maxImages = deck?.maxImages ?? 10;
  const newImg = { id: genId(), deckId, imageData, createdAt: new Date().toISOString() };
  let imgs = [...deckImages, newImg];
  if (maxImages > 0) {
    const deckImgs = imgs.filter(i => i.deckId === deckId).sort((a,b) => a.createdAt.localeCompare(b.createdAt));
    if (deckImgs.length > maxImages) {
      const toDelete = new Set(deckImgs.slice(0, deckImgs.length - maxImages).map(i => i.id));
      imgs = imgs.filter(i => !toDelete.has(i.id));
    }
  }
  return { newImgs: imgs, newImgId: newImg.id };
}
function getMatchImage(match, deckImages, deck) {
  if (match.imageId) {
    const img = deckImages.find(i => i.id === match.imageId);
    if (img) return img.imageData;
  }
  return null;
}
function firstHex(colors) {
  if (!colors?.length) return C.muted;
  if (colors.includes("rainbow")) return null;
  return DECK_COLORS.find(c => c.id === colors[0])?.hex || C.muted;
}

// ── Small UI Components ────────────────────────────────
function DeckDot({ colors, size=12 }) {
  const s = { width:size, height:size, borderRadius:"50%", flexShrink:0 };
  if (!colors?.length) return <div style={{...s, background:C.muted}} />;
  if (colors.includes("rainbow")) return <div style={{...s, background:"linear-gradient(135deg,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7)"}} />;
  if (colors.length===1) { const c=DECK_COLORS.find(x=>x.id===colors[0]); return <div style={{...s, background:c?.hex||C.muted}} />; }
  const hexes=colors.slice(0,4).reverse().map(id=>DECK_COLORS.find(c=>c.id===id)?.hex||C.muted);
  const step=360/hexes.length;
  return <div style={{...s, background:`conic-gradient(${hexes.map((h,i)=>`${h} ${i*step}deg ${(i+1)*step}deg`).join(",")})`}} />;
}

function WinBadge({result, t}) {
  const m={win:[t.winShort,C.win],lose:[t.loseShort,C.lose],draw:[t.drawShort,C.draw]};
  const [l,col]=m[result]||m.draw;
  return <span style={{background:col+"22",color:col,border:`1px solid ${col}55`,borderRadius:6,padding:"2px 8px",fontSize:12,fontWeight:700}}>{l}</span>;
}
function TurnBadge({turn, t}) {
  if (!turn) return null;
  const col=turn==="first"?C.first:C.second;
  const label=turn==="first"?t.firstShort:t.secondShort;
  return <span style={{background:col+"22",color:col,border:`1px solid ${col}55`,borderRadius:6,padding:"2px 8px",fontSize:12,fontWeight:700}}>{label}</span>;
}

function ToggleRow({ options, value, onChange, size="md", noDeselect=false }) {
  const pad = size==="sm" ? "6px 0" : "8px 0";
  const fs = size==="sm" ? 12 : 13;
  return (
    <div style={{display:"flex", gap:6}}>
      {options.map(([v,label,col])=>{
        const sel=value===v;
        const bc=col||(sel?C.accent:C.border);
        return (
          <button key={v} onClick={()=>onChange(noDeselect?v:(sel?"":v))} style={{
            flex:1, padding:pad, borderRadius:8, border:`2px solid ${sel?bc:C.border}`,
            background:sel?bc+"22":"transparent", color:sel?bc:C.muted,
            fontWeight:sel?700:400, cursor:"pointer", fontSize:fs,
          }}>{label}</button>
        );
      })}
    </div>
  );
}

function DeckPicker({ value, onChange, names, placeholder, useId=false, t }) {
  const ph = placeholder || t.deckNamePlaceholder;
  const [mode, setMode] = useState(() => names.some(n=>(useId?n.id:n.name)===value) ? "list" : "text");
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(() => {
    if (!value) return "";
    if (useId) { const f=names.find(n=>n.id===value); return f?f.name:""; }
    return value;
  });
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);
  const selectedName = useId ? (names.find(n=>n.id===value)?.name || "") : (value || "");
  const textSuggestions = text.trim().length > 0 ? names.filter(n=>n.name.toLowerCase().includes(text.toLowerCase())) : [];
  const selectItem = item => { onChange(useId ? item.id : item.name, item.name); setText(item.name); setOpen(false); setFocused(false); };
  return (
    <div style={{position:"relative"}}>
      <div style={{display:"flex",gap:5,marginBottom:7}}>
        {[[`list`,t.fromList],[`text`,t.directInput]].map(([m,l])=>(
          <button key={m} onClick={()=>{setMode(m);setOpen(false);}} style={{
            flex:1, padding:"5px 0", borderRadius:6, fontSize:11, cursor:"pointer",
            border:`1.5px solid ${mode===m?C.accent:C.border}`,
            background:mode===m?C.accent+"22":"transparent",
            color:mode===m?C.accent:C.muted, fontWeight:mode===m?700:400,
          }}>{l}</button>
        ))}
      </div>
      {mode==="list" ? (
        <>
          <div onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",cursor:"pointer"}}>
            <span style={{fontSize:15, color:selectedName?C.text:C.muted}}>{selectedName || ph}</span>
            <span style={{color:C.muted,fontSize:12,marginLeft:8}}>{open?"▲":"▼"}</span>
          </div>
          {open && (
            <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1px solid ${C.border}`,borderRadius:8,zIndex:100,maxHeight:200,overflowY:"auto"}}>
              {names.length===0 ? <div style={{padding:"12px 14px",fontSize:13,color:C.muted}}>{t.noDecksRegistered}</div>
              : names.map(n=>{
                const v=useId?n.id:n.name; const sel=value===v;
                return <div key={v} onMouseDown={()=>selectItem(n)} style={{padding:"11px 14px",cursor:"pointer",background:sel?C.accent+"22":"transparent",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>{n.name}</span>{sel&&<span style={{color:C.accent,fontSize:13,fontWeight:800}}>✓</span>}
                </div>;
              })}
            </div>
          )}
        </>
      ) : (
        <div style={{position:"relative"}}>
          <input ref={ref} value={text} onChange={e=>{setText(e.target.value);onChange(useId?"":e.target.value);}}
            onFocus={()=>setFocused(true)} onBlur={()=>setTimeout(()=>setFocused(false),150)}
            placeholder={ph}
            style={{width:"100%",background:C.bg,border:`1px solid ${focused?C.accent:C.border}`,borderRadius:8,color:C.text,padding:"10px 12px",fontSize:15,boxSizing:"border-box"}}/>
          {focused && textSuggestions.length>0&&(
            <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1px solid ${C.border}`,borderRadius:8,zIndex:100,maxHeight:180,overflowY:"auto"}}>
              {textSuggestions.map(n=>(
                <div key={n.name} onTouchStart={()=>selectItem(n)} onMouseDown={()=>selectItem(n)}
                  style={{padding:"10px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>{n.name}</span><span style={{fontSize:11,color:C.accent}}>{t.selectLabel}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MatchTypePicker({ value, onChange, matchTypes, onAdd, onDelete, t, lang }) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const handleAdd = () => { const tx=draft.trim(); if(!tx||matchTypes.includes(tx)) return; onAdd(tx); setDraft(""); setAdding(false); };
  return (
    <div style={{position:"relative"}}>
      <div onClick={()=>{setOpen(o=>!o); setAdding(false);}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",cursor:"pointer"}}>
        <span style={{fontSize:15, color:value?C.text:C.muted}}>{value?displayMatchType(value,lang):t.selectPlaceholder}</span>
        <span style={{color:C.muted,fontSize:12,marginLeft:8}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1px solid ${C.border}`,borderRadius:8,zIndex:100}}>
          {value&&<div onClick={()=>{onChange("");setOpen(false);}} style={{padding:"10px 14px",cursor:"pointer",color:C.muted,fontSize:13,borderBottom:`1px solid ${C.border}`}}>−</div>}
          <div style={{maxHeight:200,overflowY:"auto"}}>
            {matchTypes.map(tx=>{
              const sel=value===tx;
              return <div key={tx} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",cursor:"pointer",background:sel?C.accent+"22":"transparent"}}>
                <span style={{flex:1}} onClick={()=>{onChange(sel?"":tx);setOpen(false);}}>{displayMatchType(tx,lang)}</span>
                {sel&&<span style={{color:C.accent,fontWeight:800,fontSize:13,marginRight:8}}>✓</span>}
                <span onClick={e=>{e.stopPropagation();onDelete(tx);if(value===tx)onChange("");}} style={{color:C.muted,fontSize:13,padding:"0 4px",cursor:"pointer"}}>✕</span>
              </div>;
            })}
          </div>
          {!adding ? <div onClick={()=>setAdding(true)} style={{padding:"10px 14px",cursor:"pointer",color:C.accent,fontSize:13,borderTop:`1px solid ${C.border}`}}>{t.addNew}</div>
          : <div style={{padding:"8px 10px",borderTop:`1px solid ${C.border}`,display:"flex",gap:6}}>
            <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd}
              placeholder={t.addPlaceholder}
              style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,padding:"6px 10px",fontSize:13}}/>
            <button onClick={handleAdd} style={{background:C.accent,color:"#000",border:"none",borderRadius:6,padding:"6px 10px",cursor:"pointer",fontWeight:700}}>{t.addButton}</button>
            <button onClick={()=>{setAdding(false);setDraft("");}} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,padding:"6px 8px",cursor:"pointer"}}>✕</button>
          </div>}
        </div>
      )}
    </div>
  );
}

function Row({ label, children, fieldKey, formFields, onToggleField, required=false }) {
  const minimized = fieldKey && (formFields||{})[fieldKey] === false;
  const reqBadge = required && <span style={{fontSize:10,color:"#ff6b6b",fontWeight:700,marginLeft:4}}>*</span>;
  const labelEl = <span style={{fontSize:11,color:required?C.text:C.muted,letterSpacing:0.3,fontWeight:required?700:400}}>{label}{reqBadge}</span>;
  if (fieldKey && onToggleField) {
    if (minimized) return (
      <div style={{display:"flex",alignItems:"center",paddingBottom:6,paddingTop:4,borderBottom:`1px solid ${C.border}`}}>
        <span style={{fontSize:10,color:C.muted,letterSpacing:0.3,flex:1}}>{label}</span>
        <span onClick={()=>onToggleField(fieldKey)} style={{fontSize:13,cursor:"pointer",color:C.muted,padding:"2px 8px"}}>＋</span>
      </div>
    );
    return (
      <div style={{paddingBottom:10,borderBottom:`1px solid ${C.border}`,background:required?"transparent":"transparent"}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:6}}>
          <div style={{flex:1}}>{labelEl}</div>
          <span onClick={()=>onToggleField(fieldKey)} style={{fontSize:13,cursor:"pointer",color:C.muted,padding:"2px 8px"}}>−</span>
        </div>
        <div>{children}</div>
      </div>
    );
  }
  return (
    <div style={{display:"grid",gridTemplateColumns:"64px 1fr",gap:8,alignItems:"start",paddingBottom:10,borderBottom:`1px solid ${C.border}`}}>
      <div style={{paddingTop:8}}>{labelEl}</div>
      <div>{children}</div>
    </div>
  );
}

// ── MatchEntry ─────────────────────────────────────────
function MatchEntry({ initial, onSave, onCancel, decks, opponentNames, opponents, matchTypes, onAddMatchType, onDeleteMatchType, isEdit=false, onDelete, formFields, carryOver, onToggleCarryOver, onToggleField, onContinue, seriesCount=0, scrollRef, t, lang }) {
  const [form, setForm] = useState(initial);
  const set = patch => setForm(f=>({...f,...patch}));
  const deckOK = !!(form.deckId || (form.deckName && form.deckName.trim()));
  const canSave = deckOK && form.opponent.trim() && form.result;
  const inputStyle = { background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, padding:"10px 12px", fontSize:15, width:"100%", boxSizing:"border-box" };
  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"Noto Sans JP,Hiragino Sans,sans-serif",display:"flex",flexDirection:"column"}}>
      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"14px 16px",display:"flex",alignItems:"center",gap:10}}>
        <button onClick={onCancel} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,padding:"8px 12px",cursor:"pointer",fontSize:13}}>{t.cancel}</button>
        <div style={{textAlign:"center",flex:1,minWidth:0}}>
          <div style={{fontWeight:800,fontSize:15}}>{isEdit?t.editMatch:t.recordMatch}</div>
          {!isEdit&&<div style={{fontSize:11,color:"#ff9800",fontWeight:700}}>{t.seriesLabel(seriesCount)}</div>}
        </div>
        <div style={{display:"flex",gap:5,flexShrink:0}}>
          <button onClick={()=>canSave&&onSave(form)} style={{background:canSave?`linear-gradient(135deg,${C.accent},${C.accentDim})`:"#333",color:canSave?"#000":C.muted,border:"none",borderRadius:8,padding:"8px 14px",cursor:canSave?"pointer":"not-allowed",fontWeight:700,fontSize:13}}>{t.save}</button>
          {!isEdit&&onContinue&&<button onClick={()=>canSave&&onContinue(form)} style={{background:canSave?C.surface:"#333",color:canSave?C.accent:C.muted,border:`1px solid ${canSave?C.accent:C.border}`,borderRadius:8,padding:"8px 10px",cursor:canSave?"pointer":"not-allowed",fontSize:12}}>{t.saveAndNext}</button>}
        </div>
      </div>
      <div ref={scrollRef} style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"12px 16px",display:"flex",flexDirection:"column",gap:0}}>
        {!isEdit&&(
          <div>
            <div onClick={()=>{ const next=!carryOver; onToggleCarryOver(next); }} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",marginBottom:8,cursor:"pointer"}}>
              <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${carryOver?C.accent:C.border}`,background:carryOver?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {carryOver&&<span style={{color:"#000",fontSize:13,fontWeight:900}}>✓</span>}
              </div>
              <span style={{fontSize:13,color:carryOver?C.text:C.muted}}>{t.carryOver}</span>
            </div>
          </div>
        )}
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          <Row label={t.fDate} fieldKey="date" formFields={formFields} onToggleField={onToggleField}>
            <input type="date" value={form.date} onChange={e=>set({date:e.target.value})} style={inputStyle}/>
          </Row>
          <Row label={t.fMatchType} fieldKey="matchType" formFields={formFields} onToggleField={onToggleField}>
            <MatchTypePicker value={form.matchType||""} onChange={v=>set({matchType:v})} matchTypes={matchTypes} onAdd={onAddMatchType} onDelete={onDeleteMatchType} t={t} lang={lang}/>
          </Row>
          <Row label={t.fDeck} fieldKey="deck" formFields={formFields} onToggleField={onToggleField}>
            <DeckPicker value={form.deckId?((decks.find(d=>d.id===form.deckId)?.name)||form.deckName||""):form.deckName||""} onChange={(v,name)=>{ if(decks.find(d=>d.name===name)){set({deckId:decks.find(d=>d.name===name).id,deckName:""});}else{set({deckId:"",deckName:v});}}} names={decks.map(d=>({id:d.id,name:d.name}))} useId={false} t={t}/>
          </Row>
          <Row label={t.fOpponent} fieldKey="opponent" formFields={formFields} onToggleField={onToggleField} required>
            <DeckPicker value={form.opponent} onChange={v=>set({opponent:v})} names={Array.from(new Set(opponentNames)).map(n=>({name:n}))} t={t}/>
          </Row>
          <Row label={t.fOpponentPerson} fieldKey="opponentPerson" formFields={formFields} onToggleField={onToggleField}>
            <DeckPicker value={form.opponentPerson||""} onChange={v=>set({opponentPerson:v})} names={(opponents||[]).map(n=>({name:n}))} t={t}/>
          </Row>
          <Row label={t.fTurn} fieldKey="turn" formFields={formFields} onToggleField={onToggleField}>
            <ToggleRow options={[["first",t.first,C.first],["second",t.second,C.second]]} value={form.turn} onChange={v=>set({turn:v})}/>
          </Row>
          <Row label={t.fResult} fieldKey="result" formFields={formFields} onToggleField={onToggleField} required>
            <ToggleRow options={[["win",t.win,C.win],["lose",t.lose,C.lose],["draw",t.draw,C.draw]]} value={form.result} onChange={v=>set({result:v})} noDeselect/>
          </Row>
          <Row label={t.fEndTurn} fieldKey="endTurn" formFields={formFields} onToggleField={onToggleField}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>set({endTurn:form.endTurn!=null?Math.max(1,form.endTurn-1):null})} style={{width:32,height:32,borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.text,cursor:"pointer",fontSize:18}}>−</button>
              <span style={{fontSize:22,fontWeight:800,color:form.endTurn?C.text:C.muted,minWidth:32,textAlign:"center"}}>{form.endTurn??"-"}</span>
              <button onClick={()=>set({endTurn:form.endTurn!=null?form.endTurn+1:1})} style={{width:32,height:32,borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.text,cursor:"pointer",fontSize:18}}>＋</button>
              <span style={{fontSize:12,color:C.muted}}>{t.turn}</span>
              {form.endTurn!=null&&<button onClick={()=>set({endTurn:null})} style={{marginLeft:4,background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,padding:"2px 8px",cursor:"pointer",fontSize:11}}>{t.clearTurn}</button>}
            </div>
          </Row>
          <Row label={t.fLucky} fieldKey="lucky" formFields={formFields} onToggleField={onToggleField}>
            <div style={{display:"flex",gap:8}}>
              {[["lucky",t.lucky,"#22c55e"],["unlucky",t.unlucky,"#f87171"]].map(([k,label,col])=>{
                const sel=form[k]||false;
                return <button key={k} onClick={()=>set({[k]:!sel})} style={{flex:1,padding:"8px 0",borderRadius:8,border:`2px solid ${sel?col:C.border}`,background:sel?col+"22":"transparent",color:sel?col:C.muted,cursor:"pointer",fontSize:13,fontWeight:sel?700:400}}>{label}</button>;
              })}
            </div>
          </Row>
          <Row label={t.fNotes} fieldKey="notes" formFields={formFields} onToggleField={onToggleField}>
            <textarea value={form.notes} onChange={e=>set({notes:e.target.value})} placeholder={t.fNotes} style={{...inputStyle,minHeight:80,resize:"vertical"}}/>
          </Row>
          <Row label={t.fDeckUrl} fieldKey="deckUrl" formFields={formFields} onToggleField={onToggleField}>
            <input placeholder="https://..." value={form.deckUrl||""} onChange={e=>set({deckUrl:e.target.value})} style={inputStyle}/>
          </Row>
          <Row label={t.fDeckImage} fieldKey="deckImage" formFields={formFields} onToggleField={onToggleField}>
            <label style={{display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,border:`2px dashed ${C.border}`,minHeight:80,cursor:"pointer",overflow:"hidden"}}>
              {form.deckImage
                ? <img src={form.deckImage} alt="" style={{width:"100%",maxHeight:160,objectFit:"contain"}}/>
                : <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:16}}>
                    <span style={{color:C.muted,fontSize:13}}>🖼 {t.tapAddDeckImage}</span>
                  </div>
              }
              <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                const file=e.target.files[0]; if(!file) return;
                const reader=new FileReader();
                reader.onload=ev=>set({deckImage:ev.target.result});
                reader.readAsDataURL(file);
              }}/>
            </label>
            {form.deckImage&&(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
                <span style={{fontSize:11,color:C.accent}}>{t.savedDeckImage}</span>
                <button onClick={()=>set({deckImage:""})} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,padding:"2px 8px",cursor:"pointer",fontSize:11}}>{t.removeImage}</button>
              </div>
            )}
          </Row>
          <Row label={t.fImage} fieldKey="image" formFields={formFields} onToggleField={onToggleField}>
            <label style={{display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,border:`2px dashed ${C.border}`,minHeight:80,cursor:"pointer",overflow:"hidden"}}>
              {form.image
                ? <img src={form.image} alt="" style={{width:"100%",maxHeight:160,objectFit:"contain"}}/>
                : <span style={{color:C.muted,fontSize:13,padding:16}}>🖼 {t.tapAddBattleImage}</span>
              }
              <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                const file=e.target.files[0]; if(!file) return;
                const reader=new FileReader();
                reader.onload=ev=>set({image:ev.target.result});
                reader.readAsDataURL(file);
              }}/>
            </label>
            {form.image&&<button onClick={()=>set({image:""})} style={{marginTop:6,background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,padding:"4px 12px",cursor:"pointer",fontSize:12}}>{t.removeImage}</button>}
          </Row>
        </div>
      </div>
      <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:8}}>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>canSave&&onSave(form)} style={{flex:2,background:canSave?`linear-gradient(135deg,${C.accent},${C.accentDim})`:"#333",color:canSave?"#000":C.muted,border:"none",borderRadius:10,padding:"14px 0",cursor:canSave?"pointer":"not-allowed",fontWeight:800,fontSize:15}}>{t.save}</button>
          {!isEdit&&onContinue&&<button onClick={()=>{if(!canSave)return;onContinue(form);}} style={{flex:1,background:C.surface,color:C.accent,border:`1px solid ${C.accent}`,borderRadius:10,padding:"14px 0",cursor:canSave?"pointer":"not-allowed",fontWeight:700,fontSize:13}}>{t.saveAndNext}</button>}
        </div>
        {isEdit&&<button onClick={onDelete} style={{width:"100%",padding:"12px 0",borderRadius:10,border:"none",background:"#ff444422",color:"#ff4444",cursor:"pointer",fontWeight:700,fontSize:14}}>{t.delete}</button>}
      </div>
    </div>
  );
}

// ── MatchDetailModal ───────────────────────────────────
function MatchDetailModal({ match, deck, onClose, onEdit, formFields={}, deckImages=[], t, lang }) {
  const show = key => formFields[key] !== false;
  const hex = deck ? firstHex(deck.colors) : null;
  useEffect(() => { const prev=document.body.style.overflow; document.body.style.overflow="hidden"; return()=>{document.body.style.overflow=prev;}; }, []);
  return (
    <div style={{position:"fixed",inset:0,background:"#000b",display:"flex",alignItems:"flex-end",zIndex:1000}} onClick={onClose}>
      <div style={{background:C.card,borderRadius:"16px 16px 0 0",width:"100%",maxWidth:600,margin:"0 auto",maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",borderBottom:`1px solid ${C.border}`}}>
          <button onClick={onClose} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,padding:"6px 12px",cursor:"pointer",fontSize:13}}>{t.cancel}</button>
          <span style={{fontWeight:800,fontSize:15}}>vs {match.opponent}</span>
          <button onClick={onEdit} style={{background:"transparent",border:`1px solid ${C.accent}`,borderRadius:8,color:C.accent,padding:"6px 12px",cursor:"pointer",fontSize:13}}>{t.editButton}</button>
        </div>
        <div style={{padding:18,display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:C.surface,borderRadius:10,padding:14,display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span style={{color:C.muted}}>{t.dateLabel}</span><span style={{color:C.text}}>{match.date}</span>
            </div>
            {show("matchType")&&match.matchType&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span style={{color:C.muted}}>{t.matchTypeLabel}</span><span style={{color:C.text}}>{displayMatchType(match.matchType,lang)}</span>
            </div>}
            {deck&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13}}>
              <span style={{color:C.muted}}>{t.myDeckLabel}</span>
              <span style={{display:"flex",alignItems:"center",gap:5,color:hex||C.text,fontWeight:700}}><DeckDot colors={deck.colors} size={10}/>{deck.name}</span>
            </div>}
            {match.opponentPerson&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span style={{color:C.muted}}>{t.oppPersonLabel}</span><span style={{color:C.text,fontWeight:700}}>{match.opponentPerson}</span>
            </div>}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <WinBadge result={match.result} t={t}/>
              <TurnBadge turn={match.turn} t={t}/>
              {show("lucky")&&match.lucky&&<span style={{color:"#22c55e",background:"#22c55e22",border:"1px solid #22c55e55",borderRadius:6,padding:"2px 8px",fontSize:12}}>🍀</span>}
              {show("lucky")&&match.unlucky&&<span style={{color:"#f87171",background:"#f8717122",border:"1px solid #f8717155",borderRadius:6,padding:"2px 8px",fontSize:12}}>💀</span>}
            </div>
            {show("endTurn")&&match.endTurn!=null&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span style={{color:C.muted}}>{t.endTurnLabel}</span><span style={{color:C.text}}>{match.endTurn} {t.turn}</span>
            </div>}
            {show("deckUrl")&&match.deckUrl&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,gap:8}}>
              <span style={{color:C.muted,flexShrink:0}}>{t.deckUrlLabel2}</span>
              <a href={match.deckUrl} target="_blank" rel="noreferrer" style={{color:C.accent,wordBreak:"break-all"}}>{match.deckUrl}</a>
            </div>}
          </div>
          {show("notes")&&match.notes&&<div style={{background:C.surface,borderRadius:10,padding:14}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.notesLabel}</div>
            <div style={{fontSize:13,color:C.text,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{match.notes}</div>
          </div>}
          {show("deckImage")&&getMatchImage(match,deckImages,deck)&&<div><div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.deckImageLabel}</div><img src={getMatchImage(match,deckImages,deck)} alt="" style={{width:"100%",borderRadius:8,objectFit:"contain"}}/></div>}
          {show("image")&&match.image&&<div><div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.battleImageLabel}</div><img src={match.image} alt="" style={{width:"100%",borderRadius:8}}/></div>}
        </div>
      </div>
    </div>
  );
}

// ── Stats Components ───────────────────────────────────
const PIE_PALETTE = ["#00d4ff","#a78bfa","#00e676","#facc15","#f87171","#fb923c","#34d399","#60a5fa","#f472b6","#a3e635"];

function StatSection({ label, visKey, statVis, t, children }) {
  const [collapsed, setCollapsed] = useState(false);
  if (statVis[visKey] === false) return null;
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:collapsed?0:12}}>
        <span style={{fontSize:13,fontWeight:700,color:collapsed?C.muted:C.text}}>{label}</span>
        <button onClick={()=>setCollapsed(v=>!v)} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,padding:"3px 10px",cursor:"pointer",fontSize:11}}>
          {collapsed?t.showStat:t.hideStat}
        </button>
      </div>
      {!collapsed&&<div>{children}</div>}
    </div>
  );
}

function WinRateChart({ matches, t }) {
  if (!matches||matches.length<2) return null;
  const dates = matches.map(m=>new Date(m.date||m.createdAt)).filter(d=>!isNaN(d));
  if (dates.length<2) return null;
  const minD = new Date(Math.min(...dates));
  const maxD = new Date(Math.max(...dates));
  const diffDays = (maxD-minD)/(1000*60*60*24);
  let fmt, groupKey;
  if (diffDays<=1) {
    fmt = d=>`${d.getHours()}h`;
    groupKey = d=>d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+"-"+d.getHours();
  } else if (diffDays<=90) {
    fmt = d=>`${d.getMonth()+1}/${d.getDate()}`;
    groupKey = d=>d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
  } else if (diffDays<=365) {
    const getWeek = d=>{ const s=new Date(d.getFullYear(),0,1); return Math.ceil(((d-s)/86400000+s.getDay()+1)/7); };
    fmt = d=>`${d.getMonth()+1}/${d.getDate()}W`;
    groupKey = d=>d.getFullYear()+"-W"+getWeek(d);
  } else {
    fmt = d=>`${d.getFullYear()}/${d.getMonth()+1}`;
    groupKey = d=>d.getFullYear()+"-"+d.getMonth();
  }
  const groups = {};
  matches.forEach(m=>{
    const d = new Date(m.date||m.createdAt);
    if (isNaN(d)) return;
    const k = groupKey(d);
    if (!groups[k]) groups[k] = {label:fmt(d),wins:0,total:0,date:d};
    groups[k].total++;
    if (m.result==="win") groups[k].wins++;
  });
  const pts = Object.values(groups).sort((a,b)=>a.date-b.date).map(g=>({
    label:g.label, wr:g.total>0?Math.round(g.wins/g.total*100):0, total:g.total
  }));
  if (pts.length<2) return null;
  const W=320, H=80, padL=28, padR=8, padT=8, padB=20;
  const gW=W-padL-padR, gH=H-padT-padB;
  const xScale = i=>(i/(pts.length-1))*gW;
  const yScale = v=>gH-(v/100)*gH;
  const pathD = pts.map((p,i)=>`${i===0?"M":"L"}${padL+xScale(i)},${padT+yScale(p.wr)}`).join(" ");
  const y50 = padT+yScale(50);
  return (
    <div style={{marginTop:10}}>
      <div style={{fontSize:11,color:C.muted,marginBottom:4}}>{t.winRateLabel}</div>
      <svg viewBox={"0 0 "+W+" "+H} style={{width:"100%",height:H,display:"block"}}>
        <line x1={padL} y1={y50} x2={W-padR} y2={y50} stroke={C.border} strokeWidth="1" strokeDasharray="3,3"/>
        <text x={padL-2} y={y50+4} fontSize="9" fill={C.muted} textAnchor="end">50</text>
        <line x1={padL} y1={padT} x2={W-padR} y2={padT} stroke={C.border} strokeWidth="0.5" opacity="0.5"/>
        <line x1={padL} y1={padT+gH} x2={W-padR} y2={padT+gH} stroke={C.border} strokeWidth="0.5" opacity="0.5"/>
        <text x={padL-2} y={padT+4} fontSize="9" fill={C.muted} textAnchor="end">100</text>
        <text x={padL-2} y={padT+gH+4} fontSize="9" fill={C.muted} textAnchor="end">0</text>
        <path d={pathD} fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p,i)=>(
          <circle key={i} cx={padL+xScale(i)} cy={padT+yScale(p.wr)} r="3"
            fill={p.wr>=50?C.win:C.lose} stroke={C.card} strokeWidth="1.5"/>
        ))}
        {pts.map((p,i)=>{
          const show = i===0||i===pts.length-1||(pts.length>4&&i===Math.floor(pts.length/2));
          if (!show) return null;
          const anchor = i===0?"start":i===pts.length-1?"end":"middle";
          return <text key={i} x={padL+xScale(i)} y={H-4} fontSize="9" fill={C.muted} textAnchor={anchor}>{p.label}</text>;
        })}
      </svg>
    </div>
  );
}

function PieChart({ items, t }) {
  if (!items||items.length===0) return <div style={{fontSize:13,color:C.muted}}>{t.noStatData}</div>;
  const getColor = (item, index, usedColors) => {
    if (item.deckColors&&item.deckColors.length>0&&!item.deckColors.includes("rainbow")) {
      const dc=DECK_COLORS.find(c=>c.id===item.deckColors[0]);
      if (dc&&dc.hex) return dc.hex;
    }
    for (let i=0;i<PIE_PALETTE.length;i++) { const c=PIE_PALETTE[(index+i)%PIE_PALETTE.length]; if(!usedColors.includes(c)) return c; }
    return PIE_PALETTE[index%PIE_PALETTE.length];
  };
  const colors=[];
  items.forEach((item,i)=>colors.push(getColor(item,i,colors)));
  const size=140, cx=size/2, cy=size/2, r=54, ir=28;
  let cumAngle=-Math.PI/2;
  const sum=items.reduce((s,it)=>s+it.value,0);
  const slices=items.map((item,i)=>{
    const angle=(item.value/sum)*2*Math.PI;
    const x1=cx+r*Math.cos(cumAngle), y1=cy+r*Math.sin(cumAngle);
    const x2=cx+r*Math.cos(cumAngle+angle), y2=cy+r*Math.sin(cumAngle+angle);
    const ix1=cx+ir*Math.cos(cumAngle), iy1=cy+ir*Math.sin(cumAngle);
    const ix2=cx+ir*Math.cos(cumAngle+angle), iy2=cy+ir*Math.sin(cumAngle+angle);
    const large=angle>Math.PI?1:0;
    const d=`M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ir} ${ir} 0 ${large} 0 ${ix1} ${iy1} Z`;
    const slice={d,color:colors[i]};
    cumAngle+=angle;
    return slice;
  });
  return (
    <div style={{display:"flex",alignItems:"center",gap:16}}>
      <svg width={size} height={size} style={{flexShrink:0}}>
        {slices.map((s,i)=><path key={i} d={s.d} fill={s.color} stroke={C.card} strokeWidth={1.5}/>)}
        <circle cx={cx} cy={cy} r={ir-2} fill={C.card}/>
      </svg>
      <div style={{flex:1,maxHeight:160,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
        {items.map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:10,height:10,borderRadius:2,background:colors[i],flexShrink:0}}/>
            <span style={{fontSize:12,color:C.text,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.label}</span>
            <span style={{fontSize:12,color:C.muted,flexShrink:0}}>{Math.round(item.value/sum*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({label,value,color}) {
  return (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",flex:1,textAlign:"center"}}>
      <div style={{fontSize:22,fontWeight:900,color:color||C.accent,fontFamily:"monospace"}}>{value}</div>
      <div style={{fontSize:11,color:C.muted,marginTop:3}}>{label}</div>
    </div>
  );
}

// ── Merge Modals ───────────────────────────────────────
function MergeModal({allNames, onMerge, onCancel, initialSelected=[], t}) {
  const [selected,setSelected]=useState(initialSelected);
  const [newName,setNewName]=useState("");
  const toggle=n=>setSelected(s=>s.includes(n)?s.filter(x=>x!==n):[...s,n]);
  const canMerge=selected.length>=2&&newName.trim();
  const inputStyle={background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,padding:"10px 12px",fontSize:14,width:"100%",boxSizing:"border-box",marginBottom:12};
  return (
    <div style={{position:"fixed",inset:0,background:"#000b",display:"flex",alignItems:"flex-end",zIndex:1000}}>
      <div style={{background:C.card,borderRadius:"16px 16px 0 0",padding:20,width:"100%",maxWidth:600,margin:"0 auto"}}>
        <div style={{fontWeight:800,fontSize:15,marginBottom:4}}>{t.mergeOpponents}</div>
        <div style={{fontSize:12,color:C.muted,marginBottom:8}}>{t.mergeOppHint}</div>
        {selected.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>{selected.map(n=><span key={n} style={{background:C.accent+"33",color:C.accent,borderRadius:6,padding:"2px 8px",fontSize:12}}>{n}</span>)}</div>}
        <div style={{marginBottom:12,maxHeight:220,overflowY:"auto"}}>
          {allNames.map(n=>{
            const sel=selected.includes(n);
            return <div key={n} onClick={()=>toggle(n)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 4px",cursor:"pointer"}}>
              <div style={{width:17,height:17,borderRadius:4,border:`2px solid ${sel?C.accent:C.border}`,background:sel?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {sel&&<span style={{color:"#000",fontSize:11,fontWeight:900}}>✓</span>}
              </div>
              <span style={{fontSize:13,color:C.text}}>{n}</span>
            </div>;
          })}
        </div>
        {selected.length>=2&&<input placeholder={t.mergeNamePlaceholder} value={newName} onChange={e=>setNewName(e.target.value)} style={inputStyle}/>}
        <div style={{display:"flex",gap:8}}>
          <button onClick={onCancel} style={{flex:1,padding:"10px 0",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer"}}>{t.cancel}</button>
          <button onClick={()=>canMerge&&onMerge(selected,newName.trim())} style={{flex:2,padding:"10px 0",borderRadius:8,border:"none",background:canMerge?`linear-gradient(135deg,${C.accent},${C.accentDim})`:"#333",color:canMerge?"#000":C.muted,cursor:canMerge?"pointer":"not-allowed",fontWeight:700}}>{t.execute}</button>
        </div>
      </div>
    </div>
  );
}

function DeckMergeModal({ decks, selectedIds, deckImages, onMerge, onCancel, t }) {
  const selDecks = selectedIds.map(id=>decks.find(d=>d.id===id)).filter(Boolean);
  const [baseId, setBaseId] = useState(null);
  const [newName, setNewName] = useState("");
  const [step, setStep] = useState("base");
  const inputStyle={background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,padding:"10px 12px",fontSize:14,width:"100%",boxSizing:"border-box",marginBottom:12};
  const handleSelectBase = (id) => { setBaseId(id); const deck=selDecks.find(d=>d.id===id); setNewName(deck?.name||""); };
  return (
    <div style={{position:"fixed",inset:0,background:"#000b",display:"flex",alignItems:"flex-end",zIndex:1000}}>
      <div style={{background:C.card,borderRadius:"16px 16px 0 0",padding:20,width:"100%",maxWidth:600,margin:"0 auto"}}>
        {step==="base"?(
          <>
            <div style={{fontWeight:800,fontSize:15,marginBottom:4}}>{t.mergeBase}</div>
            <div style={{fontSize:12,color:C.muted,marginBottom:12}}>{t.mergeBaseHint}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
              {selDecks.map(d=>{
                const imgs=deckImages.filter(i=>i.deckId===d.id);
                const curImg=imgs.find(i=>i.id===d.currentImageId)||imgs[0];
                const sel=baseId===d.id;
                return (
                  <div key={d.id} onClick={()=>handleSelectBase(d.id)} style={{display:"flex",alignItems:"center",gap:12,padding:10,borderRadius:10,border:`2px solid ${sel?C.accent:C.border}`,background:sel?C.accent+"11":"transparent",cursor:"pointer"}}>
                    {curImg?<img src={curImg.imageData} alt="" style={{width:56,height:56,objectFit:"cover",borderRadius:8}}/>:<div style={{width:56,height:56,background:C.surface,borderRadius:8}}/>}
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                        <DeckDot colors={d.colors} size={10}/>
                        <span style={{fontWeight:700,fontSize:14,color:C.text}}>{d.name}</span>
                      </div>
                      <div style={{fontSize:12,color:C.muted}}>{t.savedImages(imgs.length)}</div>
                    </div>
                    <div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${sel?C.accent:C.border}`,background:sel?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {sel&&<span style={{color:"#000",fontSize:13,fontWeight:900}}>✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={onCancel} style={{flex:1,padding:"10px 0",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer"}}>{t.cancel}</button>
              <button onClick={()=>baseId&&setStep("name")} style={{flex:2,padding:"10px 0",borderRadius:8,border:"none",background:baseId?`linear-gradient(135deg,${C.accent},${C.accentDim})`:"#333",color:baseId?"#000":C.muted,cursor:baseId?"pointer":"not-allowed",fontWeight:700}}>{t.next}</button>
            </div>
          </>
        ):(
          <>
            <div style={{fontWeight:800,fontSize:15,marginBottom:4}}>{t.mergeNameStep}</div>
            <div style={{fontSize:12,color:C.muted,marginBottom:12}}>{t.mergeBaseLabel(selDecks.find(d=>d.id===baseId)?.name||"")}</div>
            <input placeholder={t.mergeNamePlaceholder2} value={newName} onChange={e=>setNewName(e.target.value)} style={inputStyle}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setStep("base")} style={{flex:1,padding:"10px 0",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer"}}>{t.back}</button>
              <button onClick={()=>newName.trim()&&onMerge(selectedIds,newName.trim(),baseId)} style={{flex:2,padding:"10px 0",borderRadius:8,border:"none",background:newName.trim()?`linear-gradient(135deg,${C.accent},${C.accentDim})`:"#333",color:newName.trim()?"#000":C.muted,cursor:newName.trim()?"pointer":"not-allowed",fontWeight:700}}>{t.execute}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── ColorPicker ────────────────────────────────────────
function ColorPicker({colors, onChange, lang}) {
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
      {DECK_COLORS.map(c=>{
        const sel=colors.includes(c.id), isRainbow=c.id==="rainbow";
        const toggle=()=>{ if(isRainbow){onChange(sel?[]:["rainbow"]);}else{const w=colors.filter(x=>x!=="rainbow"); onChange(sel?w.filter(x=>x!==c.id):[...w,c.id]);} };
        const label = getDeckColorLabel(c, lang);
        return <button key={c.id} onClick={toggle} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:20,border:`1.5px solid ${sel?c.hex||C.accent:C.border}`,background:sel?(c.hex||C.accent)+"22":"transparent",color:sel?c.hex||C.accent:C.muted,cursor:"pointer",fontSize:12,fontWeight:sel?700:400}}>
          {isRainbow?<div style={{width:11,height:11,borderRadius:"50%",background:"linear-gradient(135deg,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7)"}}/>:<div style={{width:10,height:10,borderRadius:"50%",background:c.hex}}/>}
          {label}
        </button>;
      })}
    </div>
  );
}

// ── DeckDetailModal ────────────────────────────────────
function DeckDetailModal({ deck, deckStats, inputStyle, onClose, onSave, onDelete, allDecks=[], deckImages=[], onSaveImage, onDeleteImage, t, lang }) {
  const [form, setForm] = useState({ name:deck.name||"", colors:deck.colors||[], url:deck.url||"", notes:deck.notes||"", parentId:deck.parentId||"", maxImages:deck.maxImages??10, isActive:deck.isActive||false });
  const [newImageData, setNewImageData] = useState(null);
  const [currentImageId, setCurrentImageId] = useState(deck.currentImageId||null);
  useEffect(()=>{ const prev=document.body.style.overflow; document.body.style.overflow="hidden"; return()=>{document.body.style.overflow=prev;}; },[]);
  const thisImages = deckImages.filter(i=>i.deckId===deck.id).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  const set = patch => setForm(f=>({...f,...patch}));
  const ds = deckStats || {};
  return (
    <div style={{position:"fixed",inset:0,background:"#000b",display:"flex",alignItems:"flex-end",zIndex:1000}}>
      <div style={{background:C.card,borderRadius:"16px 16px 0 0",width:"100%",maxWidth:600,margin:"0 auto",maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",borderBottom:`1px solid ${C.border}`}}>
          <button onClick={onClose} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,padding:"6px 12px",cursor:"pointer",fontSize:13}}>{t.cancel}</button>
          <span style={{fontWeight:800,fontSize:15}}>{deck.name}</span>
          <button onClick={()=>onSave({...form,currentImageId})} style={{background:`linear-gradient(135deg,${C.accent},${C.accentDim})`,color:"#000",border:"none",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontWeight:700,fontSize:13}}>{t.saveButton}</button>
        </div>
        {(thisImages.find(i=>i.id===currentImageId)||thisImages[0])&&<div style={{position:"relative",height:120,overflow:"hidden"}}><img src={(thisImages.find(i=>i.id===currentImageId)||thisImages[0]).imageData} alt="" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.5}}/></div>}
        <div style={{padding:18,display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.deckImageCount(thisImages.length)}</div>
            <label style={{display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,border:`2px dashed ${C.border}`,minHeight:80,cursor:"pointer",overflow:"hidden",marginBottom:8}}>
              {newImageData?<img src={newImageData} alt="" style={{width:"100%",maxHeight:140,objectFit:"contain"}}/>:<span style={{color:C.muted,fontSize:13}}>🖼 {t.tapAddDeckImage}</span>}
              <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setNewImageData(ev.target.result);r.readAsDataURL(f);}}/>
            </label>
            {newImageData&&(
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <button onClick={()=>{if(onSaveImage){const newId=onSaveImage(deck.id,newImageData);setCurrentImageId(newId);}setNewImageData(null);}} style={{flex:2,padding:"8px 0",borderRadius:8,border:"none",background:`linear-gradient(135deg,${C.accent},${C.accentDim})`,color:"#000",cursor:"pointer",fontWeight:700,fontSize:13}}>{t.saveButton}</button>
                <button onClick={()=>setNewImageData(null)} style={{flex:1,padding:"8px 0",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:13}}>{t.cancel}</button>
              </div>
            )}
            {thisImages.length>0&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}>
                {thisImages.map(img=>(
                  <div key={img.id} style={{position:"relative",width:76,borderRadius:8,overflow:"hidden",border:`2px solid ${img.id===currentImageId?C.accent:C.border}`}}>
                    <img src={img.imageData} alt="" style={{width:"100%",height:76,objectFit:"cover"}}/>
                    {img.id===currentImageId&&<div style={{position:"absolute",top:2,left:2,background:C.accent,borderRadius:4,padding:"1px 4px",fontSize:9,color:"#000",fontWeight:700}}>✓</div>}
                    <div style={{display:"flex",gap:2,padding:"3px 4px",background:"rgba(0,0,0,0.7)"}}>
                      {img.id!==currentImageId&&<button onClick={()=>{setCurrentImageId(img.id);}} style={{flex:1,padding:"2px 0",border:"none",background:C.accent,color:"#000",borderRadius:3,cursor:"pointer",fontSize:9,fontWeight:700}}>{t.setAsCurrent}</button>}
                      <button onClick={()=>onDeleteImage&&onDeleteImage(img.id,deck.id)} style={{flex:1,padding:"2px 0",border:"none",background:"#ff444488",color:"#fff",borderRadius:3,cursor:"pointer",fontSize:9}}>{t.deleteImage}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:12,color:C.muted,flex:1}}>{t.imageLimit}</span>
              <button onClick={()=>set({maxImages:Math.max(0,form.maxImages-1)})} style={{width:28,height:28,borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,color:C.text,cursor:"pointer"}}>−</button>
              <span style={{fontSize:14,fontWeight:700,minWidth:36,textAlign:"center"}}>{form.maxImages===0?t.unlimited:form.maxImages}</span>
              <button onClick={()=>set({maxImages:form.maxImages+1})} style={{width:28,height:28,borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,color:C.text,cursor:"pointer"}}>＋</button>
              {form.maxImages!==0&&<button onClick={()=>set({maxImages:0})} style={{padding:"3px 8px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:11}}>{t.unlimited}</button>}
            </div>
          </div>
          <div><div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.deckNameLabel}</div><input value={form.name} onChange={e=>set({name:e.target.value})} style={{...inputStyle,marginBottom:0}}/></div>
          <div><div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.colorLabel}</div><ColorPicker colors={form.colors} onChange={v=>set({colors:v})} lang={lang}/></div>
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.parentDeckLabel}</div>
            <select value={form.parentId||""} onChange={e=>set({parentId:e.target.value})} style={{...inputStyle,marginBottom:0}}>
              <option value="">{t.noneOption}</option>
              {allDecks.filter(d=>d.id!==deck.id).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div><div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.deckUrlLabel}</div><input placeholder="https://..." value={form.url||""} onChange={e=>set({url:e.target.value})} style={{...inputStyle,marginBottom:0}}/></div>
          <div><div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.memoLabel}</div><textarea value={form.notes||""} onChange={e=>set({notes:e.target.value})} style={{...inputStyle,minHeight:60,resize:"vertical",marginBottom:0}}/></div>
          <div style={{background:C.surface,borderRadius:10,padding:12}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:8}}>{t.recordLabel}</div>
            <div style={{display:"flex",gap:14,fontSize:13,color:C.muted}}>
              <span>{t.battles}: <strong style={{color:C.text}}>{ds.total||0}</strong></span>
              <span>{t.winLabel}: <strong style={{color:C.win}}>{ds.wins||0}</strong></span>
              <span>{t.loseLabel}: <strong style={{color:C.lose}}>{ds.loses||0}</strong></span>
              <span>{t.winRate}: <strong style={{color:(ds.winRate||0)>=50?C.win:C.lose}}>{ds.winRate||0}%</strong></span>
            </div>
          </div>
          <button onClick={onDelete} style={{width:"100%",padding:"13px 0",borderRadius:10,border:"none",background:"#ff444422",color:"#ff4444",cursor:"pointer",fontWeight:700,fontSize:14}}>{t.deleteButton}</button>
        </div>
      </div>
    </div>
  );
}

// ── OppCard ────────────────────────────────────────────
function OppCard({ name, checked, onToggle, showStats, w, l, dr, t, wr2, onRename, onDelete, inputStyle }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const save = () => { const n=draft.trim(); if(n&&n!==name) onRename(n); setEditing(false); };
  const tx = t;
  return (
    <div onClick={()=>!editing&&onToggle()} style={{background:C.card,border:`1.5px solid ${checked?C.accent:C.border}`,borderRadius:10,padding:12,cursor:"pointer"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${checked?C.accent:C.border}`,background:checked?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {checked&&<span style={{color:"#000",fontSize:11,fontWeight:900}}>✓</span>}
        </div>
        {editing?(
          <div onClick={e=>e.stopPropagation()} style={{display:"flex",gap:6,flex:1}}>
            <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")save();if(e.key==="Escape")setEditing(false);}} style={{flex:1,...inputStyle,padding:"4px 8px",fontSize:13,margin:0}}/>
            <button onClick={save} style={{background:C.accent,color:"#000",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontWeight:700}}>{tx.saveEdit}</button>
            <button onClick={()=>setEditing(false)} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,padding:"4px 8px",cursor:"pointer"}}>✕</button>
          </div>
        ):(
          <>
            <span style={{fontWeight:800,fontSize:15,flex:1}}>{name}</span>
            {showStats&&t>0&&<span style={{fontWeight:900,color:wr2>=50?C.win:C.lose,fontSize:14,marginRight:4}}>{wr2}%</span>}
            <button onClick={e=>{e.stopPropagation();setDraft(name);setEditing(true);}} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,padding:"3px 8px",cursor:"pointer",fontSize:11}}>✏️</button>
            <button onClick={e=>{e.stopPropagation();onDelete&&onDelete(name);}} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:"#ff6666",padding:"3px 8px",cursor:"pointer",fontSize:11}}>🗑</button>
          </>
        )}
      </div>
      {showStats&&t>0&&!editing&&(
        <div style={{marginTop:8,paddingLeft:30}}>
          <div style={{display:"flex",borderRadius:4,overflow:"hidden",height:6}}>
            {w>0&&<div style={{flex:w,background:C.win}}/>}
            {dr>0&&<div style={{flex:dr,background:C.draw}}/>}
            {l>0&&<div style={{flex:l,background:C.lose}}/>}
          </div>
          <div style={{fontSize:11,color:C.muted,marginTop:4}}>{tx.battleStats(t,w,l)}</div>
        </div>
      )}
    </div>
  );
}

// ── Filter Components ──────────────────────────────────
function AddOppForm({ newOppName, setNewOppName, onCancel, onAdd, inputStyle, t }) {
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
      <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.oppNameRequired}</div>
      <input value={newOppName} onChange={e=>setNewOppName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onAdd()}
        style={{...inputStyle,marginBottom:8}} placeholder={t.deckNamePlaceholder}/>
      <div style={{display:"flex",gap:8}}>
        <button onClick={onCancel} style={{flex:1,padding:"10px 0",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer"}}>{t.cancel}</button>
        <button onClick={onAdd} style={{flex:2,background:`linear-gradient(135deg,${C.accent},${C.accentDim})`,color:"#000",border:"none",borderRadius:8,padding:"10px 0",cursor:"pointer",fontWeight:700}}>{t.addButton}</button>
      </div>
    </div>
  );
}

function AddMatchTypeInline({ onAdd, matchTypes, inputStyle, t }) {
  const [draft, setDraft] = useState("");
  const handleAdd = () => { const tx=draft.trim(); if(!tx||matchTypes.includes(tx)) return; onAdd(tx); setDraft(""); };
  return (
    <div style={{display:"flex",gap:8,marginTop:10}}>
      <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd}
        placeholder={t.addPlaceholder} style={{...inputStyle,flex:1,margin:0}}/>
      <button onClick={handleAdd} style={{background:`linear-gradient(135deg,${C.accent},${C.accentDim})`,color:"#000",border:"none",borderRadius:8,padding:"0 16px",cursor:"pointer",fontWeight:700}}>{t.addButton}</button>
    </div>
  );
}

// ── Filter Bar ─────────────────────────────────────────
function FilterBarTop({ activeFilters, open, setOpen, onReset, t }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
      <button onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:6,padding:"0 14px",height:36,borderRadius:8,border:`1px solid ${activeFilters>0?C.accent:C.border}`,background:activeFilters>0?C.accent+"22":"transparent",color:activeFilters>0?C.accent:C.muted,cursor:"pointer",fontSize:13}}>
        🔍 {t.filter}{activeFilters>0&&<span style={{background:C.accent,color:"#000",borderRadius:"50%",width:18,height:18,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>{activeFilters}</span>}
        <span style={{fontSize:10,marginLeft:2}}>{open?"▲":"▼"}</span>
      </button>
      {activeFilters>0&&<button onClick={onReset} style={{padding:"0 12px",height:36,borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:12}}>{t.resetFilter}</button>}
    </div>
  );
}

function FilterBarPanel({ decks, allOpponentNames, opponents, matchTypes, flt, setF, inputStyle, t, lang, formFields={} }) {
  const show = key => formFields[key] !== false;
  const toggleArr = (key, val) => setF({ [key]: flt[key].includes(val) ? flt[key].filter(x=>x!==val) : [...flt[key], val] });
  const [openDeckList, setOpenDeckList] = useState(false);
  const [openOppList, setOpenOppList] = useState(false);
  const [deckSearch, setDeckSearch] = useState("");
  const [oppSearch, setOppSearch] = useState("");
  const chip = (active) => ({ padding:"5px 11px", borderRadius:20, fontSize:12, cursor:"pointer", border:`1px solid ${active?C.accent:C.border}`, background:active?C.accent+"22":"transparent", color:active?C.accent:C.muted });
  const listRow = (active) => ({ padding:"10px 14px", cursor:"pointer", fontSize:14, color:active?C.accent:C.text, background:active?C.accent+"11":"transparent" });
  const deckLabel = flt.decks.length>0 ? [...decks.filter(d=>flt.decks.includes(d.id)).map(d=>d.name),(flt.decks.includes("__no_deck__")?[t.noData]:[])].flat().join("・") : t.allItems;
  const oppLabel = flt.opponents.length>0 ? flt.opponents.join("・") : t.allItems;
  const filteredDecks = deckSearch.trim() ? decks.filter(d=>d.name.toLowerCase().includes(deckSearch.toLowerCase())) : decks;
  const filteredOpps = oppSearch.trim() ? (allOpponentNames||[]).filter(n=>n.toLowerCase().includes(oppSearch.toLowerCase())) : (allOpponentNames||[]);
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:12,marginTop:4,display:"flex",flexDirection:"column",gap:14}}>
      <div>
        <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.period}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {[[`all`,t.periodAll],[`today`,t.periodToday],[`week`,t.periodWeek],[`month`,t.periodMonth],[`year`,t.periodYear]].map(([v,l])=>(
            <button key={v} onClick={()=>setF({periodPreset:v,dateFrom:"",dateTo:""})} style={chip(flt.periodPreset===v)}>{l}</button>
          ))}
        </div>
      </div>
      <div>
        <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.periodCustom}</div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <input type="date" value={flt.dateFrom} onChange={e=>setF({dateFrom:e.target.value,periodPreset:"custom"})} style={{...inputStyle,flex:1,margin:0,padding:"6px 8px"}}/>
          <span style={{color:C.muted,fontSize:12,flexShrink:0}}>〜</span>
          <input type="date" value={flt.dateTo} onChange={e=>setF({dateTo:e.target.value,periodPreset:"custom"})} style={{...inputStyle,flex:1,margin:0,padding:"6px 8px"}}/>
          {(flt.dateFrom||flt.dateTo)&&<button onClick={()=>setF({dateFrom:"",dateTo:""})} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,padding:"4px 8px",cursor:"pointer",fontSize:11}}>✕</button>}
        </div>
      </div>
      <div style={{position:"relative"}}>
        <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.myDeckFilter}{flt.decks.length>0&&<span style={{color:C.accent,marginLeft:4}}>({flt.decks.length})</span>}</div>
        <div onClick={()=>setOpenDeckList(o=>!o)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",cursor:"pointer"}}>
          <span style={{fontSize:13,color:flt.decks.length>0?C.text:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{deckLabel}</span>
          <span style={{color:C.muted,fontSize:11,marginLeft:6,flexShrink:0}}>{openDeckList?"▲":"▼"}</span>
        </div>
        {openDeckList&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1px solid ${C.border}`,borderRadius:8,zIndex:100}}>
          <div style={{padding:"8px 10px",borderBottom:`1px solid ${C.border}`}}>
            <input value={deckSearch} onChange={e=>setDeckSearch(e.target.value)} placeholder={t.searchPlaceholder} autoFocus
              style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,padding:"6px 10px",fontSize:16,boxSizing:"border-box"}}/>
          </div>
          <div style={{maxHeight:180,overflowY:"auto"}}>
            {filteredDecks.length===0?<div style={{padding:"12px 14px",fontSize:13,color:C.muted}}>{t.noDecksRegistered}</div>
            :<>{filteredDecks.map(d=>{const sel=flt.decks.includes(d.id);return <div key={d.id} onMouseDown={()=>toggleArr("decks",d.id)} style={listRow(sel)}>{d.name}</div>;})}
            {!deckSearch&&<div onMouseDown={()=>toggleArr("decks","__no_deck__")} style={listRow(flt.decks.includes("__no_deck__"))}>{t.noData}</div>}</>}
          </div>
        </div>}
      </div>
      <div style={{position:"relative"}}>
        <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.oppDeckFilter}{flt.opponents.length>0&&<span style={{color:C.accent,marginLeft:4}}>({flt.opponents.length})</span>}</div>
        <div onClick={()=>setOpenOppList(o=>!o)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",cursor:"pointer"}}>
          <span style={{fontSize:13,color:flt.opponents.length>0?C.text:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{oppLabel}</span>
          <span style={{color:C.muted,fontSize:11,marginLeft:6,flexShrink:0}}>{openOppList?"▲":"▼"}</span>
        </div>
        {openOppList&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1px solid ${C.border}`,borderRadius:8,zIndex:100}}>
          <div style={{padding:"8px 10px",borderBottom:`1px solid ${C.border}`}}>
            <input value={oppSearch} onChange={e=>setOppSearch(e.target.value)} placeholder={t.searchPlaceholder} autoFocus
              style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,padding:"6px 10px",fontSize:16,boxSizing:"border-box"}}/>
          </div>
          <div style={{maxHeight:180,overflowY:"auto"}}>
            {filteredOpps.length===0?<div style={{padding:"12px 14px",fontSize:13,color:C.muted}}>{t.noOpponents}</div>
            :filteredOpps.map(n=>{const sel=flt.opponents.includes(n);return <div key={n} onMouseDown={()=>toggleArr("opponents",n)} style={listRow(sel)}>{n}</div>;})}
          </div>
        </div>}
      </div>
      {show("matchType")&&<div>
        <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.matchTypeFilter}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {matchTypes.map(tx=><button key={tx} onClick={()=>toggleArr("matchTypes",tx)} style={chip(flt.matchTypes.includes(tx))}>{displayMatchType(tx,lang)}</button>)}
        </div>
      </div>}
      {show("turn")&&<div>
        <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.turnFilter}</div>
        <div style={{display:"flex",gap:5}}>
          {[["first",t.first],["second",t.second],["",t.notSet]].map(([v,l])=>(
            <button key={v} onClick={()=>toggleArr("turns",v)} style={chip(flt.turns.includes(v))}>{l}</button>
          ))}
        </div>
      </div>}
      <div>
        <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.resultFilter}</div>
        <div style={{display:"flex",gap:5}}>
          {[["win",t.win],["lose",t.lose],["draw",t.draw]].map(([v,l])=>(
            <button key={v} onClick={()=>toggleArr("results",v)} style={chip(flt.results.includes(v))}>{l}</button>
          ))}
        </div>
      </div>
      {show("lucky")&&<div>
        <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{t.flagFilter}</div>
        <div style={{display:"flex",gap:5}}>
          <button onClick={()=>setF({lucky:!flt.lucky})} style={chip(flt.lucky)}>{t.lucky}</button>
          <button onClick={()=>setF({unlucky:!flt.unlucky})} style={chip(flt.unlucky)}>{t.unlucky}</button>
        </div>
      </div>}
    </div>
  );
}

// ── BackupSizeInfo ─────────────────────────────────────
function BackupSizeInfo({st, t}) {
  const [idbCount, setIdbCount] = useState((st.deckImages||[]).length);
  useEffect(()=>{ idbGetAll().then(imgs=>setIdbCount(imgs.length)).catch(()=>{}); },[]);
  const toKB = s => s.length < 1024*1024 ? Math.round(s.length/1024)+"KB" : (s.length/1024/1024).toFixed(1)+"MB";
  const jsonNoImg = serializeData(st, false);
  return (
    <div style={{marginTop:10,background:C.surface,borderRadius:8,padding:"10px 12px",fontSize:12,color:C.muted}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span>{t.localStorageSize}</span><span style={{color:C.text}}>{toKB(jsonNoImg)}</span></div>
      <div style={{display:"flex",justifyContent:"space-between"}}><span>{t.imageCount}</span><span style={{color:C.text}}>{idbCount}</span></div>
    </div>
  );
}

// ── MemoryGauge ────────────────────────────────────────
function MemoryGauge({marker,setMarker,onClose,accent,accentDim,t}) {
  const [vp,setVp]=useState({w:window.innerWidth,h:window.innerHeight});
  useEffect(()=>{
    const update=()=>{const vv=window.visualViewport;setVp({w:vv?vv.width:window.innerWidth,h:vv?vv.height:window.innerHeight});};
    update();
    window.addEventListener("resize",update);
    window.visualViewport?.addEventListener("resize",update);
    return()=>{window.removeEventListener("resize",update);window.visualViewport?.removeEventListener("resize",update);};
  },[]);

  const isLandscape=vp.w>vp.h;
  const PIXEL="'Press Start 2P','Courier New',monospace";

  if(isLandscape) return (
    <div style={{position:"fixed",top:0,left:0,width:vp.w,height:vp.h,zIndex:9999,background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <div style={{fontSize:48}}>📱</div>
      <div style={{color:"white",fontFamily:PIXEL,fontSize:14,textAlign:"center",padding:"0 32px",lineHeight:2}}>縦向きでご使用ください</div>
      <button onClick={onClose} style={{marginTop:8,padding:"8px 20px",fontFamily:PIXEL,fontSize:11,background:"transparent",border:"3px solid white",color:"white",cursor:"pointer"}}>CLOSE</button>
    </div>
  );

  const cW=vp.h,cH=vp.w;
  const padH=24,padV=80,gf=0.12;
  const btnFromW=(cW-padH)/(10+8*gf+1.1);
  const btnFromH=(cH-padV)/(2+gf);
  const btnSize=Math.floor(Math.min(btnFromW,btnFromH));
  const gap=Math.floor(btnSize*gf);
  const zeroSize=Math.floor(btnSize*1.15);
  const fontSize=Math.floor(btnSize*0.38);
  const zeroFontSize=Math.floor(zeroSize*0.38);

  const Btn=({value,side})=>{
    const isSelected=marker===value;
    const isInRange=side==="p1"
      ? marker>0 && value>0 && value<=marker
      : marker<0 && value<0 && value>=marker;
    const col=side==="p1"?accent:accentDim;
    const bg=isSelected?col:isInRange?"white":"rgba(255,255,255,0.2)";
    const textColor=isSelected?"white":"#111";
    const rot=side==="p2"?"rotate(180deg)":"none";
    return (
      <div onClick={()=>setMarker(value)} style={{
        width:btnSize,height:btnSize,borderRadius:0,
        background:bg,color:textColor,
        fontFamily:PIXEL,fontWeight:900,fontSize,
        cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
        border:isSelected?`3px solid white`:isInRange?`2px solid rgba(255,255,255,0.8)`:`2px solid rgba(255,255,255,0.3)`,
        flexShrink:0,WebkitTapHighlightColor:"transparent",
        opacity:isInRange||isSelected?1:0.35,
        boxShadow:isSelected?`4px 4px 0 rgba(0,0,0,0.5), 0 0 0 2px white`:"2px 2px 0 rgba(0,0,0,0.4)",
      }}>
        <span style={{transform:rot,display:"block",lineHeight:1}}>{Math.abs(value)}</span>
      </div>
    );
  };

  return (
    <div style={{position:"fixed",top:0,left:0,width:vp.w,height:vp.h,zIndex:9999,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:"#0a0a0a"}}>
      <div style={{width:cW,height:cH,transform:"rotate(90deg)",transformOrigin:"center center",flexShrink:0,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:accent,opacity:0.9}}/>
        <div style={{position:"absolute",inset:0,background:`repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px),repeating-linear-gradient(90deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)`}}/>
        <div style={{position:"absolute",inset:0,background:accentDim,opacity:0.9,clipPath:"polygon(42% 0%, 100% 0%, 100% 100%, 58% 100%)"}}/>
        <div style={{position:"absolute",inset:0,background:`repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px),repeating-linear-gradient(90deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)`,clipPath:"polygon(42% 0%, 100% 0%, 100% 100%, 58% 100%)"}}/>
        <div style={{position:"absolute",inset:0,background:"white",clipPath:"polygon(41% 0%, 43% 0%, 59% 100%, 57% 100%)"}}/>
        <div style={{position:"absolute",top:10,left:10,display:"flex",alignItems:"center",gap:8,zIndex:10}}>
          <div style={{background:"black",border:"3px solid white",padding:"4px 10px",fontWeight:900,fontSize:11,letterSpacing:2,color:"white",fontFamily:PIXEL,boxShadow:"3px 3px 0 rgba(0,0,0,0.5)"}}>P1</div>
          <div onClick={onClose} style={{width:28,height:28,background:"black",border:"3px solid white",color:"white",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:PIXEL,boxShadow:"3px 3px 0 rgba(0,0,0,0.5)",WebkitTapHighlightColor:"transparent"}}>✕</div>
        </div>
        <div style={{position:"absolute",bottom:10,right:10,zIndex:10,transform:"rotate(180deg)"}}>
          <div style={{background:"black",border:"3px solid white",padding:"4px 10px",fontWeight:900,fontSize:11,letterSpacing:2,color:"white",fontFamily:PIXEL,boxShadow:"3px 3px 0 rgba(0,0,0,0.5)"}}>P2</div>
        </div>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:gap}}>
          <div style={{display:"flex",gap:gap,alignItems:"center"}}>
            <div style={{width:btnSize*5+gap*4+zeroSize+gap,flexShrink:0}}/>
            {[-10,-9,-8,-7,-6].map(n=><Btn key={n} value={n} side="p2"/>)}
          </div>
          <div style={{display:"flex",gap:gap,alignItems:"center"}}>
            {[5,4,3,2,1].map(n=><Btn key={n} value={n} side="p1"/>)}
            <div onClick={()=>setMarker(0)} style={{
              width:zeroSize,height:zeroSize,borderRadius:0,
              background:marker===0?"white":"rgba(255,255,255,0.85)",
              border:marker===0?"4px solid white":"2px solid rgba(255,255,255,0.8)",
              color:"#111",fontFamily:PIXEL,fontWeight:900,fontSize:zeroFontSize,
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
              boxShadow:marker===0?"4px 4px 0 rgba(0,0,0,0.5), 0 0 0 3px white":"2px 2px 0 rgba(0,0,0,0.4)",
              WebkitTapHighlightColor:"transparent",
            }}>0</div>
            {[-1,-2,-3,-4,-5].map(n=><Btn key={n} value={n} side="p2"/>)}
          </div>
          <div style={{display:"flex",gap:gap,alignItems:"center"}}>
            {[6,7,8,9,10].map(n=><Btn key={n} value={n} side="p1"/>)}
            <div style={{width:zeroSize+gap+btnSize*5+gap*4,flexShrink:0}}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Utility ────────────────────────────────────────────
function normalizeKana(str) { return str.toLowerCase().replace(/[ァ-ン]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60)); }
function levenshtein(a, b) {
  const m=a.length, n=b.length;
  const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0));
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}

function MatchTypeMergeModal({ matchTypes, matches, lang, onMerge, onCancel, t, displayMatchType }) {
  const allUsedTypes = Array.from(new Set([
    ...matchTypes,
    ...matches.map(m=>m.matchType).filter(Boolean),
  ]));
  return <MergeModal
    allNames={allUsedTypes.map(tx=>displayMatchType(tx,lang))}
    onMerge={(selDisplayed,name)=>{
      const selOriginal=allUsedTypes.filter(tx=>selDisplayed.includes(displayMatchType(tx,lang)));
      onMerge(selOriginal,name);
    }}
    onCancel={onCancel}
    initialSelected={[]}
    t={{...t, mergeOpponents:t.mergeMatchTypes, mergeOppHint:t.mergeMatchTypesHint}}
  />;
}

function DeckRow({ deck, checked, ds, hex, showDeckStats, checkedDecks, setCheckedDecks, setDeckImgPreview, setSt, setDeckDetail, deckImages, t }) {
  const curImg = deckImages.find(i=>i.id===deck.currentImageId);
  return (
    <div style={{display:"flex",alignItems:"stretch",minHeight:56}}>
      <div onClick={()=>setCheckedDecks(prev=>checked?prev.filter(x=>x!==deck.id):[...prev,deck.id])} style={{width:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
        <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${checked?C.accent:C.border}`,background:checked?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
          {checked&&<span style={{color:"#000",fontSize:11,fontWeight:900}}>✓</span>}
        </div>
      </div>
      <div onClick={()=>{if(curImg)setDeckImgPreview({deck,curImg});}} style={{flex:1,display:"flex",alignItems:"center",gap:8,padding:"10px 8px",cursor:curImg?"pointer":"default",minWidth:0}}>
        <DeckDot colors={deck.colors} size={14}/>
        {curImg&&<img src={curImg.imageData} alt="" style={{width:36,height:36,objectFit:"cover",borderRadius:6,flexShrink:0}}/>}
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:800,fontSize:15,color:hex||C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{deck.name}</div>
          {deck.notes&&<div style={{fontSize:11,color:C.muted,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{deck.notes}</div>}
        </div>
        {showDeckStats&&<span style={{fontWeight:900,color:ds.winRate>=50?C.win:C.lose,fontSize:14,flexShrink:0,marginRight:4}}>{ds.total>0?`${ds.winRate}%`:"-"}</span>}
      </div>
      <div onClick={e=>{e.stopPropagation();setSt(s=>({...s,decks:s.decks.map(d=>d.id===deck.id?{...d,isActive:!d.isActive}:d)}));}} style={{width:48,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,gap:3}}>
        <div style={{width:32,height:18,borderRadius:9,background:deck.isActive?C.accent:C.border,position:"relative",transition:"background 0.2s"}}>
          <div style={{position:"absolute",top:2,left:deck.isActive?14:2,width:14,height:14,borderRadius:"50%",background:"white",transition:"left 0.2s"}}/>
        </div>
        <span style={{fontSize:9,color:deck.isActive?C.accent:C.muted}}>{t.activeSwitch}</span>
      </div>
      <div onClick={e=>{e.stopPropagation();setDeckDetail(deck);}} style={{width:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,color:C.muted,fontSize:18}}>›</div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────
export default function App() {
  // ── Language state ────────────────────────────────
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || "ja");
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ja;
  const changeLang = (newLang) => { setLang(newLang); localStorage.setItem(LANG_KEY, newLang); };

  const DEFAULT_MATCH_TYPES = lang === "en" ? DEFAULT_MATCH_TYPES_EN : DEFAULT_MATCH_TYPES_JA;

  // ── App state ─────────────────────────────────────
  const [st, setSt] = useState(load);
  const [idbLoading, setIdbLoading] = useState(true);
  const [tab, setTab] = useState(()=>{ try{const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}"); return d.uiPrefs?.tab||"matches";}catch{return "matches";} });
  const switchTab = tx => { setTab(tx); setDisplayCount(20); };
  const [screen, setScreen] = useState(null);
  const [showAddDeck, setShowAddDeck] = useState(false);
  const [showMerge, setShowMerge] = useState(false);
  const [mergeInitial, setMergeInitial] = useState([]);
  const [newDeck, setNewDeck] = useState({name:"",colors:[],notes:"",url:"",image:"",parentId:"",maxImages:10});
  const [flt, setFlt] = useState({ decks:[], opponents:[], opponentPersons:[], matchTypes:[], periodPreset:"all", dateFrom:"", dateTo:"", turns:[], results:[], lucky:false, unlucky:false });
  const [importResult, setImportResult] = useState(null);
  const [deckDetail, setDeckDetail] = useState(null);
  const [deckView, setDeckView] = useState(()=>{ try{const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}"); return d.uiPrefs?.deckView||"mine";}catch{return "mine";} });
  const [showSimilar, setShowSimilar] = useState(false);
  const [matchDetail, setMatchDetail] = useState(null);
  const [carryOver, setCarryOver] = useState(true);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSelected, setBulkSelected] = useState([]);
  const [backupMode, setBackupMode] = useState(null);
  const [backupText, setBackupText] = useState("");
  const [restoreText, setRestoreText] = useState("");
  const [showDeckStats, setShowDeckStats] = useState(()=>{ try{const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}"); return d.uiPrefs?.showDeckStats!==false;}catch{return true;} });
  const [filterBarOpen, setFilterBarOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);
  const [showLife, setShowLife] = useState(false);
  const [marker, setMarker] = useState(0);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOppTarget, setDeleteOppTarget] = useState(null);
  const [deleteDeckTarget, setDeleteDeckTarget] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 1000); };
  const [showNotes, setShowNotes] = useState(()=>{ try{const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}"); return d.uiPrefs?.showNotes!==false;}catch{return true;} });
  const [checkedOpps, setCheckedOpps] = useState([]);
  const [checkedDecks, setCheckedDecks] = useState([]);
  const [showAddOpp, setShowAddOpp] = useState(false);
  const [showMergeDeck, setShowMergeDeck] = useState(false);
  const [showMergeMatchType, setShowMergeMatchType] = useState(false);
  const [deckSearch, setDeckSearch] = useState("");
  const [deckSort, setDeckSort] = useState("recent");
  const [deckImgPreview, setDeckImgPreview] = useState(null);
  const [oppSort, setOppSort] = useState("name");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [newOppName, setNewOppName] = useState("");
  const [statVis, setStatVis] = useState(()=>{ try{const p=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}"); return p.uiPrefs?.statVis||{};}catch{return {};} });
  const [deleteConfirmType, setDeleteConfirmType] = useState(null);
  const setF = patch => { setFlt(f=>({...f,...patch})); setDisplayCount(20); };
  const resetFilters = () => setFlt({ decks:[], opponents:[], opponentPersons:[], matchTypes:[], periodPreset:"all", dateFrom:"", dateTo:"", turns:[], results:[], lucky:false, unlucky:false });

  useEffect(()=>{ save(st); }, [st]);
  useEffect(()=>{
    idbGetAll().then(imgs=>{ if(imgs.length>0) setSt(s=>({...s,deckImages:imgs})); }).catch(()=>{}).finally(()=>setIdbLoading(false));
  },[]);
  useEffect(()=>{
    try{
      const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
      d.uiPrefs={tab,deckView,showDeckStats,showNotes,statVis};
      localStorage.setItem(STORAGE_KEY,JSON.stringify(d));
    }catch{}
  },[tab,deckView,showDeckStats,showNotes,statVis]);
  useEffect(()=>{ if(showAddDeck){document.body.style.overflow="hidden";}else{document.body.style.overflow="";} return()=>{document.body.style.overflow="";}; },[showAddDeck]);

  const _theme = getTheme(st.theme||'blue');
  if (_theme) Object.keys(_theme).forEach(k => { globalC[k] = _theme[k]; });

  const allOpponentNames = Array.from(new Set([...(st.opponentNames||[]), ...st.matches.map(m=>m.opponent).filter(Boolean)]));
  const matchTypes = st.matchTypes || [...DEFAULT_MATCH_TYPES_JA];

  const makeNew = () => {
    const base = { turn:"", result:"", endTurn:null, lucky:false, unlucky:false, notes:"", image:"", deckImage:"", deckUrl:"", matchType:"", opponentPerson:"", opponent:"", deckId:"", deckName:"", date:new Date().toISOString().slice(0,10) };
    return { ...base, deckId:carryOver?(st.prefs.lastDeckId||st.decks[0]?.id||""):(st.decks[0]?.id||""), opponent:carryOver?(st.prefs.lastOpponent||""):"", matchType:carryOver?(st.prefs.lastMatchType||""):"" };
  };
  const makeNewBattle = (lastForm) => ({ deckId:lastForm.deckId, opponent:lastForm.opponent, matchType:lastForm.matchType, turn:"", result:"", endTurn:null, lucky:false, unlucky:false, notes:"", image:"", deckImage:"", deckUrl:"", opponentPerson:"", deckName:"", date:new Date().toISOString().slice(0,10) });
  const openAdd = (continueFrom=null, sc=0) => { setDeleteTarget(null); const base=makeNew(); setScreen({ mode:"add", form:continueFrom||base, seriesCount:sc }); };
  const openEdit = match => {
    setDeleteTarget(null);
    setScreen({ mode:"edit", form:{
      deckId: match.deckId, opponent: match.opponent, matchType: match.matchType||"",
      turn: match.turn||"", result: match.result, endTurn: match.endTurn??null,
      lucky: match.lucky||false, unlucky: match.unlucky||false,
      notes: (match.notes&&match.notes!=="null")?match.notes:"",
      image: match.image||"", deckImage: match.deckImage||(st.deckImages||[]).find(i=>i.id===(match.imageId||st.decks.find(d=>d.id===match.deckId)?.currentImageId))?.imageData||"",
      deckUrl: match.deckUrl||"", opponentPerson: match.opponentPerson||"",
      date: match.date, _id: match.id, deckName:"",
    }});
  };

  const saveMatch = form => {
    const deckName = form.deckName || (form.deckId ? (st.decks?.find(d=>d.id===form.deckId)?.name||"") : "");
    if ((!form.deckId && !deckName) || !form.opponent.trim()) return;
    setSt(s => {
      let deckImages = [...(s.deckImages || [])];
      let decks = s.decks;
      let imageId = form.imageId || null;
      let deckId = form.deckId;
      const _deckName = form.deckName || "";
      if (!deckId && _deckName) {
        const existing = s.decks.find(d => d.name === _deckName);
        if (existing) { deckId = existing.id; }
        else { deckId = genId(); decks = [...s.decks, {id:deckId, name:_deckName, colors:[], notes:"", url:"", maxImages:10, createdAt:new Date().toISOString()}]; }
      }
      if (form.deckImage) {
        const { newImgs, newImgId } = addDeckImage(deckImages, decks, deckId, form.deckImage);
        const newImg = newImgs.find(i=>i.id===newImgId);
        if(newImg) idbPut(newImg).catch(()=>{});
        deckImages = newImgs; imageId = newImgId;
        const deckMatches = s.matches.filter(m => m.deckId === deckId && m.id !== form._id);
        const isLatest = deckMatches.every(m => m.date <= form.date);
        if (isLatest) { decks = decks.map(d => d.id===deckId ? {...d, currentImageId:newImgId} : d); }
      } else if (!imageId) {
        // デッキ画像未登録の場合、その時点のcurrentImageIdを固定でセット
        const currentDeck = decks.find(d => d.id === deckId);
        if (currentDeck?.currentImageId) imageId = currentDeck.currentImageId;
      }
      const opponentNames = Array.from(new Set([...(s.opponentNames||[]), form.opponent]));
      const prefs = {...s.prefs, lastDeckId:deckId, lastOpponent:form.opponent, lastMatchType:form.matchType};
      if (screen.mode==="add") {
        const match = { id:Date.now().toString(), ...form, deckId, imageId, deckImage:undefined, createdAt:new Date().toISOString() };
        return { ...s, decks, deckImages, matches:[...s.matches, match], opponentNames, prefs };
      } else {
        const matches = s.matches.map(m => m.id===form._id ? {...m, ...form, deckId, imageId, deckImage:undefined} : m);
        return { ...s, decks, deckImages, matches, opponentNames, prefs };
      }
    });
    showToast(t.saved); setScreen(null); setMatchDetail(null); setDeleteTarget(null);
  };

  const addMatchType = tx => setSt(s=>({...s, matchTypes:[...(s.matchTypes||DEFAULT_MATCH_TYPES_JA), tx]}));
  const deleteMatchType = tx => setSt(s=>({...s, matchTypes:(s.matchTypes||DEFAULT_MATCH_TYPES_JA).filter(x=>x!==tx)}));
  const moveMatchType = (tx, dir) => setSt(s=>{
    const arr=[...(s.matchTypes||DEFAULT_MATCH_TYPES_JA)];
    const i=arr.indexOf(tx); if(i<0) return s;
    const j=i+dir; if(j<0||j>=arr.length) return s;
    [arr[i],arr[j]]=[arr[j],arr[i]];
    return {...s,matchTypes:arr};
  });
  const addDeck = () => { if (!newDeck.name.trim()) return; const deck={id:Date.now().toString(),createdAt:new Date().toISOString(),...newDeck}; setSt(s=>({...s,decks:[...s.decks,deck]})); setNewDeck({name:"",colors:[],notes:"",url:"",image:"",parentId:"",maxImages:10}); setShowAddDeck(false); };
  const deleteDeck = id => setSt(s=>({...s,decks:s.decks.filter(x=>x.id!==id)}));
  const deleteMatch = id => setSt(s=>({...s,matches:s.matches.filter(m=>m.id!==id)}));
  const handleMerge = (sel,name) => { setSt(s=>({...s, matches:s.matches.map(m=>sel.includes(m.opponent)?{...m,opponent:name}:m), opponentNames:Array.from(new Set([...s.opponentNames.filter(n=>!sel.includes(n)),name]))})); setShowMerge(false); setCheckedOpps([]); };
  const handleMergeMatchTypes = (sel, name) => {
    setSt(s=>({
      ...s,
      matches: s.matches.map(m => sel.includes(m.matchType) ? {...m, matchType:name} : m),
      matchTypes: [...Array.from(new Set([...(s.matchTypes||[]).filter(t=>!sel.includes(t)), name]))],
    }));
    setShowMergeMatchType(false);
  };
  const handleMergeDecks = (selIds, name, baseId) => {
    setSt(s=>{
      const baseDeck=s.decks.find(d=>d.id===baseId);
      const maxImages=baseDeck?.maxImages??10;
      let newDeckImages=[...(s.deckImages||[])].map(i=>selIds.includes(i.deckId)?{...i,deckId:baseId}:i);
      if(maxImages>0){
        const baseImgs=newDeckImages.filter(i=>i.deckId===baseId).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
        if(baseImgs.length>maxImages){
          const toDelete=new Set(baseImgs.slice(0,baseImgs.length-maxImages).map(i=>i.id));
          newDeckImages=newDeckImages.filter(i=>!toDelete.has(i.id));
        }
      }
      const newDecks=s.decks.filter(d=>d.id===baseId||!selIds.includes(d.id)).map(d=>d.id===baseId?{...d,name}:d);
      const newMatches=s.matches.map(m=>selIds.includes(m.deckId)?{...m,deckId:baseId}:m);
      return{...s,decks:newDecks,matches:newMatches,deckImages:newDeckImages};
    });
    setCheckedDecks([]); setShowMergeDeck(false);
  };

  const importCSV = (text) => {
    const lines = text.split("\n").map(l=>l.endsWith("\r")?l.slice(0,-1):l).filter(l=>l.trim());
    if (lines.length < 2) return;
    const headers = lines[0].split(",");
    const idx = name => headers.indexOf(name);
    let imported=0, skipped=0, autoCreated=0;
    const newOpponents=new Set(), newMatches=[], newDecks=[], createdDeckMap={};
    lines.slice(1).forEach(line => {
      const cols=line.split(",");
      const get=name=>{const i=idx(name);if(i<0||i>=cols.length)return"";return cols[i].trim().replace(/^"|"$/g,"");};
      const myDeckName=get("使用デッキ"), opponent=get("対戦相手デッキ"), dateRaw=get("日付");
      if(!myDeckName||!opponent||!dateRaw){skipped++;return;}
      let deck=st.decks.find(d=>d.name===myDeckName);
      if(!deck&&createdDeckMap[myDeckName]) deck={id:createdDeckMap[myDeckName]};
      if(!deck){const newId="deck_imp_"+Date.now()+"_"+autoCreated;createdDeckMap[myDeckName]=newId;newDecks.push({id:newId,name:myDeckName,colors:[],notes:"",url:"",maxImages:10,createdAt:new Date().toISOString()});deck={id:newId};autoCreated++;}
      const turn=get("先攻・後攻")==="first"?"first":get("先攻・後攻")==="second"?"second":"";
      const resultRaw=get("勝敗"); const result=resultRaw==="win"?"win":resultRaw==="loss"?"lose":resultRaw==="draw"?"draw":"";
      newOpponents.add(opponent);
      newMatches.push({id:"imp_"+Date.now()+"_"+imported,deckId:deck.id,opponent,turn,result,date:dateRaw,matchType:get("対戦種類"),notes:get("メモ"),createdAt:new Date().toISOString()});
      imported++;
    });
    setSt(s=>({...s,decks:[...s.decks,...newDecks],matches:[...s.matches,...newMatches],opponentNames:Array.from(new Set([...s.opponentNames,...Array.from(newOpponents)]))}));
    setImportResult({imported,skipped,autoCreated});
  };

  const doRestore = () => { const d=parseData(restoreText); if(d){setSt(d);setBackupMode(null);}else{alert(lang==="en"?"Invalid file.":"ファイルが正しくありません。");} };

  const sortedDecksForEntry = [...st.decks].sort((a,b)=>{
    const now=Date.now(), score=id=>st.matches.reduce((s,m)=>{if(m.deckId!==id)return s;const age=(now-new Date(m.createdAt))/86400000;return s+Math.exp(-age/30);},0);
    return score(b.id)-score(a.id);
  });
  const entryScrollRef = useRef(null);
  useEffect(()=>{ if(screen){setTimeout(()=>{if(entryScrollRef.current)entryScrollRef.current.scrollTop=0;},0);}}, [screen]);

  useEffect(()=>{
    const style=document.createElement("style");
    style.textContent="@keyframes pulse{0%,100%{transform:scale(1);opacity:0.4}50%{transform:scale(1.4);opacity:1}}";
    document.head.appendChild(style);
    return()=>{document.head.removeChild(style);};
  },[]);

  // ── Computed values ───────────────────────────────
  const getDeck = id => st.decks.find(d=>d.id===id);
  const applyFilters = matches => {
    const now=new Date();
    return matches.filter(m=>{
      if(flt.decks.length>0){ const hasNoDeck=flt.decks.includes("__no_deck__"); const deckIds=flt.decks.filter(x=>x!=="__no_deck__"); if(!(deckIds.includes(m.deckId)||(hasNoDeck&&!m.deckId))) return false; }
      if(flt.opponents.length>0&&!flt.opponents.includes(m.opponent)) return false;
      if(flt.matchTypes.length>0&&!flt.matchTypes.includes(m.matchType||"")) return false;
      if(flt.periodPreset!=="all"&&flt.periodPreset!=="custom"){
        const d=new Date(m.date);
        if(flt.periodPreset==="today"&&d.toDateString()!==now.toDateString()) return false;
        if(flt.periodPreset==="week"){const ago=new Date(now);ago.setDate(now.getDate()-7);if(d<ago) return false;}
        if(flt.periodPreset==="month"&&(d.getFullYear()!==now.getFullYear()||d.getMonth()!==now.getMonth())) return false;
        if(flt.periodPreset==="year"&&d.getFullYear()!==now.getFullYear()) return false;
      }
      if(flt.dateFrom&&m.date<flt.dateFrom) return false;
      if(flt.dateTo&&m.date>flt.dateTo) return false;
      if(flt.opponentPersons&&flt.opponentPersons.length>0&&!flt.opponentPersons.includes(m.opponentPerson||"")) return false;
      if(flt.turns.length>0&&!flt.turns.includes(m.turn||"")) return false;
      if(flt.results.length>0&&!flt.results.includes(m.result||"")) return false;
      if(flt.lucky&&!m.lucky) return false;
      if(flt.unlucky&&!m.unlucky) return false;
      return true;
    });
  };
  const activeFilters = flt.decks.length+flt.opponents.length+(flt.opponentPersons||[]).length+flt.matchTypes.length+(flt.periodPreset!=="all"?1:0)+((flt.dateFrom||flt.dateTo)?1:0)+flt.turns.length+flt.results.length+(flt.lucky?1:0)+(flt.unlucky?1:0);
  const filtered = applyFilters(st.matches);
  const sorted = [...filtered].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  const wins=filtered.filter(m=>m.result==="win").length, loses=filtered.filter(m=>m.result==="lose").length, draws=filtered.filter(m=>m.result==="draw").length, total=filtered.length;
  const wr=total>0?Math.round(wins/total*100):0;
  const fm=filtered.filter(m=>m.turn==="first"), sm=filtered.filter(m=>m.turn==="second");
  const fwr=fm.length>0?Math.round(fm.filter(m=>m.result==="win").length/fm.length*100):null;
  const swr=sm.length>0?Math.round(sm.filter(m=>m.result==="win").length/sm.length*100):null;
  const deckStats=st.decks.map(deck=>{
    const ms=filtered.filter(m=>m.deckId===deck.id);
    const w=ms.filter(m=>m.result==="win").length,l=ms.filter(m=>m.result==="lose").length,dr=ms.length-w-l;
    return {...deck,total:ms.length,wins:w,loses:l,draws:dr,winRate:ms.length>0?Math.round(w/ms.length*100):0};
  });
  const opponentStats=Array.from(new Set(filtered.map(m=>m.opponent).filter(Boolean))).sort().map(name=>{
    const ms=filtered.filter(m=>m.opponent===name);
    const w=ms.filter(m=>m.result==="win").length,l=ms.filter(m=>m.result==="lose").length,dr=ms.length-w-l;
    return {name,total:ms.length,wins:w,loses:l,draws:dr,winRate:ms.length>0?Math.round(w/ms.length*100):0};
  });
  const toggleBulkSelect = id => setBulkSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const executeBulkDelete = () => { setSt(s=>({...s,matches:s.matches.filter(m=>!bulkSelected.includes(m.id))})); setBulkSelected([]); setBulkMode(false); };
  const cancelBulkMode = () => { setBulkMode(false); setBulkSelected([]); };
  const inputStyle={background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,padding:"10px 12px",fontSize:14,width:"100%",boxSizing:"border-box"};
  const STAT_SECTIONS = [
    ["overall",t.statOverall], ["winTrend",t.statWinTrend], ["turns",t.statTurns],
    ["deckBar",t.statDeckBar], ["deckPie",t.statDeckPie],
    ["oppBar",t.statOppBar], ["oppPie",t.statOppPie],
  ];

  const getSortedDecks = () => {
    const now=Date.now();
    const score=id=>st.matches.reduce((s,m)=>{if(m.deckId!==id)return s;const age=(now-new Date(m.createdAt))/86400000;return s+Math.exp(-age/30);},0);
    return [...st.decks]
      .filter(d=>(!deckSearch||d.name.toLowerCase().includes(deckSearch.toLowerCase()))&&(!showActiveOnly||d.isActive))
      .sort((a,b)=>{
        if(deckSort==="recent") return score(b.id)-score(a.id);
        if(deckSort==="newest") return new Date(b.createdAt)-new Date(a.createdAt);
        if(deckSort==="name") return a.name.localeCompare(b.name,"ja");
        if(deckSort==="winrate"){const da=deckStats.find(d=>d.id===a.id);const db=deckStats.find(d=>d.id===b.id);return (db?.winRate||0)-(da?.winRate||0);}
        return 0;
      });
  };

  if (idbLoading) return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <div style={{fontSize:40}}>🌐</div>
      <div style={{fontWeight:900,fontSize:18,background:`linear-gradient(90deg,${C.accent},#ffffff)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>DegiLog</div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{width:8,height:8,borderRadius:"50%",background:C.accent,animation:`pulse 1.2s ${i*0.2}s infinite`}}/>
        ))}
      </div>
      <div style={{fontSize:12,color:C.muted}}>{t.loading}</div>
    </div>
  );

  if (screen) return (
    <div>
      <MatchEntry initial={screen.form} onSave={saveMatch} onCancel={()=>{setScreen(null);setDeleteTarget(null);}}
        decks={sortedDecksForEntry} opponentNames={allOpponentNames} opponents={st.opponents||[]}
        matchTypes={matchTypes} onAddMatchType={addMatchType} onDeleteMatchType={deleteMatchType}
        isEdit={screen.mode==="edit"}
        onDelete={screen.mode==="edit"?()=>{setDeleteTarget(screen.form._id);}:undefined}
        formFields={st.formFields||{}}
        carryOver={carryOver} onToggleCarryOver={next=>setCarryOver(next)}
        onToggleField={key=>setSt(s=>{const ff=s.formFields||{};const cur=ff[key]!==false;return{...s,formFields:{...ff,[key]:!cur}};})}
        onContinue={form=>{const next=(screen.seriesCount||0)+1;saveMatch(form);showToast(t.saved);setTimeout(()=>openAdd(makeNewBattle(form),next),50);}}
        seriesCount={screen.seriesCount||0}
        scrollRef={entryScrollRef}
        t={t}
        lang={lang}
      />
      {toast&&<div style={{position:"fixed",top:16,right:16,zIndex:9999,background:C.accent,color:"#000",borderRadius:8,padding:"8px 16px",fontWeight:700,fontSize:13}}>✓ {toast}</div>}
      {deleteTarget&&(
        <div style={{position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:20}}>
          <div style={{background:C.card,borderRadius:16,padding:24,width:"100%",maxWidth:400}}>
            <div style={{fontSize:17,fontWeight:900,color:"#ff4444",marginBottom:12,textAlign:"center"}}>{t.deleteMatchTitle}</div>
            <div style={{fontSize:13,color:C.muted,marginBottom:20,textAlign:"center",lineHeight:1.6}}>{t.deleteMatchHint}</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDeleteTarget(null)} style={{flex:1,padding:"12px 0",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer"}}>{t.confirmCancel}</button>
              <button onClick={()=>{deleteMatch(deleteTarget);setDeleteTarget(null);setScreen(null);}} style={{flex:2,padding:"12px 0",borderRadius:10,border:"none",background:"#ff4444",color:"#fff",cursor:"pointer",fontWeight:700}}>{t.confirmDelete}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"Noto Sans JP,Hiragino Sans,sans-serif"}}>
      {/* HEADER */}
      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"14px 20px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{fontSize:22}}>🌐</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:900,fontSize:20,letterSpacing:1,background:`linear-gradient(90deg,${C.accent},#ffffff)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>DigiLog</div>
        </div>
        <button onClick={()=>setShowLife(v=>!v)} style={{background:showLife?C.accent+"33":"transparent",border:`1px solid ${showLife?C.accent:C.border}`,borderRadius:8,color:showLife?C.accent:C.muted,padding:"6px 10px",cursor:"pointer",fontSize:12}}>
          {t.memoryGauge}
        </button>
      </div>

      {/* TABS */}
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.card}}>
        {[["matches",t.tabMatches],["decks",t.tabDecks],["stats",t.tabStats],["settings",t.tabSettings]].map(([k,label])=>(
          <button key={k} onClick={()=>switchTab(k)} style={{flex:1,padding:"13px 0",border:"none",background:"transparent",color:tab===k?C.accent:C.muted,fontWeight:tab===k?800:400,fontSize:12,cursor:"pointer",borderBottom:tab===k?`2px solid ${C.accent}`:"2px solid transparent"}}>{label}</button>
        ))}
      </div>

      <div style={{padding:14,maxWidth:600,margin:"0 auto"}}>

        {/* ════ MATCHES TAB ════ */}
        {tab==="matches"&&(
          <div>
            <div style={{marginBottom:8}}>
              <button onClick={bulkMode?null:()=>openAdd()} style={{width:"100%",background:bulkMode?"#333":`linear-gradient(135deg,${C.accent},${C.accentDim})`,color:bulkMode?C.muted:"#000",border:"none",borderRadius:10,padding:"14px 0",cursor:bulkMode?"not-allowed":"pointer",fontWeight:800,fontSize:15}}>{t.addRecord}</button>
            </div>
            <div style={{marginBottom:8}}>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                <FilterBarTop activeFilters={activeFilters} open={filterBarOpen} setOpen={setFilterBarOpen} onReset={resetFilters} t={t}/>
                {bulkMode?(
                  <>
                    <button onClick={cancelBulkMode} style={{height:36,padding:"0 10px",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:12}}>{t.cancelBulk}</button>
                    <button onClick={executeBulkDelete} disabled={bulkSelected.length===0} style={{height:36,padding:"0 10px",borderRadius:8,border:"none",background:bulkSelected.length>0?"#ff4444":"#333",color:"#fff",cursor:bulkSelected.length>0?"pointer":"not-allowed",fontSize:12,fontWeight:700}}>{t.bulkDelete}{bulkSelected.length>0?` (${bulkSelected.length})`:""}</button>
                  </>
                ):(
                  <>
                    <button onClick={()=>setShowNotes(n=>!n)} style={{height:36,padding:"0 10px",borderRadius:8,border:`1px solid ${showNotes?C.accent:C.border}`,background:showNotes?C.accent+"22":"transparent",color:showNotes?C.accent:C.muted,cursor:"pointer",fontSize:12}}>{t.showNotes}</button>
                    <button onClick={()=>{setBulkMode(true);setBulkSelected([]);}} style={{height:36,padding:"0 10px",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:12}}>{t.bulkSelect}</button>
                  </>
                )}
              </div>
              {filterBarOpen&&<FilterBarPanel decks={st.decks} allOpponentNames={allOpponentNames} opponents={st.opponents||[]} matchTypes={matchTypes} flt={flt} setF={setF} inputStyle={inputStyle} t={t} lang={lang} formFields={st.formFields||{}} />}
            </div>
            {sorted.length===0?(
              <div style={{textAlign:"center",padding:"40px 20px",color:C.muted}}>
                <div style={{fontSize:40,marginBottom:12}}>📋</div>
                <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>{t.noRecords}</div>
                <div style={{fontSize:13}}>{t.noRecordsHint}</div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {sorted.slice(0,displayCount).map(m=>{
                  const deck=getDeck(m.deckId); const deckMissing=m.deckId&&!deck;
                  const hex=deck?firstHex(deck.colors):null;
                  return (
                    <div key={m.id} onClick={()=>bulkMode?toggleBulkSelect(m.id):setMatchDetail(m)}
                      style={{background:C.card,border:`1.5px solid ${bulkMode&&bulkSelected.includes(m.id)?C.accent:C.border}`,borderRadius:10,padding:"12px 14px",cursor:"pointer"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                        <WinBadge result={m.result} t={t}/>
                        <TurnBadge turn={m.turn} t={t}/>
                        <span style={{fontWeight:800,fontSize:15,flex:1,color:C.text}}>vs {m.opponent}</span>
                        {bulkMode?(
                          <div style={{width:22,height:22,borderRadius:4,border:`2px solid ${bulkSelected.includes(m.id)?C.accent:C.border}`,background:bulkSelected.includes(m.id)?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                            {bulkSelected.includes(m.id)&&<span style={{color:"#000",fontSize:13,fontWeight:900}}>✓</span>}
                          </div>
                        ):(
                          <button onClick={e=>{e.stopPropagation();openEdit(m);}} style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:12}}>✏️</button>
                        )}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,marginTop:2}}>
                        {getMatchImage(m,st.deckImages||[],deck)&&<img src={getMatchImage(m,st.deckImages||[],deck)} alt="" style={{width:28,height:28,objectFit:"cover",borderRadius:4,flexShrink:0}}/>}
                        {deck&&<span style={{display:"flex",alignItems:"center",gap:4,color:hex||C.text,fontWeight:600}}><DeckDot colors={deck.colors} size={10}/>{deck.name}</span>}
                        {deckMissing&&<span style={{color:C.muted,fontSize:11}}>?</span>}
                        {m.matchType&&<span style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:4,padding:"1px 6px",color:C.muted,fontSize:11}}>{displayMatchType(m.matchType,lang)}</span>}
                        <span style={{color:C.muted,fontSize:11,marginLeft:"auto"}}>{m.date}</span>
                      </div>
                      {m.notes&&showNotes&&(
                        <div style={{fontSize:13,color:C.text,lineHeight:1.6,padding:"8px 10px",marginTop:6,background:C.surface,borderRadius:6}}>{m.notes}</div>
                      )}
                    </div>
                  );
                })}
                {sorted.length>displayCount&&(
                  <button onClick={()=>setDisplayCount(n=>n+20)} style={{width:"100%",padding:"12px 0",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.accent,cursor:"pointer",fontSize:13}}>
                    {t.loadMore(sorted.length-displayCount)}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════ DECKS TAB ════ */}
        {tab==="decks"&&(
          <div>
            <div style={{position:"sticky",top:0,zIndex:50,background:C.bg,paddingBottom:8}}>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                {[["mine",t.myDecks],["opponents",t.oppDecks]].map(([v,l])=>(
                  <button key={v} onClick={()=>setDeckView(v)} style={{flex:1,padding:"9px 0",borderRadius:8,border:`1px solid ${deckView===v?C.accent:C.border}`,background:deckView===v?C.accent+"22":"transparent",color:deckView===v?C.accent:C.muted,cursor:"pointer",fontWeight:deckView===v?700:400,fontSize:13}}>{l}</button>
                ))}
              </div>
              {deckView==="mine"&&!showAddDeck&&(
                <button onClick={()=>setShowAddDeck(true)} style={{width:"100%",background:`linear-gradient(135deg,${C.accent},${C.accentDim})`,color:"#000",border:"none",borderRadius:10,padding:"12px 0",cursor:"pointer",fontWeight:800,fontSize:14,marginBottom:8}}>{t.addDeck}</button>
              )}
              {deckView==="opponents"&&(
                <button onClick={()=>{setShowAddOpp(a=>!a);setNewOppName("");}} style={{width:"100%",background:showAddOpp?"transparent":`linear-gradient(135deg,${C.accent},${C.accentDim})`,color:showAddOpp?C.muted:"#000",border:showAddOpp?`1px solid ${C.border}`:"none",borderRadius:10,padding:"12px 0",cursor:"pointer",fontWeight:700,fontSize:14,marginBottom:8}}>
                  {showAddOpp?t.cancelAddOpp:t.addOpp}
                </button>
              )}
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                <span style={{fontSize:13,color:C.muted,flex:1}}>{deckView==="mine"?t.deckCount(st.decks.length):t.deckCount(allOpponentNames.length)}</span>
                {deckView==="mine"&&(
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>setShowActiveOnly(v=>!v)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${showActiveOnly?C.accent:C.border}`,background:showActiveOnly?C.accent+"22":"transparent",color:showActiveOnly?C.accent:C.muted,cursor:"pointer",fontSize:12}}>{t.activeOnly}</button>
                    <button disabled={checkedDecks.length<2} onClick={()=>{if(checkedDecks.length>=2)setShowMergeDeck(true);}} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${checkedDecks.length>=2?C.accent:C.border}`,background:checkedDecks.length>=2?C.accent+"22":"transparent",color:checkedDecks.length>=2?C.accent:C.muted,cursor:checkedDecks.length>=2?"pointer":"not-allowed",fontSize:12}}>{t.merge}</button>
                  </div>
                )}
                {deckView==="opponents"&&(
                  <button disabled={checkedOpps.length<2} onClick={()=>{if(checkedOpps.length>=2){setMergeInitial(checkedOpps);setShowMerge(true);}}} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${checkedOpps.length>=2?C.accent:C.border}`,background:checkedOpps.length>=2?C.accent+"22":"transparent",color:checkedOpps.length>=2?C.accent:C.muted,cursor:checkedOpps.length>=2?"pointer":"not-allowed",fontSize:12}}>{t.merge}</button>
                )}
                <button onClick={()=>setShowDeckStats(s=>!s)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${showDeckStats?C.accent:C.border}`,background:showDeckStats?C.accent+"22":"transparent",color:showDeckStats?C.accent:C.muted,cursor:"pointer",fontSize:12}}>{t.statsToggle}</button>
              </div>
              <div style={{display:"flex",gap:6,marginTop:8,alignItems:"center"}}>
                {deckView==="mine"&&<select value={deckSort} onChange={e=>setDeckSort(e.target.value)} style={{...inputStyle,flex:"none",width:"auto",padding:"6px 10px",fontSize:12}}>
                  <option value="recent">{t.sortRecent}</option>
                  <option value="newest">{t.sortNewest}</option>
                  <option value="name">{t.sortName}</option>
                  <option value="winrate">{t.sortWinRate}</option>
                </select>}
                {deckView==="opponents"&&<select value={oppSort} onChange={e=>setOppSort(e.target.value)} style={{...inputStyle,flex:"none",width:"auto",padding:"6px 10px",fontSize:12}}>
                  <option value="name">{t.sortName}</option>
                  <option value="most">{t.sortMost}</option>
                  <option value="winrate">{t.sortWinRate}</option>
                  <option value="recent">{t.sortRecentBattle}</option>
                </select>}
                <div style={{position:"relative",flex:1}}>
                  <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:14}}>🔍</span>
                  <input value={deckSearch} onChange={e=>setDeckSearch(e.target.value)} placeholder={t.searchPlaceholder} style={{...inputStyle,paddingLeft:32,margin:0}}/>
                  {deckSearch&&<button onClick={()=>setDeckSearch("")} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>✕</button>}
                </div>
              </div>
            </div>

            {/* Add Deck Modal */}
            {showAddDeck&&(
              <div style={{position:"fixed",inset:0,background:"#000b",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
                <div style={{background:C.card,borderRadius:16,width:"100%",maxWidth:480,padding:20}}>
                  <div style={{fontWeight:800,fontSize:15,marginBottom:16}}>{t.addDeck}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <div><div style={{fontSize:11,color:C.muted,marginBottom:5}}>{t.deckNameRequired}</div><input value={newDeck.name} onChange={e=>setNewDeck(d=>({...d,name:e.target.value}))} style={inputStyle}/></div>
                    <div><div style={{fontSize:11,color:C.muted,marginBottom:5}}>{t.colorLabel}</div><ColorPicker colors={newDeck.colors} onChange={v=>setNewDeck(d=>({...d,colors:v}))} lang={lang}/></div>
                    <div><div style={{fontSize:11,color:C.muted,marginBottom:5}}>{t.memoLabel}</div><textarea value={newDeck.notes} onChange={e=>setNewDeck(d=>({...d,notes:e.target.value}))} style={{...inputStyle,minHeight:60,resize:"vertical"}}/></div>
                    <button onClick={addDeck} style={{background:`linear-gradient(135deg,${C.accent},${C.accentDim})`,color:"#000",border:"none",borderRadius:8,padding:"12px 0",cursor:"pointer",fontWeight:800,fontSize:14}}>{t.addButton}</button>
                    <button onClick={()=>{setShowAddDeck(false);setNewDeck({name:"",colors:[],notes:"",url:"",image:"",parentId:"",maxImages:10});}} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,padding:"10px 0",cursor:"pointer"}}>{t.cancel}</button>
                  </div>
                </div>
              </div>
            )}

            {/* My Decks List */}
            {deckView==="mine"&&(
              <div>
                {st.decks.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:C.muted}}>{t.noDeckRegistered}</div>}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {getSortedDecks().map(deck=>{
                    const ds=deckStats.find(d=>d.id===deck.id)||{total:0,wins:0,loses:0,draws:0,winRate:0};
                    const hex=firstHex(deck.colors); const checked=checkedDecks.includes(deck.id);
                    return (
                      <div key={deck.id} style={{background:deck.isActive?`linear-gradient(135deg,${C.accent}11,${C.card})`:`${C.card}`,border:`1.5px solid ${checked?C.accent:deck.isActive?C.accent+"55":C.border}`,borderRadius:10,overflow:"hidden"}}>
                        <DeckRow deck={deck} checked={checked} ds={ds} hex={hex} showDeckStats={showDeckStats} checkedDecks={checkedDecks} setCheckedDecks={setCheckedDecks} setDeckImgPreview={setDeckImgPreview} setSt={setSt} setDeckDetail={setDeckDetail} deckImages={st.deckImages||[]} t={t}/>
                        {showDeckStats&&ds.total>0&&(
                          <div style={{paddingLeft:30,paddingRight:8,paddingBottom:8}}>
                            <div style={{display:"flex",borderRadius:4,overflow:"hidden",height:4}}>
                              {ds.wins>0&&<div style={{flex:ds.wins,background:C.win}}/>}
                              {ds.draws>0&&<div style={{flex:ds.draws,background:C.draw}}/>}
                              {ds.loses>0&&<div style={{flex:ds.loses,background:C.lose}}/>}
                            </div>
                            <div style={{fontSize:11,color:C.muted,marginTop:3}}>{t.battleStats(ds.total,ds.wins,ds.loses)}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Opponents List */}
            {deckView==="opponents"&&(
              <div>
                {showAddOpp&&<AddOppForm newOppName={newOppName} setNewOppName={setNewOppName} onCancel={()=>{setShowAddOpp(false);setNewOppName("");}} onAdd={()=>{if(newOppName.trim()&&!allOpponentNames.includes(newOppName.trim())){setSt(s=>({...s,opponentNames:[...(s.opponentNames||[]),newOppName.trim()]}));setNewOppName("");setShowAddOpp(false);} }} inputStyle={inputStyle} t={t}/>}
                {allOpponentNames.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:C.muted}}>{t.noOppRegistered}</div>}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[...allOpponentNames]
                    .filter(n=>!deckSearch||n.toLowerCase().includes(deckSearch.toLowerCase()))
                    .sort((a,b)=>{
                      const msA=st.matches.filter(m=>m.opponent===a), msB=st.matches.filter(m=>m.opponent===b);
                      if(oppSort==="name") return a.localeCompare(b,"ja");
                      if(oppSort==="most") return msB.length-msA.length;
                      if(oppSort==="winrate"){const wrA=msA.length>0?msA.filter(m=>m.result==="win").length/msA.length:0;const wrB=msB.length>0?msB.filter(m=>m.result==="win").length/msB.length:0;return wrB-wrA;}
                      if(oppSort==="recent"){const latestA=msA.reduce((d,m)=>m.date>d?m.date:d,"");const latestB=msB.reduce((d,m)=>m.date>d?m.date:d,"");return latestB.localeCompare(latestA);}
                      return 0;
                    })
                    .map(name=>{
                      const ms=st.matches.filter(m=>m.opponent===name);
                      const w=ms.filter(m=>m.result==="win").length,l=ms.filter(m=>m.result==="lose").length,dr=ms.length-w-l;
                      const wr2=ms.length>0?Math.round(w/ms.length*100):0; const checked=checkedOpps.includes(name);
                      return (
                        <OppCard key={name} name={name} checked={checked} onToggle={()=>setCheckedOpps(prev=>checked?prev.filter(x=>x!==name):[...prev,name])}
                          showStats={showDeckStats} w={w} l={l} dr={dr} t={ms.length} wr2={wr2}
                          onRename={newName=>{ if(newName&&newName!==name){ setSt(s=>({...s,matches:s.matches.map(m=>m.opponent===name?{...m,opponent:newName}:m),opponentNames:s.opponentNames.map(n=>n===name?newName:n)})); }}}
                          onDelete={n=>setDeleteOppTarget(n)}
                          inputStyle={inputStyle}
                          t={t}
                        />
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ STATS TAB ════ */}
        {tab==="stats"&&(
          <div>
            <div style={{marginBottom:8}}>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                <FilterBarTop activeFilters={activeFilters} open={filterBarOpen} setOpen={setFilterBarOpen} onReset={resetFilters} t={t}/>
              </div>
              {!filterBarOpen&&activeFilters>0&&(
                <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:4}}>
                  {flt.periodPreset!=="all"&&flt.periodPreset!=="custom"&&(
                    <span style={{background:C.accent+"22",color:C.accent,border:`1px solid ${C.accent}44`,borderRadius:12,padding:"2px 10px",fontSize:12}}>
                      {flt.periodPreset==="today"?t.periodToday:flt.periodPreset==="week"?t.periodWeek:flt.periodPreset==="month"?t.periodMonth:t.periodYear}
                    </span>
                  )}
                  {(flt.dateFrom||flt.dateTo)&&(
                    <span style={{background:C.accent+"22",color:C.accent,border:`1px solid ${C.accent}44`,borderRadius:12,padding:"2px 10px",fontSize:12}}>
                      {(flt.dateFrom||"")+"〜"+(flt.dateTo||"")}
                    </span>
                  )}
                  {st.decks.filter(d=>flt.decks.includes(d.id)).map(d=>(
                    <span key={d.id} style={{background:C.accent+"22",color:C.accent,border:`1px solid ${C.accent}44`,borderRadius:12,padding:"2px 10px",fontSize:12}}>{d.name}</span>
                  ))}
                  {flt.decks.includes("__no_deck__")&&(
                    <span style={{background:C.accent+"22",color:C.accent,border:`1px solid ${C.accent}44`,borderRadius:12,padding:"2px 10px",fontSize:12}}>{t.noData}</span>
                  )}
                  {flt.opponents.map(n=>(
                    <span key={n} style={{background:C.accent+"22",color:C.accent,border:`1px solid ${C.accent}44`,borderRadius:12,padding:"2px 10px",fontSize:12}}>vs {n}</span>
                  ))}
                  {flt.matchTypes.map(tx=>(
                    <span key={tx} style={{background:C.accent+"22",color:C.accent,border:`1px solid ${C.accent}44`,borderRadius:12,padding:"2px 10px",fontSize:12}}>{displayMatchType(tx,lang)}</span>
                  ))}
                  {flt.turns.map(tx=>(
                    <span key={tx} style={{background:C.accent+"22",color:C.accent,border:`1px solid ${C.accent}44`,borderRadius:12,padding:"2px 10px",fontSize:12}}>{tx==="first"?t.first:tx==="second"?t.second:t.notSet}</span>
                  ))}
                  {flt.results.map(r=>(
                    <span key={r} style={{background:C.accent+"22",color:C.accent,border:`1px solid ${C.accent}44`,borderRadius:12,padding:"2px 10px",fontSize:12}}>{r==="win"?t.win:r==="lose"?t.lose:t.draw}</span>
                  ))}
                  {flt.lucky&&<span style={{background:C.accent+"22",color:C.accent,border:`1px solid ${C.accent}44`,borderRadius:12,padding:"2px 10px",fontSize:12}}>{t.lucky}</span>}
                  {flt.unlucky&&<span style={{background:C.accent+"22",color:C.accent,border:`1px solid ${C.accent}44`,borderRadius:12,padding:"2px 10px",fontSize:12}}>{t.unlucky}</span>}
                </div>
              )}
              {filterBarOpen&&<FilterBarPanel decks={st.decks} allOpponentNames={allOpponentNames} opponents={st.opponents||[]} matchTypes={matchTypes} flt={flt} setF={setF} inputStyle={inputStyle} t={t} lang={lang} formFields={st.formFields||{}} />}
            </div>
            {total===0?<div style={{textAlign:"center",padding:"40px 20px",color:C.muted}}><div style={{fontSize:40}}>📊</div><div style={{marginTop:12}}>{t.noStatData}</div></div>:(
              <div style={{marginTop:12}}>
                <StatSection label={t.statOverall} visKey="overall" statVis={statVis} t={t}>
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    <StatCard label={t.battles} value={total}/><StatCard label={t.winRate} value={`${wr}%`} color={wr>=50?C.win:C.lose}/>
                  </div>
                  <div style={{display:"flex",borderRadius:8,overflow:"hidden",height:20,marginBottom:6}}>
                    {wins>0&&<div style={{flex:wins,background:C.win,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#000",fontWeight:700}}>{wins}</div>}
                    {draws>0&&<div style={{flex:draws,background:C.draw,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#000",fontWeight:700}}>{draws}</div>}
                    {loses>0&&<div style={{flex:loses,background:C.lose,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#000",fontWeight:700}}>{loses}</div>}
                  </div>
                  <div style={{display:"flex",gap:16,fontSize:12}}>
                    <span style={{color:C.win}}>{t.winLabel} {wins}</span>{draws>0&&<span style={{color:C.draw}}>{t.drawShort} {draws}</span>}<span style={{color:C.lose}}>{t.loseLabel} {loses}</span>
                  </div>
                </StatSection>
                <StatSection label={t.statWinTrend} visKey="winTrend" statVis={statVis} t={t}>
                  <WinRateChart matches={filtered} t={t}/>
                </StatSection>
                {(fwr!==null||swr!==null)&&(
                  <StatSection label={t.statTurns} visKey="turns" statVis={statVis} t={t}>
                    <div style={{display:"flex",gap:12}}>
                      {fwr!==null&&<div style={{flex:1,textAlign:"center",background:C.surface,borderRadius:10,padding:12}}><div style={{fontSize:20,fontWeight:900,color:C.first}}>{fwr}%</div><div style={{fontSize:11,color:C.muted,marginTop:3}}>{t.firstWR}</div></div>}
                      {swr!==null&&<div style={{flex:1,textAlign:"center",background:C.surface,borderRadius:10,padding:12}}><div style={{fontSize:20,fontWeight:900,color:C.second}}>{swr}%</div><div style={{fontSize:11,color:C.muted,marginTop:3}}>{t.secondWR}</div></div>}
                    </div>
                  </StatSection>
                )}
                <StatSection label={t.statDeckBar} visKey="deckBar" statVis={statVis} t={t}>
                  {deckStats.filter(d=>d.total>0).sort((a,b)=>b.total-a.total).map(d=>(
                    <div key={d.id} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                        <span style={{fontSize:13,color:firstHex(d.colors)||C.text,fontWeight:600,display:"flex",alignItems:"center",gap:5}}><DeckDot colors={d.colors} size={9}/>{d.name}</span>
                        <span style={{fontSize:13,fontWeight:700,color:d.winRate>=50?C.win:C.lose}}>{d.winRate}%</span>
                      </div>
                      <div style={{display:"flex",borderRadius:4,overflow:"hidden",height:8}}>
                        {d.wins>0&&<div style={{flex:d.wins,background:C.win}}/>}
                        {d.draws>0&&<div style={{flex:d.draws,background:C.draw}}/>}
                        {d.loses>0&&<div style={{flex:d.loses,background:C.lose}}/>}
                      </div>
                      <div style={{fontSize:11,color:C.muted,marginTop:3}}>{t.battleStats(d.total,d.wins,d.loses)}</div>
                    </div>
                  ))}
                </StatSection>
                <StatSection label={t.statDeckPie} visKey="deckPie" statVis={statVis} t={t}>
                  <PieChart items={deckStats.filter(d=>d.total>0).sort((a,b)=>b.total-a.total).map(d=>({label:d.name,value:d.total,deckColors:d.colors}))} t={t}/>
                </StatSection>
                <StatSection label={t.statOppBar} visKey="oppBar" statVis={statVis} t={t}>
                  {opponentStats.sort((a,b)=>b.total-a.total).slice(0,10).map(o=>(
                    <div key={o.name} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                        <span style={{fontSize:13,color:C.text}}>{o.name}</span>
                        <span style={{fontSize:13,fontWeight:700,color:o.winRate>=50?C.win:C.lose}}>{o.winRate}%</span>
                      </div>
                      <div style={{display:"flex",borderRadius:4,overflow:"hidden",height:8}}>
                        {o.wins>0&&<div style={{flex:o.wins,background:C.win}}/>}
                        {o.draws>0&&<div style={{flex:o.draws,background:C.draw}}/>}
                        {o.loses>0&&<div style={{flex:o.loses,background:C.lose}}/>}
                      </div>
                      <div style={{fontSize:11,color:C.muted,marginTop:3}}>{t.battleStats(o.total,o.wins,o.loses)}</div>
                    </div>
                  ))}
                </StatSection>
                <StatSection label={t.statOppPie} visKey="oppPie" statVis={statVis} t={t}>
                  <PieChart items={opponentStats.sort((a,b)=>b.total-a.total).map(o=>({label:o.name,value:o.total}))} t={t}/>
                </StatSection>
              </div>
            )}
          </div>
        )}

        {/* ════ SETTINGS TAB ════ */}
        {tab==="settings"&&(
          <div>
            {/* Language */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>{t.languageLabel}</div>
              <div style={{display:"flex",gap:8}}>
                {[["ja","日本語"],["en","English"],["ko","한국어"],["zh","中文"],["es","Español"]].map(([code,label])=>(
                  <button key={code} onClick={()=>changeLang(code)} style={{flex:1,padding:"10px 0",borderRadius:8,border:`2px solid ${lang===code?C.accent:C.border}`,background:lang===code?C.accent+"22":"transparent",color:lang===code?C.accent:C.muted,fontWeight:lang===code?700:400,cursor:"pointer",fontSize:14}}>{label}</button>
                ))}
              </div>
            </div>
            {/* Theme */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>{t.themeColor}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {Object.entries(THEMES).map(([id,theme])=>{
                  const sel=st.theme===id;
                  const label = getThemeLabel(theme, lang);
                  return <button key={id} onClick={()=>setSt(s=>({...s,theme:id}))} style={{padding:"6px 14px",borderRadius:20,border:`2px solid ${sel?theme.accent:C.border}`,background:sel?theme.accent+"22":"transparent",color:sel?theme.accent:C.muted,cursor:"pointer",fontWeight:sel?700:400,fontSize:13}}>{label}</button>;
                })}
              </div>
            </div>
            {/* Form Fields */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:4}}>{t.formFields}</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:12}}>{t.formFieldsHint}</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {FORM_FIELDS_KEYS.map(f=>{
                  const on=(st.formFields||{})[f.key]!==false;
                  const label = t[FIELD_LABEL_MAP[f.key]] || f.key;
                  return <div key={f.key} onClick={()=>setSt(s=>({...s,formFields:{...(s.formFields||{}),[f.key]:!on}}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 4px",cursor:"pointer"}}>
                    <span style={{fontSize:14,color:on?C.text:C.muted}}>{label}</span>
                    <div style={{width:40,height:22,borderRadius:11,background:on?C.accent:C.border,position:"relative",flexShrink:0}}>
                      <div style={{position:"absolute",top:3,left:on?20:3,width:16,height:16,borderRadius:"50%",background:"white",transition:"left 0.15s"}}/>
                    </div>
                  </div>;
                })}
              </div>
            </div>
            {/* Stats Visibility */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:4}}>{t.statSettings}</div>
              <div style={{fontSize:12,color:"#f87171",marginBottom:12}}>{t.statSettingsWarn}</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {STAT_SECTIONS.map(([key,label])=>{
                  const on = statVis[key] !== false;
                  return (
                    <div key={key} onClick={()=>setStatVis(v=>({...v,[key]:!on}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 4px",cursor:"pointer"}}>
                      <span style={{fontSize:14,color:on?C.text:C.muted}}>{label}</span>
                      <div style={{width:40,height:22,borderRadius:11,background:on?C.accent:C.border,position:"relative",flexShrink:0}}>
                        <div style={{position:"absolute",top:3,left:on?20:3,width:16,height:16,borderRadius:"50%",background:"white",transition:"left 0.15s"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Opponents Management */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:12}}>{t.oppManagement}</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:8}}>
                {(st.opponents||[]).map(op=>(
                  <div key={op} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0"}}>
                    <span style={{fontSize:14,color:C.text}}>{op}</span>
                    <button onClick={()=>setSt(s=>({...s,opponents:(s.opponents||[]).filter(x=>x!==op)}))} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:"#ff6666",padding:"3px 8px",cursor:"pointer",fontSize:12}}>🗑</button>
                  </div>
                ))}
                {(st.opponents||[]).length===0&&<div style={{fontSize:13,color:C.muted,padding:"8px 0"}}>{t.noOppRegistered}</div>}
              </div>
              <AddMatchTypeInline onAdd={op=>{if(op&&!(st.opponents||[]).includes(op))setSt(s=>({...s,opponents:[...(s.opponents||[]),op]}));}} matchTypes={st.opponents||[]} inputStyle={inputStyle} t={t}/>
            </div>
            {/* Match Types */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <div style={{fontWeight:800,fontSize:14}}>{t.matchTypeManagement}</div>
                <button disabled={matchTypes.length<2} onClick={()=>setShowMergeMatchType(true)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${matchTypes.length>=2?C.accent:C.border}`,background:matchTypes.length>=2?C.accent+"22":"transparent",color:matchTypes.length>=2?C.accent:C.muted,cursor:matchTypes.length>=2?"pointer":"not-allowed",fontSize:12}}>{t.merge}</button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:4}}>
                {matchTypes.map((tx,i)=>(
                  <div key={tx} style={{display:"flex",alignItems:"center",gap:6,background:C.surface,borderRadius:8,padding:"8px 10px"}}>
                    <div style={{display:"flex",flexDirection:"column",gap:2,flexShrink:0}}>
                      <button onClick={()=>moveMatchType(tx,-1)} disabled={i===0} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:4,color:i===0?C.border:C.muted,padding:"1px 6px",cursor:i===0?"not-allowed":"pointer",fontSize:11}}>▲</button>
                      <button onClick={()=>moveMatchType(tx,1)} disabled={i===matchTypes.length-1} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:4,color:i===matchTypes.length-1?C.border:C.muted,padding:"1px 6px",cursor:i===matchTypes.length-1?"not-allowed":"pointer",fontSize:11}}>▼</button>
                    </div>
                    <span style={{fontSize:14,color:C.text,flex:1}}>{displayMatchType(tx,lang)}</span>
                    {!DEFAULT_MATCH_TYPES_JA.includes(tx)&&!DEFAULT_MATCH_TYPES_EN.includes(tx)?<button onClick={()=>deleteMatchType(tx)} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:"#ff6666",padding:"3px 8px",cursor:"pointer",fontSize:12}}>🗑</button>:<span style={{fontSize:11,color:C.muted,padding:"3px 8px"}}>–</span>}
                  </div>
                ))}
              </div>
              <AddMatchTypeInline onAdd={addMatchType} matchTypes={matchTypes} inputStyle={inputStyle} t={t}/>
            </div>
            {/* CSV Import */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:4}}>{t.csvImport}</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:14}}>{t.csvImportHint}</div>
              {!importResult?(
                <label style={{display:"block",padding:"14px",borderRadius:10,border:`2px dashed ${C.border}`,textAlign:"center",cursor:"pointer",color:C.muted,fontSize:13}}>
                  📂 {t.selectCSV}
                  <input type="file" accept=".csv" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{importCSV(ev.target.result);};r.readAsText(f,"UTF-8");e.target.value="";}}/>
                </label>
              ):(
                <div>
                  <div style={{background:C.surface,borderRadius:10,padding:14,marginBottom:12}}>
                    <div style={{fontSize:15,fontWeight:800,color:C.win,marginBottom:8}}>{t.importSuccess}</div>
                    <div style={{fontSize:13,color:C.text,lineHeight:1.8}}>{t.importCount(importResult.imported,importResult.skipped,importResult.autoCreated)}</div>
                  </div>
                  <button onClick={()=>setImportResult(null)} style={{width:"100%",padding:"10px 0",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer"}}>{t.importReset}</button>
                </div>
              )}
            </div>
            {/* Backup */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:4}}>{t.backup}</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:12}}>{t.backupHint}</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <button onClick={()=>{
                  const json=serializeData(st,true);
                  const blob=new Blob([json],{type:"application/json"});
                  const url=URL.createObjectURL(blob);
                  const a=document.createElement("a");
                  a.href=url; a.download="digimon_backup_"+new Date().toISOString().slice(0,10)+".json"; a.click(); URL.revokeObjectURL(url);
                }} style={{width:"100%",padding:"12px 0",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.text,cursor:"pointer",fontSize:13}}>
                  💾 {t.downloadBackup}
                </button>
                <label style={{width:"100%",padding:"12px 0",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.text,cursor:"pointer",fontSize:13,textAlign:"center",display:"block"}}>
                  💾 {t.restoreBackup}
                  <input type="file" accept=".json" style={{display:"none"}} onChange={e=>{
                    const file=e.target.files[0]; if(!file)return;
                    const reader=new FileReader();
                    reader.onload=ev=>{ const d=parseData(ev.target.result); if(d){setSt(d);showToast(lang==="en"?"Restored!":"復元しました！");}else{alert(lang==="en"?"Invalid file.":"ファイルが正しくありません。");} };
                    reader.readAsText(file); e.target.value="";
                  }}/>
                </label>
              </div>
              <BackupSizeInfo st={st} t={t}/>
            </div>
            {/* Deck Image Management */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:4}}>🖼 {t.deckImageMgmt}</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:12}}>{t.deckImageMgmtHint((st.deckImages||[]).length)}</div>
              {st.decks.filter(d=>(st.deckImages||[]).some(i=>i.deckId===d.id)).map(deck=>{
                const imgs=(st.deckImages||[]).filter(i=>i.deckId===deck.id).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
                return (
                  <div key={deck.id} style={{marginBottom:14}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                      <DeckDot colors={deck.colors} size={10}/>
                      <span style={{fontSize:13,fontWeight:700,color:firstHex(deck.colors)||C.text}}>{deck.name}</span>
                      <span style={{fontSize:11,color:C.muted}}>{imgs.length}</span>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {imgs.map(img=>{
                        const usedCount=(st.matches||[]).filter(m=>m.imageId===img.id).length;
                        return (
                          <div key={img.id} style={{position:"relative",width:72,borderRadius:6,overflow:"hidden",border:`2px solid ${img.id===deck.currentImageId?C.accent:C.border}`}}>
                            <img src={img.imageData} alt="" style={{width:"100%",height:72,objectFit:"cover"}}/>
                            {img.id===deck.currentImageId&&<div style={{position:"absolute",top:2,left:2,background:C.accent,borderRadius:3,padding:"1px 4px",fontSize:9,color:"#000",fontWeight:700}}>✓</div>}
                            <div style={{padding:"2px 4px",background:"rgba(0,0,0,0.7)",fontSize:9,color:"#ccc",textAlign:"center"}}>{usedCount}</div>
                            <button onClick={()=>{
                              if(!window.confirm(t.deleteImageConfirm(usedCount))) return;
                              setSt(s=>{
                                const newImgs=s.deckImages.filter(i=>i.id!==img.id);
                                const newCurrentId=deck.currentImageId===img.id?(newImgs.filter(i=>i.deckId===deck.id)[0]?.id||null):deck.currentImageId;
                                return{...s,deckImages:newImgs,decks:s.decks.map(d=>d.id===deck.id?{...d,currentImageId:newCurrentId}:d)};
                              });
                            }} style={{width:"100%",padding:"3px 0",border:"none",background:"#ff444488",color:"#fff",cursor:"pointer",fontSize:10}}>{t.deleteImage}</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {st.decks.every(d=>!(st.deckImages||[]).some(i=>i.deckId===d.id))&&(
                <div style={{fontSize:13,color:C.muted,textAlign:"center",padding:"12px 0"}}>{t.noImages}</div>
              )}
              {(st.deckImages||[]).filter(i=>!(st.matches||[]).some(m=>m.imageId===i.id)&&i.id!==st.decks.find(d=>d.id===i.deckId)?.currentImageId).length>0&&(
                <button onClick={()=>{
                  const usedIds=new Set([...(st.matches||[]).map(m=>m.imageId).filter(Boolean),...st.decks.map(d=>d.currentImageId).filter(Boolean)]);
                  setSt(s=>({...s,deckImages:(s.deckImages||[]).filter(i=>usedIds.has(i.id))}));
                }} style={{marginTop:8,width:"100%",padding:"10px 0",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:12}}>
                  🗑 {t.deleteUnused}
                </button>
              )}
            </div>
            {/* Danger Zone */}
            <div style={{background:C.card,border:"1px solid #ff444444",borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:4,color:"#ff4444"}}>{t.dangerZone}</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:12}}>{t.dangerZoneHint}</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <button onClick={()=>setDeleteConfirmType("images")} style={{width:"100%",padding:"12px 0",borderRadius:8,border:"none",background:"#ff444422",color:"#ff4444",cursor:"pointer",fontWeight:700}}>{t.deleteAllImages}</button>
                <button onClick={()=>setDeleteConfirmType("all")} style={{width:"100%",padding:"12px 0",borderRadius:8,border:"none",background:"#ff444422",color:"#ff4444",cursor:"pointer",fontWeight:700}}>{t.deleteAll}</button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Modals & Overlays ────────────────────────── */}
      {toast&&<div style={{position:"fixed",top:16,right:16,zIndex:9999,background:C.accent,color:"#000",borderRadius:8,padding:"8px 16px",fontWeight:700,fontSize:13}}>✓ {toast}</div>}

      {matchDetail&&<MatchDetailModal match={matchDetail} deck={getDeck(matchDetail.deckId)} onClose={()=>setMatchDetail(null)} onEdit={()=>{openEdit(matchDetail);setMatchDetail(null);}} formFields={st.formFields||{}} deckImages={st.deckImages||[]} t={t} lang={lang}/>}

      {deckDetail&&<DeckDetailModal deck={deckDetail} deckStats={deckStats.find(d=>d.id===deckDetail.id)} inputStyle={inputStyle}
        onClose={()=>setDeckDetail(null)}
        onSave={form=>{setSt(s=>({...s,decks:s.decks.map(d=>d.id===deckDetail.id?{...d,...form}:d)}));setDeckDetail(null);showToast(t.saved);}}
        onDelete={()=>setDeleteDeckTarget(deckDetail.id)}
        allDecks={st.decks} deckImages={st.deckImages||[]}
        onSaveImage={(deckId,imageData)=>{ let newImgId=null; setSt(s=>{ const {newImgs,newImgId:id}=addDeckImage(s.deckImages||[],s.decks,deckId,imageData); newImgId=id; const newImg=newImgs.find(i=>i.id===id); if(newImg) idbPut(newImg).catch(()=>{}); return{...s,deckImages:newImgs,decks:s.decks.map(d=>d.id===deckId?{...d,currentImageId:id}:d)}; }); return newImgId; }}
        onDeleteImage={(imgId,deckId)=>{ idbDelete(imgId).catch(()=>{}); setSt(s=>{ const newImgs=s.deckImages.filter(i=>i.id!==imgId); const newCurrentId=s.decks.find(d=>d.id===deckId)?.currentImageId===imgId?(newImgs.filter(i=>i.deckId===deckId)[0]?.id||null):s.decks.find(d=>d.id===deckId)?.currentImageId; return{...s,deckImages:newImgs,decks:s.decks.map(d=>d.id===deckId?{...d,currentImageId:newCurrentId}:d)}; }); }}
        t={t} lang={lang}
      />}

      {showMerge&&<MergeModal allNames={allOpponentNames} onMerge={handleMerge} onCancel={()=>{setShowMerge(false);setMergeInitial([]);}} initialSelected={mergeInitial} t={t}/>}
      {showMergeMatchType&&<MatchTypeMergeModal matchTypes={matchTypes} matches={st.matches} lang={lang} onMerge={handleMergeMatchTypes} onCancel={()=>setShowMergeMatchType(false)} t={t} displayMatchType={displayMatchType}/>}
      {showMergeDeck&&<DeckMergeModal decks={st.decks} selectedIds={checkedDecks} deckImages={st.deckImages||[]} onMerge={handleMergeDecks} onCancel={()=>setShowMergeDeck(false)} t={t}/>}

      {/* Delete Confirms */}
      {deleteTarget&&(
        <div style={{position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:20}}>
          <div style={{background:C.card,borderRadius:16,padding:24,width:"100%",maxWidth:400}}>
            <div style={{fontSize:17,fontWeight:900,color:"#ff4444",marginBottom:12,textAlign:"center"}}>{t.deleteMatchTitle}</div>
            <div style={{fontSize:13,color:C.muted,marginBottom:20,textAlign:"center",lineHeight:1.6}}>{t.deleteMatchHint}</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDeleteTarget(null)} style={{flex:1,padding:"12px 0",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer"}}>{t.confirmCancel}</button>
              <button onClick={()=>{deleteMatch(deleteTarget);setDeleteTarget(null);}} style={{flex:2,padding:"12px 0",borderRadius:10,border:"none",background:"#ff4444",color:"#fff",cursor:"pointer",fontWeight:700}}>{t.confirmDelete}</button>
            </div>
          </div>
        </div>
      )}
      {deleteDeckTarget&&(
        <div style={{position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:20}}>
          <div style={{background:C.card,borderRadius:16,padding:24,width:"100%",maxWidth:400}}>
            <div style={{fontSize:17,fontWeight:900,color:"#ff4444",marginBottom:8,textAlign:"center"}}>{t.deleteDeckTitle}</div>
            <div style={{fontSize:14,color:C.text,marginBottom:6,textAlign:"center",fontWeight:700}}>{st.decks.find(d=>d.id===deleteDeckTarget)?.name}</div>
            <div style={{fontSize:12,color:C.muted,marginBottom:20,textAlign:"center",lineHeight:1.6}}>{t.deleteDeckHint}</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDeleteDeckTarget(null)} style={{flex:1,padding:"12px 0",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer"}}>{t.confirmCancel}</button>
              <button onClick={()=>{deleteDeck(deleteDeckTarget);setDeleteDeckTarget(null);setDeckDetail(null);}} style={{flex:2,padding:"12px 0",borderRadius:10,border:"none",background:"#ff4444",color:"#fff",cursor:"pointer",fontWeight:700}}>{t.confirmDelete}</button>
            </div>
          </div>
        </div>
      )}
      {deleteOppTarget&&(
        <div style={{position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:20}}>
          <div style={{background:C.card,borderRadius:16,padding:24,width:"100%",maxWidth:400}}>
            <div style={{fontSize:17,fontWeight:900,color:"#ff4444",marginBottom:8,textAlign:"center"}}>{t.deleteOppTitle}</div>
            <div style={{fontSize:14,color:C.text,marginBottom:6,textAlign:"center",fontWeight:700}}>{deleteOppTarget}</div>
            <div style={{fontSize:12,color:C.muted,marginBottom:20,textAlign:"center",lineHeight:1.6}}>{t.deleteOppHint}</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDeleteOppTarget(null)} style={{flex:1,padding:"12px 0",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer"}}>{t.confirmCancel}</button>
              <button onClick={()=>{setSt(s=>({...s,opponentNames:(s.opponentNames||[]).filter(n=>n!==deleteOppTarget)}));setDeleteOppTarget(null);}} style={{flex:2,padding:"12px 0",borderRadius:10,border:"none",background:"#ff4444",color:"#fff",cursor:"pointer",fontWeight:700}}>{t.confirmDelete}</button>
            </div>
          </div>
        </div>
      )}
      {deleteConfirmType&&(
        <div style={{position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:20}}>
          <div style={{background:C.card,borderRadius:16,padding:24,width:"100%",maxWidth:400}}>
            <div style={{fontSize:18,fontWeight:900,color:"#ff4444",marginBottom:12,textAlign:"center"}}>
              {deleteConfirmType==="all"?t.deleteAllTitle:t.deleteImagesTitle}
            </div>
            <div style={{fontSize:13,color:C.muted,marginBottom:20,textAlign:"center",lineHeight:1.6}}>
              {deleteConfirmType==="all"?t.deleteAllConfirm:t.deleteImagesConfirm}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDeleteConfirmType(null)} style={{flex:1,padding:"12px 0",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer"}}>{t.confirmCancel}</button>
              <button onClick={()=>{
                if(deleteConfirmType==="all"){idbClear().catch(()=>{}); setSt({decks:[],matches:[],opponentNames:[],matchTypes:[...DEFAULT_MATCH_TYPES_JA],prefs:{},theme:st.theme||"blue",formFields:{},opponents:[],deckImages:[],uiPrefs:{}});}
                else{setSt(s=>({...s,decks:s.decks.map(d=>({...d,image:"",currentImageId:null})),deckImages:[]}));idbClear().catch(()=>{});}
                setDeleteConfirmType(null);
              }} style={{flex:2,padding:"12px 0",borderRadius:10,border:"none",background:"#ff4444",color:"#fff",cursor:"pointer",fontWeight:700}}>{t.confirmDelete}</button>
            </div>
          </div>
        </div>
      )}

      {/* Deck image preview */}
      {deckImgPreview&&(
        <div onClick={()=>setDeckImgPreview(null)} style={{position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.card,borderRadius:16,overflow:"hidden",maxWidth:500,width:"100%"}}>
            <img src={deckImgPreview.curImg.imageData} alt="" style={{width:"100%",maxHeight:400,objectFit:"contain"}}/>
            <div style={{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><DeckDot colors={deckImgPreview.deck.colors} size={12}/><span style={{fontWeight:700,fontSize:14,color:C.text}}>{deckImgPreview.deck.name}</span></div>
              <button onClick={()=>setDeckImgPreview(null)} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,padding:"6px 12px",cursor:"pointer"}}>✕</button>
            </div>
          </div>
        </div>
      )}

      {showLife&&<MemoryGauge marker={marker} setMarker={setMarker} onClose={()=>setShowLife(false)} accent={C.accent} accentDim={C.accentDim} t={t}/>}
    </div>
  );
}
