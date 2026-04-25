/**
 * ============================================
 * AccLaw 會計師案件管理系統 — Google Apps Script 後端 (匯入修復版)
 * ============================================
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const FIELD_MAP = {
  'employeeId': '員工編號', 'employeeName': '員工姓名', 'title': '職稱', 'role': '權限', 'username': '帳號', 'password': '密碼',
  'clientId': '客戶編號', 'orgType': '組織型態', 'companyName': '公司行號名稱', 'handler': '承辦', 'status': '目前狀態',
  'yearNote': '年度註記', 'taxId': '統一編號', 'taxRegId': '稅藉編號', 'zipCode': '郵遞區號', 'contactAddress': '聯絡地址',
  'regAddress': '營業登記地址', 'owner': '負責人', 'contactPerson': '聯絡人', 'mailPhone': '郵寄電話', 'deliveryMethod': '送件方式',
  'pickupMethod': '取件方式', 'companyPhone': '公司電話', 'contactMobile': '聯絡人手機', 'email': 'Email', 'taxExt': '國稅局分機',
  'note': '備忘錄', 'taxPassword': '稅務申報密碼', 'healthInsCode': '健保投保代號', 
  'taskId': '任務編號', 'taskItem': '任務項目', 'dueDate': '預計完成日', 'completedDate': '實際完成日',
  'reviewer': '審核人', 'reviewDate': '審核日期',
  'itemCode': '項目編號', 'itemName': '項目名稱', 'category': '類別'
};

function doPost(e) {
  const req = JSON.parse(e.postData.contents);
  const { action, params: p = {} } = req;
  try {
    switch (action) {
      case 'login': return res(handleLogin(p));
      case 'getData': return res(handleGetData(p));
      case 'addRow': return res(handleAddRow(p));
      case 'updateRow': return res(handleUpdateRow(p));
      case 'deleteRow': return res(handleDeleteRow(p));
      case 'batchImport': return res(handleBatchImport(p));
      case 'completeTask': return res(handleCompleteTask(p));
      case 'reviewTask': return res(handleReviewTask(p));
      case 'getDashboardStats': return res(handleGetDashboardStats());
      default: return res({ status: 'error', message: '未知動作' });
    }
  } catch (err) {
    return res({ status: 'error', message: err.toString() });
  }
}

function handleBatchImport(p) {
  const sheet = getSheet(p.sheetName);
  const hs = getHeaders(sheet);
  const existing = getSheetData(sheet);
  const idKey = p.sheetName === '客戶資料' ? 'clientId' : (p.sheetName === '工作任務' ? 'taskId' : null);

  p.rows.forEach(newRow => {
    // 1. 尋找現有對象
    const match = idKey ? existing.find(e => String(e[idKey]).trim() === String(newRow[idKey]).trim()) : null;

    if (match) {
      // 2. 合併資料 (取代舊資訊)
      let updateData = { ...match };
      
      // 遍歷所有可能欄位，如果是空值就不蓋，有新值才蓋
      Object.keys(newRow).forEach(key => {
        // 如果是客戶資料，保護「承辦」欄位，不被 Excel 蓋掉
        if (p.sheetName === '客戶資料' && key === 'handler') return;
        
        // 只有 Excel 有值的才寫入，避免清空原本資料欄位
        if (newRow[key] !== undefined && newRow[key] !== '') {
          updateData[key] = newRow[key];
        }
      });

      sheet.getRange(match.rowIndex, 1, 1, hs.length).setValues([mapDataToRow(hs, updateData)]);
    } else {
      // 3. 全新資料直接新增
      sheet.appendRow(mapDataToRow(hs, newRow));
    }
  });
  return { status: 'success', message: '匯入並更新完成' };
}

// --- 底層邏輯維持不變，僅部分優化 ---
function getSheet(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let s = ss.getSheetByName(name);
  if (!s) s = ss.insertSheet(name);
  return s;
}
function getHeaders(sheet) { return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; }
// 強化版的標題對應邏輯
function getInternalKey(header) {
  // 先找精確匹配
  const exact = Object.keys(FIELD_MAP).find(k => FIELD_MAP[k] === header);
  if (exact) return exact;
  
  // 處理常見同義詞
  if (header === '狀態' || header === '目前狀態') return 'status';
  if (header === '聯絡地址(發票寄送地址)' || header === '聯絡地址') return 'contactAddress';
  if (header === '任務項目' || header === '任務項目清單') return 'taskItem';
  
  return header;
}

function getSheetData(sheet) {
  if (sheet.getLastRow() < 2) return [];
  const hs = getHeaders(sheet);
  const vs = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  return vs.map((row, i) => {
    const obj = { rowIndex: i + 2 };
    hs.forEach((h, j) => {
      const key = getInternalKey(h);
      obj[key] = row[j];
    });
    return obj;
  });
}
function mapDataToRow(headers, obj) {
  return headers.map(h => {
    const key = getInternalKey(h);
    return obj[key] !== undefined ? obj[key] : '';
  });
}
function handleGetData(p) {
  const sheet = getSheet(p.sheetName);
  let data = getSheetData(sheet);
  if (p.sheetName === '客戶資料') {
    data.sort((a, b) => (parseInt(String(a.clientId).replace(/\D/g, '')) || 0) - (parseInt(String(b.clientId).replace(/\D/g, '')) || 0));
  }
  return { status: 'success', data };
}
function handleAddRow(p) {
  const sheet = getSheet(p.sheetName);
  sheet.appendRow(mapDataToRow(getHeaders(sheet), p.rowData));
  return { status: 'success' };
}
function handleUpdateRow(p) {
  const sheet = getSheet(p.sheetName);
  const hs = getHeaders(sheet);
  sheet.getRange(p.rowIndex, 1, 1, hs.length).setValues([mapDataToRow(hs, p.rowData)]);
  return { status: 'success' };
}
function handleDeleteRow(p) { getSheet(p.sheetName).deleteRow(p.rowIndex); return { status: 'success' }; }
function handleLogin(p) {
  const data = getSheetData(getSheet('群組管理'));
  const user = data.find(u => u.username === p.username && u.password === p.password);
  return user ? { status: 'success', data: user } : { status: 'error' };
}
function handleCompleteTask(p) {
  const sheet = getSheet('工作任務');
  const hs = getHeaders(sheet);
  const task = getSheetData(sheet).find(t => String(t.taskId) === String(p.taskId));
  if (!task) return { status: 'error' };
  const now = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy/MM/dd');
  const up = { ...task, status: '已完成', completedDate: now };
  sheet.getRange(task.rowIndex, 1, 1, hs.length).setValues([mapDataToRow(hs, up)]);
  return { status: 'success' };
}
function handleReviewTask(p) {
  const sheet = getSheet('工作任務');
  const hs = getHeaders(sheet);
  const task = getSheetData(sheet).find(t => String(t.taskId) === String(p.taskId));
  if (!task) return { status: 'error' };
  const now = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy/MM/dd');
  const up = { ...task, status: '已審核', reviewer: p.reviewedBy, reviewDate: now };
  sheet.getRange(task.rowIndex, 1, 1, hs.length).setValues([mapDataToRow(hs, up)]);
  return { status: 'success' };
}
function handleGetDashboardStats() {
  const tasks = getSheetData(getSheet('工作任務'));
  return { status: 'success', data: {
    pending: tasks.filter(t => t.status === '待處理').length,
    delayed: tasks.filter(t => t.status === '延遲中').length,
    completed: tasks.filter(t => t.status === '已完成').length,
    reviewing: tasks.filter(t => t.status === '待審核').length,
    reviewed: tasks.filter(t => t.status === '已審核').length,
    totalClients: getSheetData(getSheet('客戶資料')).length
  }};
}
function res(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
