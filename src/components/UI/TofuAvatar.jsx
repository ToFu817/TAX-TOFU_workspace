import { motion } from 'framer-motion';
import { getAvatarUrl } from '../../utils/helpers';
import './TofuAvatar.css';

export default function TofuAvatar({ seed, size = 40, style = 'bottts', className = '' }) {
  const url = getAvatarUrl(seed || 'default', style);

  return (
    <motion.div
      className={`tofu-avatar ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <img src={url} alt="avatar" width={size} height={size} loading="lazy" />
    </motion.div>
  );
}
