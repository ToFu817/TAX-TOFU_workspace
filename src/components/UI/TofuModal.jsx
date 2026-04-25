import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TofuButton from './TofuButton';
import './TofuModal.css';

export default function TofuModal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = '確認',
  cancelText = '取消',
  confirmVariant = 'primary',
  loading = false,
  size = 'md',
  hideFooter = false,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
        <motion.div
          className="tofu-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className={`tofu-modal tofu-modal--${size}`}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <div className="tofu-modal__header">
              <h3 className="tofu-modal__title">{title}</h3>
              <button className="tofu-modal__close" onClick={onClose}>✕</button>
            </div>
            <div className="tofu-modal__body">
              {children}
            </div>
            {!hideFooter && (
              <div className="tofu-modal__footer">
                <TofuButton variant="ghost" onClick={onClose} disabled={loading}>
                  {cancelText}
                </TofuButton>
                {onConfirm && (
                  <TofuButton
                    variant={confirmVariant}
                    onClick={onConfirm}
                    loading={loading}
                  >
                    {confirmText}
                  </TofuButton>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
