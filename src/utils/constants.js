// 任務狀態
export const TASK_STATUS = {
  PENDING: '待處理',
  DELAYED: '延遲中',
  COMPLETED: '已完成',
  REVIEWING: '待審核',
  REVIEWED: '已審核',
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.PENDING]: 'yellow',
  [TASK_STATUS.DELAYED]: 'pink',
  [TASK_STATUS.COMPLETED]: 'green',
  [TASK_STATUS.REVIEWING]: 'blue',
  [TASK_STATUS.REVIEWED]: 'purple',
};

// 客戶狀態
export const CLIENT_STATUS = {
  ACTIVE: '營業中',
  SUSPENDED: '停業',
  CLOSED: '歇業',
  NO_INVOICE: '免用發票',
};

export const CLIENT_STATUS_COLORS = {
  [CLIENT_STATUS.ACTIVE]: 'green',
  [CLIENT_STATUS.SUSPENDED]: 'yellow',
  [CLIENT_STATUS.CLOSED]: 'pink',
  [CLIENT_STATUS.NO_INVOICE]: 'purple',
};

// 權限
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// 組織型態
export const ORG_TYPES = [
  '獨資',
  '合夥',
  '有限公司',
  '股份有限公司',
  '其他',
];

// 側邊欄導航
export const NAV_ITEMS = [
  { key: 'dashboard', label: '儀表板', icon: '📊', path: '/dashboard' },
  { key: 'tasks', label: '任務管理', icon: '📋', path: '/tasks' },
  { key: 'task-items', label: '任務項目', icon: '📝', path: '/task-items' },
  { key: 'groups', label: '群組管理', icon: '👥', path: '/groups' },
  { key: 'clients', label: '客戶資料', icon: '🏢', path: '/clients' },
  { key: 'allocation', label: '客戶分配', icon: '🔀', path: '/allocation' },
  { key: 'sop', label: '工作流程SOP', icon: '⚙️', path: '/sop' },
  { key: 'billing', label: '收費資料', icon: '💰', path: '/billing' },
  { key: 'schedule', label: '年度日程', icon: '📅', path: '/schedule' },
];

// 預設任務項目
export const DEFAULT_TASK_ITEMS = [
  '01-02月營業稅申報',
  '03-04月營業稅申報',
  '05-06月營業稅申報',
  '07-08月營業稅申報',
  '09-10月營業稅申報',
  '11-12月營業稅申報',
  '01-02月帳務處理',
  '03-04月帳務處理',
  '05-06月帳務處理',
  '07-08月帳務處理',
  '09-10月帳務處理',
  '11-12月帳務處理',
  '01-02月統購發票寄送',
  '03-04月統購發票寄送',
  '05-06月統購發票寄送',
  '07-08月統購發票寄送',
  '09-10月統購發票寄送',
  '11-12月統購發票寄送',
  '單月底統購發票',
  '各類所得扣繳申報作業',
  '二代健保申報',
  '股東平台申報',
  '會計師稅務簽證資料準備',
  '結算申報編製作業',
  '營所稅結算申報',
  '綜合所得稅結算申報',
  '營所稅預估暫繳申報',
  '上年度未分配盈餘+股利二代前置作業',
  '扣繳申報前置作業',
  '工商登記',
  '會計師資本簽證',
  '個人專案',
];

// 年度日程
export const ANNUAL_SCHEDULE = {
  1: [
    '11-12月營業稅申報',
    '各類所得扣繳申報作業',
  ],
  2: [
    '二代健保申報',
    '11-12月帳務處理',
    '03-04月統購發票寄送',
  ],
  3: [
    '01-02月營業稅申報',
    '股東平台申報',
    '營所稅結算申報編製作業',
    '會計師簽證資料準備',
  ],
  4: [
    '營所稅結算申報編製作業',
    '會計師簽證資料準備',
    '05-06月統購發票寄送',
  ],
  5: [
    '03-04月份營業稅申報',
    '營所稅結算申報',
    '綜合所得稅結算申報',
    '稅務簽證報告書簽證作業',
  ],
  6: [
    '01-04月份帳務處理',
    '07-08月統購發票寄送',
    '財務簽證報告書簽證作業',
  ],
  7: [
    '05-06月營業稅申報',
    '05-06月份帳務處理',
  ],
  8: [
    '05-06月份帳務處理',
    '09-10月統購發票寄送',
  ],
  9: [
    '07-08月營業稅申報',
    '07-08月份帳務處理',
    '營所稅預估暫繳申報',
  ],
  10: [
    '07-08月份帳務處理',
    '11-12月統購發票寄送',
    '上年度未分配盈餘+股利二代前置作業',
  ],
  11: [
    '9-10月營業稅申報',
    '9-10月份帳務處理',
    '各類所得扣繳申報資料調查',
  ],
  12: [
    '9-10月份帳務處理',
    '01-02月統購發票寄送',
    '扣繳申報前置作業',
  ],
};

