import './TofuSelect.css';

export default function TofuSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = '請選擇',
  required = false,
  disabled = false,
  className = '',
}) {
  return (
    <div className={`tofu-select-wrap ${className}`}>
      {label && (
        <label className="tofu-select-label">
          {label}
          {required && <span className="tofu-input-required">*</span>}
        </label>
      )}
      <select
        className="tofu-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={val} value={val}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
