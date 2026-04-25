import { motion } from 'framer-motion';
import './TofuBadge.css';

export default function TofuBadge({ children, color = 'yellow', size = 'md' }) {
  return (
    <motion.span
      className={`tofu-badge tofu-badge--${color} tofu-badge--${size}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
    >
      {children}
    </motion.span>
  );
}
