import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from '@/lib/i18n';

export default function ConfirmPassword() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title={t('auth_confirm_title')}
            description={t('auth_confirm_desc')}
        >
            <Head title={t('auth_confirm_title')} />

            <div className="mb-5 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                </div>
                <div className="text-xs text-amber-900 leading-relaxed pt-0.5">
                    {t('auth_confirm_desc')}
                </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
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
                            placeholder={t('auth_placeholder_password')}
                            autoComplete="current-password"
                            value={data.password}
                            autoFocus
                            required
                            onChange={(e) => setData('password', e.target.value)}
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

                <Button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white font-bold text-sm shadow-md transition-all active:scale-[0.99]"
                    disabled={processing}
                >
                    {processing ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#D6A84F]" />
                            <span>{t('auth_confirm_password_btn')}</span>
                        </span>
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
}
