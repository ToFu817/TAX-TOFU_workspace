import { motion } from 'framer-motion';
import './TofuButton.css';

export default function TofuButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  type = 'button',
  className = '',
  style = {},
}) {
  return (
    <motion.button
      type={type}
      className={`tofu-btn tofu-btn--${variant} tofu-btn--${size} ${className}`}
      style={style}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
    >
      {loading ? (
        <span className="tofu-spinner" />
      ) : (
        <>
          {icon && <span className="tofu-btn__icon">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}
