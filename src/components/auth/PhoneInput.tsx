"use client";

const AZ_PREFIX = "+994";

function toLocalDigits(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("994") && digits.length > 3) {
    return digits.slice(3, 12);
  }

  if (digits.startsWith("0") && digits.length > 1) {
    return digits.slice(1, 10);
  }

  return digits.slice(0, 9);
}

interface PhoneInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}

export function PhoneInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  autoComplete = "tel-national",
}: PhoneInputProps) {
  const local = toLocalDigits(value);
  const fullValue = local ? `${AZ_PREFIX}${local}` : "";

  return (
    <label className="auth-form__field">
      {label}
      <div className="phone-field">
        <span className="phone-field__prefix" aria-hidden="true">
          {AZ_PREFIX}
        </span>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete={autoComplete}
          value={local}
          onChange={(e) => onChange(toLocalDigits(e.target.value))}
          placeholder={placeholder}
          maxLength={9}
          aria-label={`${label} ${AZ_PREFIX}`}
        />
        <input type="hidden" name={name} value={fullValue} />
      </div>
    </label>
  );
}
