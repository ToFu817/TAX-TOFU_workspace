import { useState, useMemo } from 'react';
import { useGasQuery } from '../hooks/useGasQuery';
import { useGasRpc } from '../hooks/useGasRpc';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/UI/TofuToast';
import { SHEET_NAMES, BILLING_FIELDS } from '../utils/constants';
import { formatCurrency, autoFillClientData, generateId } from '../utils/helpers';
import TofuTable from '../components/UI/TofuTable';
import TofuButton from '../components/UI/TofuButton';
import TofuModal from '../components/UI/TofuModal';
import TofuInput from '../components/UI/TofuInput';
import TofuSelect from '../components/UI/TofuSelect';
import TofuBadge from '../components/UI/TofuBadge';
import TofuCard from '../components/UI/TofuCard';
import TofuTabs from '../components/UI/TofuTabs';
import TofuAvatar from '../components/UI/TofuAvatar';
import ExcelImport from '../components/UI/ExcelImport';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import './BillingData.css';

export default function BillingData() {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const { data, loading, refetch } = useGasQuery(SHEET_NAMES.BILLING);
  const { data: clients } = useGasQuery(SHEET_NAMES.CLIENTS);
  const { data: employees } = useGasQuery(SHEET_NAMES.GROUPS);
  const { add, update, remove, importBatch, loading: mutating } = useGasRpc();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Stats
  const stats = useMemo(() => {
    const byHandler = {};
    let totalAmount = 0;
    let totalPaid = 0;
    let totalUnpaid = 0;

    data.forEach((row) => {
      const amount = Number(row.amount) || 0;
      const paid = Number(row.paid) || 0;
      const unpaid = Number(row.unpaid) || 0;
      totalAmount += amount;
      totalPaid += paid;
      totalUnpaid += unpaid;

      const handler = row.handler || '未指定';
      if (!byHandler[handler]) byHandler[handler] = { total: 0, paid: 0, unpaid: 0, count: 0 };
      byHandler[handler].total += amount;
      byHandler[handler].paid += paid;
      byHandler[handler].unpaid += unpaid;
      byHandler[handler].count += 1;
    });

    return { totalAmount, totalPaid, totalUnpaid, byHandler };
  }, [data]);

  const unpaidList = useMemo(() => data.filter((r) => Number(r.unpaid) > 0), [data]);

  const filteredData = useMemo(() => {
    if (activeTab === 'all') return data;
    if (activeTab === 'unpaid') return unpaidList;
    if (activeTab === 'paid') return data.filter((r) => Number(r.unpaid) === 0 && Number(r.paid) > 0);
    return data;
  }, [data, activeTab, unpaidList]);

  const handleOpen = (item = null) => {
    setEditing(item);
    if (item) {
      setForm({ ...item });
    } else {
      const empty = {};
      BILLING_FIELDS.forEach((f) => { empty[f.key] = ''; });
      setForm(empty);
    }
    setModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'clientId') {
        const filled = autoFillClientData(value, clients);
        Object.assign(updated, filled);
      }
      return updated;
    });
  };

  const handleSave = async () => {
    if (!form.clientId) { toast.error('請填寫客戶編號'); return; }
    const result = editing
      ? await update(SHEET_NAMES.BILLING, editing.rowIndex, form)
      : await add(SHEET_NAMES.BILLING, form);
    if (result.success) { toast.success(editing ? '更新成功' : '新增成功'); setModalOpen(false); refetch(); }
  };

  const handleDelete = async () => {
    const result = await remove(SHEET_NAMES.BILLING, deleteTarget.rowIndex);
    if (result.success) { toast.success('刪除成功'); setDeleteTarget(null); refetch(); }
  };

  const handleImport = async (rows) => {
    const result = await importBatch(SHEET_NAMES.BILLING, rows);
    if (result.success) { toast.success(result.message); setImportOpen(false); refetch(); }
  };

  const handlerOptions = employees.map((e) => ({ value: e.employeeName, label: e.employeeName }));

  const tabs = [
    { key: 'all', label: '全部', count: data.length },
    { key: 'unpaid', label: '待收款', count: unpaidList.length },
    { key: 'paid', label: '已收款', count: data.filter((r) => Number(r.unpaid) === 0 && Number(r.paid) > 0).length },
  ];

  const columns = [
    { key: 'clientId', label: '客戶編號', width: '90px' },
    { key: 'companyName', label: '公司行號', minWidth: '140px' },
    { key: 'handler', label: '承辦', width: '80px' },
    { key: 'billingMonth', label: '收費月份', width: '100px' },
    { key: 'amount', label: '收費金額', width: '100px', render: (v) => formatCurrency(v) },
    { key: 'paid', label: '已收款', width: '100px', render: (v) => <span style={{ color: '#3A6B3A' }}>{formatCurrency(v)}</span> },
    { key: 'unpaid', label: '待收款', width: '100px', render: (v) => Number(v) > 0 ? <span style={{ color: '#D4726A', fontWeight: 700 }}>{formatCurrency(v)}</span> : '0' },
    { key: 'paymentDate', label: '收款日期', width: '100px' },
  ];

  return (
    <div className="billing-page">
      {/* Overview Stats */}
      {isAdmin && (
        <div className="billing-stats stagger-children">
          <TofuCard className="billing-stat-card">
            <span className="billing-stat-icon">💰</span>
            <span className="billing-stat-label">總收費</span>
            <span className="billing-stat-value">${formatCurrency(stats.totalAmount)}</span>
          </TofuCard>
          <TofuCard className="billing-stat-card billing-stat-card--green">
            <span className="billing-stat-icon">✅</span>
            <span className="billing-stat-label">已收款</span>
            <span className="billing-stat-value">${formatCurrency(stats.totalPaid)}</span>
          </TofuCard>
          <TofuCard className="billing-stat-card billing-stat-card--red">
            <span className="billing-stat-icon">⏳</span>
            <span className="billing-stat-label">待收款</span>
            <span className="billing-stat-value">${formatCurrency(stats.totalUnpaid)}</span>
          </TofuCard>
        </div>
      )}

      {/* Handler Performance */}
      {isAdmin && Object.keys(stats.byHandler).length > 0 && (
        <TofuCard hoverable={false}>
          <h3 style={{ marginBottom: 'var(--space-md)', fontWeight: 700, color: 'var(--color-wood-dark)' }}>
            📊 各承辦業績
          </h3>
          <div className="billing-handler-grid">
            {Object.entries(stats.byHandler).map(([handler, s]) => (
              <div key={handler} className="billing-handler-item">
                <TofuAvatar seed={handler} size={32} />
                <div className="billing-handler-info">
                  <span className="billing-handler-name">{handler}</span>
                  <span className="billing-handler-detail">
                    {s.count} 筆 | 總額 ${formatCurrency(s.total)} | 已收 ${formatCurrency(s.paid)}
                  </span>
                </div>
                {s.unpaid > 0 && (
                  <TofuBadge color="pink" size="sm">待收 ${formatCurrency(s.unpaid)}</TofuBadge>
                )}
              </div>
            ))}
          </div>
        </TofuCard>
      )}

      <div className="billing-toolbar">
        <TofuButton onClick={() => handleOpen()} icon="➕">新增收費</TofuButton>
        {isAdmin && (
          <TofuButton variant="secondary" onClick={() => setImportOpen(true)} icon="📥">Excel 匯入</TofuButton>
        )}
      </div>

      <TofuTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <TofuTable
        columns={columns}
        data={filteredData}
        actions={(row) => (
          <>
            <TofuButton size="sm" variant="ghost" onClick={() => handleOpen(row)}>編輯</TofuButton>
            <TofuButton size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>刪除</TofuButton>
          </>
        )}
      />

      <TofuModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? '編輯收費' : '新增收費'} onConfirm={handleSave} loading={mutating}>
        <div className="modal-form-grid">
          <TofuInput label="客戶編號" value={form.clientId || ''} onChange={(v) => handleFormChange('clientId', v)} placeholder="輸入自動帶入公司名稱" required />
          <TofuInput label="公司行號名稱" value={form.companyName || ''} onChange={(v) => handleFormChange('companyName', v)} disabled />
          <TofuSelect label="承辦" value={form.handler || ''} onChange={(v) => handleFormChange('handler', v)} options={handlerOptions} />
          <TofuInput label="收費月份" value={form.billingMonth || ''} onChange={(v) => handleFormChange('billingMonth', v)} placeholder="如：2026/01" />
          <TofuInput label="收費金額" value={form.amount || ''} onChange={(v) => handleFormChange('amount', v)} type="number" />
          <TofuInput label="待收款" value={form.unpaid || ''} onChange={(v) => handleFormChange('unpaid', v)} type="number" />
          <TofuInput label="已收款" value={form.paid || ''} onChange={(v) => handleFormChange('paid', v)} type="number" />
          <TofuInput label="收款日期" value={form.paymentDate || ''} onChange={(v) => handleFormChange('paymentDate', v)} type="date" />
          <TofuInput label="銀行帳戶" value={form.bankAccount || ''} onChange={(v) => handleFormChange('bankAccount', v)} />
        </div>
      </TofuModal>

      <TofuModal isOpen={importOpen} onClose={() => setImportOpen(false)} title="Excel 匯入收費資料" hideFooter>
        <ExcelImport onImport={handleImport} loading={mutating} />
      </TofuModal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="刪除收費" message={`確定要刪除「${deleteTarget?.companyName}」的收費紀錄嗎？`} loading={mutating} />
    </div>
  );
}
