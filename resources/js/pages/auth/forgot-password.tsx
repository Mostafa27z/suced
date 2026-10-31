import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from '@/lib/i18n';

export default function ForgotPassword({ status }: { status?: string }) {
    const { t, isRtl } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    const ArrowBack = isRtl ? ArrowRight : ArrowLeft;

    return (
        <AuthLayout
            title={t('auth_forgot_title')}
            description={t('auth_forgot_desc')}
        >
            <Head title={t('auth_forgot_title')} />

            {status && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs font-semibold text-emerald-700">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <form onSubmit={submit} className="space-y-4">
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
                                autoComplete="off"
                                value={data.email}
                                autoFocus
                                required
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder={t('auth_placeholder_email')}
                                className="ps-10 h-11 rounded-xl border-slate-300 bg-white focus-visible:ring-2 focus-visible:ring-[#2563A6]/20 focus-visible:border-[#2563A6] text-sm"
                            />
                        </div>
                        <InputError message={errors.email} />
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
                                <KeyRound className="w-4 h-4 text-[#D6A84F]" />
                                <span>{t('auth_send_reset_link')}</span>
                            </span>
                        )}
                    </Button>
                </form>

                <div className="pt-2 text-center text-xs text-[#64748B] border-t border-slate-100">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-1.5 font-bold text-[#17365D] hover:text-[#2563A6] hover:underline"
                    >
                        <ArrowBack className="w-3.5 h-3.5" />
                        <span>{t('auth_return_to_login')}</span>
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
