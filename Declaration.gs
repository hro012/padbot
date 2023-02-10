var LINE_TOKEN = getLineToken();
var LINE_NOTIFY_API = "https://notify-api.line.me/api/notify";


function getLineToken() {
  const sheetData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB");
  const record = sheetData.getRange('A1').getValue();
  return record;
}


