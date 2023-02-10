

var CONSUMER_KEY = getConsumerKey();
var CONSUMER_SECRET = getConsumerSecret();

function getConsumerKey() {
  const sheetData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB");
  const record = sheetData.getRange('A2').getValue();
  return record;
}

function getConsumerSecret() {
  const sheetData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB");
  const record = sheetData.getRange('A3').getValue();
  return record;
}

// 認証用インスタンス
var twitter = TwitterWebService.getInstance(
  CONSUMER_KEY ,       // 作成したアプリケーションのConsumer Key
  CONSUMER_SECRET  // 作成したアプリケーションのConsumer Secret
);

// 認証
function authorize() {
  twitter.authorize();
}

// 認証解除
function reset() {
  twitter.reset();
}

// 認証後のコールバック
function authCallback(request) {
  return twitter.authCallback(request);
}


function getLineraTokeesthsrn() {
  Logger.log(CONSUMER_KEY);
}
