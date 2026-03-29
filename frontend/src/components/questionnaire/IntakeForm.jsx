import React from 'react';
import { useForm } from 'react-hook-form';
import { ArrowRight, GraduationCap } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

/** Strips whitespace, dashes, +, () from a phone string for digit-only validation */
const stripPhone = (v = '') => v.replace(/[\s\-+()]/g, '');

/**
 * Intake form to collect student basic information.
 * Props: onSubmit(data), planType, isLoading
 */
export default function IntakeForm({ onSubmit, planType, isLoading }) {
  const { t } = useLanguage();
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

  const e = t.intake.errors;

  return (
    <div className="card max-w-lg mx-auto w-full animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-primary-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.intake.title}</h2>
          <p className="text-sm text-slate-500">
            {isPaid ? t.intake.paidLabel : t.intake.freeLabel}
          </p>
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
        {t.intake.description}
        {isPaid ? t.intake.descriptionPaid : t.intake.descriptionFree}
      </p>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5" noValidate>

        {/* Full Name */}
        <Input
          label={t.intake.nameLbl}
          type="text"
          placeholder={t.intake.namePlaceholder}
          required
          autoComplete="name"
          error={errors.name?.message}
          success={isOk('name')}
          {...register('name', {
            required: e.nameRequired,
            minLength: { value: 2, message: e.nameMin },
            maxLength: { value: 60, message: e.nameMax },
            validate: {
              notBlank: (v) => v.trim().length >= 2 || e.nameBlank,
              noNumbers: (v) => !/\d/.test(v) || e.nameNumbers,
              validChars: (v) =>
                /^[a-zA-Z\u0900-\u097F\s'.,-]+$/.test(v.trim()) || e.nameChars,
            },
          })}
        />

        {/* Email */}
        <Input
          label={t.intake.emailLbl}
          type="email"
          placeholder={t.intake.emailPlaceholder}
          required
          autoComplete="email"
          error={errors.email?.message}
          success={isOk('email')}
          helper={!errors.email && !touchedFields.email ? t.intake.emailHelper : undefined}
          {...register('email', {
            required: e.emailRequired,
            maxLength: { value: 254, message: e.emailMax },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
              message: e.emailInvalid,
            },
          })}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Age */}
          <Input
            label={t.intake.ageLbl}
            type="number"
            placeholder={t.intake.agePlaceholder}
            required
            min={10}
            max={28}
            step={1}
            autoComplete="off"
            error={errors.age?.message}
            success={isOk('age')}
            {...register('age', {
              required: e.ageRequired,
              min: { value: 10, message: e.ageMin },
              max: { value: 28, message: e.ageMax },
              valueAsNumber: true,
              validate: (v) =>
                (!isNaN(v) && Number.isInteger(v)) || e.ageRequired,
            })}
          />

          {/* Class / Standard */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {t.intake.standardLbl} <span className="text-red-500">*</span>
            </label>
            <select
              className={`input-field ${
                errors.standard
                  ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                  : isOk('standard')
                  ? 'border-teal-400 focus:ring-teal-400 focus:border-teal-400'
                  : ''
              }`}
              {...register('standard', { required: e.standardRequired })}
            >
              <option value="">{t.intake.standardPlaceholder}</option>
              {t.intake.standards.map((s) => (
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
          label={t.intake.phoneLbl}
          type="tel"
          placeholder={t.intake.phonePlaceholder}
          autoComplete="tel"
          error={errors.phone?.message}
          success={isOk('phone') && !errors.phone}
          helper={!errors.phone && !touchedFields.phone ? t.intake.phoneHelper : undefined}
          {...register('phone', {
            validate: (v) => {
              if (!v || v.trim() === '') return true;
              const digits = stripPhone(v);
              return (
                /^(91|0)?[6-9]\d{9}$/.test(digits) || e.phoneInvalid
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
          {isLoading
            ? t.intake.submittingBtn
            : isPaid
              ? `${t.intake.submitBtn} — ₹499`
              : t.intake.submitBtn}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
