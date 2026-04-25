import { motion } from 'framer-motion';
import './TofuCard.css';

export default function TofuCard({ children, className = '', onClick, hoverable = true, style = {} }) {
  return (
    <motion.div
      className={`tofu-card ${hoverable ? 'tofu-card--hoverable' : ''} ${className}`}
      style={style}
      onClick={onClick}
      whileHover={hoverable ? { scale: 1.01, y: -2 } : {}}
      whileTap={hoverable && onClick ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
}
