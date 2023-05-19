


function batchTwargaeet(paste) {
  // 配列を文字列化
  paste = paste.join();
  // ,を削除
  paste = paste.replace(/,/g, " ");

  try{
    // tweetを実行
    const service  = twitter.getService();
    const response = service.fetch('https://api.twitter.com/1.1/statuses/update.json', {
      method: 'post',
      payload: { status: paste + ' が始まります\n\nパズドラ ゲリラbot' }
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


function batchTwartreet(paste) {

  paste = 'test'
  
  try{
    //トークン確認
    var service = checkOAuth();
    var date = getD()

    //message本文
    var message = {
      text: paste + ' が始まります\n\nパズドラ ゲリラbot ' + date
    }

    //リクエスト実行
    var response = UrlFetchApp.fetch(ENDPOINT2, {
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      },
      muteHttpExceptions: true,
      payload: JSON.stringify(message),
      contentType: 'application/json'
    });

    console.info('下記をツイート\n' + paste + ' ' + date);
    // LINEで通知
    sendLineMessage(paste + ' ' + date, '上記をツイートしました。');
  } catch(e){
    console.error('エラーが発生\n' + e);
    console.error(response);
    console.error(paste);
    sendLineMessage(e, paste);
  }
}
