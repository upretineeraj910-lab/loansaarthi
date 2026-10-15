'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';

interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface IPasswordStrength {
  length: boolean;
  capital: boolean;
  special: boolean;
}

interface IFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

interface IPasswordInputProps {
  id: string;
  name: string;
  show: boolean;
  onToggle: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlockClipboard: (e: ClipboardEvent<HTMLInputElement>) => void;
  autoComplete: string;
  placeholder: string;
}

const formatEmailFromName = (name: string): string => {
  const sanitized = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/^_+|_+$/g, '');
  if (!sanitized) return '';
  return `${sanitized}@loansaarthi.com`;
};

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {hidden ? (
        <>
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

// Controlled nahi hai (value prop nahi), taaki password DOM ke value attribute me na likha jaye
function PasswordInput({
  id,
  name,
  show,
  onToggle,
  onChange,
  onBlockClipboard,
  autoComplete,
  placeholder,
}: IPasswordInputProps) {
  return (
    <div className={styles.inputWrap}>
      <input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        required
        autoComplete={autoComplete}
        onChange={onChange}
        onCopy={onBlockClipboard}
        onPaste={onBlockClipboard}
        className={`${styles.input} ${styles.inputWithToggle}`}
        placeholder={placeholder}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={onToggle}
        aria-label={show ? 'Hide password' : 'Show password'}
        aria-pressed={show}
      >
        <EyeIcon hidden={show} />
      </button>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [formData, setFormData] = useState<IRegisterInput>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<IFormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<IPasswordStrength>({
    length: false,
    capital: false,
    special: false,
  });

  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const checkTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (checkTimerRef.current) {
        clearTimeout(checkTimerRef.current);
      }
    };
  }, []);

  const checkEmailAvailability = useCallback((emailToCheck: string) => {
    if (checkTimerRef.current) {
      clearTimeout(checkTimerRef.current);
    }

    if (!emailToCheck || !emailToCheck.includes('@loansaarthi.com')) {
      setEmailStatus('idle');
      setEmailSuggestions([]);
      return;
    }

    setEmailStatus('checking');
    checkTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/register/check-email?email=${encodeURIComponent(emailToCheck)}`
        );
        const data = await res.json();
        if (data.available) {
          setEmailStatus('available');
          setEmailSuggestions([]);
          setErrors((prev) => {
            const next = { ...prev };
            delete next.email;
            return next;
          });
        } else {
          setEmailStatus('taken');
          setEmailSuggestions(data.suggestions || []);
          setErrors((prev) => ({
            ...prev,
            email: 'Email already taken. Select an available suggestion below.',
          }));
        }
      } catch {
        setEmailStatus('idle');
      }
    }, 400);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'name') {
      const generatedEmail = formatEmailFromName(value);
      setFormData((prev) => ({
        ...prev,
        name: value,
        email: generatedEmail,
      }));
      checkEmailAvailability(generatedEmail);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === 'password') {
      validatePasswordStrength(value);
    }
  };

  const handleSelectSuggestion = (suggestedEmail: string) => {
    setFormData((prev) => ({ ...prev, email: suggestedEmail }));
    setEmailStatus('available');
    setEmailSuggestions([]);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.email;
      return next;
    });
  };

  const validatePasswordStrength = (password: string): void => {
    setPasswordStrength({
      length: password.length >= 8,
      capital: /[A-Z]/.test(password),
      special: /[!@#$%^&*()_+={}\[\]:;"'<>,.?/~`]/.test(password),
    });
  };

  const validateForm = (): boolean => {
    const newErrors: IFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your name to generate an email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    } else if (emailStatus === 'taken') {
      newErrors.email = 'This email is already registered. Please choose an available suggestion below';
    } else if (emailStatus === 'checking') {
      newErrors.email = 'Checking email availability, please wait...';
    }

    const { length, capital, special } = passwordStrength;
    if (!length || !capital || !special) {
      newErrors.password = 'Password must meet all requirements';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/');
      } else {
        setErrors({ submit: data.error || 'Registration failed' });
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const blockClipboard = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
  };

  const strengthRules = [
    { ok: passwordStrength.length, label: 'At least 8 characters' },
    { ok: passwordStrength.capital, label: 'At least 1 uppercase letter' },
    { ok: passwordStrength.special, label: 'At least 1 special character (!@#$%^&*)' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>
          Already have an account?{' '}
          <Link href="/login" className={styles.link}>
            Sign in
          </Link>
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Name */}
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g. Neeraj Upreti"
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          {/* Email */}
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="email" className={styles.label}>
                Email (auto-generated)
              </label>
              {emailStatus === 'checking' && (
                <span className={`${styles.status} ${styles.checking}`}>Checking...</span>
              )}
              {emailStatus === 'available' && (
                <span className={`${styles.status} ${styles.available}`}>✓ Available</span>
              )}
              {emailStatus === 'taken' && (
                <span className={`${styles.status} ${styles.taken}`}>Already taken</span>
              )}
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              readOnly
              value={formData.email}
              className={`${styles.input} ${styles.inputReadonly} ${
                emailStatus === 'taken' ? styles.inputError : ''
              }`}
              placeholder="e.g. neeraj_upreti@loansaarthi.com"
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}

            {/* Suggestions if already taken */}
            {emailStatus === 'taken' && emailSuggestions.length > 0 && (
              <div className={styles.suggestions}>
                <p className={styles.suggestionsTitle}>Available options, click to select:</p>
                <div className={styles.suggestionsList}>
                  {emailSuggestions.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      className={styles.pill}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <PasswordInput
              id="password"
              name="password"
              show={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
              onChange={handleChange}
              onBlockClipboard={blockClipboard}
              autoComplete="new-password"
              placeholder="Create a password"
            />

            {formData.password && (
              <ul className={styles.strength}>
                {strengthRules.map((rule) => (
                  <li
                    key={rule.label}
                    className={`${styles.strengthItem} ${rule.ok ? styles.valid : styles.invalid}`}
                  >
                    {rule.ok ? '✓' : '○'} {rule.label}
                  </li>
                ))}
              </ul>
            )}
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm password
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((prev) => !prev)}
              onChange={handleChange}
              onBlockClipboard={blockClipboard}
              autoComplete="new-password"
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <span className={styles.errorText}>{errors.confirmPassword}</span>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <span className={styles.successText}>✓ Passwords match</span>
            )}
          </div>

          {errors.submit && (
            <div className={styles.errorBox} role="alert">
              {errors.submit}
            </div>
          )}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className={styles.tagline}>Your Loan. Your Saarthi.</p>
      </div>
    </div>
  );
}