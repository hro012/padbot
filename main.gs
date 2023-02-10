// ツイートを投稿　コピペシートのtweetボタン押下で動作
function morningTweet() {
  // コピペシートから全レコード取得
  const sheetData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('コピペ');
  const message = sheetData.getRange(1, 1, 7, 2).getValues();

  // 多次元配列を文字列に変換
  mess = message.join();

  // ,を削除
  mess = mess.replace(/,0/g, '\n0');
  mess = mess.replace(/,1/g, '\n1');
  mess = mess.replace(/,2/g, '\n1');
  mess = mess.replace(/,/g, ' ');

  // tweetする
  const service  = twitter.getService();
  const response = service.fetch('https://api.twitter.com/1.1/statuses/update.json', {
    method: 'post',
    payload: { status: '本日の時間割\n' + mess + '\n\nパズドラ ゲリラbot' }
  });
  console.info('時間割tweet');
}

// 30分ごとに実行　
function main() {
  // 各シートからレコードを取得する。
  const timeTable = getTimeTable();
  var record = getCopyAndPaste();

  if(record[0][0] == ''){
    // A1が空白行の場合は処理終了
    if(checkWhite()){
      //10時の時点で空白の場合は通知
      sendLineMessage('まだ時間割が入力されていません','')
      console.info('時間割未入力');
    }
    console.info('return');
    return;
  }
  
  // A1が1か2で始まる文字列でなければ先頭に0を付け足す
  const paste = checkOverTwo(record);

  // 1000000 > paste - new の場合 true
  const ct = checkTime(paste);

  // tweet対象レコードの場合 ture
  const cr = checkRecord(timeTable, paste);

  // tweetするレコードかつ
  // 1000000 > paste - new > 0 の場合tweet予約する
  if (ct && cr) {
    batchTweet(paste);
    // レコードを削除する
    deleteRecord();
    insertRecord();
  }else if(!cr) {
    // いらないレコードの場合レコードを削除する
    console.info('不必要なレコードを検知');
    deleteRecord();
    insertRecord();
  }else if(!ct){
    // すでに時間の過ぎたRecordでないか確認
    const diff = getDiff(paste);
    if(checkTimeExceed(diff)){
      // すでに時間の過ぎたレコードを削除する
      console.info('すでに時間の過ぎたレコードを検知');
      deleteRecord();
      insertRecord();
      sendLineMessage('すでに時間の過ぎたレコードを検知しました','スプレッドシートの確認をお願いします');
    }
  }
}

function createTriggers1Minutes() {
  var onChangeTrigger = ScriptApp.newTrigger("main")
    .timeBased()
    .everyMinutes(30)
    .create();
}  

function test() {
}





