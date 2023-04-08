// 時間割シートから読み取る
function getTimeTable() {
  const sheetData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("時間割");
  const record = sheetData.getRange('A1:A15').getValues();
  console.info('時間割シートから下記を取得\nA1:A9: ' + record);
  return record;
}

// コピペシートから読み取る
function getCopyAndPaste() {
  const sheetData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("コピペ");
  const record = sheetData.getRange('A1:B1').getValues();

  console.info('コピペシートから下記を取得\nA1:B1: ' + record);
  return record;
}

// A1が1か2で始まる文字列でなければ先頭に0を付け足す
function checkOverTwo(record) {

  var time = record[0][0];
  if(time.substr(0,1) > 2){
    record[0][0] = '0' + record[0][0];
    console.info(record[0][0] + ' 0挿入');
  }

  return record;
}

function checkRecord(timeTable, paste) {
  // 時間割シートの文字列分繰り返す
  for (var i in timeTable) {
    // const x = timeTable[i];
    reg = new RegExp(timeTable[i]);

    if (paste[0][1].match(reg)) {
      // 文字列.B1に時間割の文字列が含まれている場合
      console.info('tweet対象文字列を検知');
      return true;
    }
  }
  console.info('tweet対象文字列ではありません');
  return false;
}

function getDiff(paste) {
  // コピペからA1を取得
  const time = paste[0][0];
  const dateFrom = dayjs.dayjs().hour(time.substr(0,2)).minute(time.substr(3,2));

  // 今日の日付を表示
  const dateTo = dayjs.dayjs();
  const diff = dateFrom.diff(dateTo);

  return diff;
}


function checkTime(paste) {
  const diff = getDiff(paste);

  // 1000000ms(16分) > paste - new の場合
  if(1000000 > diff){
    if(checkTimeExceed(diff)){
      // 0ms < paste - new の場合
      return false;
    }
    console.info('開始5分前です');
    return true;
  }
  console.info('開始まで30分以上あります');
  return false;
}

function checkTimeExceed(diff) {
  // 0ms < paste - new の場合
  if(0 > diff){
    console.info('すでに過ぎた時間割です');
    return true;
  }else{
    return false;
  }
}

function batchTweet(paste) {
  // 配列を文字列化
  paste = paste.join();
  // ,を削除
  paste = paste.replace(/,/g, " ");
  
  try{
    //トークン確認
    var service = checkOAuth();

    //message本文
    var message = {
      text: paste + ' が始まります\n\nパズドラ ゲリラbot ' + getD()
    }

    //リクエスト実行
    const response = UrlFetchApp.fetch(ENDPOINT2, {
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      },
      muteHttpExceptions: true,
      payload: JSON.stringify(message),
      contentType: 'application/json'
    });

    console.info('下記をツイート\n' + paste);
    // LINEで通知
    sendLineMessage(paste, '上記をツイートしました。');
  } catch(e){
    console.error('エラーが発生\n' + e);
    console.error(response);
    console.error(paste);
    sendLineMessage(e, paste);
  }
}

function deleteRecord() {
  // レコードを削除する
  const sheetData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("コピペ");
  sheetData.deleteRows(1);
  console.info('レコード削除');
}

function insertRecord() {
  const sheetData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("コピペ");
  
  // 最後行の下に行を追加
  sheetData.appendRow(['']);
  sheetData.appendRow(['']);
}

//LINEにメッセージを送る
function sendLineMessage(record, str) {
  // 引数で指定したトークンで送信
  UrlFetchApp.fetch(LINE_NOTIFY_API, {
    "method": "post",
    "headers": {
      "Authorization": "Bearer " + LINE_TOKEN
    },
    "payload": {
      "message": record + '\n' + str
    }
  });
}


// 10時の時点で入力されていない場合にLINEで通知
function myFunction() {
  var date1 = new Date('hh:mm:ss');
  var date2 = new Date(2021,8,24,8,0,1,1);
  Logger.log(date1);
  Logger.log(date2);
 
  // 日付比較サンプル
  Logger.log(date1.getTime() > date2.getTime());
  Logger.log(date1.getTime() < date2.getTime());
  Logger.log(date1.getTime());
  Logger.log(date2.getTime());
  Logger.log(date1.getTime() === date2.getTime());
 
  if(date1.getTime() > date2.getTime()) {
    Logger.log('date1 > date2')
  }else if(date1.getTime() < date2.getTime()){
    Logger.log('date2 > date1')
  } else {
    Logger.log('date1 = date2');
  }
}

function checkWhite() {
  // 現在日時を取得
  var nowTime = new Date();
  var y = nowTime.getFullYear();
  var m = nowTime.getMonth();
  var d = nowTime.getDate();
  var morningTime = new Date(y, m, d, 9, 45);
  var nightTime = new Date(y, m, d, 12, 45);

  if(nowTime > morningTime && nowTime < nightTime ){
    return true
  }else{
    return false
  }
}

//ツイートに付属させる日時を取得
function getD(){
  var d = new Date();
  return Utilities.formatDate(d, 'Asia/Tokyo', 'yyMMdd');
}
