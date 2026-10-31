import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { useTranslation } from '@/lib/i18n';
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Search,
    Award,
    Calendar,
    User,
    BookOpen,
    FileCheck,
    QrCode,
    FileDown,
    Building2,
    HelpCircle,
    Lock
} from 'lucide-react';

interface CertificateData {
    public_code: string;
    certificate_number: string;
    student_name: string;
    course_title_en: string;
    course_title_ar: string;
    score_percentage: number;
    issue_date: string;
    is_revoked: boolean;
    revocation_reason?: string;
}

interface Props {
    initialQuery?: string;
    status?: 'valid' | 'revoked' | 'not_found' | null;
    certificate?: CertificateData | null;
}

export default function CertificateVerify({ initialQuery = '', status, certificate }: Props) {
    const { t, locale, isRtl } = useTranslation();
    const [query, setQuery] = useState(initialQuery);
    const [searching, setSearching] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setSearching(true);
        router.get(route('verify.show', { code: query.trim() }), {}, {
            preserveState: false,
            onFinish: () => setSearching(false),
        });
    };

    return (
        <div className="min-h-screen bg-[#F7F9FC] text-[#1E293B] flex flex-col font-sans">
            <Head title={locale === 'ar' ? 'التحقق من الشهادات الأكاديمية - SUCED' : 'Verify Certificate - SUCED'} />

            {/* Public Navigation */}
            <Navbar />

            {/* Header Hero Section */}
            <section className="bg-gradient-to-b from-[#17365D] to-[#122A48] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-[#D6A84F]">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-[#D6A84F] text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
                        <ShieldCheck className="w-4 h-4 text-[#D6A84F]" />
                        <span>{locale === 'ar' ? 'بوابة التحقق الرسمية' : 'Official Verification Portal'}</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {locale === 'ar' ? 'التحقق من صحة الشهادات والشهادات المعتمدة' : 'Verify Academic Credentials & Certificates'}
                    </h1>

                    <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        {locale === 'ar'
                            ? 'نظام التحقق الإلكتروني المباشر لمركز التعليم المستمر وتطوير القدرات بجامعة سوهاج. تأكد من صحة الشهادات الصادرة عبر الرمز التسلسلي أو كود QR.'
                            : 'Direct electronic verification system for Sohag University Center for Continuing Education Development (SUCED). Confirm credential authenticity via serial code or QR hash.'}
                    </p>

                    {/* Search Bar Form */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto pt-4">
                        <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white rounded-2xl shadow-xl border border-slate-200">
                            <div className="flex items-center gap-2 flex-1 px-3 w-full">
                                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={
                                        locale === 'ar'
                                            ? 'أدخل رقم الشهادة أو الرمز العام (مثال: SUCED-2025-AI-101)...'
                                            : 'Enter Certificate Number or UUID (e.g., SUCED-2025-AI-101)...'
                                    }
                                    className="w-full text-slate-800 placeholder-slate-400 text-sm focus:outline-none py-2.5 bg-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={searching}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2563A6] hover:bg-[#17365D] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shrink-0 shadow-md"
                            >
                                <Search className="w-4 h-4" />
                                <span>{searching ? (locale === 'ar' ? 'جاري الفحص...' : 'Verifying...') : (locale === 'ar' ? 'فحص السجل' : 'Verify Now')}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Results or Empty State */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {status === 'valid' && certificate && (
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-500 overflow-hidden animate-fadeIn">
                        {/* Status Banner */}
                        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-emerald-900 text-base">
                                            {locale === 'ar' ? 'شهادة رسمية معتمدة وموثقة' : 'Authentic & Valid Credential'}
                                        </span>
                                        <span className="px-2 py-0.5 text-[11px] font-bold uppercase rounded-full bg-emerald-200 text-emerald-800">
                                            {locale === 'ar' ? 'سارية' : 'Active'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-emerald-700">
                                        {locale === 'ar'
                                            ? 'هذا السجل مطابق لقاعدة بيانات جامعة سوهاج - التعليم المستمر'
                                            : 'This record matches the official registry at Sohag University Continuing Education.'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                                    {locale === 'ar' ? 'رقم الشهادة' : 'Serial Number'}
                                </span>
                                <span className="font-mono font-bold text-slate-800 text-sm">
                                    {certificate.certificate_number}
                                </span>
                            </div>
                        </div>

                        {/* Certificate Snapshot Card */}
                        <div className="p-6 sm:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Student Name */}
                                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 rounded-lg bg-[#17365D]/10 text-[#17365D] flex items-center justify-center shrink-0">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                                            {locale === 'ar' ? 'اسم الطالب / الخريج' : 'Recipient Name'}
                                        </span>
                                        <span className="text-base font-bold text-slate-900 mt-0.5 block">
                                            {certificate.student_name}
                                        </span>
                                    </div>
                                </div>

                                {/* Course Title */}
                                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 rounded-lg bg-[#2563A6]/10 text-[#2563A6] flex items-center justify-center shrink-0">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                                            {locale === 'ar' ? 'اسم الدورة / البرنامج التدريبي' : 'Course Completed'}
                                        </span>
                                        <span className="text-base font-bold text-slate-900 mt-0.5 block">
                                            {locale === 'ar' ? certificate.course_title_ar : certificate.course_title_en}
                                        </span>
                                    </div>
                                </div>

                                {/* Issue Date */}
                                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 rounded-lg bg-[#D6A84F]/15 text-[#9E7317] flex items-center justify-center shrink-0">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                                            {locale === 'ar' ? 'تاريخ المنح والاعتماد' : 'Date of Issuance'}
                                        </span>
                                        <span className="text-base font-bold text-slate-900 mt-0.5 block">
                                            {certificate.issue_date}
                                        </span>
                                    </div>
                                </div>

                                {/* Grade / Score */}
                                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                                            {locale === 'ar' ? 'الدرجة والتقييم النهائي' : 'Final Grade / Mastery Score'}
                                        </span>
                                        <span className="text-base font-bold text-emerald-700 mt-0.5 block">
                                            {certificate.score_percentage}% — {locale === 'ar' ? 'ناجح بمعايير الامتياز' : 'Passed with Honors'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Footer inside card */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-amber-50/50 border border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#17365D] text-white flex items-center justify-center font-bold text-sm">
                                        S
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        <span className="font-bold text-slate-800 block">
                                            {locale === 'ar' ? 'جامعة سوهاج - التعليم المستمر والتطوير' : 'Sohag University • SUCED Credential Registry'}
                                        </span>
                                        <span>
                                            {locale === 'ar' ? 'كود التحقق الرقمي: ' : 'Cryptographic Hash: '}
                                            <code className="text-xs text-slate-700 font-mono font-semibold">{certificate.public_code}</code>
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                                        <QrCode className="w-4 h-4 text-[#2563A6]" />
                                        <span>{locale === 'ar' ? 'رمز QR مفحوص' : 'QR Verified'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'revoked' && certificate && (
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-red-500 overflow-hidden animate-fadeIn">
                        <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                                <XCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-red-900 text-base">
                                    {locale === 'ar' ? 'شهادة ملغاة أو مسحوبة' : 'Revoked Certificate'}
                                </h3>
                                <p className="text-xs text-red-700">
                                    {locale === 'ar'
                                        ? 'تم إلغاء هذه الشهادة من قِبل إدارة مركز التعليم المستمر ولم تعد صالحة للاستخدام.'
                                        : 'This certificate was revoked by the Continuing Education Administration and is no longer valid.'}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="p-4 rounded-xl bg-red-50/50 border border-red-200">
                                <span className="text-xs font-semibold text-red-800 uppercase block">
                                    {locale === 'ar' ? 'سبب الإلغاء الإداري' : 'Revocation Reason'}
                                </span>
                                <p className="text-sm font-semibold text-red-950 mt-1">
                                    {certificate.revocation_reason || (locale === 'ar' ? 'مراجعة إدارية تنظيمية' : 'Administrative audit')}
                                </p>
                            </div>
                            <div className="text-xs text-slate-500">
                                {locale === 'ar' ? 'رقم الشهادة المفحوصة: ' : 'Audited Serial: '}
                                <span className="font-mono font-bold text-slate-800">{certificate.certificate_number}</span>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'not_found' && (
                    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 text-center space-y-4 animate-fadeIn">
                        <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                            {locale === 'ar' ? 'لم يتم العثور على شهادة بهذا الرقم' : 'No Matching Certificate Found'}
                        </h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                            {locale === 'ar'
                                ? `لم نتمكن من العثور على أي شهادة مسجلة برقم "${initialQuery}". يرجى التحقق من صحة الرقم المكتوب أو مسح رمز QR مباشرة.`
                                : `We could not locate any credential registered under "${initialQuery}". Please check the serial code formatting or scan the QR code directly.`}
                        </p>
                        <div className="pt-2">
                            <button
                                onClick={() => setQuery('')}
                                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                            >
                                {locale === 'ar' ? 'إعادة المحاولة برقم آخر' : 'Try Another Search'}
                            </button>
                        </div>
                    </div>
                )}

                {!status && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-[#17365D]/10 text-[#17365D] flex items-center justify-center">
                                <QrCode className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm">
                                {locale === 'ar' ? 'فحص سريع عبر QR' : 'Instant QR Verification'}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                {locale === 'ar'
                                    ? 'كل شهادة ورقية أو إلكترونية صادرة تحتوي على كود QR فريد يوجه مباشرة إلى هذه الصفحة الرسمية.'
                                    : 'Every physical or PDF certificate contains a unique QR code directing straight to its authoritative record.'}
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-[#2563A6]/10 text-[#2563A6] flex items-center justify-center">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm">
                                {locale === 'ar' ? 'حماية من التزوير' : 'Tamper-Proof Ledger'}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                {locale === 'ar'
                                    ? 'يتم تشفير وتوليد الأرقام التسلسلية من خلال خوادم جامعة سوهاج لضمان أقصى درجات المصداقية.'
                                    : 'Serial numbers and student snapshots are permanently logged in Sohag University database to prevent falsification.'}
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-[#D6A84F]/15 text-[#9E7317] flex items-center justify-center">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm">
                                {locale === 'ar' ? 'اعتماد مؤسسي' : 'Institutional Standard'}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                {locale === 'ar'
                                    ? 'تقبل هذه الشهادات لدى جهات التوظيف والمؤسسات الأكاديمية كإثبات رسمي لاجتياز الساعات المعتمدة.'
                                    : 'Recognized by employers and academic bodies as formal proof of continuing professional education hours.'}
                            </p>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
