/**
 * Paste this whole file into a Google Sheet's Extensions → Apps Script editor.
 * It receives new leads and newsletter subscribers from Supabase and appends
 * them as rows, creating the "Leads" / "Subscribers" tabs (with headers) the
 * first time each is used.
 *
 * Setup: see google-sheets-sync/README.md in this repo.
 */
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var table = payload.table;
    var record = payload.record || {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (table === "leads") {
      var leadsSheet = ss.getSheetByName("Leads") || ss.insertSheet("Leads");
      if (leadsSheet.getLastRow() === 0) {
        leadsSheet.appendRow(["Name", "Email", "Phone", "Message", "Status", "Created At"]);
      }
      leadsSheet.appendRow([
        record.name || "",
        record.email || "",
        record.phone || "",
        record.message || "",
        record.status || "",
        record.created_at || ""
      ]);
    } else if (table === "subscribers") {
      var subsSheet = ss.getSheetByName("Subscribers") || ss.insertSheet("Subscribers");
      if (subsSheet.getLastRow() === 0) {
        subsSheet.appendRow(["Email", "Created At"]);
      }
      subsSheet.appendRow([
        record.email || "",
        record.created_at || ""
      ]);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
