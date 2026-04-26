import { useMemo } from 'react';
import TofuCard from '../components/UI/TofuCard';
import { useAuth } from '../contexts/AuthContext';
import { useGasQuery } from '../hooks/useGasQuery';
import { SHEET_NAMES } from '../utils/constants';
import { inputFormatDate } from '../utils/helpers';
import './Dashboard.css';

const STAT_CARDS = [
  { key: 'pending', label: '待處理', icon: '📋' },
  { key: 'delayed', label: '延遲中', icon: '⏰' },
  { key: 'completed', label: '已完成', icon: '✅' },
  { key: 'reviewing', label: '待審核', icon: '🔍' },
  { key: 'reviewed', label: '已審核', icon: '✨' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: tasks = [], loading: loadingTasks } = useGasQuery(SHEET_NAMES.TASKS);
  const { data: annualTasks = [] } = useGasQuery(SHEET_NAMES.ANNUAL);
  const { data: clients = [] } = useGasQuery(SHEET_NAMES.CLIENTS);

  const stats = useMemo(() => {
    const targetName = String(user?.employeeName || '').trim();
    // 篩選出屬於登入者的案件
    const myTasks = tasks.filter(t => String(t.handler || '').trim() === targetName);
    
    const counts = { pending: 0, delayed: 0, completed: 0, reviewing: 0, reviewed: 0 };
    myTasks.forEach(t => {
      const s = String(t.status || '').trim();
      if (s === '已審核') counts.reviewed++;
      else if (s === '待審核') counts.reviewing++;
      else if (s === '已完成') counts.completed++;
      else if (s === '延遲中') counts.delayed++;
      else counts.pending++;
    });

    // 計算緊急任務 (延遲中 或 7天內)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const future7d = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const urgentTasks = myTasks.filter(t => {
      const s = String(t.status || '').trim();
      if (['已完成', '待審核', '已審核'].includes(s)) return false;
      
      if (s === '延遲中') return true;
      
      if (t.dueDate) {
        const d = new Date(t.dueDate);
        return !isNaN(d.getTime()) && d <= future7d;
      }
      return false;
    }).sort((a, b) => {
      if (a.status === '延遲中' && b.status !== '延遲中') return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    // 年度目標
    const currentMonth = new Date().getMonth() + 1;
    const monthlyGoals = annualTasks
      .filter(a => String(a.month) === String(currentMonth))
      .map(a => a.annualTask);

    return { 
      ...counts, 
      urgentTasks, 
      monthlyGoals,
      totalClients: clients.length,
      unassignedClients: clients.filter(c => !c.handler || String(c.unallocated).trim() === '是').length
    };
  }, [tasks, annualTasks, clients, user]);

  if (loadingTasks) {
    return (
      <div className="dashboard-loading">
        <div className="tofu-spinner" style={{ width: 40, height: 40 }} />
        <p>載入中...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 className="dashboard__title">歡迎回來，{user?.employeeName}</h1>
          <p className="dashboard__subtitle">這是您個人的工作看板</p>
        </div>
        <div style={{ 
          padding: '8px 16px', 
          borderRadius: '30px', 
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: import.meta.env.VITE_GAS_URL ? '#e6fffa' : '#fffaf0',
          color: import.meta.env.VITE_GAS_URL ? '#2c7a7b' : '#9c4221',
          border: `1px solid ${import.meta.env.VITE_GAS_URL ? '#b2f5ea' : '#feebc8'}`
        }}>
          {import.meta.env.VITE_GAS_URL ? '🟢 正式連線' : '🟡 測試模式'}
        </div>
      </header>

      <div className="dashboard__stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {STAT_CARDS.map((card) => (
          <TofuCard key={card.key} className={`stat-card stat-card--${card.key}`}>
            <div className="stat-card__icon" style={{ fontSize: '24px', marginBottom: '10px' }}>{card.icon}</div>
            <div className="stat-card__content">
              <div className="stat-card__value" style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats[card.key] || 0}</div>
              <div className="stat-card__label" style={{ color: '#666', fontSize: '14px' }}>{card.label}</div>
            </div>
          </TofuCard>
        ))}
      </div>

      <div className="dashboard__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        <TofuCard className="summary-card">
          <div className="summary-card__header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            <span style={{ fontSize: '20px' }}>🔥</span>
            <h3 style={{ margin: 0 }}>我的緊急任務</h3>
          </div>
          <div className="summary-card__body">
            <div className="monthly-goals" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
              {stats.urgentTasks.map((task, i) => (
                <div key={i} className="monthly-goal-item" style={{ borderBottom: '1px solid #f5f5f5', paddingBottom: '15px', marginBottom: '15px' }}>
                  <span className="goal-bullet" style={{ color: task.status === '延遲中' ? '#e74c3c' : '#f39c12', fontSize: '18px' }}>•</span>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div className="goal-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 'bold', fontSize: '15px', color: '#333' }}>
                      {task.taskItem}
                    </div>
                    <div style={{ fontSize: '13px', color: '#777', marginTop: '4px' }}>
                      🏢 {task.companyName}
                    </div>
                    <div style={{ fontSize: '12px', color: task.status === '延遲中' ? '#e74c3c' : '#888', marginTop: '6px', fontWeight: '500' }}>
                      {task.status === '延遲中' ? `已延遲 (期限: ${inputFormatDate(task.dueDate)})` : `⏳ 期限: ${inputFormatDate(task.dueDate)}`}
                    </div>
                  </div>
                </div>
              ))}
              {stats.urgentTasks.length === 0 && (
                <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>目前沒有緊急或延遲的任務，太棒了！🎉</p>
              )}
            </div>
          </div>
        </TofuCard>

        <TofuCard className="summary-card">
          <div className="summary-card__header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            <span style={{ fontSize: '20px' }}>📅</span>
            <h3 style={{ margin: 0 }}>本月年度任務</h3>
          </div>
          <div className="summary-card__body">
            <div className="monthly-goals" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {stats.monthlyGoals.map((goal, i) => (
                <div key={i} className="monthly-goal-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span className="goal-bullet" style={{ color: '#3498db' }}>•</span>
                  <span className="goal-text" style={{ fontSize: '14px', color: '#444' }}>{goal}</span>
                </div>
              ))}
              {stats.monthlyGoals.length === 0 && (
                <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>本月無特殊年度任務</p>
              )}
            </div>
          </div>
        </TofuCard>
      </div>
    </div>
  );
}
