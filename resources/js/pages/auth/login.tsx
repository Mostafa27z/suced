import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff, Shield, GraduationCap, BookOpen, Check } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from '@/lib/i18n';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { t, locale, isRtl } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const fillDemo = (email: string, role: string) => {
        setData((prev) => ({
            ...prev,
            email,
            password: 'Password123!',
        }));
        setSelectedDemo(role);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title={t('auth_login_title')}
            description={t('auth_login_desc')}
        >
            <Head title={t('login')} />

            {status && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs font-semibold text-emerald-700">
                    {status}
                </div>
            )}

            {/* Quick 1-Click Demo Login Bar */}
            <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#17365D] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#D6A84F]"></span>
                        {t('auth_quick_demo')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Password123!</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        type="button"
                        onClick={() => fillDemo('admin@suced.sohag.edu.eg', 'admin')}
                        className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                            selectedDemo === 'admin'
                                ? 'bg-[#17365D] text-white border-[#17365D] shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-[#17365D] hover:bg-slate-100/50'
                        }`}
                    >
                        <Shield className="w-3 h-3 text-[#D6A84F]" />
                        <span>{t('auth_demo_admin')}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillDemo('tamer@suced.sohag.edu.eg', 'faculty')}
                        className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                            selectedDemo === 'faculty'
                                ? 'bg-[#17365D] text-white border-[#17365D] shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-[#17365D] hover:bg-slate-100/50'
                        }`}
                    >
                        <BookOpen className="w-3 h-3 text-blue-500" />
                        <span>{locale === 'ar' ? 'أستاذ' : 'Faculty'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillDemo('ahmed@suced.sohag.edu.eg', 'student')}
                        className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                            selectedDemo === 'student'
                                ? 'bg-[#17365D] text-white border-[#17365D] shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-[#17365D] hover:bg-slate-100/50'
                        }`}
                    >
                        <GraduationCap className="w-3 h-3 text-emerald-600" />
                        <span>{locale === 'ar' ? 'طالب' : 'Student'}</span>
                    </button>
                </div>
            </div>

            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="space-y-4">
                    {/* Academic Email Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-[#17365D]">
                            {t('auth_email_label')}
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                                <Mail className="w-4 h-4" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder={t('auth_placeholder_email')}
                                className="ps-10 h-11 rounded-xl border-slate-300 bg-white focus-visible:ring-2 focus-visible:ring-[#2563A6]/20 focus-visible:border-[#2563A6] text-sm"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-xs font-bold text-[#17365D]">
                                {t('auth_password_label')}
                            </Label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    tabIndex={5}
                                    className="text-xs font-semibold text-[#2563A6] hover:text-[#17365D] hover:underline"
                                >
                                    {t('auth_forgot_password')}
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={t('auth_placeholder_password')}
                                className="ps-10 pe-10 h-11 rounded-xl border-slate-300 bg-white focus-visible:ring-2 focus-visible:ring-[#2563A6]/20 focus-visible:border-[#2563A6] text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-slate-400 hover:text-slate-600 focus:outline-hidden"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse pt-1">
                        <Checkbox
                            id="remember"
                            name="remember"
                            tabIndex={3}
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked === true)}
                            className="rounded-md border-slate-300 data-[state=checked]:bg-[#17365D] data-[state=checked]:border-[#17365D]"
                        />
                        <Label htmlFor="remember" className="text-xs text-[#64748B] font-medium cursor-pointer">
                            {t('auth_remember_me')}
                        </Label>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="mt-2 w-full h-11 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white font-bold text-sm shadow-md transition-all active:scale-[0.99]"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <span>{t('auth_sign_in_btn')}</span>
                            </span>
                        )}
                    </Button>
                </div>

                {/* Register Link */}
                <div className="pt-2 text-center text-xs text-[#64748B] border-t border-slate-100">
                    <span>{t('auth_no_account')} </span>
                    <Link
                        href={route('register')}
                        tabIndex={6}
                        className="font-bold text-[#17365D] hover:text-[#2563A6] hover:underline"
                    >
                        {t('auth_create_account')}
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
