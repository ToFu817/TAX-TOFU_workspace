import { useState } from 'react';
import { motion } from 'framer-motion';
import TofuCard from '../components/UI/TofuCard';
import TofuBadge from '../components/UI/TofuBadge';
import { ANNUAL_SCHEDULE, MONTH_NAMES } from '../utils/constants';
import './AnnualSchedule.css';

const monthColors = [
  'pink', 'purple', 'blue', 'green', 'yellow', 'orange',
  'pink', 'purple', 'blue', 'green', 'yellow', 'orange',
];

export default function AnnualSchedule() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="schedule-page">
      <div className="schedule-page__header">
        <h2>📅 {new Date().getFullYear()} 年度日程計畫</h2>
        <p>會計師事務所年度例行工作安排</p>
      </div>

      <div className="schedule-grid stagger-children">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
          const tasks = ANNUAL_SCHEDULE[month] || [];
          const isCurrentMonth = month === currentMonth;
          const isSelected = month === selectedMonth;

          return (
            <motion.div
              key={month}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <TofuCard
                className={`schedule-card ${isCurrentMonth ? 'schedule-card--current' : ''} ${isSelected ? 'schedule-card--selected' : ''}`}
                onClick={() => setSelectedMonth(month)}
              >
                <div className="schedule-card__header">
                  <span className="schedule-card__month">{MONTH_NAMES[month - 1]}</span>
                  {isCurrentMonth && (
                    <TofuBadge color="green" size="sm">本月</TofuBadge>
                  )}
                  <TofuBadge color={monthColors[month - 1]} size="sm">
                    {tasks.length} 項
                  </TofuBadge>
                </div>
                <ul className="schedule-card__tasks">
                  {tasks.map((task, i) => (
                    <motion.li
                      key={i}
                      className="schedule-task"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <span className="schedule-task__dot" style={{ background: `var(--color-${monthColors[month - 1]}-deep)` }} />
                      <span className="schedule-task__text">{task}</span>
                    </motion.li>
                  ))}
                </ul>
              </TofuCard>
            </motion.div>
          );
        })}
      </div>

      {/* Detail view for selected month */}
      <TofuCard className="schedule-detail" hoverable={false}>
        <h3 className="schedule-detail__title">
          {MONTH_NAMES[selectedMonth - 1]} 工作項目明細
        </h3>
        <div className="schedule-detail__list">
          {(ANNUAL_SCHEDULE[selectedMonth] || []).map((task, i) => (
            <motion.div
              key={i}
              className="schedule-detail__item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="schedule-detail__number">{i + 1}</div>
              <div className="schedule-detail__content">
                <span className="schedule-detail__task">{task}</span>
                <span className="schedule-detail__note">
                  {task.includes('營業稅') && '📌 每雙月15日前申報'}
                  {task.includes('結算申報') && '📌 每年5月31日前'}
                  {task.includes('扣繳') && '📌 每年1月31日前'}
                  {task.includes('健保') && '📌 每年2月底前'}
                  {task.includes('暫繳') && '📌 每年9月30日前'}
                </span>
              </div>
            </motion.div>
          ))}
          {(ANNUAL_SCHEDULE[selectedMonth] || []).length === 0 && (
            <p className="schedule-detail__empty">本月無排定工作項目</p>
          )}
        </div>
      </TofuCard>
    </div>
  );
}
