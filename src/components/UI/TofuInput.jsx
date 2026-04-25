import { useState } from 'react';
import './TofuInput.css';

export default function TofuInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  icon,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`tofu-input-wrap ${focused ? 'tofu-input-wrap--focused' : ''} ${error ? 'tofu-input-wrap--error' : ''} ${className}`}>
      {label && (
        <label className="tofu-input-label">
          {label}
          {required && <span className="tofu-input-required">*</span>}
        </label>
      )}
      <div className="tofu-input-container">
        {icon && <span className="tofu-input-icon">{icon}</span>}
        {type === 'textarea' ? (
          <textarea
            className="tofu-input tofu-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={3}
            {...props}
          />
        ) : (
          <input
            className="tofu-input"
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
        )}
      </div>
      {error && <span className="tofu-input-error">{error}</span>}
    </div>
  );
}
