'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Phone,
  IndianRupee,
  Briefcase,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import styles from './talk-expert.module.css';

const LOAN_TYPES = [
  'Personal Loan',
  'Home Loan',
  'Business Loan',
  'Loan Against Property',
  'Professional Loan',
  'Car Loan',
  'Education Loan',
  'Gold Loan',
  'Other',
];

const TIME_SLOTS = [
  '03:00 PM - 03:30 PM',
  '03:30 PM - 04:00 PM',
  '04:00 PM - 04:30 PM',
  '04:30 PM - 05:00 PM',
];

export default function TalkToExpertPage() {
  // Generate next 10 available business days (excluding today, Sat, Sun)
  const availableDates = useMemo(() => {
    const list: { dateStr: string; displayDay: string; displayDate: string; fullDate: string }[] = [];
    const curr = new Date();
    // Start strictly from tomorrow (+1 day in advance)
    curr.setDate(curr.getDate() + 1);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    while (list.length < 10) {
      const dayOfWeek = curr.getDay();
      // Skip Saturday (6) and Sunday (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const yyyy = curr.getFullYear();
        const mm = String(curr.getMonth() + 1).padStart(2, '0');
        const dd = String(curr.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        list.push({
          dateStr,
          displayDay: dayNames[dayOfWeek],
          displayDate: `${curr.getDate()} ${monthNames[curr.getMonth()]}`,
          fullDate: `${dayNames[dayOfWeek]}, ${curr.getDate()} ${monthNames[curr.getMonth()]} ${yyyy}`,
        });
      }
      curr.setDate(curr.getDate() + 1);
    }
    return list;
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    monthlySalary: '',
    loanType: 'Personal Loan',
    loanAmount: '',
    appointmentDate: availableDates[0]?.dateStr || '',
    appointmentTime: TIME_SLOTS[0],
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{
    id: string;
    name: string;
    phone: string;
    loanType: string;
    loanAmount: number;
    appointmentDate: string;
    appointmentTime: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client validation
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const cleanPhone = formData.phone.trim();
    if (!/^\d{10}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const salary = Number(formData.monthlySalary);
    if (isNaN(salary) || salary <= 0) {
      setError('Please enter your monthly net in-hand salary.');
      return;
    }

    const amount = Number(formData.loanAmount);
    if (isNaN(amount) || amount < 10000) {
      setError('Loan amount should be at least ₹10,000.');
      return;
    }

    if (!formData.appointmentDate) {
      setError('Please select an appointment date (Monday to Friday).');
      return;
    }

    if (!formData.appointmentTime) {
      setError('Please select a 3:00 PM - 5:00 PM time slot.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: cleanPhone,
          monthlySalary: salary,
          loanType: formData.loanType,
          loanAmount: amount,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          notes: formData.notes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to book appointment. Please try again.');
      }

      setSuccessData(data.appointment || data.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.shell}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>

        {successData ? (
          <div className={styles.panel}>
            <div className={styles.successCard}>
              <div className={styles.successIconWrap}>
                <CheckCircle2 size={36} />
              </div>
              <h2 className={styles.successTitle}>Consultation Scheduled!</h2>
              <p className={styles.successSub}>
                Thank you, <strong>{successData.name}</strong>. Our Senior Loan Advisor has received your request and will call you on your booked slot.
              </p>

              <div className={styles.summaryBox}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Customer Name</span>
                  <span className={styles.summaryValue}>{successData.name}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Contact Phone</span>
                  <span className={styles.summaryValue}>+91 {successData.phone}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Requirement</span>
                  <span className={styles.summaryValue}>
                    {successData.loanType} (₹{successData.loanAmount.toLocaleString('en-IN')})
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Appointment Date</span>
                  <span className={styles.summaryValue}>{successData.appointmentDate}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Time Window</span>
                  <span className={styles.summaryValue} style={{ color: '#f5c563' }}>
                    {successData.appointmentTime}
                  </span>
                </div>
              </div>

              <div className={styles.actionsWrap}>
                <Link
                  href="/"
                  className={styles.submitBtn}
                  style={{ textDecoration: 'none', maxWidth: '240px', margin: '0 auto' }}
                >
                  Return to Home
                </Link>
                <button
                  onClick={() => {
                    setSuccessData(null);
                    setFormData({
                      name: '',
                      phone: '',
                      monthlySalary: '',
                      loanType: 'Personal Loan',
                      loanAmount: '',
                      appointmentDate: availableDates[0]?.dateStr || '',
                      appointmentTime: TIME_SLOTS[0],
                      notes: '',
                    });
                  }}
                  className={styles.timeSlotPill}
                  style={{ padding: '0.9rem 1.5rem', background: 'transparent' }}
                >
                  Book Another Call
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <span className={styles.badge}>
                <Sparkles size={14} /> Talk to a Certified Loan Expert
              </span>
              <h1 className={styles.title}>Book Your Video / Phone Consultation</h1>
              <p className={styles.subtitle}>
                Get unbiased advice across 42+ RBI-registered banks and NBFCs. Compare interest rates, policy eligibility, and optimize your chances of approval.
              </p>
            </div>

            <div className={styles.panel}>
              {error && (
                <div className={styles.errorBanner}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.formGrid}>
                {/* Full Name */}
                <div className={styles.field}>
                  <label className={styles.label}>
                    <span>Full Name</span>
                    <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className={styles.field}>
                  <label className={styles.label}>
                    <span>10-Digit Mobile Number</span>
                    <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>
                      <Phone size={18} />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={10}
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setFormData((prev) => ({ ...prev, phone: val }));
                      }}
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Monthly Salary */}
                <div className={styles.field}>
                  <label className={styles.label}>
                    <span>Monthly In-Hand Salary</span>
                    <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>
                      <IndianRupee size={18} />
                    </span>
                    <input
                      type="number"
                      name="monthlySalary"
                      min={1000}
                      required
                      placeholder="e.g. 45000"
                      value={formData.monthlySalary}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Loan Type */}
                <div className={styles.field}>
                  <label className={styles.label}>
                    <span>Loan Category</span>
                    <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>
                      <Briefcase size={18} />
                    </span>
                    <select
                      name="loanType"
                      value={formData.loanType}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      {LOAN_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Loan Amount Needed */}
                <div className={styles.fieldFull}>
                  <label className={styles.label}>
                    <span>Required Loan Amount (₹)</span>
                    <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>
                      <IndianRupee size={18} />
                    </span>
                    <input
                      type="number"
                      name="loanAmount"
                      min={10000}
                      step={5000}
                      required
                      placeholder="e.g. 500000"
                      value={formData.loanAmount}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Select Date (Starts Tomorrow, Mon - Fri Only) */}
                <div className={styles.fieldFull}>
                  <label className={styles.label}>
                    <span>Select Appointment Date (Next Business Days Only)</span>
                    <span className={styles.required}>* Mon-Fri Only</span>
                  </label>
                  <div className={styles.datePillsGrid}>
                    {availableDates.map((item) => {
                      const isSelected = formData.appointmentDate === item.dateStr;
                      return (
                        <button
                          key={item.dateStr}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, appointmentDate: item.dateStr }))}
                          className={`${styles.datePill} ${isSelected ? styles.datePillActive : ''}`}
                        >
                          <span className={styles.datePillDay}>{item.displayDay}</span>
                          <span className={styles.datePillNum}>{item.displayDate}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Select Time Slot (3:00 PM to 5:00 PM Only) */}
                <div className={styles.fieldFull}>
                  <label className={styles.label}>
                    <span>Select Time Slot</span>
                    <span className={styles.required}>* 3:00 PM - 5:00 PM Slots Only</span>
                  </label>
                  <div className={styles.timeSlotsGrid}>
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = formData.appointmentTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, appointmentTime: slot }))}
                          className={`${styles.timeSlotPill} ${isSelected ? styles.timeSlotPillActive : ''}`}
                        >
                          <Clock size={16} />
                          <span>{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className={styles.fieldFull}>
                  <label className={styles.label}>
                    <span>Additional Queries or Specific Bank Preference (Optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Tell us about existing EMIs, any CIBIL concerns, or specific banks you prefer..."
                    value={formData.notes}
                    onChange={handleChange}
                    className={styles.textarea}
                  />
                </div>

                {/* Notice Box */}
                <div className={styles.fieldFull}>
                  <div className={styles.noticeBox}>
                    <ShieldCheck size={20} color="#f5c563" />
                    <span>
                      Consultation policy: Expert calls are scheduled at least 1 day in advance between 3:00 PM and 5:00 PM (Monday to Friday). Your personal details are 100% confidential.
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className={styles.fieldFull}>
                  <button type="submit" disabled={submitting} className={styles.submitBtn}>
                    {submitting ? 'Confirming Appointment...' : 'Schedule My Consultation Call'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
