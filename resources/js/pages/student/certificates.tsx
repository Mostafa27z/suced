import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import {
    Award,
    Download,
    QrCode,
    Calendar,
    BookOpen,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    GraduationCap
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
    course?: {
        slug: string;
        code: string;
    };
}

interface Props {
    certificates: CertificateItem[];
}

export default function StudentCertificates({ certificates }: Props) {
    const { t, locale, isRtl } = useTranslation();

    return (
        <AuthenticatedLayout
            title={locale === 'ar' ? 'شهاداتي الأكاديمية' : 'My Certificates'}
            breadcrumb={locale === 'ar' ? 'سجل المؤهلات الرقمية' : 'Verified Credentials'}
        >
            <Head title={locale === 'ar' ? 'شهاداتي الأكاديمية - SUCED' : 'My Certificates - SUCED'} />

            <div className="space-y-6">
                {/* Header Strip */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D]">
                            {locale === 'ar' ? 'سجل الشهادات الأكاديمية المعتمدة' : 'Official Academic Certificates Ledger'}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            {locale === 'ar'
                                ? 'جميع الشهادات الصادرة موثقة ومعتمدة رسمياً ومحمية برمز استجابة سريعة QR ورقم تسلسلي موثق.'
                                : 'All credentials are cryptographic digital assets verified by Sohag University Continuing Education.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('verify.show')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                        >
                            <QrCode className="w-4 h-4 text-[#2563A6]" />
                            <span>{locale === 'ar' ? 'فحص شهادة عامة' : 'Public Verification'}</span>
                        </Link>
                    </div>
                </div>

                {/* Certificates Grid */}
                {certificates.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-[#D6A84F]/15 text-[#9E7317] flex items-center justify-center mx-auto">
                            <Award className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-base">
                            {locale === 'ar' ? 'لم تحصل على أي شهادة حتى الآن' : 'No Certificates Earned Yet'}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                            {locale === 'ar'
                                ? 'للحصول على شهادة معتمدة، يجب إتمام مشاهدة جميع محاضرات الدورة واجتياز الاختبار النهائي بنسبة لا تقل عن 70%.'
                                : 'To receive a verified certificate, complete all course lectures and pass the final exam at >= 70%.'}
                        </p>
                        <Link
                            href={route('student.courses')}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-semibold transition-colors shadow-sm"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>{locale === 'ar' ? 'متابعة مقرراتي' : 'Continue My Courses'}</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {certificates.map((cert) => (
                            <div
                                key={cert.id}
                                className={`rounded-2xl bg-white border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5 relative overflow-hidden ${
                                    cert.is_revoked ? 'border-red-300' : 'border-amber-200'
                                }`}
                            >
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#17365D] via-[#D6A84F] to-[#2563A6]"></div>

                                <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-9 h-9 rounded-xl bg-[#D6A84F]/15 text-[#9E7317] flex items-center justify-center font-bold">
                                                <Award className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                    {locale === 'ar' ? 'شهادة إتمام معتمدة' : 'Verified Completion'}
                                                </span>
                                                <h3 className="font-bold text-[#17365D] text-base leading-tight mt-0.5">
                                                    {locale === 'ar' ? cert.course_title_ar : cert.course_title_en}
                                                </h3>
                                            </div>
                                        </div>

                                        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                            {cert.score_percentage}%
                                        </span>
                                    </div>

                                    {cert.is_revoked && (
                                        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                                            {locale === 'ar' ? 'تم إلغاء هذه الشهادة: ' : 'Revoked: '}
                                            {cert.revocation_reason}
                                        </div>
                                    )}

                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">{locale === 'ar' ? 'رقم الشهادة:' : 'Serial No:'}</span>
                                            <span className="font-mono font-bold text-slate-800">{cert.certificate_number}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">{locale === 'ar' ? 'تاريخ المنح:' : 'Issue Date:'}</span>
                                            <span className="font-semibold text-slate-700">{cert.issue_date}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">{locale === 'ar' ? 'اسم المستلم:' : 'Recipient:'}</span>
                                            <span className="font-semibold text-slate-700">{cert.student_name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <div className="grid grid-cols-2 gap-2">
                                        <a
                                            href={route('certificates.download', { certificate: cert.id, lang: 'ar' })}
                                            className="py-2.5 px-3 rounded-xl bg-[#17365D] hover:bg-[#2563A6] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm text-center"
                                            title={locale === 'ar' ? 'تحميل الشهادة باللغة العربية فقط' : 'Download in Arabic (AR)'}
                                        >
                                            <Download className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                            <span>{locale === 'ar' ? 'شهادة بالعربية' : 'Arabic PDF'}</span>
                                        </a>

                                        <a
                                            href={route('certificates.download', { certificate: cert.id, lang: 'en' })}
                                            className="py-2.5 px-3 rounded-xl bg-[#2563A6] hover:bg-[#17365D] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm text-center"
                                            title={locale === 'ar' ? 'تحميل الشهادة باللغة الإنجليزية فقط' : 'Download in English (EN)'}
                                        >
                                            <Download className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                                            <span>{locale === 'ar' ? 'شهادة بالإنجليزية' : 'English PDF'}</span>
                                        </a>
                                    </div>

                                    <Link
                                        href={route('verify.show', { code: cert.public_code })}
                                        className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                                        title={locale === 'ar' ? 'التحقق الإلكتروني من صحة الشهادة' : 'Public Digital Verification'}
                                    >
                                        <QrCode className="w-3.5 h-3.5 text-[#2563A6]" />
                                        <span>{locale === 'ar' ? 'التحقق الإلكتروني من الشهادة' : 'Verify Certificate Record'}</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
