import { useState } from 'react';
import { useGasQuery } from '../hooks/useGasQuery';
import { useGasRpc } from '../hooks/useGasRpc';
import { useToast } from '../components/UI/TofuToast';
import { SHEET_NAMES } from '../utils/constants';
import { generateId } from '../utils/helpers';
import TofuTable from '../components/UI/TofuTable';
import TofuButton from '../components/UI/TofuButton';
import TofuModal from '../components/UI/TofuModal';
import TofuInput from '../components/UI/TofuInput';
import ExcelImport from '../components/UI/ExcelImport';
import ConfirmDialog from '../components/UI/ConfirmDialog';

export default function TaskItems() {
  const toast = useToast();
  const { data, loading, refetch } = useGasQuery(SHEET_NAMES.TASK_ITEMS);
  const { add, update, remove, importBatch, loading: mutating } = useGasRpc();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ itemCode: '', itemName: '', category: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [importOpen, setImportOpen] = useState(false);

  const handleOpen = (item = null) => {
    setEditing(item);
    setForm(item ? { ...item } : { itemCode: generateId('IT'), itemName: '', category: '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.itemName) { toast.error('請輸入項目名稱'); return; }
    const result = editing
      ? await update(SHEET_NAMES.TASK_ITEMS, editing.rowIndex, form)
      : await add(SHEET_NAMES.TASK_ITEMS, form);
    if (result.success) {
      toast.success(editing ? '更新成功' : '新增成功');
      setModalOpen(false);
      refetch();
    }
  };

  const handleDelete = async () => {
    const result = await remove(SHEET_NAMES.TASK_ITEMS, deleteTarget.rowIndex);
    if (result.success) { toast.success('刪除成功'); setDeleteTarget(null); refetch(); }
  };

  const handleImport = async (rows) => {
    const result = await importBatch(SHEET_NAMES.TASK_ITEMS, rows);
    if (result.success) { toast.success(result.message); setImportOpen(false); refetch(); }
  };

  const columns = [
    { key: 'itemCode', label: '項目編號', width: '120px' },
    { key: 'itemName', label: '項目名稱' },
    { key: 'category', label: '類別', width: '100px' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <TofuButton onClick={() => handleOpen()} icon="➕">新增項目</TofuButton>
        <TofuButton variant="secondary" onClick={() => setImportOpen(true)} icon="📥">Excel 匯入</TofuButton>
      </div>

      <TofuTable
        columns={columns}
        data={data}
        actions={(row) => (
          <>
            <TofuButton size="sm" variant="ghost" onClick={() => handleOpen(row)}>編輯</TofuButton>
            <TofuButton size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>刪除</TofuButton>
          </>
        )}
      />

      <TofuModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? '編輯任務項目' : '新增任務項目'} onConfirm={handleSave} loading={mutating}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <TofuInput label="項目名稱" value={form.itemName} onChange={(v) => setForm({ ...form, itemName: v })} required />
          <TofuInput label="類別" value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="如：營業稅、帳務、登記" />
        </div>
      </TofuModal>

      <TofuModal isOpen={importOpen} onClose={() => setImportOpen(false)} title="Excel 匯入任務項目" hideFooter>
        <ExcelImport onImport={handleImport} loading={mutating} />
      </TofuModal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="刪除項目" message={`確定要刪除「${deleteTarget?.itemName}」嗎？`} loading={mutating} />
    </div>
  );
}
