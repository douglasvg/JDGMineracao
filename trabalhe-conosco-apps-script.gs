const SHEET_ID = '[ID_DA_PLANILHA]';
const DRIVE_FOLDER_ID = '[ID_DA_PASTA_CURRICULOS]';
const EMAIL_RH = '[EMAIL_RH]';
const EMAIL_GESTOR = '[EMAIL_GESTOR]';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (!data.curriculo || !data.nomeArquivo) {
      throw new Error('Currículo em PDF é obrigatório.');
    }

    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const mimeType = 'application/pdf';
    const base64Content = String(data.curriculo).split(',')[1];

    if (!base64Content) {
      throw new Error('Arquivo de currículo inválido.');
    }

    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Content),
      mimeType,
      data.nomeArquivo
    );

    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const linkCurriculo = file.getUrl();

    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    sheet.appendRow([
      new Date(),
      data.nome,
      data.email,
      data.telefone,
      data.cidade,
      data.vaga,
      data.mensagem || '',
      linkCurriculo,
      'Em análise',
    ]);

    const corpoEmail =
      'Nome: ' + data.nome + '\n' +
      'Email: ' + data.email + '\n' +
      'Telefone: ' + data.telefone + '\n' +
      'Cidade: ' + data.cidade + '\n' +
      'Vaga: ' + data.vaga + '\n' +
      'Mensagem: ' + (data.mensagem || '') + '\n' +
      'Currículo: ' + linkCurriculo;

    GmailApp.sendEmail(
      EMAIL_RH + ',' + EMAIL_GESTOR,
      'Nova candidatura — ' + data.vaga,
      corpoEmail
    );

    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: true,
          linkCurriculo: linkCurriculo,
        })
      )
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          error: err.toString(),
        })
      )
      .setMimeType(ContentService.MimeType.JSON);
  }
}
