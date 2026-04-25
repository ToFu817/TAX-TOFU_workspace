import { motion } from 'framer-motion';
import './TofuCheckbox.css';

export default function TofuCheckbox({ checked, onChange, label, disabled = false }) {
  return (
    <label className={`tofu-checkbox ${disabled ? 'tofu-checkbox--disabled' : ''}`}>
      <motion.div
        className={`tofu-checkbox__box ${checked ? 'tofu-checkbox__box--checked' : ''}`}
        whileTap={{ scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        onClick={(e) => {
          e.preventDefault();
          if (!disabled) onChange(!checked);
        }}
      >
        {checked && (
          <motion.svg
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 600, damping: 15 }}
            width="14"
            height="14"
            viewBox="0 0 14 14"
          >
            <path
              d="M3 7l3 3 5-6"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </motion.div>
      {label && <span className="tofu-checkbox__label">{label}</span>}
    </label>
  );
}
