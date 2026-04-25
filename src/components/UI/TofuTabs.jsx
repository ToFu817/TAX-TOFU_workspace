import { motion } from 'framer-motion';
import './TofuTabs.css';

export default function TofuTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="tofu-tabs">
      {tabs.map((tab) => (
        <motion.button
          key={tab.key}
          className={`tofu-tab ${activeTab === tab.key ? 'tofu-tab--active' : ''}`}
          onClick={() => onChange(tab.key)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          {tab.icon && <span className="tofu-tab__icon">{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span className="tofu-tab__count">{tab.count}</span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
