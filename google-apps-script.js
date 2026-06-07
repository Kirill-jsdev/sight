/**
 * GOOGLE APPS SCRIPT — Проект «Счастье Видеть»
 *
 * КАК ЗАДЕПЛОИТЬ:
 * 1. Откройте таблицу → Extensions → Apps Script
 * 2. Вставьте этот код (замените всё содержимое файла Code.gs)
 * 3. Заполните TG_TOKEN и MANAGERS_TG_CHAT_IDS ниже
 * 4. Deploy → New deployment → Web app
 *    - Execute as:      Me
 *    - Who has access:  Anyone
 * 5. Скопируйте URL деплоя и вставьте в script.js в переменную GOOGLE_SCRIPT_URL
 *
 * КОЛОНКИ ТАБЛИЦЫ (создайте заголовки в строке 1):
 * A: ФИО  |  B: Телефон  |  C: Telegram  |  D: Школа  |  E: Тема  |  F: Комментарий  |  G: Дата  |  H: Статус
 */

var TG_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
var MANAGERS_TG_CHAT_IDS = [
  'MANAGER_1_CHAT_ID',
  'MANAGER_2_CHAT_ID'
];

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date();

    // Порядок колонок: ФИО | Телефон | Telegram | Школа | Тема | Комментарий | Дата | Статус
    sheet.appendRow([
      data.name            || '',
      data.mobilePhone     || '',
      data.telegramContact || '',
      data.school          || '',
      data.visitReason     || '',
      data.comment         || '',
      timestamp,
      'Новая заявка'
    ]);

    var message =
      '🔔 *Новая заявка — Счастье Видеть!*\n\n' +
      '👤 *ФИО:* '         + (data.name         || '—') + '\n' +
      '📞 *Телефон:* '     + (data.mobilePhone   || '—') + '\n' +
      '💬 *Telegram:* '    + (data.telegramContact ? data.telegramContact : 'не указан') + '\n' +
      '🏫 *Школа:* '       + (data.school        || '—') + '\n' +
      '🩺 *Тема:* '        + (data.visitReason   || '—') + '\n' +
      '📝 *Комментарий:* ' + (data.comment       || 'не указан');

    MANAGERS_TG_CHAT_IDS.forEach(function (chatId) {
      try {
        if (!chatId || chatId.indexOf('ID_') !== -1 || chatId.indexOf('MANAGER') !== -1) return;

        UrlFetchApp.fetch(
          'https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage',
          {
            method:             'post',
            contentType:        'application/json',
            muteHttpExceptions: true,
            payload: JSON.stringify({
              chat_id:    chatId,
              text:       message,
              parse_mode: 'Markdown'
            })
          }
        );
      } catch (chatError) {
        Logger.log('Ошибка отправки для ID ' + chatId + ': ' + chatError.toString());
      }
    });

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
