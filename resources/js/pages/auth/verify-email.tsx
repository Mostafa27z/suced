import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, MailCheck, Send, LogOut } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from '@/lib/i18n';

export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useTranslation();
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout
            title={t('auth_verify_email_title')}
            description={t('auth_verify_email_desc')}
        >
            <Head title={t('auth_verify_email_title')} />

            {/* Email illustration icon */}
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-[#17365D] flex items-center justify-center shadow-inner">
                    <MailCheck className="w-8 h-8 text-[#2563A6]" />
                </div>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs font-semibold text-emerald-700">
                    {t('auth_verification_sent')}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full h-11 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white font-bold text-sm shadow-md transition-all active:scale-[0.99]"
                >
                    {processing ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <Send className="w-4 h-4 text-[#D6A84F]" />
                            <span>{t('auth_resend_verification')}</span>
                        </span>
                    )}
                </Button>

                <div className="pt-2 text-center text-xs text-[#64748B] border-t border-slate-100">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="inline-flex items-center gap-1.5 font-bold text-slate-500 hover:text-rose-600 transition-colors"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('auth_log_out')}</span>
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
