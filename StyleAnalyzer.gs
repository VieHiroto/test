// スプレッドシートのメニューにカスタムボタンを追加
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('スタイル分析ツール')
    .addItem('画像IDから分析を実行', 'analyzeStyles')
    .addToUi();
}

// メイン処理：A列のIDを読み取ってGeminiで分析
function analyzeStyles() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();

  // 2行目からデータがある最後までループ
  for (let i = 2; i <= lastRow; i++) {
    const imageId = sheet.getRange(i, 1).getValue(); // A列：画像ID
    const status = sheet.getRange(i, 2).getValue();  // B列：ステータス

    // IDがあって、まだ処理していない行のみ実行
    if (imageId && status !== "完了") {
      try {
        processImage(sheet, i, imageId);
      } catch (e) {
        sheet.getRange(i, 2).setValue("エラー: " + e.message);
      }
    }
  }
}

// 1つの画像を処理する関数
function processImage(sheet, row, imageId) {
  // 1. 画像データを取得
  const file = DriveApp.getFileById(imageId);
  const blob = file.getBlob();
  const base64 = Utilities.base64Encode(blob.getBytes());
  const mimeType = blob.getContentType();

  // C列に画像プレビューを表示する数式を入れる
  // (Driveの画像を表示するには工夫が必要ですが、ここでは簡易的にリンクなどを入れるか、サムネイル用URLがあればそれを使います)
  // 今回は簡易的に「処理中...」と表示
  sheet.getRange(row, 2).setValue("分析中...");

  // 2. Gemini Pro Visionへのプロンプト作成
  // ローカルSEO（地域名など）は後でTampermonkeyで足すか、ここで固定値を入れることも可能ですが、
  // 今回は「汎用的なSEO」を意識させます。
  const promptText = `
    あなたは美容室の集客コンサルタントです。
    このヘアスタイルの写真を分析し、ホットペッパービューティーに掲載するためのデータをJSON形式で出力してください。

    【要件】
    1. 性別: "メンズ" または "レディース"
    2. 髪の長さ: "ショート", "ボブ", "ミディアム", "ロング" などから選択
    3. タイトル: 30文字以内。検索されやすいキーワード（小顔、似合わせ、透明感カラーなど）を含め、クリックしたくなる魅力的なタイトルにしてください。
    4. 説明: このスタイルの魅力を伝える50文字程度の文章。

    【出力フォーマット（JSONのみ）】
    {
      "gender": "性別",
      "length": "髪の長さ",
      "title": "タイトル",
      "description": "説明文"
    }
  `;

  // 3. APIリクエスト
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload = {
    "contents": [{
      "parts": [
        { "text": promptText },
        {
          "inline_data": {
            "mime_type": mimeType,
            "data": base64
          }
        }
      ]
    }]
  };

  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());

  // 4. 結果の解析と書き込み
  if (json.candidates && json.candidates[0].content) {
    const resultText = json.candidates[0].content.parts[0].text;

    // JSON部分だけ抽出（Markdownのコードブロック ```json ... ``` を除去）
    const cleanJson = resultText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanJson);

    // シートに書き込み
    sheet.getRange(row, 4).setValue(data.gender);       // D列：性別
    sheet.getRange(row, 5).setValue(data.length);       // E列：髪の長さ
    sheet.getRange(row, 6).setValue(data.title);        // F列：タイトル
    sheet.getRange(row, 7).setValue(data.description);  // G列：説明

    sheet.getRange(row, 2).setValue("完了");            // B列：ステータス

    // 画像プレビュー用のセル関数（ドライブの画像をセル内に表示）
    // ※注意: Drive画像をIMAGE関数で表示するには公開設定が必要な場合が多いですが、
    // 運用上、確認用としてファイルURLをセットしておきます。
    sheet.getRange(row, 3).setFormula(`=HYPERLINK("${file.getUrl()}", "画像を開く")`);

  } else {
    throw new Error("Geminiからの応答が不正です: " + JSON.stringify(json));
  }
}
