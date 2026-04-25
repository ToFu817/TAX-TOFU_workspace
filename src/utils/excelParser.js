import * as XLSX from 'xlsx';

/**
 * 解析上傳的 Excel 檔案，回傳 JSON 陣列
 * @param {File} file - 上傳的檔案
 * @param {string[]} expectedHeaders - 預期的表頭（用於映射）
 * @returns {Promise<Object[]>}
 */
export async function parseExcelFile(file, expectedHeaders = []) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        resolve(jsonData);
      } catch (err) {
        reject(new Error('Excel 檔案解析失敗: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('檔案讀取失敗'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 將資料匯出為 Excel 檔案
 * @param {Object[]} data - 資料陣列
 * @param {string} filename - 檔案名稱（不含副檔名）
 * @param {string} sheetName - 工作表名稱
 */
export function exportToExcel(data, filename, sheetName = 'Sheet1') {
  if (!data?.length) return;
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
