'use client';

import { useState, useEffect, useRef, useCallback, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './register.css';

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
        // alert('Registration successful! Please login.');
        router.push('/');
      } else {
        setErrors({ submit: data.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const preventCopyPaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo-wrapper">
          <div className="auth-logo-circle">₹</div>
        </div>

        <h2 className="auth-heading">Create your account</h2>
        <p className="auth-sub-heading">
          Already have an account?{' '}
          <Link href="/Login">Sign in</Link>
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="auth-form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Neeraj Upreti"
            />
            {errors.name && <span className="auth-error-text">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="auth-form-group">
            <div className="auth-email-label-row">
              <label htmlFor="email">Email Address (Auto-Generated)</label>
              {emailStatus === 'checking' && (
                <span className="auth-email-status checking">⏳ Checking...</span>
              )}
              {emailStatus === 'available' && (
                <span className="auth-email-status available">✓ Available</span>
              )}
              {emailStatus === 'taken' && (
                <span className="auth-email-status taken">✗ Already Taken</span>
              )}
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              readOnly
              value={formData.email}
              className={`auth-email-readonly ${emailStatus === 'taken' ? 'input-error' : ''}`}
              placeholder="e.g. neeraj_upreti@loansaarthi.com"
            />
            {errors.email && <span className="auth-error-text">{errors.email}</span>}

            {/* Suggestions if already taken */}
            {emailStatus === 'taken' && emailSuggestions.length > 0 && (
              <div className="auth-suggestions-box">
                <p className="auth-suggestions-title">Available Suggestions (Click to select):</p>
                <div className="auth-suggestions-list">
                  {emailSuggestions.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      className="auth-suggestion-pill"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="auth-form-group">
            <label htmlFor="password">Password</label>
            <div className="auth-password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                onCopy={preventCopyPaste}
                onPaste={preventCopyPaste}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>

            {/* Password Strength */}
            {formData.password && (
              <div className="auth-password-strength">
                <div className={`auth-strength-item ${passwordStrength.length ? 'valid' : 'invalid'}`}>
                  {passwordStrength.length ? '✓' : '○'} At least 8 characters
                </div>
                <div className={`auth-strength-item ${passwordStrength.capital ? 'valid' : 'invalid'}`}>
                  {passwordStrength.capital ? '✓' : '○'} At least 1 uppercase letter
                </div>
                <div className={`auth-strength-item ${passwordStrength.special ? 'valid' : 'invalid'}`}>
                  {passwordStrength.special ? '✓' : '○'} At least 1 special character (!@#$%^&*)
                </div>
              </div>
            )}
            {errors.password && <span className="auth-error-text">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="auth-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="auth-password-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                onCopy={preventCopyPaste}
                onPaste={preventCopyPaste}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && <span className="auth-error-text">{errors.confirmPassword}</span>}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <span className="auth-success-text">✓ Passwords match</span>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="auth-error-box">{errors.submit}</div>
          )}

          {/* Submit Button */}
          <button type="submit" className="auth-btn-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          {/* Brand Tagline */}
          <div className="auth-brand-tagline">Your Loan. Your Saarthi. ✦</div>
        </form>
      </div>
    </div>
  );
}