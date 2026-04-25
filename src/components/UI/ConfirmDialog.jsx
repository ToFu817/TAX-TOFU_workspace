import TofuModal from './TofuModal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = '確認操作', message, loading }) {
  return (
    <TofuModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onConfirm={onConfirm}
      confirmText="確認"
      cancelText="取消"
      confirmVariant="danger"
      loading={loading}
      size="sm"
    >
      <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text)', lineHeight: 1.8 }}>
        {message || '確定要執行此操作嗎？此操作無法復原。'}
      </p>
    </TofuModal>
  );
}
