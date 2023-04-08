
//認証用の各種変数
var CLIENT_ID =  getAppId();
var CLIENT_SECRET = getAppSecret();
var scope = "tweet.write tweet.read users.read offline.access"
var authurl = "https://twitter.com/i/oauth2/authorize"
var tokenurl = "https://api.twitter.com/2/oauth2/token"
//Tweet Endpoint
var ENDPOINT2 = 'https://api.twitter.com/2/tweets';

function getAppId() {
  const sheetData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB");
  const record = sheetData.getRange('A4').getValue();
  return record;
}

function getAppSecret() {
  const sheetData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB");
  const record = sheetData.getRange('A5').getValue();
  return record;
}

function startoauth(){
  //UIを取得する
  var ui = SpreadsheetApp.getUi();
  console.info(ui);
  
  //認証済みかチェックする
  var service = checkOAuth();
  console.info(service);
  if (!service.hasAccess()) {
    //認証画面を出力
    var output = HtmlService.createHtmlOutputFromFile('template').setHeight(450).setWidth(500).setSandboxMode(HtmlService.SandboxMode.IFRAME);
    ui.showModalDialog(output, 'OAuth2.0認証');
  } else {
    //認証済みなので終了する
    ui.alert("すでに認証済みです。");
  }
}

//アクセストークンURLを含んだHTMLを返す関数
function authpage(){
  var service = checkOAuth();
  var authorizationUrl = service.getAuthorizationUrl();

  console.log(authorizationUrl)


  var html = "<center><b><a href='" + authorizationUrl + "' target='_blank' onclick='closeMe();'>アクセス承認</a></b></center>"
  return html;
}

//認証チェック
function checkOAuth() {
  pkceChallengeVerifier();
  const prop = PropertiesService.getUserProperties();

  return OAuth2.createService("twitter")
    .setAuthorizationBaseUrl(authurl)
    .setTokenUrl(tokenurl + '?code_verifier=' + prop.getProperty("code_verifier"))
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setScope(scope)
    .setCallbackFunction("authCallback")　//認証を受けたら受け取る関数を指定する
    .setPropertyStore(PropertiesService.getScriptProperties())  //スクリプトプロパティに保存する
    .setParam("response_type", "code")
    .setParam('code_challenge_method', 'S256')
    .setParam('code_challenge', prop.getProperty("code_challenge"))
    .setTokenHeaders({
      'Authorization': 'Basic ' + Utilities.base64Encode(CLIENT_ID + ':' + CLIENT_SECRET),
      'Content-Type': 'application/x-www-form-urlencoded'
    })
}

//認証コールバック
function authCallback(request) {
  var service = checkOAuth();
  var isAuthorized = service.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput("認証に成功しました。ページを閉じてください。");
  } else {
    return HtmlService.createHtmlOutput("認証に失敗しました。");
  }
}

//ログアウト
function reset() {
  checkOAuth().reset();
  SpreadsheetApp.getUi().alert("ログアウトしました。")
}

function pkceChallengeVerifier() {
  var prop = PropertiesService.getUserProperties();
  if (!prop.getProperty("code_verifier")) {
    var verifier = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

    for (var i = 0; i < 128; i++) {
      verifier += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    var sha256Hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, verifier)

    var challenge = Utilities.base64Encode(sha256Hash)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    prop.setProperty("code_verifier", verifier)
    prop.setProperty("code_challenge", challenge)
  }
}
