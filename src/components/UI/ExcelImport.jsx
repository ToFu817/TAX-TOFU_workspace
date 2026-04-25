import { useState, useRef } from 'react';
import TofuButton from './TofuButton';
import { parseExcelFile } from '../../utils/excelParser';
import './ExcelImport.css';

export default function ExcelImport({ onImport, loading = false }) {
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError('');

    try {
      const data = await parseExcelFile(file);
      if (!data.length) {
        setError('檔案中沒有資料');
        return;
      }
      setPreview({ data, count: data.length, columns: Object.keys(data[0]) });
    } catch (err) {
      setError(err.message);
      setPreview(null);
    }
  };

  const handleImport = () => {
    if (preview?.data) {
      onImport(preview.data);
      setPreview(null);
      setFileName('');
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="excel-import">
      <div className="excel-import__upload">
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          className="excel-import__input"
          id="excel-file-input"
        />
        <label htmlFor="excel-file-input" className="excel-import__label">
          <span>📄</span>
          <span>{fileName || '選擇 Excel 檔案 (.xlsx/.xls/.csv)'}</span>
        </label>
      </div>

      {error && <p className="excel-import__error">{error}</p>}

      {preview && (
        <div className="excel-import__preview">
          <p className="excel-import__info">
            將匯入 <strong>{preview.count}</strong> 筆資料，
            欄位：{preview.columns.join('、')}
          </p>
          <TofuButton onClick={handleImport} loading={loading} icon="📥">
            確認匯入
          </TofuButton>
        </div>
      )}
    </div>
  );
}
