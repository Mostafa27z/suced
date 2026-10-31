import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    Award,
    Download,
    QrCode,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Shield,
    X,
    FileSpreadsheet
} from 'lucide-react';

interface CertificateItem {
    id: number;
    public_code: string;
    certificate_number: string;
    student_name: string;
    course_title_en: string;
    course_title_ar: string;
    score_percentage: number;
    issue_date: string;
    is_revoked: boolean;
    revocation_reason?: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    course: {
        id: number;
        title_en: string;
        title_ar: string;
    };
}

interface Props {
    certificates: {
        data: CertificateItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    courses: Array<{ id: number; title_en: string; title_ar: string }>;
    students: Array<{ id: number; name: string; email: string }>;
}

export default function AdminCertificates({ certificates, courses, students }: Props) {
    const { t, locale, isRtl } = useTranslation();
    const [revokingCert, setRevokingCert] = useState<CertificateItem | null>(null);

    const revokeForm = useForm({
        reason: '',
    });

    const handleRevokeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!revokingCert) return;

        revokeForm.post(route('admin.certificates.revoke', { certificate: revokingCert.id }), {
            onSuccess: () => {
                setRevokingCert(null);
                revokeForm.reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? 'سجل الشهادات الأكاديمية الصادرة' : 'Issued Credentials & Certificates'}
            breadcrumb={locale === 'ar' ? 'الشهادات' : 'Certificates Ledger'}
        >
            <Head title={locale === 'ar' ? 'سجل الشهادات - SUCED' : 'Certificates Ledger - SUCED'} />

            <div className="space-y-6">
                {/* Header Strip */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D]">
                            {t('certificates_issued_total')}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            {locale === 'ar'
                                ? `إجمالي الشهادات الرقمية الصادرة المعتمدة: ${certificates.total} شهادة.`
                                : `Total officially issued digital certificates: ${certificates.total}.`}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href={route('admin.reports.export', { type: 'certificates' })}
                            className="px-4 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-2 shrink-0"
                        >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-[#D6A84F]" />
                            <span>{locale === 'ar' ? 'تصدير التقرير (CSV)' : 'Export CSV Ledger'}</span>
                        </a>
                    </div>
                </div>

                {/* Table */}
                {certificates.data.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                        <Award className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="font-bold text-slate-800 text-base">
                            {locale === 'ar' ? 'لا توجد شهادات صادرة حالياً' : 'No Certificates Issued'}
                        </h3>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'رقم الشهادة' : 'Serial No.'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'الطالب المستلم' : 'Student Recipient'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'المقرر المعتمد' : 'Course Completed'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'الدرجة' : 'Score'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'تاريخ المنح' : 'Issue Date'}</th>
                                        <th className="py-3 px-4">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                                        <th className="py-3 px-4 text-right">{locale === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {certificates.data.map((cert) => (
                                        <tr key={cert.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-4 font-mono font-bold text-xs text-[#17365D]">
                                                {cert.certificate_number}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-slate-900">
                                                    {cert.student_name}
                                                </div>
                                                <span className="text-[11px] text-slate-400">
                                                    {cert.user?.email}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 font-semibold text-slate-800 text-xs">
                                                {locale === 'ar' ? cert.course_title_ar : cert.course_title_en}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-emerald-700 text-xs">
                                                {cert.score_percentage}%
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-600">
                                                {cert.issue_date}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {cert.is_revoked ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                                                        <XCircle className="w-3 h-3" />
                                                        <span>{locale === 'ar' ? 'ملغاة' : 'Revoked'}</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        <span>{locale === 'ar' ? 'معتمدة وسارية' : 'Valid'}</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Download Language Options */}
                                                    <div className="flex items-center gap-1">
                                                        <a
                                                            href={route('certificates.download', { certificate: cert.id, lang: 'ar' })}
                                                            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-colors border border-emerald-200/80 flex items-center gap-1"
                                                            title={locale === 'ar' ? 'تحميل الشهادة باللغة العربية' : 'Download Arabic PDF'}
                                                        >
                                                            <Download className="w-3 h-3 text-emerald-600" />
                                                            <span>عربي</span>
                                                        </a>
                                                        <a
                                                            href={route('certificates.download', { certificate: cert.id, lang: 'en' })}
                                                            className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#17365D] text-[11px] font-bold transition-colors border border-blue-200/80 flex items-center gap-1"
                                                            title={locale === 'ar' ? 'تحميل الشهادة باللغة الإنجليزية' : 'Download English PDF'}
                                                        >
                                                            <Download className="w-3 h-3 text-[#2563A6]" />
                                                            <span>EN</span>
                                                        </a>
                                                    </div>

                                                    <Link
                                                        href={route('verify.show', { code: cert.public_code })}
                                                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563A6] transition-colors"
                                                        title={locale === 'ar' ? 'فحص الشهادة' : 'Public Verify'}
                                                    >
                                                        <QrCode className="w-3.5 h-3.5" />
                                                    </Link>

                                                    {!cert.is_revoked && (
                                                        <button
                                                            onClick={() => setRevokingCert(cert)}
                                                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                                            title={locale === 'ar' ? 'إلغاء الشهادة' : 'Revoke Certificate'}
                                                        >
                                                            <AlertTriangle className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Revoke Certificate Modal */}
                {revokingCert && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-scaleUp">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                                <AlertTriangle className="w-6 h-6" />
                            </div>

                            <div className="text-center space-y-1">
                                <h3 className="text-lg font-bold text-slate-900">
                                    {locale === 'ar' ? 'إلغاء وسحب شهادة رسمية' : 'Revoke Issued Certificate'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {locale === 'ar' ? 'الشهادة رقم: ' : 'Serial: '}
                                    <strong className="font-mono text-slate-800">{revokingCert.certificate_number}</strong>
                                    <br />
                                    {locale === 'ar' ? 'للطالب: ' : 'Student: '}
                                    <strong className="text-slate-800">{revokingCert.student_name}</strong>
                                </p>
                            </div>

                            <form onSubmit={handleRevokeSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        {locale === 'ar' ? 'سبب الإلغاء الإداري *' : 'Revocation Reason *'}
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={revokeForm.data.reason}
                                        onChange={(e) => revokeForm.setData('reason', e.target.value)}
                                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                                        placeholder={locale === 'ar' ? 'اكتب سبب الإلغاء التنظيمي أو الأكاديمي...' : 'Enter formal justification...'}
                                    ></textarea>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setRevokingCert(null)}
                                        className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                                    >
                                        {locale === 'ar' ? 'تراجع' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={revokeForm.processing}
                                        className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-md"
                                    >
                                        {revokeForm.processing
                                            ? (locale === 'ar' ? 'جاري الإلغاء...' : 'Revoking...')
                                            : (locale === 'ar' ? 'تأكيد الإلغاء' : 'Confirm Revoke')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
