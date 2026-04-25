export const SHEET_NAMES = {
  TASKS: '工作任務',
  CLIENTS: '客戶資料',
  TASK_ITEMS: '任務項目',
  GROUPS: '群組管理',
  ALLOCATIONS: '客戶分配',
  SOP: '工作標準流程SOP',
  BILLING: '收費資料',
};

export const TASK_STATUS = {
  PENDING: '待處理',
  DELAYED: '延遲中',
  COMPLETED: '已完成',
  REVIEWING: '待審核',
  REVIEWED: '已審核',
};

export const TASK_STATUS_COLORS = {
  '待處理': 'blue',
  '延遲中': 'red',
  '已完成': 'green',
  '待審核': 'purple',
  '已審核': 'gray',
};

export const CLIENT_STATUS = {
  ACTIVE: '在辦中',
  INACTIVE: '已結束',
};

export const CLIENT_STATUS_COLORS = {
  '在辦中': 'green',
  '已結束': 'gray',
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const BILLING_FIELDS = [
  { key: 'clientId', label: '客戶編號' },
  { key: 'companyName', label: '公司行號名稱' },
  { key: 'handler', label: '承辦' },
  { key: 'billingMonth', label: '收費月份' },
  { key: 'amount', label: '收費金額' },
  { key: 'unpaid', label: '待收款' },
  { key: 'paid', label: '已收款' },
  { key: 'paymentDate', label: '收款日期' },
  { key: 'bankAccount', label: '銀行帳戶' },
];
