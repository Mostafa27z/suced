import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, User, Mail, Lock, Eye, EyeOff, CreditCard, Phone, GraduationCap } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from '@/lib/i18n';

interface RegisterForm {
    name: string;
    email: string;
    national_id: string;
    phone: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { t, locale } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        national_id: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title={t('auth_register_title')}
            description={t('auth_register_desc')}
        >
            <Head title={t('register')} />

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="space-y-3.5">
                    {/* Full Name */}
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-xs font-bold text-[#17365D]">
                            {t('auth_full_name')} <span className="text-rose-500">*</span>
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                                <User className="w-4 h-4" />
                            </div>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder={t('auth_placeholder_name')}
                                className="ps-10 h-10 rounded-xl border-slate-300 bg-white focus-visible:ring-2 focus-visible:ring-[#2563A6]/20 focus-visible:border-[#2563A6] text-sm"
                            />
                        </div>
                        <InputError message={errors.name} />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1">
                        <Label htmlFor="email" className="text-xs font-bold text-[#17365D]">
                            {t('auth_email_label')} <span className="text-rose-500">*</span>
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                                <Mail className="w-4 h-4" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder={t('auth_placeholder_email')}
                                className="ps-10 h-10 rounded-xl border-slate-300 bg-white focus-visible:ring-2 focus-visible:ring-[#2563A6]/20 focus-visible:border-[#2563A6] text-sm"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    {/* Dual Row: National ID & Phone (Optional) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* National ID */}
                        <div className="space-y-1">
                            <Label htmlFor="national_id" className="text-xs font-bold text-[#17365D]">
                                {t('auth_national_id')}
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <Input
                                    id="national_id"
                                    type="text"
                                    tabIndex={3}
                                    value={data.national_id}
                                    onChange={(e) => setData('national_id', e.target.value)}
                                    disabled={processing}
                                    placeholder={t('auth_placeholder_national_id')}
                                    className="ps-10 h-10 rounded-xl border-slate-300 bg-white focus-visible:ring-2 focus-visible:ring-[#2563A6]/20 focus-visible:border-[#2563A6] text-xs"
                                />
                            </div>
                            <InputError message={errors.national_id} />
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                            <Label htmlFor="phone" className="text-xs font-bold text-[#17365D]">
                                {t('auth_phone')}
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <Input
                                    id="phone"
                                    type="tel"
                                    tabIndex={4}
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    disabled={processing}
                                    placeholder={t('auth_placeholder_phone')}
                                    className="ps-10 h-10 rounded-xl border-slate-300 bg-white focus-visible:ring-2 focus-visible:ring-[#2563A6]/20 focus-visible:border-[#2563A6] text-xs"
                                />
                            </div>
                            <InputError message={errors.phone} />
                        </div>
                    </div>

                    {/* Dual Row: Password & Confirm Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Password */}
                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-xs font-bold text-[#17365D]">
                                {t('auth_password_label')} <span className="text-rose-500">*</span>
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="••••••••"
                                    className="ps-10 pe-9 h-10 rounded-xl border-slate-300 bg-white focus-visible:ring-2 focus-visible:ring-[#2563A6]/20 focus-visible:border-[#2563A6] text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 end-0 flex items-center pe-3 text-slate-400 hover:text-slate-600 focus:outline-hidden"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Password Confirmation */}
                        <div className="space-y-1">
                            <Label htmlFor="password_confirmation" className="text-xs font-bold text-[#17365D]">
                                {t('auth_password_confirm')} <span className="text-rose-500">*</span>
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <Input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="••••••••"
                                    className="ps-10 pe-9 h-10 rounded-xl border-slate-300 bg-white focus-visible:ring-2 focus-visible:ring-[#2563A6]/20 focus-visible:border-[#2563A6] text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 end-0 flex items-center pe-3 text-slate-400 hover:text-slate-600 focus:outline-hidden"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>

                    {/* Notice on student registration */}
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-[11px] text-[#2563A6]">
                        <GraduationCap className="w-4 h-4 shrink-0 text-[#17365D] mt-0.5" />
                        <span>
                            {locale === 'ar'
                                ? 'سيتم تسجيلك كمتدرب بالمركز فوراً، ويمكنك البدء في الالتحاق بالمقررات واجتياز الاختبارات للحصول على الشهادات المعتمدة.'
                                : 'You will be registered as an enrolled student and can immediately register for courses, complete video lectures, and earn credentials.'}
                        </span>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="mt-2 w-full h-11 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white font-bold text-sm shadow-md transition-all active:scale-[0.99]"
                        tabIndex={7}
                        disabled={processing}
                    >
                        {processing ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <span>{t('auth_create_account')}</span>
                            </span>
                        )}
                    </Button>
                </div>

                {/* Already have an account */}
                <div className="pt-2 text-center text-xs text-[#64748B] border-t border-slate-100">
                    <span>{t('auth_already_registered')} </span>
                    <Link
                        href={route('login')}
                        tabIndex={8}
                        className="font-bold text-[#17365D] hover:text-[#2563A6] hover:underline"
                    >
                        {t('login')}
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