// 月份名稱
export const MONTH_NAMES = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
];

// 預設 SOP
export const DEFAULT_SOPS = [
  {
    name: '工商登記流程',
    steps: [
      '客戶訪談',
      '名稱及營業項目預查',
      '印章刻印',
      '資料準備',
      '會計師資本簽證',
      '市政府登記',
      '發票章',
      '國稅局登記',
      '負責人簽名',
      '請領購票證',
      '統購申請及購買發票',
      '客戶交接',
      '資料建檔',
      '主管審核',
    ],
  },
];

// Google Sheets 工作表名稱
export const SHEET_NAMES = {
  GROUPS: '群組管理',
  CLIENTS: '客戶資料',
  ALLOCATION: '客戶分配',
  TASKS: '工作任務',
  TASK_ITEMS: '任務項目',
  SOP: '工作標準流程SOP',
  BILLING: '收費資料',
  SCHEDULE: '年度日程',
};

// 客戶資料欄位定義
export const CLIENT_FIELDS = [
  { key: 'clientId', label: '客戶編號', required: true, group: 'basic' },
  { key: 'orgType', label: '組織型態', type: 'select', options: ORG_TYPES, group: 'basic' },
  { key: 'companyName', label: '公司行號名稱', required: true, group: 'basic' },
  { key: 'handler', label: '承辦', group: 'basic' },
  { key: 'status', label: '目前狀態', type: 'select', options: Object.values(CLIENT_STATUS), group: 'basic' },
  { key: 'yearNote', label: '年度註記', group: 'basic' },
  { key: 'taxId', label: '統一編號', group: 'tax' },
  { key: 'taxRegId', label: '稅藉編號', group: 'tax' },
  { key: 'zipCode', label: '郵遞區號', group: 'contact' },
  { key: 'contactAddress', label: '聯絡地址(發票寄送地址)', group: 'contact' },
  { key: 'regAddress', label: '營業登記地址', group: 'contact' },
  { key: 'owner', label: '負責人', group: 'contact' },
  { key: 'contactPerson', label: '聯絡人', group: 'contact' },
  { key: 'mailPhone', label: '郵寄電話', group: 'contact' },
  { key: 'deliveryMethod', label: '送件方式', group: 'contact' },
  { key: 'pickupMethod', label: '取件方式', group: 'contact' },
  { key: 'companyPhone', label: '公司電話', group: 'contact' },
  { key: 'contactMobile', label: '聯絡人手機', group: 'contact' },
  { key: 'email', label: 'Email', group: 'contact' },
  { key: 'taxExt', label: '國稅局分機', group: 'tax' },
  { key: 'note', label: '備註', type: 'textarea', group: 'other' },
  { key: 'taxPassword', label: '稅務申報密碼', group: 'tax' },
  { key: 'healthInsCode', label: '健保投保代號', group: 'tax' },
];

// 收費資料欄位
export const BILLING_FIELDS = [
  { key: 'clientId', label: '客戶編號', required: true },
  { key: 'companyName', label: '公司行號名稱' },
  { key: 'handler', label: '承辦' },
  { key: 'billingMonth', label: '收費月份' },
  { key: 'amount', label: '收費金額', type: 'number' },
  { key: 'unpaid', label: '待收款', type: 'number' },
  { key: 'paid', label: '已收款', type: 'number' },
  { key: 'paymentDate', label: '收款日期', type: 'date' },
  { key: 'bankAccount', label: '銀行帳戶' },
];
