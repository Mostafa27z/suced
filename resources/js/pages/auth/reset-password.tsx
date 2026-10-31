import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from '@/lib/i18n';

interface ResetPasswordProps {
    token: string;
    email: string;
}

interface ResetPasswordForm {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<ResetPasswordForm>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title={t('auth_reset_title')}
            description={t('auth_reset_desc')}
        >
            <Head title={t('auth_reset_title')} />

            <form onSubmit={submit} className="space-y-4">
                {/* Email (Readonly) */}
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
                            name="email"
                            autoComplete="email"
                            value={data.email}
                            readOnly
                            className="ps-10 h-11 rounded-xl border-slate-300 bg-slate-50 text-slate-500 cursor-not-allowed text-sm"
                        />
                    </div>
                    <InputError message={errors.email} />
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-bold text-[#17365D]">
                        {t('auth_password_label')}
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            autoComplete="new-password"
                            value={data.password}
                            autoFocus
                            required
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

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                    <Label htmlFor="password_confirmation" className="text-xs font-bold text-[#17365D]">
                        {t('auth_password_confirm')}
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                        </div>
                        <Input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            required
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder={t('auth_password_confirm')}
                            className="ps-10 pe-10 h-11 rounded-xl border-slate-300 bg-white focus-visible:ring-2 focus-visible:ring-[#2563A6]/20 focus-visible:border-[#2563A6] text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-slate-400 hover:text-slate-600 focus:outline-hidden"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} />
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="mt-2 w-full h-11 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white font-bold text-sm shadow-md transition-all active:scale-[0.99]"
                    disabled={processing}
                >
                    {processing ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <KeyRound className="w-4 h-4 text-[#D6A84F]" />
                            <span>{t('auth_reset_password_btn')}</span>
                        </span>
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
}
