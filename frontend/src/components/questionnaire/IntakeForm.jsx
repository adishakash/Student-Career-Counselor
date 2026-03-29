import React from 'react';
import { useForm } from 'react-hook-form';
import { ArrowRight, GraduationCap } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const STANDARDS = [
  '8th',
  '9th',
  '10th',
  '11th Science',
  '11th Commerce',
  '11th Arts/Humanities',
  '12th Science',
  '12th Commerce',
  '12th Arts/Humanities',
  'Graduated (Class 12 done)',
];

/** Strips whitespace, dashes, +, () from a phone string for digit-only validation */
const stripPhone = (v = '') => v.replace(/[\s\-+()]/g, '');

/**
 * Intake form to collect student basic information.
 * Props: onSubmit(data), planType, isLoading
 */
export default function IntakeForm({ onSubmit, planType, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({ mode: 'onTouched', reValidateMode: 'onChange' });

  const isPaid = planType === 'paid';

  /** True when field has been touched AND has no error — drives success indicator */
  const isOk = (field) => !!touchedFields[field] && !errors[field];

  const submitHandler = (data) => {
    onSubmit({
      ...data,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone ? stripPhone(data.phone) || undefined : undefined,
    });
  };

  return (
    <div className="card max-w-lg mx-auto w-full animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-primary-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Let's Get Started</h2>
          <p className="text-sm text-slate-500">
            {isPaid ? 'Premium Report — ₹499' : 'Free Report'}
          </p>
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
        Fill in your details below. Your report will be sent to your email
        {isPaid ? ' after payment is confirmed.' : '.'}
      </p>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5" noValidate>

        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Rahul Sharma"
          required
          autoComplete="name"
          error={errors.name?.message}
          success={isOk('name')}
          {...register('name', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 60, message: 'Name must be 60 characters or fewer' },
            validate: {
              notBlank: (v) =>
                v.trim().length >= 2 || 'Name cannot be blank or only spaces',
              noNumbers: (v) =>
                !/\d/.test(v) || 'Name should not contain numbers',
              validChars: (v) =>
                /^[a-zA-Z\u0900-\u097F\s'.,-]+$/.test(v.trim()) ||
                'Name can only contain letters, spaces, or hyphens',
            },
          })}
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
          error={errors.email?.message}
          success={isOk('email')}
          helper={!errors.email && !touchedFields.email ? 'Your report will be sent here' : undefined}
          {...register('email', {
            required: 'Email address is required',
            maxLength: { value: 254, message: 'Email address is too long' },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
              message: 'Enter a valid email address (e.g. name@gmail.com)',
            },
          })}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Age */}
          <Input
            label="Age"
            type="number"
            placeholder="e.g. 16"
            required
            min={10}
            max={28}
            step={1}
            autoComplete="off"
            error={errors.age?.message}
            success={isOk('age')}
            {...register('age', {
              required: 'Age is required',
              min: { value: 10, message: 'Age must be at least 10' },
              max: { value: 28, message: 'Age must be 28 or below' },
              valueAsNumber: true,
              validate: (v) =>
                (!isNaN(v) && Number.isInteger(v)) || 'Age must be a whole number',
            })}
          />

          {/* Class / Standard */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Class / Standard <span className="text-red-500">*</span>
            </label>
            <select
              className={`input-field ${
                errors.standard
                  ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                  : isOk('standard')
                  ? 'border-teal-400 focus:ring-teal-400 focus:border-teal-400'
                  : ''
              }`}
              {...register('standard', { required: 'Please select your class' })}
            >
              <option value="">— Select class —</option>
              {STANDARDS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.standard && (
              <p className="mt-1.5 text-sm text-red-500">{errors.standard.message}</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <Input
          label="Phone Number"
          type="tel"
          placeholder="e.g. 9876543210"
          autoComplete="tel"
          error={errors.phone?.message}
          success={isOk('phone') && !errors.phone}
          helper={!errors.phone && !touchedFields.phone ? 'Optional — Indian mobile number' : undefined}
          {...register('phone', {
            validate: (v) => {
              if (!v || v.trim() === '') return true; // field is optional
              const digits = stripPhone(v);
              return (
                /^(91|0)?[6-9]\d{9}$/.test(digits) ||
                'Enter a valid 10-digit Indian mobile number (e.g. 9876543210)'
              );
            },
          })}
        />

        {/* Privacy note */}
        <p className="text-xs text-slate-400">
          🔒 Your information is private and used only to generate your report. We never spam.
        </p>

        <Button
          type="submit"
          loading={isLoading}
          fullWidth
          size="lg"
          variant={isPaid ? 'secondary' : 'primary'}
        >
          {isPaid ? 'Proceed to Payment — ₹499' : 'Start Free Assessment'}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
