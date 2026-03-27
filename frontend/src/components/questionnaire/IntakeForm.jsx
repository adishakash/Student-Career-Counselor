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

/**
 * Intake form to collect student basic information.
 * Props: onSubmit(data), planType, isLoading
 */
export default function IntakeForm({ onSubmit, planType, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const isPaid = planType === 'paid';

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Rahul Sharma"
          required
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 100, message: 'Name is too long' },
          })}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          required
          error={errors.email?.message}
          helper="Your report will be sent here"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
          })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Age"
            type="number"
            placeholder="e.g. 16"
            required
            error={errors.age?.message}
            {...register('age', {
              required: 'Age is required',
              min: { value: 10, message: 'Minimum age is 10' },
              max: { value: 28, message: 'Maximum age is 28' },
              valueAsNumber: true,
            })}
          />

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Class / Standard <span className="text-red-500">*</span>
            </label>
            <select
              className={`input-field ${errors.standard ? 'border-red-400' : ''}`}
              {...register('standard', { required: 'Please select your class' })}
            >
              <option value="">Select class</option>
              {STANDARDS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.standard && (
              <p className="mt-1.5 text-sm text-red-500">{errors.standard.message}</p>
            )}
          </div>
        </div>

        <Input
          label="Phone (Optional)"
          type="tel"
          placeholder="+91 98765 43210"
          {...register('phone', {
            pattern: { value: /^[+0-9\s-]{7,15}$/, message: 'Enter a valid phone number' },
          })}
          error={errors.phone?.message}
        />

        {/* Privacy note */}
        <p className="text-xs text-slate-400">
          Your information is kept private and used only to generate your report. We never spam.
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
